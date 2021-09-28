import { setLocalStorage, getLocalStorage } from './storage';

const cacheKey = 'custom-skus-info';

export async function getAndCacheSkusInfo(skusId = []) {
  const fromCache = getLocalStorage(cacheKey) || {};
  const skus = skusId.reduce(
    (stack, skuId) => {
      if (fromCache.hasOwnProperty(skuId)) {
        stack.cached[skuId] = fromCache[skuId];
      } else {
        stack.toSearch.push(skuId);
      }

      return stack;
    },
    {
      cached: {},
      toSearch: [],
    },
  );

  if (skus.toSearch.length) {
    const params = skus.toSearch.map((skuId) => {
      return `fq=skuId:${skuId}`;
    });

    let data;
    try {
      data = await fetch(`/api/catalog_system/pub/products/search?${params.join('&')}`).then((response) =>
        response.json(),
      );

      if (data) {
        skus.cached = data.reduce((stack, product) => {
          const { items, ...productInfo } = product;

          items.forEach((sku) => {
            if (skus.toSearch.includes(sku.itemId)) {
              const { sellers, ...skuInfo } = sku; // para remover carga de dados não necessário na maioria dos casos
              stack[sku.itemId] = {
                ...skuInfo,
                productInfo,
              };
            }
          });

          return stack;
        }, skus.cached);

        setLocalStorage(
          cacheKey,
          {
            ...fromCache,
            ...skus.cached,
          },
          30,
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  return skus.cached;
}

export async function cacheProductsInfo(orderInfo = window.vtexjs?.checkout?.orderForm) {
  if (orderInfo?.items?.length) {
    await getAndCacheSkusInfo(
      orderInfo.items.map((item) => {
        return item.id;
      }),
    );
  }
}

export async function getSkuInfo(skuId) {
  await cacheProductsInfo();
  const fromCache = getLocalStorage(cacheKey) || {};

  return fromCache.hasOwnProperty(skuId) ? fromCache[skuId] : {};
}
