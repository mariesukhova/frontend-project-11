import 'bootstrap';
import './styles.scss';
import onChange from 'on-change';
import renderTextInput from './render.js';
import validator from './validator.js';

function app() {
  const state = {
    status: '',
    links: [],
    fids: [],
    posts: [],
  };
  const rssForm = document.querySelector('.rss-form');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'status') {
      renderTextInput(value);
    }
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const formData = e.target.url.value;
    return validator(formData, watchedState.links)
      .then((isValid) => {
        if (isValid) {
          watchedState.status = '';
          watchedState.status = 'valid';
          watchedState.links.push(formData);
        } else watchedState.status = 'in-valid';
      });
  });
}
app();
