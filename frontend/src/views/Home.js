import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import '../styles/home.css'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// import required modules
import { EffectCoverflow, Pagination, Keyboard, Mousewheel } from 'swiper/modules';
import magAiLogo from '../images/mag-ai-logo.png'
import qdrantLogo from '../images/qdrant-logo.png'
import openAiLogo from '../images/open-ai-logo.png'
import githubButton from '../images/github.png'
import linkedInButton from '../images/linkedin.png'
import googleSignInButton from '../images/google-sign-in-button.png'
import home from '../images/home.png'
import search from '../images/search.png'
import account from '../images/account.png'
import history from '../images/history.png'
import onboardingDiagram from '../images/onboarding-diagram.png'
import searchDiagram from '../images/search-diagram.png'


const Home = () => {

  // useRef to get access to the header DOM element
  const headerRef = useRef(null);
  // useState to store the calculated height
  const [headerHeight, setHeaderHeight] = useState(0);

  // document.body.style.overflow = 'hidden';
  useEffect(() => {
    document.title = "Log in | Email AI Filter"
    setHeaderHeight(headerRef.current.offsetHeight);
  }, [])

  return (

    <div className="container-fluid home-bg d-flex flex-column">

      {/* Header Bar */}
      <div className="row justify-content-center align-items-center" ref={headerRef} style={{ background: "#BABABA", bosmhadow: "0px 0px 4px 10px rgba(0, 0, 0, 0.2)", zIndex: "2", position: "relative" }}>
        <img src={magAiLogo} alt="magAiLogo" className="magAiLogo-home col-sm-4 my-3" style={{ outline: "solid red 0px" }} />
        <h2 className="col-sm-2 mt-2 patrick-font" style={{ color: "white" }}>Email AI Filter</h2>
      </div>

      {/* Empty Space*/}
      <div className="row justify-content-center align-items-center" style={{ height: `${headerHeight}px` }}></div>

      {/* Main Content */}
      <div className="row justify-content-center align-items-center mb-5">

        {/* Left Side (Info) */}
        <div className="col-sm-7" style={{ outline: "solid red 0px" }}>
          <div className="row d-flex justify-content-center">
            <div className="my-5 col-sm-8 info-card" style={{ color: "white" }}>
              <h3 className="text-center my-5 patrick-font">Find your emails in seconds with <br />AI-Powered Context-Based Filtering</h3>
              <hr style={{ borderColor: "white", borderWidth: "3px" }} />
              <div className="row d-flex justify-content-center mt-4">
                <div className="col-sm-4 text-center" style={{ outline: "solid red 0px" }}>
                  <a href="https://qdrant.tech" target="_blank">
                    <img src={qdrantLogo} alt="qdrantLogo" style={{ height: "50px", width: "auto" }} className="mb-1" />
                  </a>
                  <br />
                  <text className="patrick-font">Qdrant Vector Database</text>
                </div>
                <div className="col-sm-4 text-center" style={{ outline: "solid red 0px" }}>
                  <a href="https://openai.com/blog/openai-api" target="_blank">
                    <img src={openAiLogo} alt="openAiLogo" style={{ height: "50px", width: "auto" }} className="mb-1" />
                  </a>
                  <br />
                  <text className="patrick-font">Open AI</text>
                </div>
              </div>
              <div className="row d-flex ">
                <div className="col-sm-3 align-items-end d-flex patrick-font" style={{ outline: "solid green 0px", fontSize: "90%", marginBottom: "0%" }}>Powered By:</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-sm-5 row d-flex align-items-center flex-column" style={{ outline: "solid red 0px" }}>
          <div className="row d-flex justify-content-center flex">
            <div className="card col-sm-8 login-card" style={{ backgroundColor: "#BABABA" }}>
              <div className="card-body">
                <div className="row d-flex justify-content-center mb-5">
                  <h3 className="text-center patrick-font">Log In To Your Account</h3>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-sm-8 justify-content-center d-flex" style={{ outline: "0px solid red" }}>
                    <a href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}>
                      <img src={googleSignInButton} style={{ height: "50px", width: "auto" }} />
                    </a>
                  </div>
                </div>
                <hr className="my-3 mx-5" style={{ borderColor: "black", borderWidth: "3px" }} />
                <div className="row justify-content-center d-flex">
                  <div className="col-sm-7 justify-content-between d-flex">
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
                  <div className="col-sm-6 justify-content-center d-flex" style={{ outline: "0px solid red" }}>
                    <a href="https://www.buymeacoffee.com/MufuT" target="_blank">
                      <img style={{ height: "85%", width: "auto" }} src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=MufuT&button_colour=8d8d8b&font_colour=000000&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" />
                    </a>
                  </div>
                </div>
                <hr className="mt-4 mb-2 mx-5" style={{ borderColor: "black", borderWidth: "3px" }} />
                <div className="row d-flex justify-content-center" style={{ fontSize: "14px" }}>
                  <div className="col-sm-12 justify-content-center d-flex" style={{ outline: "0px solid red" }}>
                    <a href="/privacy-policy" style={{ color: "#5F676D" }} target="_blank">Privacy Policy</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; <a href="/cookies" style={{ color: "#5F676D" }} target="_blank">Cookie Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo */}
      <div className="row justify-content-center align-items-center" style={{ outline: "solid red 0px" }}>

        <div className="d-flex justify-content-center ">

          <div className="card col-sm-10 login-card mb-5" style={{ backgroundColor: "#BABABA" }}>
            <div className="row mb-3">
              <div className="justify-content-center d-flex mt-5">
                <h1 className="patrick-font text-center" style={{ color: "black", fontSize: "300%" }}>How It Works</h1>
              </div>
              <div className="mb-5">
                <a className="justify-content-center d-flex text-black-underline" href="https://bit.ly/49dyQgL" target="_blank">
                  <h3 className="patrick-font text-center" style={{ color: "black", fontSize: "300%" }}>Read More About Email AI Filter Here!</h3>
                </a>
              </div>
            </div>
            <div className="row justify-content-center align-items-center d-flex mb-5" >
              <div className="row justify-content-center align-items-center mb-5 col-sm-12" >

                <Swiper
                  effect={'coverflow'}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={2}
                  keyboard={{ enabled: true }}
                  mousewheel={true}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 25,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  pagination={true}
                  modules={[EffectCoverflow, Pagination, Keyboard, Mousewheel]}
                  className="mySwiper"
                >
                  <SwiperSlide className="justify-content-center d-flex">
                    <img className="slide-card" src={onboardingDiagram} />
                  </SwiperSlide>
                  <SwiperSlide className="justify-content-center d-flex">
                    <img className="slide-card" src={searchDiagram} />
                  </SwiperSlide>
                  <SwiperSlide className="justify-content-center d-flex">
                    <img className="slide-card" src={home} />
                  </SwiperSlide>
                  <SwiperSlide className="justify-content-center d-flex">
                    <img className="slide-card" src={search} />
                  </SwiperSlide>
                  <SwiperSlide className="justify-content-center d-flex">
                    <img className="slide-card" src={history} />
                  </SwiperSlide>
                  <SwiperSlide className="justify-content-center d-flex">
                    <img className="slide-card" src={account} />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Intellectual Property Footer */}
      <div className="row" style={{ background: "#BABABA", height: "5vh" }}>
        <h5 className="patrick-font justify-content-center align-items-center d-flex" style={{ color: "white" }}>© {new Date().getFullYear()} Email AI Filter. All rights reserved.</h5>
      </div>

    </div>
  )
}

export default Home