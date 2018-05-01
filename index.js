"use strict"

let express = require('express');
let app = express();
let port = '4000';


let bodyParser = require('body-parser');
let multer = require('multer');
var upload = multer();
app.use(bodyParser.json());
app.use(upload.array());
app.use(bodyParser.urlencoded({extended: true}));

let router = require('./routes/route.js');

app.use('/', router);


// Add headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port,(error)=>{
	if(error){
		console.log(error);
	}
	else{
		console.log("server is running on port:"+port);
	}
})