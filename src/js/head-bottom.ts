import getContext from './custom/store-context';
import { mainAsyncPageView } from './helpers/store';
import log from './helpers/log';
import Custom from './custom';
import Shelfs from './helpers/shelfs';
import Creatives from './helpers/creatives';
import Page from './helpers/page';
import Checkout from './helpers/checkout';
import { ready } from './helpers/dom';

log('head-bottom.js ready');

const trackShelfs = () => {
  const shelfs = new Shelfs(Custom.shelfs);
  const products = shelfs.getAllProducts();

  if (products.length) {
    window.customDataLayer.pushEEProductImpressions(products.map((item) => item.props.ee));
    products.forEach((item) => {
      item.element.addEventListener('mousedown', () => {
        window.customDataLayer.pushEEProductClick(item.props.ee);
      });
    });
  }
};

const trackCreatives = () => {
  const creativesGroups = new Creatives(Custom.creatives);
  const creatives = (creativesGroups.getAllCreatives() || []).filter((item) => !!item.element);
  if (creatives.length) {
    window.customDataLayer.pushEEPromoview(creatives.map((item) => item.props.ee));
    creatives.forEach((item) => {
      item.element.addEventListener('click', () => {
        window.customDataLayer.pushEEPromoClick(item.props.ee);
      });
    });
  }
};

const trackProductDetail = () => {
  window.customDataLayer.pushEEProductDetails(Custom.productDetail());
};

const trackCheckout = () => {
  Custom.checkout.genericEvents();

  new Checkout({
    onAddToCart: (data) => {
      window.customDataLayer.pushEEAddToCart(Custom.productAddToCart(data));
    },
    onRemoveFromCart: (data) => {
      window.customDataLayer.pushEERemoveFromCart(Custom.productRemoveFromCart(data));
    },
  });
};

try {
  if (window.customDataLayer?.useGtmJsCustomizable) {
    // Tratativas para dataLayer padrão trigado por scripts vtex
    window.vtex.events.unsubscribe('dataLayer');
    window.vtex.events &&
      window.vtex.events.subscribe('dataLayer', function (name, variables) {
        variables = variables || {};
        window.dataLayer = window.dataLayer || [];

        if (!!name) {
          variables.event = name;
          log('🟡 default vtex dataLayer....', variables);
        }
      });
  }
} catch (e) {
  console.error(e);
}

ready(function (event) {
  log('DOMContentLoaded listner trigged');
  mainAsyncPageView().then(() => {
    const page = new Page();
    const pgtype = page.now();

    const fireContext = (ptype) => {
      const context = getContext(ptype);
      window.customDataLayer.push({
        event: 'storeContextLoaded',
        ...context,
      });
    };

    fireContext(pgtype);
    trackCheckout();
    trackShelfs();
    trackCreatives();
    Custom.bindGericEvents({
      trackShelfs,
    });
    Custom.navigation();

    if (pgtype === 'product') {
      trackProductDetail();
    }
    if (pgtype === 'search') {
      Custom.trackSearch();
    }
    if (['search', 'departament', 'category']) {
      Custom.trackFilters();
    }

    if (window.location.pathname.indexOf('_secure/account') > -1) {
      window.addEventListener('popstate', function (event) {
        const ptype = page.now();
        if (['account', 'orders', 'addresses', 'wishlist'].includes(ptype)) {
          fireContext(ptype);
        }
      });
    }

    window.customDataLayer.gtmJs();
  });
});

export {};
