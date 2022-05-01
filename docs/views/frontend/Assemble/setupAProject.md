---
title: 搭建一个前端项目原来有这么多讲究
date: 2022-5-1
lastUpdated: 2022-5-1
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - 工程化
---

# 搭建一个前端项目原来有这么多讲究

前端领域目前搭建项目的方式多种多样，如最出名的**webpack**、**Vite**等等，还有一系列脚手架如`vue-cli`、`create-react-app`等等。最原始的项目架构是一个 html 文件，通过`link`或者`script`来引入各种 css、js 文件，放在现在看来无疑是十分繁琐且令人心烦的...废话不多说，让我们来了解一下搭建项目的种种讲究吧！！

## 使用 Webpack5 的（最小化）搭建过程 ( With Babel )

首先我们需要知道，Webpack 最牛的地方就是会自动将`entry`文件以及被引用到的文件全都打包成一个 bundle js 文件，我们并不需要关注从 html 引用各种资源的过程。

### 安装/下载 & 配置 Webpack

首先我们需要下载 `webpack`、 `webpack-dev-server`、 `webpack-cli` 三件套。

```bash
// use Npm

npm install --save-dev webpack webpack-dev-server webpack-cli
```

其次我们的最简单的启动方式如下：

```bash
webpeck serve --mode development
```

但这种方式只会运行`/dist/index.html`，此时并没有任何打包过的 js 文件被引入。这也是自然的，毕竟我们并没有去配置入口文件。

我们可以做以下操作：

```bash
webpeck serve --config ./webpack.config.js --mode development

```

```js
// in ./webpack.config.js
export.modules={
    entry:path.resolve(__dirname,"./src/index.js"),
    output:{
        path:path.resolve(__dirname,"./dist"),
        filename:path.resolve(__dirname,"bundle.js")
    },
    devServer:{
        static:path.resolve(__dirname,"./dist")
    }
}
```

### 安装 & 配置 Babel

Babel 允许使用大多数浏览器还不支持的 JavaScript 特性编写代码。也许您听说过 JavaScript ES6 (ES2015)、ES7 和其他针对 JavaScript 语言的 ECMAScript 规范版本。在阅读本文时，JavaScript 语言中可能已经包含了各种版本。

- 安装

```bash
npm install --save-dev @babel/core @babel/preset-env
```

此外，如果你有 Webpack 来打包你的 JavaScript 应用程序，你必须为 Babel 安装一个 _Webpack Loader_:

```bash
npm install --save-dev babel-loader
```

```js
// 可以在.babelrc中配置
// package.json

"babel":{
    "presets":[
        "@babel/preset-env"
    ]
}
```

```js
// webpack.config.js

module: {
  rules: [
    {
      test: "/.(js)$/",
      exclude: "/./node_modules/",
      use: ["babel-loader"],
    },
  ];
}
```
