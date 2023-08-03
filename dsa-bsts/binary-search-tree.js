class Node {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(root = null) {
    this.root = root;
  }

  /** insert(val): insert a new node into the BST with value val.
   * Returns the tree. Uses iteration. */

  insert(val) {
    if (this.root == null) {
      this.root = new Node(val);
    } else {
      let inserted = false;
      let curNode = this.root;
      while (!inserted) {
        if (val <= curNode.val) {
          if (curNode.left == null) {
            curNode.left = new Node(val);
            inserted = true;
          } else {
            curNode = curNode.left;
          }
        } else {
          if (curNode.right == null) {
            curNode.right = new Node(val);
            inserted = true;
          } else {
            curNode = curNode.right;
          }
        }
      }
    }

    return this;
  }

  /** insertRecursively(val): insert a new node into the BST with value val.
   * Returns the tree. Uses recursion. */

  insertRecursively(val) {
    if (this.root == null) {
      this.root = new Node(val);
    } else {
      const insertHelper = (val, node) => {
        if (val <= node.val) {
          if (node.left == null) {
            node.left = new Node(val);
          } else {
            insertHelper(val, node.left);
          }
        } else {
          if (node.right == null) {
            node.right = new Node(val);
          } else {
            insertHelper(val, node.right);
          }
        }
      }
      insertHelper(val, this.root);
    }

    return this;
  }

  /** find(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses iteration. */

  find(val) {
    let curNode = this.root;
    while (curNode != null) {
      if (curNode.val == val) {
        return curNode;
      }

      if (val < curNode.val) {
        curNode = curNode.left;
      } else {
        curNode = curNode.right;
      }
    }

    return undefined;
  }

  /** findRecursively(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses recursion. */

  findRecursively(val) {
    const findHelper = (val, node) => {
      if (node == null || val == node.val) {
        return node;
      }

      if (val < node.val) {
        return findHelper(val, node.left);
      } else {
        return findHelper(val, node.right);
      }
    }
    const node = findHelper(val, this.root);
    return node == null ? undefined : node;
  }

  /** dfsPreOrder(): Traverse the array using pre-order DFS.
   * Return an array of visited nodes. */

  dfsPreOrder() {
    const nodes = [];

    function traverse(node) {
      nodes.push(node.val);
      node.left && traverse(node.left);
      node.right && traverse(node.right);
    }

    traverse(this.root);
    return nodes;
  }

  /** dfsInOrder(): Traverse the array using in-order DFS.
   * Return an array of visited nodes. */

  dfsInOrder() {
    const nodes = [];

    function traverse(node) {
      node.left && traverse(node.left);
      nodes.push(node.val);
      node.right && traverse(node.right);
    }

    traverse(this.root);
    return nodes;
  }

  /** dfsPostOrder(): Traverse the array using post-order DFS.
   * Return an array of visited nodes. */

  dfsPostOrder() {
    const nodes = [];

    function traverse(node) {
      node.left && traverse(node.left);
      node.right && traverse(node.right);
      nodes.push(node.val);
    }

    traverse(this.root);
    return nodes;
  }

  /** bfs(): Traverse the array using BFS.
   * Return an array of visited nodes. */

  bfs() {
    const nodes = [];

    const queue = [this.root];
    while (queue.length > 0) {
      const curNode = queue.shift();
      nodes.push(curNode.val);
      if (curNode.left) {
        queue.push(curNode.left);
      }
      if (curNode.right) {
        queue.push(curNode.right);
      }
    }
    
    return nodes;
  }

  /** Further Study!
   * remove(val): Removes a node in the BST with the value val.
   * Returns the removed node. */

  remove(val) {

  }

  /** Further Study!
   * isBalanced(): Returns true if the BST is balanced, false otherwise. */

  isBalanced() {

  }

  /** Further Study!
   * findSecondHighest(): Find the second highest value in the BST, if it exists.
   * Otherwise return undefined. */

  findSecondHighest() {

  }
}

module.exports = BinarySearchTree;
