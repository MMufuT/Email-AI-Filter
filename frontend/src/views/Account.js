import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import CustomNavbar from '../components/Custom-Navbar'
import getAccount from '../functions/get-account'
import '../styles/account.css'
import { useNavigate } from 'react-router-dom'
import patchAccount from '../functions/patch-account'
import patchFilterPreferences from '../functions/patch-filter-preferences'
import deleteAccount from '../functions/delete-account'


const Account = () => {

    const [account, setAccount] = new useState('')
    const [tempGmailLinkId, setTempGmailLinkId] = new useState('')
    const navigate = useNavigate()

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleShowConfirmation = () => {
        setShowConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };

    const handleGmailLinkIdChange = (e) => {
        const numericInput = e.target.value.replace(/[^0-9]/g, '');
        setTempGmailLinkId(numericInput);
    }

    const handleKeyDown = (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
        if (!allowedKeys.includes(e.key) && (isNaN(Number(e.key)) || e.key === ' ')) {
            e.preventDefault();
        }
    }

    useEffect(() => {
        document.title = "Account | Gmail AI Filter"
        getAccount(navigate, setAccount, setTempGmailLinkId)
    }, [])

    return (
        <div className="container-fluid search-bg vh-100">
            <CustomNavbar />
            <div className="row justify-content-center align-items-between mt-3">
                <div className="card col-md-4 custom-card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-center mt-2">
                            <img src={account.picture} alt="Profile Picture" style={{ borderRadius: "60px", width: "10%" }} />
                            <h3 className="card-title ms-5 pt-2" style={{ color: "white", outline: "0px solid red" }}>Account Information </h3>
                        </div>
                        <div className="d-flex justify-content-start my-5">
                            <text style={{ color: "#a7aab0" }}>Email Address:&nbsp;</text>
                            <text style={{ color: "white" }}>{account.emailAddress}</text>
                        </div>
                        <hr style={{ borderColor: "white" }} />
                        <div className=" justify-content-start mt-5">
                            <text style={{ color: "#a7aab0" }}>Inbox Filters:&nbsp;</text>
                            <text style={{ color: "white" }}>{account.inboxFilter}</text><br/>
                            <text style={{ color: "#a7aab0" }}>Oldest Email Filter Database:&nbsp;</text>
                            <text style={{ color: "white" }}>{account.oldestEmail}</text>
                        </div>
                        <div className="d-flex justify-content-end mt-3 mb-3">
                            <button className="btn btn-danger mt-2" style={{ marginTop: "-1.2%", fontSize: "80%" }}
                                onClick={() => patchFilterPreferences(navigate)}
                            >Reset Preferences</button>
                        </div>
                        <hr style={{ borderColor: "white" }} />
                        <div className="d-flex justify-content-start mt-5">
                            <text style={{ color: "#a7aab0" }}>Gmail Link ID:&nbsp;</text>
                            <text style={{ color: "white" }}>{account.gmailLinkId}</text>
                        </div>
                        <div className="d-flex justify-content-between mb-3" style={{ marginTop: "0%" }}>
                            <div>
                                <a href={`https://mail.google.com/mail/u/${tempGmailLinkId}`} style={{ color: "#57abf6" }}>
                                    https://mail.google.com/mail/u/
                                </a>
                                <input
                                    className="ms-1 me-1"
                                    type="number"
                                    onKeyDown={handleKeyDown}
                                    style={{ width: '45px', backgroundColor: "#4A4949", color: "white", borderRadius: "5px", border: "none", textAlign: "center" }} // Adjust the width as needed
                                    defaultValue={tempGmailLinkId}
                                    onChange={(e) => handleGmailLinkIdChange(e)}
                                    min="0"
                                />
                                <a href={`https://mail.google.com/mail/u/${tempGmailLinkId}`} style={{ color: "#57abf6" }}>/#inbox</a>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-primary" style={{ marginTop: "-1.5%", fontSize: "95%" }}
                                onClick={() => {
                                    patchAccount(account, setAccount, tempGmailLinkId, navigate)
                                }}>Save</button>
                        </div>
                        <hr style={{ borderColor: "white" }} />
                        <div className="d-flex justify-content-start mt-4">
                            <h3 style={{ color: "red" }}>Danger Zone</h3>
                        </div>
                        <div className="d-flex justify-content-center my-4" style={{ color: "white" }}>
                            <button className="btn btn-danger" onClick={handleShowConfirmation}>Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={showConfirmation}
                onHide={handleCloseConfirmation}
                centered // Use the "centered" prop to center the modal vertically
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you absolutely sure you want to delete your account?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => { deleteAccount(navigate) }}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default Account