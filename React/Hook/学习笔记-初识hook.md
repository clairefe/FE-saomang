<!--
 * @Date: 2020-09-27 19:48:25
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-09-27 20:09:14
-->
![03f6c7dc6c05cca285894014939c4900.png](evernotecid://C6AB71DE-F981-4630-80BA-B55761DE28B1/appyinxiangcom/14994377/ENResource/p45)

1.dispatcher
是什么？
dispatcher是一个包含了hook函数的共享对象。
基于ReactDOM的渲染状态，它将会被动态的分配或者清理，并且保证用户在react组件之外获取不到hook.

dispatcher的实现方式如图
```
let currentDispatcher 
const dispatchWithoutHooks = {}
const dispatchWithHooks = {}

//每次hook的调用中都会被resloveDispatcher解析
function resloveDispatcher() {
    if(currentDispatcher) return currentDispatcher
    throw Error("Hooks can`t be called")
}

function useXXX(...args){
    const dispatcher = resloveDispatcher()
    return dispatcher.useXXX(...args)
}

function renderRoot() {
    currentDispatcher = enabeleHooks ? dispatchWithHooks : dispatchWithoutHooks
    performWork()
    currentDispatcher = null
}

```

hook 队列
在React后台，hook被表示为以调用顺序连接起来的节点。这样做原因是hook并不能简单的被创建然后丢弃。它们有一套特有的机制，也正是这些机制让它们成为hook。一个hook会有数个属性，在继续学习之前
* 初始状态在初次渲染被创建
* 状态可以在运行中更新
* 可以在后续渲染中记住hook的状态
* 据调用顺序给正确的状态
* 知道属于哪一个fiber


react团队研发hook的目的
1.在函数式组件中引入状态和生命周期函数
2.替换高阶组件和render props实现抽象和可用性（嵌套地狱）

### render props
render props模式是一种非常灵活复用性非常高的模式，它可以把特定行为或者功能封装成一个组件，提供给其他组件使用让其他组件拥有这样的能力，他把组件可以动态渲染的地方暴露给外部，你就不需要关注组件的内容实现，只要把数据通过函数传过去就好

使用场景：
1.通用业务逻辑的更改
2.当两个平级组件之间需要单向依赖的时候，譬如两个组件 A和 B ， A组件需要跟随B组件的内部状态来改变自己的内部状态，我们就说A依赖B或者B依赖A
demo　
```
<A render={b => <B b={b} /> } />
```

### Hoc
hoc是React中用于重用组件逻辑的高级技术，参数组件，返回组件

实现高阶组件的两种方式：
属性代理。高阶组件通过包裹的React组件来操作props， 更改props或者使用refs操作实例
反向继承。高阶组件继承于被包裹的react组件，用来做渲染劫持， render(return super.render())


hooks和HOC和render props有什么不同？
它们之间最大的不同在于，后两者仅仅是一种开发模式，而自定义的hooks是React提供的API模式，它既能更加自然的融入到react的渲染过程也更加符合react的函数式编程理念


##介绍下常用的Hooks
### useState()
状态钩子，为函数组件提供内部状态

```
let memoizedStates = [] 
let index = 0

function useState(initalState){
    memoizedStates[index] = memoizedStates[index] ||  initalState
    let currentIndex = index;
    function setState(newState){
        memoizedStates[currentIndex] = newState
        render()
    }
    return [memoizedStates[index++],setState]
}
```

函数式更新
如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 setState。该函数将接收先前的 state，并返回一个更新后的值。
```
const [count, setCount] = useState(0)

return <button onClick={setCount(count => count +1)}>点击</button>
```



### useEffect()
与生命周期函数对比
componentDidMount()
```
useEffect(() => {}, [])
```
componentWillUnMount()
```
useEffect(() => {
    return () => {}
}, [])
```
componentDidUpdate()
```
useEffect(() => {
    return () => {}
}, [count])
```
useEffect执行顺序问题
```
useEffect(() => {
    console.log('useEffect')
    return () => {
      console.log('useEffect cleanup')
    }
  })

  window.requestAnimationFrame(() => console.log('requestAnimationFrame'))

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    return () => {
      console.log('useLayoutEffect cleanup')
    }
  })
```
![f608da744e447c10ae5a269bc785e82c.png](evernotecid://C6AB71DE-F981-4630-80BA-B55761DE28B1/appyinxiangcom/14994377/ENResource/p60)
根据 React 的官方文档，useEffect() 和 useLayoutEffect() 都是等效于 componentDidUpdate() / componentDidMount() 的存在，但实际上两者在一些细节上还是有所不同：
useLayoutEffect是先于useEffect执行的，所以其实useLayoutEffect更等同于componentDidMount的概念吧
多个useEffect和useLayoutEffect执行顺序是按照代码书写顺序自上至下执行
那么父子组件的useEffect的执行顺序是怎么样的呢
```
//父组件代码
import React, {useState, useEffect} from 'react';
import Com1 from './Com1';
import Com2 from './Com2';
import './App.css';

function App() {
  const [com1Visible, setCom1Visible] = useState(true)
  useEffect(() => {
    console.log('parent useEffect')
    return () => {
      console.log('parent useEffect cleanup')
    }
  })
  return (
    <div className="App">
      {
        com1Visible ? <button onClick={() => {setCom1Visible(false);}}>switch Com2</button> : <button onClick={() => {setCom1Visible(true);}}>switch Com1</button>
      }
      <div style={{height: '40px'}}></div>
      {
        com1Visible ? <Com1 /> :  <Com2 />
      }
      
    </div>
  );
}

export default App;
//子组件代码
import React, {useState, useEffect, useLayoutEffect} from 'react';

export default () => {
  let [count, setCount] = useState(0)
  useEffect(() => {
    console.log('child useEffect')
    return () => {
      console.log('child useEffect cleanup')
    }
  })

  // window.requestAnimationFrame(() => console.log('requestAnimationFrame'))

  // useLayoutEffect(() => {
  //   console.log('useLayoutEffect')
  //   return () => {
  //     console.log('useLayoutEffect cleanup')
  //   }
  // })
  return <div>
    <p>=========count:==========={count}============</p>
    <button onClick={() => setCount(count++)}>add count</button>
  </div>
}

```
![ca3c9e0e87edd5b313cbd7427d2a0883.png](evernotecid://C6AB71DE-F981-4630-80BA-B55761DE28B1/appyinxiangcom/14994377/ENResource/p61)
http://www.thewashingtonhua.com/blog/2019/05/02/react-lifecycle
所以有一个结论性的回答：
1. 同步路由，父组件在 render 阶段创建子组件。
2. 异步路由，父组件在自身挂载完成之后才开始创建子组件。
3. 挂载完成之后，在更新时，同步组件和异步组件是一样的。
4. 无论是挂载还是更新，以 render 完成为界，之前父组件先执行，之后子组件先执行。
5. 兄弟组件大体上按照在父组件中的出场顺序执行。
6. useEffect 会在挂载/更新完成之后，延迟执行。
7. 异步请求（如访问 API）何时得到响应与组件的生命周期无关，即父组件中发起的异步请求不保证在子组件挂载完成前得到响应。

* * *
此次开发过程中遇到一个问题
不能够拿到最新的props或者state
所以此时我的解决方案是使用useRef
```
const statusRef = useRef()
statusRef.current = status;
//使用时直接使用statusRef.current的值
```
那么为什么回出现不能及时拿到最新的props和state的问题呢？
答案如下：
Effect拿到的总是定义它的那次渲染中的props和state。这能够避免一些bugs，但在一些场景中又会有些讨人嫌。对于这些场景，你可以明确地使用可变的ref保存一些值。如果你觉得在渲染中拿到了一些旧的props和state，且不是你想要的，你很可能遗漏了一些依赖。
### useRef()
两种使用方式

1. 渲染周期之间共享数据的存储（state不能存储跨渲染周期的数据，因为state的保存会触发组件重渲染）如上所示
2. 获取DOM元素的节点
3. 获取子组件的实例

接下来使用useRef解决获取DOM元素的节点的问题
```
import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
export default () => {
  const demoRef = useRef()
  useEffect(() => {
    console.log(demoRef.current, '====useEffect==demoRef==========')
  }, [])
  useLayoutEffect(() => {
    console.log(demoRef.current, '=====useLayoutEffect=demoRef==========')
  }, [])
  return <div>
    <span ref={demoRef}>ref demo</span>
  </div>
}
```
![51cbda94482515d0e00a35cf752fb748.png](evernotecid://C6AB71DE-F981-4630-80BA-B55761DE28B1/appyinxiangcom/14994377/ENResource/p63)

此处我们可以验证一个问题，useLayoutEffect执行时其实子组件已经挂载完成

接下来使用获取子组件的实例
但是函数组件没有实例，如果想用ref获取子组件的实例，子组件组要写成类组件
当然也可以使用forwardRef获取组件内的DOM节点
```
//子组件
import React, {Component} from 'react'
// 因为函数组件没有实例，如果想用ref获取子组件的实例，子组件组要写成类组件
class Child extends Component {
  handleLog = () => {
    console.log('Child Component');
  }
  render() {
    const { count } = this.props;
    return <h2>count: { count }</h2>
  }
}

export default Child


//父组件
import React, {useState, useEffect, useRef} from 'react';
import Child from './Childref'
import './App.css';

function App() {
  const childRef = useRef()

  useEffect(() => {
    console.log(childRef.current, "=======childRef==========")
  }, [])

  return (
    <div className="App">
      <Child  ref={childRef} />
    </div>
  );
}

export default App;

```
![16cd4acbb9c31308c2cbad45eea941cc.png](evernotecid://C6AB71DE-F981-4630-80BA-B55761DE28B1/appyinxiangcom/14994377/ENResource/p64)

### useMemo()
[把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。](https://www.teaspect.com/detail/5756)

* * *
使用场景
```
import React, {useState, useMemo} from 'react'

export default () => {
  const [count, setCount] = useState(100);
  const [changeNum, setChangeNum] = useState(100);

  function computeExpensiveValue(count) {
    console.log('computeExpensiveValue 被执行');
    //比较大计算
    const array = new Array(count).fill(count);
    return array.reduce((currentTotal, item) => {
      return currentTotal + item;
    }, 0);
  }
  const handleSetCount = () => {
    setCount(preCount => preCount * 2);
  };
  const handleChangeNum = () => {
    setChangeNum(preCount => preCount * 2);
  };
  const computeValue = useMemo(() => computeExpensiveValue(count), [count])
  return (
    <div>
      <div>{computeValue}</div>
      <div onClick={handleSetCount}>addCount{count} </div>
      <div onClick={handleChangeNum}> add changeNum {changeNum}</div>
    </div>
  );
};

```

### useCallback()
useMemo和useCallback接收的参数都是一样，都是在其依赖项发生变化后才执行，都是返回缓存的值，区别在于useMemo返回的是函数运行的结果，useCallback返回的是函数。
```
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
//在a和b的变量值不变的情况下，memoizedCallback的引用不变。即：useCallback的第一个入参函数会被缓存，从而达到渲染性能优化的目的。
```

* * *
使用场景

```
import React, {useState, memo} from 'react'

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const handleChildren = () => {
    console.log('clicked ChildrenComponent');
  };

  const handleParent = () => {
    console.log('clicked ParentComponent');
    setCount(preCount => preCount + 1);
  };

  return (
    <div>
      <div onClick={handleParent}>ParentComponent --count =={count} </div>
      <ChildrenComponent handleChildren={handleChildren} />
    </div>
  );
};

const ChildrenComponent = memo(({ handleChildren }) => {
  console.log('ChildrenComponent rending');
  return <div onClick={handleChildren}>ChildrenComponent </div>;
});


export default ParentComponent

```
![7ad76af2cde4b30b45bc60c9e4bafa56.png](evernotecid://C6AB71DE-F981-4630-80BA-B55761DE28B1/appyinxiangcom/14994377/ENResource/p65)
发现问题：
子组件在父组件count值更改时被重新渲染了
更改如下
```
import React, {useState, memo, useCallback} from 'react'

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const handleChildren = () => {
    console.log('clicked ChildrenComponent');
  };

  const handleParent = () => {
    console.log('clicked ParentComponent');
    setCount(preCount => preCount + 1);
  };

  const handleChildrenCb = useCallback(() => {
    handleChildren()
  }, [])

  return (
    <div>
      <div onClick={handleParent}>ParentComponent --count =={count} </div>
      <ChildrenComponent handleChildren={handleChildrenCb} />
    </div>
  );
};

const ChildrenComponent = memo(({ handleChildren }) => {
  console.log('ChildrenComponent rending');
  return <div onClick={handleChildren}>ChildrenComponent </div>;
});

export default ParentComponent
```
![2bf7164e970959274df9824f527838f0.png](evernotecid://C6AB71DE-F981-4630-80BA-B55761DE28B1/appyinxiangcom/14994377/ENResource/p66)
所以useCallBack的作用就是配合memo用于优化子组件的渲染次数

```
const ParentComponent = () => {
  const [count, setCount] = useState(1);
  const [updateChildrenComponentNum, setUpdateChildrenComponentNum] = useState(
    0
  );
  const handleChildren = updateChildrenComponentNum => {
    console.log(
      'clicked ChildrenComponent updateChildrenComponentNum ' +
        updateChildrenComponentNum
    );
  };
  const handleChildrenCallback = useCallback(() => {
    handleChildren(updateChildrenComponentNum);
  }, [updateChildrenComponentNum]);

  const handleParent = () => {
    console.log('clicked ParentComponent');
    setCount(preCount => preCount + 1);
    if (count % 3 === 0) setUpdateChildrenComponentNum(preNum => preNum + 1);
  };

  return (
    <div>
      <div onClick={handleParent}>ParentComponent --count =={count} </div>
      <ChildrenComponent handleChildren={handleChildrenCallback} />
    </div>
  );
};

const ChildrenComponent = memo(({ handleChildren }) => {
  console.log('ChildrenComponent rending');
  return <div onClick={handleChildren}>ChildrenComponent </div>;
});
//每点击三次就会触发ChildrenComponent渲染一次
```
此处用到了useState的函数式更新，具体请查看useState

总结：useMemo用于高性能计算，useCallBack和memo配合影响子组件的渲染
源码查看：
```
function mountMemo(nextCreate,deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateMemo(nextCreate,deps){
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 上一次的缓存结果
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```
### useContext()
React 封装好的，用来处理多层级传递数据的方式
```
const colorContext = React.createContext("gray");
function Bar() {
  const color = useContext(colorContext);
  return <div>{color}</div>;
}
function Foo() {
  return <Bar />;
}
function App() {
  return (
    <colorContext.Provider value={"red"}>
      <Foo />
    </colorContext.Provider>
  );
}
```
![e068ee9445252c022277ceebf57e5ab7.png](evernotecid://C6AB71DE-F981-4630-80BA-B55761DE28B1/appyinxiangcom/14994377/ENResource/p69)
项目中实战如下：


### useImperativeHandle()
通过 useImperativeHandle 用于让父组件获取子组件内的索引 
```
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
function ChildInputComponent(props, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);
  return <input type="text" name="child input" ref={inputRef} />;
}
const ChildInput = forwardRef(ChildInputComponent);
function App() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
    console.log(inputRef.current, "=============inputRef===============")
  }, []);
  return (
    <div>
      <ChildInput ref={inputRef} />
    </div>
  );
}

export default App;
```
![48e4fa0537036313de5d6e29da55462d.png](evernotecid://C6AB71DE-F981-4630-80BA-B55761DE28B1/appyinxiangcom/14994377/ENResource/p68)













### hooks中的坑，以及为什么？

1. 不要在循环，条件或嵌套函数中调用Hook，必须始终在React函数的顶层使用Hook。这是因为react hooks 底层是使用链表实现的，会导致next的指针执行不同，导致报错
2. 使用useState时候，使用push，pop，splice等直接更改数组对象的坑，demo中使用push直接更改数组无法获取到新值，应该采用析构方式，但是在class里面不会有这个问题
3. useEffect和useLayoutEffect区别？
useEffect是render结束后，callback函数执行，但是不会阻断浏览器的渲染，算是某种异步的方式吧。但是class的componentDidMount 和componentDidUpdate是同步的,在render结束后就运行,useEffect在大部分场景下都比class的方式性能更好.
useLayoutEffect里面的callback函数会在DOM更新完成后立即执行,但是会在浏览器进行任何绘制之前运行完成,阻塞了浏览器的绘制.
————————————————



### useDebounce()
实现
```
function debouce(fn, ms){
    let timer 
    return function(...args){
       if(timer) clearTimeout(timer)
       timer = setTimeout(()=> {
            fn(...args)
            timer = null
        }, ms)
    }
}

// 处理函数
function handle() {
    console.log(Math.random()); 
}
// 滚动事件
window.addEventListener('scroll', debounce(handle, 1000));
```
### useContext, useReducer, createContext的使用
[具体看sandbox例子，简易版本redux](https://codesandbox.io/s/thirsty-meninsky-67x6x?file=/src/App.js:435-441)


