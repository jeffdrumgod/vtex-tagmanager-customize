class Page {
  home() {
    return !!(window.vtxctx && !window.vtxctx.departmentyId && !window.vtxctx.searchTerm && !window.vtxctx.skus);
  }

  pageNotFound() {
    return !!(window.vtxctx && window.vtxctx.searchTerm && document.querySelector('body.error-404'));
  }

  accessDenied() {
    return !!(window.vtxctx && window.vtxctx.searchTerm && document.querySelector('body.error-401'));
  }

  contact() {
    return !!(window.vtxctx && window.vtxctx.searchTerm && document.querySelector('body.contact'));
  }

  institutional() {
    return !!(window.vtxctx && window.vtxctx.searchTerm && document.querySelector('body.institutional'));
  }

  search() {
    return !!(window.vtxctx && window.vtxctx.searchTerm && document.querySelector('body.search'));
  }

  departament() {
    return !!(
      window.vtxctx &&
      window.vtxctx.departmentyId &&
      (!window.vtxctx.categoryId || window.vtxctx.departmentyId === window.vtxctx.categoryId)
    );
  }

  category() {
    return !!(
      window.vtxctx &&
      window.vtxctx.departmentyId &&
      window.vtxctx.categoryId &&
      window.vtxctx.departmentyId != window.vtxctx.categoryId &&
      !window.vtxctx.skus
    );
  }

  product() {
    return !!(window.vtxctx && window.vtxctx.skus);
  }

  checkout() {
    return !!(window.vtex && window.vtex.checkout);
  }

  confirmation() {
    return !!(window.vtex && window.vtex.cconfirmation);
  }

  account() {
    return !!(
      window.vtxctx &&
      window.location.pathname.indexOf('_secure/account') > -1 &&
      (!window.location.hash || window.location.hash === '#/profile')
    );
  }

  orders() {
    return !!(
      window.vtxctx &&
      window.location.pathname.indexOf('_secure/account') > -1 &&
      window.location.hash === '#/orders'
    );
  }

  addresses() {
    return !!(
      window.vtxctx &&
      window.location.pathname.indexOf('_secure/account') > -1 &&
      window.location.hash === '#/addresses'
    );
  }

  wishlist() {
    return !!(
      window.vtxctx &&
      ((window.location.pathname.indexOf('_secure/account') > -1 && window.location.hash === '#/wishlist') ||
        document.querySelector('body.wishlist'))
    );
  }

  now() {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this)).reduce((stack, key) => {
      if (!stack && !['now', 'constructor'].includes(key) && this[key]()) {
        stack = key;
      }
      return stack;
    }, '');
  }
}

export default Page;
