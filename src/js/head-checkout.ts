import getContext from './custom/store-context';
import log from './helpers/log';
import Custom from './custom';
import Shelfs from './helpers/shelfs';
import Page from './helpers/page';
import { mainAsyncPageView } from './helpers/store';
import Checkout from './helpers/checkout';

let contextFired = !window.customDataLayer?.useGtmJsCustomizable;

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

/**
 * Tracking customizado com informações complementares da Vtex
 */
// const trackCustomPurchase = async (eeVtexVariables) => {
//   const data = await Custom.confirmationPage.trackCustomConfirmation(eeVtexVariables);
//   window.customDataLayer.push(data);
// };

/**
 * Tracking customizado para cada step do checkout carregado
 * @param stepName
 * @param variablesFromEvent
 */
const trackCheckoutNavigationStep = async (stepName, variablesFromEvent, extraControls: any = {}) => {
  const dataTrack = await Custom.checkout?.trackNavigationStep(stepName, variablesFromEvent);

  if (dataTrack?.products) {
    window.customDataLayer.pushEECheckout(dataTrack);
    debugger;
    lastNavigationStepData = { name: stepName, variables: variablesFromEvent };

    // verificar ao menos um tracking caso cliente acesso step futuro
    if (dataTrack?.step > 1) {
      window.customDataLayer.GA4BeginCheckout(dataTrack?.products);
    }
    if (dataTrack?.step > 4) {
      window.customDataLayer.GA4AddShippingInfo(
        dataTrack?.products,
        window?.API?.orderForm?.shippingData?.logisticsInfo?.[0]?.selectedSla,
      );
    }

    if (extraControls?.isPaymentClickTracking) {
      window.customDataLayer.GA4AddPaymentInfo(
        dataTrack?.products,
        document
          .querySelector('.payment-group a.active')
          ?.getAttribute('id')
          ?.replace(/(payment-group-|PaymentGroup)/g, ''),
      );
    }
  } else {
    // fix para tracking adicional da Vtex, para não associar com tracking de EE
    if (stepName !== 'orderPlaced') {
      window.customDataLayer.push(variablesFromEvent);
    }
  }

  if (window.customDataLayer?.useGtmJsCustomizable) {
    if (contextFired === true) {
      window.customDataLayer.gtmJs();
    } else {
      window.jQuery(window).one('customDataLayerContextFired', () => {
        window.customDataLayer.gtmJs();
      });
    }
  }
};

/**
 * Trackear Enchaned Ecommerce
 * @param eeVtexVariables
 */
const trackEEPurchase = async (eeVtexVariables) => {
  const data = await Custom.confirmationPage.trackEEConfirmation(eeVtexVariables);
  if (data) {
    window.customDataLayer.pushEEPurchase(data);
  }
};

/**
 * Trackear Vtex Purchase
 * @param eeVtexVariables
 */
const trackVtexPurchase = async (variablesFromEvent) => {
  const data = await Custom.confirmationPage?.trackVtexConfirmation(variablesFromEvent);
  if (data) {
    window.customDataLayer.push(data);
  }
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

let lastNavigationStepData;

try {
  // Tratativas para dataLayer padrão trigado por scripts vtex
  // if (window.customDataLayer?.useGtmJsCustomizable) {
  // }
  window.vtex.events.unsubscribe('dataLayer');
  window.vtex.events &&
    window.vtex.events.subscribe('dataLayer', function (name, variables) {
      variables = variables || {};
      window.dataLayer = window.dataLayer || [];

      if (!!name) {
        variables.event = name;

        // detectar se é uma confirmação de pedido, modelo Enchanced Ecommerce
        if (variables?.ecommerce?.purchase) {
          trackEEPurchase(variables);
        } else if (name === 'orderPlaced') {
          trackVtexPurchase(variables);
        }

        // detectar se é confirmação de pedido, modelo antigo de tracking para orderPlaced
        // if (variables?.transactionId && variables?.event === 'orderPlaced') {
        //   trackCustomPurchase(variables);
        // }

        if (['cart', 'email', 'profile', 'register', 'shipping', 'payment', 'orderPlaced'].includes(name)) {
          trackCheckoutNavigationStep(name, variables);
        }
      }
    });
} catch (e) {
  console.error(e);
}

mainAsyncPageView().then(() => {
  const page = new Page();
  const pgtype = page.now();

  const fireContext = (ptype) => {
    const context = getContext(ptype);
    window.customDataLayer.push({
      event: 'storeContextLoaded',
      ...context,
    });
    contextFired = true;
    window.jQuery(window).trigger('customDataLayerContextFired');
  };

  // tracking para forçar validação na tentativa de submissão de pedido
  window.jQuery(document).on('click', '.payment-submit-wrap button', () => {
    debugger;
    if (window.location.hash.indexOf('payment') > -1) {
      trackCheckoutNavigationStep(lastNavigationStepData?.name, lastNavigationStepData?.variables, {
        isPaymentClickTracking: true,
      });
    }
  });

  fireContext(pgtype);
  trackCheckout();
  trackShelfs();
  Custom.bindGericEvents({
    trackShelfs,
  });
});

log('head-checkout.js ready');

export {};
