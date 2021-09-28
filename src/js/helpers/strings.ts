import { getStoreCurrencySymbol } from './store';

export function sanitize(str = '') {
  return str.replace(/\n/g, ' ');
}

export function kebabCase(text: string = '') {
  if (!text) {
    return '';
  }

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    ?.join('-');
}

export function sanitizeCurrency(str: string) {
  const value = +(str || '').replace(getStoreCurrencySymbol(), '').trim().replace(/\./g, '').replace(/\,/, '.');

  if (isNaN(value)) {
    return 0;
  }

  return value;
}
