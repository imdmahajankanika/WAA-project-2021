const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var formidable = require('formidable');
var path = require('path');     //used for file path
const fs = require('fs');
let alert = require('alert');
var bodyParser = require('body-parser'); //connects bodyParsing middleware
var img_path;
const { MongoClient, ResumeToken } = require('mongodb');
const { timeStamp } = require('console');
const { cpuUsage } = require('process');
const { userInfo } = require('os');
const DATABASE_NAME = 'imgDB';
const DB_URI = `mongodb://localhost:27017/${DATABASE_NAME}`;
const client = new MongoClient(process.env.MONGODB_URI || DB_URI);
let collection = null;
let db = null;

// Connecting MongoClient
async function GetCollection() {
  await client.connect();
  db = client.db(DATABASE_NAME)
  collection = db.collection('images')
};
GetCollection()

// Render static files under public folder
const port = process.env.PORT || 3000;
app.use('/', express.static("public"))
/*app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});
app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
*/

// Socket connection event
io.on('connection', (socket) => {
  socket.on('send figure', (msg) => {
    io.emit('share figure', msg);
  });
  socket.on('send Line', (msg) => {
    io.emit('share Line', msg);
  });
});
const jsonParser = bodyParser.json()
app.use(jsonParser)

// Upload images on server
app.post('/upload', (req, res, next) => {
  const form = formidable({ multiples: true });
  form.parse(req, function (err, fields, files) {
    // strip off the data: url prefix to get just the base64-encoded bytes
    const data = fields.image.replace(/^data:image\/png;base64,/, "");
    var newpath = path.join(__dirname, 'public');
    var img_folder = path.join(newpath, 'images');
    if (!fs.existsSync(img_folder)) {
      fs.mkdirSync(img_folder);
    }
    img_path = path.join(img_folder, fields.username + "_" + fields.timestamp + ".png");
    fs.writeFile(img_path, data, 'base64', function (err) {
      if (err) throw err;
      alert(`Success! \n\nUser '${fields.username}' saved the image at '${img_path}'!`);
      console.log(`User '${fields.username}' saved the image at '${img_path}'!\n`)
      var doc = { username: fields.username, datetime: fields.timestamp, imgPath: img_path };
      //Add to mongo db
      db.collection('images').insertOne(doc, function (err, res) {
        if (err) throw err
        console.log('1 image saved in mongoDB')
      })
      res.status(200).json({
        message: 'OK'
      })

    });
  });
});

// Get results from mongoDB and display them
app.get("/display", (req, res) => {
  db.collection('images').find({}).toArray(function (err, docs) {
    if (err) return res.status(500).send({ error: err })
    //console.log(docs)
    res.send(docs.length > 0 ? docs : 'No Data');

  });

});

// App is listening on 3000, locally
http.listen(port, () => {
  console.log('listening on: ' + port);
});