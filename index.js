'use strict';
const app = require('express')();
app.set('port', (process.env.PORT || 5000));
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
  res.sendFile(__dirname + '/index.html');
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

    let user = new User(name, reaction, socket);
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

    socket.emit('chatId', chat.getChatId());
  });

  socket.on('chat msg', function(msg){
    console.log('message: ' + msg);

    const msg_parsed = JSON.parse(msg);
    const chatId = msg_parsed.chatId;
    const text = msg_parsed.text;

    const chat = idToChatMap.get(chatId);
    const user = sockToUserMap.get(socket);
    chat.broadcast(text, user);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
