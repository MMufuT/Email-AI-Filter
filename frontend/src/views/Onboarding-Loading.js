import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { useNavigate } from 'react-router-dom'
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'
import axios from 'axios'
import '../styles/onboarding.css'

const OnboardingLoading = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        console.log('use effect entered')
        const checkStatus = (async () => {
            await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/login-status`, { withCredentials: true })
                .then((response) => {
                    console.log('User is authorized')
                    // If user is authorized (logged in), no action needed
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        const errorMessage = error.response.data.mssg

                        // If user is unauthorized (not logged in), redirect to Google OAuth login
                        if (errorMessage === "User is not logged in") {
                            window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
                        } else { /*do nothing*/ }
                    }
                })

            setLoading(true)

            axios.post(`${process.env.REACT_APP_SERVER_URL}/onboarding/loading`, {}, { withCredentials: true })
                .then(response => {
                    //if user has filled out the form and isn't onboared yet, continue onboarding
                    setLoading(false)
                    navigate('/search')
                })
                .catch(error => {
                    if (error.response && error.response.status === 428) {
                        // If user hasn't filled out the form, redirect to form
                        setLoading(false)
                        console.log('User needs to fill out form before onbaording')
                        navigate('/onboarding/form')
                    } else if (error.response && error.response.status === 409) {
                        // If user is already onboarded, redirect to search
                        setLoading(false)
                        navigate('/search')
                        console.log('User is already onboarded')
                    }
                    setLoading(false)
                })
        })

        checkStatus()
    }, [])

    return (
        <div className='animation-area'>
            <div className='box-area'>
                {/* Bubble animation */}
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </div>

            {loading ? (
                <div className="container vh-100" style={{ border: '0px solid blue' }}>
                    <div className="row d-flex h-100 justify-content-center align-content-center" style={{ border: '0px solid red' }}>
                        <div className="justify-content-center align-items-end d-flex h-25" style={{ border: '0px solid green' }}>
                            <ClimbingBoxLoader size={40} color='white' loading={loading} />
                        </div>

                        <div className="row d-flex align-items-center h-25" style={{ border: '0px solid red' }}>
                            <div className="justify-content-center d-flex flex-column text-center">
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
    )
}




export default OnboardingLoading