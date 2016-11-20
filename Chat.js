'use strict';
class Chat {
  constructor(chatId) {
    this.chatId = chatId;
    this.socks = [];
  }

  addUser(sock) {
    this.socks.push(sock);
  }

  getChatId() {
    return this.chatId;
  }

  broadcast(msg, user) {
    console.log('num of socks: ' + this.socks.length);
    this.socks.forEach((sock) => {
      if(sock != user.sock) {
        // broadcast the message to everybody but ourselves
        let payload = new Object();
        payload.name = user.name;
        payload.msg = msg;
        payload = JSON.stringify(payload);
        sock.emit('msg', payload);
      }
    });
  }

}

module.exports = Chat;
