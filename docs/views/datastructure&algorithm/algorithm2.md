---
title: leetcode----算法日记（第二弹）
date: 2022-1-16
lastUpdated: 2022-1-17
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

## 单调栈

### leetcode 1856. 子数组最小乘积的最大值

给你一个正整数数组  `nums` ，请你返回  `nums`  任意   非空子数组   的最小乘积   的   最大值  。由于答案可能很大，请你返回答案对   `109 + 7`  取余   的结果。

**单调栈** `2022.1.17`

主要思路是利用单调栈找出以每一个数字作为最小值的时候，最大长度的区间，然后求答案。

注意这题一定要用 BigInt 不用 AC 不了

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSumMinProduct = function (nums) {
  let queue = new Stack();
  let ans = BigInt(0);
  let sum = new Array(nums.length + 1).fill(0);
  for (let i = 1; i <= nums.length; i++) {
    sum[i] = sum[i - 1] + nums[i - 1];
  }
  for (let i = 0; i < nums.length; i++) {
    let cur = nums[i];
    while (!queue.isEmpty() && nums[queue.peek()[0]] > cur) {
      let maxList = queue.pop();
      let l = queue.isEmpty() ? 0 : queue.peek()[queue.peek().length - 1] + 1;
      let tep = BigInt(sum[i] - sum[l]) * BigInt(nums[maxList[0]]);
      if (tep > ans) ans = tep;
    }
    if (!queue.isEmpty() && nums[queue.peek()[0]] === nums[i])
      queue.peek().push(i);
    else queue.push([i]);
  }
  while (!queue.isEmpty()) {
    let maxList = queue.pop();
    let l = queue.isEmpty() ? 0 : queue.peek()[queue.peek().length - 1] + 1;
    let tep = BigInt(sum[nums.length] - sum[l]) * BigInt(nums[maxList[0]]);
    if (tep > ans) ans = tep;
  }
  return ans % 1000000007n;
};
class Stack {
  constructor() {
    this.items = [];
  }
  push(el) {
    this.items.push(el);
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    if (this.items.length === 0) return null;
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
}
```

## 动态规划

### leetcode 1220. 统计元音字母序列的数目

**dp** `2022.1.17`

类似这种题想到的就是 dp，重点是定义状态数组，根据题意，可以定义 dp[i][j]是长度为 i，j 是结尾为第 j 个字符的序列数。

```js
var countVowelPermutation = function (n) {
  //['a','e','i','o','u']  dp[i][j] i表示长度i j表示结尾是第j个字符
  let dp = new Array(n + 1).fill(0).map(() => new Array(5).fill(0));
  // 初始化
  for (let i = 0; i < 5; i++) {
    dp[1][i] = 1;
  }
  for (let i = 2; i <= n; i++) {
    dp[i][0] = (dp[i - 1][4] + dp[i - 1][1] + dp[i - 1][2]) % 1000000007; // a=e+i+u
    dp[i][1] = (dp[i - 1][0] + dp[i - 1][2]) % 1000000007; //e =a+i
    dp[i][2] = (dp[i - 1][1] + dp[i - 1][3]) % 1000000007; // i= e+o
    dp[i][3] = dp[i - 1][2] % 1000000007; // o=i
    dp[i][4] = (dp[i - 1][2] + dp[i - 1][3]) % 1000000007; // u=i+o
  }
  let ans = 0;
  for (let i = 0; i < 5; i++) {
    ans += dp[n][i] % 1000000007;
  }
  return ans % 1000000007;
};
```
