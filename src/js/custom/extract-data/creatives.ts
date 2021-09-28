/**
 * O atributo creatives, é um array que contém todos os tipos de grupos de banners, itens criativos que desejamos realziar o tracking
 *
 * Cada item do array é um objeto com os seguintes atributos:
 * groupSelector: string com seletor de grupo de banners
 * itemSelectors: objeto, onde cada chave é um seletor que será usado para extrair o item de dentro do grupo. E o valor é uma função.
 * Essa função pode ser manipulada para extrair os dados de acordo com a necessidade desejada para cada e-commerce.
 * O resultado dessa função é esperado um novo objeto, para cada item, contento os atributos:
 * - element: elemento DOM utilizado para a seleção dos dados
 * - props: propriedades que serão utilizadas para o tracking. Neste caso espera-se o atributo "ee" o qual possui os dados do Enchanced Ecommerce.
 */

const creatives = [
  {
    groupSelector: '[data-track-banner-group]',
    itemSelectors: {
      '[data-track-banner="item"]': (element: HTMLElement, group: HTMLElement, position: number) => {
        const firstImage = element.querySelector('img');
        const name = element.getAttribute('data-track-banner-name') || firstImage?.getAttribute('alt');
        const id = element.getAttribute('data-track-banner-id');
        const creative = element.getAttribute('data-track-banner-creative');
        const positionSlot = `${group.getAttribute('data-track-banner-group')}_slot${position}`;
        const imgUrl = firstImage?.getAttribute('src') || firstImage?.getAttribute('data-src') || '';
        const imageName = imgUrl.split('.vteximg.com.br/arquivos/')?.[1] || '';
        const result = {
          element,
          props: {
            ee: {
              // enhanced ecommerce
              name: name || imageName || imgUrl,
              id: id || name || imgUrl,
              creative: creative || imgUrl,
              position: positionSlot,
            },
          },
        };

        return result;
      },
    },
  },
];

export { creatives };
