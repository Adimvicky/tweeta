
$('#tweetBtn').click(e => {
    $.ajax({
        url : '/tweets',
        method : 'POST',
        data : {
            tweet : $('#tweet').val()
        }
    })
    .done(response => {
        console.log(response)
        if(response.data){
            window.location = `/users/${response.data.handle}`;
        }
        if(response.error){
            toastr.error(response.error,'Could not send tweet')
        }
    })
    .catch(err => {
        toastr.error('An error ocurred trying to send your tweet','Tweet Error')
    })

});


$('.deleteTweetBtn').click(e => {
    let tweet = e.target.getAttribute('data-tweet');
    console.log('clicked ',tweet);
    $.ajax({
        url : '/tweets/delete',
        method : 'DELETE',
        data : {
            tweet
        }
    })
    .done(response => {
        console.log(response);
        if(response.error){
            toastr.error(response.error,'An error occured')
        }
        if(response.data){
            toastr.info('Tweet deleted');
            $(`#${tweet}-tweet-box`).remove();
        } 
    })
    .catch(err => {
        toastr.error('An error occured','Something went wrong');
    })

})



