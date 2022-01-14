---
title: Vuepress-Reco主题博客魔改
date: 2022-1-14
lastUpdated: 2022-1-14
categories:
  - 随笔日记
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---

# Vuepress-Reco 主题博客魔改

这个主题的博客我已经用了接近半年多了，一些基本的魔改是直接根据[官方文档](https://vuepress-theme-reco.recoluan.com/views/1.x/)修改的我就不说了。下面来记录一下源码层级上的魔改。

## 增加 LastUpdated 并按照其进行排序

现在我有一个需求想法：希望首页中博客文章的简介中出现一个最后更新日期，并且按照其进行排序。这个想法我很久之前就有了，但是一直没有去做，之前都是直接通过修改 date（应该被视为创作日期）来实现效果的。但是我今天在更新很久之前的一篇文章的时候就觉得这样做并不好。应该要额外加一个最后修改更新日期。于是，想做就去做吧！！

首先按照官方文档上说明，其实已经有一个内置插件可以帮助我们完成类似效果，只需要在 config.js 中配置：

```js
 themeConfig: {
    type: "blog",
    lastUpdated: '上次更新',
 }
```

就可以在具体文章页末尾看到最后更新时间了。这个实现的原理也是因为这个插件是读了我们 git log 中的数据的，具体我就不说了，这不是今天的重点。

但是这个插件并没有实现我想要的效果，因为在博客首页的文章简介中并没有显示最后更新时间。

因此首先我读了一下博客简介的组件：`NoteAbstractItem.vue`

然后追根溯源找到了简介的 UI:`PageInfo.vue`

```vue
<template>
  <div>
    <reco-icon
      v-if="pageInfo.frontmatter.author || $themeConfig.author"
      icon="reco-account"
    >
      <span>{{ pageInfo.frontmatter.author || $themeConfig.author }}</span>
    </reco-icon>
    <reco-icon v-if="pageInfo.frontmatter.date" icon="reco-date">
      <span>{{ formatDateValue(pageInfo.frontmatter.date) }}</span>
    </reco-icon>
    <reco-icon v-if="showAccessNumber === true" icon="reco-eye">
      <AccessNumber :idVal="pageInfo.path" :numStyle="numStyle" />
    </reco-icon>
    <reco-icon v-if="pageInfo.frontmatter.tags" icon="reco-tag" class="tags">
      <span
        v-for="(subItem, subIndex) in pageInfo.frontmatter.tags"
        :key="subIndex"
        class="tag-item"
        :class="{ active: currentTag == subItem }"
        @click.stop="goTags(subItem)"
        >{{ subItem }}</span
      >
    </reco-icon>
  </div>
</template>
```

可见他是根据 frontmatter 来去给简介加上一些 icon 的。那么我们只需要给博客摘要中加上一个属性既可实现辣。

**具体操作如下：**

首先修改摘要：（加一个 lastUpdated 的属性）

```
---
title: Vuepress-Reco主题博客魔改
date: 2022-1-14
lastUpdated: 2022-1-14
categories:
  - 随笔日记
author: 盐焗乳鸽还要砂锅
tags:
  - JavaScript
---
```

第二步，添加一个 icon：

```vue
<reco-icon
  v-if="pageInfo.frontmatter.lastUpdated"
  icon="reco-suggestion"
  style="float:right;"
>
    <span>{{ formatDateValue(pageInfo.frontmatter.lastUpdated) }}</span>
</reco-icon>
```

现在我们已经给我们文章简介上添加上了更新时间的 icon。但我们发现现在实际上还是根据文章创作时间也就是`date`来进行排序的，这并不好，我希望变成根据 `lastUpdated` 来排序

于是继续追根溯源，找到存贮文章的数组`props.data`，然后找到外部传入的 data 是`$recoPosts`，然后找到在`mixins/post.js`中的：

```js
$recoPosts() {
      let posts = this.$site.pages
      posts = filterPosts(posts, false)
      sortPostsByStickyAndDate(posts)
      return posts
    },
```

然后继续找到`sortPostsByStickyAndDate`的函数：

```js
// 排序博客数据
export function sortPostsByStickyAndDate(posts) {
  posts.sort((prev, next) => {
    const prevSticky = prev.frontmatter.sticky;
    const nextSticky = next.frontmatter.sticky;
    if (prevSticky && nextSticky) {
      return prevSticky == nextSticky
        ? compareDate(prev, next)
        : prevSticky - nextSticky;
    } else if (prevSticky && !nextSticky) {
      return -1;
    } else if (!prevSticky && nextSticky) {
      return 1;
    }
    return compareDate(prev, next);
  });
}
```

我测试了一下，实际上这个 sticky 属性我们并没有在摘要上添加，所以走的都是`compareDate`，也就是根据 date 来排序。

因此我自己写了一个`sortPostsByLastUpdated`函数：

```js
export function sortPostsByLastUpdated(posts) {
  posts.sort((prev, next) => {
    const prevlastUpdated = new Date(prev.frontmatter.lastUpdated).getTime();
    const nextlastUpdated = new Date(next.frontmatter.lastUpdated).getTime();
    if (prevlastUpdated && nextlastUpdated) {
      return prevlastUpdated == nextlastUpdated
        ? compareDate(prev, next)
        : nextlastUpdated - prevlastUpdated;
    }
    return compareDate(prev, next);
  });
}
```

就此，一次源码层级上的魔改就大功告成了。！！
