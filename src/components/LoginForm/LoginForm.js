import React from "react";
import { FaCreativeCommonsPd } from "react-icons/fa";
import styles from './LoginForm.module.scss';
import { client } from 'client';

export default function LoginForm() {

  // Pull the storeDomain url from the StoreSettings ACM model
  const { useQuery } = client;
  const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];
  const bigCommerceURL = "https://" + storeSettings.storeDomain; 
  //const bigCommerceLoginPage = bigCommerceURL + "/login.php";
  const bigCommercePasswordResetPage = bigCommerceURL + "/login.php?action=reset_password";

  const [errorMessage, setErrorMessage] = React.useState("");

  // Returns Auth Token
  async function getRefreshToken(e) {
    try {
        const response = await fetch('https://titanbpdev.wpengine.com/wp-json/tecom/v1/login', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({username:document.getElementById('username').value,password:document.getElementById('password').value}) 
        })

        const data = await response.json();
        console.log(data);
        
        if (data.status == 200){
          //console.log("Success: Requesting Redirect URL")
          //getRedirectUrl(data.token + "12345");
          getRedirectUrl(data.token);
        } else {
          console.log("Unauthorized");
          setErrorMessage("Username or password is invalid. Please try again or reset your password at the link below.");
        }

    } catch (error) {
      console.log(error);
    } 
  }

  // Returns BigCommerce redirect URL
  async function getRedirectUrl(token) {

    var bearerToken = "Bearer " + token;
    //var bearerToken = "";

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
      console.log(data);

      // The token is good, redirect to BigCommerce 
      if (data.status == 200) {
        window.open(data.redirect_to, '_blank');
      
      // The token is bad
      } else {

        // Missing Token
        if (data.message == "missing_token") {
          setErrorMessage("Missing Token");
        } 

        // Expired Token
        if (data.message == "invalid_token") {
          setErrorMessage("Invalid Token");
          // Clear old token, resubmit and store new one
        } 

        // Missing Redirect
        if (data.message == "missing_req: redirect") {
          setErrorMessage("Unable to login at this time.");
          console.log("Missing Redirect")
        } 

      }

    } catch (error) {
      console.log(error);
    } 

  }

  // Submit Button Handler
  const onSubmit = async(e) => {    
    e.preventDefault();

    getRefreshToken();
    //const refreshToken = await getRefreshToken();
    //const redirectUrl = await getRedirectUrl(refreshToken);
  };
  
  return (
  <div >
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
          {errorMessage && <div className={styles['error-message']}> {errorMessage} </div>}
          <br></br>
          
          <label>
            <input type="checkbox" className={styles['input-checkbox']}></input>
            <span>Remember me</span>
          </label>
          <br></br>
          <input type="submit" value="Log in" className={styles['login-button']} />
        </form>
        <a className={styles['forgot-password']} href= {bigCommercePasswordResetPage} target="_blank">Lost your password?</a>
      </div>
    </div>
  </div>
  );
}


