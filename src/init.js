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
    .then((response) => {
      if (response.data.status.http_code !== 200) throw new Error('tooManyRequests');
      return parser(response.data.contents);
    })
    .catch((e) => {
      throw e;
    });
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

  const elements = {
    textInput: document.querySelector('.rss-form #url-input'),
    rssForm: document.querySelector('.rss-form'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const state = {
    status: '',
    error: '',
    links: [],
    feeds: [],
    posts: [],
  };

  const watchedState = generateWatchedState(state, elements, i18nInstance);

  function handleError(error) {
    switch (error.name) {
      case 'ValidationError':
        watchedState.error = error.message;
        watchedState.status = 'in-valid';
        break;
      case 'AxiosError':
        watchedState.error = error.message;
        watchedState.status = 'failed';
        break;
      case 'Error':
        watchedState.error = error.message;
        watchedState.status = 'failed';
        break;
      default:
        watchedState.error = 'unknownError';
        watchedState.status = 'failed';
    }
  }

  elements.rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = e.target.url.value;
    const schema = yup.string().required().url().notOneOf(watchedState.links);
    schema.validate(formData)
      .then(() => loadData(formData, watchedState)
        .then((data) => {
          watchedState.status = '';
          watchedState.status = 'valid';
          watchedState.links.push(formData);
          watchedState.feeds.unshift(data.feeds);
          data.posts.forEach((post) => {
            watchedState.posts.push(post);
          });
        }))
      .catch((error) => {
        console.log(error);
        handleError(error);
      });
  });
};
export default app;
