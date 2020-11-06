<!--
 * @Date: 2020-10-27 16:07:05
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-10-27 16:17:41
-->
### React

#### 更新机制

在react生命周期和合成事件中，setState是异步的，是因为setState事件是要放到执行更新的队列中的
那么这个队列的更新有两种形式： 1.一步到位的更新 2.分片式更新（体验更好）

#### fiber(调度)

在react15中，如果我们需要更新组件的时候，就需要遍历整个dom树进行更新，如果更新的工作量庞大的话，那么就会阻塞主线程，造成用户视觉上的卡顿以及响应的不及时

fiber是改进版本的VDOM，可以形成fiber tree,实际上它是一种琏表的结构。
每次有更新任务就需要进行任务的拆分，根据优先级来处理任务，requestAnimationFrame(高优先级)，requestIdleCallback（非高优先级，渲染引擎空闲时间执行）

