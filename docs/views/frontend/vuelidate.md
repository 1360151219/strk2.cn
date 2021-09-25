---
title: 关于Vuelidate 表单认证插件
date: 2021-7-22
categories:
  - frontend-article
author: 盐焗乳鸽还要砂锅
tags:
  - Vue
---

首先，促使我去学习这个插件的原因，是来源于一个巨坑：因为我目前的项目是基于 ts+Vue 搭建的，在我按照官网的步骤去引入 vuelidate 的时候，发现了一个难以解决的报错：**`$v is undefined`**.这就很让我烦恼了。因为官网上的安装教程我是一步一步按着操作的：

```
npm i vuelidate -S
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
```

在我辗转于百度谷歌等搜索答案的过程中，我终于发现了，在 Ts 构建项目的时候，我们需要引入 RegisterHooks，这就是一个声明钩子的函数，我们需要将 validations 声明好，因此在 main.ts 中，需要以下代码：

```js
import { Component } from "vue-property-decorator";
Component.registerHooks(["validations"]);
```
