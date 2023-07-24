import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React from 'react';
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


//Pages
//import Login from './views/Login.js';
import Home from './views/Home.js';
import Onboarding from './views/Onboarding'


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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* <Route path="/auth/google" element={<Login />} /> */}
      </Routes> 
      
    

    
    </Router>
  )
}

export default App;
