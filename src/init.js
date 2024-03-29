/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import parser from './parser.js';
import generateWatchedState from './view.js';
import resources from './locales/index.js';

function loadData(url) {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;
  return axios.get(proxyUrl)
    .then((response) => parser(response.data.contents))
    .catch((e) => {
      throw e;
    });
}

function checkUpdates(state) {
  if (state.links.length) {
    const currentPosts = state.posts;
    const result = {};
    state.links.forEach((li) => {
      loadData(li)
        .then((data) => {
          currentPosts.forEach((post) => {
            const { link } = post;
            result[link] = true;
          });
          data.posts.forEach((post) => {
            if (!result[post.link]) {
              state.posts.unshift(post);
            }
          });
        })
        .catch((error) => console.log(error));
    });
  }
  setTimeout(() => checkUpdates(state), 5000);
}

function handleError(error, state) {
  switch (error.name) {
    case 'ValidationError':
      state.error = error.message;
      state.status = 'in-valid';
      break;
    case 'AxiosError':
      state.error = error.message;
      state.status = 'failed';
      break;
    case 'Error':
      state.error = error.message;
      state.status = 'failed';
      break;
    default:
      state.error = 'unknownError';
      state.status = 'failed';
  }
}

function generateState() {
  return {
    status: '',
    error: '',
    links: [],
    feeds: [],
    posts: [],
    openModal: '',
    openedPosts: [],
  };
}

function findElements() {
  return {
    textInput: document.querySelector('.rss-form #url-input'),
    rssForm: document.querySelector('.rss-form'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };
}

const app = async () => {
  const i18nInstance = i18next.createInstance();

  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  yup.setLocale({
    mixed: {
      notOneOf: 'alreadyExists',
    },
    string: {
      required: 'empty',
      url: 'notValid',
    },
  });

  const elements = findElements();

  const state = generateState();

  const watchedState = generateWatchedState(state, elements, i18nInstance);

  elements.rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = e.target.url.value.trim();
    const schema = yup.string().required().url().notOneOf(watchedState.links);
    schema.validate(url)
      .then(() => loadData(url, watchedState))
      .then((data) => {
        watchedState.status = '';
        watchedState.status = 'valid';
        watchedState.links.unshift(url);
        watchedState.feeds.unshift(data.feeds);
        watchedState.posts.unshift(...data.posts);
      })
      .catch((error) => {
        handleError(error, watchedState);
      });
  });

  elements.posts.addEventListener('click', (e) => {
    const dataId = e.target.getAttribute('data-id');
    watchedState.openModal = dataId;
    watchedState.openedPosts.push(dataId);
  });

  checkUpdates(watchedState);
};
export default app;
