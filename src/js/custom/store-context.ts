import { userLoggedStatus, getPageLanguage, getPageCountry, getStoreIsoCurrencySymbol } from '../helpers/store';
import { getStoreGlobal } from '../helpers/store';

const getContext = (pgtype) => {
  switch (pgtype) {
    case 'home':
      pgtype = 'Homepage';
      break;
    case 'search':
      pgtype = 'Search';
      break;
    case 'departament':
      pgtype = 'Departament';
      break;
    case 'category':
      pgtype = 'Category';
      break;
    case 'product':
      pgtype = 'Product Detail';
      break;
    case 'checkout':
      pgtype = 'Checkout Funnel';
      break;
    case 'confirmation':
      pgtype = 'Checkout Funnel';
      break;
    case 'pageNotFound':
      pgtype = '404';
      break;
    case 'search':
      pgtype = 'Search';
      break;
  }
  const profile: { UserId: string; Email: string } = getStoreGlobal('profile', {});

  return {
    user_id: profile?.UserId || '',
    user_email: profile?.Email || '',
    user_status: userLoggedStatus() ? 'logged' : 'not logged',
    page_type: pgtype,
    page_currency: getStoreIsoCurrencySymbol(),
    page_country: getPageCountry(),
    page_language: getPageLanguage(),
  };
};

export default getContext;
