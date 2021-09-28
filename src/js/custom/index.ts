import { productDetail } from './extract-data/productdetails';
import { shelfs } from './extract-data/shelfs';
import { creatives } from './extract-data/creatives';
import { productAddToCart, productRemoveFromCart } from './extract-data/checkoutInteraction';
import { bindGericEvents } from './extract-data/gericEvents';
import { genericEvents, trackNavigationStep } from './extract-data/checkout';
import { trackEEConfirmation, trackCustomConfirmation, trackVtexConfirmation } from './extract-data/confirmation';
import { trackFilters, trackSearch, navigation } from './extract-data/catalog';

/**
 * O objeto Custom, leva consigo atributos que serão usados pelos scritps que realização o tracking.
 * Cada um possui um modelo específico para extrair as informações necessárias que serão usadas no disparo dos eventos.
 */
const Custom = {
  shelfs,
  creatives,
  productDetail,
  productAddToCart,
  productRemoveFromCart,
  bindGericEvents,
  trackFilters,
  trackSearch,
  navigation,
  checkout: {
    trackNavigationStep,
    genericEvents,
  },
  confirmationPage: {
    trackEEConfirmation,
    trackCustomConfirmation,
    trackVtexConfirmation,
  },
};

export default Custom;
