---
title: React Router v6 中文
date: 2022-3-31
lastUpdated: 2022-3-31
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - React
---

# React Router v6 中文

## 前言

最近学习 React，但是 React 的路由最新版本 v6 却只有英文官方文档，中文文档已经旧得不能再旧了。因此打算边学习边简单翻译下官方文档吧

## Get Started 开始教程

### Installation 下载

```bash
pnpm add react-router-dom@6 --save
```

### Connect the URL 将 App 与 URL 连接

文档中使用`BrowserRouter`来渲染你的整个 App 应用。（histroy 模式，hash 模式则是`HashRouter`

```js
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);
```

### Add some Links 使用 Link 组件

通过`Link`来进行路由的跳转，

- `to`：指定跳转的 url，可以是相对路径（基于父 Route 进行继承）

```js
<Route path="/" element={<App />}>
  <Link to="demo">To Demo</Link> // to '/demo'
</Route>
```

### Add some Routes 使用 Route 组件

通过`Route`组件来根据 url 来进行对应组件的渲染

- `path`：对应的 url
- `element`：将要渲染的组件

```js
<Route path="/" element={<App />} />
```

### Nested Routes 嵌套路由

完成嵌套路由只需要两步：

- Nest the routes inside of the App route 将子`Route`嵌套在父`Route`之中

Right now the _expenses_ and _invoice_ routes are siblings to the app, we want to make them children of the app route:

```js
<BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="expenses" element={<Expenses />} />
        <Route path="invoices" element={<Invoices />} />
      </Route>
    </Routes>
  </BrowserRouter>,
```

- 渲染`Outlet`组件

```js
// at App.js
<Link to="/invoices">Invoices</Link>
<Link to="/expenses">Expenses</Link>
<Outlet />
```

### Listing the Invoices

模仿一段后端数据并且像这样写出以下代码：

```js
// src/data.js
let invoices = [
  {
    name: "Santa Monica",
    number: 1995,
    amount: "$10,800",
    due: "12/05/1995",
  },
  {
    name: "Stankonia",
    number: 2000,
    amount: "$8,000",
    due: "10/31/2000",
  },
  {
    name: "Ocean Avenue",
    number: 2003,
    amount: "$9,500",
    due: "07/22/2003",
  },
  {
    name: "Tubthumper",
    number: 1997,
    amount: "$14,000",
    due: "09/01/1997",
  },
  {
    name: "Wide Open Spaces",
    number: 1998,
    amount: "$4,600",
    due: "01/27/1998",
  },
];

export function getInvoices() {
  return invoices;
}

// /invoices.jsx
import { Link } from "react-router-dom";
import { getInvoices } from "../data";

export default function Invoices() {
  let invoices = getInvoices();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem",
        }}
      >
        {invoices.map((invoice) => (
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/invoices/${invoice.number}`}
            key={invoice.number}
          >
            {invoice.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

可以发现点击`Link`后路径跳转却不能匹配到对应路由组件。

## Adding a No-Match Route 添加一个没有匹配成功的路由组件

事情并不像你想象的那样。如果您点击这些链接，页面将变为空白!这是因为我们定义的路由中没有一个匹配我们所链接的 URL: `"/invoice/123"`。

在我们继续之前，最好总是处理这种“不匹配”的情况。回到你的路由配置，添加以下内容:

```js
<Route
  path="*"
  element={
    <main style={{ padding: "1rem" }}>
      <p>There's nothing here!</p>
    </main>
  }
/>
```

这里的`path`被赋予了`*`，表示当没有其他路由匹配的时候，就匹配这个。**与顺序无关**

## Read URL Params 读取 URL 参数

我们刚刚匹配到了 `"/invoices/1998"` and `"/invoices/2005"`, 我们现在想要在具体的组件中去获取这个 url 的参数。比如：

```js
// invoice.jsx
export default function Invoice() {
  return <h2>Invoice #???</h2>;
}
```

此时我们需要在`Invoices`组件中去添加一个嵌套组件，而且使用动态路由：

```js
<Route path="invoices" element={<Invoices />}>
  <Route path=":invoiceId" element={<Invoice />} />
</Route>
```

有几件事情需要注意：

- 我们刚刚创建了一个匹配像`“/invoices/2005”`和`“/invoices/1998”`这样的 url 路由。路径的`:invoiceId` 部分是一个`“URL 参数”`，这意味着只要模式相同，它就可以匹配任何值。

- 嵌套路由是可以再次被嵌套的：`<App><Invoices><Invoice /></Invoices></App>`

之后我们还需要在 `Invoices`中去添加一个`Outlet`组件。

现在我们就可以开始来获取这个动态 invoiceid 参数了。

```js
import { useParams } from "react-router-dom";

export default function Invoice() {
  let params = useParams();
  return <h2>Invoice: {params.invoiceId}</h2>;
}
```

要注意的是，这是一个 HOOK API，无法在类组件中使用。

有了这个参数，我们就可以使用它干一些有趣的事情啦。这里值得注意的是，url params 获取的是**字符串形式**的参数，而 data 中的是 Number 类型

```js
// src/data.js
export function getInvoice(id) {
  return invoices.find((invoice) => {
    return invoice.number == id;
  });
}
// invoice.jsx
export default function Invoice() {
  let params = useParams();
  let invoice = getInvoice(params.invoiceid);
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <h1>Params contains invoices:{params.invoiceid}</h1>
      <p>Name:{invoice.name}</p>
      <p>Amount:{invoice.amount}</p>
      <p>Due:{invoice.due}</p>
    </div>
  );
}
```

## Index Router 索引路由

Index Router 很可能是最难让人们去理解的一个概念了。所以如果你曾困扰于此，我希望以下内容可以帮到你。

现在你看一下 Invoices 路由，在你还没有去点击 Invoice Link 的时候，你应该注意到内容区域是空白的，这很不友好，我们可以利用`index`路由来 fix 它。

```js
<Route path="invoices" element={<Invoices />}>
  <Route
    index
    element={
      <main style={{ padding: "1rem" }}>
        <p>Select an invoice</p>
      </main>
    }
  />
  <Route path=":invoiceId" element={<Invoice />} />
</Route>
```

你应该注意到索引路由是没有`path`属性的。

可以你仍然还抓破头脑没弄清楚，这里有一些我们尝试回答'索引路由是什么的'这个问题的答案，希望有一些能帮到你：

- 处于父路由组件中的索引路由作为父路由路径的出口 outlet
- 当匹配到父路由路径但其他子路由组件无一匹配时，匹配索引路由
- 索引路由是一个默认子路由
- 当用户还没点击子导航列表的时候，渲染索引路由

## Active Links 被激活的 Link 组件

去展示一个被激活的、用户正在看的 Link 是一个非常普遍的一个需求，尤其是在一个导航列表中。让我们使用`NavLink`来给 Invoices 列表加上这个效果。

```js
{
  invoices.map((invoice) => (
    <NavLink
      style={({ isActive }) => {
        return {
          display: "block",
          margin: "1rem 0",
          color: isActive ? "red" : "",
        };
      }}
      to={`/invoices/${invoice.number}`}
      key={invoice.number}
    >
      {invoice.name}
    </NavLink>
  ));
}
```

这里我们做了三件事情：

1. 我们将`Link`换成了`NavLink`
2. 我们将一个简单的 style 对象换成一个函数
3. 这个 style 函数接收一个参数(`isActive`)，当此时路由匹配的时候，`isActive`变为 true

我们也可以给`className`做同样的事情：

```js
// normal string
<NavLink className="red" />

// function
<NavLink className={({ isActive }) => isActive ? "red" : "blue"} />
```

## 查询字符串参数

查询字符串跟 url 参数并不相同。你肯定在一些网站上看过比如`"/login?success=1" or "/shoes?brand=nike&sort=asc&sortby=price"`

React Router 通过`useSearchParams`方法让读取并操作查询字符串变得简单。**它像`React.useState()`作用相似，但它将状态存储在了 url 查询字符串中而不是内存中。**

下面我们给 Invoices 导航列表加一个小小的过滤功能吧

```js
export default function Invoices() {
  let invoices = getInvoices();
  let [searchParams, setSearchParams] = useSearchParams();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem",
        }}
      >
        <input
          value={searchParams.get("filter") || ""}
          onChange={(event) => {
            let filter = event.target.value;
            if (filter) {
              setSearchParams({ filter });
            } else {
              setSearchParams({});
            }
          }}
        />
        {invoices
          .filter((invoice) => {
            let filter = searchParams.get("filter");
            if (!filter) return true;
            let name = invoice.name.toLowerCase();
            return name.startsWith(filter.toLowerCase());
          })
          .map((invoice) => (
            <NavLink
              style={({ isActive }) => ({
                display: "block",
                margin: "1rem 0",
                color: isActive ? "red" : "",
              })}
              to={`/invoices/${invoice.number}`}
              key={invoice.number}
            >
              {invoice.name}
            </NavLink>
          ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

- `setSearchParams()`可以将`?filter=...`放到 url 中并且重新渲染该路由。
- `useSearchParams`现在返回一个带有`filter`的`URLSearchParams`对象。
- 我们将 input 中的值设置到了 url search param 中
- 我们对 Invoices 列表基于 filter 进行了过滤。
