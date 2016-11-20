'use strict';
class Chat {
  constructor(chatId) {
    this.chatId = chatId;
    this.socks = [];
  }

  addUser(sock) {
    this.socks.push(sock);
    sendChatSize();
  }

  removeUser(sock) {
    let index = this.socks.indexOf(sock);
    if (index > -1) {
      this.socks.splice(index, 1);
    }
    sendChatSize();
  }

  containsUser(sock) {
    let output = false;
    this.socks.forEach((currSock) => {
      if (sock == currSock) {
        output = true;
      }
    });

    return output;
  }

  getPartner(sock) {
    let output = null;
    this.socks.forEach((currSock) => {
      if (sock != currSock) {
        output = currSock;
      }
    });

    return output;
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

  sendChatSize() {
    this.socks.forEach((sock) => {
      let payload = {
        size: this.socks.length,
        chatId: chatId,
      }
      payload = JSON.stringify(payload);
      sock.emit('chatSize', payload);
    });
  }

}

module.exports = Chat;
