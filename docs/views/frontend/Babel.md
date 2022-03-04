---
title: Babel （未完待续）
date: 2022-3-4
lastUpdated: 2022-3-4
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

# Babel

## About Babel

Babel 是一个通用的 JavaScript 编译器。就是因为有了 Babel 我们才可以使用一些新的 API 甚至一些尚未存在的标准语法和特性。

比如，Babel 可以将 ES2015 的箭头函数

```js
const square = (n) => n * n;
```

编译成：

```js
const square = function square(n) {
  return n * n;
};
```

不过 Babel 的用途并不止于此，它支持语法扩展，能支持像 React 所用的 JSX 语法，同时还支持用于静态类型检查的流式语法（Flow Syntax）。

更重要的是，Babel 的一切都是简单的插件，谁都可以创建自己的插件，利用 Babel 的全部威力去做任何事情。

再进一步，Babel 自身被分解成了数个核心模块，任何人都可以利用它们来创建下一代的 JavaScript 工具。

## 安装 Babel

我们可以通过安装 Babel-cli 来使用 Babel

```
$ npm install babel-cli --save-dev
```

安装后，可以通过以下命令进行 babel 的编译：

```
$ npx babel index.js // 这将会把编译结果输出在终端上

$ npx babel index.js --out-file bound.js // 编译成一个文件 （或者 -o）

$ npx babel src --out-dir dist // 编译成一个文件夹（或 -d）
```

## babel-core

如果你需要用变成的形式来使用 Babel，则需要`babel-core`这个包。

字符串形式的 JavaScript 代码可以使用`babel.transform`来进行编译：

```js
babel.transform(code)
=> { code, map, ast }
```

# 配置 Babel

上面的过程中我们通过 babel 只是简简单单的拷贝了一遍代码。这是因为 Babel 虽然很强大但是需要我们去给他规定要编译什么。

## `.babelrc`

首先我们要创建一个配置文件，在根目录下创建`.babelrc`文件。输入以下内容作为开始：

```js
{
  "presets": [],// 预设
  "plugins": []
}
```

### babel-preset-es2015

这个插件可以让我们将最新版本的 JavaScript 代码编译成 ES5。

我们直接修改配置文件：

```js
  {
    "presets": [
        "es2015"
    ],
    "plugins": []
  }
```

### babel-preset-react

### babel-preset-stage-x

## 执行 Babel 生成的代码

即使使用 Babel 编译了代码之后，这还不算结束噢

### babel-polyfill / @babel/polyfill

Polyfill 顾名思义，可以将当前运行环境中用的较新 API，做一个兼容性补丁。比如`Array.from`，并不是所有的 JavaScript 环境都支持这个方法。

最简单的引用，只需要在文件第一行引入即可。

```js
import "babel-polyfill";
```

或者通过在 `@babel/env` 的设置中使用

# Babel 插件介绍

我们已经知道了，Babel 是一个 JavaScript 编译器，准确来说是一个**源码到源码**的一个编译器。即你可以给 babel 提供一些代码，babel 进行修改后返回给你。

那么，我们就有理由可以相信，可以自己写一个插件来操作 Babel 去处理代码。

## 抽象语法树 AST

在 Babel 处理代码过程中，每一步涉及到的操作都是对 AST 进行的。

> [AST Explorer](http://astexplorer.net/) 这是一个很好的 AST 展示的网站

比如一段代码如下：

```js
const foo = () => {
  console.log(foo);
};
```

那么它的 AST 结构如下：

```js
{
    "type": "VariableDeclaration",
      "start": 0,
      "end": 42,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 41,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 9,
            "name": "foo"
          },
          "init": {
            "type": "ArrowFunctionExpression",
            "start": 12,
            "end": 41,
            "id": null,
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 18,
              "end": 41,
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 22,
                  "end": 39,
                  "expression": {
                    "type": "CallExpression",
                    "start": 22,
                    "end": 38,
                    "callee": {
                      "type": "MemberExpression",
                      "start": 22,
                      "end": 33,
                      "object": {
                        "type": "Identifier",
                        "start": 22,
                        "end": 29,
                        "name": "console"
                      },
                      "property": {
                        "type": "Identifier",
                        "start": 30,
                        "end": 33,
                        "name": "log"
                      },
                      "computed": false,
                      "optional": false
                    },
                    "arguments": [
                      {
                        "type": "Identifier",
                        "start": 34,
                        "end": 37,
                        "name": "foo"
                      }
                    ],
                    "optional": false
                  }
                }
              ]
            }
          }
        }
      ],
      "kind": "const"
    }
```

我们可以发现它其实是分层的，每一层的属性结构都差不多，我们只需要去注意其中的关键属性：比如`VariableDeclaration`,`kind`,`id`,`type`、`id`、`name`、`operator`、`left`、`right`...

## Babel 的处理步骤

**解析(parse)**、**转换(transform)**、**生成(generate)**

### 解析

接收代码并输出 AST，这个步骤分为*词法分析*和*语法分析*

- **词法分析**

词法分析阶段将代码转换为令牌流（token）。可以看作是一个扁平的语法片段数组。

> 在 AST Explorer 中没有

这里举一个官方的例子：

```js
n * n;
```

```
[
  { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
  ...
]
```

然后每一个`type`都有属性来描述该令牌

```
{
  type: {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    rightAssociative: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  ...
}
```

- **语法分析**

此时会将令牌流转换成 AST 的形式。

### 转换

转换阶段接收 AST 并且对其进行遍历。遍历过程中可以进行节点的操作。这才是插件需要工作的重要阶段。（dfs 遍历）

### 生成

将 AST 转换为字符串的代码。

## 遍历

当我们进入一个 ast 节点的时候，需要用到一个访问者模式的概念。

简单来说就是一个对象，定义在遍历 ast 中获取具体节点的方法。

因为 AST 遍历是一次 dfs 遍历，因此每个节点实际上经过了 **2 次**

那么现在我们来自己动手试一下，将以下代码的`const`改成`var`、将箭头函数变成普通函数吧。

```js
const f = () => {
  console.log("f");
};
```

> 这里需要用到一些 babel 组件，但我下面的实现引用的插件是旧版本的：`@babel/parser`、`babel-traverse`、`babel-generator`、`babel-types`

```js
const babel = require("babylon");
const traverse = require("babel-traverse").default;
const generator = require("babel-generator").default;
const types = require("babel-types");

const code = `const f = () => {
    console.log('f')
}`;

let ast = babel.parse(code);
traverse(ast, {
  // 访问者模式 对象
  VariableDeclaration: {
    exit(path) {
      const node = path.node;
      node.kind = "var";
    },
  },
  ArrowFunctionExpression: {
    exit(path) {
      const node = path.node;
      let id = node.id;
      let params = node.params;
      let body = node.body;
      let functionExpression = types.functionExpression(
        id,
        params,
        body,
        false,
        false
      );
      path.replaceWith(functionExpression);
    },
  },
});
let res = generator(ast, {}, code);

console.log(res.code);

// var f = function () {
//     console.log('f');
// };
```

## Path 路径

上面访问者模式中的参数`path`就是路径，它表示了节点之间的关联关系。

而且注意，path 是一个节点在树中的位置以及关于该节点各种信息的**响应式 Reactive 表示**

如果我们这么做（上述例子）：

```js
    ArrowFunctionExpression: {
        exit(path) {
            console.log(path.parent.id.name = 'changeFoo');
            const node = path.node
            let id = node.id
            let params = node.params
            let body = node.body
            let functionExpression = types.functionExpression(id, params, body, false, false)
            path.replaceWith(functionExpression)
        }
    }
```

那么结果就会变成：

```js
var changeFoo = function () {
  console.log("f");
};
```

## 作用域和绑定

在 ast 中，你甚至可以知道每个节点的作用域以及作用域和引用之间的关系（绑定）。

## Babel 模块
