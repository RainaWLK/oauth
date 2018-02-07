import $ from 'jquery';
import facebook from './facebook.js';
let B2CSecrets = require('./secret').b2cSecrets;

function init(){
  $.ajaxSetup({ cache: true });
  $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: B2CSecrets.facebook_appid,
      version: 'v2.8' // or v2.1, v2.2, v2.3, ...
    });     

    checkLoginState();

    showLoginBtn(false);
    $('#facebookOauthBtn').on('click', function() {
      checkLoginState();
    });

    $('#facebookLogoutBtn').on('click', function() {
      logout();
    });
  });
}

async function checkLoginState() {
  try{
    let response = await facebook.checkLoginState();
    console.log(response);
    showLoginBtn(true);
    showCredentials(response);
  }
  catch(err){
    console.log(err);
    showLoginBtn(false);
  }
}

async function logout(){
  try {
    let response = await facebook.logout();
    showLoginBtn(false);
  }
  catch(err){
    console.log(err);
  }
}


function showLoginBtn(logined){
  $('#facebookOauthBtn').prop('disabled', logined);
  $('#facebookLogoutBtn').prop('disabled', !logined);
}

function showCredentials(data){
  let result = "";

  for(let key in data.Credentials){
      result += "<div>"+key+"="+data.Credentials[key]+"</div>";
  }
  $("#google_aws_credential_div").html(result);
  $("#google_aws_identity_id").html(data.IdentityId);

  $("#google_info").show();
}

exports.init = init;