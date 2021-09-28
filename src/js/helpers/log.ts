const name = 'vtex-tagmanager-customize';

const log = (...args) => {
  console.log.apply(console, [
    `%c 🧩 ${name}`,
    'font-size: 14px;padding: 4px 10px;color:red;background:black',
    ...args,
  ]);
};

log.json = (data) => {
  console.log.apply(console, [
    `%c 🧩 ${name}`,
    'font-size: 14px;padding: 4px 10px;color:red;background:black',
    `log Object below:`,
  ]);
  console.groupCollapsed('Object');
  try {
    let json;
    if (typeof data != 'string') {
      json = JSON.stringify(data, undefined, '\t');
    }

    var arr = [],
      _string = 'color:green',
      _number = 'color:darkorange',
      _boolean = 'color:ocean',
      _null = 'color:magenta',
      _key = 'color:red';

    json = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var style = _number;
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            style = _key;
          } else {
            style = _string;
          }
        } else if (/true|false/.test(match)) {
          style = _boolean;
        } else if (/null/.test(match)) {
          style = _null;
        }
        arr.push(style);
        arr.push('');
        return '%c' + match + '%c';
      },
    );

    arr.unshift(json);

    console.log.apply(console, arr);
  } catch (e) {
    console.log.apply(console, data);
  }
  console.groupEnd();
};

log.table = (...args) => {
  console.log.apply(console, [
    `%c 🧩 ${name}`,
    'font-size: 14px;padding: 4px 10px;color:red;background:black',
    'log table below:',
  ]);
  console.table.apply(console, args);
};

export default log;
