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
