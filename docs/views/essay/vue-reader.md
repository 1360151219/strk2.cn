---
title: 《Vuejs深入浅出》
date: 2021-7-12
categories:
  - 随笔日记
author: 盐焗乳鸽还要砂锅
tags:
  - Vue
---

# 《Vuejs 深入浅出》 读书笔记

## 1. 变化侦测

相信很多小伙伴学了 Vue 框架后，都会觉得真香，真方便，那么，Vue 的背后到底是如何来实现的呢？包括在面试，Vue 背后的响应式原理也很容易被问到。因此，响应式原理是十分重要而且功能强大的。下面我就来解读一下 Vue 的底层源码实现吧。

### 如何追踪数据变化

我们都知道，Vue 是通过`Object.defineProperty`来实现数据的拦截监听的，下面我来简单的写一下代码：

```js
function defineReactive(data, key, val) {
  let dep = new Dep();
  Object.defineProperty(data, key, {
    configurable: true /* 可修改 */,
    enumerable: true /* 可遍历 */,
    get: function() {
      dep.depend();
      return val;
    },
    set: function(newVal) {
      if (val === newVal) return;
      dep.notify();
      val = newVal;
    },
  });
}
```

> 要实现数据的响应式变化更新，就需要在 getter 收集依赖，setter 中触发依赖。那么这个*Dep*，就是封装好专门用来管理依赖的一个类。

### Vue 的三大核心类

**Dep 类:管理依赖核心，发布订阅，存储所有观察者对象(watcher)**

```js
export default class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = [];
  }
  /** 添加观察者 */
  addSub(watcher) {
    this.subs.push(watcher);
  }
  /** 发送通知 */
  notify() {
    this.subs.forEach((watcher) => {
      watch.update();
    });
  }
}
```

**Watcher:需要通知用到数据的地方。即依赖本身。每当有新数据被引用的时候，如下面 3 种引用方式，都将创建一个 Watcher 来监听该数据**

Watcher 在 Vue 里主要分为：

- **render-watcher** 即模板字符串
- **computed-watcher** 即计算方法
- **user-watcher** 即\$watch 监听器

```js
export default class Watcher {
  /**
   * vm: vue实例
   * key: data中的属性名
   * cb: 负责更新视图的回调函数
   */
  constructor(vm, key, cb) {
    this.vm = vm;
    // data中的属性名称
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb;
    // 把watcher对象记录到Dep类的静态属性target
    Dep.target = this;
    // 触发get⽅法，在get⽅法中会调⽤addSub
    this.oldValue = vm[key];
    Dep.target = null;
  }
  /** 当数据发⽣变化的时候更新视图 */
  update() {
    let newValue = this.vm[this.key];
    if (this.oldValue === newValue) {
      return;
    }
    this.cb(newValue);
  }
}
```

在获取 oldValue 之前，把 watcher 对象记录到 Dep 类的静态属性 target 中，这样在触发 get 方法的时候，就会自动把 Watcher 添加到 Dep 中。触发完之后，要及时的清理掉，因为在项目中有许许多多的 watcher，若不清理的话可能会产生某些问题。依赖注入 Dep 后，每当 date[key]发生变化，就会触发 Dep 的 notify()方法，从而触发每一个 watcher 中的 update()方法，然后执行回调函数更新数据。

**Observer:循环递归侦测所有的 key(包括子属性)，在 vue 实例初始化的时候递归侦测所有的 data**

```js
import Dep from "./Dep.js";
export default class Observer {
  constructor(value) {
    this.value = value;
    /* 只有是对象的时候，开始遍历 */
    if (!Array.isArray(value)) {
      this.walk(value);
    }
  }
  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      this.defineReactive(obj, keys[i], obj[keys[i]]);
    }
  }
  defineReactive(data, key, val) {
    if (typeof val === "object") {
      new Observer(val);
    }
    let dep = new Dep();
    Object.defineProperty(data, key, {
      configurable: true /* 可修改 */,
      enumerable: true /* 可遍历 */,
      get: function() {
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set: function(newVal) {
        if (val === newVal) return;
        dep.notify();
        val = newVal;
      },
    });
  }
}
```

现在定义好了 _Observer_ 类，它可以将一个 object 设置为响应式 object。最后在 *defineReactive*中新增 Observer 类来递归子属性，这样就完成了。

> 注意，因为 Object.defineProperty 的缺陷，我们无法对以下两种情况进行监听：

- this.obj.name=value
- delete this.obj.name

::: details
我自己写了一个[基于响应式原理的 Vue 简单框架](https://github.com/1360151219/A-person-Vue/tree/master)
:::
