const LOCALES = {
  'zh_cn': {
    weekday: function(i) { return '星期' + '日一二三四五六'[i]; },
    weekday_abbr: function(i) { return '周' + '日一二三四五六'[i]; }
    // 本地月日就免了，因为现在几乎看不到“一月二十三日”这种描述了
  }
};
// XXX: ...默认中文
const LOCALE = LOCALES['zh_cn'];

// 自定义日期格式如下(年月日都必须提供):
// "2011-11-11"
// "2011-11-11 11:11"
// "2011-11-11 11:11:11"
const re_custom = /^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/;

// iso8601日期格式见:
// http://www.ecma-international.org/ecma-262/5.1/#sec-15.9
const re_iso8601 = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?T(?:(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?)?Z?$/;

const _toString = Object.prototype.toString;

// instanceof Date在跨frame和cypress测试上返回false
function isDate(o) {
  return _toString.call(o) === '[object Date]';
}

function toDate(input) {
  if (!input) {
    return new Date();
  } else if (isDate(input)) {
    return new Date(input);
  } else if (typeof input === 'number') {
    return new Date(input);
  } else if (typeof input === 'string'){
    // 如果是自定义的格式，则用本地时间，
    // 否则，使用原生的构造方法(本地还是UTC看具体实现)。
    let r = re_custom.exec(input);
    if (r) {
      return new Date(~~r[1], ~~r[2]-1, ~~r[3], ~~r[4], ~~r[5], ~~r[6]);
    }

    r = re_iso8601.exec(input);
    if (r) {
      // month/date缺省值为1月/1日
      let month = ~~r[2] - 1;
      if (month < 0) month = 0;
      let date = ~~r[3];
      if (date === 0) date = 1;

      return new Date(Date.UTC(~~r[1], month, date, ~~r[4], ~~r[5], ~~r[6], ~~r[7]));
    }

    return new Date(input);
  }
}

// 按照strftime的规则，但是多了个数字，比如 "%d"=>"02", "%1d" => "2"
// 因为在中文里，页面上的日期一般会显示成“1月2日”，而不是“01月02日”，也不是“一月二日”
const re_format = new RegExp('%([1-9]?)(.)', 'g');
function format(fmt, idate) {
  const d = toDate(idate);
  if (!d) {
    return fmt;
  }

  const r = fmt.replace(re_format, function(_, digit, val) {
    // 并没有把strftime完全复制，只是其中用的比较多的
    switch (val) {
    case 'a': // 星期(简)
      return LOCALE.weekday_abbr(d.getDay());
    case 'A': // 星期
      return LOCALE.weekday(d.getDay());
    case 'd': // 日，01-31
      return zpad(digit || 2, d.getDate());
    case 'H': // 时，00-23
      return zpad(digit || 2, d.getHours());
    case 'I': // 时，01-12
      return zpad(digit || 2, (d.getHours() % 12) || 12);
    case 'm': // 月
      return zpad(digit || 2, d.getMonth() + 1);
    case 'M': // 分
      return zpad(digit || 2, d.getMinutes());
    case 'R': // == %H:%M
      return [
        zpad(2, d.getHours()),
        zpad(2, d.getMinutes())
      ].join(':');
    case 'T': // == %H:%M:%S
      return [
        zpad(2, d.getHours()),
        zpad(2, d.getMinutes()),
        zpad(2, d.getSeconds())
      ].join(':');
    case 's':
      return d.getTime() / 1000;
    case 'S': // 秒
      return zpad(digit || 2, d.getSeconds());
    case 'w': // 星期，0-6
      return d.getDay();
    case 'y': // 年，两位
      return d.getFullYear() % 100;
    case 'Y': // 年，四位
      return d.getFullYear();
    case '%':
      return '%';
    default: // 未匹配到，保持原样
      return _;
    }
  });

  return r;
}

const ZEROS = '00000000000000000000';
function zpad(n, val) {
  let r = val.toString();
  while (r.length < n) {
    r = ZEROS.slice(0, n-r.length) + r;
  }
  return r;
}

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

function diffDay(a, b) {
  a = toDate(a);
  b = toDate(b);
  if (!a || !b) {
    return '';
  }

  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);

  const diff = b.getTime() - a.getTime();
  const days = ~~(diff / ONE_DAY);
  return days;
}

export default {
  toDate,
  format,
  zpad,
  diffDay,
};
