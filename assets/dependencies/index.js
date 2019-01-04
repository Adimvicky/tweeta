// UI switch between tabs

$('.category').click(e => {
    if($(e.target).parent().hasClass('category-selected')){
        return;
    }
    let divs = Array.from($('.category'));
    for(let div of divs){
        if(div !== e.target){
            $(div).removeClass('category-selected')
        }
    }

    let parent = $(e.target).parent()

    if(parent.hasClass('category')) {
        parent.addClass('category-selected')
    }
})

// Get All Users

$('#getUsersBtn').click(e => {
    $.ajax({
        url : '/users',
        method : 'GET',
        data : {
            user :''
        }
    })
    .done(response => {
        if(response.data){
            $('#container').empty();
            console.log(response.data)
            
            let followStatus;
            let buttonType;
            let followerIdArray = [];
            
            for(let user of response.data){
                if(user.id == response.loggedInUserId){
                    for(let follower of user.following){
                        followerIdArray.push(follower.id)
                    }
                }
            }

            for(let user of response.data){
                    buttonType = followerIdArray.includes(user.id) ? 'btn-primary' : 'btn-outline-primary'
                    followStatus = followerIdArray.includes(user.id)  ? 'following' : 'follow'
                     
                $('#container').append(`
                <div class="tweet flex justify-between">
          <div class="tweet-pic circle border flex items-center justify-center">
            <img class="circle border" src=${user.gravatarURL} style="height : 47px"/> 
          </div>
          <div  class="tweet-content">
            <div class="flex justify-between">
              <div>
                <span class="name">
                  ${user.username}
                </span>
                <span class="handle">
                  ${user.handle} (Joined  ${user.created})
                </span>
              </div>
              <div >
               <button class="btn ${buttonType} btn-sm follow-btn" data-user=${user.id}>${followStatus}</button>
              </div>
            </div>
            </div>
          </div>
        </div>                
                `)
            }
        }

        readyFollowButtonsDOM();

    })
    .catch(err => {
        toastr.error('Sorry an error occured');
    })
});

// Get All Tweets
$('#getTweetsBtn').click(e => {
    $('#container').empty();
    $.ajax({
        url : '/',
        method : 'GET',
        data : {
            user :''
        }
    })
    .done(response => {
        window.location.reload();
    })
    .catch(err => {
        toastr.error('We are going to fix this as soon as possible','Sorry, an error occured')
    })
});


// Follow user

function readyFollowButtonsDOM(){
    $('.follow-btn').click(e => {
        let button = $(e.target);

        if(button.text() === 'follow' && button.hasClass('btn-outline-primary')){
            let userToFollow = e.target.getAttribute('data-user');

        $.ajax({
            url : '/users/follow',
            method : 'PUT',
            data : {
                userToFollow
            }
        })
        .done(response => {
            console.log(response);
            if(response.error){
                return toastr.error(response.error,`You can't do that`)
            }
            
            if(button.hasClass('btn-outline-primary')){
                button.removeClass('btn-outline-primary')
                button.addClass('btn-primary')
                button.text('following')  
            }
        })
        .catch(err => {
            toastr.error('Sorry, an error occured with the request','An error occured')
        })

        } else if(button.text() === 'following' && button.hasClass('btn-primary')){
            let userToUnfollow = e.target.getAttribute('data-user');

        $.ajax({
            url : '/users/unfollow',
            method : 'PUT',
            data : {
                userToUnfollow
            }
        })
        .done(response => {
            console.log(response);
            if(response.error){
                return toastr.error(response.error,`You can't do that`)
            }
            
            if(button.hasClass('btn-primary')){
                button.removeClass('btn-primary')
                button.addClass('btn-outline-primary')
                button.text('follow')  
            }
        })
        .catch(err => {
            toastr.error('Sorry, there was a problem with the request','An error occured')
        })

    }    
        
    })
}

// Get following

$('#getFollowingBtn').click(e => {
    $.ajax({
        url : '/users/following',
        method : 'GET'
    })
    .done(response => {
        if(response.error){
            return toastr.error(response.error,'An error occured')
        }
        if(response.data){
            $('#container').empty();
            let following = response.data.following;
            for(let followee of following){
                     
                $('#container').append(`
                <div class="tweet flex justify-between">
          <div class="tweet-pic circle border flex items-center justify-center">
            <img class="circle border" src=${followee.gravatarURL} style="height : 47px"/> 
          </div>
          <div  class="tweet-content">
            <div class="flex justify-between">
              <div>
                <span class="name">
                  ${followee.username}
                </span>
                <span class="handle">
                  ${followee.handle} (Joined  ${followee.created})
                </span>
              </div>
              <div >
               <button class="btn btn-primary btn-sm follow-btn" data-user=${followee.id}>following</button>
              </div>
            </div>
            </div>
          </div>
        </div>                
                `)

            }
        }
        readyFollowButtonsDOM();
    })
    .catch(err => {
        toastr.error('Sorry, there was a problem with the request','An error occured')        
    })
})



$('#getFollowersBtn').click(e => {
    $.ajax({
        url : '/users/followers',
        method : 'GET'
    })
    .done(response => {
        if(response.error){
            return toastr.error(response.error,'An error occured')
        }
        if(response.data){
            $('#container').empty();
            let followers = response.data.followers;
            for(let follower of followers){
                     
                $('#container').append(`
                <div class="tweet flex justify-between">
          <div class="tweet-pic circle border flex items-center justify-center">
            <img class="circle border" src=${follower.gravatarURL} style="height : 47px"/> 
          </div>
          <div  class="tweet-content">
            <div class="flex justify-between">
              <div>
                <span class="name">
                  ${follower.username}
                </span>
                <span class="handle">
                  ${follower.handle} (Joined  ${follower.created})
                </span>
              </div>
              <div >
               <button class="btn btn-outline-primary btn-sm follow-btn" data-user=${follower.id}>follow</button>
              </div>
            </div>
            </div>
          </div>
        </div>                
                `)

            }
        }
        readyFollowButtonsDOM();
    })
    .catch(err => {
        toastr.error('Sorry, there was a problem with the request','An error occured')        
    })
})


$('.likeOrUnlikeButton').click(e => {
    let tweetToLikeOrUnlike = e.target.getAttribute('data-tweet');
    let button = $(e.target);
    let numLikes = button.html();
    let data = {};
    data.tweetToLikeOrUnlike = tweetToLikeOrUnlike; 
    let buttonClassList = Array.from(e.target.classList);
    
    if(buttonClassList.includes('likeBtn')){
        data.action = 'like'
        button.addClass('liked')
        button.addClass('unlikeBtn')
        button.removeClass('likeBtn')    
        button.html(` ${Number(numLikes) + 1}`);
        
    } else if(buttonClassList.includes('unlikeBtn')){
        data.action = 'unlike'
        button.removeClass('liked')
        button.removeClass('unlikeBtn')
        button.addClass('likeBtn')
        button.html(` ${Number(numLikes) - 1}`)
        
    }
    console.log(data);
       
    $.ajax({
        url : '/tweets/like',
        method : 'PUT',
        data : data 
    })
    .done(response => {
        if(response.data){
        } else if(response.error){
            return toastr.error(response.error,'An error ocurred');
        }
    })
    .catch(err => {
        toastr.error('Sorry, there was a problem with the request','An error occured')  
    })   
});



$('.retweetBtn').click(e => {
    let tweetToRetweet = e.target.getAttribute('data-tweet');
    let button = $(e.target);
    let numRetweets = button.html();
    let data = {};
    data.tweetToRetweet = tweetToRetweet; 

    let buttonClassList = Array.from(e.target.classList);
    
    if(buttonClassList.includes('retweeted')){
        return toastr.error('You already retweeted this tweet');
        // data.action = 'like'
        // button.addClass('liked')
        // button.addClass('unlikeBtn')
        // button.removeClass('likeBtn')    
        // button.html(` ${Number(numLikes) + 1}`);
        
    } else {
        data.action = 'retweet'
        button.addClass('retweeted')
        button.html(` ${Number(numRetweets) + 1}`)

         // button.removeClass('unlikeBtn')
        // button.addClass('likeBtn')
        
    }
    console.log(data);
       
    $.ajax({
        url : '/tweets/retweet',
        method : 'PUT',
        data : data 
    })
    .done(response => {
        if(response.data){
            console.log(response.data)
        } else if(response.error){
            return toastr.error(response.error,'An error ocurred');
        }
    })
    .catch(err => {
        toastr.error('Sorry, there was a problem with the request','An error occured')  
    })   
});



let currentlyOpenChatRoom, chatMate;

$('.openChat').click(e => {
    let userToChatWith = e.target.getAttribute('data-user');

    io.socket.get('/chat',{userToChatWith},(response,jwres) => {
        
        $('#chat_box').empty();
        $('#submit_message').val('');
        console.log(response);
        console.log(jwres);
        if(response.data){
            let otherUser;
            for(let user of response.data.usersInRoom){
                if(user.id === userToChatWith){
                    // Logic slightly got out of control, 'otherUser' is technically the same person as 'chatMate' - fix this 
                    otherUser = user.username;
                    chatMate = user.id;
                }
            }
            currentlyOpenChatRoom = response.data.id;

            if(response.data.chats.length > 0){
                for(let chat of response.data.chats){
                    if(chat.sender === me.id){
                        $('#chat_box').append(`
                            <div class="chat_message_wrapper chat_message_right">
                                <div class="chat_user_avatar">
                                    <img alt="" src=${chat.gravatarURL} class="md-user-image">
                                </div>
                                <ul class="chat_message">
                                    <li>
                                        <p>
                                        ${chat.message}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        `)
                    } else {
                        $('#chat_box').append(`
                            <div class="chat_message_wrapper">
                                 <div class="chat_user_avatar">
                                     <img alt="" src=${chat.gravatarURL} class="md-user-image">                                   
                                 </div>
                                 <ul class="chat_message">
                                     <li>
                                         <p> 
                                         ${chat.message}
                                          </p>
                                     </li>
                                </ul>
                            </div>
                        `)
                    }                   
                }
            }

            $('#otherUser').html(otherUser);
        }
        if(response.error){
            toastr.error(response.error)
        }
        
    })
})

$('#sendChat').click(e => {
    let message = $('#submit_message').val()
    if(message === ''){
        return toastr.error('You have to provide a message first','Textbox is empty');
    }
    
    io.socket.put('/chat',{message,currentlyOpenChatRoom,chatMate},(response,jwres) => {
        console.log(response,jwres);
        if(response.data){
            $('#submit_message').val('')
        } else {
            return toastr.error(response.error,'Could not send message');
        }
    })
})


io.socket.on('chat',e => {
    console.log('new chat event ',e);
    if(e.sender === me.id){
        $('#chat_box').append(`
        <div class="chat_message_wrapper chat_message_right">
            <div class="chat_user_avatar">
                <img alt="" src=${e.gravatarURL} class="md-user-image">
            </div>
            <ul class="chat_message">
                <li>
                    <p>
                    ${e.message}
                    </p>
                </li>
            </ul>
        </div>
    `)

    } else {
        $('#chat_box').append(`
            <div class="chat_message_wrapper">
                <div class="chat_user_avatar">
                    <img alt="" src=${e.gravatarURL} class="md-user-image">                                   
                </div>
                   <ul class="chat_message">
                        <li>
                            <p> ${e.message} </p>
                        </li>
                    </ul>
            </div>
      `)
    }
})