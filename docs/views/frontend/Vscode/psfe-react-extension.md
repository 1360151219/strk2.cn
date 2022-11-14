---
title: 客户端下实现VScode的代码高亮功能
date: 2022-11-14
lastUpdated: 2022-11-14
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - VScode
---

# 实现一个具有差量解析算法的vscode插件

## 前言

:::tip
前情提要：本文适合于有vscode插件开发经验的同学～
:::

我们平时在写scss的时候，是否因为经常忘记了自己定义的类名而频繁地在scss和tsx文件之间切换窗口呢？为了解决这个痛点，我决定自己实现一个工具，实现在scss文件中自动提示以及补全自己定义过的类名。

链接：https://github.com/1360151219/react-class-completion

https://marketplace.visualstudio.com/items?itemName=psfe.psfe-react-extension

欢迎大家前来star哦～🌟

## Features
总体架构使用vscode lsp模型，具体样例可以去找vscode extension example。

对**相同目录下的**`scss`文件和`tsx`文件进行解析，并且将类名进行存储等逻辑处理。

- [x] 🌟 **support incremental text sync and store & incremental parse algorithm**
- [x] 🌟 **support class name completions for `scss/css` from `.tsx` files below the same dir path**.
  - [x] ordinary className in JSXAttribute.
  - [x] variable className in JSXAttribute. example：
  ```ts
  // src/index,tsx
  const prefix = 'foo';
  export const foo = () => (
    <div>
      <div className="foo">foo</div>
      <div className="foo2">foo</div>
      <div className={`${prefix}3`}>foo</div>
      <div className={`${prefix}-${prefix}-4`}>foo</div>
    </div>
  );
  ```
  - [x] listening for classname changing in `.tsx` file.(only in changed file)
- [x] 🌟 **support go to defination from classname in `scss/css` to the relative `tsx` file**


![](https://files.mdnice.com/user/37776/73e1f991-672a-4505-a815-e2ea8c2afa4c.gif)

## 实现过程

1. 使用`babel` api对`tsx`文件做解析
2. 使用`vscode-css-languageservice` api 对`scss`文件做解析
3. 🌟【重点讲解】实现lsp的**差量文本同步**以及**差量解析算法**

如果每次文本变化client都将全部文本发送到server上的话，将会浪费非常大的内存。于是vscode自身提供了差量同步的设置：
```ts
 textDocumentSync: {
    change: TextDocumentSyncKind.Incremental,
    openClose: true,// 开启open、close的事件监听
  },
  ...
  ...
  connection.onDidChangeTextDocument((param) => {
  // todo
});
```

**注意：经过测试，这里的监听事件必须放在`connection.listen();
`之后**

设置好了之后，我们将param打印出来看一看（这里我们只输入一个字符1）：

![](https://files.mdnice.com/user/37776/4423b1b8-ae5b-4ab3-b1c8-a08f87f28eb9.jpg)

我们可以发现，这里server只会接受到**修改内容**的`range`以及`text`和**修改文件路径**。我们该如何去处理好这些信息呢？这就需要去自己实现一个差量解析的算法了。

**第一步：**要想根据以上信息去获取新的内容，我们首先想到的就是对原有文件内容做一个储存。

因此这里我实现了一个`DocMap`类，本质上是一个`Map<uri,content>`结构的一个哈希表。我们将在监听`onDidOpenTextDocument`的时候对相同目录下的`tsx`文件以及`scss`文件做解析，在解析过程中把文件内容存储在我们的`DocMap`中。

**第二步：**根据接受到的差量信息更新文件内容。

实际上，这里的关键就是做一个`rangeToUpdate`的一个函数。接受参数`range`以及`text`，对之前我们存储的文件内容做更新。

要实现这个功能，我们必须利用`TextDocument`类上的方法。首先是将`range`转换成对应文本的偏移值`offset`，其次，根据原有文件的总偏移值`length`做判断。如果`startOffset`刚好等于`length`，则可以判断为是直接在文本末尾新增内容，直接添加即可；如果是小于，则是对原有文本内容做了修改，直接拼接字符串即可：`startOffset`之前的文本+`text`+`endOffset`之后的文本。

至此文件内容就实现了更新。之后再对新的文本内容做编译解析即可。

## 总结

回过头来我们可以发现这样子的一个差量编译算法的优势有哪些？

1. lsp通讯的数据量**大大减少**
2. 无需每次通过`fs`去读取文件内容，减少io操作
3. 实现以**单文件**为粒度的逻辑解析

>  我是**盐焗乳鸽还要香锅**，喜欢我的文章欢迎关注噢，github链接https://github.com/1360151219，博客链接是strk2.cn，掘金账号https://juejin.cn/user/1812428713376845


