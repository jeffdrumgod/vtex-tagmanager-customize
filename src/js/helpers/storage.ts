// https://pt.stackoverflow.com/questions/179100/como-fazer-para-que-o-local-storage-expire
// @ts-nocheck
export function localStorageExpires() {
  for (var e = [], a = new Date().getTime(), o = 0, r = localStorage.length; o < r; o++) {
    var t = localStorage.getItem(localStorage.key(o));
    t && /^\{(.*?)\}$/.test(t) && (t = JSON.parse(t)).expires && t.expires <= a && e.push(localStorage.key(o));
  }
  for (o = e.length - 1; 0 <= o; o--) localStorage.removeItem(e[o]);
}
localStorageExpires();
localStorageExpires(); //Auto executa a limpeza
export function setLocalStorage(e, t, a) {
  var i = new Date().getTime() + 6e4 * a;
  localStorage.setItem(e, JSON.stringify({ value: t, expires: i }));
}
export function getLocalStorage(a) {
  localStorageExpires();
  var e = localStorage[a];
  return !(!e || !/^\{(.*?)\}$/.test(e)) && JSON.parse(e).value;
}

export {};
