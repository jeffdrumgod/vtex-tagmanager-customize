import { cacheProductsInfo, getSkuInfo } from '../../helpers/catalogApi';

/**
 * Gerar tracking em minicart, widget cart lateral dentro do catálogo
 */
const trackingWidgetCart = () => {
  const $ = window.jQuery;
  const selectoritems = '.minicart .cart-item';
  const fn = async () => {
    await cacheProductsInfo();
    $(selectoritems).each(async (i, e) => {
      const $e = $(e);
      const cartItem = $e.data('cartItem');
      const extraInfo = await getSkuInfo(cartItem?.id);

      const dataTracking = [
        {
          category: Object.values(cartItem?.productCategories ?? {})
            .slice(-1)
            .pop(),
          name: cartItem.name,
          id: extraInfo?.referenceId?.find((item) => item.Key === 'RefId')?.Value,
          variant: extraInfo?.productInfo?.Cor?.join(''),
          price: +(cartItem.price / 100).toFixed(2),
          collection: extraInfo?.productInfo?.Coleção?.join(''),
          materialCase: extraInfo?.productInfo?.Material?.join(''),
          materialStrap: extraInfo?.productInfo?.Pulseira?.join(''),
          specialEdition: 'FALSE',
          display: 'Widget Cart',
        },
      ];

      const $btnRemove = $e.find('[data-remove]');
      const $btnIncrement = $e.find('[data-minicart-plus]');
      const $btnDecrement = $e.find('[data-minicart-minus]');

      const $allBtns = $().add($btnRemove).add($btnDecrement).add($btnIncrement);
      $allBtns.attr('data-tracking-product', JSON.stringify(dataTracking));
    });
  };

  $(window).on('minicart-updated', fn);

  if ($(selectoritems).length) {
    fn();
  }
};
/**
 * Função genérica para tracking de dados do checkout.
 * Serve para trackings que se aplicam ao catálogo e fluxo de checkout
 */
export const genericEvents = () => {
  trackingWidgetCart();
};

export const trackNavigationStep = async (stepName, variablesFromEvent): Promise<{ products: any[]; step: number }> => {
  let step = 0;
  let products = variablesFromEvent?.ecommerce?.checkout?.products ?? [];

  switch (stepName) {
    case 'cart':
      step = 1;
      break;
    case 'email':
    case 'login':
      step = 2;
      break;
    case 'profile':
    case 'register':
      step = 3;
      break;
    case 'shipping':
      step = 4;
      break;
    case 'payment':
      step = 5;
      break;
    // case 'orderPlaced':
    //   step = 6;
    //   break;
    default:
      break;
  }

  if (step === 0) {
    return;
  }

  return { products, step };
};
