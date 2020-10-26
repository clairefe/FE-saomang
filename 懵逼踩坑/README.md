<!--
 * @Date: 2020-10-23 11:20:32
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-10-26 09:52:41
-->
### 懵逼踩坑汇集

1. IOS14中H5页面在APP的回退中第一次有问题
   
   可能是由于react-router的版本开发

2. font-display: swap;使用
   
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

   