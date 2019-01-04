/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */

module.exports.passwords = {
  hashingSecret : 'justsometextinhere',

  // hashPassword : function(string){
  //   if(string == undefined)  throw new Error('Provided password is not a string')

  //   let passwordHashed = crypto.createHmac('sha256','somesecret').update(string).digest('hex');
    
  //   sails.log(passwordHashed)
  //   return passwordHashed;

  // }


  // Any configuration settings may be overridden below, whether it's built-in Sails
  // options or custom configuration specifically for your app (e.g. Stripe, Mailgun, etc.)
 

};

// module.exports.connections = {
//   MongodbServer : {
//       adapter : 'sails-mongo',
//       host : 'localhost',
//       database : 'tweeta'
//   }
// }
