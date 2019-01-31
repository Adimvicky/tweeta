/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Gravatar = require('machinepack-gravatar');

module.exports = {
  
    signup : async function(req,res){
        if(!req.param('username')){
            return res.json({error : 'You have to provide a username'});
        }
        if(!req.param('handle')){
            return res.json({error : 'You have to provide a Handle'});
        }
        if(!req.param('email')){
            return res.json({error : 'You have to provide an email'});
        }
        if(!req.param('password')){
            return res.json({error : 'You have to provide a password'});
        }

        User.findOne({email : req.param('email')})
        .exec(async(err,foundUser) => {
            if(err){
                return res.json({error : `A user with the email ${req.param('email')} already exists.`})
            } else {
                let data = {
                    username : req.param('username'),
                    handle : req.param('handle'),
                    email : req.param('email'),
                };
        
                if(data.handle.indexOf('@') !== 0){
                    data.handle = '@'+data.handle;
                }
        
                try {   
                    data.password = await sails.helpers.hashpassword(req.param('password'));
                    data.gravatarURL = Gravatar.getImageUrl({
                        emailAddress : req.param('email')
                    }).execSync()
                } catch(err){
                    return res.json({error : 'some error ocurred'});
                }
            
                User.create(data)
                .fetch()
                .exec((err,createdUser) => {
                    if(err){
                        if(err.code === 'E_UNIQUE'){
                            return res.json({error : 'Sorry,the email or handle you chose has already been taken, please try a different one'});
                        }
                    }
                    if(!createdUser) return res.serverError({error : 'Could not create user,please check that your email is in the right format'});
        
                    req.session.userId = createdUser.id;
        
                    delete createdUser.password;
                    return res.json({data : createdUser});
                })

            }
        })
        


        
    },

    signin: function(req,res){
        if(!req.param('emailOrHandle')){
            return res.json({error : 'You have to provide an email or Handle'});
        }
        if(!req.param('password')){
            return res.json({error : 'You have to provide a password'});
        }
        
        User.findOne({
            or : [
                { email : req.param('emailOrHandle')},
                { handle : req.param('emailOrHandle')},
                { username : req.param('emailOrHandle')}
            ]
        })
        .limit(1)
        .populate('followers')
        .populate('following')
        .exec(async(err,foundUser) => {
            if(err){
                sails.log(err)
                if(err.invalidAttributes) sails.log('Error here')
                 return res.serverError(err);
            }
            if(!foundUser){
                return res.json({error : `There's no user with that email or handle`});
            }
            
            let attemptPassword = await sails.helpers.hashpassword(req.param('password'));

            if(foundUser.password === attemptPassword){      
                delete foundUser.password;
                req.session.userId = foundUser.id;
                 return res.json({data : foundUser});
                
            } else {
                return res.json({error : `The password doesnt match the user's password`});
            }
        })
    },

    logout : function(req,res){
        if(!req.session.userId){
            return res.badRequest({error : 'You have to be logged in first'});
        } 
        req.session.userId = null;
        return res.redirect('/');
    },

    getUsers : function(req,res){
        User.find()
        .populate('following')
        .exec((err,users)=> {
            if(err) return res.negotiate(err);
            
            _.each(users,(user) => {
                delete user.password;
                user.created = sails.helpers.gettimeago(user.createdAt);
            })
            
            
            
            return res.json({data : users,loggedInUserId : req.session.userId});
        })
    },
    
    followUser : function(req,res){
        User.findOne({id : req.session.userId})
        .exec(async(err,loggedInUser) => {
            if(err) return res.negotiate(err);
            if(!loggedInUser) return res.json({error : 'You have to be logged in first'});
            if(req.session.userId === req.param('userToFollow')){
                return res.json({error : `Sorry,You can't follow yourself`});
            }

            await User.addToCollection(req.param('userToFollow'),'followers').members(loggedInUser.id)
            .exec((err) => {
                if(err) return res.negotiate(err);
                
                User.findOne({id : loggedInUser.id})
                .populate('following')
                .exec((err,userData) => {
                    if(err) return res.negotiate(err);

                    delete userData.password;
                    return res.json({data : userData})
                })
            })
            
        })
    },

    unfollowUser : function(req,res){
        User.findOne({id : req.session.userId})
        .exec(async(err,loggedInUser) => {
            if(err) return res.negotiate(err);
            if(!loggedInUser) return res.json({error : 'You have to be logged in first'});
            if(req.session.userId === req.param('userToUnfollow')){
                return res.json({error : `Sorry,You can't unfollow yourself`});
            }

            await User.removeFromCollection(req.param('userToUnfollow'),'followers').members(loggedInUser.id)
            .exec((err) => {
                if(err) return res.negotiate(err);
                
                User.findOne({id : loggedInUser.id})
                .populate('following')
                .exec((err,userData) => {
                    if(err) return res.negotiate(err);

                    delete userData.password;
                    return res.json({data : userData})
                })
            })  
        })     
    },

    getFollowing : function(req,res){
        User.findOne({id : req.session.userId})
        .populate('following')
        .exec((err,loggedInUser) => {
            if(err) return res.negotiate(err);
            if(!loggedInUser) return res.json({error : `I cant show you people you follow if i don't know who you are, please login first`});
            
            delete loggedInUser.password;
            _.each(loggedInUser.following, followee => {
                followee.created = sails.helpers.gettimeago(followee.createdAt);
            })
            return res.json({data : loggedInUser});
        })
        
    },

    getFollowers : function(req,res){
        User.findOne({id : req.session.userId})
        .populate('followers')
        .exec((err,loggedInUser) => {
            if(err) return res.negotiate(err);
            if(!loggedInUser) return res.json({error : `I cant show you people who follow you if i don't know who you are, please login first`});
            
            delete loggedInUser.password;
            _.each(loggedInUser.followers, follower => {
                follower.created = sails.helpers.gettimeago(follower.createdAt);
            })
            return res.json({data : loggedInUser});
        })
    }

}




