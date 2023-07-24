import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import magGlass from '../smartfilter128.png';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader'
import axios from 'axios';

const Onboarding = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
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
        <div className='onboarding-container'>
            {loading ? (
                <ClipLoader size={30} color='green' loading={loading} />
            ) : (
                //if no longer loading, redirect to /search route on frontend.
                // Display content when loading is complete before redirection
                <>
                    <h1>Onboarding Complete!</h1>
                    <p>You have successfully completed the onboarding process.</p>
                </>
            )}

        </div>
    );
};




export default Onboarding;