import onChange from 'on-change';

function renderTextInput(watchedState, elements, i18nInstance) {
  const feedback = document.querySelector('.feedback');
  const textInput = document.querySelector('.rss-form #url-input');
  console.log(feedback);
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

    if (watchedState.error.message === 'notValid') {
      p.textContent = i18nInstance.t('error.notValid');
    } else p.textContent = i18nInstance.t('error.alreadyExists');
  }
}

export default function generateWatchedState(state, elements, i18nInst) {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'status': renderTextInput(watchedState, elements, i18nInst);
        break;
      case 'error': renderTextInput(watchedState, elements, i18nInst);
        break;
      default:
    }
  });

  return watchedState;
}
