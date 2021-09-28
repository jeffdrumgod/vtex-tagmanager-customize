import DataLayer from '../helpers/dataLayer';
import { ISkuJson } from './skuJson';

declare global {
  declare type customDataLayerConfig = {
    variableName: string;
    containerId: string;
  };

  declare interface IVtxctx {
    transurl: string;
    searchTerm: string;
    departmentName: string;
    categoryId: string;
    departmentyId: string;
    skus: any[];
    categoryName: string;
  }

  declare type IVtexOrderFormItem = {
    id: string;
  };
  declare interface IVtexOrderForm {
    items: IVtexOrderFormItem[];
  }
  declare interface IVtexjs {
    checkout: {
      orderForm: IVtexOrderForm;
    };
  }

  declare interface Window {
    dataLayer: unknown[];
    customDataLayerConfig: customDataLayerConfig;
    customDataLayer: DataLayer;
    vtxctx: IVtxctx;
    vtexjs: IVtexjs;
    jsnomeLoja: string;
    vtex: {
      vtexid: {
        accountName: string;
      };
      cconfirmation: unknown;
      checkout: unknown;
      i18n: unknown;
      events: any;
    };
    localeInfo: {
      CultureCode: string;
      CurrencyLocale: {
        CurrencySymbol: string;
        FlagUrl: string;
        ISOCurrencySymbol: string;
      };
    };
    skuJson: ISkuJson;
    $: any;
    jQuery: any;
    API: any;
    __RUNTIME__: any;
  }
}
