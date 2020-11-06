<!--
 * @Date: 2020-10-23 11:20:32
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-10-29 16:33:13
-->
### 懵逼踩坑汇集

1. IOS14中react-router props.history.goBack() not work in ios WeChat browser after first history.push('xxx')
   
   [react-router issue](https://github.com/ReactTraining/react-router/issues/7620)

2. 中文字体体积太大导致加载时间过长，字体加载完成前不展示预览内容，影响页面性能
  font-display: swap;使用
   
   font-display是一个新的css属性.
  
   swap: 后备文本立即显示直到自定义字体加载完成后再使用自定义字体渲染文本。在大多数情况下，这就是我们所追求的效果。之前提及到的JavaScript脚本实现的功能就基本和这个是一致的著作权归作者所有。

  ```
  @font-face { 
    font-family: `${自定义字体渲染文本}`; 
    font-style: normal; 
    src: url(`fonts/${自定义字体渲染文本}.woff2`) format("woff2"); 
    font-display: swap; 
  }
  ```

   