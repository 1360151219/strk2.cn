---
title: js深入系列之各种元素、视窗宽高
date: 2022-1-6
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

最近想自己实现一个 feeds 流的自动加载功能。这需要判断当前列表是否已经到达了底部，但我早就忘记了元素的宽高属性的一些关键词~因此想重新学一下，巩固一下基础知识，随便写篇记录更好的梳理清楚这些长得像的 API 们！

# 对于 DOM 来说：

接下来要说的一系列 dom 属性都是 dom 的固有属性，即只可读不可写（除了`scrollTop`和`scrollLeft`），且为 number 类型值

## offset

首先来说一下 offset 系列:

### offsetWidth

**返回一个元素的宽度** 注意，这只包括元素`content+padding+border`的宽度，并不包括 margin 噢，建议读者自行实验一下。下面是我的例子:

```
div {
    height: 200px;
    width: 200px;
    margin: 16px;
    padding: 10px;
    background: red;
}

const oDiv = document.querySelector(".box");
console.log(oDiv.offsetWidth)// 220
```

细心的读者也注意到了，这里返回的是一个 number 类型的值，没有'px'

### offsetHeight

同理，返回元素的高度，也是只包括`content+padding+border`

### offsetLeft 和 offsetTop

这是返回元素据其**相对坐标系**的位置值的。

## Client

### clientHeight 和 clientWidth

`clientHeight`、`clientWidth`和`offsetWidth`、`offsetHeight`的效果一毛一样，唯一的区别就是`offset`系列返回的长度是**包括**`border`的，而`client`系列是不包括`border`。

### ⭐clientLeft 和 clientTop

这里要注意：这两个 API 表示元素对于自身的偏移值。即**返回`border`的长度**

## scroll

### ⭐scrollWidth 和 scrollHeight

这两个 API 表示的是当元素内部内容超出其所定的高度和宽度的时候，**元素实际内部内容的宽高**

若内部内容并没有超出其定的宽高的话，获取的就是它所定的宽高

### ⭐scrollLeft 和 scrollTop

顾名思义，当元素内部内容超出其所定高度和宽度的时候，返回元素此时被卷起的高度和宽度。**注意这个属性是可以被写入的**，可以联想到一些锚点定位功能，原理类似。

# 对于 Window 来说：

## window 的各种宽高：outerWidth、innerWidth、outerHeight、innerHeight

`outerWidth`、`outerHeight`是获取包括浏览器所有边框总体宽高的 API

而`innerWidth`、`innerHeight`则是获取浏览器视窗的宽高，包括滚动条

> 这两种属性可以使用`document.body.clientWidth`来替换

## document.body 的宽高

对于 document 的宽高而言，我们需要兼容 IE 浏览器，即`document.body`和`document.documentElement`最好同时使用。

获取其宽高则有以下属性:

- `clientWidth`
- `clientHeight`
- `scrollWidth`
- `scrollHeight`
- `scrollLeft`
- `scrollTop`

具体细节与 DOM 的一样

# getBoundingClientRect()

`Element.getBoundingClientRect()` 返回一个元素的大小及其相对于视口的位置。（在一个 DOMRect 对象中）

这些属性根据标准盒子模型，尺寸是`width/height`+`padding`+`border`的总和
