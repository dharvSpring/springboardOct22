/** TreeNode: node for a general tree. */

class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

class Tree {
  constructor(root = null) {
    this.root = root;
  }

  /** sumValues(): add up all of the values in the tree. */

  sumValues() {
    let sum = 0;
    const toVisit = [this.root];
    while (toVisit.length > 0) {
      const curNode = toVisit.pop();
      if (curNode) {
        sum += curNode.val;
        if (curNode.children && curNode.children.length > 0) {
          for (const child of curNode.children) {
            toVisit.push(child);
          }
        }
      }
    }
    return sum;
  }

  /** countEvens(): count all of the nodes in the tree with even values. */

  countEvens() {
    let evenCount = 0;
    const toVisit = [this.root];
    while (toVisit.length > 0) {
      const curNode = toVisit.pop();
      if (curNode) {
        evenCount += curNode.val % 2 == 0 ? 1 : 0;
        if (curNode.children && curNode.children.length > 0) {
          for (const child of curNode.children) {
            toVisit.push(child);
          }
        }
      }
    }
    return evenCount;
  }

  /** numGreater(lowerBound): return a count of the number of nodes
   * whose value is greater than lowerBound. */

  numGreater(lowerBound) {
    let greaterCount = 0;
    const toVisit = [this.root];
    while (toVisit.length > 0) {
      const curNode = toVisit.pop();
      if (curNode) {
        greaterCount += curNode.val > lowerBound ? 1 : 0;
        if (curNode.children && curNode.children.length > 0) {
          for (const child of curNode.children) {
            toVisit.push(child);
          }
        }
      }
    }
    return greaterCount;
  }
}

module.exports = { Tree, TreeNode };
