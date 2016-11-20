'use strict';
class Article {
  constructor(uri, title, topic, bias) {
    this.uri = uri;
    this.title = title;
    this.topic = topic;
    this.bias = bias;
  }
}

module.exports = Article;
