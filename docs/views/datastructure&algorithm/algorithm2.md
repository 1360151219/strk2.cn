---
title: leetcode----算法日记（第二弹）
date: 2022-1-16
lastUpdated: 2022-1-27
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

### 539. 最小时间差

给定一个 24 小时制（小时:分钟 "HH:MM"）的时间列表，找出列表中任意两个时间的最小时间差并以分钟数表示。

**简单模拟** `2022.1.18`

主要思路是：将时间转化为分钟进行存储，从小到大排序后，考虑隔一天的情况，只需要将第一位也就是最小的分钟加一个 1440（即一天），存入数组中即可。然后就是简单遍历了。

```js
var findMinDifference = function (timePoints) {
  const n = timePoints.length;
  if (n > 1440) return 0;
  let nums = new Array(n + 1);
  let i = 0;
  for (let t of timePoints) {
    const time = t.split(":");
    nums[i] = time[0] * 60 + time[1] * 1; // 隐式转换
    i++;
  }
  nums.sort((a, b) => a - b);
  nums[n] = nums[0] + 1440;
  let ans = Infinity;
  for (let i = 1; i < nums.length; i++) {
    ans = Math.min(ans, nums[i] - nums[i - 1]);
  }
  return ans;
};
```

### leetcode 1332. 删除回文子序列

给你一个字符串  `s`，它仅由字母  `'a'` 和 `'b'`  组成。每一次删除操作都可以从 `s` 中删除一个回文 **子序列**。

返回删除给定字符串中所有字符（字符串为空）的最小删除次数。

**双指针模拟** `2022.1.22`

因为这个字符串就只有 a、b 两个字母，因此最差也只需要删除 2 次。实际上就只需要判断 s 是不是一个回文串，是的话就直接删除，不是的话就返回 2。

```js
var removePalindromeSub = function (s) {
  const n = s.length;
  let i = 0;
  let j = n - 1;
  while (i < j) {
    if (s.charAt(i) !== s.charAt(j)) return 2;
    i++;
    j--;
  }
  return 1;
};
```

### leetcode 1688. 比赛中的配对次数

给你一个整数 n ，表示比赛中的队伍数。比赛遵循一种独特的赛制：

- 如果当前队伍数是 **偶数** ，那么每支队伍都会与另一支队伍配对。总共进行 `n / 2` 场比赛，且产生 `n / 2` 支队伍进入下一轮。
- 如果当前队伍数为 **奇数** ，那么将会随机轮空并晋级一支队伍，其余的队伍配对。总共进行 `(n - 1) / 2` 场比赛，且产生 `(n - 1) / 2 + 1` 支队伍进入下一轮。
  返回在比赛中进行的配对次数，直到决出获胜队伍为止。

**暴力** `2022.1.25`

```js
var numberOfMatches = function (n) {
  let ans = 0;
  while (n > 1) {
    ans += n & 1 ? (n - 1) / 2 : n / 2;
    n = n & 1 ? (n + 1) / 2 : n / 2;
  }
  return ans;
};
```

**脑筋急转弯**

最终决出获胜队伍，即有 n-1 个队伍需要配对，即直接 return n-1

> 但我不知道为啥暴力的时间还更少- -

### leetcode 2013. 检测正方形

给你一个在 X-Y 平面上的点构成的数据流。设计一个满足下述要求的算法：

- 添加一个在数据流中的新点到某个数据结构中。可以添加 **重复** 的点，并会视作不同的点进行处理。
- 给你一个查询点，请你从数据结构中选出三个点，使这三个点和查询点一同构成一个面积为正的轴对齐正方形 ，统计满足该要求的方案数目。

> 轴对齐正方形是一个正方形，除四条边长度相同外，还满足每条边都与 x-轴 或 y-轴 平行或垂直。

实现` DetectSquares` 类：

`DetectSquares()` 使用空数据结构初始化对象
`void add(int[] point)` 向数据结构添加一个新的点 `point = [x, y]`
`int count(int[] point)` 统计按上述方式与点 `point = [x, y]` 共同构造 轴对齐正方形 的方案数。

**哈希表** `2022.1.26`

使用一维优化的方式记录 point。

使用哈希表来记录每一个点的个数，再使用一个数组来记录每一个点的种类。

在查询方法中，遍历数组获取所有不同的点，判断是否正方形面积为 0（即重叠）或不为轴对齐，然后判断组成正方形的剩余两个点的数量并相乘

```js
const N = 100;
class DetectSquares {
  constructor() {
    this.cnt = new Map();
    this.st = new Array(5005);
    this.i = 0;
  }
  add(point) {
    if (!this.cnt.has(point[0] * N + point[1])) {
      this.st[this.i++] = point[0] * N + point[1];
    }
    const cur = this.cnt.get(point[0] * N + point[1]) || 0;
    this.cnt.set(point[0] * N + point[1], cur + 1);
  }
  count(point) {
    let ans = 0;
    for (let i = 0; i < this.i; i++) {
      let x = Math.floor(this.st[i] / N);
      let y = this.st[i] % N;
      if (
        x === point[0] ||
        y === point[1] ||
        Math.abs(x - point[0]) != Math.abs(y - point[1])
      )
        continue;
      if (this.cnt.has(point[0] * N + y) && this.cnt.has(x * N + point[1])) {
        ans +=
          this.cnt.get(point[0] * N + y) *
          this.cnt.get(x * N + point[1]) *
          this.cnt.get(this.st[i]);
      }
    }
    return ans;
  }
}
```

### leetcode 2029. 石子游戏 IX

Alice 和 Bob 再次设计了一款新的石子游戏。现有一行 `n` 个石子，每个石子都有一个关联的数字表示它的价值。给你一个整数数组 `stones` ，其中 `stones[i]` 是第 `i` 个石子的价值。

Alice 和 Bob 轮流进行自己的回合，Alice 先手。每一回合，玩家需要从 `stones`  中移除任一石子。

如果玩家移除石子后，导致 **所有已移除石子** 的价值   **总和** 可以被 3 整除，那么该玩家就 **输掉游戏** 。
如果不满足上一条，且移除后没有任何剩余的石子，那么 Bob 将会直接获胜（即便是在 Alice 的回合）。
假设两位玩家均采用   **最佳** 决策。如果 Alice 获胜，返回 `true` ；如果 Bob 获胜，返回 `false` 。

**博弈论** `2022.1.20`

![](./imgs/lc2029.jpg)

主要是要理解为什么当第 3 类石子是奇数的时候，必须多的那类石子要多出 3 个以上。只有多出 3 个以上 Alice 才能胜利

```js
var stoneGameIX = function (stones) {
  const cnt = new Array(3).fill(0);
  for (let i = 0; i < stones.length; i++) {
    cnt[stones[i] % 3]++;
  }
  return cnt[0] % 2 === 0 ? cnt[1] && cnt[2] : Math.abs(cnt[1] - cnt[2]) >= 3;
};
```

### leetcode 2151. 基于陈述统计最多好人数

游戏中存在两种角色：

好人：该角色只说真话。
坏人：该角色可能说真话，也可能说假话。
给你一个下标从 0 开始的二维整数数组 statements ，大小为 `n x n` ，表示 n 个玩家对彼此角色的陈述。具体来说，`statements[i][j]` 可以是下述值之一：

- 0 表示 i 的陈述认为 j 是 坏人 。
- 1 表示 i 的陈述认为 j 是 好人 。
- 2 表示 i 没有对 j 作出陈述。
  另外，玩家不会对自己进行陈述。形式上，对所有  `0 <= i < n` ，都有 `statements[i][i] = 2` 。

根据这 n 个玩家的陈述，返回可以认为是 **好人** 的 **最大** 数目。

**二进制枚举和状态压缩**

这题的 n 最大只有 15，因此可以用暴力枚举的方法----二进制枚举。今天来学习一下[二进制枚举](https://blog.csdn.net/sugarbliss/article/details/81099340)

因此这题总枚举数是`1 << n`，（最多 15 个人，每个人都可以当坏人或者好人，即 2^15）

为了优化我们使用状态压缩的方法，即 i>>j 为第 i 种情况中是否为好人（1 则好人，0 则坏人），坏人说的话没有判断的价值

此时继续枚举 k，然后判断 i（好人）说的话跟 statements 的有没有冲突，有的话则说明 i 的这种情况有问题。

```js
var maximumGood = function (statements) {
  const n = statements.length;
  let ans = 0;
  for (let i = 0; i < 1 << n; i++) {
    let cur = 0;
    let flag = true;
    for (let j = 0; j < n && flag; j++) {
      if ((i >> j) & 1) {
        cur += 1;
        for (let k = 0; k < n && flag; k++) {
          if (statements[j][k] === 2) continue;
          if (statements[j][k] == 0 && ((i >> k) & 1) == 1) flag = false;
          if (statements[j][k] == 1 && ((i >> k) & 1) == 0) flag = false;
        }
      }
    }

    if (flag) ans = Math.max(cur, ans);
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

## 优先队列（堆）

### leetcode 2034. 股票价格波动

给你一支股票价格的数据流。数据流中每一条记录包含一个 **时间戳**  和该时间点股票对应的 **价格** 。

不巧的是，由于股票市场内在的波动性，股票价格记录可能不是按时间顺序到来的。某些情况下，有的记录可能是错的。如果两个有相同时间戳的记录出现在数据流中，前一条记录视为错误记录，后出现的记录 **更正**  前一条错误的记录。

请你设计一个算法，实现：

更新股票在某一时间戳的股票价格，如果有之前同一时间戳的价格，这一操作将更正之前的错误价格。
找到当前记录里 **最新股票价格** 。最新股票价格定义为时间戳最晚的股票价格。
找到当前记录里股票的 **最高价格** 。
找到当前记录里股票的 **最低价格** 。
请你实现  `StockPrice`  类：

`StockPrice()`  初始化对象，当前无股票价格记录。
`void update(int timestamp, int price)`  在时间点 timestamp  更新股票价格为 price 。
`int current()`  返回股票 最新价格  。
`int maximum()`  返回股票 最高价格  。
`int minimum()`  返回股票 最低价格  。

**优先队列** `2022.1.23`

基本思路：设置一个哈希表（time：price），每次 update 都 set 一下。其次是返回最新价格，只需要每次 update 的时候维护一个最大时间戳即可

主要是最大最小价格，一开始我采用遍历哈希表的方法，TLE 了- -

那只能用优先队列了呀。用优先队列的话还要考虑一个问题，如何解决之前的错误价格呢？

其实也很容易，只需要加时间和价格同时推进优先队列中即可，取出的时候判断一下是否跟哈希表内的时间和价格一致，不一致则说明是错误价格，继续取出即可。

```js
class StockPrice {
  constructor() {
    this.stock = new Map();
    this.cur = 0;
    this.maxQueue = new PriorityQueue((a, b) => a[0] > b[0]);
    this.minQueue = new PriorityQueue((a, b) => a[0] < b[0]);
  }
  update(time, price) {
    this.cur = Math.max(this.cur, time);
    this.stock.set(time, price);
    // 直接offer

    this.maxQueue.offer([price, time]);
    this.minQueue.offer([price, time]);
  }
  current() {
    return this.stock.get(this.cur);
  }
  maximum() {
    while (1) {
      const cur = this.maxQueue.peek();
      if (this.stock.get(cur[1]) === cur[0]) {
        return cur[0];
      }
      this.maxQueue.poll();
    }
  }
  minimum() {
    while (1) {
      const cur = this.minQueue.peek();
      if (this.stock.get(cur[1]) === cur[0]) {
        return cur[0];
      }
      this.minQueue.poll();
    }
  }
}
class PriorityQueue {
  constructor(compare = (a, b) => a > b) {
    this.data = [];
    this.size = 0;
    this.compare = compare;
  }
  peek() {
    return this.size > 0 ? this.data[0] : null;
  }
  offer(value) {
    this.data.push(value);
    this._siftUp(this.size++);
  }
  poll() {
    this._swap(0, --this.size);
    this._siftDown(0);
    return this.data.pop();
  }
  _parent(index) {
    return (index - 1) >> 1;
  }
  _child(index) {
    return (index << 1) + 1;
  }
  _siftUp(index) {
    while (
      this._parent(index) >= 0 &&
      this.compare(this.data[index], this.data[this._parent(index)])
    ) {
      this._swap(index, this._parent(index));
      index = this._parent(index);
    }
  }

  _siftDown(index) {
    while (this._child(index) < this.size) {
      let child = this._child(index);
      if (
        child + 1 < this.size &&
        this.compare(this.data[child + 1], this.data[child])
      ) {
        child = child + 1;
      }
      if (this.compare(this.data[index], this.data[child])) {
        break;
      }
      this._swap(index, child);
      index = child;
    }
  }

  _swap(a, b) {
    [this.data[a], this.data[b]] = [this.data[b], this.data[a]];
  }
}
```

## 滑动窗口

### 219. 存在重复元素 II

给你一个整数数组`nums` 和一个整数  `k` ，判断数组中是否存在两个 不同的索引  `i`  和  `j` ，满足 `nums[i] == nums[j]` 且 `abs(i - j) <= k` 。如果存在，返回 true ；否则，返回 false 。

**2022.1.19**

```js
var containsNearbyDuplicate = function (nums, k) {
  const n = nums.length;
  let set = new Set();
  for (let i = 0; i < n; i++) {
    if (i > k) {
      set.delete(nums[i - k - 1]);
    }
    if (set.has(nums[i])) {
      return true;
    }
    set.add(nums[i]);
  }
  return false;
};
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

## bfs&dfs

### leetcode 1345. 跳跃游戏 IV

给你一个整数数组`arr` ，你一开始在数组的第一个元素处（下标为 0）。

每一步，你可以从下标  `i`  跳到下标：

`i + 1`  满足：`i + 1 < arr.length`
`i - 1`  满足：`i - 1 >= 0`
`j`  满足：`arr[i] == arr[j] 且 i != j`
请你返回到达数组最后一个元素的下标处所需的  **最少操作次数** 。

注意：任何时候你都不能跳到数组外面。

**BFS** `2022.1.21`

这道题很容易想到 bfs，因此需要考虑几乎所有情况后的最佳情况。

主要思路是：遍历一遍数组并将元素下标存入哈希表中，然后从 start 开始将其可以到达的 next push 进队列中。并且更新步数。

但是这道题困难就难在该死的测试用例：TLS!!!

因此我们要不断的优化：比如用一个 dp 数组存每一个下标的到达的步数。如果已经走过的话就不用再走了。

最重要的是**过河拆桥**：即走过该格子后将其在哈希表内删除掉！

```js
var minJumps = function (arr) {
  const n = arr.length;
  if (n === 1) return 0;
  let map = new Map();
  for (let i = 0; i < n; i++) {
    if (!map.has(arr[i])) map.set(arr[i], [i]);
    else map.get(arr[i]).unshift(i);
  }
  let dp = new Array(n).fill(Infinity); // 存每个位置最小步数
  dp[0] = 0;
  let queue = [0]; // BFS
  while (queue.length > 0) {
    const i = queue.shift();
    const idxs = map.get(arr[i]);
    let step = dp[i];
    if (idxs) {
      for (let idx of idxs) {
        if (idx === n - 1) return step + 1;
        if (dp[idx] === Infinity) {
          queue.push(idx);
          dp[idx] = step + 1;
        }
      }
    }

    map.delete(arr[i]);
    if (i - 1 >= 0 && dp[i - 1] === Infinity) {
      queue.push(i - 1);
      dp[i - 1] = step + 1;
    }
    if (i + 1 < n && dp[i + 1] === Infinity) {
      if (i + 1 === n - 1) return step + 1;
      if (dp[i + 1] === Infinity) {
        queue.push(i + 1);
        dp[i + 1] = step + 1;
      }
    }
  }
  return dp[n - 1];
};
```

### leetcode 1971. 寻找图中是否存在路径

有一个具有 `n`个顶点的 **双向** 图，其中每个顶点标记从 0 到 n - 1（包含 0 和 n - 1）。图中的边用一个二维整数数组 `edges` 表示，其中 `edges[i] = [ui, vi]` 表示顶点 ui 和顶点 vi 之间的双向边。 每个顶点对由最多一条边连接，并且没有顶点存在与自身相连的边。

请你确定是否存在从顶点 start 开始，到顶点 end 结束的 有效路径 。

给你数组 edges 和整数 n、start 和 end，如果从 start 到 end 存在 有效路径 ，则返回 true，否则返回 false 。

**dfs** `2022.1.27`

首先哈希表将双向边都记录下来。

两个剪枝：过河拆桥以及走过的路不再走

```js
var validPath = function (n, edges, source, destination) {
  const graph = new Map();
  const set = new Set();
  // 0->1,2
  for (let i of edges) {
    const h = i[0];
    const t = i[1];
    if (graph.has(h)) graph.get(h).push(t);
    else graph.set(h, [t]);
    if (graph.has(t)) graph.get(t).push(h);
    else graph.set(t, [h]);
  }
  return dfs(source);
  //
  function dfs(start) {
    if (start === destination) return true;
    if (!graph.has(start)) return false;
    const nxt = graph.get(start);
    graph.delete(start);
    for (let i of nxt) {
      // [1,2]
      if (set.has(i)) continue;
      set.add(i);
      if (dfs(i)) return true;
    }
    return false;
  }
};
```
