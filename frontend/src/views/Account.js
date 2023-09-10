import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import React, { useState, useEffect } from 'react'
import CustomNavbar from '../components/Custom-Navbar'
import getAccount from '../functions/get-account'
import '../styles/account.css'
import { useNavigate } from 'react-router-dom'

const Account = () => {

    const [account, setAccount] = new useState('')
    const navigate = useNavigate()

    useEffect(() => {
        getAccount(navigate, setAccount)
    }, [])

    return (
        <div className="container-fluid search-bg vh-100">
            <CustomNavbar />
            <div className="row justify-content-center align-items-center mt-5">
                <div className="card col-md-4 custom-card">
                    <div className="card-body">
                        <h3 className="card-title" style={{color:"white"}}>Account Information </h3>
                        <img src={account.picture} alt="Profile Picture" style={{borderRadius:"60px", width:"10%"}}/>
                    </div>

                </div>
            </div>

        </div >
    )
}

export default Account