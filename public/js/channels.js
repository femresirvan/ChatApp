const logout = () => {
   axios.get('/logout').then(() => {
      window.location.href = "/channels";
   }).catch((err) => {
      alert('Unexpected Error');
   })
}