'use strict';
// Port
const port = process.env.PORT||3000;
const express = require('express');
const app =express();
//App
app.use('/quiz',express.static("public"))
app.get('/', function(req,res){
    res.send("Main Page!")
})
app.listen(port,function(){
    console.log("Server is listening at default port! "+port)
})