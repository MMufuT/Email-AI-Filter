import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import magGlass from './smartfilter128.png';
import React from 'react';
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';


function App() {
  
  function handleCallbackResponse(response) {

    //This code is for testing purposes
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    //----------------------------------------------------------------
    const jwtToken = response.credential;
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL,
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(process.env.REACT_APP_SERVER_URL);

    
    axiosInstance.get('/')
      .then(response => {
        if (response.status === 200) {
          // Display a success message
          console.log('yup it worked!');
        }
      })
      .catch(error => {
        console.log('nah that shit failed:');
        console.log(error);
      });

    
  };

  
  useEffect(() => { 
  
    window.onload = function() {
    
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
      callback: handleCallbackResponse
  })

    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    ); }
  }, []);

  


  /*
 * Create form to request access token from Google's OAuth 2.0 server.
 */

  return (
    <Router>
    <div className="App" class="p-3 mb-2 bg-danger text-white container text-center">
      
      <div class="mt-3">
        <h1>Welcome to</h1>
      </div>

      {/* img/filter row */}
      <div class="container">
        <div class="row "> 
          <div class="col-1 mt-3">
            <img src={magGlass} alt="logo" width="50"  />
          </div>
          <div class="col-10 mt-4">
            <h1>GmailAI SmartFilter</h1>
          </div>
        </div>

        <div class="row justify-content-center">
          <div id="signInDiv" class="my-5 d-flex justify-content-center"></div>
        </div>
      </div>

    </div>
    </Router>
  )
}

export default App;
