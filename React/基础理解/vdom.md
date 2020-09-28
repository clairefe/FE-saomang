<!--
 * @Date: 2020-09-28 16:50:56
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-09-28 17:56:07
-->
1. 什么是虚拟Dom
```
VDom就是一个JS对象
```
2. 为什么要用 Virtual DOM
```
1.保证性能下限，在不进行手动优化的情况下，提供过得去的性能
看一下页面渲染的一个流程：

解析HTNL ☞ 生成DOM🌲 ☞ 生成 CSSOM ☞ Layout ☞ Paint ☞ Compiler
下面对比一下修改DOM时真实DOM操作和Virtual DOM的过程，来看一下它们重排重绘的性能消耗：

真实DOM： 生成HTML字符串 + 重建所有的DOM元素
Virtual DOM： 生成vNode + DOMDiff + 必要的dom更新
Virtual DOM的更新DOM的准备工作耗费更多的时间，也就是JS层面，相比于更多的DOM操作它的消费是极其便宜的。尤雨溪在社区论坛中说道： 框架给你的保证是，你不需要手动优化的情况下，我依然可以给你提供过得去的性能。
2.跨平台
Virtual DOM本质上是JavaScript的对象，它可以很方便的跨平台操作，比如服务端渲染、uniapp等。
```

3. Virtual DOM真的比真实DOM性能好吗

```
首次渲染大量DOM时，由于多了一层虚拟DOM的计算，会比innerHTML插入慢。
正如它能保证性能下限，在真实DOM操作的时候进行针对性的优化时，还是更快的。
```
