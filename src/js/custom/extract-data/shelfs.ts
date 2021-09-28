/**
 * O atributo shelf, é um array que contém todos os tipos de grupos de prateleiras que se desejam realizar tracking
 *
 * Cada item do array é um objeto com os seguintes atributos:
 * groupSelector: string com seletor de grupo de prateleiras
 * itemSelectors: objeto, onde cada chave é um seletor que será usado para extrair o item de dentro do grupo
 *
 * O objeto em itemSelectors, possui também outros atributos que possibilitam filtrar determinados itens para ignorar na realização da captura dos dados.
 * Neste caso é usado o atributo "filter", e seu valor é uma função que recebe o nó do DOM de acordo com o seletor especificado na chave do seu objeto superior.
 *
 * Ainda no objeto de itemSeletors, existe o atributo exec, que é uma função responsável por extrair os dados de cada seletor, montando o objeto que será usado para o tracking.
 * Essa função pode ser manipulada para extrair os dados de acordo com a necessidade desejada para cada e-commerce.
 * O resultado dessa função é esperado um novo objeto, para cada item, contento os atributos:
 * - element: elemento DOM utilizado para a seleção dos dados
 * - props: propriedades que serão utilizadas para o tracking. Neste caso espera-se o atributo "ee" o qual possui os dados do Enchanced Ecommerce.
 */
import { sanitizeCurrency } from '../../helpers/strings';
import Page from '../../helpers/page';

const page = new Page();
const pgtype = page.now();

const filterItens = (item) => {
  if (
    // prevent already tracked item
    item.parentElement.classList.contains('customGtmTracked')
    // or other, as slider cloned elements
  ) {
    return false;
  }
  return item;
};

const extractDataFromitem = (element: HTMLElement, group: HTMLElement, position: number) => {
  const name = element.getAttribute('data-track-shelf-name');
  const id = element.getAttribute('data-track-shelf-sid');
  const price = sanitizeCurrency(element.getAttribute('data-track-shelf-price'));
  const brand = element.getAttribute('data-track-shelf-brand');
  const category = element.getAttribute('data-track-shelf-category');
  // const variant = element.querySelector('[data-track-shelf-variant] li')?.textContent || '';
  const variant = '';
  let list = '';
  if (element.getAttribute('data-track-shelf-list')) {
    list = element.getAttribute('data-track-shelf-list');
  } else {
    list =
      pgtype === 'product' ? 'Product Detail' : group.getAttribute('data-track-shelf-group-name') || location.pathname;
  }

  try {
    const h2 = (group.classList.contains('track-shelf') ? group : group.closest('.track-shelf'))?.querySelector('h2');
    const listTitle = h2?.textContent?.trim() || h2?.innerHTML?.trim();
    if (listTitle) {
      list = `${list === '/' ? 'Home' : list} | ${listTitle}`;
      h2.setAttribute('data-track-shelf-list', list);
    }
  } catch (e) {}

  element.setAttribute('data-tracking-product', id);
  element.parentElement.classList.add('customGtmTracked');
  const props = {
    ee: {
      // enhanced ecommerce
      name,
      id,
      price,
      brand,
      category,
      variant,
      position,
      list,
    },
    custom: {},
  };
  const result = {
    element,
    props,
  };
  element.setAttribute('data-tracking-list', list);
  return result;
};

const shelfs = [
  {
    groupSelector: '[id^="ResultItems_"], div.track-shelf, [data-track-shelf-group-name]',
    itemSelectors: {
      '[data-track-shelf="item"]': {
        filter: filterItens,
        exec: extractDataFromitem,
      },
    },
  },
];

export { shelfs };
