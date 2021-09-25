---
title: 前端性能优化对策
date: 2021-8-31
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

## 关于防抖和节流

**节流**：通俗的来说，比如在等公交车，10 分钟一班，来多少人也不会开，必须遵循 10 分钟的轮班时间。**关键在于设置一个状态变量，在函数结束前都不会再执行。**

```ts
function throttle(fn: Function, interval: string | number) {
  let flag = true;
  return function() {
    if (!flag) return;
    flag = false;
    setTimeOut(() => {
      fn.apply(this, arguments);
      flag = true;
    }, interval);
    /*
     * 这里也可以写成以下样子
     */
    // if(!timer){
    //  timer=setTimeOut(() => {
    //      fn.apply(this, arguments);
    //      timer=null
    // }, interval);
  };
}
```

我们可以实践发现，这种节流方式是属于**头节流**

> 即第一次立即执行，最后一次提前停止后，过了`interval`时间却不会再触发。
> 不同的业务需求需要不同的节流方式，那么**尾节流**要怎么做呢？

```ts
function throttle(fn: Function, interval: string | number) {
  let last = 0;
  return function() {
    let now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, arguments);
    }
  };
}
```

那么可不可以做一个两者兼具的版本呢？

```ts
function throttle(fn: Function, interval: number) {
  let timer = null;
  let last = 0;
  return function() {
    let now = Date.now();
    let remain = interval - (now - last);
    if (remain <= interval) {
      fn.apply(this, arguments);
      last = Date.now();
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        last = Date.now();
      }, remain);
    }
  };
}
```

**防抖**: 通俗的来说，比如 LOL 里面的回城，无论你点多少次回城，回城时间的开始计算总是在最后一次点回城的时候。**关键是延时器的清除**

```typescript
function debounce(fn: Function, interval: string | number) {
  let timer = null;
  let last = 0;
  return function() {
    if (timer) clearTimeOut(timer);
    timer = setTimeOut(() => {
      fn.apply(this, arguments);
    }, interval);
  };
}
```

## 关于实现图片懒加载

首先给图片添加一个占位符

```html
<img src="default.jpg" data-src="http://www.xxx.com/target.jpg" /></img>
```

接着利用 scroll 事件监听是否到达该图片

```js
let img = document.document.getElementsByTagName("img");
let count = 0;//计数器，从第一张图片开始计

lazyload();//首次加载别忘了显示图片

window.addEventListener('scroll', lazyload);

function lazyload() {
  let viewHeight = document.documentElement.clientHeight|| document.body.clientHeight;//视口高度
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//滚动条卷去的高度
  for(let i = count; i <num; i++) {
    // 元素现在已经出现在视口中
    if(img[i].offsetTop < scrollHeight + viewHeight) {
      if(img[i].getAttribute("src") !== "default.jpg") continue;
      img[i].src = img[i].getAttribute("data-src");
      count ++;
    }
  }
```
