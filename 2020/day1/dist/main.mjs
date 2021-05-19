// src/Run.mjs
import {
  readFileSync
} from "fs";

// node_modules/rescript/lib/es6/caml_array.js
function sub(x, offset, len) {
  var result = new Array(len);
  var j = 0;
  var i = offset;
  while (j < len) {
    result[j] = x[i];
    j = j + 1 | 0;
    i = i + 1 | 0;
  }
  ;
  return result;
}

// node_modules/rescript/lib/es6/curry.js
function app(_f, _args) {
  while (true) {
    var args = _args;
    var f = _f;
    var init_arity = f.length;
    var arity = init_arity === 0 ? 1 : init_arity;
    var len = args.length;
    var d = arity - len | 0;
    if (d === 0) {
      return f.apply(null, args);
    }
    if (d >= 0) {
      return function(f2, args2) {
        return function(x) {
          return app(f2, args2.concat([x]));
        };
      }(f, args);
    }
    _args = sub(args, arity, -d | 0);
    _f = f.apply(null, sub(args, 0, arity));
    continue;
  }
  ;
}
function _1(o, a0) {
  var arity = o.length;
  if (arity === 1) {
    return o(a0);
  } else {
    switch (arity) {
      case 1:
        return o(a0);
      case 2:
        return function(param) {
          return o(a0, param);
        };
      case 3:
        return function(param, param$1) {
          return o(a0, param, param$1);
        };
      case 4:
        return function(param, param$1, param$2) {
          return o(a0, param, param$1, param$2);
        };
      case 5:
        return function(param, param$1, param$2, param$3) {
          return o(a0, param, param$1, param$2, param$3);
        };
      case 6:
        return function(param, param$1, param$2, param$3, param$4) {
          return o(a0, param, param$1, param$2, param$3, param$4);
        };
      case 7:
        return function(param, param$1, param$2, param$3, param$4, param$5) {
          return o(a0, param, param$1, param$2, param$3, param$4, param$5);
        };
      default:
        return app(o, [a0]);
    }
  }
}
function __1(o) {
  var arity = o.length;
  if (arity === 1) {
    return o;
  } else {
    return function(a0) {
      return _1(o, a0);
    };
  }
}

// node_modules/rescript/lib/es6/caml_option.js
function some(x) {
  if (x === void 0) {
    return {
      BS_PRIVATE_NESTED_SOME_NONE: 0
    };
  } else if (x !== null && x.BS_PRIVATE_NESTED_SOME_NONE !== void 0) {
    return {
      BS_PRIVATE_NESTED_SOME_NONE: x.BS_PRIVATE_NESTED_SOME_NONE + 1 | 0
    };
  } else {
    return x;
  }
}

// node_modules/rescript/lib/es6/belt_Array.js
function mapU(a, f) {
  var l = a.length;
  var r = new Array(l);
  for (var i = 0; i < l; ++i) {
    r[i] = f(a[i]);
  }
  return r;
}
function map(a, f) {
  return mapU(a, __1(f));
}

// node_modules/rescript/lib/es6/belt_internalAVLset.js
function create(l, v, r) {
  var hl = l !== void 0 ? l.h : 0;
  var hr = r !== void 0 ? r.h : 0;
  return {
    v,
    h: (hl >= hr ? hl : hr) + 1 | 0,
    l,
    r
  };
}
function singleton(x) {
  return {
    v: x,
    h: 1,
    l: void 0,
    r: void 0
  };
}
function heightGe(l, r) {
  if (r !== void 0) {
    if (l !== void 0) {
      return l.h >= r.h;
    } else {
      return false;
    }
  } else {
    return true;
  }
}
function fromSortedArrayRevAux(arr, off, len) {
  switch (len) {
    case 0:
      return;
    case 1:
      return singleton(arr[off]);
    case 2:
      var x0 = arr[off];
      var x1 = arr[off - 1 | 0];
      return {
        v: x1,
        h: 2,
        l: singleton(x0),
        r: void 0
      };
    case 3:
      var x0$1 = arr[off];
      var x1$1 = arr[off - 1 | 0];
      var x2 = arr[off - 2 | 0];
      return {
        v: x1$1,
        h: 2,
        l: singleton(x0$1),
        r: singleton(x2)
      };
    default:
      var nl = len / 2 | 0;
      var left = fromSortedArrayRevAux(arr, off, nl);
      var mid = arr[off - nl | 0];
      var right = fromSortedArrayRevAux(arr, (off - nl | 0) - 1 | 0, (len - nl | 0) - 1 | 0);
      return create(left, mid, right);
  }
}
function fromSortedArrayAux(arr, off, len) {
  switch (len) {
    case 0:
      return;
    case 1:
      return singleton(arr[off]);
    case 2:
      var x0 = arr[off];
      var x1 = arr[off + 1 | 0];
      return {
        v: x1,
        h: 2,
        l: singleton(x0),
        r: void 0
      };
    case 3:
      var x0$1 = arr[off];
      var x1$1 = arr[off + 1 | 0];
      var x2 = arr[off + 2 | 0];
      return {
        v: x1$1,
        h: 2,
        l: singleton(x0$1),
        r: singleton(x2)
      };
    default:
      var nl = len / 2 | 0;
      var left = fromSortedArrayAux(arr, off, nl);
      var mid = arr[off + nl | 0];
      var right = fromSortedArrayAux(arr, (off + nl | 0) + 1 | 0, (len - nl | 0) - 1 | 0);
      return create(left, mid, right);
  }
}
function rotateWithLeftChild(k2) {
  var k1 = k2.l;
  k2.l = k1.r;
  k1.r = k2;
  var n = k2.l;
  var hlk2 = n !== void 0 ? n.h : 0;
  var n$1 = k2.r;
  var hrk2 = n$1 !== void 0 ? n$1.h : 0;
  k2.h = (hlk2 > hrk2 ? hlk2 : hrk2) + 1 | 0;
  var n$2 = k1.l;
  var hlk1 = n$2 !== void 0 ? n$2.h : 0;
  var hk2 = k2.h;
  k1.h = (hlk1 > hk2 ? hlk1 : hk2) + 1 | 0;
  return k1;
}
function rotateWithRightChild(k1) {
  var k2 = k1.r;
  k1.r = k2.l;
  k2.l = k1;
  var n = k1.l;
  var hlk1 = n !== void 0 ? n.h : 0;
  var n$1 = k1.r;
  var hrk1 = n$1 !== void 0 ? n$1.h : 0;
  k1.h = (hlk1 > hrk1 ? hlk1 : hrk1) + 1 | 0;
  var n$2 = k2.r;
  var hrk2 = n$2 !== void 0 ? n$2.h : 0;
  var hk1 = k1.h;
  k2.h = (hrk2 > hk1 ? hrk2 : hk1) + 1 | 0;
  return k2;
}
function doubleWithLeftChild(k3) {
  var k3l = k3.l;
  var v = rotateWithRightChild(k3l);
  k3.l = v;
  return rotateWithLeftChild(k3);
}
function doubleWithRightChild(k2) {
  var k2r = k2.r;
  var v = rotateWithLeftChild(k2r);
  k2.r = v;
  return rotateWithRightChild(k2);
}
function heightUpdateMutate(t) {
  var n = t.l;
  var hlt = n !== void 0 ? n.h : 0;
  var n$1 = t.r;
  var hrt = n$1 !== void 0 ? n$1.h : 0;
  t.h = (hlt > hrt ? hlt : hrt) + 1 | 0;
  return t;
}
function balMutate(nt) {
  var l = nt.l;
  var r = nt.r;
  var hl = l !== void 0 ? l.h : 0;
  var hr = r !== void 0 ? r.h : 0;
  if (hl > (2 + hr | 0)) {
    var ll = l.l;
    var lr = l.r;
    if (heightGe(ll, lr)) {
      return heightUpdateMutate(rotateWithLeftChild(nt));
    } else {
      return heightUpdateMutate(doubleWithLeftChild(nt));
    }
  }
  if (hr > (2 + hl | 0)) {
    var rl = r.l;
    var rr = r.r;
    if (heightGe(rr, rl)) {
      return heightUpdateMutate(rotateWithRightChild(nt));
    } else {
      return heightUpdateMutate(doubleWithRightChild(nt));
    }
  }
  nt.h = (hl > hr ? hl : hr) + 1 | 0;
  return nt;
}

// node_modules/rescript/lib/es6/belt_SortArrayInt.js
function sortedLengthAuxMore(xs, _prec, _acc, len) {
  while (true) {
    var acc = _acc;
    var prec = _prec;
    if (acc >= len) {
      return acc;
    }
    var v = xs[acc];
    if (prec <= v) {
      return acc;
    }
    _acc = acc + 1 | 0;
    _prec = v;
    continue;
  }
  ;
}
function strictlySortedLength(xs) {
  var len = xs.length;
  if (len === 0 || len === 1) {
    return len;
  }
  var x0 = xs[0];
  var x1 = xs[1];
  if (x0 < x1) {
    var _prec = x1;
    var _acc = 2;
    while (true) {
      var acc = _acc;
      var prec = _prec;
      if (acc >= len) {
        return acc;
      }
      var v = xs[acc];
      if (prec >= v) {
        return acc;
      }
      _acc = acc + 1 | 0;
      _prec = v;
      continue;
    }
    ;
  } else if (x0 > x1) {
    return -sortedLengthAuxMore(xs, x1, 2, len) | 0;
  } else {
    return 1;
  }
}

// node_modules/rescript/lib/es6/belt_internalSetInt.js
function get(_n, x) {
  while (true) {
    var n = _n;
    if (n === void 0) {
      return;
    }
    var v = n.v;
    if (x === v) {
      return v;
    }
    _n = x < v ? n.l : n.r;
    continue;
  }
  ;
}
function addMutate(t, x) {
  if (t === void 0) {
    return singleton(x);
  }
  var k = t.v;
  if (x === k) {
    return t;
  }
  var l = t.l;
  var r = t.r;
  if (x < k) {
    t.l = addMutate(l, x);
  } else {
    t.r = addMutate(r, x);
  }
  return balMutate(t);
}
function fromArray(xs) {
  var len = xs.length;
  if (len === 0) {
    return;
  }
  var next = strictlySortedLength(xs);
  var result;
  if (next >= 0) {
    result = fromSortedArrayAux(xs, 0, next);
  } else {
    next = -next | 0;
    result = fromSortedArrayRevAux(xs, next - 1 | 0, next);
  }
  for (var i = next; i < len; ++i) {
    result = addMutate(result, xs[i]);
  }
  return result;
}

// node_modules/rescript/lib/es6/belt_SetInt.js
var fromArray2 = fromArray;
var get2 = get;

// node_modules/rescript/lib/es6/caml_format.js
function parse_digit(c) {
  if (c >= 65) {
    if (c >= 97) {
      if (c >= 123) {
        return -1;
      } else {
        return c - 87 | 0;
      }
    } else if (c >= 91) {
      return -1;
    } else {
      return c - 55 | 0;
    }
  } else if (c > 57 || c < 48) {
    return -1;
  } else {
    return c - 48 | 0;
  }
}
function int_of_string_base(param) {
  switch (param) {
    case 0:
      return 8;
    case 1:
      return 16;
    case 2:
      return 10;
    case 3:
      return 2;
  }
}
function parse_sign_and_base(s) {
  var sign = 1;
  var base = 2;
  var i = 0;
  var match2 = s.charCodeAt(i);
  switch (match2) {
    case 43:
      i = i + 1 | 0;
      break;
    case 44:
      break;
    case 45:
      sign = -1;
      i = i + 1 | 0;
      break;
    default:
  }
  if (s[i] === "0") {
    var match$12 = s.charCodeAt(i + 1 | 0);
    if (match$12 >= 89) {
      if (match$12 >= 111) {
        if (match$12 < 121) {
          switch (match$12) {
            case 111:
              base = 0;
              i = i + 2 | 0;
              break;
            case 117:
              i = i + 2 | 0;
              break;
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 118:
            case 119:
              break;
            case 120:
              base = 1;
              i = i + 2 | 0;
              break;
          }
        }
      } else if (match$12 === 98) {
        base = 3;
        i = i + 2 | 0;
      }
    } else if (match$12 !== 66) {
      if (match$12 >= 79) {
        switch (match$12) {
          case 79:
            base = 0;
            i = i + 2 | 0;
            break;
          case 85:
            i = i + 2 | 0;
            break;
          case 80:
          case 81:
          case 82:
          case 83:
          case 84:
          case 86:
          case 87:
            break;
          case 88:
            base = 1;
            i = i + 2 | 0;
            break;
        }
      }
    } else {
      base = 3;
      i = i + 2 | 0;
    }
  }
  return [
    i,
    sign,
    base
  ];
}
function caml_int_of_string(s) {
  var match2 = parse_sign_and_base(s);
  var i = match2[0];
  var base = int_of_string_base(match2[2]);
  var threshold = 4294967295;
  var len = s.length;
  var c = i < len ? s.charCodeAt(i) : 0;
  var d = parse_digit(c);
  if (d < 0 || d >= base) {
    throw {
      RE_EXN_ID: "Failure",
      _1: "int_of_string",
      Error: new Error()
    };
  }
  var aux = function(_acc, _k) {
    while (true) {
      var k = _k;
      var acc = _acc;
      if (k === len) {
        return acc;
      }
      var a = s.charCodeAt(k);
      if (a === 95) {
        _k = k + 1 | 0;
        continue;
      }
      var v = parse_digit(a);
      if (v < 0 || v >= base) {
        throw {
          RE_EXN_ID: "Failure",
          _1: "int_of_string",
          Error: new Error()
        };
      }
      var acc$1 = base * acc + v;
      if (acc$1 > threshold) {
        throw {
          RE_EXN_ID: "Failure",
          _1: "int_of_string",
          Error: new Error()
        };
      }
      _k = k + 1 | 0;
      _acc = acc$1;
      continue;
    }
    ;
  };
  var res = match2[1] * aux(d, i + 1 | 0);
  var or_res = res | 0;
  if (base === 10 && res !== or_res) {
    throw {
      RE_EXN_ID: "Failure",
      _1: "int_of_string",
      Error: new Error()
    };
  }
  return or_res;
}

// src/Run.mjs
var numbers = map(readFileSync("input.txt", "utf-8").split("\n"), caml_int_of_string);
var numbersSet = fromArray2(numbers);
var match = numbers.find(function(n) {
  return get2(numbersSet, 2020 - n | 0) !== void 0;
});
if (match !== void 0) {
  console.log(match, 2020 - match | 0, Math.imul(match, 2020 - match | 0));
} else {
  console.log("Not Found");
}
var match$1 = match === void 0 ? void 0 : some(match);
export {
  match$1 as match,
  numbers,
  numbersSet
};
