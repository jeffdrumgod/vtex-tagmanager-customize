import { getStoreIsoCurrencySymbol } from './store';
import { kebabCase } from '../helpers/strings';
import log from './log';
import md5 from 'md5';

type Props = {
  useGtmJsCustomizable: boolean;
  variableName?: string;
  containerId?: string;
};

class DataLayer {
  // valor padrão para variável dataLayer
  readonly variableName: string;

  // define se vamos utilizar uma ativação customizada do GTM
  readonly useGtmJsCustomizable: boolean;

  // id do container GTM
  readonly containerId: string;

  // limite de itens por página para não gerar bloqueio de tracking por limite do body no request
  readonly limitSliceRequest: number;

  // indica se evento gtm.js já foi disparado
  gtmjsFired: boolean;

  // Último elemento interagido. Server para auxiliar captura de informação para eventos posteriores, como por exemplo ao adicionar o produto, precisamos saber de qual lista foi feita a solicitação.
  lastClickedElement: HTMLElement | null;

  fireGA4: boolean;

  constructor(props: Props) {
    this.limitSliceRequest = 20;
    this.useGtmJsCustomizable = props?.useGtmJsCustomizable ?? false;
    this.variableName = props?.variableName ?? 'dataLayer';
    this.gtmjsFired = !this.useGtmJsCustomizable;
    this.fireGA4 = this.fireGA4 || false;

    if (this.useGtmJsCustomizable) {
      this.containerId = props?.containerId ?? 'GTM-NOT-CONFIGURED';
    }

    window[this.variableName] = window[this.variableName] || [];

    document.addEventListener('click', (event) => {
      this.lastClickedElement =
        (event.target as HTMLElement).closest('[data-track-shelf="item"]') || // item de prateleira
        (event.target as HTMLElement).closest('.track-shelf') || // fallback para grupo de prateleira
        (event.target as HTMLElement).closest('[data-widget-type]'); // fallback para element widget;
    });
  }

  push(...args): void {
    window[this.variableName].push.apply(window[this.variableName], args);
    try {
      const { ecommerce, ...others } = args[0];

      if (ecommerce?.impressions) {
        others['Total items'] = ecommerce?.impressions.length;
        log.table(others);
      }
      if (ecommerce?.promotions) {
        others['Total items'] = ecommerce?.promotions.length;
        log.table(others);
      }
      if (ecommerce === null && !others?.event) {
        return;
      }
      log.json(args);
    } catch (e) {}
  }

  /**
   * Pesquisa dentro do dataLayer o último valor de uma determinada chave
   */
  get(key: string) {}

  /**
   * Ativação customizada do gtm.js
   */
  gtmJs(): void {
    if (!this.gtmjsFired) {
      this.gtmjsFired = true;
      this.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
        isGtmJsCustomized: true,
      });
    }
  }

  /**
   * Reset dataLayer Enhanced Ecommerce
   * https://developers.google.com/tag-manager/enhanced-ecommerce#clear-ecommerce
   */
  clearEE() {
    this.push({
      ecommerce: null,
      gaIsNotUserInteraction: true,
    });
  }

  _convertPromoImpressionToGA4(promotions = []) {
    return promotions.map((promo) => {
      const positions = (promo?.position || '').split('_slot');
      const data = {
        // item_name: "Donut Friday Scented T-Shirt", // Name or ID is required.
        // item_id: "67890",
        // price: 33.75,
        // item_brand: "Google",
        // item_category: "Apparel",
        // item_category2: "Mens",
        // item_category3: "Shirts",
        // item_category4: "Tshirts",
        // item_variant: "Black",
        promotion_id: promo?.id,
        promotion_name: promo?.name,
        creative_name: promo?.creative,
        creative_slot: promo?.position,
        location_id: positions?.[0],
        index: positions?.[1],
        // quantity: 1,
      };

      return data;
    });
  }

  _convertProductListToGA4(products = []) {
    return products.map((product) => {
      const item_list_name = kebabCase(
        (product?.list || '').replace('/#', 'home#').replace(product?.list === '/' ? '/' : '######', 'home'),
      );

      const data = {
        item_name: product?.name,
        item_id: product?.id,
        price: product?.price,
        item_brand: product?.brand,
        item_category: product?.category,
        // item_category2: '',
        // item_category3: '',
        // item_category4: '',
        item_variant: product?.variant,
        item_list_name,
        item_list_id: product?.list ? md5(item_list_name) : undefined,
        index: product?.position || 1,
        quantity: product?.quantity || 1,
      };

      return data;
    });
  }

  /**
   * Envio de informação de impressão de produto para Enchanced Ecommerce
   * https://developers.google.com/tag-manager/enhanced-ecommerce#product-impressions
   *
   * @param products
   * @returns void
   */
  pushEEProductImpressions(products) {
    const fn = (impressions) => {
      this.clearEE();
      this.push({
        event: 'productImpressions',
        gaIsNotUserInteraction: true,
        ecommerce: {
          currencyCode: getStoreIsoCurrencySymbol(),
          impressions,
        },
      });

      if (!this.fireGA4) {
        return false;
      }

      this.clearEE();
      this.push({
        event: 'view_item_list',
        gaIsNotUserInteraction: true,
        ecommerce: {
          items: this._convertProductListToGA4(impressions),
        },
      });
    };

    if (products.length < this.limitSliceRequest) {
      fn(products);
      return;
    }

    const steps = Math.ceil(products.length / this.limitSliceRequest);
    for (let index = 0; index < steps; index++) {
      fn(products.slice(index * this.limitSliceRequest, (index + 1) * this.limitSliceRequest));
    }
  }

  /**
   * Mensurar click em produto
   * https://developers.google.com/tag-manager/enhanced-ecommerce#product-clicks
   *
   * @param products
   */
  pushEEProductClick(product) {
    const firtProduct = Array.isArray(product) ? product[0] : product;
    const { list } = firtProduct;

    const products = Array.isArray(product) ? product : [product];

    this.clearEE();
    this.push({
      event: 'productClick',
      gaIsNotUserInteraction: false,
      ecommerce: {
        click: {
          actionField: {
            list,
          },
          products,
        },
      },
    });

    if (!this.fireGA4) {
      return false;
    }

    this.clearEE();
    this.push({
      event: 'select_item',
      gaIsNotUserInteraction: true,
      ecommerce: {
        items: this._convertProductListToGA4(products),
      },
    });
  }

  /**
   * Mensurar visualização de página de detalhe de produto
   * https://developers.google.com/tag-manager/enhanced-ecommerce#details
   *
   * @param products
   */
  pushEEProductDetails(products) {
    this.clearEE();
    this.push({
      event: 'productDetail',
      gaIsNotUserInteraction: true,
      ecommerce: {
        detail: {
          actionField: { list: 'Product Detail' },
          products,
        },
      },
    });

    if (!this.fireGA4) {
      return false;
    }

    this.clearEE();
    this.push({
      event: 'view_item',
      gaIsNotUserInteraction: true,
      ecommerce: {
        items: this._convertProductListToGA4(products.map((item) => ({ ...item, list: 'Product Detail' }))),
      },
    });
  }

  /**
   * Mensurar adição de produto ao carrinho
   * https://developers.google.com/tag-manager/enhanced-ecommerce#add
   *
   * @param products
   */
  pushEEAddToCart({ product, list }) {
    this.clearEE();
    const products = Array.isArray(product) ? product : [product];
    this.push({
      event: 'addToCart',
      gaIsNotUserInteraction: false,
      ecommerce: {
        currencyCode: getStoreIsoCurrencySymbol(),
        add: {
          actionField: { list },
          products,
        },
      },
    });

    if (!this.fireGA4) {
      return false;
    }

    this.clearEE();
    this.push({
      event: 'add_to_cart',
      gaIsNotUserInteraction: true,
      ecommerce: {
        items: this._convertProductListToGA4(products.map((item) => ({ list, ...item }))),
      },
    });
  }

  /**
   * Mensurar remoção de produto ao carrinho
   * https://developers.google.com/tag-manager/enhanced-ecommerce#add
   *
   * @param products
   */
  pushEERemoveFromCart({ product, list }) {
    this.clearEE();
    const products = Array.isArray(product) ? product : [product];
    this.push({
      event: 'removeFromCart',
      gaIsNotUserInteraction: false,
      ecommerce: {
        currencyCode: getStoreIsoCurrencySymbol(),
        remove: {
          actionField: { list },
          products,
        },
      },
    });

    if (!this.fireGA4) {
      return false;
    }

    this.clearEE();
    this.push({
      event: 'remove_from_cart',
      gaIsNotUserInteraction: true,
      ecommerce: {
        items: this._convertProductListToGA4(products.map((item) => ({ list, ...item }))),
      },
    });
  }

  /**
   * Mensurar visualizações de banners
   * https://developers.google.com/tag-manager/enhanced-ecommerce#promo
   * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce?hl=pt-br#promotion-data
   *
   * @param promotions
   */
  pushEEPromoview(promotions) {
    const promotionsArray = Array.isArray(promotions) ? promotions : [promotions];
    this.clearEE();
    this.push({
      event: 'promoView',
      gaIsNotUserInteraction: true,
      ecommerce: {
        promoView: {
          promotions: promotionsArray,
        },
      },
    });

    if (!this.fireGA4) {
      return false;
    }

    this.clearEE();
    this.push({
      event: 'view_promotion',
      gaIsNotUserInteraction: true,
      ecommerce: {
        items: this._convertPromoImpressionToGA4(promotionsArray),
      },
    });
  }
  /**
   * Mensurar clicks em banners
   * https://developers.google.com/tag-manager/enhanced-ecommerce#promo-clicks
   *
   * @param promotions
   */
  pushEEPromoClick(promotions) {
    const promotionsArray = Array.isArray(promotions) ? promotions : [promotions];
    this.clearEE();
    this.push({
      event: 'promotionClick',
      gaIsNotUserInteraction: false,
      ecommerce: {
        promoClick: {
          promotions: promotionsArray,
        },
      },
    });

    if (!this.fireGA4) {
      return false;
    }

    this.clearEE();
    this.push({
      event: 'select_promotion',
      gaIsNotUserInteraction: true,
      ecommerce: {
        items: this._convertPromoImpressionToGA4(promotionsArray),
      },
    });
  }
  /**
   * Mensurar etapas de checkout
   * https://developers.google.com/tag-manager/enhanced-ecommerce#checkout
   *
   * @param promotions
   */
  pushEECheckout({ products, step }) {
    const producstArray = Array.isArray(products) ? products : [products];

    this.clearEE();
    this.push({
      event: 'checkout',
      gaIsNotUserInteraction: true,
      ecommerce: {
        checkout: {
          actionField: { step },
          products: producstArray,
        },
      },
    });
  }

  /**
   * Mensurar step de início do checkout em GA4
   * https://developers.google.com/tag-manager/ecommerce-ga4#measure_a_checkout
   *
   * @param products
   */
  GA4BeginCheckout(products) {
    if (!this.fireGA4) {
      return false;
    }

    // one shot
    if (!!window[this.variableName].find((item) => item.event === 'begin_checkout')) {
      return;
    }

    this.clearEE();
    this.push({
      event: 'begin_checkout',
      gaIsNotUserInteraction: true,
      ecommerce: {
        items: this._convertProductListToGA4(products),
      },
    });
  }

  /**
   * Mensurar step de shipping em GA4 (custom)
   *
   * @param products
   */
  GA4AddShippingInfo(products, shippingTier) {
    if (!this.fireGA4) {
      return false;
    }

    // one shot
    if (!!window[this.variableName].find((item) => item.event === 'add_shipping_info')) {
      return;
    }

    this.clearEE();
    this.push({
      event: 'add_shipping_info',
      gaIsNotUserInteraction: true,
      ecommerce: {
        shipping_tier: shippingTier,
        items: this._convertProductListToGA4(products),
      },
    });
  }

  /**
   * Mensurar step de pagamento em GA4 (custom)
   *
   * @param products
   */
  GA4AddPaymentInfo(products, paymentType) {
    if (!this.fireGA4) {
      return false;
    }

    // one shot
    if (!!window[this.variableName].find((item) => item.event === 'add_payment_info')) {
      return;
    }

    this.clearEE();
    this.push({
      event: 'add_payment_info',
      gaIsNotUserInteraction: true,
      ecommerce: {
        payment_type: paymentType,
        items: this._convertProductListToGA4(products),
      },
    });
  }

  /**
   * Mensurar fechamento de compra
   *
   * @param products
   */
  pushEEPurchase(ecommerData) {
    this.clearEE();
    this.push({
      ...ecommerData,
      event: 'orderPlaced',
      gaIsNotUserInteraction: true,
    });

    const actionField = ecommerData?.ecommerce?.purchase?.actionField || {};

    if (!this.fireGA4) {
      return false;
    }

    this.clearEE();
    this.push({
      event: 'purchase',
      gaIsNotUserInteraction: true,
      ecommerce: {
        transaction_id: actionField?.id,
        affiliation: actionField?.affiliation,
        value: actionField?.revenue,
        tax: actionField?.tax,
        shipping: actionField?.shipping,
        currency: getStoreIsoCurrencySymbol(),
        coupon: actionField?.coupon,
        items: this._convertProductListToGA4(ecommerData?.ecommerce?.purchase?.products || []),
      },
    });
  }
}

export default DataLayer;
