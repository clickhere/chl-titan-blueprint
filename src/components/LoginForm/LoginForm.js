import React from "react";

//export default LoginForm;
export default function LoginForm({ isShowLogin, lastRedirect }) {

  // Returns Auth Token
  async function getRefreshToken(e) {
    try {
        const response = await fetch('https://titanbpdev.wpengine.com/wp-json/tecom/v1/login', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({username:document.getElementById('username').value,password:document.getElementById('password').value,redirect:lastRedirect}) //document.getElementById('login_form')
        })

        const data = await response.json();
        return data.token;

    } catch (error) {
        console.log(error);
    } 
  }

  // Returns BigCommerce redirect URL
  async function getRedirectUrl(token) {

    var bearerToken = "Bearer " + token;

    try {
      const response = await fetch('https://titanbpdev.wpengine.com/wp-json/tecom/v1/bc-link', {
          method: 'POST',
          headers:{
            'Accept' : 'application/json', 
            'Content-Type': 'application/json',
            'Authorization': bearerToken,
              
          },
          body: JSON.stringify({ action: "account",})
      })
      
      const data = await response.json();
      return data.redirect_to;

    } catch (error) {
        console.log(error);
    } 
  }

  // Submit Button Handler
  const onSubmit = async(e) => {
    console.log('LoginForm lastRedirect='+lastRedirect);
    e.preventDefault();

    const refreshToken = await getRefreshToken();
    const redirectUrl = await getRedirectUrl(refreshToken);

    window.open(redirectUrl, '_blank');
  };
  
  return (
  <div className={`${isShowLogin ? "active" : ""} show ${lastRedirect ? lastRedirect : "blank"}`}>
    <div className="login-form">
      <div className="form-box solid">
        <form id="login_form" onSubmit={onSubmit}>
          <h1 className="login-text">Sign In</h1>
          <label>Username</label>
          <br></br>
          <input id="username" type="text" name="username" className="login-box" />
          <br></br>
          <label>Password</label>
          <br></br>
          <input id="password" type="password" name="password" className="login-box" />
          <br></br>
          <input type="submit" value="Login" className="login-btn" />
        </form>
      </div>
    </div>
  </div>
  );
}


