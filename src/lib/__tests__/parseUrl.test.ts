import assert from 'assert';

import { parseUrl } from '../parseUrl';

test('testUrl(): produce object that includes parsed query string', () => {
  const INPUT = 'https://abc.com/articles/?sort=-created,title&filter[author]=ivan&page[number]=5&page[size]=10';
  const EXPECT = {
    query: {
      'sort': '-created,title',
      'filter[author]': 'ivan',
      'page[number]': '5',
      'page[size]': '10',
    },
  };

  const actual = { query: parseUrl(INPUT).query };

  assert.deepEqual(actual, EXPECT);
});

test('testUrl(): produce object that includes path in `pathname` field', () => {
  const INPUT = 'https://abc.com/articles/12345/relationships/author/';
  const EXPECT = {
    pathname: '/articles/12345/relationships/author/',
  };

  const actual = { pathname: parseUrl(INPUT).pathname };

  assert.deepEqual(actual, EXPECT);
});

test('testUrl(): propduced query string params are url decoded', () => {
  const INPUT = encodeURI('https://abc.com/articles/?sort=-created,title&filter[author]=ivan&page[number]=5&page[size]=10');
  const EXPECT = {
    query: {
      'sort': '-created,title',
      'filter[author]': 'ivan',
      'page[number]': '5',
      'page[size]': '10',
    },
  };

  const actual = { query: parseUrl(INPUT).query };

  assert.deepEqual(actual, EXPECT);
});
