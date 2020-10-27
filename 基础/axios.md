<!--
 * @Date: 2020-10-27 09:09:58
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-10-27 10:15:46
-->

### axios

axios是基于Promise的http客户端。
支持浏览器和NodeJS环境，内部有针对环境的适配方案

#### 工作内容
1. 拦截请求和响应
2. 转换响应数据
3. 客户端支持防御csrf攻击

#### 如何拦截请求和响应

首先弄明白拦截器的作用是什么？ 举例说明，请求拦截可以统一设置request请求的token， 响应拦截可以针对不同的返回code做优化处理（401跳登录）

那么axios是如何实现请求和响应拦截的呢？
来自官网的例子
```
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
```
可以看到，use方法接收两个参数，一个是fulfilled方法，一个是rejected方法
看使用方法感觉底层应该是订阅模式的实现
那么我们去翻看底层代码

```
// lib/axios.js
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

//接下来查看Axios构造函数
// lib/core/Axios.js
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
//可以看到Axios的静态属性interceptors的request和response方法都是InterceptorManager的实例。
//接下来查找InterceptorManager代码
function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

//具体触发在何处呢，我们可以去查找代码， 只拿Axios的原型方法request为例
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```
拦截请求和响应介绍完毕

#### 适配

我们知道axios在浏览器和Node.js端都可以运行，那么具体的适配是如何处理呢，内部又是怎么实现的呢，我们去翻看源码
```
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For 浏览器 use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && 
    Object.prototype.toString.call(process) === '[object process]') { 
    // For Node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}
```
总结，浏览器端XHR，Node.js使用node的http或者HTTPS模块

#### cookie设置

```
axios.defaults.withCredential = true
```


参考资源：
[axios github](https://github.com/axios/axios)
[聊聊 Axios 中值得学习的核心知识点](https://mp.weixin.qq.com/s/LzfiCas1SA0L4gJH9Oor_A)