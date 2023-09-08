import React, { useState, useEffect } from 'react';
import CustomNavbar from '../components/Custom-Navbar'

const Account = () => {

    useEffect(() => {
        //load user account form with existing user data
    }, [])

    return (
        <div className="container-fluid search-bg vh-100">
            <CustomNavbar />

        </div>
    )
}

export default Account