$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        signIn;
    }
});

const signInBtn = document.getElementById('sign-in-btn');
const signInBtnGoogle = document.getElementById('google-sign-in-btn');

const signIn = () => {
    axios.post('/signIn', {
        email: document.getElementById('email').value,
        password: document.getElementById('pass').value
      })
      .then(res => {
        // console.log(res);
        window.location.href = '/channels';
      })
      .catch(err => {
        console.log(err.response);
        if(err.response.data.msg instanceof Array){
          alert(err.response.data.msg[0]);
        }
        // alert(err.response.data.msg);
      });
}

const signInGoogle = () => {
  axios.get('/auth/google')
  .then(res => {
    // console.log(res);
    // window.location.href = '/channels';
  })
  .catch(err => {
    console.log(err.response);
    if(err.response.data.msg instanceof Array){
      alert(err.response.data.msg[0]);
    }
    alert(err.response.data.msg);
  });
}

// signInBtnGoogle.addEventListener('click',signInGoogle);
signInBtn.addEventListener('click',signIn);