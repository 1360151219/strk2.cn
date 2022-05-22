---
title: Babel Execrise 配套知识点总结
date: 2022-5-22
lastUpdated: 2022-5-22
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
  - 编译
---

# Babel Execrise 配套知识点总结

> 本文是[Babel Exercise](https://github.com/1360151219/babel-exercise)仓库练习的一个学习笔记。具体案例可以查看仓库或者[README.MD](https://github.com/1360151219/babel-exercise/blob/master/README.md)文件。

## 常见的 AST 节点

### Literal

基本字面量，有字符串、数字、布尔等等...

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29185815036a4ea1878484ba773a3b6e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### Identifier

标识符，即变量名、属性名、参数等等。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a4b54e6512a4da7ad5c99e7a61a62e9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### Statement

语句，可以单独执行的单位。每个语句间用分号或者换行隔开。

```js
break;
continue;
return;
debugger;
throw Error();
{}
try {} catch(e) {} finally{}
for (let key in obj) {}
for (let i = 0;i < 10;i ++) {}
while (true) {}
do {} while (true)
switch (v){case 1: break;default:;}
label: console.log();
with (a){}
```

### Declaration

声明语句。

```js
const a = 1;
function b() {}
class C {}

import d from "e";

export default e = 1;
export { e };
export * from "e";
```

### Expression

表达式。特点**具有返回值**。

```js
[1,2,3]
a = 1
1 + 2;
-1;
function(){};
() => {};
class{};
a;
this;
super;
a::b;
```

表达式语句解析成 AST 的时候会包裹一层`ExpressionStatement`节点，表示这个表达式是被当成语句执行的。

### Program & Directive

program 是代表整个程序的根节点，它有 body 属性代表程序体，存放 statement 数组。

directives 属性，存放 Directive 节点，比如`"use strict"`这种指令会使用 Directive 节点表示。

### File & Comment

AST 的最外层节点是 File，表示整个文件

Comment 表示注释，分为`CommentBlock`和`CommentLine`

## Babel 组件 API

- parse 阶段有`@babel/parser`，功能是把源码转成 AST
- transform 阶段有 `@babel/traverse`，可以遍历 AST，并调用 visitor 函数修改 AST，修改 AST 自然涉及到 AST 的判断、创建、修改等，这时候就需要 `@babel/types` 了，当需要批量创建 AST 的时候可以使用 `@babel/template` 来简化 AST 创建逻辑。
- generate 阶段会把 AST 打印为目标代码字符串，同时生成 sourcemap，需要 `@babel/generator` 包
- 中途遇到错误想打印代码位置的时候，使用 `@babel/code-frame` 包
- babel 的整体功能通过 `@babel/core` 提供，基于上面的包完成 babel 整体的编译流程，并实现插件功能。-

### @babel/parser

主要提供了`parse`、`parseExpression`两个 API，`parse`返回的 AST 是 File，而后者返回的是`Expression`根节点的 AST，两者粒度不同

```ts
function parse(input: string, options?: ParserOptions): File;
function parseExpression(input: string, options?: ParserOptions): Expression;
```

options 配置主要是分两类：

**parse 的内容是什么：**

- `plugins`： 指定 jsx、typescript、flow 等插件来解析对应的语法
- `allowXxx：` 指定一些语法是否允许，比如函数外的 await、没声明的 export 等
- `sourceType：` 指定是否支持解析模块语法，有 module、script、unambiguous 3 个取值，module 是解析 es module 语法，script 则不解析 es module 语法，当作脚本执行，unambiguous 则是根据内容是否有 import 和 export 来确定是否解析 es module 语法。

**以什么方式 parse**

- `strictMode` 是否是严格模式
- `startLine` 从源码哪一行开始 parse
- `errorRecovery` 出错时是否记录错误并继续往下 parse
- `tokens` parse 的时候是否保留 token 信息
- `ranges` 是否在 ast 节点中添加 ranges 属性

## parser 发展与 acorn

发展历程大致如下，详细地可以去查看《Babel 插件通关秘籍》：

nodejs->有了 parse js 的需求，Mozilla 公布了`SpiderMonkey`（基于 c++的 js 引擎）和 ast 标准->最早的 parser `esprima`-> estree 标准

再后来，`esprima`更新速度跟不上，出现了[acorn](https://github.com/acornjs/acorn-jsx),而且可以支持各式各样的插件拓展语法支持。

目前的@babel/parser(babylon)就是基于 acorn 来的，也支持了 typescript、jsx、flow 等插件。

当然，不是所有的 js parser 都是 estree 标准的，比如 terser、typescript 等都有自己的 AST 标准。

### babel parser 对 estree AST 的拓展

这些可以在 [babel parser](https://babeljs.io/docs/en/babel-parser#output) 的文档里看到。

### acorn 插件

acorn 最主要的就是一个`Parser`类，插件拓展就是通过继承这个类，重写一些方法来实现的。

举一个官网的例子：

```js
const { Parser } = require("acorn");

const MyParser = Parser.extend(require("acorn-jsx")(), require("acorn-bigint"));
console.log(MyParser.parse("// Some bigint + JSX code"));
```

插件就是一个函数，类似 babel 插件：

```js
module.exports = function noisyReadToken(Parser) {
  return class extends Parser {
    readToken(code) {
      console.log("Reading a token!");
      super.readToken(code);
    }
  };
};
```

> 这里值得注意的是，如果不加插件也可以去解析 bigint,因为在 acorn8 以后，默认是根据 ecmaVersion2020 来进行解析的，但 jsx 就不行了。

可以通过` MyParser.parse("let a=1n", { ecmaVersion: 2015 })`去设置 ecmaVersion

### 自定义 acorn 插件，解析自定义关键词

案例见[github 仓库](https://github.com/1360151219/babel-exercise)

通过这个例子，我们可以理解 babel 是怎么去基于 acorn 去实现 typescript、jsx 等第三方语法的解析了：

```js
parseLiteral(value){
    let node=super.parseLiteral(value)
    switch(typeof node.value){
        case 'number':
            node.type="NumberLiteral"
            break
        case 'string':
            node.type = 'StringLiteral';
            break;
    }
    return  node;
}
```
