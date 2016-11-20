'use strict';
const Queue = require('./Queue');

class Article {
  constructor(uri, title, topic, bias) {
    this.uri = uri;
    this.title = title;
    this.topic = topic;
    this.bias = bias;
    this.approveQueue = new Queue();
    this.disapproveQueue = new Queue();
    this.indifferentQueue = new Queue();
  }

  // checks if input topic is same as this article's topic
  matchesTopic(topic) {
    return this.topic == topic;
  }

  // finds a user with the opposing reaction
  getPartner(user) {
    let reaction = user.reaction;
    if (reaction == 'Approve') {
      if (disapproveQueue.size() > 0) {
        return disapproveQueue.pop();
      } else if (indifferentQueue.size() > 0) {
        return indifferentQueue.pop();
      }
    } else if (reaction == 'Disapprove') {
      if (approveQueue.size() > 0) {
        return approveQueue.pop();
      } else if (indifferentQueue.size() > 0) {
        return indifferentQueue.pop();
      }
    } else {
      // randomize which queue we select from first
      if(Math.random() > 0.5) {
        if (approveQueue.size() > 0) {
          return approveQueue.pop();
        }
        else if (disapproveQueue.size() > 0) {
          return disapproveQueue.pop();
        }
      } else {
        if (disapproveQueue.size() > 0) {
          return disapproveQueue.pop();
        }
        else if (approveQueue.size() > 0) {
          return approveQueue.pop();
        }
      }
    }
    // no partner could be found
    return null;
  }


  // add to a queue of waiting users if we cannot find any partner to match with
  addToWaiting(user) {
    let reaction = user.reaction;
    if (reaction == 'Approve') {
      this.approveQueue.push(user);
    } else if (reaction == 'Disapprove') {
      this.disapproveQueue.push(user);
    } else {
      this.indifferentQueue.push(user);
    }
  }
}

module.exports = Article;
