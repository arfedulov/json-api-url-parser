import { parseUrl } from './lib/parseUrl';

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

const PATH_NAME_REGEX = /\/(\w+)(\/(\w+)(\/relationships\/(\w+))?)?/;

const groupIndexes = {
  resourceType: 1,
  resourceId: 3,
  relationshipType: 5,
};

interface PaginationParams {
  pageSize?: number;
  pageNumber?: number;
}

interface QueryObject {
  [key: string]: string;
}

const parsePaginationQueries = (query: QueryObject): PaginationParams => {
  const result: PaginationParams = {};
  Object.keys(query).forEach((key) => {
    if (!key.startsWith('page[')) {
      return;
    }
    switch (key) {
      case 'page[size]': {
        result.pageSize = +query[key];
        break;
      }
      case 'page[number]': {
        result.pageNumber = +query[key];
        break;
      }
      default:
        break;
    }
  });

  return result;
};

const parseFilteringQueries = (query: QueryObject): Filter[] | undefined => {
  const result: Filter[] = [];
  Object.keys(query).forEach((key) => {
    if (!key.startsWith('filter[')) {
      return;
    }
    const start = key.indexOf('[');
    const end = key.indexOf(']');
    if (start !== -1 && end !== -1 && end - start > 1) {
      result.push({
        fieldName: key.slice(start + 1, end),
        predicateString: query[key],
      });
    }
  });

  return result.length > 0 ? result : undefined;
};

const parseSortingQueries = (query: QueryObject): Sort[] | undefined => {
  const result: Sort[] = [];
  const fields = query.sort && query.sort.split(',');
  if (fields) {
    fields.forEach((field) => {
      const sortElement: Sort = {
        fieldName: field,
        order: '+',
      };
      if (field.startsWith('-')) {
        sortElement.fieldName = field.slice(1);
        sortElement.order = '-';
      }
      result.push(sortElement);
    });
  }

  return result.length > 0 ? result : undefined;
};

export const parseJsonApiUrl = (url: string): JsonApiUrlParams => {
  const { pathname, query } = parseUrl(url);

  let normPathname = pathname.startsWith('/') ? pathname : '/' + pathname;
  normPathname = (normPathname.length !== 1 && normPathname.endsWith('/')) ?
    normPathname.slice(0, normPathname.length - 1) : normPathname;

  const match = normPathname.match(PATH_NAME_REGEX);
  if (!match) {
    throw new Error(`Url ${ url } is not json:api url.`);
  }

  return {
    resourceType: match[groupIndexes.resourceType],
    resourceId: match[groupIndexes.resourceId],
    relationshipType: match[groupIndexes.relationshipType],
    filters: parseFilteringQueries(query),
    sort: parseSortingQueries(query),
    ...parsePaginationQueries(query),
  };
};
