import $ from 'jquery';
let AWS_LOGIN = require('./aws_login');
let Secrets = require('./secret').b2cSecrets;


/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function sendImplictRequest() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  let oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Parameters to pass to OAuth 2.0 endpoint.
  let params = {'client_id': Secrets.google_oauth_clientid,
                'redirect_uri': Secrets.google_oauth_redirecturl,
                'response_type': 'id_token token',
                'scope': 'openid profile',
                'include_granted_scopes': 'true',
                'state': 'pass-through value',
                'nonce': 'n-0S6_WzA2Mj'};

  // Add form parameters as hidden input values.
  let requestStr = $.param(params);
  window.open(oauth2Endpoint+"?"+requestStr, '_blank');
}

async function signIn_aws(id_token){
  let credentials = await AWS_LOGIN.registerFederateIdentityPool('accounts.google.com', id_token, Secrets.aws_identity_pool_id);
  return credentials.data;
}

exports.sendImplictRequest = sendImplictRequest;
exports.signIn_aws = signIn_aws;
