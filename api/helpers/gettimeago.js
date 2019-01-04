const Datetime = require('machinepack-datetime');


module.exports = {
    inputs: {
        date : {
            type : 'number'
        }
    },
    sync : true,
    
    fn: function(inputs,exits){
       let timeAgoString =  Datetime.timeFrom({
          toWhen: inputs.date,
          fromWhen: new Date().getTime()
      }).execSync();
                      
      return exits.success(timeAgoString);

    }
    
}



