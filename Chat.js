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

  broadcast(msg, user, chatId) {
    console.log('num of socks: ' + this.socks.length);
    this.socks.forEach((sock) => {
      let payload = {
        name: user.name,
        msg: msg,
        chatId: chatId,
        reaction: user.reaction,
        myself: sock == user.sock,
      };

      payload = JSON.stringify(payload);
      sock.emit('msg', payload);
    });
  }

}

module.exports = Chat;
