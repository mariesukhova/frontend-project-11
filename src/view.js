/* eslint-disable no-param-reassign */
import onChange from 'on-change';

function renderError(state, parent, i18nInstance) {
  switch (state.error) {
    case 'alreadyExists':
      parent.textContent = i18nInstance.t('error.alreadyExists');
      break;
    case 'empty':
      parent.textContent = i18nInstance.t('error.empty');
      break;
    case 'notValid':
      parent.textContent = i18nInstance.t('error.notValid');
      break;
    case 'Network Error':
      parent.textContent = i18nInstance.t('error.network');
      break;
    case 'ParserError':
      parent.textContent = i18nInstance.t('error.notRss');
      break;
    default:
      parent.textContent = i18nInstance.t('error.unknown');
      break;
  }
}

function createUl(name, elements) {
  const divBorder = document.createElement('div');
  divBorder.classList.add('card', 'border-0');
  elements[name].prepend(divBorder);

  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');
  divBorder.prepend(divCardBody);

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  if (name === 'feeds') {
    h2.textContent = 'Фиды';
  } else h2.textContent = 'Посты';
  divCardBody.prepend(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0', `list-group-${name}`);
  divBorder.append(ul);
}

function createPost(post) {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.setAttribute('href', post.link);
  link.setAttribute('data-id', post.id);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = post.title;
  li.append(link);

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('class', 'btn btn-outline-primary btn-sm');
  button.setAttribute('data-id', post.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Просмотр';
  li.append(button);
  return li;
}

function renderTextInput(watchedState, i18nInstance) {
  const feedback = document.querySelector('.feedback');
  const textInput = document.querySelector('.rss-form #url-input');

  if (feedback) { feedback.remove(); }

  const currentFeedBack = document.createElement('p');
  currentFeedBack.classList.add('feedback', 'm-0', 'position-absolute', 'small');
  const feedbackSibling = document.querySelector('.text-muted');
  feedbackSibling.after(currentFeedBack);

  if (watchedState.status === 'valid') {
    textInput.classList.remove('is-invalid');
    currentFeedBack.classList.add('text-success');
    currentFeedBack.textContent = i18nInstance.t('success');
    textInput.value = '';
    textInput.focus();
  } else {
    textInput.classList.add('is-invalid');
    currentFeedBack.classList.add('text-danger');

    renderError(watchedState, currentFeedBack, i18nInstance);
  }
}

function renderFeeds(watchedState, elements) {
  if (!document.querySelector('.list-group-feeds')) {
    createUl('feeds', elements);
  }

  const ul = document.querySelector('.list-group-feeds');
  ul.replaceChildren();

  watchedState.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    ul.append(li);
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    li.append(h3);

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(p);
  });
}

function renderPosts(watchedState, elements) {
  if (!document.querySelector('.list-group-feeds')) {
    createUl('feeds', elements);
  }

  if (!document.querySelector('.list-group-posts')) {
    createUl('posts', elements);
  }

  const ul = document.querySelector('.list-group-posts');
  const lis = watchedState.posts.map((post) => createPost(post));

  ul.replaceChildren(...lis);
}

function renderModal(watchedState) {
  const dataId = watchedState.openModal;
  const relatedPost = watchedState.posts.filter((post) => post.id === dataId)[0];
  const { title, description, link } = relatedPost;
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = title;
  const modalBody = document.querySelector('.modal-body');
  modalBody.textContent = description;
  const readFully = document.querySelector('.full-article');
  readFully.setAttribute('href', link);
}

function renderOpenedPosts(watchedState) {
  watchedState.openedPosts.forEach((dataId) => {
    const post = document.querySelector(`[data-id='${dataId}']`);
    post.classList.remove('fw-bold');
    post.classList.add('fw-normal');
  });
}

export default function generateWatchedState(state, elements, i18nInst) {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'status':
        renderTextInput(watchedState, i18nInst);
        break;
      case 'error':
        renderTextInput(watchedState, i18nInst);
        break;
      case 'feeds': renderFeeds(watchedState, elements);
        break;
      case 'posts': renderPosts(watchedState, elements);
        break;
      case 'openModal': renderModal(watchedState);
        break;
      case 'openedPosts': renderOpenedPosts(watchedState);
        break;
      default:
    }
  });

  return watchedState;
}
