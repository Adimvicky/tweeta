const crypto = require('crypto');

module.exports = {
    inputs: {
        password : {
            type : 'string'
        }

    },
    sync : true,
    
    fn: function(inputs,exits){
        // string = typeof(string) === 'string' ? string : undefined;
        if(inputs.password == undefined)  throw new Error('Provided password is not a string')

        let passwordHashed = crypto.createHmac('sha256',sails.config.passwords.hashingSecret).update(inputs.password).digest('hex');

        return exits.success(passwordHashed);

    }
    
}