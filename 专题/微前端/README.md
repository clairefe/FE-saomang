<!--
 * @Date: 2020-09-29 16:55:40
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-09-29 21:02:52
-->
资料：
1. https://juejin.im/post/6844903953734336525
2. https://juejin.im/post/6844903880153628680
3. https://juejin.im/post/6844903816295350279
4. https://juejin.im/post/6847902222525661197
5. https://zhuanlan.zhihu.com/p/78362028
6. https://mp.weixin.qq.com/s/p98EkrxhNtAKb9ex0eY61w
7. https://github.com/phodal/microfrontends
   
### 什么是微前端

就是将前端整体分解，每一块可以独立开发，测试和部署，同时对用户而言仍是一个整体，这种技术就是微前端
优点很多，单独开发（可以模块化升级旧的应用），应用间耦合度低（单独开发），单独部署，那么一个大的前端应该就可以交付各个不同的团队进行开发，方便进行应用拆分

### 各种不同的微前端实施方案


### 微前端实践

微前端架构的优势，其实就是MPA和SPA架构优势的合集，即保证应用具备独立开发权的同时，又有将它们整合到一起保证产品完整的流程体验的能力

SPA优势：
优点：应用直接无刷新切换，体检很好
缺点： 强耦合

MPA
优点：部署简单，各应用之间硬隔离，天生具备技术栈无关，独立开发，独立部署的特性。
缺点：页面跳转时重刷页面，体验差

那么SPA和MPA结合下，应用的架构应该是什么样呢？

![](./微前端架构图.png)

#### 路由问题解决

[single-spa](https://github.com/single-spa/single-spa)

#### app entry

加载方式： 构建时加载 和 运行时加载，
由于各个子应用要低耦合，所以采用运行时加载方式

接下来就是该怎么样加载
分为  JS entry 或者是 html entry 

JS entry 就是把所有的资源打包到一个bundle中，打出来的包体积会庞大，而且资源的并行加载的特性没有被合理的使用
```
<html>
  <head>
    <title>test!</title>
  </head>
  <body>
    <h1>Welcome to Feed me!</h1>

    <!-- 这些脚本不会马上渲染应用 -->
    <!-- 而是分别暴露全局变量 -->
    <script src="https://a.example.com/bundle.js"></script>
    <script src="https://b.example.com/bundle.js"></script>

    <div id="micro-frontend-root"></div>

    <script type="text/javascript">
      // 这些全局函数是上面脚本暴露的
      const microFrontendsByRoute = {
        '/': window.renderA,
        '/b': window.renderB,
      };
      const renderFunction = microFrontendsByRoute[window.location.pathname];

      // 渲染第一个微应用
      renderFunction('micro-frontend-root');
    </script>
  </body>
</html>

```

html entry 是 通过 Web Component 集成
其实和JS entry 有异曲同工之处，提供容器，然后进行实例化
```
<html>
  <head>
    <title>test</title>
  </head>
  <body>
    <h1>Welcome to Feed me!</h1>

     <!-- 这些脚本不会马上渲染应用 -->
    <!-- 而是分别提供自定义标签 -->
    <script src="https://a.example.com/bundle.js"></script>
    <script src="https://b.example.com/bundle.js"></script>

    <div id="micro-frontend-root"></div>

    <script type="text/javascript">
      // 这些标签名是上面代码定义的
      const webComponentsByRoute = {
        '/': 'micro-frontend-a',
        '/b': 'micro-frontend-b',
      };
      const webComponentType = webComponentsByRoute[window.location.pathname];

      // 渲染第一个微应用（自定义标签）
      const root = document.getElementById('micro-frontend-root');
      const webComponent = document.createElement(webComponentType);
      root.appendChild(webComponent);
    </script>
  </body>
</html>

```
样式表隔离

多个子应用之间会存在样式的冲突，为了避免冲突，我们采用的方式可以是动态加载样式表，同时卸载子应用时，也一起卸载样式表，是浏览器重新生成cssDOM.

那么此时html entry就可以达到卸载子应用的同时可以卸载样式表，只需要把目标元素的innerHtml置wei空

JS隔离
沙箱环境（具体实施待研究）


接下来是qiankun的使用demo
