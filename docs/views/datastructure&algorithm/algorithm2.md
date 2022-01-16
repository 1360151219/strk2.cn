---
title: leetcode----算法日记（第二弹）
date: 2022-1-16
lastUpdated: 2022-1-16
categories:
  - datastructure&algorithm
author: 盐焗乳鸽还要砂锅
tags:
  - 算法
---

# leetcode 算法日记（第二弹）

2022 新的一年继续努力积极向上 hhhh~

## 模拟

### leetcode 382. 链表随机节点

给你一个单链表，随机选择链表的一个节点，并返回相应的节点值。每个节点被选中的概率一样 。

实现 `Solution` 类：

`Solution(ListNode head)` 使用整数数组初始化对象。
`int getRandom()` 从链表中随机选择一个节点并返回该节点的值。链表中所有节点被选中的概率相等。

**法一：模拟** `2022.1.16`

基本思路：直接遍历链表并存在数组中，再通过随机下标获取值

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
var Solution = function (head) {
  this.head = head;
  this.arr = [];
  let t = this.head;
  while (t !== null) {
    this.arr.push(t.val);
    t = t.next;
  }
};
Solution.prototype.getRandom = function () {
  const n = this.arr.length;
  return this.arr[Math.floor(Math.random() * n)];
};
```

**法二：池塘抽样** `2022.1.16`

主要思路是：从前往后处理每一个数据，令每一个数据选出的概率是$\frac{1}{i}$,这样最终每一个数据选出的概率就变成了$\frac{1}{n}$

[算法思路证明](https://leetcode-cn.com/problems/linked-list-random-node/solution/gong-shui-san-xie-xu-shui-chi-chou-yang-1lp9d/)

```js
var Solution = function (head) {
  this.head = head;
};

Solution.prototype.getRandom = function () {
  let t = this.head;
  let i = 0;
  let ans = 0;
  while (t !== null && ++i >= 0) {
    if (Math.floor(Math.random() * i) === 0) ans = t.val;
    t = t.next;
  }
  return ans;
};
```
