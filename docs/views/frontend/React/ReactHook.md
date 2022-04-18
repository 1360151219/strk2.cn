---
title: React Hooks 最佳使用
date: 2022-4-18
lastUpdated: 2022-4-18
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - React
---

# React Hooks 最佳使用

目前 Vue 和 React 都具有各自的 Hooks，Hooks 的出现，是为了增加代码的复用性、可读性，将具有相似逻辑的代码或组件放在一块，形成独立的渲染环境，减少渲染次数优化性能等。

为什么我们要抛弃 React 类组件写法呢？类组件写法有一个很大的缺陷，就是它会强制分离逻辑相似的代码。比如我想要监听一个事件，那我就必须在`componentDidMount`和`componentWillUnmount`中去写监听和移除的逻辑。但是 react-hooks 写起来更有函数即组件，无疑也提高代码的开发效率

> 用 react-hooks 编写的话 ，配合 immutable 等优秀的开源库，会有更棒的效果(这里特别注意的是 ⚠️，如果乱用 hooks，不但不会提升性能，反而会影响性能，带来各种各样的想不到的问题)。

## 使用 React Hooks

### `useState` 数据存储、派发更新

`useState`可以类比于类组件中的`this.state`，`useState`的参数可以为一个初始值，也可以是一个具有复杂逻辑的函数，其返回值作为 state 的初始值。`useState`返回一个数组，数组第一项是当前的 state 值，第二项是派发更新的函数，类似`this.setState()`。而且不同的数据可以利用多个`useState()`进行处理即可，不用像类组件一样全部塞进 state 中。

**`useState` 和 `useReduce` 作为能够触发组件重新渲染的 hooks**，每一次调用 state 更新的时候都会触发整个函数组件的更新，因此要配合`useCallback()` 和 `useMemo()` 等 Hooks 进行性能优化。

```js
import React, { useState } from "react";

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

注意，当调用 state 更新函数的时候，当前 state 值并不是立即更新的。

### `useEffect` 副作用更新钩子

我们想起在 React 类组件中有着多个组件更新的生命周期钩子而导致强制分离了逻辑代码。但是在 Hooks 中就被整合成了一个，也就是`useEffect`。

在**组件第一次渲染和之后的每一次更新（props、state 改变后）**都会执行这个副作用钩子。除此之外，`useEffect`还能通过第二个参数去限制是否执行，即若该参数没有发生变化，则不会去执行新一轮的 useEffect。useEffect 第二个参数是一个数组，用来收集多个限制条件 。

除此之外，`useEffect`还可以通过返回一个函数，该函数会在每一次新的 useEffect 执行前执行。也就是用于对上一个 useEffect 的清除操作。

### `useRef` 获取元素、缓存数据

`useRef(initialValue)` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。

```js
const inputEl = useRef(null);
...
<input ref={inputEl} type="text" />
```

这是一种访问 DOM 的主要形式。除此之外，它还可以很方便的保存任何变量，类似于类组件的实例字段方式。

这是因为它创建的是一个普通 Javascript 对象。而 `useRef()` 和自建一个 `{current: ...}` 对象的唯一区别是，useRef 会在每次渲染时返回**同一个 ref 对象**。如果使用`useState`的话，其更新必定会带来整个组件的重新渲染。如果我们想要悄悄的保存数据，而又不想触发函数的更新，那么 useRef 是一个很棒的选择。

### `useImperativeHandle` 联合`forwardRef`来自定义向父组件暴露

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

该实例将父组件传入的 ref，又传进了`useImperativeHandle`中，向父组件暴露出去了 focus 方法，因此父组件在渲染`<FancyInput ref={inputRef} />`的时候，就可以调用`inputRef.current.focus()`了

### `useContext()`代替`context.Consumer`来获取`Provider`中保存的 value 值

```js
const value = useContext(MyContext);
```

`useContext()`接收一个 context 对象（`React.createContext`的返回值），返回该 context 的当前值。该值由上层组件中距离当前组件最近的`<MyContext.Provider>`的`value`来决定。

当上层组件中距离当前组件最近的`<MyContext.Provider>`更新的时候，该 Hook 会触发重新渲染，即该 context 的当前值也会更新。

下面是一个例子：

```js
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee",
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222",
  },
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

### `useMemo` 性能优化 Hook

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

`useMemo`接收一个函数和依赖项数组，它仅会在依赖项变化的时候才会重新计算 memorized 值，这种

> 记住，传入` useMemo` 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 `useMemo`。

下面来探寻一下`useMemo`的优点吧：（引自 [我不是外星人](https://juejin.cn/post/6864438643727433741#heading-9)）

1. useMemo 可以减少不必要的循环、渲染

```js
/* 用 useMemo包裹的list可以限定当且仅当list改变的时候才更新此list，这样就可以避免selectList重新循环 */
{
  useMemo(
    () => (
      <div>
        {selectList.map((i, v) => (
          <span className={style.listSpan} key={v}>
            {i.patentName}
          </span>
        ))}
      </div>
    ),
    [selectList]
  );
}
```

2. useMemo 可以减少子组件的渲染次数

当`listshow`变化的时候，子组件也不会触发重新渲染。

```js
useMemo(
  () => (
    <Modal
      width={"70%"}
      visible={listshow}
      footer={[
        <Button key="back">取消</Button>,
        <Button key="submit" type="primary">
          确定
        </Button>,
      ]}
    >
      {/* 减少了PatentTable组件的渲染 */}
      <PatentTable
        getList={getList}
        selectList={selectList}
        cacheSelectList={cacheSelectList}
        setCacheSelectList={setCacheSelectList}
      />
    </Modal>
  ),
  [listshow, cacheSelectList]
);
```

3. useMemo 让函数在某个依赖项改变的时候才运行，这可以避免很多不必要的开销

```js
const DemoUseMemo = () => {
  /* 用useMemo 包裹之后的log函数可以避免了每次组件更新再重新声明 ，可以限制上下文的执行 */
  const newLog = useMemo(() => {
    const log = () => {
      console.log(6666);
    };
    return log;
  }, []);
  return <div onClick={() => newLog()}></div>;
};
```

> 这里要注意 ⚠️⚠️⚠️ 的是如果被 useMemo 包裹起来的上下文,形成一个独立的闭包，会缓存之前的 state 值,如果没有加相关的更新条件，是获取不到更新之后的 state 的值的，如下边 👇⬇️

```js
const DemoUseMemo = () => {
  const [number, setNumber] = useState(0);
  const newLog = useMemo(() => {
    const log = () => {
      /* 点击span之后 打印出来的number 不是实时更新的number值 */
      console.log(number);
    };
    return log;
    /* [] 没有 number */
  }, []);
  return (
    <div>
      <div onClick={() => newLog()}>打印</div>
      <span onClick={() => setNumber(number + 1)}>增加</span>
    </div>
  );
};
```

这里点击打印永远输出 0

### `useCallback` useMemo 版本的回调函数

作用于`useMemo`一样，唯一区别是返回参入的函数。当父组件需要传递一个函数给子组件的时候，当父组件每一次更新的时候都会生成新的函数，这使得子组件 props 发生变化而触发更新。这个更新是十分没有必要的，这时候就可以通过`useCallback`来处理。

**注意一下**，`useCallback`必须配合`react.memo`、 `pureComponent`才可以提高性能。

## 深入聊一下 useMemo 和 useCallback

useMemo 和 useCallback 虽然都是可以进行一定的性能优化，但其实这种方式是有成本的。每一个`useMemo`、`useCallback`都是一个**闭包**，里面的垃圾数据如果得不到及时的释放就会造成内存泄漏的问题。

那我们在什么时候才需要去使用它们呢？

### 当自身是引用类型，且作为其他 Hooks 的依赖的时候

```js
export const Component: React.FC = () => {
  const [someDatas, setSomeDatas] = useState([1, 2, 3]);
  const [otherData, setOtherData] =
    useState < { bool: boolean } > { bool: true };
  const datas100 = someDatas.map((item) => {
    return item + 100;
  });
  const { bool } = otherData;
  // Effect 1
  useEffect(() => {
    console.log("Effect1 : ", datas100);
  }, [datas100]);

  // Effect 2
  useEffect(() => {
    console.log("Effect2 : ", bool);
  }, [bool]);

  return (
    <div>
      <button
        onClick={() => {
          setSomeDatas((draft) => {
            return [...draft, 1];
          });
        }}
      >
        update someDatas
      </button>
      <button
        onClick={() => {
          setOtherData((draft) => {
            return { bool: !draft.bool };
          });
        }}
      >
        update otherDatas
      </button>
    </div>
  );
};
```

当我们点击 update someDatas 的时候，会执行 Effect1，这没毛病。但当我们点击 update otherDatas 的时候，Effect1 和 Effect2 都被执行了！！

**原因**：当我们点击 update otherDatas 的时候，`bool`发生了改变，因此触发组件重新渲染，此时`datas100`和`bool`都被重新声明赋值。因为`datas100`是一个数组，因此每一次声明都是一个新的内存地址，因此在 hooks 的浅对比中始终为 false（与旧的不相等），因此 Effect1 也被执行了。

解决方法如下：

```js
const datas100 = useMemo(
  () =>
    someDatas.map((item) => {
      return item + 100;
    }),
  [someDatas]
);
```

这样的话只要`someDatas`不改变，那么`datas100`就不会更新。

### 当自身是引用类型，且作为子组件的 props

这种情况同上，将一个引用类型传递给了子组件但没有做缓存。

### 当处理数据的时间复杂度较高的时候

```js
interface Props {
  datas: number[];
  anyProps: any;
}

const Component: React.FC<Props> = ({ datas }) => {
  const str = datas.sort((a, b) => (a > b ? 1 : -1)).join("->");
  return <div>{str}</div>;
};
```

如果`datas`非常大，那每一次更新组件都需要去排序一次，非常浪费性能。
