/**
 * PageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index : function(req,res){
      // Get All Tweets
      Tweet.find()
      .sort('createdAt DESC')
      .limit(30)
      .populate('owner')
      .populate('likedBy')
      .exec((err,tweets) => {
          if(err) return res.json({error : 'An error ocurred trying to fetch tweets'});
          if(!tweets) return res.json('No tweets');


          _.each(tweets,(tweet) => {
              tweet.created = sails.helpers.gettimeago(tweet.createdAt);
              tweet.likes = tweet.likedBy.length;
              for(let liker of tweet.likedBy){
                  if(liker.id === req.session.userId){
                      tweet.likedByLoggedInUser = true;
                  } else {
                      tweet.likedByLoggedInUser = false;
                  }
              }
          })

          // Get All users
          User.find()
          .exec(async(err,users) => {
              if(err) return res.json({error : 'Error retrive users'});
              if(!users) res.ok();

              _.each(users, (user) => {
                  delete user.password;
              })

              let userCount = await User.count();

            if(!req.session.userId){
               return res.view('pages/index',{ 
                me : null,
                tweets : tweets,
                users,
                userCount
            });
          }

         // Get logged in user
          User.findOne({id : req.session.userId})
          .populate('tweets')
          .populate('followers')
          .populate('following')
          .exec((err,loggedInUser) => {
            if(err) return res.negotiate(err);
            if(!loggedInUser) return res.view('404');
  
            delete loggedInUser.password;
            // Remove logged in user from list of users
            users = users.filter((user) => {
                return user.id !== loggedInUser.id
            })
  
            return res.view('pages/index',{
                me : loggedInUser,
                tweets : tweets,
                users,
                userCount
            });
        })

      })

          
    })
  }
};

