(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{477:function(t,s,e){t.exports=e.p+"assets/img/2.0c182c25.png"},592:function(t,s,e){t.exports=e.p+"assets/img/1.f5e7574b.png"},633:function(t,s,e){"use strict";e.r(s);var a=e(3),n=Object(a.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("这个事情其实我几个月之前就想做，但是之前一直都看不懂学长的源码。突然今天心血来潮想着看一下，终于花了一个多小时把这个函数看懂了。这个函数的功能是能够根据文章中的 "),a("code",[t._v("<h~>")]),t._v(" 标签来自动生成侧边栏目录。代码我就不贴上来了，先讲一讲主要的思路：")]),t._v(" "),a("h3",{attrs:{id:"processfun-函数"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#processfun-函数"}},[t._v("#")]),t._v(" ProcessFun 函数")]),t._v(" "),a("p",[a("code",[t._v("Generator")]),t._v("中有一个关键的函数，叫做"),a("code",[t._v("ProcessFun")]),t._v("，先来介绍这个函数的作用，主要是用来生成一段目录 ul 嵌套的代码。")]),t._v(" "),a("p",[t._v("首先先介绍几个关键的变量吧：")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("toc")]),t._v(": 最后拼接好并返回的侧边栏的一段 html。")]),t._v(" "),a("li",[a("code",[t._v("first")]),t._v(": 用于记录是否初始化目录，即第一次调用"),a("code",[t._v("ProcessFun")])]),t._v(" "),a("li",[a("code",[t._v("level")]),t._v("：用于记录当前目录所在层次，默认值为 0")]),t._v(" "),a("li",[a("code",[t._v("i")]),t._v(" ：用于生成时间戳最后的一个 hash 值吧。")])]),t._v(" "),a("p",[t._v("这个函数接收 5 个变量："),a("code",[t._v("str")]),t._v(", "),a("code",[t._v("openLevel")]),t._v(", "),a("code",[t._v("attrs")]),t._v(", "),a("code",[t._v("titleText")]),t._v(", "),a("code",[t._v("closeLevel")]),t._v(", 一开始我连这 5 个变量都不知道在哪里找到，不过现在已经明白了，要了解这个函数变量的传入首先要找到调用的位置。")]),t._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("document"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getElementById")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"titleContainer"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("innerHTML "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" document\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getElementById")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"titleContainer"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("innerHTML"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("replace")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token regex"}},[a("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")]),a("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[t._v("<h([\\d])([^>]*)>([^<]+)<\\/h([\\d])>")]),a("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")]),a("span",{pre:!0,attrs:{class:"token regex-flags"}},[t._v("gi")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" processFunc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\ndocument"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getElementById")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"contents"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("innerHTML "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" document\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getElementById")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"contents"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("innerHTML"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("replace")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token regex"}},[a("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")]),a("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[t._v("<h([\\d])([^>]*)>([^<]+)<\\/h([\\d])>")]),a("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")]),a("span",{pre:!0,attrs:{class:"token regex-flags"}},[t._v("gi")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" processFunc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br")])]),a("p",[t._v("这段代码的意思是在文章中匹配到"),a("code",[t._v("<h~>")]),t._v("标签，为此我们先来仔细了解一下 replace 函数。")]),t._v(" "),a("p",[t._v("在 W3school 中，有一段说明是这样的：")]),t._v(" "),a("blockquote",[a("p",[t._v("在传入一个函数的情况下，每个匹配都调用该函数，它返回的字符串将作为替换文本使用。该函数的第一个参数是匹配模式的字符串。接下来的参数是与模式中的子表达式匹配的字符串，可以有 0 个或多个这样的参数。接下来的参数是一个整数，声明了匹配在 stringObject 中出现的位置。最后一个参数是 stringObject 本身。")])]),t._v(" "),a("p",[t._v("因此我们可以知道，这 5 个变量所代表的意思：")]),t._v(" "),a("ul",[a("li",[t._v("str: 匹配的整个字符串")]),t._v(" "),a("li",[t._v("openLevel: 匹配的第一个 <h~> 后面所接着的数字：如 1-6")]),t._v(" "),a("li",[t._v("attr: 标签带有的一些属性，比如 class，id 等等")]),t._v(" "),a("li",[t._v("titleText: 内容")]),t._v(" "),a("li",[t._v("closeLevel: 匹配的</h~> 后面接着的数字。")])]),t._v(" "),a("p",[t._v("那么了解了变量之后，我们来梳理一下"),a("code",[t._v("toc")]),t._v("的一个生成的过程：")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("第一次调用：toc 附上"),a("strong",[t._v("openLevel - level")]),t._v("个"),a("code",[t._v("<ul>")]),t._v(";随后更新 level："),a("code",[t._v("level=openLevel")]),t._v(";生成一个时间戳 hash 值"),a("code",[t._v("anchor")]),t._v(";toc 拼接上"),a("code",[t._v('<li><a href=\\"#" + anchor + "\\">" + <div>${titleText}</div>+ "</a></li>')]),t._v("的结构；最后返回给 replace 函数一个加了新属性(anchor)的原有标签。")])]),t._v(" "),a("li",[a("p",[t._v("第二次调用：如果同层次即"),a("strong",[t._v("openLevel=level")]),t._v("，则直接拼接上 li 结构；若不同层次，若"),a("strong",[t._v("openLevel>level")]),t._v("则拼接上 ul>li 结构；\n若"),a("strong",[t._v("openLevel<level")]),t._v("则拼接上闭合 ul 的标签和 li 结构。")])]),t._v(" "),a("li",[a("p",[t._v("调用完成后，最后拼接上 level 个闭合 ul 标签即可。过程如图：")])]),t._v(" "),a("li",[a("p",[a("img",{attrs:{src:e(592),alt:""}})])])]),t._v(" "),a("h3",{attrs:{id:"滚动高亮特效"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#滚动高亮特效"}},[t._v("#")]),t._v(" 滚动高亮特效")]),t._v(" "),a("p",[t._v("这里有一个判断元素是否在视图内的函数，这个比较简单就不贴出来了。")]),t._v(" "),a("p",[t._v("大概思路如下：")]),t._v(" "),a("ul",[a("li",[t._v("监听滚动事件")]),t._v(" "),a("li",[t._v("首先获取所有 h1-h6 的元素节点，进行遍历，判断是否在视图内继续以下操作")]),t._v(" "),a("li",[t._v("记录上一次遍历的节点，将其类名清空，然后获取有该节点的 hash 值的 "),a("strong",[t._v("a")]),t._v("标签")]),t._v(" "),a("li",[t._v("把 active 加在其父元素身上，即 li 标签。并且将其前面的 2 个同胞节点类名清空。")]),t._v(" "),a("li",[t._v("进行一个循环，如果该 li 标签的父元素为 ul，则该 ul 标签的前一个同胞节点类名也加上 active，这里不明白的话可以看一下具体的侧边栏结构。")])]),t._v(" "),a("h3",{attrs:{id:"展开和折叠"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#展开和折叠"}},[t._v("#")]),t._v(" 展开和折叠")]),t._v(" "),a("p",[t._v("这个只需要在 active 类名的 li 标签的后一个 ul 标签加一个 height 就 OK 了")]),t._v(" "),a("h3",{attrs:{id:"发现了一个小-bug"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#发现了一个小-bug"}},[t._v("#")]),t._v(" 发现了一个小 BUG")]),t._v(" "),a("p",[t._v("今天发现学长项目中有一些标题并没有得到展开，这里修改了一下：")]),t._v(" "),a("p",[t._v("原因：这几个标题是在 h1 大标题下的 h3 小标题，由于 level 相差了 2，直接嵌套了 2 个 ul 进去，导致了一个 ul 内首元素为 ul 的情况。由于没有 active 的 li 标签在前面，所以这个 ul 得不到展开。")]),t._v(" "),a("p",[t._v("解决方法：加一个"),a("code",[t._v("ul>ul：first-child")]),t._v(",给它一个"),a("code",[t._v("max-height：1000px；")])]),t._v(" "),a("p",[a("img",{attrs:{src:e(477),alt:""}})]),t._v(" "),a("p",[t._v("最后这里附上学长项目的地址："),a("a",{attrs:{href:"motwo.cn"}},[t._v("MOTWO")])])])}),[],!1,null,null,null);s.default=n.exports}}]);