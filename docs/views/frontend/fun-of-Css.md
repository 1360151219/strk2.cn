---
title: CSS 原来这么有趣
date: 2022-6-12
lastUpdated: 2022-6-12
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - CSS
---

# CSS 原来这么有趣

Html、CSS 作为前端开发人员的第一课，总是不怎么被人重视。尤其是 CSS，与普通的编程语言不同，它独特而又繁多的语法和属性，让人觉得这玩意用的时候随便查查即可。但回过头来，CSS 可以做到许许多多令人惊叹不已的视觉效果，这怎能不让人感兴趣呢？

这篇文章我打算作为本人学习路上的一个笔记，将 CSS 中好玩的东西都记录下来。

## CSS 函数计算

### `attr()`

`attr(val)`用于获取节点属性的值，通常结合伪元素的`content`来使用。比如实现移入显示 toast 的效果。

[attr 在线案例](https://codepen.io/JowayYoung/pen/voRdKX)

- `:empty`伪类：匹配没有内容的节点。使用该伪类结合伪元素还能轻松实现占位符的功能！

### `counter()`和`counters()`计数器

同上，**必须要结合伪元素来使用**

- `counter(name)`：以计数器名称为参数，返回该计数器的值
- `counter-reset:name1 val1 name2 val2`：初始化计数器，可同时初始化多个计数器用空格隔开
- `counter-increment:name step`：对指定计数器累计其计数值。html 从上往下解析时，匹配到就自动累加。

- `counters(name,string) `：嵌套计数器。如果其父级或往上存在指定`name`的计数器，则会嵌套，以第二个参数为分隔符。

利用 css 计数器可以实现自动显示有序列表等效果。
[counters 在线案例](https://codepen.io/1360151219/pen/MWQZJQO)
[counter 实现多选框效果](https://codepen.io/JowayYoung/pen/rXqRPo)

### `calc()`

`calc()`用于动态计算单位，几乎所有能计量的单位都可以当作参数参加到动态计算中去。如整数小数，长度的`px`、`vh`、`vw`，角度的`deg`、`turn`等...

但需要注意的是，`calc`遵守以下特点：

- 只能够使用四则运算`+`、`-`、`*`、`/`
- 可以使用括号提高运算等级
- **每一个运算符必须用空格隔开**，这点尤为重要，否则浏览器直接忽略
- 混合计算

如一行代码让页面自适应`font-size:calc(100vw/7.5)`，就是用比例动态计算<html>的`font-size：100/750 = x/100vw`

使用`padding-right:100vw-100%`解决 SPA 在页面跳转时因为滚动条而发生抖动的问题。
