/**
 * Arquivo para armazenar funções genéricas de tracking dentro da loja
 */

export const bindGericEvents = (
  props: {
    trackShelfs?: () => void;
  } = {},
) => {
  const { trackShelfs } = props;
  const $ = window.jQuery;

  // quando usuário de autenticar
  $(window).on('authenticatedUser.vtexid', () => {
    window.customDataLayer.push({ event: 'login' });
  });

  // quando usuário aceitar receber newsletter
  $('body').on('change', '[name="newsletterOptIn"][type="checkbox"]', (event) => {
    window.customDataLayer.push({
      event: 'newsletterSubscription',
      newsletter: event.currentTarget.checked ? 'subscription' : 'unsubscription',
    });
  });

  // adicionar atribuição para prateleira de produtos em wishlist
  $(window).on('doWishlistSearch.wishlist', () => {
    $('.wishlist-content .prateleira.track-shelf').attr('data-track-shelf-group-name', 'wishlist');
    if (trackShelfs) {
      trackShelfs();
    }
  });

  // quando for realizado o evento de finalização de um ajax, o qual pode mudar o conteúdo da página precisando realizar novamente os trackings de prateleiras
  $(document).ajaxStop(() => {
    if (trackShelfs) {
      setTimeout(trackShelfs, 300);
    }
  });

  // evento de lazyload de plugin lazysizes
  document.addEventListener('lazybeforeunveil', function () {
    if (trackShelfs) {
      setTimeout(trackShelfs, 300);
    }
  });

  // quando cliente clicar nos links de invoice, boleto
  const customInvoiceLinks = () => {
    $('.cconf-bank-invoice-data__print a, a.myo-invoice-btn').addClass('downloadInvoice');
  };
  customInvoiceLinks();
  if (window.location.pathname.indexOf('_secure/account') > -1) {
    $('#account-content').bind('DOMSubtreeModified', function () {
      customInvoiceLinks();
    });
  }

  // sempre que um evento de submissão de formulário for enviado com sucesso
  // $(window).on('formsubmited_success', (evemt, data) => {
  //   // nome do evento, formulário de contato
  //   switch (data.name) {
  //     case 'contact':
  //       document.body.classList.add('rcms_contactrequest');
  //       window.customDataLayer.push({
  //         event: 'contactrequest',
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // });

  // outo modelo possível de submissão de formulário
  // $(document).on('submit', '', () => {
  //   window.customDataLayer.push({ 'event': '' });
  // });
};
