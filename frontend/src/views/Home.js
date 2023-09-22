import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import magGlass from '../images/smartfilter128.png'
import '../styles/home.css'
import magAiLogo from '../images/mag-ai-logo.png'
import qdrantLogo from '../images/qdrant-logo.png'
import openAiLogo from '../images/open-ai-logo.png'

{/* <div className="d-flex justify-content-center">
  <a href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}>
    <button type="button" className="btn btn-primary">Google+</button>
  </a>
</div> */}

const Home = () => {

  return (

    <div className="container-fluid vh-100 home-bg">
      <div className="row justify-content-center align-items-center" style={{ background: "#BABABA", boxShadow: "0px 0px 4px 10px rgba(0, 0, 0, 0.2)", zIndex: "2", position: "relative" }}>
        <img src={magAiLogo} alt="magAiLogo" className="magAiLogo-home col-md-4 my-3" style={{ outline: "solid red 0px" }} />
        <h3 className="col-md-2 mt-2" style={{ color: "white" }}>Gmail AI Filter</h3>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6" style={{ outline: "solid red 0px" }}>
          <div className="row">
            <div className="my-5" style={{ color: "white" }}>&nbsp;</div>
          </div>
          <div className="row">
            <div className="my-5" style={{ color: "white" }}>&nbsp;</div>
          </div>
          <div className="row">
            <div className="my-1" style={{ color: "white" }}>&nbsp;</div>
          </div>


          <div className="row d-flex justify-content-center">
            <div className="my-5 col-md-8 info-card" style={{ color: "white" }}>
              <h3 className="text-center my-5">Find your emails in seconds with AI-Powered Context-Based Filtering</h3>
              <hr style={{ borderColor: "white", borderWidth: "3px" }} />
              <div className="row d-flex justify-content-between my-4">
                <div className="col-md-3 align-items-center d-flex" style={{ outline: "solid green 0px" }}>Powered By:</div>
                <div className="col-md-4 text-center" style={{ outline: "solid red 0px" }}>
                  <a href="https://qdrant.tech">
                  <img src={qdrantLogo} alt="qdrantLogo" style={{ height: "50px", width: "auto" }} className="mb-1" />
                  </a>
                  <br />
                  <text>Qdrant Vector Database</text>
                </div>
                <div className="col-md-4 text-center" style={{ outline: "solid red 0px" }}>
                  <a href="https://openai.com/blog/openai-api">
                    <img src={openAiLogo} alt="openAiLogo" style={{ height: "50px", width: "auto" }} className="mb-1" />
                  </a>
                  <br />
                  <text>Open AI</text>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6" style={{ outline: "solid red 0px", background: "#202124" }}>right</div>
      </div>


    </div>




  )
}

export default Home