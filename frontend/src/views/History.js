import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React, {useEffect, useState } from 'react';
import axios from 'axios'
import '../styles/history.css'
import CustomNavbar from '../components/Custom-Navbar';
import xImg from '../images/x.png'
import { deleteOneHistory, deleteAllHistory } from '../functions/delete-history';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate()

    const deleteHistory = (historyId) => {
        // Implement the deleteHistory function here
        // You can use this function to delete a history item by its ID
    };

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_URL}/history`, { withCredentials: true })
            .then((response) => {
                setHistory(response.data.searchHistory); // Assuming 'searchHistory' is the key in your response JSON
            })
            .catch((error) => {
                const errorMessage = error.response.data.mssg;
                
                if (errorMessage === "User is not onboarded") {
                    // If user is not onboarded, navigate to the onboarding form
                    navigate('/onboarding/form');
                  } else {
                    // If user is unauthorized (not logged in), redirect to Google OAuth login
                    window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL;
                  }
            });
    }, []);

    return (
        <div className="container-fluid search-bg vh-100">
            <CustomNavbar />
            <div className="row justify-content-center search-bg">
                <div className="col-md-4 mt-5">
                    <h1 className="mb-4" style={{ color: "white" }}>Search History</h1>
    
                    {history.map((item) => (
                        <div key={item._id} className="mb-5 history-item">
                            <div className="history-content">
                                <div className="searched-query">
                                    Searched for{" "}
                                    <a href={`/search/results?query=${encodeURIComponent(item.query)}`} style={{ color: "#57abf6" }}>
                                        {item.query}
                                    </a>
                                </div>
                                <div className="searched-time">
                                    Searched @ {new Date(item.updatedAt).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                    })}{" "}
                                    {" • • • "}
                                    {new Date(item.updatedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                            <div className="delete-one-button-container">
                                <button className="delete-one-button" onClick={() => deleteOneHistory(item._id, setHistory)}>
                                    <img src={xImg} alt="Delete" style={{ height: "20px"}} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    







};

export default History;






