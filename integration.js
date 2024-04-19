var ovh = require('ovh')({
    endpoint: 'ovh-eu',
    appKey: 'YOUR_APP_KEY',
    appSecret: 'YOUR_APP_SECRET'
  });
  
  ovh.request('POST', '/auth/credential', {
    'accessRules': [
      { 'method': 'GET', 'path': '/*'},
      { 'method': 'POST', 'path': '/*'},
      { 'method': 'PUT', 'path': '/*'},
      { 'method': 'DELETE', 'path': '/*'}
    ]
  }, function (error, credential) {
    console.log(error || credential);
  });
  /*$ node credentials.js
  { validationUrl: 'https://api.ovh.com/auth/?credentialToken=XXX',
    consumerKey: 'CK',
    state: 'pendingValidation' }