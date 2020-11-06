<!--
 * @Date: 2020-09-29 15:19:53
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-11-06 17:02:38
-->
[参考资料]()

### vue3.0学习笔记
前提： 好久没有写VUE，所以此处除了对VUE3.0的学习之外，还是对2.0的一个知识的复习

demo github地址：https://github.com/clairefe/vue3demo.git

#### 差异

1. 引入了createApp
```
import { createApp } from 'vue'
const app = createApp(App)
//使用store和router的方法更改
app.use(store).use(router).mount('#app')
```
2. vue-router使用
```
const {useRoute, useRouter} from 'vue-router

setup({
  const route = useRoute()
  const router = useRouter()
  //route 
  router.push('/')
})
```
3. vuex使用
```
const {useStore} from 'vue-router

setup({
  const store = useStore()
  console.log(store.state)
})
```
4. 生命周期差异
除了beforeCreate和created使用setup(同步)代替之外，其他的生命周期函数都添加on前缀： onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured, onRenderTracked, onRenderTriggered

```
setup(){
  onMounted(() => {
    alert('1')
  })

  //错误捕获
  onErrorCaptured((error) => {

  })

  //调试
  onRenderTracked()
}
```

5. 组合式API
   
响应式ref, reactive, toRefs如何使用
举例说明，后续有源码分析
PS:所有的需要在模版中使用的内容都需要return返回

```
setup(){
  //ref使用
  const count = ref(0)

  count.value = 1

  //reactive使用
  const state = reactive({
    a: 1,
    b: 2
  })

  //如果我需要对一个对象解构赋值使用呢
  const statev2 = reactive({
    c: 3,
    d: 4
  })
  //此时需要使用toRefs
  const statev2Ref = toRefs(statev2)

  return {
    count,
    state,
    ...statev2Ref
  }
}
```

源码解析：



