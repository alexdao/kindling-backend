'use strict';
class User {
  constructor(name, reaction, sock) {
    this.name = name;
    this.reaction = reaction;
    this.sock = sock;
  }

  getSock() {
    return this.sock;
  }

}

module.exports = User;
