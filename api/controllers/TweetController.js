/**
 * TweetController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    postTweet : function(req,res){
        if(!req.session.userId){
            return res.json({error :'You must be logged in to do that'});
        }
        if(!req.param('tweet')){
            return res.json({error : 'You have to provide a tweet message'})
        }
        User.findOne({id : req.session.userId})
        .populate('tweets')
        .exec((err,foundUser) => {
            if(err) return res.negotiate(err);
            if(!foundUser) return res.json('No user found');

            let tweetData = {
                message : req.param('tweet'),
                owner : foundUser.id
            }

            Tweet.create(tweetData)
            .fetch()
            .exec((err,createdTweet) => {
                if(err) return res.negotiate(err);
                if(!createdTweet) return res.json({error : 'No tweet created'});

                User.findOne({id : req.session.userId})
                .exec((err,user) => {
                    if(err) return res.json({error : 'Error ocurred'});
                    if(!user){
                        return res.json({error : 'No user'})
                    }
                    createdTweet.username = user.username;

                    return res.json({data : user});
                })
                
            })
        })
    },

    likeOrUnlikeTweet : function(req,res){
        if(!req.session.userId){
            return res.json({error :'You must be logged in to do that'});
        }
        if(!req.param('tweetToLikeOrUnlike')){
            return res.json({error : 'Sorry, but it seems you did not specify the tweet you want to like/unlike'});
        }
        if(!req.param('action')){
            return res.json({error : 'Sorry, but it i failed to determine whether you wish to like or unlike this tweet'});            
        }

        User.findOne({id : req.session.userId})
        .exec((err,loggedInUser) => {
            if(err) return res.negotiate(err);
            if(!loggedInUser) return res.json({error : 'Sorry, user not found'});

           
            Tweet.findOne({id : req.param('tweetToLikeOrUnlike')})
            .exec(async(err,tweet) => {
                if(err) return res.negotiate(err);
                if(!tweet) return res.json({error : 'Sorry, but it seems you are trying to like a deleted or non-existent tweet'});
                
                if(req.param('action') === 'like'){
                    await Tweet.addToCollection(req.param('tweetToLikeOrUnlike'),'likedBy').members(loggedInUser.id)
                    .exec((err) => {
                        if(err) return res.negotiate(err);
                        return res.json({data : tweet});
                    })
                } else if(req.param('action') === 'unlike'){
                    await Tweet.removeFromCollection(req.param('tweetToLikeOrUnlike'),'likedBy').members(loggedInUser.id)
                    .exec((err) => {
                       if(err) return res.negotiate(err);               
                       return res.json({data : tweet});
                    })
                }
            })
        })       
    }
  

};

