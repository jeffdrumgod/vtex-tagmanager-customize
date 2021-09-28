// @ts-nocheck

export function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < window.pageYOffset + window.innerHeight &&
    left < window.pageXOffset + window.innerWidth &&
    top + height > window.pageYOffset &&
    left + width > window.pageXOffset
  );
}

export function elementDOMIsVisible(element) {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

export function elementDOMGetClosest(elem, selector, checkVisibility = null) {
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }

  // Get the closest matching element
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) {
      if (checkVisibility === true && !elementDOMIsVisible(elem)) {
        return false;
      }
      return elem;
    }
  }
  return null;
}

export function ready(fn: Function) {
  if (document.readyState !== 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn as EventListenerOrEventListenerObject);
  } else {
    // @ts-ignore
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState !== 'loading') fn();
    });
  }
}
