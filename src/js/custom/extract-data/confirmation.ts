import _set from 'lodash.set';
import { getSkuInfo, getAndCacheSkusInfo } from '../../helpers/catalogApi';
import { setLocalStorage, getLocalStorage } from '../../helpers/storage';
import { getPageCountry } from '../../helpers/store';
import log from '../../helpers/log';

export const trackCustomConfirmation = async (data) => {
  const keyOrdersStorage = 'custom-orders-tracked';
  const orderIds = (getLocalStorage(keyOrdersStorage) || []).slice(0, 40);
  const orderid = data?.transactionId;

  // previnir duplicidade de trackings
  if (!orderid || orderIds.includes(orderid)) {
    log(`🟡 Order track duplicated: Ignored track for order id: ${orderid}`);
    return;
  }

  await getAndCacheSkusInfo(data?.transactionProducts.map((cartItem) => cartItem?.id));

  // orderIds.push(orderid);

  const transactionProducts = await Promise.all(
    data?.transactionProducts.map(async (cartItem) => {
      // const extraInfo = await getSkuInfo(cartItem?.id);

      return {
        id: data?.transactionId,
        sku: cartItem?.id,
        name: cartItem?.skuRefId,
        category: cartItem?.category,
        price: cartItem?.price,
        quantity: cartItem?.quantity,
        // variant: extraInfo?.productInfo?.Cor?.join(''),
        specialEdition: 'FALSE',
      };
    }),
  );

  const newData = {
    transactionId: data?.transactionId,
    transactionCurrency: data?.transactionCurrency,
    transactionTotal: data?.transactionTotal,
    transactionTax: data?.transactionTax,
    transactionShipping: data?.transactionShipping,
    transactionShippingMethod: data?.transactionShippingMethod?.[0]?.selectedSla,
    transactionPaymentType: data?.transactionPaymentType?.[0]?.paymentSystemName,
    transactionBillingCountry: getPageCountry(),
    transactionShippingCountry: getPageCountry(),
    transactionProducts,
  };

  const time = 131400; // 3 meses em minutos
  setLocalStorage(keyOrdersStorage, orderIds, time);

  // window.customDataLayer.push({ event: 'checkoutConfirmation' });
  // window.customDataLayer.push({
  //   event: 'virtualPageview',
  //   page: `/${getPageCountry()}/checkout/order-confirmation`,
  //   pgType: 'Checkout Funnel',
  // });

  return newData;
};

/**
 * Devolver dados para Enchanced Ecommerce na step de confirmação de pedido
 * @param eeData Enchanced Ecommerce data provido pela Vtex
 * @returns
 */
export const trackEEConfirmation = async (eeData) => {
  const keyOrdersStorage = 'orders-tracked';
  const orderIds = (getLocalStorage(keyOrdersStorage) || []).slice(0, 40);
  const orderid = eeData?.ecommerce?.purchase?.actionField?.id;

  // previnir duplicidade de trackings
  if (!orderid || orderIds.includes(orderid)) {
    log(`🟡 Order track duplicated: Ignored track for order id: ${orderid}`);
    return;
  }
  orderIds.push(orderid);

  /**
   * Caso seja necessário customizar algum dado para os produtos do pedido
   */
  // await getAndCacheSkusInfo(eeData?.ecommerce?.purchase?.products.map((cartItem) => cartItem?.id));
  // const products = await Promise.all(
  //   eeData?.ecommerce?.purchase?.products.map(async (cartItem) => {
  //     const extraInfo = await getSkuInfo(cartItem?.id);

  //     return {
  //       ...cartItem,
  //       id: extraInfo?.referenceId?.find((item) => item.Key === 'RefId')?.Value,
  //     };
  //   }),
  // );
  // _set(eeData, 'ecommerce.purchase.products', products);

  const time = 131400; // 3 meses em minutos
  setLocalStorage(keyOrdersStorage, orderIds, time);

  return eeData;

  /**
   {
    ecommerce: {
      purchase: {
        actionField: {
          id: "1160220210443",
          affiliation: "store",
          revenue: 14.37,
          tax: 0,
          shipping: 8.9,
          coupon: null
        },
        products: [
          {
            id: "166",
            name: "Cenoura Baby store 300g",
            category: "Vegetais/Frutas e Vegetais/Cenoura",
            brand: "store",
            variant: "Cenoura Baby store 300g",
            price: 5.47,
            quantity: 1
          }
        ]
      }
    }
  }
   */
};

/**
 * Devolver dados para Enchanced Ecommerce na step de confirmação de pedido
 * @param eeData Enchanced Ecommerce data provido pela Vtex
 * @returns
 */
export const trackVtexConfirmation = async (eeData) => {
  const keyOrdersStorage = 'orders-tracked-vtex';
  const orderIds = (getLocalStorage(keyOrdersStorage) || []).slice(0, 40);
  const orderid = eeData?.transactionId;

  // previnir duplicidade de trackings
  if (!orderid || orderIds.includes(orderid)) {
    log(`🟡 Vtex Order track duplicated: Ignored track for order id: ${orderid}`);
    return;
  }
  orderIds.push(orderid);

  const time = 131400; // 3 meses em minutos
  setLocalStorage(keyOrdersStorage, orderIds, time);

  return {
    ...eeData,
    event: 'vtexOrderPlaced',
  };
};

/**
{
accountName: "storebr",
  orderGroup: "1160220210443",
  salesChannel: "1",
  coupon: undefined,
  campaignName: undefined,
  campaignSource: undefined,
  campaignMedium: undefined,
  internalCampaignName: undefined,
  internalCampaignPage: undefined,
  internalCampaignPart: undefined,
  bankInvoiceURL: undefined,
  visitorType: undefined,
  visitorContactInfo: ["teste@teste.com", "asdasd", "asdasd"],
  transactionId: "1160220210443",
  transactionDate: "2021-09-08T22:03:29.0166043Z",
  transactionAffiliation: "storebr",
  transactionTotal: 14.37,
  transactionShipping: 8.9,
  transactionTax: 0,
  transactionCurrency: "BRL",
  transactionPaymentType: [
    {group: "creditCard", paymentSystemName: "Mastercard", installments: 1, value: 1437}
  ],
  transactionShippingMethod: [{selectedSla: "Expressa - CD Anhanguera", itemId: "166"}],
  transactionProducts: [
    {
      id: "166",
      name: "Cenoura Baby store 300g",
      sku: "166",
      skuRefId: "616497",
      skuName: "Cenoura Baby store 300g",
      brand: "store",
      brandId: "2000000",
      seller: "storebr",
      sellerId: "1",
      category: "Cenoura",
      categoryId: "48",
      categoryTree: ["Frutas e Vegetais", "Vegetais", "Cenoura"],
      categoryIdTree: ["45", "29", "48"],
      originalPrice: 5.47,
      price: 5.47,
      sellingPrice: 5.47,
      tax: 0,
      quantity: 1,
      components: [],
      measurementUnit: "un",
      unitMultiplier: 1
    }
  ],
  transactionPayment: {id: "DD8BD009259543409CC381BF91024BDA"},
  event: "vtexOrderPlaced",
}  
 */
