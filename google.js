var path = require('path');
var request = require("request");
var encode = require('./encode.js');
var Net = require('./net.js');
var Secrets = require('./secret.js');
var LISTEN_PORT = 8012;

var auth_data = null;

var client_id = "ai5zimpteemtbca";
var secret = Secrets.dropbox_serect;


var serv_uri = "/1/dropbox/oauth2";
//var redirect_uri = "http://localhost:" + LISTEN_PORT + serv_uri;
var redirect_uri = "https://s3-us-west-2.amazonaws.com/online-pdf-manual/test.html";


var delegateList = {};	//userID : nextFunc



//code grant
function codeGrant(res, userID){
	var para = 'client_id='+ client_id +'&response_type=code&redirect_uri='+ encode.uriEncode(redirect_uri) +'&state='+ userID;

	var url = 'https://www.dropbox.com/1/oauth2/authorize?'+para;
	
	//ajax
	var responseData = {
		"url": url
	}
	res.send(JSON.stringify(responseData));
	res.end();
}

function accessToken(query){
	var para = "code="+query.code+"&grant_type=authorization_code&redirect_uri="+encode.uriEncode(redirect_uri);

	var auth = new Buffer(client_id+":"+serect).toString('base64');

	var option = {
		url: 'https://api.dropboxapi.com/1/oauth2/token',
		headers: {
			"Authorization": "Basic "+auth,
			"Content-Type": "application/x-www-form-urlencoded"
	    //	'User-Agent': 'request'
	  	},
	  	body: para
	}

	request.post(option)
	.on('error', function(err) {
	    console.log(err)
	})
	.on('response', function(response) {
	    var chunk = "";
	    response.on('data', function(data) {
			// compressed data as it is received
			//console.log('received ' + data.length + ' bytes of compressed data');
			
			chunk += data.toString();
    	});

    	response.on('end', function(){
			//console.log(chunk);
			auth_data = JSON.parse(chunk);
    	});
	});
}

function getAuthToken(){

	if((typeof auth_data == 'object') && (auth_data.access_token != 'undefined')){
		return auth_data.access_token;
	}

	return null;
}

function doCodeGrantAuth(res){
	var time = Date.now();

	//set callback
	if(delegateList[time] != 'undefined'){
		time += Math.random();
	}
	delegateList[time] = accessToken;

	codeGrant(res, time);
}

function startCodeGrantServ(app){
	app.get(serv_uri, function(req, res){
		//console.log("===== startCodeGrantServ recv =========");
		//console.log(req.query);
		//console.log(req.body);

		var id = req.query["state"];
		var delegate = delegateList[id];
		if(typeof delegate != 'undefined')
		{
			delegate(req.query);

			//response
			res.end("delegating.....");

			//clear
			delegateList[id] = null;
		}
		else
		{
			//console.log(path.join(__dirname, 'www', "test.html"));
			res.sendFile(path.join(__dirname, 'www', "test.html"));
		}
	});



	app.get(serv_uri+"/code", function(req, res){
		//console.log("===== do code Grant Auth =========");
		doCodeGrantAuth(res);
	});
}


exports.startCodeGrantServ = startCodeGrantServ;
//exports.doCodeGrantAuth = doCodeGrantAuth;
//exports.getAuthToken = getAuthToken;