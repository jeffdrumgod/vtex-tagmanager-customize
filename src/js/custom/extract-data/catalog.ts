/**
 * Arquivos para armezenar itens genéricos relacionados a navegação do cliente em páginas de catálogo
 *
 */

/**
 * Função disparada em carregamento de página quando os tipos forem ['search', 'departament', 'category']
 *
 * Trackear utilização de filtros das páginas de resultados de produtos
 * Assim é possível enviar eventos para quando for utilizado algum filtro da loja
 */
export const trackFilters = () => {
  //
  // const $ = window.jQuery;
  // $('.refino.filtro_colecao').addClass('rcms_finderNav').attr('data-tracking-tab', 'Collection');
  // $('.refino.filtro_material').addClass('rcms_finderNav').attr('data-tracking-tab', 'Design');
  // $('.refino.filtro_movimento').addClass('rcms_finderNav').attr('data-tracking-tab', 'Mechanism');
  // const fn = () => {
  //   $('[data-track-shelf="item"]').addClass('rcms_finderResult');
  // };
  // $(document).ajaxStop(() => {
  //   setTimeout(fn, 300);
  // });
  // fn();
};

/**
 * Função disparada em carregamento de página quando os tipos forem ['search']
 */
export const trackSearch = () => {
  window.customDataLayer.push({
    event: 'searchresult',
    term: window.vtxctx.searchTerm,
    results: +document.querySelector('.resultado-busca-numero .value').textContent,
  });
};

/**
 * Realizar tracking de navegação de páginas, normalmente trackear os links de menu
 **/
export const navigation = () => {
  // const $ = window.jQuery;
  // const $links = $('.navigation .menu-item > a[href=""]');
  // $links.each((i, e) => {
  //   const $e = $(e);
  //   $e.addClass('virtualpageview')
  //     .attr('data-tracking-uri', 'menu')
  //     .attr('data-tracking-group', 'Categorie / Collection');
  // });
};
