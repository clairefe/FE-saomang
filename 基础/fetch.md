<!--
 * @Date: 2020-10-27 09:45:18
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-10-27 15:58:11
-->
### fetch

fetch本质上是一种标准,这个标准定义了fetch JS API,同时还提供了一个全局 fetch() 方法，该方法提供了一种简单，合理的方式来跨网络异步获取资源。
这种功能以前是使用 XMLHttpRequest 实现的，Fetch 提供了一个更理想的替代方案，可以很容易地被其他技术使用，例如  Service Workers。Fetch 还提供了专门的逻辑空间来定义其他与 HTTP 相关的概念，例如 CORS 和 HTTP 的扩展。

#### fetch() 方法使用

```
//返回的是Promise对象，成功请求resolve，错误请求reject
fetch(input?: Request | string, init?: RequestInit): Promise<Response>

fetch(url, options).then(function(response) {
  // 处理 HTTP 响应
}, function(error) {
  // 处理网络错误
})
//接收可选参数input和init
//input: Request | string
<!-- options 是一个可选参数。一个配置项对象，包括所有对请求的设置。可选的参数有：
method: 请求使用的方法，如 GET、POST。
headers: 请求的头信息，包含与请求关联的Headers对象。
body: 请求的 body 信息。注意 GET 或 HEAD 方法的请求不能包含 body 信息
mode: 请求的模式，如 cors、 no-cors 或者 same-origin。
credentials: 请求的 credentials，如 omit、same-origin 或者 include。为了在当前域名内自动发送 cookie ， 必须提供这个选项。 -->
```
具体使用实例查看官网可知：
```
//html
fetch('/users.html')
  .then(function(response) {
    return response.text()
  }).then(function(body) {
    document.body.innerHTML = body
  })
//JSON
fetch('/users.json')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
//Response metadata
fetch('/users.json').then(function(response) {
  console.log(response.headers.get('Content-Type'))
  console.log(response.headers.get('Date'))
  console.log(response.status)
  console.log(response.statusText)
})
```

#### 关于fetch的注意事项

1. fetch对于状态码400，500等进行resolve处理，按照正常返回，但是response.ok为false, 网络请求失败会reject
2. credientials设置，控制请求是是否带上cookie. include：可跨域， same-origin: 同源， omit：不包含凭证
3. fetch不可以中止，无法进行超时设置。

参考资源：
[使用 Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)