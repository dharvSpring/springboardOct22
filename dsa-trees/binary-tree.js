/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }

  isLeaf() {
    return (this.left === null && this.right === null);
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth() {
    if (!this.root) {
      return 0;
    }

    function minDepthCount(node) {
      if (node.isLeaf()) {
        return 1;
      } else if (node.left === null) {
        return minDepthCount(node.right) + 1;
      } else if (node.right === null) {
        return minDepthCount(node.left) + 1;
      } else {
        return Math.min(minDepthCount(node.left), minDepthCount(node.right)) + 1;
      }
    }

    return minDepthCount(this.root);
  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth() {
    if (!this.root) {
      return 0;
    }

    function maxDepthCount(node) {
      if (node.isLeaf()) {
        return 1;
      } else if (node.left === null) {
        return maxDepthCount(node.right) + 1;
      } else if (node.right === null) {
        return maxDepthCount(node.left) + 1;
      } else {
        return Math.max(maxDepthCount(node.left), maxDepthCount(node.right)) + 1;
      }
    }

    return maxDepthCount(this.root);
  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */

  maxSum() {
    let result = 0;

    function sumCount(node) {
      if (node === null) {
        return 0;
      }

      const leftSum = sumCount(node.left);
      const rightSum = sumCount(node.right);

      result = Math.max(result, node.val + leftSum + rightSum);
      return Math.max(0, leftSum + node.val, rightSum + node.val);
    }

    sumCount(this.root);
    return result;
  }

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(lowerBound) {
    if (!this.root) {
      return null;
    }

    let result = null;
    const toVisit = [this.root];

    while (toVisit.length > 0) {
      const curNode = toVisit.pop();
      const curVal = curNode.val;
      if (curVal > lowerBound) {
        if (result === null || curVal < result) {
          result = curVal;
        }
      }

      if (curNode.left != null) {
        toVisit.push(curNode.left);
      }
      if (curNode.right != null) {
        toVisit.push(curNode.right);
      }
    }

    return result;
  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {

  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize() {

  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */

  static deserialize() {

  }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {

  }
}

module.exports = { BinaryTree, BinaryTreeNode };
