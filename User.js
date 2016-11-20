'use strict';
class User {
  constructor(name, uri, reaction, sock) {
    this.name = name;
    this.uri = uri;
    this.reaction = reaction;
    this.sock = sock;
  }

  getSock() {
    return this.sock;
  }

}

module.exports = User;
