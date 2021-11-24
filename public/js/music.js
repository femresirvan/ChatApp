// const yeniEleman = document.createElement('p');
// yeniEleman.style.color = 'blue';
// yeniEleman.style.backgroundcolor = 'red';
// // yeniElaman.textContent = "yenieleman";
// yeniEleman.innerText = 'yenieleman';

// document.body.appendChild(yeniEleman);
let user;
axios.get('api/me').then(res => {
   user = res.data.data;
   console.log(user);
   var userPhotoCard = document.createElement('div');
   var usernameCard = document.createElement('div');
   var userCard = document.createElement('div');
   var kullaniciKarti = document.querySelector('.kullaniciKarti')
   userPhotoCard.classList.add("fotoKart");
   userPhotoCard.classList.add("col-4");
   userPhotoCard.classList.add("py-2");
   usernameCard.classList.add("pt-2");
   userCard.classList.add("mt-2");
   userCard.classList.add("row");
   userCard.classList.add("box");
   userCard.classList.add("mx-2");
   userCard.classList.add("bg-grey");
   var photo = document.createElement('img');
   photo.classList.add("foto");
   userPhotoCard.appendChild(photo);
   photo.src = user.profile.picture; //BURASI WEBSOCKETE BAĞLANACAK


   usernameCard.classList.add('col-8');
   usernameCard.classList.add('my-auto');
   var username = document.createElement('p');
   username.classList.add('isimler');
   usernameCard.appendChild(username);
   username.innerHTML = user.profile.name; //BURASI WEBSOCKETE BAĞLANACAK
   userCard.appendChild(userPhotoCard);
   userCard.appendChild(usernameCard);
   kullaniciKarti.appendChild(userCard);
}).catch(err => alert('Error: Cannot access your profile. Please refresh or resign.'))

const socket = io('/gaming');


const sendMessageBtn = document.getElementById('send-message-btn');

const messageText = document.getElementById('message-text');

const chatCard = document.querySelector('.chatKarti')
const div = document.getElementById('chatKarti');
$('#message-text').keypress(function (event) {
   var keycode = (event.keyCode ? event.keyCode : event.which);
   if (keycode == '13') {
      sendMessage();
   }
});
sendMessageBtn.addEventListener("click", function () {
   sendMessage();
})

const sendMessage = () => {
   if(messageText.value){
      var messageBox = document.createElement('div')
      var message = document.createElement('span');
      var username = document.createElement('span');
      var time = document.createElement('span');
      var image = document.createElement('img');
      chatCard.appendChild(messageBox);
      messageBox.classList.add('konteyner');
      username.style.color = '#620075';
      
      username.style.fontWeight = 'bold';
      messageBox.appendChild(time);
      messageBox.classList.add('darker');
      
      messageBox.appendChild(image);
      messageBox.appendChild(username);
      messageBox.appendChild(message);
   
      image.classList.add('right');
      image.style.border = '3px solid '+ user.profile.color;
      time.classList.add('time-left')
      message.innerHTML = messageText.value;
      username.style.marginRight = '5px';
      username.innerHTML = user.profile.name;
      const date = new Date();
      let timeStr;
      if (date.getHours().toString().length == 1 || date.getMinutes().toString().length == 1) {
         if (date.getHours().toString().length == 1 && date.getMinutes().toString().length == 2) timeStr = '0' + date.getHours() + ':' + date.getMinutes();
         else if (date.getHours().toString().length == 2 && date.getMinutes().toString().length == 1) timeStr = date.getHours() + ':' + '0' + date.getMinutes();
         else if (date.getHours().toString().length == 1 && date.getMinutes().toString().length == 1) timeStr = '0' + date.getHours() + ':' + '0' + date.getMinutes();
      } else timeStr = date.getHours() + ':' + date.getMinutes();
   
      time.innerHTML = timeStr;
      image.src = user.profile.picture;
      if (messageText.value) socket.emit('gaming', messageText.value);
      messageText.value = "";
   
   
      $('#' + 'chatKarti').animate({
         scrollTop: div.scrollHeight - div.clientHeight
      }, {
         easing: "swing",
         duration: 100
      });
   }

}

const takeMessage = (msg) => {
   var messageBox = document.createElement('div')
   var message = document.createElement('span');
   var username = document.createElement('span');
   var time = document.createElement('span');
   var image = document.createElement('img');
   chatCard.appendChild(messageBox);
   messageBox.classList.add('konteyner');
   username.style.color = msg.user.color;
   username.style.fontWeight = 'bold';
   time.classList.add('time-right')





   message.innerHTML = msg.msg;
   username.style.marginRight = '5px';
   username.innerHTML = msg.user.name;
   time.innerHTML = msg.time;
   image.src = msg.user.picture;
   messageBox.appendChild(image);
   messageBox.appendChild(time);
   messageBox.appendChild(username);
   messageBox.appendChild(message);
   $('#' + 'chatKarti').animate({
      scrollTop: div.scrollHeight - div.clientHeight
   }, {
      easing: "swing",
      duration: 100
   });
}




const createUsers = (msg) => {
   for (var i = 0; i < msg.length; i++) {
      var userPhotoCard = document.createElement('div');
      var usernameCard = document.createElement('div');
      var userCard = document.createElement('div');
      var kullaniciKarti = document.querySelector('.kullaniciKarti')
      userPhotoCard.classList.add("fotoKart");
      userPhotoCard.classList.add("col-4");
      userPhotoCard.classList.add("py-2");
      usernameCard.classList.add("pt-2");
      userCard.classList.add("mt-2");
      userCard.classList.add("row");
      userCard.classList.add("box");
      userCard.classList.add("mx-2");
      userCard.classList.add("bg-grey");
      var photo = document.createElement('img');
      photo.classList.add("foto");
      userPhotoCard.appendChild(photo);
      photo.src = msg[i].user[0].profile.picture; //BURASI WEBSOCKETE BAĞLANACAK


      usernameCard.classList.add('col-8');
      usernameCard.classList.add('my-auto');
      var username = document.createElement('p');
      username.classList.add('isimler');
      usernameCard.appendChild(username);
      username.innerHTML = msg[i].user[0].profile.name; //BURASI WEBSOCKETE BAĞLANACAK
      userCard.appendChild(userPhotoCard);
      userCard.appendChild(usernameCard);
      kullaniciKarti.appendChild(userCard);
   }
}

const createUser = (msg) => {
   let a = 0;
      const allUsernames = document.getElementsByClassName('username');
      for(var i = 0;i<allUsernames.length;i++){
         if(allUsernames[i].innerHTML == msg.name) a = 1;;
      }
      if(a == 0){
         var userPhotoCard = document.createElement('div');
         var usernameCard = document.createElement('div');
         var userCard = document.createElement('div');
         var kullaniciKarti = document.querySelector('.kullaniciKarti')
         userPhotoCard.classList.add("fotoKart");
         userPhotoCard.classList.add("col-4");
         userPhotoCard.classList.add("py-2");
         usernameCard.classList.add("pt-2");
         
         userCard.classList.add("mt-2");
         userCard.classList.add("row");
         userCard.classList.add("box");
         userCard.classList.add("mx-2");
         userCard.classList.add("bg-grey");
         var photo = document.createElement('img');
         photo.classList.add("foto");
         userPhotoCard.appendChild(photo);
         photo.src = msg.picture; //BURASI WEBSOCKETE BAĞLANACAK
   
   
         usernameCard.classList.add('col-8');
         usernameCard.classList.add('my-auto');
         var username = document.createElement('p');
         username.classList.add('isimler');
         usernameCard.appendChild(username);
         username.innerHTML = msg.name; //BURASI WEBSOCKETE BAĞLANACAK
         userCard.appendChild(userPhotoCard);
         userCard.appendChild(usernameCard);
         kullaniciKarti.appendChild(userCard);
      }
     
   }


const deleteUser = (msg) => {
   const allUsernames = document.getElementsByClassName('isimler');
   console.log(allUsernames);
   var kullaniciKarti = document.querySelector('.kullaniciKarti')
   for(var i = 0;i<allUsernames.length;i++){
      if(allUsernames[i].innerHTML == msg.name){
         const usernameCard = allUsernames[i].parentElement;
         const userCard = usernameCard.parentElement;
         kullaniciKarti.removeChild(userCard);
      }

     
   }
}

socket.on('gaming', (msg) => {
   console.log(msg);
   takeMessage(msg)
});

socket.on('gaming-users-connect',(msg) => {
   console.log('success enter');
   console.log(msg)
   createUsers(msg);

})
socket.on('gaming-user-connect',(msg) => {
   console.log('user connected')
   console.log(msg);
   createUser(msg);

})

socket.on('gaming-user-disconnect',(msg) => {
   console.log('user disconnected')
   console.log(msg);
   deleteUser(msg);
})