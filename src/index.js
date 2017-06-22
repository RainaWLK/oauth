import $ from 'jquery';
import AWS from 'aws-sdk';
var AWSCognito = require('amazon-cognito-identity-js');
let Secrets = require('./secret').Secrets;

$(document).ready(function() {
    console.log( "ready!" );
    var googletoken = getUrlParameter('access_token');
    
    if(typeof googletoken != 'undefined'){
      console.log(googletoken);
      signinCallback(googletoken);
    }

    $("#awsLoginBtn").on("click", function(){
      //awsLogin(id_token);
      signIn();
    });
});

//console.log(AWSCognito);
//AWSCognito.config.region = 'us-east-1';
  
  var poolData = {
    UserPoolId : Secrets.cognito_user_pool_id, // your user pool id here
    ClientId :  Secrets.congito_client_id// your app client id here
  };
  console.log(poolData);
  
  var cognitoSignupUser;
  var cognitoLoginUser = null;

  function signUp() {
    var attributeList = [];

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

    signupData.map(data => {
      var attribute = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(data);
      attributeList.push(attribute);
    });

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    userPool.signUp(username, password, attributeList, null, function(err, result){
      if (err) {
          alert(err);
          return;
      }
      cognitoSignupUser = result.user;
      console.log('user name is ' + cognitoSignupUser.getUsername());
      alert(cognitoSignupUser.getUsername() + " Sign Up Success");
    });
  }
  
  function verify(){
    var username = document.getElementById("verificate_username").value;
    var code = document.getElementById("verificate_code").value;
    console.log(username);
    console.log(code);

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, function(err, result) {
      if (err) {
          alert(err);
          return;
      }
      console.log('call result: ' + result);
      alert(result);
    });
  }

  function signIn() {
    console.log("signin");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var userData = {
        Username : username, // your username here
        Pool : userPool
    };

    var authenticationData = {
        Username : username, // your username here
        Password : password, // your password here
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
 
    cognitoLoginUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoLoginUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
          console.log('access token + ' + result.getAccessToken().getJwtToken());
          document.getElementById("accessToken").innerHTML = "Access Token = " + result.getAccessToken().getJwtToken();
          console.log('idToken + ' + result.idToken.jwtToken);
          document.getElementById("idToken").innerHTML = "ID Token = " + result.idToken.jwtToken;

          //integrate into federate indentity pool
          AWS.config.region = 'us-east-1';
          let idp = 'cognito-idp.us-east-1.amazonaws.com/'+ Secrets.cognito_user_pool_id;
          let logins = {};
          logins[idp] = result.getIdToken().getJwtToken();

          console.log(logins);

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : aws_identity_pool_id,
                Logins : logins
          });

          AWS.config.credentials.refresh((error) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Successfully logged!');
                console.log(AWS.config.credentials);
                showCredentials(AWS.config.credentials.data);
                sendToAPIGateway(AWS.config.credentials.data);
            }
          });
      },

      onFailure: function(err) {
          alert(err);
      },
      mfaRequired: function(codeDeliveryDetails) {
          var verificationCode = prompt('Please input verification code' ,'');
          cognitoLoginUser.sendMFACode(verificationCode, this);
      }
    });
  }

  function confirmPassword(){
    var username = document.getElementById("reset_username").value;
    var newPassword = document.getElementById("reset_newpassword").value;
    var code = document.getElementById("reset_code").value;

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.confirmPassword(code, newPassword, {
      onFailure(err) {
        console.log(err);
      },
      onSuccess() {
        console.log("success");
      }
    });
  }

  function showCredentials(data){
    let result = "";

    for(let key in data.Credentials){
        result += "<div>"+key+"="+data.Credentials[key]+"</div>";
    }
    $("#aws_credential_div").html(result);

    $("#identity_id").html(data.IdentityId);
  }

  function callResource(){

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
