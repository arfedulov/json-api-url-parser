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
  /** Predicate that returns true if the value pass the filter. */
  predicate: (fieldValue: any) => boolean;
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

export const parseJsonApiUrl = (url: string): JsonApiUrlParams => {
  const { pathname, query } = parseUrl(url);

  let normPathname = pathname.startsWith('/') ? pathname : '/' + pathname;
  normPathname = (normPathname.length !== 1 && normPathname.endsWith('/')) ?
    normPathname.slice(0, normPathname.length - 1) : normPathname;

  const match = normPathname.match(PATH_NAME_REGEX);
  if (!match) {
    throw new Error(`Url ${ url } is not json:api url.`);
  }

  const result = {} as JsonApiUrlParams;

  result.resourceType = match[groupIndexes.resourceType];
  result.resourceId = match[groupIndexes.resourceId];
  result.relationshipType = match[groupIndexes.relationshipType];

  return result;
};
