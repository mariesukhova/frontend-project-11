import onChange from 'on-change';

function renderTextInput(watchedState, elements, i18nInstance) {
  const feedback = document.querySelector('.feedback');
  const textInput = document.querySelector('.rss-form #url-input');

  if (feedback) {
    feedback.remove();
  }

  const p = document.createElement('p');
  p.classList.add('feedback', 'm-0', 'position-absolute', 'small');
  const feedbackSibling = document.querySelector('.text-muted');
  feedbackSibling.after(p);

  if (watchedState.status === 'valid') {
    textInput.classList.remove('is-invalid');
    p.classList.add('text-success');
    p.textContent = i18nInstance.t('success');
    textInput.value = '';
    textInput.focus();
  } else {
    textInput.classList.add('is-invalid');
    p.classList.add('text-danger');

    switch (watchedState.error) {
      case 'alreadyExists':
        p.textContent = i18nInstance.t('error.alreadyExists');
        break;
      case 'empty':
        p.textContent = i18nInstance.t('error.empty');
        break;
      case 'notValid':
        p.textContent = i18nInstance.t('error.notValid');
        break;
      case 'Network Error':
        p.textContent = i18nInstance.t('error.network');
        break;
      case 'ParserError':
        p.textContent = i18nInstance.t('error.notRss');
        break;
      default:
        p.textContent = i18nInstance.t('error.unknown');
        break;
    }
  }
}

function renderFeeds(watchedState, elements) {
  if (!document.querySelector('.list-group-feeds')) {
    const divBorder = document.createElement('div');
    divBorder.classList.add('card', 'border-0');
    elements.feeds.prepend(divBorder);

    const divCardBody = document.createElement('div');
    divCardBody.classList.add('card-body');
    divBorder.prepend(divCardBody);

    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = 'Фиды';
    divCardBody.prepend(h2);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0', 'list-group-feeds');
    divBorder.append(ul);
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
  if (!document.querySelector('.list-group-posts')) {
    const divBorder = document.createElement('div');
    divBorder.classList.add('card', 'border-0');
    elements.posts.prepend(divBorder);

    const divCardBody = document.createElement('div');
    divCardBody.classList.add('card-body');
    divBorder.prepend(divCardBody);

    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = 'Посты';
    divCardBody.prepend(h2);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0', 'list-group-posts');
    divBorder.append(ul);
  }

  const ul = document.querySelector('.list-group-posts');
  const lis = watchedState.posts.map((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const link = document.createElement('a');
    link.classList.add('fw-bold');
    link.setAttribute('href', post.postLink);
    link.setAttribute('data-id', post.postId);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.textContent = post.postTitle;
    li.append(link);

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn btn-outline-primary btn-sm');
    button.setAttribute('data-id', post.postId);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';
    li.append(button);
    return li;
  });

  ul.replaceChildren(...lis);
}

function renderModal(watchedState) {
  const dataId = watchedState.openModal;
  const relatedPost = watchedState.posts.filter((post) => post.postId === dataId)[0];
  const { postTitle, postDescription, postLink } = relatedPost;
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = postTitle;
  const modalBody = document.querySelector('.modal-body');
  modalBody.textContent = postDescription;
  const readFully = document.querySelector('.full-article');
  readFully.setAttribute('href', postLink);
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
        renderTextInput(watchedState, elements, i18nInst);
        break;
      case 'error':
        renderTextInput(watchedState, elements, i18nInst);
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
