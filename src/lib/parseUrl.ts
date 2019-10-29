//@ts-ignore
import urlParse from 'url-parse';
import { parse as parseQs } from 'query-string';

export interface ParsedUrl {
  protocol: string;
  hash: string;
  query: { [key: string]: string };
  pathname: string;
  auth: string;
  host: string;
  port: string;
  hostname: string;
  password: string;
  username: string;
  origin: string;
  href: string;
}

export const parseUrl = (url: string): ParsedUrl => {
  const normUrl = url.indexOf('%') !== -1 ? decodeURI(url) : url;
  const parsed = urlParse(normUrl);

  return {
    ...parsed,
    query: parseQs(parsed.query),
  };
};
