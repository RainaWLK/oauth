var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var Dropbox = require('./dropbox.js');
var LISTEN_PORT = 8012;

function getFileList(){
	console.log("======= get file list================");
	var para = "";

	var access_token = Dropbox.getAuthToken();
	if(access_token == null)
		return;


	var option = {
		url: 'https://api.dropboxapi.com/1/metadata/auto/',
		headers: {
			"Authorization": "Bearer " + access_token,
			"Content-Type": "application/x-www-form-urlencoded"
	    //	'User-Agent': 'request'
	  	},
	  	body: para
	}

	request.get(option)
	.on('error', function(err) {
	    console.log(err)
	})
	.on('response', function(response) {
	    console.log(response.statusCode); // 200
	    var chunk = "";
	    response.on('data', function(data) {
			// compressed data as it is received
			console.log('received ' + data.length + ' bytes of compressed data');
			
			chunk += data.toString();
    	});

    	response.on('end', function(){
    		var data = JSON.parse(chunk);
			console.log(data);
    	});
	});
}

function startServer(){
	var app = express();
	app.use(bodyParser.json()); // for parsing application/json
	
	//web services
	Dropbox.startCodeGrantServ(app);
	Dropbox.startImplictGrantServ(app);

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

	startServer();


}

main();