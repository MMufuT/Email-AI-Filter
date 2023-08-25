import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import magGlass from '../smartfilter128.png';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Home = () => {

  return (

    <>
      <div className="homr-container" class="p-3 mb-5 bg-danger text-white container text-center">

        <div class="mt-3">
          <h1>Welcome to</h1>
        </div>

        {/* img/filter row */}
        <div class="container">
          <div class="row ">
            <div class="col-1 mt-3">
              <img src={magGlass} alt="logo" width="50" />
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


      <div class="d-flex justify-content-center">
        <a href="http://localhost:8000/auth/google">
          <button type="button" className="btn btn-primary">Google+</button>
        </a>
      </div>
    </>




  );
};

export default Home;