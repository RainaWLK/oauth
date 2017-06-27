import $ from 'jquery';

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function sendImplictRequest() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  let oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Parameters to pass to OAuth 2.0 endpoint.
  let params = {'client_id': '167755153886-o7qrcglr58l7vakh8sr0iqn2ua9gg52a.apps.googleusercontent.com',
                'redirect_uri': 'http://127.0.0.1:8080/oauth2callback',
                'response_type': 'id_token token',
                'scope': 'openid profile',
                'include_granted_scopes': 'true',
                'state': 'pass-through value',
                'nonce': 'n-0S6_WzA2Mj'};

  // Add form parameters as hidden input values.
  let requestStr = $.param(params);
  window.open(oauth2Endpoint+"?"+requestStr, '_blank');
}

exports.sendImplictRequest = sendImplictRequest;
