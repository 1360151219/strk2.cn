---
title: Vue 解读源码系列---VNode与真实DOM（二）
date: 2022-3-22
lastUpdated: 2022-3-22
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - Vue
---

## 回顾

我们回过头来继续到 `vm._init` 中来：

```js
Vue.prototype._init = function (options?: Object) {
  // ...
  initInjections(vm);
  initState(vm);
  initProvide(vm);
  callHook(vm, "created");

  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```

最后开始进行 `vm.$mount` 方法啦。顾名思义，现在就要进入 DOM 的挂载过程啦。

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};
```

这里首先对 el 节点进行一个获取（比如通过`document.querySelector()`）。然后执行`mountComponent`方法，这才是关键，下面让我们正式进入 **VNode 的渲染过程**

## Vnode 的生成

```js
export function mountComponent(vm: Component, el: ?Element): Component {
  vm.$el = el;
  // ...
  callHook(vm, "beforeMount");
  let updateComponent;
  // ....
  updateComponent = () => {
    vm._update(vm._render());
  };
}
```

... 这里先掠过

## 真实 DOM 的渲染

我们已经执行完了 `vm._render` 方法拿到了 VNode，现在将它作为参数传给 `vm._update` 方法并执行。`vm._update` 这个方法的作用就是就是将 VNode 转为真实的 Dom，不过它有两个执行的时机：

- **首次渲染** 以及 **数据驱动页面更新**

我们先来看一下`_update`方法的定义：

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this;
  const prevEl = vm.$el;
  const prevVnode = vm._vnode;
  vm._vnode = vnode;

  if (!prevVnode) {
    // initial render    vnode覆盖原来的el
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
  //... 下面注释大概意思是父组件更新的时候递归向下触发子组件更新
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
};
```

我们先来看 initial render，首先看一下`vm.__patch__`的定义吧。

```js
Vue.prototype.__patch__ = createPatchFunction({ nodeOps, modules });
```

`__patch__`即调用了`createPatchFunction`方法，它接收一个对象：

- nodeOps：封装了一些 DOM 操作 API
- modules：创建真实 Dom 也需要生成它的如 `class/attrs/style` 等属性。modules 是一个数组集合，数组的每一项都是这些属性对应的钩子方法，这些属性的创建、更新、销毁等都有对应钩子方法，当某一时刻需要做某件事，执行对应的钩子即可。

### 生成 DOM

这里首先要记住，Vue 中只会将**元素节点**、**注释节点**、**文本节点**这三种节点添加到 DOM 中去。

```js
export function createPatchFunction(backend) {
  ...
  const { modules, nodeOps } = backend  // 解构出传入的集合

  return function patch (oldVnode, vnode) {  // 接收新旧vnode
    ...

    const isRealElement = isDef(oldVnode.nodeType) // 是否是真实Dom
    if(isRealElement) {  // $el是真实Dom
      oldVnode = emptyNodeAt(oldVnode)  // 转为VNode格式覆盖自己
    }
    ...
  }
}
// ---------------------------------------------------------

function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
}
```

首次渲染的时候 oldVnode 就是 el，是一个真实 DOM，此时首先要通过`emptyNodeAt`将其变为 Vnode。

#### 普通 Vnode 的创建

那么现在我们 oldVnode 和 vnode 就都是虚拟 DOM 啦。ok，然后让我们继续看下去：

```js
return function patch(oldVnode, vnode) {
  // ...

  // replacing existing element
  const oldElm = oldVnode.elm;
  const parentElm = nodeOps.parentNode(oldElm); // 找到当前el节点的父节点 即body

  // create new node
  createElm(
    vnode,
    insertedVnodeQueue,
    oldElm._leaveCb ? null : parentElm,
    nodeOps.nextSibling(oldElm)
  );
};

// --------------------------------------------------------------------

function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
  ...
  const children = vnode.children  // [VNode, VNode, VNode]
  const tag = vnode.tag  // div

  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return  // 如果是组件结果返回true，不会继续
  }

  if(isDef(tag)) {  // 元素节点
    vnode.elm = nodeOps.createElement(tag)  // 创建父节点
    createChildren(vnode, children, insertedVnodeQueue)  // 创建子节点
    insert(parentElm, vnode.elm, refElm)  // 插入

  } else if(isTrue(vnode.isComment)) {  // 注释节点
    vnode.elm = nodeOps.createComment(vnode.text)  // 创建注释节点
    insert(parentElm, vnode.elm, refElm); // 插入到父节点

  } else {  // 文本节点
    vnode.elm = nodeOps.createTextNode(vnode.text)  // 创建文本节点
    insert(parentElm, vnode.elm, refElm)  // 插入到父节点
  }

  ...
}

//------------------------------------------------------------------

nodeOps：
export function createElement(tagName) {  // 创建节点
  return document.createElement(tagName)
}

export function createComment(text) {  //创建注释节点
  return document.createComment(text)
}

export function createTextNode(text) {  // 创建文本节点
  return document.createTextNode(text)
}

function insert (parent, elm, ref) {  //插入dom操作
  if (isDef(parent)) {  // 有父节点
    if (isDef(ref)) { // 有参考节点
      if (ref.parentNode === parent) {  // 参考节点的父节点等于传入的父节点
        nodeOps.insertBefore(parent, elm, ref)  // 在父节点内的参考节点之前插入elm
      }
    } else {
      nodeOps.appendChild(parent, elm)  //  添加elm到parent内
    }
  }  // 没有父节点什么都不做
}
// 这算一个比较重要的方法，因为很多地方会用到。
```

下面继续看一下元素节点中，`createChildren`的定义：

```js
function createChildren(vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    // 若有子节点，递归创建。
    if (process.env.NODE_ENV !== "production") {
      checkDuplicateKeys(children);
    }
    for (let i = 0; i < children.length; ++i) {
      createElm(
        children[i],
        insertedVnodeQueue,
        vnode.elm,
        null,
        true,
        children,
        i
      );
    }
  } else if (isPrimitive(vnode.text)) {
    // 创建文本节点并插入
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
  }
}
```

可见最主要的函数是`createElm`，对于元素节点，通过`createChildren`递归遍历其孩子，若是文本，则直接插入；否则递归回到`createElm`中

#### 组件 Vnode 生成 DOM

回到`createElm`中，我们走组件的逻辑分支：

```js
function createElm(vnode, insertedVnodeQueue, parentElm, refElm) {
  //...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) { // 组件分支
    return
  }
  //...
```

那么我们来看一下 `createComponent` 的定义：

```js
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data; // 通过有无 data 属性来判断是否是组件
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    // 这里其实是将组件的 init 方法赋值给了i
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      i(vnode, false /* hydrating */);
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue);
      insert(parentElm, vnode.elm, refElm);
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
      }
      return true;
    }
  }
}
```

这里执行了一下组件的`init`方法，我们来看一下它做了什么：

```js
import activeInstance from ... // 全局变量

const init = vnode => {
  const child = vnode.componentInstance =
    createComponentInstanceForVnode(vnode, activeInstance)
  ...
}

```

`activeInstance`是一个全局变量，它在`update`方法内赋值为当前实例，在当前实例做`__patch__`的时候作为子组件的父实例传入，在子组件进行`initLifecycle`的时候建立父子关系。

继续看一下`createComponentInstanceForVnode`的执行结果。

```js
export  createComponentInstanceForVnode(vnode, parent) {  // parent为全局变量activeInstance
  const options = {  // 组件的options
    _isComponent: true,  // 设置一个标记位，表明是组件
    _parentVnode: vnode,
    parent  // 子组件的父vm实例，让初始化initLifecycle可以建立父子关系
  }

  return new vnode.componentOptions.Ctor(options)  // 子组件的构造函数定义为Ctor
}
```

这里其实是将子组件的构造函数实例化，并且接收组件的 options。相当于又`new Vue`了一次，又会执行一系列子组件初始化逻辑，我们来看一下`_init`方法内，子组件在这个方法中还是有些不同的：

```js
Vue.prototype._init = function(options) {
  if(options && options._isComponent) {  // 组件的合并options，_isComponent为之前定义的标记位
    initInternalComponent(this, options)  // 区分是因为组件的合并项会简单很多
  }

  initLifecycle(vm)  // 建立父子关系
  ...
  callHook(vm, 'created')

  if (vm.$options.el) { // 组件是没有el属性的，所以到这里咋然而止
    vm.$mount(vm.$options.el)
  }
}

//----------------------------------------------------------------------------------------

function initInternalComponent(vm, options) {  // 合并子组件options
  const opts = vm.$options = Object.create(vm.constructor.options)
  opts.parent = options.parent  // 组件init赋值，全局变量activeInstance
  opts._parentVnode = options._parentVnode  // 组件init赋值，组件的vnode
  ...
}

```

由于子组件的 options 上并没有$el 属性，因此无法挂载。那么要在哪里挂载呢，当然是刚刚`init`中，我们继续补全下面的逻辑：

```ts
init :(vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      // 手动挂载，参数一般是undefined
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
```

此时我们手动挂载这个组件，然后执行`_render()`和`_update()`方法，然后执行组件的`__patch__`方法，因为`$mount`传入的是`undefined`，所以 oldVnode 也是`undefined`，会走`__patch__`内的这段逻辑：

```js
if (isUndef(oldVnode)) {
  // empty mount (likely as component), create new root element
  isInitialPatch = true;
  createElm(vnode, insertedVnodeQueue);
}
```

这次执行`createElm`时没有传入**第三个参数父节点**的，那组件创建好的 Dom 放哪生效了?这个时候执行的是组件的**patch**，所以参数 vnode 就是组件内元素节点的 vnode 了：

若此时不是组件，则创建好元素节点后插入。此时子组件的`init`方法已经完毕。我们回到`createComponent`中：

```js
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data;
  if (isDef(i)) {
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode)  // init已经完成
    }

    if (isDef(vnode.componentInstance)) {  // 执行组件init时被赋值
      initComponent(vnode)  // 赋值真实dom给vnode.elm
      insert(parentElm, vnode.elm, refElm)  // 组件Dom在这里插入
      ...
      return true  // 所以会直接return
    }
  }
}

//-----------------------------------------------------------------------

function initComponent(vnode) {
  ...
  vnode.elm = vnode.componentInstance.$el  // __patch__返回的真实dom
  ...
}

```

> 无论是嵌套多么深的组件，遇到组件的后就执行 init，在 init 的**patch**过程中又遇到嵌套组件，那就再执行嵌套组件的 init，嵌套组件完成**patch**后将真实的 Dom 插入到它的父节点内，接着执行完外层组件的**patch**又插入到它的父节点内，最后插入到 body 内，完成嵌套组件的创建过程，总之还是一个由里及外的过程。

## 尾声

我们把一开始的`mountComponent`的逻辑补全看看把：

```js
export function mountComponent(vm, el) {
  ...
  const updateComponent = () => {
    vm._update(vm._render())
  }

  new Watcher(vm, updateComponent, noop, {
    before() {
      if(vm._isMounted) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true)

  ...
  callHook(vm, 'mounted')

  return vm
}

```

这里会把`updateComponent`方法传给一个 Watcher，也就是说，在渲染 DOM 的时候，触发了响应式数据的 get，自动触发依赖收集啦。。。

> 参考资料：[飞越疯人院](https://juejin.cn/post/6844903907643113485#heading-2)
