import i18next from 'i18next';
import * as yup from 'yup';
import generateWatchedState from './view.js';
import resources from './locales/index.js';

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
  };

  const state = {
    status: '',
    error: '',
    links: [],
    fids: [],
    posts: [],
  };

  const watchedState = generateWatchedState(state, elements, i18nInstance);

  elements.rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = e.target.url.value;
    const schema = yup.string().required().url().notOneOf(watchedState.links);
    schema.validate(formData)
      .then(() => {
        watchedState.status = '';
        watchedState.status = 'valid';
        watchedState.links.push(formData);
      })
      .catch((error) => {
        watchedState.error = error;
        watchedState.status = 'in-valid';
      });
  });
};
export default app;
