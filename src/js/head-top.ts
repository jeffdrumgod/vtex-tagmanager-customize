import './helpers/polyfills';
import DataLayer from './helpers/dataLayer';
import log from './helpers/log';
import { version } from '../../package.json';

// log(
//   'You can help us staring the project in https://github.com/Trivod/vtex-tagmanager-customize. Trivod.com thanks you!',
// );

// @ts-ignore
window.customDataLayer = new DataLayer(window.customDataLayerConfig);

log(
  `head-top.js (${version}) ready, using ${
    window.customDataLayer?.useGtmJsCustomizable ? 'custom' : 'default'
  } configuration for container ID ${
    window.customDataLayer?.useGtmJsCustomizable
      ? window.customDataLayer?.containerId
      : 'default configurated on VTEX admin'
  }`,
);

if (window.customDataLayer?.useGtmJsCustomizable) {
  const init = function (w, d, s, l, i) {
    w[l] = (w[l] || []).reduce((stack, item) => {
      if (!item.event || item.event !== 'gtm.js') {
        stack.push(item);
      }
      return stack;
    }, []);
    const originalPush = w[l].push;
    w[l].push = function (...args) {
      try {
        if (args.length) {
          const item = args[0];
          if (item?.event && item.event === 'gtm.js' && !item.isGtmJsCustomized) {
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      originalPush.apply(w[l], args);
    };
    // w[l].push({
    //     'gtm.start': new Date().getTime(),
    //     event: 'gtm.js'
    // });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  };

  const { variableName = 'dataLayer', containerId = 'GTM-XXXXXX' } = window.customDataLayer;

  init(window, document, 'script', variableName, containerId);
}
