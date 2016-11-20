'use strict';
const Node = require('./Node');

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  push(data) {
    let curr = new Node(data);
    curr.next = null;
    if (this.tail != null) {
      this.tail.next = curr;
    }
    else {
      this.head = curr;
    }
    this.tail = curr;
    this.size++;
  }

  pop(data) {
    let curr = this.head;
    if (curr != null) {
      this.head = curr.next;
      this.size--;
    }
    return curr;
  }

  getSize() {
    return this.size;
  }
}

module.exports = Queue;
