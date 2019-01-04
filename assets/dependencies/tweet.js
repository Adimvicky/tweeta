
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



