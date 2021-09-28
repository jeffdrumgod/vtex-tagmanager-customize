export interface IProductFromCatalogSearch {
  productId: string;
  productName: string;
  brand: string;
  brandId: number;
  brandImageUrl: null;
  linkText: string;
  productReference: string;
  categoryId: string;
  productTitle: string;
  metaTagDescription: string;
  releaseDate: Date;
  clusterHighlights: ClusterHighlights;
  productClusters: { [key: string]: string };
  searchableClusters: ClusterHighlights;
  categories: string[];
  categoriesIds: string[];
  link: string;
  allSpecifications: string[];
  allSpecificationsGroups: string[];
  description: string;
  items: Item[];
  skuSpecifications: SkuSpecification[];
}

export interface ClusterHighlights {}

export interface Item {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: ReferenceID[];
  measurementUnit: string;
  unitMultiplier: number;
  modalType: null;
  isKit: boolean;
  images: Image[];
  variations: string[];
  sellers: Seller[];
  Videos: any[];
  estimatedDateArrival: null;
}

export interface Image {
  imageId: string;
  imageLabel: string;
  imageTag: string;
  imageUrl: string;
  imageText: string;
  imageLastModified: Date;
}

export interface ReferenceID {
  Key: string;
  Value: string;
}

export interface Seller {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  sellerDefault: boolean;
  commertialOffer: CommertialOffer;
}

export interface CommertialOffer {
  DeliverySlaSamplesPerRegion: DeliverySlaSamplesPerRegion;
  Installments: Installment[];
  DiscountHighLight: any[];
  GiftSkuIds: string[];
  Teasers: any[];
  BuyTogether: any[];
  ItemMetadataAttachment: any[];
  Price: number;
  ListPrice: number;
  PriceWithoutDiscount: number;
  RewardValue: number;
  PriceValidUntil: Date;
  AvailableQuantity: number;
  Tax: number;
  DeliverySlaSamples: DeliverySlaSample[];
  GetInfoErrorMessage: null;
  CacheVersionUsedToCallCheckout: string;
  PaymentOptions: PaymentOptions;
}

export interface DeliverySlaSample {
  DeliverySlaPerTypes: any[];
  Region: null;
}

export interface DeliverySlaSamplesPerRegion {
  '0': DeliverySlaSample;
}

export interface Installment {
  Value: number;
  InterestRate: number;
  TotalValuePlusInterestRate: number;
  NumberOfInstallments: number;
  PaymentSystemName: string;
  PaymentSystemGroupName: GroupName;
  Name: string;
}

export enum GroupName {
  BankInvoicePaymentGroup = 'bankInvoicePaymentGroup',
  CreditCardPaymentGroup = 'creditCardPaymentGroup',
  GiftCardPaymentGroup = 'giftCardPaymentGroup',
}

export interface PaymentOptions {
  installmentOptions: InstallmentOption[];
  paymentSystems: PaymentSystem[];
  payments: any[];
  giftCards: any[];
  giftCardMessages: any[];
  availableAccounts: any[];
  availableTokens: any[];
}

export interface InstallmentOption {
  paymentSystem: string;
  bin: null;
  paymentName: string;
  paymentGroupName: GroupName;
  value: number;
  installments: InstallmentElement[];
}

export interface InstallmentElement {
  count: number;
  hasInterestRate: boolean;
  interestRate: number;
  value: number;
  total: number;
  sellerMerchantInstallments?: InstallmentElement[];
  id?: string;
}

export interface PaymentSystem {
  id: number;
  name: string;
  groupName: GroupName;
  validator: null;
  stringId: string;
  template: string;
  requiresDocument: boolean;
  isCustom: boolean;
  description: null;
  requiresAuthentication: boolean;
  dueDate: Date;
  availablePayments: null;
}

export interface SkuSpecification {
  field: Field;
  values: Value[];
}

export interface Field {
  id: number;
  name: string;
  isActive: boolean;
  position: number;
  type: string;
}

export interface Value {
  id: string;
  name: string;
  position: number;
}
