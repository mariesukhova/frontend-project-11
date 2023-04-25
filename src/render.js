export default function renderTextInput(status) {
  const textInput = document.querySelector('.rss-form #url-input');
  const feedback = document.querySelector('.feedback');
  const feedbackSibling = document.querySelector('.text-muted');
  const p = document.createElement('p');
  p.classList.add('feedback', 'm-0', 'position-absolute', 'small');
  feedbackSibling.after(p);

  if (feedback) {
    feedback.remove();
  }
  if (status === 'valid') {
    textInput.classList.remove('is-invalid');
    p.classList.add('text-success');
    p.textContent = 'RSS успешно загружен';
    textInput.value = '';
    textInput.focus();
  } else {
    textInput.classList.add('is-invalid');
    p.classList.add('text-danger');
    p.textContent = 'Ссылка должна быть валидным URL';
  }
}
