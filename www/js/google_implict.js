/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function sendImplictRequest() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {'client_id': '167755153886-o7qrcglr58l7vakh8sr0iqn2ua9gg52a.apps.googleusercontent.com',
                //'redirect_uri': 'http://ec2-34-195-142-234.compute-1.amazonaws.com:8012/code',
                'redirect_uri': 'http://127.0.0.1:8012/code',
                'response_type': 'id_token token',
                'scope': 'openid profile',
                'include_granted_scopes': 'true',
                'state': 'pass-through value',
                'nonce': 'n-0S6_WzA2Mj'};

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}