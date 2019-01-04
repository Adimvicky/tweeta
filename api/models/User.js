/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    username : {
      type : 'string',
    },
    handle : {
      type : 'string',
      unique : true
    },
    email : {
      type : 'string',
      isEmail : true,
      unique : true
    },
    password : {
      type : 'string'
    },
    gravatarURL : {
      type : 'string'
    },
    tweets : {
      collection : 'tweet',
      via : 'owner'
    },
    followers : {
      collection : 'user',
      via : 'following'
    },
    following : {
      collection : 'user',
      via : 'followers'
    },
    likedTweets : {
      collection : 'tweet',
      via : 'likedBy'
    },
    chats : {
      collection : 'chat',
      via : 'sender'
    },
    rooms : {
      collection : 'chatRoom',
      via : 'usersInRoom'
    }

  },

};

