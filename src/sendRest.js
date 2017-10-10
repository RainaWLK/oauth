let apigClientFactory = require('aws-api-gateway-client').default;
let Secrets = require('./secret').b2bSecrets;

function sendToAPIGateway(credentials, method, uri){
    console.log(credentials.data.Credentials);
    let credentialObj = {
        invokeUrl: Secrets.api_baseurl,
        accessKey: credentials.data.Credentials.AccessKeyId,
        secretKey: credentials.data.Credentials.SecretKey,
        sessionToken: credentials.data.Credentials.SessionToken
    };
    let apigClient = apigClientFactory.newClient(credentialObj);

    let params = {
        // This is where any modeled request parameters should be added.
        // The key is the parameter name, as it is defined in the API in API Gateway.
    };

    let body = {};

    let additionalParams = {
        // If there are any unmodeled query parameters or headers that must be
        //   sent with the request, add them here.
        headers: {
            'Content-Type': 'application/json'
        },
        queryParams: {}
    };

    return new Promise((resolve, reject) => {
        apigClient.invokeApi(params, uri, method, additionalParams, body)
        .then(result => {       
            //This is where you would put a success callback
            console.log("apigClient success");
            resolve(result);
        }).catch(err => {
            //This is where you would put an error callback
            console.log("apigClient fail");
            reject(err);
        });
    });
}

exports.sendToAPIGateway = sendToAPIGateway;