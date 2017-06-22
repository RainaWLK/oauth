let apigClientFactory = require('aws-api-gateway-client').default;
let secrets = require('./secrets');

function sendToAPIGateway(data){
    console.log(data.Credentials);
    let credentials = {
        invokeUrl: secrets.aws_api_url,
        accessKey: data.Credentials.AccessKeyId,
        secretKey: data.Credentials.SecretKey,
        sessionToken: data.Credentials.SessionToken
    };
    console.log(apigClientFactory);
    var apigClient = apigClientFactory.newClient(credentials);

    var pathTemplate = '/restaurants';
    var method = 'GET';
    var params = {
        // This is where any modeled request parameters should be added.
        // The key is the parameter name, as it is defined in the API in API Gateway.
    };

    var body = {};

    var additionalParams = {
        // If there are any unmodeled query parameters or headers that must be
        //   sent with the request, add them here.
        headers: {
            'Content-Type': 'application/json'
        },
        queryParams: {}
    };

    apigClient.invokeApi(params, pathTemplate, method, additionalParams, body)
    .then(function(result){
        console.log(result);
        //This is where you would put a success callback
    }).catch( function(result){
        console.log(result);
        //This is where you would put an error callback
    });
}

//var qq = sendToAPIGateway;
console.log("qq");
exports.sendToAPIGateway = sendToAPIGateway;