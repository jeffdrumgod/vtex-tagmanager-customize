import Page from './page';
// variável para armazenar informações em memória dos dados necessários para atribuir em variáveis da página
const storeGlobals = {};

/**
 * Recupera uma informação em memória de dados da loja
 *
 * @param key
 * @param defaultValue
 * @returns
 */
export function getStoreGlobal<S, T>(key, defaultValue): T {
  if ({}.hasOwnProperty.call(storeGlobals, key)) {
    return storeGlobals[key];
  }
  return defaultValue;
}

/**
 * Adiciona uma informação em memória dos dados da loja
 *
 * @param key
 * @param data
 * @return void
 */
export function setStoreGlobal(key, data): void {
  storeGlobals[key] = data;
}

/**
 * Recupera informação da variável em memória se o cliente está autenticado ou não
 *
 * @returns string
 */
export function userLoggedStatus() {
  return !!getStoreGlobal('profile', false);
}

/**
 * Busca informações do cliente autenticado
 * @returns
 */
export async function getAsyncProfile() {
  try {
    const response = await fetch('/no-cache/profileSystem/getProfile', {
      credentials: 'include',
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'x-requested-with': 'XMLHttpRequest',
      },
      referrer: window.location.href,
      referrerPolicy: 'no-referrer-when-downgrade',
      body: null,
      method: 'GET',
      mode: 'cors',
    });

    if (response.status !== 200) {
      setStoreGlobal('profile', false);
      return false;
    }

    const onlineProfile = await response.json();
    if (!(onlineProfile || {}).IsUserDefined) {
      setStoreGlobal('profile', false);
      return false;
    }

    setStoreGlobal('profile', onlineProfile);

    // TODO: montar o type do onlineProfile
    return onlineProfile;
  } catch (e) {
    console.error();
  }
}

/**
 * Função utilizada no carregamento da página ara buscar informações pertinentes antes do carregamento do conteúdo
 * @returns true
 */
export async function mainAsyncPageView() {
  await getAsyncProfile();

  return true;
}

/**
 *
 * @returns string language code ISO-3166-1
 */
export function getPageLanguage() {
  return (window.localeInfo?.CultureCode || '').split('-').shift() || 'pt';
}

/**
 *
 * @returns string country code ISO-3166-1
 */
export function getPageCountry() {
  return (window.localeInfo?.CultureCode || '').split('-').pop().toLowerCase() || 'br';
}

/**
 *
 * @returns string currency iso symbol (aka BRL)
 */
export function getStoreIsoCurrencySymbol() {
  return ((window.localeInfo || {}).CurrencyLocale || {}).ISOCurrencySymbol || 'BRL';
}

/**
 * Captura o simb de moeda da loja
 *
 * @returns string
 */
export function getStoreCurrencySymbol() {
  return window.localeInfo?.CurrencyLocale?.CurrencySymbol || 'R$';
}
