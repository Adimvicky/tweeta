module.exports = {
    joinChat : function(req,res){
        if(!req.session.userId){
            return res.json({error : 'You must be logged in to do that'})
        }
        User.findOne({id : req.session.userId})
        .exec((err,loggedInUser) => {
            if(err) return res.json({error : 'Sorry an error occured'})
            if(!loggedInUser) return res.json({error : `Seems you previously deleted your account or haven't signed up at all`});

            if(!req.isSocket){
                return res.json({error : 'Not a websocket request'});
            }
            let roomName =  `${req.session.userId}-${req.param('userToChatWith')}-room`;
            let altRoomName = `${req.param('userToChatWith')}-${req.session.userId}-room`

            ChatRoom.findOne({ 
                or : [
                    {name : roomName},
                    {name : altRoomName}
                ]
            })
            .populate('usersInRoom')
            .populate('chats')
            .exec(async(err,previouslyCreatedRoom) => {
            
                if(err) return res.json({error : 'Sorry something went wrong'});
                if(previouslyCreatedRoom){

                    await sails.sockets.join(req,previouslyCreatedRoom.name);
                    return res.json({data : previouslyCreatedRoom});
                }  

                if(!previouslyCreatedRoom){
                    ChatRoom.create({name : roomName})
                    .fetch()
                    .exec(async(err,createdRoom) => {
                        if(err) return res.json({error : 'some error, Could not create room'});
                        if(!createdRoom) return res.json({error : 'no room created'})
                 
                        await ChatRoom.addToCollection(createdRoom.id,'usersInRoom').members([loggedInUser.id,req.param('userToChatWith')])

                        ChatRoom.findOne({id : createdRoom.id})
                        .populate('usersInRoom')
                        .populate('chats')
                        .exec(async(err,foundRoom) => {
                            if(err) return res.json({error : 'An error occured tryin to get the created room'});
                            if(!foundRoom) return res.json({error : 'could not find created room'});

                            await sails.sockets.join(req,foundRoom.name);

                            return res.json({data : foundRoom});
                        })               
                    })
                }
            })            
        })
    },

    sendChat : function(req,res){
        if(!req.session.userId){
            return res.json({error : 'You must be logged in to do that'})
        }

        User.findOne({id : req.session.userId})
        .exec((err,loggedInUser) => {
            if(err) return res.negotiate(err);
            if(!loggedInUser) return res.json({error : `Seems you previously deleted your account or haven't signed up at all`});
            
            Chat.create({
               message : req.param('message'),
               sender : req.session.userId,
               chatRoom : req.param('currentlyOpenChatRoom'),
               gravatarURL : loggedInUser.gravatarURL
            })
            .fetch()
            .exec((err,createdChat) => {
               if(err) return res.json({error : 'Sorry, could not create your message at this time'});
            
           
                let roomName =  `${req.session.userId}-${req.param('chatMate')}-room`;
                let altRoomName = `${req.param('chatMate')}-${req.session.userId}-room`;

                ChatRoom.findOne({
                    or : [
                        { name : roomName },
                        { name : altRoomName }
                    ]
                })
                .exec(async(err,foundRoom) => {
                    if(err) return res.json({error : 'some error ocurred'})
                    if(!foundRoom) return res.json({error : 'something strange happened, cant find this room'});

                    await ChatRoom.addToCollection(foundRoom.id,'chats').members(createdChat.id)

                    let messageData = {
                        message : req.param('message'),
                        username : loggedInUser.username,
                        gravatarURL : loggedInUser.gravatarURL,
                        sender : loggedInUser.id,
                        created : sails.helpers.gettimeago(createdChat.createdAt)
                    }

                    sails.sockets.broadcast(foundRoom.name,'chat',messageData);

                    return res.json({data : messageData});
                })
            })
        })
    }

};

