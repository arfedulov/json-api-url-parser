import assert from 'assert';
import { pick, some } from 'lodash';

import { parseJsonApiUrl } from '..';

test('parseJsonApiUrl(): parse url params', () => {
  const INPUT = 'https://abc.com/articles/12345/relationships/author';
  const EXPECT = {
    resourceType: 'articles',
    resourceId: '12345',
    relationshipType: 'author',
  };

  const actual = pick(parseJsonApiUrl(INPUT), [ 'resourceType', 'resourceId', 'relationshipType' ]);

  assert.deepEqual(actual, EXPECT);
});

test('parseJsonApiUrl(): parse pagination query params', () => {
  const INPUT = 'https://abc.com/articles?page[number]=15&page[size]=10';
  const EXPECT = {
    pageNumber: 15,
    pageSize: 10,
  };

  const actual = pick(parseJsonApiUrl(INPUT), [ 'pageNumber', 'pageSize' ]);

  assert.deepEqual(actual, EXPECT);
});

test('parseJsonApiUrl(): parse filtering query params', () => {
  const INPUT = encodeURI('https://abc.com/articles?filter[title]=hello world&filter[createdAt]=>1234567890');
  const EXPECT = {
    filters: [
      {
        fieldName: 'title',
        predicateString: 'hello world',
      },
      {
        fieldName: 'createdAt',
        predicateString: '>1234567890',
      },
    ],
  };

  const actual = pick(parseJsonApiUrl(INPUT), [ 'filters' ]);

  assert.strictEqual(actual.filters && actual.filters.length, EXPECT.filters.length);
  EXPECT.filters.forEach((filter) => {
    assert(some(
      actual.filters,
      (f) => f.fieldName === filter.fieldName && f.predicateString === filter.predicateString
    ), `testing fieldName: ${ filter.fieldName }`);
  });
});

test('parseJsonApiUrl(): parse sorting query params', () => {
  const INPUT = encodeURI('https://abc.com/articles?sort=-createdAt,title');
  const EXPECT = {
    sort: [
      {
        fieldName: 'createdAt',
        order: '-',
      },
      {
        fieldName: 'title',
        order: '+',
      },
    ],
  };

  const actual = pick(parseJsonApiUrl(INPUT), [ 'sort' ]);

  assert.deepEqual(actual, EXPECT);
});
