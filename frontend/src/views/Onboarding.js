import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import magGlass from '../smartfilter128.png';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'
import axios from 'axios';
import '../styles/onboarding.css';

const Onboarding = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        // setTimeout(() => {
        //     console.log('use effect entered')
        //     axios.get(`${process.env.REACT_APP_SERVER_URL}/onboarding`, { withCredentials: true })
        //         .then(response => {
        //             setLoading(false);
        //             navigate('/search')
        //         })
        //         .catch(error => {
        //             console.log(error);
        //             setLoading(false);
        //         })

        // }, 10000000000000)
        console.log('use effect entered')
        axios.get(`${process.env.REACT_APP_SERVER_URL}/onboarding`, { withCredentials: true })
        .then(response => {
            setLoading(false);
            navigate('/search')
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
        })

    }, [])

    return (
        <div className='animation-area'>
            <div className='box-area'>
                {/* Wave animation elements */}
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </div>

            {loading ? (
                <div class="container vh-100" style={{ border: '0px solid blue' }}>
                    <div class="row d-flex h-100 justify-content-center align-content-center" style={{ border: '0px solid red' }}>
                        <div class="justify-content-center align-items-end d-flex h-25" style={{ border: '0px solid green' }}>
                            <ClimbingBoxLoader size={40} color='white' loading={loading} />
                        </div>

                        <div class="row d-flex align-items-center h-25" style={{ border: '0px solid red' }}>
                            <div class="justify-content-center d-flex flex-column text-center">
                                <h1 className="loading-text" style={{ fontFamily: 'Nunito, sans-serif', fontStyle: 'italic', color: 'white' }}>
                                    Loading Your Personal Gmail Database
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </h1>
                                <h4 style={{ fontFamily: 'Nunito, sans-serif', fontStyle: 'italic', color: 'white' }}>
                                    (This should take less than a minute)
                                </h4>
                            </div>

                        </div>
                    </div>



                </div>
            ) : (
                //if no longer loading, redirect to /search route on frontend.
                <>
                </>
            )}

        </div>
    );
};




export default Onboarding;