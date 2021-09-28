/**
 * Funções utilizadas na interação com eventos do carrinho de compras.
 */

/**
 * Extração de informações do produto no evento de remoção do carrinho de compras
 */
export const productRemoveFromCart = ({ qty, skuItemOnCart, skuInfo }) => {
  // const refId = skuInfo?.referenceId?.find((item) => item.Key === 'RefId')?.Value;
  const eeData = {
    name: skuItemOnCart.name,
    variant: null, //skuInfo?.productInfo?.Cor?.join(''),
    id: skuItemOnCart.id,
    price: +(skuItemOnCart.price / 100).toFixed(2),
    brand: skuItemOnCart?.additionalInfo?.brandName,
    quantity: qty,
    category: Object.values(skuItemOnCart?.productCategories ?? {})
      .slice(-1)
      .pop(),
  };

  let list = '';

  try {
    const el = window.customDataLayer?.lastClickedElement;

    if (el) {
      list = el.getAttribute('data-tracking-list');
    }

    // fallback para o caso de não ter o elemento, mas sim a lista da prateleira. Exemplo, compre-junto
    if (!list) {
      const el = window.customDataLayer?.lastClickedElement?.querySelector('h2');

      if (el) {
        list = el.getAttribute('data-track-shelf-list');
      }
    }
  } catch (error) {}

  return {
    product: eeData,
    list,
  };
};

/**
 * Extração de informações do produto no evento de adição ao carrinho de compras
 */
export const productAddToCart = ({ qty, skuItemOnCart, skuInfo }) => {
  const eeData = {
    name: skuItemOnCart.name,
    variant: null, // skuInfo?.productInfo?.Cor?.join(''),
    id: skuItemOnCart.id,
    price: +(skuItemOnCart.price / 100).toFixed(2),
    brand: skuItemOnCart?.additionalInfo?.brandName,
    quantity: qty,
    category: Object.values(skuItemOnCart?.productCategories ?? {})
      .slice(-1)
      .pop(),
  };

  let list = '';

  try {
    const el = window.customDataLayer?.lastClickedElement;

    if (el) {
      list = el.getAttribute('data-tracking-list');
    }

    // fallback para o caso de não ter o elemento, mas sim a lista da prateleira. Exemplo, compre-junto
    if (!list) {
      const el = window.customDataLayer?.lastClickedElement?.querySelector('h2');

      if (el) {
        list = el.getAttribute('data-track-shelf-list');
      }
    }
  } catch (error) {}

  return {
    product: eeData,
    list,
  };
};
