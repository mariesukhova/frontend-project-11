import _ from 'lodash';

export default function parser(htmlString) {
  const parse = new DOMParser();
  const parsedHtml = parse.parseFromString(htmlString, 'text/xml');
  const rootElement = parsedHtml.documentElement;

  if (rootElement.tagName === 'rss') {
    const title = parsedHtml.querySelector('title').textContent;
    const description = parsedHtml.querySelector('description').textContent;
    const link = parsedHtml.querySelector('link').textContent;
    const feedId = _.uniqueId();

    const data = {
      feeds: {},
      posts: [],
    };

    data.feeds = {
      title, description, link, feedId,
    };

    const posts = parsedHtml.querySelectorAll('item');
    posts.forEach((post) => {
      const postId = _.uniqueId();
      const postTitle = post.querySelector('title').textContent;
      const postDescription = post.querySelector('description').textContent;
      const postLink = post.querySelector('link').textContent;

      data.posts.push({
        postTitle, postDescription, postLink, postId, feedId,
      });
    });

    return data;
  } throw new Error('ParserError');
}
