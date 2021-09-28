export interface ISkuJson {
  productId: number;
  name: string;
  salesChannel: string;
  available: boolean;
  displayMode: string;
  dimensions: string[];
  dimensionsInputType: DimensionsInputType;
  dimensionsMap: DimensionsMap;
  skus: Sku[];
}

export interface IDimensionsInputType {
  Volume: string;
}

export interface IDimensionsMap {
  Volume: string[];
}

export interface IDimensions {
  Volume: string;
}

export interface IMeasures {
  cubicweight: number;
  height: number;
  length: number;
  weight: number;
  width: number;
}

export interface ISku {
  sku: number;
  skuname: string;
  dimensions: Dimensions;
  available: boolean;
  availablequantity: number;
  cacheVersionUsedToCallCheckout: string;
  listPriceFormated: string;
  listPrice: number;
  taxFormated: string;
  taxAsInt: number;
  bestPriceFormated: string;
  bestPrice: number;
  spotPrice: number;
  installments: number;
  installmentsValue: number;
  installmentsInsterestRate: number;
  image: string;
  sellerId: string;
  seller: string;
  measures: Measures;
  unitMultiplier: number;
  rewardValue: number;
  discount: number;
  hasDiscount: boolean;
  validListPrice: boolean;
  validBestPrice: boolean;
}
