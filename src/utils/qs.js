//
// 为什么不用npm上qs？
// 有时候会收到类似'a=1&a=1'，而对方真正该写的其实是'a=1'，但是大部分
// 配置参数的人并不懂这两者有什么区别，所以对这种重复的参数我们最终只取
// 最后一个。
// 而qs包对于'a=1&a=1'只能解析成数组['1','1']，并且没有参数可以控制。
//
// 基于项目的考虑，以及前后端同学对数组参数的理解，以及数组parse/strinify
// 形式的多种多样，我们暂时不处理数组。
//
// a=1&a=1
// a[]=1&a[]=1
// a[0]=1&a[1]=1
// a[][b]=1
//

function stringify(obj) {
  if (!obj) {
    return '';
  } else {
    return Object.keys(obj)
      .sort()
      .map(key => {
        let val = obj[key];

        if (val === undefined) {
          return '';
        }
        if (val === null) {
          return '';
        }

        // NOTE: 如果需要传递数组，请自己和服务端商量好该如何处理
        //
        // if (Array.isArray(val)) {
        //   return val.slice().reduce((r, v) => {
        //     if (val2 === undefined) {
        //       return r;
        //     }
        //     return r.concat(encode(key) + '[]=' + encode(v));
        //   }, []).join('&');
        // }

        return encode(key) + '=' + encode(val);
      })
      .filter(x => {
        return x.length > 0;
      })
      .join('&');
  }
}

function parse(str) {
  const parts = str
        .trim()
        .replace(/^\?/, '')
        .split('&');

  return parts.reduce((r, s) => {
    let i = s.indexOf('=');
    let key;
    let val;

    if (i === -1) {
      key = decode(s);
      val = null;
    } else {
      key = decode(s.slice(0, i));
      val = decode(s.slice(i + 1));
    }

    r[key] = val;
    return r;
  }, {});
}

function encode(value) {
  return encodeURIComponent(value);
}

function decode(value) {
  return decodeURIComponent(value);
}

export default {
  stringify,
  parse
}
