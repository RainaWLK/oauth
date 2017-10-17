let AWS_LOGIN = require('./aws_login.js');
let B2CSecrets = require('./secret').b2cSecrets;


// This is called with the results from from FB.getLoginStatus().
async function statusChangeCallback(response) {
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  try{
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      let me_res = await testAPI();
      return me_res;
    } else {
      console.log("do facebook login");

      let credentials = "";
      return new Promise((resolve, reject) => {
        FB.login(async (response) => {
          console.log(response);
          // Check if the user logged in successfully.
          if (response.authResponse) {
            console.log('You are now logged in.');
        
            // Add the Facebook access token to the Cognito credentials login map.
            credentials = await signIn_aws(response.authResponse.accessToken);
          } else {
            console.log('There was a problem logging you in.');
          }
          resolve(credentials);
        }, {scope: 'public_profile, email'});
      });
    }
  }
  catch(err){
    throw err;
  }

}

async function signIn_aws(id_token){
  let credentials = await AWS_LOGIN.registerFederateIdentityPool('graph.facebook.com', id_token, B2CSecrets.aws_identity_pool_id);
  
  return credentials.data;
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  return new Promise((resolve, reject) =>{
    FB.getLoginStatus(async (response) => {
      let login_res = await statusChangeCallback(response);
      resolve(login_res);
    });    
  });
}

function logout(){
  return new Promise((resolve, reject) =>{
    FB.logout((response) =>{
      console.log(response);
      resolve(response);
    });
  });
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  return new Promise((resolve, reject) => {
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      resolve(response);
    });
  });

}

exports.logout = logout;
exports.checkLoginState = checkLoginState;