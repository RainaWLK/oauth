var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
let Google = require('./google.js');

const LISTEN_PORT = 8012;
let app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

function startServer(){
  
  app.use(bodyParser.json()); // for parsing application/json

  //static
  app.use(express.static(path.join(__dirname, 'www')));
  app.use(function(req, res){
    res.sendStatus(404);
  });

  var server = app.listen(process.env.PORT || LISTEN_PORT, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server running at http://"+host+":"+port);
  });

  return app;
}

function main(){



  //web services
  //Dropbox.startCodeGrantServ(app);
  //Dropbox.startImplictGrantServ(app);
  //Google.startCodeGrantServ(app);
  Google.startImplictServ(app);

  startServer();
}

main();