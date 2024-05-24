const ovh = require('ovh');

function createOvhInstance(appKey, appSecret, consumerKey) {
  return ovh({
    endpoint: 'ovh-eu',
    appKey,
    appSecret,
    consumerKey
  });
}

module.exports = { createOvhInstance };


/*const ovh = require('ovh')({
    endpoint: 'ovh-eu',
    appKey: '6d95d2e0b855f9e1', 
    appSecret: '883b52f008a820e22a8f6c35f94cfe47',
    consumerKey: '427be2254d85d01326a03524441b9f01'
    
  });
  
  module.exports = ovh;
  */