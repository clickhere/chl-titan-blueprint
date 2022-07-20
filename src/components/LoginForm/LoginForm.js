import React from "react";
import styles from './LoginForm.module.scss';

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
    <div >
      <div >
        <form id="login_form" onSubmit={onSubmit}>
          <h1 className={styles['form-headline']}>My Account</h1>
          <h2 className={styles['form-sybheadline']}>Login</h2>
          <label>Username or email address*</label>
          <br></br>
          <input id="username" type="text" name="username" className={styles['input-text']} />
          <br></br>
          <label>Password *</label>
          <br></br>
          <input id="password" type="password" name="password" className={styles['input-text']} />
          <br></br>
          
          <label>
            <input type="checkbox" className={styles['input-checkbox']}></input>
            <span>Remember me</span>
          </label>
          <br></br>
          <input type="submit" value="Log in" className={styles['login-button']} />
        </form>
        <a className={styles['forgot-password']} href="#">Lost your password?</a>
      </div>
    </div>
  </div>
  );
}


