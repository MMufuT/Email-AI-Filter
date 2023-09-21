import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import magGlass from '../images/smartfilter128.png'

const Home = () => {

  return (

    <>
      <div className="homr-container" class="p-3 mb-5 bg-danger text-white container text-center">

        <div className="mt-3">
          <h1>Welcome to</h1>
        </div>

        {/* img/filter row */}
        <div className="container">
          <div className="row ">
            <div className="col-1 mt-3">
              <img src={magGlass} alt="logo" width="50" />
            </div>
            <div className="col-10 mt-4">
              <h1>GmailAI SmartFilter</h1>
            </div>
          </div>

          <div className="row justify-content-center">
            <div id="signInDiv" className="my-5 d-flex justify-content-center"></div>
          </div>

        </div>



      </div>


      <div className="d-flex justify-content-center">
        <a href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}>
          <button type="button" className="btn btn-primary">Google+</button>
        </a>
      </div>
    </>




  )
}

export default Home