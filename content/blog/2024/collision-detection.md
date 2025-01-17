---
title: '四叉树与碰撞检测'
draft: true
navigation: false
date: 2024-07-06
---

# 四叉树

https://www.mikechambers.com/blog/2011/03/21/javascript-quadtree-implementation/

# 碰撞检测

碰撞检测算法在实际应用中，一般可分为两步：

- 粗略碰撞检测
- 精细碰撞检测

粗略碰撞检测用来将明显不相交的两个物体快速排除，精细碰撞检测则用来准确判断两个物体是否相交。

## 粗略碰撞检测

### 包围形法

https://zhuanlan.zhihu.com/p/508757803

包围形方法的基本思想是用一个简单的包围形状（圆、矩形）将复杂不规则的物体包围住，当两个包围形不相交时，则两个物体肯定不相交。

包围形可分为：

- 外接圆形
- 轴对齐包围矩形（Axis Aligned Bounding Box，AABB）

### 外接圆形

使用外接圆的方式来粗略判断是否碰撞是非常快的。只要两个圆形的圆心距离 大于 两个圆的半径之和，则这两个圆不相交。

![img](https://pic4.zhimg.com/80/v2-8b02624ab1309930dbc49df0a36b1e63_720w.webp)

### 轴对齐包围矩形（AABB）

轴对齐包围矩形（Axis Aligned Bounding Box，AABB），即用一个矩形包围车体，且矩形的边与某个坐标轴平行，如下图所示。

![img](https://pic3.zhimg.com/80/v2-94aba714b8bf374c1681f870b286548e_720w.webp)

### 转向包围矩形（OBB）

在轴对齐包围矩形（Axis Aligned Bounding Box，AABB）基础之上，更为准确的是 转向包围矩形（Oriented Bounding Box，OBB），如下图所示。

![img](https://pic2.zhimg.com/80/v2-c8e3003158264e8ff9b5b9c36e74691d_720w.webp)

OBB 与 AABB 的差别在于物体旋转之后，AABB 的大小会发生改变，保证每条边与某个坐标轴平行；OBB 的大小则不会改变，且将随物体一起旋转。

OBB 相比 AABB 更接近物体本身的形状，其用到的碰撞检测的算法也要比 AABB 复杂，如分离轴定理（Separating Axis Theorem，SAT）、GJK（Gilbert–Johnson–Keerthi）算法，接下来在精细碰撞检测部分会有详细介绍。

## 精细碰撞检测

### 分离轴定理（SAT）

https://zhuanlan.zhihu.com/p/508874496

**向量**

**投影**

### GJK

闵可夫斯基差

https://zhuanlan.zhihu.com/p/511164248
