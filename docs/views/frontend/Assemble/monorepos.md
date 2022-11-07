---
title: monorepos 方案学习
date: 2022-10-13
lastUpdated: 2022-10-13
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - 工程化
---

## Lerna

对于monorepo而言，Lerna解决了其中最关键的三个大问题：
- Lerna可以将不同项目互相link，并且可以互相引用而不需要发布到npm仓库上。
- Lerna可以将一个命令高效地、有序地作用于多个项目中去。
- Lerna管理你的npm发布流程以及版本管理。

### Get Started

对于不了解monorepo以及Lerna的使用的同学，建议直接点击[官方文档进行学习](https://lerna.js.org/docs/getting-started)