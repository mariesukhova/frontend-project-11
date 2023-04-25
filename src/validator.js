import * as yup from 'yup';

export default function validator(target, list) {
  const schema = yup.string().required().url().notOneOf(list);

  return schema.isValid(target);
}
