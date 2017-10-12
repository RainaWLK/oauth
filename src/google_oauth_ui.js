import $ from 'jquery';
//import Google from './google_implicit.js';
import Google from './google_codegrant.js';
import utils from './utils.js';
var jwt = require('jsonwebtoken');

function showCredentials(data){
  let result = "";

  for(let key in data.Credentials){
      result += "<div>"+key+"="+data.Credentials[key]+"</div>";
  }
  $("#google_aws_credential_div").html(result);
  $("#google_aws_identity_id").html(data.IdentityId);

  $("#google_info").show();
}

function showIDToken(id_token){
  var id_token_decoded = jwt.decode(id_token);
  let result = "";

  for(let i in id_token_decoded){
    result += `<div>${i}: ${id_token_decoded[i]}</div>`;
  }
  $("#google_idToken_decoded").html(result);
}

async function oauthCallback(uri){
  var googletoken = utils.getUrlParameter(uri);
  
  if(_.isEmpty(googletoken) == false){
    
    let id_token = googletoken.id_token;

    $("#google_accessToken").html(googletoken.access_token);
    $("#google_idToken").html(googletoken.id_token);
    showIDToken(googletoken.id_token);

    let credentials = await Google.signIn_aws(id_token);
    showCredentials(credentials);
  }
}

function init(){
  $("#google_info").hide();

  $("#googleOauthBtn").on("click", function(){
    Google.sendCodeGrant();
  });
}

exports.init = init;
exports.oauthCallback = oauthCallback;