$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        signUp;
    }
});
function dataURLtoFile(dataurl, filename) {
 
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}

//Usage example:


const signUpBtn = document.getElementById('sign-up-btn')

const signUp = () => {
  // const blob = await fetch(document.getElementById('output').src).then(res => res.blob());
  const type = document.getElementById('output').src.split(';')[0].split('/')[1];
  var file = dataURLtoFile(document.getElementById('output').src,'resim.' + type);

  
  console.log(file);
  const formData = new FormData();
        formData.set('resim', file);
        formData.append('email', document.getElementById('email').value)
        formData.append('pass', document.getElementById('pass').value)
        formData.append('re_pass', document.getElementById('pass').value)
    axios.post('/signup', formData, {headers: {
        'Content-Type': 'multipart/form-data'
      }}).then(res=>{
        window.location.href = '/channels';
      }).catch(err=>{
        alert(err.response.data.msg);
      });
}

signUpBtn.addEventListener('click',signUp);

const uploadImage = () => {
    axios.post('').then().catch(err=>alert(err.response.data.msg))
};