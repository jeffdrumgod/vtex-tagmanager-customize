import { getStoreIsoCurrencySymbol } from '../../helpers/store';
import { elementInViewport } from '../../helpers/dom';
import { sanitize } from '../../helpers/strings';
import { getJsonFromUrl } from '../../helpers/url';

/**
 * ao realizar scroll, disparar Virtual page Views para cada sessão da página
 */
const onScrollTrackVv = () => {
  const reviews = document.querySelector('.product-details-reviews');
  reviews?.setAttribute('data-section-name', 'product_reviews');

  const details = document.querySelector('#main > .container:nth-child(2)');
  details?.setAttribute('data-section-name', 'product_details');

  const scrollActiveItems = [reviews, details];

  document.addEventListener('scroll', function (e) {
    scrollActiveItems
      .filter((el) => {
        return el && !el.getAttribute('scrollFired') && elementInViewport(el);
      })
      .map((el) => {
        el.setAttribute('scrollFired', 'true');
        window.customDataLayer.push({
          event: 'virtualPageview',
          page: `${window.location.pathname.replace(/\/$/g, '')}/${el.getAttribute('data-section-name')}`,
        });
      });
  });
};

// Enhance ecommerce
const EE = ({ skuId }) => {
  const brand = (window.dataLayer as any).find((item) => !!item?.productBrandName)?.productBrandName;
  var skus = window.skuJson.skus.map((sku) => ({
    name: sku.skuname,
    variant: '',
    id: `${sku.sku}`,
    price: +(sku.bestPrice / 100).toFixed(2),
    brand,
    category: window.vtxctx?.categoryName || '',
  }));

  return skus;
};

export function productDetail() {
  // obter o SKU selecionado para o produto inicial sendo visualizado

  // tentar obter da URL, como parâmetro
  let { skuId } = getJsonFromUrl();
  const $buybrnDefaultVtex = window.$('.buy-button-ref[href^="/checkout"]');

  // tentar obter do botão padrão de compra da platarorma
  if ($buybrnDefaultVtex.length) {
    $buybrnDefaultVtex.attr('href');
    const params = getJsonFromUrl();

    if (params?.sku) {
      skuId = params.sku;
    }
  }

  // obtem de uma informação customizada no DOM
  if (!skuId) {
    const $option = window.$('.comp-sku-selector-selected [data-sid]');
    if ($option.length) {
      skuId = $option.attr('data-sid');
    }
  }

  // se não obtiver com as opções acima, pega o primeiro SKU da lista
  if (!skuId) {
    skuId = window.skuJson.skus[0].sku;
  }

  onScrollTrackVv();
  return EE({ skuId });
}
