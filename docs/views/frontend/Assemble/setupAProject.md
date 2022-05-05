---
title: 搭建一个前端项目原来有这么多讲究---Webpack5（一）
date: 2022-5-1
lastUpdated: 2022-5-4
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - 工程化
---

# 搭建一个前端项目原来有这么多讲究（一）

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

## 继续完成一个较 Advanced 的 Webpack5 项目

在前面的过程中，我们知道了 Webpack 除了可以自动帮我们打包所有的 js 文件、通过 Babel 来转译最新的 JavaScript 特性之外，还能通过 Dev Server 来启动开发环境下的项目。

然而 Webpack 还能干更多的事情，比如在发布的时候，Webpack 可以帮助您构建一个生产就绪包，其中包含对您的源代码的所有优化。

### Webpack 生产环境&开发环境的构建

前面的 Dev server 能够帮我们启动开发环境下的项目、并且实时绑定、热更新。但此时 bundle.js 文件是不可见的。

现在我们想要构建出生产环境中的项目，就需要通过：

```bash
webpack --config ./webpack.config.js --mode production
```

等到命令执行完毕，我们可以看到 dist/bundle.js 文件不是即时生成的，而是在 dist/ 文件夹中真实创建的。

> 另请注意，Webpack 开发和生产模式都有自己的默认配置。开发模式创建源代码文件时考虑到了改进的开发人员体验，而生产构建对源代码进行了所有优化。

### 如何管理你的 Webpack build folder

每一次当你去运行`npm run build`的时候，Webpack 都会创建一个全新版本的 _./dist/bundle.js_ 文件。最终，你的 dist 文件夹就会变得很复杂，而且你不知道哪一个 bundle.js 是你最新一次构建得。

因此我们需要在每一次 build 的时候先清空 dist 文件夹。（还需要重新创建 index.html）
这就需要`html-webpack-plugin`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },
  devServer: {
    static: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
```

现在运行 build 后，就会生成一个`/dist/index.html`文件了，你可以看到它的一个默认模板：

```html
/dist/index.html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Webpack App</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <script defer="defer" src="bundle.js"></script>
  </head>
  <body></body>
</html>
```

现在我想要去自定义一下 html 模板，那我可以去自己定义一个 html 文件，并且添加以下配置。

```js
...
plugins: [new HtmlWebpackPlugin({
    title: "Hello HtmlWebpackPlugin",
    template: path.resolve(__dirname, "./src/index.html")
  })]
...
```

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body></body>
</html>
```

而且我们也**不需要去手动引用 `bundle.js`！！！**

下一步我们需要使用`clean-webpack-plugin`来去清空 dist 文件夹。

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
...
plugins: [
    new HtmlWebpackPlugin({
      title: "Hello HtmlWebpackPlugin2",
      template: path.resolve(__dirname, "./src/index.html")
    }),
    new CleanWebpackPlugin()
  ]
```

### Webpack Source Map

Webpack 帮我们打包文件固然很好，但也有缺陷。当我们发现一个 bug 并且想要从浏览器控制台查看的时候，无法去追踪 bug 位置，因为文件被打包过了。

此外在生产环境上，一旦您单击 bundle.js 文件，您只会看到 Webpack 捆绑的用于生产的 JavaScript，其格式不可读。

为了解决这个问题，source maps 可以给了 Webpack 一个至源代码的引用，即可以从打包后代码追溯到源代码上。

```js
./webpack.config.js
...
devtool:'source-map'
```

再 build 之后，有一个名为 dist/bundle.js.map 的新文件用于执行来自 src/ 的实际源代码与 dist/bundle.js 中捆绑的 JavaScript 之间的映射。而且在生产环境中去点击控制台的 bug 也会跳转至源代码具体位置中去。

### Webpack 生产 / 开发环境的两种配置

> 最终示例地址：https://github.com/1360151219/minimal-webpack5-setup/tree/webpack-distinct-configuration

我们应该将生产、开发环境的两种配置文件分开。

```json
{
  ...
  "scripts": {
    "start": "webpack serve --config ./webpack.dev.js",
    "build": "webpack --config ./webpack.prod.js",
    "test": "echo \"Error: no test specified\" && exit 0"
  },
  ...
}
```

然后将之前的配置文件复制出两份：

```js
webpack.dev.js;

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./src/index.js"),
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },
  devServer: {
    static: path.resolve(__dirname, "./dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Hello HtmlWebpackPlugin2",
      template: path.resolve(__dirname, "./src/index.html"),
    }),
    new CleanWebpackPlugin(),
  ],
};
```

```js
webpack.prod.js;

module.exports = {
  ...
  mode: "production",
  ...
}
```

这看似重复引用，那我们为什么要这样去做呢？在一个逐步完善迭代的 Webpack 项目中，我们将会去引用各种 plugins、loaders、sourcemap，这些在生产环境和开发环境中会表现得不同。就以 Source Map 为例，为一个大型项目去构建 source map 映射是一件很繁重的任务，为了让开发者能够有更快更高效的开发体验，您希望开发中的源映射不像生产构建中的源映射那样 100% 有效。

因此以下操作只在 `webpack.dev.js` 中进行：

```js
module.exports={
  ...
  devtool: "eval-source-map";
  ...
}
```

> 1. **源码映射** 会单独生成一个 sourcemap 文件，代码出错时，会标识当前报错的列和行(大而全)：
>    `devtool:‘source-map’`
> 2. 不会产生单独的文件，但是可以显示行和列：
>    `devtool:‘eval-source-map’`
> 3. 不会产生列，但是是一个单独的映射文件：
>    `devtool:‘cheap-module-source-map’`
> 4. 不会生成文件，集成在打包后的文件中，不会产生列：
>    `devtool:‘cheap-module-eval-source-map’`

### Webpack 合并配置文件

> 最终示例地址：https://github.com/1360151219/minimal-webpack5-setup/tree/webpack-automaticly-merge-configuration

现在我们的 Webpack 两种配置文件其实有着很多相同的代码配置，为什么我们不将公共部分提取出来使用，只根据环境的不同选择特定的配置呢？

很简单，我们只需要在运行时命令中去动态传一个 env 参数即可。

```js
"scripts": {
    "start": "webpack serve --config build-utils/webpack.config.js --env env=dev",
    "build": "webpack --config build-utils/webpack.config.js --env env=prod",
  },
```

我们在新建了一个`build-utils`文件夹，并且引用了同一个文件，它接收一个 env 参数并且能够动态去与特定环境的 configuration 合并。这里通过`webpack-merge`这个第三方包来实现合并。

```js
/webpack.config.js

const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
module.exports = ({ env }) => {
  const envConfig = require(`./webpack.${env}.js`);
  return merge(envConfig, commonConfig);
};
```

```js
/webpack.common.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['*', '.js'],
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js',
    },
    devServer: {
        static: path.resolve(__dirname, '../dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Hello HtmlWebpackPlugin2",
            template: path.resolve(__dirname, "../src/index.html")
        }),
        new CleanWebpackPlugin()
    ]
};

```

```js
/webpack.dev.js

module.exports = {
  mode: "production",
  devtool: 'eval-source-map',
};
```

可以发现在公共配置文件中再也没有`mode`以及`devtool`属性了。它们被分配在了特定环境的 configuration 中。

### Webpack 环境变量的定义

> 最终示例地址：https://github.com/1360151219/minimal-webpack5-setup/tree/webpack-definition-env-variables

有时候你也许需要在源代码中去获取当前处于的环境。那么我们可以通过 Webpack 来声明不同环境下的环境变量。下面是一个例子：

```js
const { DefinePlugin } = require("webpack");

module.exports = {
  mode: "development",
  // additions
  plugins: [
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
  devtool: "eval-source-map",
};
```

```js
const { DefinePlugin } = require("webpack");

module.exports = {
  mode: "production",
  plugins: [
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
  devtool: "source-map",
};
```

之后我们就可以在`./src/index.js`以及引用到的 js 文件中去通过`process.env.NODE_ENV`来获取我们定义的环境变量啦。

### Webpack 环境变量的安全处理 (.ENV)

> 最终示例地址：https://github.com/1360151219/minimal-webpack5-setup/tree/webpack-dotenv-webpack

现在我们的环境变量相当于是明牌的，每一个人都可以直接在 Webpack configuration 中看到，但是如果我们想要去定义一些比较隐私的环境变量，那要怎么做呢？

这里可以用到`dotenv-webpack`，我们在项目根目录去定义两个文件`.env.development`和`.env.production`,然后写入：

```
// .env.development
NODE_ENV=development
```

```
// .env.production
NODE_ENV=production
```

然后在对应的 Webpack configuration 中利用`dotenv-webpack`去读取：

```js
const DotEnv = require("dotenv-webpack");
plugins: [
  new DotEnv({
    path: path.resolve(__dirname, "..", "./.env.development"),
  }),
];
```

### Webpack 插件

> 最终示例地址：https://github.com/1360151219/minimal-webpack5-setup/tree/webpack-bundleAnalyzer

Webpack 有着一个很庞大的插件生态，在我们前面的 Webpack 使用中其实也引用了一些插件。然而还有别的 Webpack 插件是可以增强我们打包体验的。例如，我们来看一个可以让我们可视化分析 Webpack 打包的插件。

首先我们先引入一个`script`命令：

```
"build:analyze": "npm run build -- --env addon=bundleanalyze",
```

在这里，`addon`作为参数被传进了 Webpack configuration 中，接下来我们在`build-utils/webpack.config.js`中去使用它：

```js
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.common.js");

const getAddons = (addonsArgs) => {
  const addons = Array.isArray(addonsArgs) ? addonsArgs : [addonsArgs];
  return addons
    .filter(Boolean)
    .map((name) => require(`./addons/webpack.${name}.js`));
};

module.exports = ({ env, addon }) => {
  const envConfig = require(`./webpack.${env}.js`);
  return merge(commonConfig, envConfig, ...getAddons(addon));
};
```

现在除了把 common 和特定环境的配置文件合并起来以外，还把我们将要放进`build-utils/addons`文件夹中的 addons 也合并起来。

让我们来看一下`build-utils/addons/webpack.bundleanalyze.js`：

```js
const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: path.resolve(__dirname, "..", "..", "./dist/report.html"),
      openAnalyzer: false,
    }),
  ],
};
```

最后当我们去运行`npm run build:analyze`的时候，可以发现`dist`中多了个`report.html`，它展示了我们项目的一个体积结构。

## 使用 Webpack5 搭建 React 项目

### React with babel

我们需要使用 Babel 去编译`.jsx`文件，这里就需要使用到：

```bash
npm install --save-dev @babel/preset-react
```

以及在`.babelrc`文件中去使用：

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

还需要在`webpack.config.js`中配置：

```js
 module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    resolve:{
      extension:['*','.js','.jsx']
    }
```

### 使用 Hot Module Replacement

使用`react-hot-loader`对你的项目开发效率是一个极大的提升。它可以让你不需要刷新页面的前提下进行热更新。

```bash
npm install --save-dev react-hot-loader
```

配置如下：

```js
const webpack = require('webpack');
...
plugins: [new webpack.HotModuleReplacementPlugin()],
devServer: {
  static: path.resolve(__dirname, './dist'),
  hot: true,
},
```

```js
// src/index.js
import React from "react";
import ReactDOM from "react-dom";

const title = "React with Webpack and Babel";

ReactDOM.render(<div>{title}</div>, document.getElementById("app"));

module.hot.accept();
```

这里如果不加上`module.hot.accept()`的话，当代码变化之后浏览器还是会进行刷新.