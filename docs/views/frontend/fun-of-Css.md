---
title: CSS 原来这么有趣
date: 2022-06-12
lastUpdated: 2022-06-12
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

- `counters(name,string) `：嵌套计数器。如果其父级或往上存在指定`name`的计数器，则会嵌套，以第二个参数为分隔符。**注意，要想嵌套必须要被`counter-reset`所包裹**

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

使用`padding-right:100vw-100%`解决 SPA 在页面跳转时因为滚动条而发生抖动的问题。`100vw`是视窗宽度，减去内容宽度得到的就是滚动条的宽度了。

### `clamp()` `max()` `min()`

这三个函数都和`calc`类似，任何单位都来者不拒。

- `max(...val)` 用于返回最大值，用于限制最大值。可以类比`max-width`

- `min(...val)` 用于返回最小值，实质上也是限制最小值

- `clamp(min,val,max)` 用于返回区间值。这个我也第一次见，举个例子更好理解：

```css
.elem {
  width: clamp(100px, 25vw, 300px);
}
```

节点宽度在 100~300px 之间，如果超出则限制在 300，过小则限制在 100，如果保持在区间之间则宽度为 25vw

## CSS 变量计算

### var()

```css
:root {
  --bg-color: red;
}
.ele {
  background: var(--bg-color);
}
```

使用 CSS 变量可以提高代码可读性和维护性，同时可以很容易实现颜色主题换肤。只需要通过`document.body.style.setProperty(name,val)`即可操纵 CSS 变量值

CSS 变量有一些特点

- 类型
  - 只能作为**属性值**而不能作为属性名
  - 字符：与字符串拼接`'Hello, 'var(--name)`
  - 数值：可以被`calc`所运用计算
- 作用域
  - 只在当前作用域和子节点作用域有效，类比 JS 变量

> CSS 变量在 List 集合中使用特别好用

!()[https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f1fb111c99a4bb28348b34fe309dc30~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp]

最普通的思路，就是使用`:nth-child(n)`，列举每一个 li 的`animation-delay`，然而使用 CSS 变量结合 HTML 属性，可以非常简洁的实现这个效果：

```html
<ul class="strip-loading">
  <li v-for="v in 6" :key="v" :style="`--line-index: ${v}`"></li>
</ul>
```

```scss
.strip-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  li {
    // 通过获取html属性去定义--time，这里每一个li都有自己的一个作用域
    --time: calc((var(--line-index) - 1) * 200ms);
    border-radius: 3px;
    width: 6px;
    height: 30px;
    background-color: #f66;
    animation: beat 1.5s ease-in-out var(--time) infinite;
    & + li {
      margin-left: 5px;
    }
  }
}
@keyframes beat {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}
```

这里还有一个很漂亮的[心形加载效果](https://codepen.io/JowayYoung/pen/VwLRQyV)

[按钮悬浮效果](https://codepen.io/JowayYoung/pen/vYOPdjP)

[按钮悬浮视差](https://codepen.io/JowayYoung/pen/vYOPdjP)

## CSS 选择器

首先，很多人认为选择器有性能问题，相比类而言不怎么好。但是现在浏览器对CSS的解析速度已经有了很大的提升，因此我们并不需要去考虑这么多，这节主要来熟悉一下CSS的各种选择器。

### 基础选择器

- 标签选择器
- ID选择器
- 类选择器
- 通配符选择器

### 层次选择器

- 后代选择器：`a b`
- 子代选择器：`a>b`
- 后面相邻同胞选择器：`a+b`
- 后面全部同胞选择器：`a~b`

