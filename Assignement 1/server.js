'use strict';

const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
//Port
const port = process.env.PORT||3000;
//App
app.use('/', express.static("public"))

/* Home Page
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// test only (page showing raw contents of /public/index.html)
app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
*/

// Socket connection
 io.on('connection', (socket) => {
    socket.on('send figure', (msg) => {
      io.emit('share figure', msg);
    });
    socket.on('send Line', (msg) => {
        io.emit('share Line', msg);
      });
 });

// App is listening at port 3000 on local machine
http.listen(port, () => {
  console.log('listening on *:3000');
});