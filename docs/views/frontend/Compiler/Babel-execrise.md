---
title: Babel Execrise 配套知识点总结
date: 2022-5-22
lastUpdated: 2022-5-25
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

常用配置如下，比如要配置 tsx：

```js
require("@babel/parser").parse("code", {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
});
```

### @Babel/traverse

`@Babel/traverse`进行 ast 的遍历和修改。主要提供了`traverse`方法：`traverse(ast,opts)`

它这里利用 visitor 遍历者模式去深度优先遍历整颗 AST。

visitor 对象的 value 是对象或者函数：

- 对象：则可以明确指定`enter`或者`exit`时调用的函数
- 函数：则默认是`enter`的时候调用

```js
visitor: {
    Identifier (path, state) {},
    StringLiteral: {
        enter (path, state) {},
        exit (path, state) {}
    }
}
```

同时可以进行多个节点的连接定义：

```js
traverse(ast, {
  "FunctionDeclaration|VariableDeclaration"(path, state) {},
});
```

#### path

`path`是我们在遍历过程中的路径，会保留其上下文信息，有很多方法和属性：

- `path.node` 当前 AST 节点
- `path.get(attr)`、`path.set(attr)` 获取、设置当前节点某属性的 path
- `path.getSibling`、`path.getNextSibling`、`path.getPrevSibling` 获取兄弟节点
- `path.findParent()` 寻找父节点

- `path.scope` 获取当前节点作用域信息
- `path.isXxx` 判断当前节点类型
- `path.assertXxx` 判断当前节点类型，不是则抛出异常

还有一系列增删改查以及跳过遍历的方法...

#### state

第二个参数 state 则是遍历过程中在不同节点间传递数据的一个状态变量，其中有`options`、`file`信息，我们也可以像 redux 等一样用 state 来共享数据。

### @babel/types

我们如果需要创建一些 AST 或者判断类型，就可以利用这个库，如：

```js
t.ifStatement(test, consequent, alternate);
t.isIfStatement(node, opts);
```

opts 可以做更多的限制条件。

### @babel/template

该库可以更方便的帮助我们创建更多的 AST。

最常见的用法是：

```js
const fn = template(`console.log(NAME)`);

const ast = fn({
  NAME: t.stringLiteral("strk2"),
});
```

### @babel/generator

将 AST 转化成目标字符串

```ts
function(ast,opts,code:string):{code,map}
```

`options` 中常用的是 `sourceMaps`，开启了这个选项才会生成 sourcemap

### @babel/code-frame

需要打印错误信息的时候，可以美化报错输出

```
const { codeFrameColumns } = require("@babel/code-frame");

try {
 throw new Error("xxx 错误");
} catch (err) {
  console.error(codeFrameColumns(`const name = guang`, {
      start: { line: 1, column: 14 }
  }, {
    highlightCode: true,
    message: err.message
  }));
}
```

### @babel/core

基于前面的包来完成整个编译流程。常用 api 如下：

```js
transformSync(code, opts);
```

opts 主要是用来配置 presets 和 plugins

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

## traverse 流程

### visitor 模式

访问者模式是经典模式的一种，当需要操作的对象结构稳定，但是操作对象的逻辑经常变化的时候，通过分离逻辑和对象结构，使其能独立拓展。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a89899432b549d198a98f404e791a97~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### path 的属性

```js
path {
    // 属性：
    node
    parent
    parentPath
    scope
    hub
    container
    key
    listKey

    // 方法
    get(key)
    set(key, node)
    inList()
    getSibling(key)
    getNextSibling()
    getPrevSibling()
    getAllPrevSiblings()
    getAllNextSiblings()
    isXxx(opts)
    assertXxx(opts)
    find(callback)
    findParent(callback)

    insertBefore(nodes)
    insertAfter(nodes)
    replaceWith(replacement)
    replaceWithMultiple(nodes)
    replaceWithSourceString(replacement)
    remove()

    traverse(visitor, state)
    skip()
    stop()
}
```

**下面属性不太常用：**

- `path.hub.file`获取最外层 File 对象，`path.hub.getScope`获取最外层作用域，`path.hub.getCode` 获取源码字符串
- `path.container` 当前 AST 节点所在的属性的属性值（这里不懂，不就是父节点 ast 嘛）
- `path.key` 当前 AST 节点所在父节点属性的属性名称
- `path.listkey` 当前 AST 节点所在父节点属性的属性值为数组时 listkey 为该属性名，否则为 undefined

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ce55f6c749d4e35ad6460de6f5be71a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b48a0cdddb4344d1b9343e04818460ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

其他属性不过多说了。。

### path.scope 作用域

```
path.scope {
    bindings // 当前作用域内声明的所有变量
    block
    parent
    parentBlock
    path // 生成作用域节点对应的 path
    references // 所有binding的引用对应的path

    dump() // 打印作用域链所有的binding
    parentBlock()
    getAllBindings() // 当前作用域到根作用域所有binding的合并
    getBinding(name) // 查找某个 binding，从当前作用域一直查找到根作用域
    hasBinding(name,noGlobals)
    getOwnBinding(name) // 仅在当前作用域查找binding
    parentHasBinding(name,noGlobals)
    removeBinding(name)
    moveBindingTo(name, scope)
    generateUid(name) // 生成作用域内唯一的名字
}
```

**scope.block**

能够形成 scope 的节点叫做 bloack 节点

```js
export type Scopable =
  | BlockStatement
  | CatchClause
  | DoWhileStatement
  | ForInStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Program
  | ObjectMethod
  | SwitchStatement
  | WhileStatement
  | ArrowFunctionExpression
  | ClassExpression
  | ClassDeclaration
  | ForOfStatement
  | ClassMethod
  | ClassPrivateMethod
  | StaticBlock
  | TSModuleBlock;
```

我们可以通过`path.scope.block`来获取当前块对应的节点。

比如`FunctionDeclaration`的 block 就是`Node{FunctionDeclaration}`

> 一般我们不需要获取生成作用域的块节点，只需要通过 path.scope 拿到作用域的信息，通过 path.scope.parent 拿到父作用域的信息。

**scope.bindings、scope.references（重点）**

作用域保存的所有变量。每一个声明叫做一个 binding

比如

```js
function foo() {
  let a = 1;
}
```

它的`path.scope.bindings`是这样的：

```js
 a: Binding {
    identifier: Node {
      type: 'Identifier',
      ...
    },
    scope: Scope ,
    path: NodePath,
    kind: 'let',
    constantViolations: [],
    constant: true,
    referencePaths: [],
    referenced: false,
    references: 0,
    hasDeoptedValue: false,
    hasValue: false,
    value: null
  }
```

- `kind`：代表了绑定的类型：`var`、`let`、`const`、`param`代表参数、`module`代表 import 声明
- `referenced`：声明的变量是否被引用
- `constant`：是否被修改过
- `referencePaths`：所有引用语句的 path
- `constantViolations`：所有修改语句的 path

## generator 阶段

generator 就是将 AST 打印成字符串，从**根节点**开始递归打印，对不同节点做不同逻辑处理，将 AST 中省略的分隔符再加回来。

比如条件表达式 ConditionExpression 的打印方式：

> 源码在`@babel/generator` 的 `src/generators`中，定义了每种节点的打印方式

```js
function ConditionalExpression(node) {
  this.print(node.test, node);
  this.space();
  this.token("?");
  this.space();
  this.print(node.consequent, node);
  this.space();
  this.token(":");
  this.space();
  this.print(node.alternate, node);
}
```

### sourcemap

generate 时可以选择是否生成 sourcemap

```js
// sourcemap
{
　　version : 3, // source map version
   file: "out.js", // 转换后文件名称
   sourceRoot : "", // 转换前文件目录，如果不变则空
   sources: ["foo.js", "bar.js"], // 转换前文件，可能有多个源文件
   names: ["src", "maps", "are", "fun"], // 转换前所有变量名和属性名
   mappings: "AAAAA,BBBBB;;;;CCCCC,DDDDD" // 转换前代码和转换后代码的映射关系的集合，用分号代表一行，每行的 mapping 用逗号分隔。
}
```

mapping 有 5 位，每一位都经过 VLQ 编码，一个字符可以表示行列数。（通过 AST 节点中的 loc 属性）

### source-map

`source-map` 用于生成和解析 sourcemap。它暴露了`SourceMapConsumer`、`SourceMapGenerator`和`SourceNode`三个类，分别用于消费、生成 sourcemap 和创建节点。

**生成 sourcemap**

1. 创建`SourceMapGenerator`对象
2. 通过`addMapping`添加一个映射
3. 通过`toString`转成 sourcemap 字符串

```js
var map = new SourceMapGenerator({
  file: "source-mapped.js",
});

map.addMapping({
  generated: {
    line: 10,
    column: 35,
  },
  source: "foo.js",
  original: {
    line: 33,
    column: 2,
  },
  name: "christopher",
});

console.log(map.toString());
// '{"version":3,"file":"source-mapped.js",
//   "sources":["foo.js"],"names":["christopher"],"mappings":";;;;;;;;;mCAgCEA"}'
```

**消费 sourcemap**

利用`SourceMapConsumer.with`的回调，去实现在目标、源代码中去查找位置信息，还能遍历所有 mapping 进行处理等。

## 代码高亮

### @Babel/code-frame

```js
const { codeFrameColumns } = require("@babel/code-frame");

const res = codeFrameColumns(
  code,
  {
    start: { line: 2, column: 1 },
    end: { line: 3, column: 5 },
  },
  {
    highlightCode: true,
    message: "这里出错了",
  }
);

console.log(res);
```

现在主要学习该插件如何做到以下 3 件事情：

#### 如何打印 code frame

我们从例子中可以判断出大致过程，通过源代码、开始和结束的位置，再区间内的每一行加上`>`，每一列加上`^`，最后打印出错误信息。

```js
let frame = highlightedLines
  .split(NEWLINE, end)
  .slice(start, end)
  .map((line, index) => {
    const number = start + 1 + index;
    const paddedNumber = ` ${number}`.slice(-numberMaxWidth);
    const gutter = ` ${paddedNumber} |`;
    const hasMarker = markerLines[number];
    const lastMarkerLine = !markerLines[number + 1];

    if (hasMarker) {
      let markerLine = "";
      // hasMarker：[14,4] 起点和marker长度
      if (Array.isArray(hasMarker)) {
        // 打印起点前的空格
        const markerSpacing = line
          .slice(0, Math.max(hasMarker[0] - 1, 0))
          .replace(/[^\t]/g, " ");
        const numberOfMarkers = hasMarker[1] || 1;
        markerLine = [
          "\n ",
          maybeHighlight(defs.gutter, gutter.replace(/\d/g, " ")),
          " ",
          markerSpacing,
          maybeHighlight(defs.marker, "^").repeat(numberOfMarkers),
        ].join("");
        // 拼接上错误信息
        if (lastMarkerLine && opts.message) {
          markerLine += " " + maybeHighlight(defs.message, opts.message);
        }
      }
      // 将>，gutter，源代码，和markerLine拼接起来
      return [
        maybeHighlight(defs.marker, ">"),
        maybeHighlight(defs.gutter, gutter),
        line.length > 0 ? ` ${line}` : "",
        markerLine,
      ].join("");
    } else {
      return ` ${maybeHighlight(defs.gutter, gutter)}${
        line.length > 0 ? ` ${line}` : ""
      }`;
    }
  })
  .join("\n");
```

> 原理省略，自行打断点调试

#### 如何实现语法高亮

`@babel/highlight`包里也有实现逻辑，利用语法分析即可。举个栗子：

```js
const a = 1;
const b = 2;
console.log(a + b);

// token数组如下

[
  ["whitespace", "\n"],
  ["keyword", "const"],
  ["whitespace", " "],
  ["name", "a"],
  ["whitespace", " "],
  ["punctuator", "="],
  ["whitespace", " "],
  ["number", "1"],
  ["punctuator", ";"],
  ["whitespace", "\n"],
  ["keyword", "const"],
  ["whitespace", " "],
  ["name", "b"],
  ["whitespace", " "],
  ["punctuator", "="],
  ["whitespace", " "],
  ["number", "2"],
  ["punctuator", ";"],
  ["whitespace", "\n"],
  ["name", "console"],
  ["punctuator", "."],
  ["name", "log"],
  ["bracket", "("],
  ["name", "a"],
  ["whitespace", " "],
  ["punctuator", "+"],
  ["whitespace", " "],
  ["name", "b"],
  ["bracket", ")"],
  ["punctuator", ";"],
  ["whitespace", "\n"],
];
```

这个 token 是利用`js-tokens`包，通过正则来识别 token，利用函数对不同的分组返回不同类型，完成 token 的识别和分类。

有了分类，再利用`chalk`来显示不同颜色就 OK 了。

#### 在控制台打印颜色

Node 中的 `console.log`的底层是 process.stdout，而 `process.stdout` 的底层又是基于 Stream 实现的，再进一步 `Stream` 的底层指向了.cc 的 c 语言文件。

控制台打印的是 ASCII 码，我们通过 ESC 来完成一些控制功能：(ESC 的 ASCII 码是 27，对应`\033`)

```js
var mix = "\033[36;1mstrk";
console.log(mix);
```

## Babel plugins、presets

### plugin 基本使用

```js
{
  plugins: [
    "pluginA",
    ["pluginB"],
    [
      "pluginC",
      {
        /* opts */
      },
    ],
  ];
}
```

### plugin 格式

**函数形式**

返回值为一个对象的函数，其中有`visitor`、`pre`、`post`..等属性

```js
export default function (api, options, dirname) {
  return {
    inherits: parentPlugin,
    manipulateOptions(options, parserOptions) {
      options.xxx = "";
    },
    pre(file) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      },
    },
    post(file) {
      console.log(this.cache);
    },
  };
}
```

首先这个函数有 3 个参数：

- api：各种 babel 的 api，如`types`、`template`等，不需要我们去引用了。
- options：外面传进来的参数
- dirname：目录名称

返回的对象的属性：

- inherits：指定继承某插件，与当前插件的 options 通过`Object.assign`来合并
- visitor：略
- pre、post：插件调用前后的 hook
  manipulateOptions：用于修改 options

**对象形式**

该形式无法处理参数。

```js
export default plugin = {
  pre(state) {
    this.cache = new Map();
  },
  visitor: {
    StringLiteral(path, state) {
      this.cache.set(path.node.value, 1);
    },
  },
  post(state) {
    console.log(this.cache);
  },
};
```

### preset

plugin 是单个转换功能的实现，而 preset 可以理解为对 plugin 的一层封装，即批量引入多个 plugin 实现转换功能。

preset 的使用格式与 plugin 一样。区别在于 preset 返回的是配置对象：

```js
export default function (api, options) {
  return {
    plugins: ["pluginA"],
    presets: [["presetsB", { options: "bbb" }]],
  };
}
```

### ConfigItem

@babel/core 提供了 `createConfigItem` 用于创建配置项

```js
const pluginA = createConfigItem("pluginA");
const presetB = createConfigItem("presetsB", { options: "bbb" });

export default obj = {
  plugins: [pluginA],
  presets: [presetB],
};
```

### 处理顺序

- 先 plugin、再 preset
- plugin 从前往后处理，preset 反过来

### 名字

一句话总结：最好是 babel-plugin-xx 和 @scope/babel-plugin-xx 这两种，就可以简单写为 xx 和 @scope/xx。如`@babel/preset-env => @babel/env`

详情请读者自行查阅。

## Babel 单元测试

babel 插件就是对 AST 做转换处理，那么我们很容易想到一些测试方式，但常用的就是测试转换后的代码，存成快照进行对比。

`babel-plugin-tester`就是这样做的。它有三种对比方式：直接对比字符串，指定输入输出的字符串进行对比，生成快照对比。

举个例子（插件是将 Identifier 变成 hh）：

```js
// index.test.js

const pluginTester = require("babel-plugin-tester").default;
const identifierReversePlugin = require("./plugin.js");

pluginTester({
  plugin: identifierReversePlugin,
  tests: {
    "case1:": "const a=1;", // 输入输出都是同个字符串
    "case2:": {
      // 指定输入输出的字符串
      code: "const a=1;",
      output: "const hh = 1;",
    },
    "case3:xxxxxx": {
      // 指定输入字符串，输出到快照文件中，对比测试
      code: `
        const a = 1;
      `,
      snapshot: true,
    },
  },
});
```

> 注意：请用`jest`的使用方式，否则会报很多错误
