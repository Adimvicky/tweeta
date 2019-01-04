


$('#signUpBtn').click(e => {
    $.ajax({
        url : '/signup',
        method : 'POST',
        data : {
            username : $('#username').val(),
            handle : $('#handle').val(),
            email : $('#email').val(),
            password : $('#password').val()
        }
    })
    .done(response => {
        if(response.data){
            toastr.success('Login successful')
            window.location = `/users/${response.data.handle}`;
        }
        if(response.error){
            console.log(response.error);
            toastr.error(response.error,'Invalid Inputs');
        }
    })
    .catch(err => {
        toastr.error('An error ocurred trying to sign you up','Signup Error')
    })

})



$('#signInBtn').click(e => {
    $.ajax({
        url : '/signin',
        method : 'POST',
        data : {
            emailOrHandle : $('#emailOrHandle').val(),
            password : $('#attemptPassword').val()
        }
    })
    .done(response => {
        console.log(response)
        if(response.data){
            window.location = `/users/${response.data.handle}`;
        } 
        if(response.error){
        toastr.error(response.error,'Invalid detail(s)')
        }
    })
    .catch(err => {
        toastr.error('An error ocurred trying to sign you in','Signin Error')
    })

})

