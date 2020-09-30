import _typeof from "@babel/runtime/helpers/typeof";

/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2019-02-25
 * fork from https://github.com/systemjs/systemjs/blob/master/src/extras/global.js
 */
var isIE11 = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1;

function shouldSkipProperty(global, p) {
  if (!global.hasOwnProperty(p) || !isNaN(p) && p < global.length) return true;

  if (isIE11) {
    // https://github.com/kuitos/import-html-entry/pull/32，最小化 try 范围
    try {
      return global[p] && global[p].parent === window;
    } catch (err) {
      return true;
    }
  } else {
    return false;
  }
} // safari unpredictably lists some new globals first or second in object order


var firstGlobalProp, secondGlobalProp, lastGlobalProp;
export function getGlobalProp(global) {
  var cnt = 0;
  var lastProp;
  var hasIframe = false;

  for (var p in global) {
    if (shouldSkipProperty(global, p)) continue; // 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断

    for (var i = 0; i < window.frames.length && !hasIframe; i++) {
      var frame = window.frames[i];

      if (frame === global[p]) {
        hasIframe = true;
        break;
      }
    }

    if (!hasIframe && (cnt === 0 && p !== firstGlobalProp || cnt === 1 && p !== secondGlobalProp)) return p;
    cnt++;
    lastProp = p;
  }

  if (lastProp !== lastGlobalProp) return lastProp;
}
export function noteGlobalProps(global) {
  // alternatively Object.keys(global).pop()
  // but this may be faster (pending benchmarks)
  firstGlobalProp = secondGlobalProp = undefined;

  for (var p in global) {
    if (shouldSkipProperty(global, p)) continue;
    if (!firstGlobalProp) firstGlobalProp = p;else if (!secondGlobalProp) secondGlobalProp = p;
    lastGlobalProp = p;
  }

  return lastGlobalProp;
}
export function getInlineCode(match) {
  var start = match.indexOf('>') + 1;
  var end = match.lastIndexOf('<');
  return match.substring(start, end);
}
export function defaultGetPublicPath(entry) {
  if (_typeof(entry) === 'object') {
    return '/';
  }

  try {
    // URL 构造函数不支持使用 // 前缀的 url
    var _URL = new URL(entry.startsWith('//') ? "".concat(location.protocol).concat(entry) : entry, location.href),
        origin = _URL.origin,
        pathname = _URL.pathname;

    var paths = pathname.split('/'); // 移除最后一个元素

    paths.pop();
    return "".concat(origin).concat(paths.join('/'), "/");
  } catch (e) {
    console.warn(e);
    return '';
  }
} // Detect whether browser supports `<script type=module>` or not

export function isModuleScriptSupported() {
  var s = document.createElement('script');
  return 'noModule' in s;
} // RIC and shim for browsers setTimeout() without it

export var requestIdleCallback = window.requestIdleCallback || function requestIdleCallback(cb) {
  var start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};