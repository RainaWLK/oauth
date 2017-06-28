import AWS from 'aws-sdk';
let AWSCognito = require('amazon-cognito-identity-js');
let Secrets = require('./secret').Secrets;

let poolData = {
    UserPoolId : Secrets.cognito_user_pool_id, // your user pool id here
    ClientId :  Secrets.congito_client_id// your app client id here
};

AWS.config.region = Secrets.region;

function signUp(username, password, signupData) {
    let cognitoSignupUser;
    let attributeList = [];

    signupData.map(data => {
        let attribute = new AWSCognito.CognitoUserAttribute(data);
        attributeList.push(attribute);
    });

    return new Promise((resolve, reject) => {
        let userPool = new AWSCognito.CognitoUserPool(poolData);

        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
                reject(err);
                return;
            }
            cognitoSignupUser = result.user;

            resolve(cognitoSignupUser);
        });
    });

}

function verify(username, code){
    let userPool = new AWSCognito.CognitoUserPool(poolData);
    let userData = {
        Username : username,
        Pool : userPool
    };

    return new Promise((resolve, reject) => {
        let cognitoUser = new AWSCognito.CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, function(err, result) {
            if (err) {
                reject(err);
                return;
            }

            resolve(result);
        });
    });
}

function signIn(username, password) {
    let userPool = new AWSCognito.CognitoUserPool(poolData);

    let userData = {
        Username : username, // your username here
        Pool : userPool
    };

    let authenticationData = {
        Username : username, // your username here
        Password : password, // your password here
    };

    return new Promise((resolve, reject) => {
        let authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);

        //step1: aws cognito user pool sign in
        let cognitoLoginUser = new AWSCognito.CognitoUser(userData);
        cognitoLoginUser.authenticateUser(authenticationDetails, {
            onSuccess: async function (result) {
                let access_token = result.getAccessToken().getJwtToken();
                let id_token = result.getIdToken().getJwtToken();

                console.log(id_token);

                //step2: Integrate into federate identity
                let idp = 'cognito-idp.us-east-1.amazonaws.com/'+ Secrets.cognito_user_pool_id;
                try{
                    let credentals = await registerFederateIdentityPool(idp, id_token);
                    resolve(credentals);
                }
                catch(err){
                    reject(err);
                }       
            },

            onFailure: function(err) {
                reject(err);
                return;
            }
            /*mfaRequired: function(codeDeliveryDetails) {
                var verificationCode = prompt('Please input verification code' ,'');
                cognitoLoginUser.sendMFACode(verificationCode, this);
            }*/
        });
    });

}


function registerFederateIdentityPool(idp, id_token){
    return new Promise((resolve, reject) => {
        //integrate into federate indentity pool
        let logins = {};
        logins[idp] = id_token;

        console.log(logins);
        //AWS.config.credentials.clearCachedId();
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : Secrets.aws_identity_pool_id,
            Logins : logins
        });

        AWS.config.credentials.refresh((err) => {
            if (err) {
                reject(err);
                return;
            } else {
                console.log('Successfully logged!');
                console.log(AWS.config.credentials);
                resolve(AWS.config.credentials);
            }
        });

    });
}

/*
function confirmPassword(){
    var username = document.getElementById("reset_username").value;
    var newPassword = document.getElementById("reset_newpassword").value;
    var code = document.getElementById("reset_code").value;

    var userPool = new AWSCognito.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoUser(userData);
    cognitoUser.confirmPassword(code, newPassword, {
        onFailure(err) {
        console.log(err);
        },
        onSuccess() {
        console.log("success");
        }
    });
}
*/

exports.signUp = signUp;
exports.verify = verify;
exports.signIn = signIn;
exports.registerFederateIdentityPool = registerFederateIdentityPool;