// exampleResponse.js


module.exports = {
    exampleResponse: {
    creationDate : "2024-05-08",
    details : [
      {
        "key": "string",
        "value": "string"
      }
    ],
    engagementDate : "2020-05-08",
    expirationDate : "2024-05-08",
    nextBillingDate : "2024-05-08",
    plan : {
      code : "string",
      product : {
        name : "string",
      }
    },
    quantity : 0,
    renew : {
      dayOfMonth : 0,
      interval : "P1M",
      mode : "automaticForcedProduct",
      possibleIntervals : [
        "P1M"
      ],
      possibleModes : [
        "automaticForcedProduct"
      ]
    },
    resource: {
      displayName : "string",
      name : "string",
      state : "deleted",
    },
    route : {
      path : "string",
      url : "string",
      vars : [
        {
          key : "string",
          value : "string"
        }
      ]
    },
    state : "expired"
  }   
}