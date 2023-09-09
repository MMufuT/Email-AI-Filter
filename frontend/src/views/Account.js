import React, { useState, useEffect } from 'react';
import CustomNavbar from '../components/Custom-Navbar'

const Account = () => {

    useEffect(() => {
        //load user account form with existing user data
    }, [])

    return (
        <div className="container-fluid search-bg vh-100">
            <CustomNavbar />
            <div className="row justify-content-center align-items-center mt-5">

                <form className="col-md-8 "
                    style={{
                        backgroundColor: '#202124', // Light gray background for the form
                        padding: '20px',
                        border: '2px solid #4A4949', // Light gray border
                        borderRadius: '5px', // Rounded corners
                    }}>

        </form>
            </div>

        </div >
    )
}

export default Account