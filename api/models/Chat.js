/**
 * Chat.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    message : {
      type : 'string'
    },
    sender : {
      model : 'user'
    },
    gravatarURL : {
      type : 'string'
    },
    recipient : {
      model : 'user'
    },
    room : {
      model : 'chatRoom'
    }
   
  },

};

