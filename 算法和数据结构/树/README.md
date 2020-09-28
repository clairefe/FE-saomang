<!--
 * @Date: 2020-09-27 21:34:02
 * @LastEditors: hu.wenjun
 * @LastEditTime: 2020-09-28 10:22:27
-->
### 树

#### 力扣题目总结
1. [二叉树的前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)
2. [二叉树的中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)
3. [二叉树的层序遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)
4. [二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)
5. [二叉树的最小深度]([二叉树的最小深度](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/))

#### 了解什么是前序遍历，中序遍历，后序遍历，层序遍历 是什么
前序遍历：root -> left ->right
中序遍历：left -> root -> right
后序遍历：left -> right -> root
层序遍历：root -> 下一层级所有元素 -> 再下一层级所有元素
#### 框架套路
1. 递归法

代码套路
```
//中序遍历套路，前序遍历需要更改入栈顺序
if(!root) return [] //记得针对root为null进行判断
const ans = []
const dfs = (node) => {
  ans.push(node.val)
  node.left && dfs(node.left)
  node.right && dfs(node.right)
}
dfs(root)
return ans
```

2. 迭代法
   
代码套路
```
if(!root) return [] //记得针对root为null进行判断
const ans = []
const queue = [root]
//重要判断条件
while(queue.length){
  let temp = queue.pop()
  ans.push(temp.val)
  //中序遍历套路，前序遍历需要更改入栈顺序
  if(temp.right) queue.push(temp.right)
  if(temp.left) queue.push(temp.left)
}
return ans
```

力扣题目举例说明：

题目1:[二叉树的前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

给定一个二叉树，返回它的 前序 遍历。
示例：
```
输入: [1,null,2,3]  
   1
    \
     2
    /
   3 

输出: [1,2,3]
```

按照套路代码分别运行递归法和迭代法
```
//递归法和上述套路代码一致，运行结果输出[1,2,3]
//迭代法和上述套路代码一致，运行结果输出[1,2,3]
//总结：套路大法好～～～
```

题目2:[二叉树的中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

给定一个二叉树，返回它的中序 遍历。
示例：
```
输入: [1,null,2,3]
   1
    \
     2
    /
   3

输出: [1,3,2]
```

按照套路代码分别运行递归法和迭代法
```
//递归法使用套路大法稍做修改
const dfs = (node) => {
  node.left && dfs(node.left)
  ans.push(node.val)
  node.right && dfs(node.right)
}
//输出[1,3,2]，么得问题
```
迭代法还有不同，此处写下解题思路

1. 由于是中序遍历，所以先压栈左子节点
2. 遍历栈时，节点出栈时把值压入结果数组，同时对右子节点进行处理
3. 注意，右子节点如果存在左子节点，需要进行遍历

代码如下：
```
if(!root) return [] //记得针对root为null进行判断
    const ans = []
    const queue = []
    while(root){
        queue.push(root)
        root = root.left
    }
    while(queue.length){
        let root = queue.pop()
        ans.push(root.val)
        root = root.right
        while(root){
            queue.push(root)
            root = root.left
        }
    }
    return ans
```


题目3:[二叉树的中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

给定一个二叉树，返回它的中序 遍历。
示例：
```
输入: [1,null,2,3]
   1
    \
     2
    /
   3

输出: [1,3,2]
```

按照套路代码分别运行递归法和迭代法
```
//递归法使用套路大法稍做修改
const dfs = (node) => {
  node.left && dfs(node.left)
  ans.push(node.val)
  node.right && dfs(node.right)
}
//输出[1,3,2]，么得问题
```
迭代法还有不同，上述迭代套路不怎么适用，此处写下解题思路

1. 由于是中序遍历，所以先压栈左子节点
2. 遍历栈时，节点出栈时把值压入结果数组，同时对右子节点进行处理
3. 注意，右子节点如果存在左子节点，需要进行遍历

代码如下：
```
if(!root) return [] //记得针对root为null进行判断
    const ans = []
    const queue = []
    while(root){
        queue.push(root)
        root = root.left
    }
    while(queue.length){
        let root = queue.pop()
        ans.push(root.val)
        root = root.right
        while(root){
            queue.push(root)
            root = root.left
        }
    }
    return ans
```
