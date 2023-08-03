class Node {
  constructor(value, adjacent = new Set()) {
    this.value = value;
    this.adjacent = adjacent;
  }
}

class Graph {
  constructor() {
    this.nodes = new Set();
  }

  // this function accepts a Node instance and adds it to the nodes property on the graph
  addVertex(vertex) {
    this.nodes.add(vertex);
  }

  // this function accepts an array of Node instances and adds them to the nodes property on the graph
  addVertices(vertexArray) {
    for (const v of vertexArray) {
      this.addVertex(v);
    }
  }

  // this function accepts two vertices and updates their adjacent values to include the other vertex
  addEdge(v1, v2) {
    v1.adjacent.add(v2);
    v2.adjacent.add(v1);
  }

  // this function accepts two vertices and updates their adjacent values to remove the other vertex
  removeEdge(v1, v2) {
    v1.adjacent.delete(v2)
    v2.adjacent.delete(v1);
  }

  // this function accepts a vertex and removes it from the nodes property, it also updates any adjacency lists that include that vertex
  removeVertex(vertex) {
    this.nodes.delete(vertex);
    for (const v of this.nodes) {
      if (v.adjacent.has(vertex)) {
        v.adjacent.delete(vertex);
      }
    }
  }

  // this function returns an array of Node values using DFS
  depthFirstSearch(start) {
    const visitMe = [start];
    const seen = new Set([start]);
    const values = [];

    while (visitMe.length > 0) {
      const curNode = visitMe.pop();
      values.push(curNode.value);
      
      curNode.adjacent.forEach(n => {
        if (!seen.has(n)) {
          seen.add(n);
          visitMe.push(n);
        }
      });
    }

    return values;
  }

  // this function returns an array of Node values using BFS
  breadthFirstSearch(start) {
    const visitMe = [start];
    const seen = new Set([start]);
    const values = [];

    while (visitMe.length > 0) {
      const curNode = visitMe.shift();
      values.push(curNode.value);
      
      curNode.adjacent.forEach(n => {
        if (!seen.has(n)) {
          seen.add(n);
          visitMe.push(n);
        }
      });
    }

    return values;
  }
}

module.exports = {Graph, Node}