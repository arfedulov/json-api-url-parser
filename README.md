# json-api-url-parser

Parse jsonapi complient urls [specs](https://jsonapi.org/format/).


```ts
import { parse } from '@arfedulov/json-api-url-parser';

/** Parsed url parameters ( including those from url query string ). */
export interface JsonApiUrlParams {
  resourceType: string;
  resourceId?: string;
  relationshipType?: string;
  pageNumber?: number;
  pageSize?: number;
  filters?: Filter[];
  sort?: Sort[];
}

export interface Filter {
  /** Field name to apply filtering to. */
  fieldName: string;
  /** A predicate expressed in textual form ( this module is unaware of semantics ). */
  predicateString: string;
}

export interface Sort {
  /** Field name to apply sorting to. */
  fieldName: string;
  /** Sorting order. */
  order: Order;
}

/**
 * Sorting order.
 *
 * `+` Means "ascending"
 * `-` Means "descending"
 */
export type Order = '+' | '-';

const parsed: JsonApiUrlParams = parse('https://abc.com/articles/12345/relationships/author?sort=-createdAt,title&page[number]=5&page[size]=10');

console.log(parsed);
/*
{ resourceType: 'articles',
  resourceId: '12345',
  relationshipType: 'author',
  filters: undefined,
  sort:
   [ { fieldName: 'createdAt', order: '-' },
     { fieldName: 'title', order: '+' } ],
  pageNumber: 5,
  pageSize: 10 }
*/
```
