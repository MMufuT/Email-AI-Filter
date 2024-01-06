import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { noConsentDeleteAccount, getConsentStatus, consentGiven } from '../functions/consent-functions'

const ThirdPartyConsent = () => {

    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Third Party Consent | Email AI Filter"
        getConsentStatus(navigate)
    })

    return (
        <div className="container-fluid align-items-center justify-content-center home-bg d-flex vh-100" >
            <div className="row d-flex justify-content-center" >
                <div className="col-sm-8" style={{ outline: "0px solid green" }}>
                    <div className="card" style={{
                        boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.5)",
                        border:"3px solid #777A82",
                        borderRadius:"8px"}}>
                        <div className="card-body justify-content-center" style={{ outline: "0px solid red", background: "#cecece", borderRadius:"8px" }}>
                            <h2 className="card-title justify-content-center d-flex" style={{ outline: "0px solid red", background: "#cecece", margin: "0" }}>
                                <FontAwesomeIcon className="me-3 mt-1" icon={faCircleCheck} />
                                Third Party Consent
                            </h2>
                            <hr />
                            <ul className="card-text" style={{ outline: "0px solid blue", background: "#cecece", padding: "0 1rem" }}>
                                <li>Our app utilizes advanced AI models for analyzing emails.</li>
                                <li>To provide this service, we require access to your Gmail data.</li>
                                <li>Your consent enables context-based searches with high accuracy.</li>
                                <li>We assure you that data sharing is solely for app functionality.</li>
                                <li>Without consent, the app's services will be <strong>unavailable</strong>.</li>
                                <li>You may withdraw consent and delete your account anytime <strong>at your account page</strong>.</li>
                                <li>To view how we use your Gmail data in more detail, view our <a href='/google-api-user-data-policy' target='_blank'>Google API Policy</a>.</li>
                            </ul>
                            <hr />
                            {/* two buttons within a row. the left button will say "I do not consent" and the right button will say "I do consent"*/}
                            <div className="row">
                                <div className="col-sm-6">
                                    <button type="button" className="btn btn-danger" onClick={() => noConsentDeleteAccount(navigate)}>
                                        <FontAwesomeIcon className="me-2" icon={faCircleXmark} />
                                        I DO NOT Consent</button>
                                </div>
                                <div className="col-sm-6 d-flex justify-content-end">
                                    <button type="button" className="btn btn-success" onClick={() => consentGiven(navigate)}>
                                        <FontAwesomeIcon className="me-2" icon={faCircleCheck} />
                                        I Consent</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThirdPartyConsent;