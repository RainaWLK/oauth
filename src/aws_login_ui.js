import $ from 'jquery';
import AWS_LOGIN from './aws_login.js';

function showCredentials(data){
  let result = "";

  for(let key in data.Credentials){
      result += "<div>"+key+"="+data.Credentials[key]+"</div>";
  }
  $("#aws_cognito_credential_div").html(result);
  $("#cognito_identity_id").html(data.IdentityId);

  $("#cognito_info").show();
}

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

function init(){
  $("#cognito_info").hide();

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
}

exports.init = init;