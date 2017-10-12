
let b2bSecrets = {
    api_baseurl: '',
    region: 'us-east-1',
    cognito_user_pool_id: "us-east-1_xxxxxxxxxxx",
    congito_client_id: '',    //cognito app client id
    aws_identity_pool_id: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx'  //federate identity pool
}

let b2cSecrets = {
    api_baseurl: '',
    region: 'us-east-1',
    aws_identity_pool_id: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-yyyyyyyyyy',  //federate identity pool
    google_oauth_redirecturl: '',
    google_oauth_clientid: ''
}

exports.b2bSecrets = b2bSecrets;
exports.b2cSecrets = b2cSecrets;