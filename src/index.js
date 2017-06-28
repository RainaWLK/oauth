import $ from 'jquery';
import AWS from 'aws-sdk';
var AWSCognito = require('amazon-cognito-identity-js');
let Secrets = require('./secret').Secrets;
let SendRest = require('./sendRest');
let AWS_LOGIN = require('./aws_login');
import Google from './google_implicit';

let id_token;

$(document).ready(function() {
    var googletoken = getUrlParameter(window.location.href);

    if($.isEmptyObject(googletoken) == false){
      let id_token_jwt = parseJwt(googletoken.id_token);
      id_token = googletoken.id_token;

      $("#accessToken").html(googletoken.access_token);
      $("#idToken").html(googletoken.id_token);
      $("#idToken_jwt").html(JSON.stringify(id_token_jwt));
    }

    $("#awsSignupBtn").on("click", function(){
      signUp();
    });

    $("#awsVerifyBtn").on("click", function(){
      verify();
    });

    /*$("#awsForgetBtn").on("click", function(){
      confirmPassword();
    });*/

    $("#awsLoginBtn").on("click", async function(){
      signIn();
    });

    $("#googleOauthBtn").on("click", function(){
      Google.sendImplictRequest();
    });

    $("#oauthCredentialBtn").on("click", function(){
      googleSignIn();
    });

    $("#callResource").on("click", async function(){
      callResource();
    });
});

async function signUp(){
  var username = document.getElementById("signup_username").value;
  var password = document.getElementById("signup_password").value;
  var email = document.getElementById("signup_email").value;

  var signupData = [
      {
      Name : 'name',
      Value : username // your name here
      },
      {
      Name : 'email',
      Value : email // your email here
      },
      {
      Name : 'phone_number',
      Value : '+14325551212' // your phone number here with +country code and no delimiters in front
      }
  ];

  try {
    let cognitoSignupUser = await AWS_LOGIN.signUp(username, password, signupData);
    console.log('user name is ' + cognitoSignupUser.getUsername());
    alert(cognitoSignupUser.getUsername() + " Sign Up Success");
  }
  catch(err) {
    alert(err);
  }
}

async function verify(){
  var username = document.getElementById("verificate_username").value;
  var code = document.getElementById("verificate_code").value;

  try {
    let result = await AWS_LOGIN.verify(username, code);
    console.log('call result: ' + result);
    alert(result);
  }
  catch(err) {
    alert(err);
  }
}

async function signIn(){
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  
  try {
    let credentials = await AWS_LOGIN.signIn(username, password);
    console.log(credentials);

    showCredentials(credentials.data);
    
  }
  catch(err) {
    alert(err);
  }
}

async function googleSignIn(){
  let credentials = await AWS_LOGIN.registerFederateIdentityPool('accounts.google.com', id_token);

  showCredentials(credentials.data);
}

function showCredentials(data){
  let result = "";

  for(let key in data.Credentials){
      result += "<div>"+key+"="+data.Credentials[key]+"</div>";
  }
  $("#aws_credential_div").html(result);
  $("#identity_id").html(data.IdentityId);
}

async function callResource(){
  try {
    let uri = $("#api").val();
    let result = await SendRest.sendToAPIGateway(AWS.config.credentials, "GET", uri);

    $("#rest_result").html(JSON.stringify(result.data));
  }
  catch(err) {
    alert(err);
  }
}

function deleteUser() {
  if(cognitoLoginUser == null)
    return;

  cognitoLoginUser.deleteUser(function(err, result) {
      if (err) {
          alert(err);
          return;
      }
      console.log('call result: ' + result);
      alert(result);
  });    
}

function getUrlParameter(url) {
  var parsedUrl = new URL(url);

  let inputData = parseFragments(parsedUrl);
  return inputData;
};

function parseFragments(parsedUrl){  
  let result = {};

  if(parsedUrl.hash.length > 0){
    let fragments = parsedUrl.hash.split('&');

    for(let i in fragments){
      let keyIndex = fragments[i].indexOf('=');
      let key = fragments[i].substring(0, keyIndex);
      let value = fragments[i].substring(keyIndex+1);

      result[key] = value;
    }
  }

  return result;
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};