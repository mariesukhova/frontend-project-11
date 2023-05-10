/* eslint-disable no-param-reassign */
import _ from 'lodash';

function addElement(source) {
  const id = _.uniqueId();
  const title = source.querySelector('title').textContent;
  const description = source.querySelector('description').textContent;
  const link = source.querySelector('link').textContent;

  return {
    id, title, description, link,
  };
}

export default function parser(htmlString) {
  const parse = new DOMParser();
  const parsedHtml = parse.parseFromString(htmlString, 'text/xml');
  const rootElement = parsedHtml.documentElement;

  if (rootElement.tagName === 'rss') {
    const data = {
      feeds: {},
      posts: [],
    };

    const newFeed = addElement(parsedHtml);
    data.feeds = newFeed;

    const posts = parsedHtml.querySelectorAll('item');
    posts.forEach((post) => {
      const newPost = addElement(post);
      newPost.feedId = data.feeds.id;

      data.posts.push(newPost);
    });

    return data;
  } throw new Error('ParserError');
}
