import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/onboarding.css'
import categoryExample from '../images/categoryExample.jpg'
import UserIdExample from '../images/UserID Example.jpg'
const oAuthLoginUrl = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL
const serverUrl = process.env.REACT_APP_SERVER_URL

const OnboardingForm = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        filterPreferences: {
            social: true,
            updates: true,
            promotions: true,
            forums: true,
        },
        gmailLinkId: "",
    })

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target
        setFormData((prevData) => ({
            ...prevData,
            filterPreferences: {
                ...prevData.filterPreferences,
                [name]: !checked,
            },
        }))
    }

    const handleUserIdChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            gmailLinkId: event.target.value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        // The finishedForm object will contain the formData
        const finishedForm = formData
        // console.log(finishedForm) (Development Only)
        axios.post(`${serverUrl}/onboarding/form`, finishedForm, { withCredentials: true })
            .then((response) => {
                console.log('Form details have been successfully uploaded')
                navigate('/onboarding/loading')
            })
            .catch((error) => {
                console.log('Something went wrong submitting the form details')
            })

    }

    // Auth check using useEffect
    useEffect(() => {
        document.title = "Onboarding Form | Email AI Filter"
        const checkStatus = (async () => {
            await axios.get(`${serverUrl}/onboarding/onboarded-status`, { withCredentials: true })
                .then((response) => {
                    // If user is authorized (logged in and onboarded), redirect to search
                    navigate('/search')
                })
                .catch((error) => {
                    const errorMessage = error.response.data.mssg
                    if (errorMessage === "User is not onboarded") {
                        // If user is not onboarded, navigate to the onboarding form
                        navigate('/onboarding/form')
                    } else {
                        // If user is unauthorized (not logged in), redirect to Google OAuth login
                        window.location.href = oAuthLoginUrl
                    }
                })
        })

        checkStatus()

    }, [])


    return (
        <div className="login-area d-flex align-items-center justify-content-center container-fluid">
            
            <div className="row justify-content-center">
                <div className="col-sm-8 my-2">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">Select Your Preferences</h3>
                            <p className="card-text">
                                Customize what emails you want in your personal database. Put some of these queries in your Gmail search
                                bar and see what comes up.<br /> <br />
                                <em><strong>(category:social) (category:updates) (category:promotions) (category:forums)</strong></em><br /><br />
                                Then decide whether you want to exclude those emails from your database.
                            </p>
                            <div className="d-flex justify-content-center">
                                <img src={categoryExample} alt="Gmail Search Tag" className="img-fluid mb-3" style={{ transform: 'scale(0.8)' }} />
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-sm-5">
                                        <h5 className="mb-0 text-center">Category</h5>
                                    </div>
                                    <div className="col-sm-6">
                                        <h5 className="mb-0 text-center">Emails from selected categories will be excluded from your database</h5>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-5 justify-content-center d-flex">
                                        <label htmlFor="category" className="form-check-label">
                                            Social
                                        </label>
                                    </div>
                                    <div className="col-sm-6 justify-content-center d-flex">
                                        <div className="form-check text-center">
                                            <input className="form-check-input" type="checkbox" name="social" style={{ outline: '1px solid black' }} onChange={handleCheckboxChange} checked={!formData.filterPreferences.social} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-5 justify-content-center d-flex">
                                        <label htmlFor="category" className="form-check-label">
                                            Updates
                                        </label>
                                    </div>
                                    <div className="col-sm-6 justify-content-center d-flex">
                                        <div className="form-check text-center">
                                            <input className="form-check-input" type="checkbox" name="updates" style={{ outline: '1px solid black' }} onChange={handleCheckboxChange} checked={!formData.filterPreferences.updates} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-5 justify-content-center d-flex">
                                        <label htmlFor="category" className="form-check-label">
                                            Forums
                                        </label>
                                    </div>
                                    <div className="col-sm-6 justify-content-center d-flex">
                                        <div className="form-check text-center">
                                            <input className="form-check-input" type="checkbox" name="forums" style={{ outline: '1px solid black' }} onChange={handleCheckboxChange} checked={!formData.filterPreferences.forums} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-5 justify-content-center d-flex">
                                        <label htmlFor="category" className="form-check-label">
                                            Promotions
                                        </label>
                                    </div>
                                    <div className="col-sm-6 justify-content-center d-flex">
                                        <div className="form-check text-center">
                                            <input className="form-check-input" type="checkbox" name="promotions" style={{ outline: '1px solid black' }} onChange={handleCheckboxChange} checked={!formData.filterPreferences.promotions} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h5>User ID</h5>
                                    <p>
                                        In order for us to directly link you to the emails that come up in your future searches, we need
                                        the User ID of the gmail account you signed up with. <strong>This is the number that comes up right after "u/" in your Gmail URL.</strong> Enter the number below.
                                        <br /><br /><strong>Example:</strong> In this case "https://mail.google.com/mail/u/0/#inbox", the User ID would be 0.
                                    </p>
                                    <p className="text-center">
                                        <br /><a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener noreferrer">
                                            Gmail Link:
                                        </a>{" "}
                                        Make sure you're on the right account after getting the User ID
                                    </p>
                                    <div className="d-flex justify-content-center">
                                        <img src={UserIdExample} alt="Gmail Search Tag" className="img-fluid mb-3" />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-sm-6">
                                            <input type="number" className="form-control" name="user-id" placeholder="Enter your User ID" required min="0" value={formData.gmailLinkId} onChange={handleUserIdChange} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary float-end">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingForm
