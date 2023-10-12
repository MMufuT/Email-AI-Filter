import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import '../styles/home.css'
import magAiLogo from '../images/mag-ai-logo.png'
import qdrantLogo from '../images/qdrant-logo.png'
import openAiLogo from '../images/open-ai-logo.png'
import githubButton from '../images/github.png'
import linkedInButton from '../images/linkedin.png'


const Home = () => {

  document.body.style.overflow = 'hidden';
  useEffect(() => {
    document.title = "Log in | Gmail AI Filter"
  }, [])

  return (

    <div className="container-fluid vh-100 home-bg">

      {/* Header Bar */}
      <div className="row justify-content-center align-items-center" style={{ background: "#BABABA", boxShadow: "0px 0px 4px 10px rgba(0, 0, 0, 0.2)", zIndex: "2", position: "relative" }}>
        <img src={magAiLogo} alt="magAiLogo" className="magAiLogo-home col-md-4 my-3" style={{ outline: "solid red 0px" }} />
        <h2 className="col-md-2 mt-2 patrick-font" style={{ color: "white" }}>Gmail AI Filter</h2>
      </div>

      {/* Main Content */}
      <div className="row justify-content-center align-items-center">

        {/* Left Side (Info) */}
        <div className="col-md-7" style={{ outline: "solid red 0px" }}>
          <div className="row d-flex justify-content-center">
            <div className="my-5 col-md-8 info-card" style={{ color: "white" }}>
              <h3 className="text-center my-5 patrick-font">Find your emails in seconds with <br />AI-Powered Context-Based Filtering</h3>
              <hr style={{ borderColor: "white", borderWidth: "3px" }} />
              <div className="row d-flex justify-content-center mt-4">
                <div className="col-md-4 text-center" style={{ outline: "solid red 0px" }}>
                  <a href="https://qdrant.tech">
                    <img src={qdrantLogo} alt="qdrantLogo" style={{ height: "50px", width: "auto" }} className="mb-1" />
                  </a>
                  <br />
                  <text className="patrick-font">Qdrant Vector Database</text>
                </div>
                <div className="col-md-4 text-center" style={{ outline: "solid red 0px" }}>
                  <a href="https://openai.com/blog/openai-api">
                    <img src={openAiLogo} alt="openAiLogo" style={{ height: "50px", width: "auto" }} className="mb-1" />
                  </a>
                  <br />
                  <text className="patrick-font">Open AI</text>
                </div>
              </div>
              <div className="row d-flex ">
                <div className="col-md-3 align-items-end d-flex patrick-font" style={{ outline: "solid green 0px", fontSize: "90%", marginBottom: "0%" }}>Powered By:</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-5 row d-flex align-items-center " style={{ outline: "solid red 0px", background: "#5F676D", height: "100vh" }}>
          <div className="row d-flex justify-content-center ">
            <div className="card col-md-6 login-card" style={{ backgroundColor: "#BABABA" }}>
              <div className="card-body">
                <div className="row d-flex justify-content-center mb-5">
                  <h3 className="text-center patrick-font">Log In To Your Account</h3>
                </div>
                <div className="row d-flex justify-content-center">
                  <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
                  <div className="google-btn col-md-6">
                    <a href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}>
                      <div className="google-icon-wrapper">
                        <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                      </div>
                      <p className="btn-text"><b>Sign in with Google</b></p>
                    </a>
                  </div>
                </div>
                <hr className="my-3 mx-5" style={{ borderColor: "black", borderWidth: "3px" }} />
                <div className="row justify-content-center d-flex">
                  <div className=" col-md-7 justify-content-between d-flex">
                    <a href="https://github.com/MMufuT" target="_blank" >
                      <img style={{ height: "30px", width: "auto" }} src={githubButton} />
                    </a>
                    <a href="https://www.linkedin.com/in/mufu-tebit-8bb355256/" target="_blank">
                      <img style={{ height: "30px", width: "auto" }} src={linkedInButton} />
                    </a>
                  </div>
                </div>
                <hr className="my-3 mx-5" style={{ borderColor: "black", borderWidth: "3px" }} />
                <div className="row d-flex justify-content-center">
                  <div className="col-md-6 justify-content-center d-flex" style={{ outline: "0px solid red" }}>
                    <a href="https://www.buymeacoffee.com/MufuT" target="_blank">
                      <img style={{ height: "85%", width: "auto" }} src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=MufuT&button_colour=8d8d8b&font_colour=000000&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" />
                    </a>
                  </div>
                </div>
                <hr className="my-3 mx-5" style={{ borderColor: "black", borderWidth: "3px" }} />
                <div className="row d-flex justify-content-center">
                  <div className="col-md-12 justify-content-center d-flex" style={{ outline: "0px solid red" }}>
                  <a href="/privacy-policy" style={{ color: "#5F676D" }} target="_blank">Privacy Policy</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; <a href="/cookies" style={{ color: "#5F676D" }} target="_blank">Cookie Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Home