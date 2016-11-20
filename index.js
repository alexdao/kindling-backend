'use strict';
const app = require('express')();
app.set('port', (process.env.PORT || 3000));
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Article = require('./Article');
const Chat = require('./Chat');
const User = require('./User');

let uriToArticleMap = new Map();
let uriToChatMap = new Map();
let idToChatMap = new Map();
let sockToUserMap = new Map();
let chatId = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/testing/index.html');
});

io.origins('*:*');
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('init', function(init){
    const init_parsed = JSON.parse(init);
    const uri = init_parsed.uri;
    const name = init_parsed.name;
    const reaction = init_parsed.reaction;
    const title = init_parsed.title;
    const topic = init_parsed.topic;
    const bias = init_parsed.bias;

    let user = new User(name, uri, reaction, socket);
    let article = new Article(uri, title, topic, bias);

    sockToUserMap.set(socket, user);
    uriToArticleMap.set(uri, article);
    let chat;
    if (uriToChatMap.get(uri) == null) {
      chat = new Chat(chatId);
      chat.addUser(socket);
      uriToChatMap.set(uri, chat);
      idToChatMap.set(chatId, chat);
      chatId++;
    }
    else {
      chat = uriToChatMap.get(uri);
      chat.addUser(socket);
    }

    socket.emit('chatId', {chatId: chat.getChatId()});
  });

  socket.on('chat msg', function(msg){
    console.log('message: ' + msg);

    const msg_parsed = JSON.parse(msg);
    const chatId = msg_parsed.chatId;
    const text = msg_parsed.text;

    const chat = idToChatMap.get(chatId);
    const user = sockToUserMap.get(socket);
    chat.broadcast(text, user, chatId);
  });

  // requesting a private chat
  socket.on('private', function(){
    console.log('Starting private chat.');

    const user = sockToUserMap.get(socket);
    const article = uriToArticleMap.get(user.uri);

    // check current article for matching pair
    let partner = article.getPartner(user);
    if (partner == null) {
      // check all articles
      let articleIter = uriToArticleMap.values();
      next = articleIter.next();
      while (!next.done && partner == null) {
        let currentArticle = next.value;
        if (currentArticle.matchesTopic(article.topic)){
          partner = otherArticle.getPartner(user);
        }
        next = articleIter.next();
      }
    }

    if (partner == null) {
      // no partner exists so we need to wait for one
      article.addToWaiting(user);
    }
    else {
      // create new chat
      let chat = new Chat(chatId);
      chat.addUser(socket);
      chat.addUser(partner.getSock());
      idToChatMap.set(chatId, chat);
      chatId++;

      // send chatId to both client
      socket.emit('chatId', chat.getChatId());
      partner.socket.emit('chatId', chat.getChatId());
    }
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    const user = sockToUserMap.get(socket);
    const uri = user.uri;

    // remove from group chat
    const chat = uriToChatMap.get(uri);
    let groupChatId = chat.getChatId();
    chat.removeUser(socket);

    // remove from all private chats
    idToChatMap.forEach((currChat, currChatId) => {
      if (currChatId != groupChatId) {
        if (currChat.containsUser(socket)) {
          // send the partner a disconnect message
          let partner = currChat.getPartner(socket);
          if (partner != null) {
            partner.socket.emit('disconnect', currChat.getChatId());
          }

          // delete chat from map
          idToChatMap.delete(currChatId);
        }
      }
    });
  });
});

http.listen(app.get('port'), function(){
  console.log('listening on *:' + app.get('port'));
});
