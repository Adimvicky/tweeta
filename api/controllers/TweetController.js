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
            if(!foundUser) return res.json({error : 'Please login first'});

            let tweetData = {
                message : req.param('tweet'),
                owner : foundUser.id
            }

            Tweet.create(tweetData)
            .fetch()
            .exec((err,createdTweet) => {
                if(err) return res.negotiate(err);
                if(!createdTweet) return res.json({error : 'Tweet could not be created'});

                User.findOne({id : req.session.userId})
                .exec((err,user) => {
                    if(err) return res.json({error : 'Sorry,Error ocurred'});
                    if(!user){
                        return res.json({error : 'Please login first'})
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
    },

    retweet : function(req,res){
        if(!req.session.userId){
            return res.json({error :'You must be logged in to do that'});
        }
        if(!req.param('tweetToRetweet')){
            return res.json({error : 'Sorry, but it seems you did not specify the tweet you wish to retweet'});
        }
        if(!req.param('action')){
            return res.json({error : 'Sorry, but it i failed to determine what you really want to do'});            
        }

        User.findOne({id : req.session.userId})
        .exec((err,loggedInUser) => {
            if(err) return res.negotiate(err);
            if(!loggedInUser) return res.json({error : 'Sorry, user not found'});

           
            Tweet.findOne({id : req.param('tweetToRetweet')})
            .exec(async(err,tweet) => {
                if(err) return res.negotiate(err);
                if(!tweet) return res.json({error : 'Sorry, but it seems you are trying to retweet a deleted or non-existent tweet'});
                
                if(req.param('action') === 'retweet'){
                    await Tweet.addToCollection(req.param('tweetToRetweet'),'retweetedBy').members(loggedInUser.id)
                    .exec((err) => {
                        if(err) return res.negotiate(err);
                        return res.json({data : tweet});
                    })
                }
            })
        })       
    },

    delete : function(req,res){
        if(!req.session.userId){
            return res.json({error : 'You have to logged in first'});
        }
        if(!req.param('tweet')){
            return res.json({error : 'Seems you did not specify a tweet to delete'});
        }

        User.findOne({id : req.session.userId})
        .exec((err,loggedInUser) => {
            if(err) return res.json({error : 'Sorry, an error occured'});
            if(!loggedInUser) return res.json({error : 'Seems you are not logged in'});

            if(loggedInUser.id !== req.session.userId){
                return res.json({error : "You can't delete someone else's tweet"});
            }

            Tweet.destroyOne({id : req.param('tweet')})
            .exec((err,deletedTweet) => {
                if(err) return res.json({error : 'Sorry, an error occured'});
                if(!deletedTweet) return res.json({error : 'No tweet was deleted'});
                
                return res.json({data : `${req.param('tweet')} deleted`});
            })
        })
    }
  

};

