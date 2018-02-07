let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let request = require('request');

let LISTEN_PORT = 8012;

let client_id = 'xxxxxxx-xxxxxxxxxxxxxxxxx.apps.googleusercontent.com';
let client_secret = 'xxxxxxxxxxxxxxxxxxxxxxx';

function exchangeCode(code, res){

  let formData = {
    "code": code,
    "client_id": client_id,
    "client_secret": client_secret,
    "redirect_uri": "http://ec2-xxxxxx.compute-1.amazonaws.com:8012/code",
    "grant_type": "authorization_code"
  }
  let result = "";

  request.post('https://www.googleapis.com/oauth2/v4/token').form(formData)
  //.on('response', res => {
    //console.log(res);
  //  console.log(res.toJSON());
  .on('data', chunk => {
    result += chunk;
  }).on('end', () => {
    console.log(result);
    res.send(result);
    res.end();
  }).on('error', err => {
    console.log(err);
  });
}

function main(){
  let app = express();
  app.use(bodyParser.json());


  app.get('/code', (req,res) => {
    console.log("/code");
    console.log(req.query);

    exchangeCode(req.query.code, res);
    //res.send("jumi");
    //res.end();
  });

  let server = app.listen(process.env.PORT || LISTEN_PORT, function(){
    let host = server.address().address;
    let port = server.address().port;

    console.log("Server running at http://"+host+":"+port);
  });

}

main();

