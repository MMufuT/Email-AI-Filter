import React, { useEffect } from "react";
import { Link } from 'react-router-dom';

const GoogleAPIPolicy = () => {

    useEffect(() => {
        document.title = "Google API Policy | Email AI Filter";
    }, []);

    return (
        <div style={{ padding: '10px' }}>
            <h1 style={{ marginBottom: '20px' }}>Google API Policy</h1>
            <h2>Purpose of Data Use</h2>
            <p>
                The Gmail AI Filter app uses the Gmail API read-only restricted scope to access and analyze
                the last 1,000 emails from your Gmail account. This access is crucial for converting email
                content into vectors stored in our database, enabling precise context-based searches.
            </p>

            <h2>Data Handling</h2>
            <p>
                The data retrieved, which includes the email subject, sender, and snippet of the body, is
                securely processed and stored in a MongoDB database. We take stringent measures to ensure
                the security and integrity of our database, so no third-party access is permitted beyond
                what is necessary for the app's functionality. Our storage solution is designed to maintain
                the confidentiality and resilience of your personal data. In accordance with Google's policies,
                our use and transfer of information received from Google APIs will adhere to the&nbsp;
                <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank">Google API
                Services User Data Policy</a>, including its Limited Use requirements.
            </p>

            <h2>AI Models</h2>
            <p>
                Third-party AI tools (<a href="https://openai.com/blog/introducing-text-and-code-embeddings" target="_blank">OpenAI API</a> and <a href="https://qdrant.tech/documentation/concepts/search/" target="_blank">Qdrant Vector Database</a>) are employed to serialize your emails into vectors, allowing for an
                advanced search using cosine similarity. These tools are <strong>essential</strong> to the app's core
                capabilities.
            </p>

            <h2>Privacy and Consent</h2>
            <p>
                Our commitment to your privacy is unwavering. As part of the consent process, we clearly
                outline data usage, ensuring transparency. Your consent is required for the app to function
                as it relies heavily on third-party AI models.
            </p>

            <h2>Opt-Out</h2>
            <p>
                At any time, you retain the right to revoke your consent. If you decide that you no longer
                wish to use our app, you can easily delete your account via the account settings page on our
                website. Upon account deletion, all associated data will be removed from our system, and
                access to your Gmail data will cease.
            </p>

            <h2>Further Questions</h2>
            <p>
                If you have any concerns or queries about how your data is used, please email us at&nbsp;
                <a href="mailto:mmt108@case.edu" target="_blank">mmt108@case.edu</a>.
                We are here to ensure that your experience with Gmail AI Filter is secure, private, and
                transparent.
            </p>
        </div>
    );
}

export default GoogleAPIPolicy;
