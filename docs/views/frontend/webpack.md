---
title: Webpack入门学习
date: 2021-11-6
lastUpdated: 2021-11-6
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

之前其实我也了解并且使用过 webpack，但毕竟没有系统地去完整学习一遍，所以了解的不够清楚仔细。接下来让我们来入门一波 Webpack 吧。_参考：[webpack 中文文档](https://www.webpackjs.com/)_

## 起步

- 首先是下载 webpack：`"webpack": "^4.0.1","webpack-cli": "^3.1.1"` (这里注意一下版本，最新版本存在各种报错！)

- 创建以下文本结构：

```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
    |- index.js
```

- _index.html_

引入一个`bundle.js`文件。(现在不存在，打包后就有了)

- _src/index.js_

```js
import _ from "lodash";
function component() {
  var element = document.createElement("div");
  // Lodash, now imported by this script
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  return element;
}
document.body.appendChild(component());
```

我们可以看到这里引入了一个`lodash`，待会打包的时候`Webpack`会自动帮我们把依赖关系打包好，我们就不需要去管引入顺序了。(记得先下载好 lodash)

- 尝试打包：

我们编写一个简单的 webpack 的配置文件：

_webpack.config.js_

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

然后运行：`npx webpack`，即可打包成功。

> 这里可以把命令写入 `package.json>script` 中

我们运行 index.html 文件，即可看到一个`Hello webpack`了！！

## 资源管理

### 加载 css

在 Webpack 中，加载 css 文件需要依赖两个外部包：`style-loader、css-loader`。`css-loader`用于解析 css，`style-loader`用于将 css 插入 html 头部中。

> 这里我使用的是 `"css-loader": "^3.3.0","style-loader": "^1.0.0",` 版本过高同样会出报错。我也不知道为啥~

我们可以在配置文件中配置：

```js
module: {
  rules: [
    {
      test: /\.css$/, // 表示所有以.css为后缀的文件
      use: ["style-loader", "css-loader"], // 这里注意执行顺序是从后往前
    },
  ];
}
```

然后我们创建一个 css 文件并在 `index.js` 中引入。打包后自己查看一下结果吧！

### 加载图像或字体资源

我们需要用到`file-loader`，首先下载：`npm install --save-dev file-loader`

然后在 Webpack 中配置：

```js
{
    test: /\.(jpg|png|svg|gif)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                publicPath: 'assets',// 规定打包后文件引用的路径
                outputPath: 'assets'// 规定打包后文件的输出路径
            },
        }
    ],

}
```

## 管理输出

### HtmlWebpackPlugin

`npm install --save-dev html-webpack-plugin@4.5.0`

它负责根据配置文件来对你的 index.html 进行一个动态的依赖绑定。这就解决了当入口文件名字改变甚至增加新入口时候的 index.html 引用需要手动更改的问题。

```js
plugins: [
  new HtmlWebpackPlugin({
    title: "htmlwebpackplugin",
    // template 可以根据模板HTML来生成
  }),
];
```

### CopyWebpackPlugin

可以 copy 一些静态资源到指定目录中去。实例：

```js
new copyPlugin({
      patterns: [
        {
          // from: path.join(__dirname, "./public/*.ico"),
          from: "./public/*.ico",
          to: path.resolve(__dirname, "./dist/favicon.ico"),
          context: "./",
        },
        {
          from: "./public/libs",
          to: path.resolve(__dirname, "./dist/libs"),
        },
      ],
    }),
```

### CleanWebpackPlugin

在`./dist`文件夹中遗留着我们之前打包的各种文件。我们需要做的是，当每次打包的时候，只会生成需要的文件即清理 dist 文件夹。这就需要使用`clean-webpack-plugin@3.0.0`了

> 注意这里有一个坑：引用的时候必须要解构：`const { CleanWebpackPlugin } = require('clean-webpack-plugin')`

### manifest

你可能会很感兴趣，webpack 和 webpack 插件似乎“知道”应该哪些文件生成。答案是，webpack 通过 `manifest`，可以追踪所有模块到输出 bundle 之间的映射。

## 开发环境

为了提高我们在开发程序时候的代码，我们可以设置一些参数。首先要设置一个模式：`mode:'development'`

### sourcemap

为了能够快速的找到程序 bug，我们可以引入 sourcemap:`devtool: 'inline-source-map',`

### 使用 webpack-dev-server

`webpack-dev-server` 为你提供了一个简单的 web server，并且具有 live reloading(实时重新加载) 功能。设置如下：

```js
npm install --save-dev webpack-dev-server@3
```

同时给 script 加一个命令：`"start": "webpack-dev-server --open"`. `open`表示会自动打开一个窗口

> webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 **publicPath** 选项进行修改。

```js
devServer: {
  port: 8080,
  hot: true,// 局部更新
  compress: true,//是否压缩
  open: true,// 自动打开浏览器
  contentBase: 'dist'
}
```

**模块热替换(ModuleHotReplacement)**

HMR 是 webpack 最有用的功能之一，它可以在 devsever 运行的时候更新所有依赖的包而不需要重新刷新。

```js
const webpack = require("webpack");
// ...
// plugins >
new webpack.HotModuleReplacementPlugin();
// ...
// devServer>
hot: true;
```

为了监视 HMR 的行为，我们可以在 index.js 中编写以下代码：

```js
if (module.hot) {
  module.hot.accept("./print.js", function () {
    console.log("Accepting the updated printMe module!");
  });
}
```

则当触发 HMR 的时候，会执行下面的代码。但是这里有一个问题，热更新后点击按钮打印出来的还是之前的字符串。原因是因为原来的事件仍绑定在按钮上没有变化。解决方法也很简单，只需要更新一下 element 就 OK 了。

```js
let element = component(); // 存储 element，以在 print.js 修改时重新渲染
document.body.appendChild(element);

if (module.hot) {
  module.hot.accept("./print.js", function () {
    console.log("Accepting the updated printMe module!");
    document.body.removeChild(element);

    element = component(); // 重新渲染 "component"，以便更新 click 事件处理函数
    document.body.appendChild(element);
  });
}
```

## 生产环境

### 配置

根据官方文档的说明，生产环境的目标关注点在于压缩 bundle、更轻量的 source map、资源优化等，通过这些优化方式改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。

我们使用`webpack-merge`包，可以对不同的配置文件进行合并。这里我用官方给的例子来展示一下：

**webpack.common.js**

```js
+ const path = require('path');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');
+
+ module.exports = {
+   entry: {
+     app: './src/index.js'
+   },
+   plugins: [
+     new CleanWebpackPlugin(['dist']),
+     new HtmlWebpackPlugin({
+       title: 'Production'
+     })
+   ],
+   output: {
+     filename: '[name].bundle.js',
+     path: path.resolve(__dirname, 'dist')
+   }
+ };
```

**webpack.dev.js**

```js
+ const merge = require('webpack-merge');
+ const common = require('./webpack.common.js');
+
+ module.exports = merge(common, {
+   mode: 'development',
+   devtool: 'inline-source-map',
+   devServer: {
+     contentBase: './dist'
+   }
+ });
```

**webpack.prod.js**

```js
+ const merge = require('webpack-merge');
+ const common = require('./webpack.common.js');
+
+ module.exports = merge(common, {
+   mode: 'production',
+ });
```

当我们 mode 设置为生产环境的时候，会自动引入压缩文件插件以及树摇功能(删去没有用到的函数方法变量)

为了更好的使用这些不同的配置文件，我们在 npm script 中设置：

```js
"scripts": {
     "start": "webpack-dev-server --open --config webpack.dev.js",
     "build": "webpack --config webpack.prod.js"
    },
```

### 指定 mode

我们可以引入的文件中使用`process.env.NODE_ENV`来获取当前的环境，用于做不同的逻辑处理。

> 在`webpack.config.js` 中失效。

### source map

在生产环境中，我们使用的工具是`source-map`而不是`inline-source-map`。

官方上说：**避免在生产中使用 `inline-...` 和 `eval-...`**，因为它们会增加 bundle 体积大小，并降低整体性能。

## 更多知识

除了官方文档以外，我还看到了许多有用的 webpack 博客：

- [webpack 常用基本配置](https://juejin.cn/post/6870388131741302798#heading-3)
