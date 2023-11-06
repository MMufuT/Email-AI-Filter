import React, { useEffect } from "react"
import { Link } from 'react-router-dom';

const GoogleAPIPolicy = () => {

    useEffect(() => {
        document.title = "Google API Policy | Email AI Filter"
    }, [])

    return (
        <div style={{ padding: '10px' }}>
            <h1 style={{marginBottom: '20px' }}>Google API Policy</h1>
            <p>
                "Email AI Filter" complies with the&nbsp;
                <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
                    Google API Services User Data Policy
                </a>, including Limited Use. We only use Gmail data (read-only) to enhance search functionality.
            </p>
        </div>
    )
}

export default GoogleAPIPolicy;