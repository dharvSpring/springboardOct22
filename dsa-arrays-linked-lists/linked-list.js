/** Node: node for a singly linked list. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** LinkedList: chained together nodes. */

class LinkedList {
  constructor(vals = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    for (let val of vals) {
      this.push(val);
    }
  }

  /** push(val): add new value to end of list. */

  push(val) {
    const valNode = new Node(val);
    if (this.tail == null) {
      this.head = valNode;
      this.tail = valNode;
    } else {
      this.tail.next = valNode;
      this.tail = valNode;
    }
    this.length++;
  }

  /** unshift(val): add new value to start of list. */

  unshift(val) {
    const valNode = new Node(val);
    if (this.tail == null) {
      this.head = valNode;
      this.tail = valNode;
    } else {
      valNode.next = this.head;
      this.head = valNode;
    }
    this.length++;
  }

  /** pop(): return & remove last item. */

  pop() {
    if (this.head == null || this.tail == null) {
      return null;
    }

    let [curNode, prevNode] = [this.head, null];
    while (curNode.next != null) {
      prevNode = curNode;
      curNode = curNode.next;
    }

    const retVal = this.tail.val;
    this.tail = prevNode;
    if (this.tail != null) {
      this.tail.next = null;
    }

    // empty?
    if (this.tail == null) {
      this.head = null;
    }
    this.length--;

    return retVal;
  }

  /** shift(): return & remove first item. */

  shift() {
    if (this.head == null) {
      return null;
    }

    const retVal = this.head.val;
    this.head = this.head.next;

    // empty?
    if (this.head == null) {
      this.tail = null;
    }
    this.length--;

    return retVal
  }

  /** getAt(idx): get val at idx. */

  getAt(idx) {
    let curNode = this.head;
    while (idx > 0) {
      curNode = curNode.next;
      idx--;
    }
    return curNode.val;
  }

  /** setAt(idx, val): set val at idx to val */

  setAt(idx, val) {
    let curNode = this.head;
    while (idx > 0) {
      curNode = curNode.next;
      idx--;
    }
    curNode.val = val;
  }

  /** insertAt(idx, val): add node w/val before idx. */

  insertAt(idx, val) {
    const valNode = new Node(val);

    if (this.head == null) {
      this.head = valNode;
      this.tail = valNode;
    } else {
      const updateTail = (idx == this.length);

      let [curNode, prevNode] = [this.head, null];
      while (idx > 0) {
        prevNode = curNode;
        curNode = curNode.next;
        idx--;
      }

      prevNode.next = valNode;
      valNode.next = curNode;

      if (updateTail) {
        this.tail = valNode;
      }
    }

    this.length++;
  }

  /** removeAt(idx): return & remove item at idx, */

  removeAt(idx) {
    if (idx === 0) {
      this.head = this.head.next;
    } else {
      let [curNode, prevNode] = [this.head, null];
      while (idx > 0) {
        prevNode = curNode;
        curNode = curNode.next;
        idx--;
      }
      prevNode.next = curNode.next;
    }

    this.length--;
    if (this.length == 0) {
      this.tail = null;
    }
  }

  /** average(): return an average of all values in the list */

  average() {
    let [sum, count] = [0, 0];
    let curNode = this.head;
    while (curNode != null) {
      sum += curNode.val;
      count++;
      console.log(count, sum)
      curNode = curNode.next;
    }

    return (count > 0) ? (sum / count) : 0;
  }
}

module.exports = LinkedList;
