import { cacheProductsInfo, getSkuInfo } from './catalogApi';

const getSkuFromOrderFormByIndex = (index) => {
  return window.vtexjs?.checkout?.orderForm?.items?.[index] ?? false;
};

const getSkuFromOrderFormByID = (id) => {
  return (window.vtexjs?.checkout?.orderForm?.items ?? [])
    .map((item, position) => {
      return {
        position,
        item,
      };
    })
    .find((element) => `${element.item.id}` === `${id}`);
};

type Props = {
  onAddToCart: ({ qty, skuItemOnCart, skuInfo }) => void;
  onRemoveFromCart: ({ qty, skuItemOnCart, skuInfo }) => void;
};

class Checkout {
  virtualStorageTemp: any[];
  props: Props;

  constructor(props: Props) {
    this.props = props;
    this.virtualStorageTemp = [];
    this.bindEvents();
  }

  /**
   * Evendo executado no final da atualização do carrinho, após manipulação via vtexjs
   */
  private async eventOrderFormUpdated(data) {
    if (!this.virtualStorageTemp?.length) {
      return;
    }

    await Promise.all(
      this.virtualStorageTemp.map(async ({ item, itemFromLastSessionCart }) => {
        let actionAdd = true;
        let skuItemOnCart;

        if (!!`${item?.index ?? ''}`) {
          // capturar o item no cart, agora depois da atualização
          skuItemOnCart = getSkuFromOrderFormByIndex(item.index) ?? false;
        } else if (item?.id) {
          skuItemOnCart = getSkuFromOrderFormByID(item.id)?.item ?? false;
        }

        const skuInfo = await getSkuInfo(item?.id || skuItemOnCart?.id || itemFromLastSessionCart?.id);

        let qty = 0;
        // se não existia antes o item, ele foi adicionado
        if (!itemFromLastSessionCart) {
          actionAdd = true;
          qty = skuItemOnCart.quantity;
        } else {
          // se já tinha o item no carrinho, então a quantidade mudou.
          if (skuItemOnCart) {
            // verificar se aumentou ou diminuiu a quantidade
            if (skuItemOnCart.quantity > itemFromLastSessionCart.quantity) {
              // foi adicionado
              actionAdd = true;
              qty = skuItemOnCart.quantity - itemFromLastSessionCart.quantity;
            } else if (skuItemOnCart.quantity < itemFromLastSessionCart.quantity) {
              // foi removido
              actionAdd = false;
              qty = itemFromLastSessionCart.quantity - skuItemOnCart.quantity;
            } else {
              // nada foi feito, a quantidade não mudou e ainda permanece o mesmo conteúdo.
              return;
            }
          }
          // se o item não está mais no carrinho, então ele foi removido por completo
          else {
            actionAdd = false;
            qty = itemFromLastSessionCart.quantity;
          }
        }

        if (actionAdd) {
          this.props.onAddToCart({
            qty,
            skuItemOnCart,
            skuInfo,
          });
          return;
        }

        this.props.onRemoveFromCart({
          qty,
          skuItemOnCart: skuItemOnCart || itemFromLastSessionCart,
          skuInfo,
        });

        return;
      }, []),
    );

    this.virtualStorageTemp = [];
  }

  /**
   * Evento executado antes da requisição para manipulação da sessão do heckout
   */
  private eventCheckoutRequestBegin(data) {
    // filtrar somente URL relacionada a itens do carrinho
    if (data && data.url && data.url.indexOf('api/checkout/pub/orderForm') > -1 && data.url.indexOf('/items') > -1) {
      const submitedData = JSON.parse(data.data);
      (submitedData?.orderItems ?? []).map((item) => {
        let itemFromLastSessionCart;
        // quando for atualização de itens
        if (!!`${item?.index ?? ''}`) {
          // capturar o item do shoppingart, caso ele exista realmente
          itemFromLastSessionCart = getSkuFromOrderFormByIndex(item.index) ?? false;
        }
        // se for a inserção de um item, validando que foi passado o ID
        else if (item?.id) {
          // tenta capturar o item do carrinho, caso ele exista realmente
          itemFromLastSessionCart = getSkuFromOrderFormByID(item.id)?.item ?? false;
        }

        // se encontrado item, significa que ele já está no carrinho e vai sofrer modificações
        if (itemFromLastSessionCart) {
          this.virtualStorageTemp.push({
            itemFromLastSessionCart,
            item,
          });
        } else {
          this.virtualStorageTemp.push({
            item,
          });
        }
      });
    }
  }

  async bindEvents() {
    const $ = window.jQuery;

    $(window).on('checkoutRequestBegin.vtex', (event, data) => {
      this.eventCheckoutRequestBegin(data);
    });

    $(window).on('orderFormUpdated.vtex', async (event, data) => {
      await cacheProductsInfo(data);
      this.eventOrderFormUpdated(data);
    });

    if (window.vtexjs?.checkout?.orderForm) {
      await cacheProductsInfo(window.vtexjs.checkout.orderForm);
      this.eventOrderFormUpdated(window.vtexjs.checkout.orderForm);
    }
  }
}

export default Checkout;
