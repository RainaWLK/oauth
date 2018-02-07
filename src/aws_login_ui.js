import $ from 'jquery';
import AWS_LOGIN from './aws_login.js';
let aws4 = require('aws4');

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


    $("#awsTestSignBtn").off("click").on("click", function(){
      testSign(credentials.data.Credentials);
    });

    showCredentials(credentials.data);
    
  }
  catch(err) {
    alert(err);
  }
}

function testSign(credentials){
  let result = aws4.sign({
    host: 'aoboid0wkl.execute-api.us-east-1.amazonaws.com',
    service: 'execute-api',
    path: '/development/v1/restaurants/r1508839802213',
    headers: {
      'Content-Type': 'application/json'
    },
    signQuery: true
  }, {
    secretAccessKey: credentials.SecretKey,
    accessKeyId: credentials.AccessKeyId,
    sessionToken: credentials.SessionToken
    //secretAccessKey: 'v+FivY9floc+xwhlk7IX7RaA07jzpBtEYy4zT7R7',
    //accessKeyId: 'ASIAIFGBDTZFNMOUZMRA',
    //sessionToken: 'AgoGb3JpZ2luEPv//////////wEaCXVzLWVhc3QtMSKAAiUonvqFrd/Z/8yUq4NQWMO4nPsQIfwMo8QpGHJ1eu1j7i4tmK7sHFyqwDF6QTWg28e+tsDmmr2aldY0xF2AQtWyHF3S3f2CSdmgDCvp5iysHOvmVE8hjiICaOZalGOOUOEDnxyEJuEjnKqATxkSZWBcUQNLb2kqIPpv5v7AbV5Dd91up00/OxLtPN0/gPBAMHWKyhwhByMlyjB1eFhyus67SvGELYEgd//AiGj1bpwAcB2iHcoJebxeUdMa0hxFQESQ3da+tpS2Vg0Oo3dCapKTNSN5udaEr6ov5jXng3msTsDg2sYeB8Th47n/qCqgmn7/K04UiQDxTzLiiIEUSG8qrwUIkP//////////ARAAGgw1NTI5NTAyNjIyODgiDDZCbfzQRmZYUvEgECqDBai/Nm/NgjxRSfdITACY1TS3CIsC6mGjrKbfi71KOVoHcn1lDUBVXpDmU6zNSJBBVXGv3Fs3x+PQ1eH1gmicu+t+mR4VE0Gbfrr1hh0j7gzdcJSAjGnuM6p7AJir1TpRB8UMYj+gpdmSBjxUFE8cRTKDNiRIU92rkXqzPqc8hvzq9OPLYT82VMu5JUpvkz9U0vMPIWRzuTXX9Kp1JbV60SA1m511Al5KQ7hW8eoTEKckt0/M24mljSGUhDzDWnJy5MYZK/zL0vv9ueWAwxZSvpVWEnIw7Y9kp8+Wy+ZyjkutWADLFwnLWtCCwNIM09v+fQtLVDQiZQ2JF3gocLhNPh7tMc/YncIlLhh+4TWRCFS56XqepospQU5gmcyR/Jrd7af9WHRHqNC9wEn0tznD33v9E89fISgguX2uunF+PF0AExbzZVGDMSWvh9YWReCRQtQCObV9NOSIb+zdEYWt1EUZfZT9z3eG9kwDjVXy5a9RAPszIIYozfWHOxNdF2GhRlpcV8sRmqzADvIS4BFgaNJ5tAMSSSFtpJaFspJsLyMB/AcNUC2qq4EzVu5Omk+bHBYRHl8Jz5PicIKlGezicikE/CpxxYGD7rtOY0TVmoUAM8kT654Zx3M6ZNLDErmmn5VYYi/ISpAQNb9hgYYZr2YxaekyKkENG0AcTAYD+e+5QWuSNXNoYNHjdmIwDd6FsSShDEew27QeWCzK/svPSkYY8M/7qzkjI+Us1W0Xm91QgrXmgUIRmHDobEKQkjnHLsHzg8RUA5fNhaSWzX3TcqOLXJUieV6U+6kR9IHVr8LXb1WWQdGSJ5djfZ7qcMuoNpT+7PPHPGUHW2ViZHx+QFAhcA0w47/D0gU='
  });
  console.log(result);

  let ajaxOptions = {
    type: 'GET',
    url: "https://portal-dev.mira.menu" + result.path.substring(12),
    //url: "https://aoboid0wkl.execute-api.us-east-1.amazonaws.com" + result.path,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  console.log(ajaxOptions);
  $.ajax(ajaxOptions).then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  });
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
  $("#awsTestSignBtn").on("click", function(){
    testSign();
  });

  $("#awsLoginBtn").on("click", async function(){
    signIn();
  });

  $("#username").val("demo");
  $("#password").val("1qazxsw2");
}

exports.init = init;