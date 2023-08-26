import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React, { Navigate, useRef, useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import axios from 'axios'
import magGlass from '../smartfilter128.png';
import aiLogo from '../ai-logo.png'
import filterIcon from '../filter-icon.png'
import '../styles/search.css';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';



const Search = () => {
    const searchInput = useRef(null);
    const navigate = useNavigate();

    const [showFilterForm, setShowFilterForm] = useState(false);

    const [selectedSender, setSelectedSender] = useState('');
    const [selectedBeforeDate, setSelectedBeforeDate] = useState('');
    const [selectedAfterDate, setSelectedAfterDate] = useState('');

    const [tempSelectedSender, setTempSelectedSender] = useState('');
    const [tempSelectedBeforeDate, setTempSelectedBeforeDate] = useState('');
    const [tempSelectedAfterDate, setTempSelectedAfterDate] = useState('');

    const toggleFilterForm = (sender, beforeDate, afterDate) => {
        setTempSelectedSender(sender)
        setTempSelectedBeforeDate(beforeDate)
        setTempSelectedAfterDate(afterDate)
        setShowFilterForm(!showFilterForm);
    };

    const applyFilters = () => {
        // Construct your API call with selectedSender, selectedBeforeDate, and selectedAfterDate
        // Hide the form after applying filters
        setShowFilterForm(false);
        // Trigger your API call
    };

    const applyFilterss = (sender, beforeDate, afterDate) => {
        setSelectedSender(sender)
        setSelectedBeforeDate(beforeDate)
        setSelectedAfterDate(afterDate)
        setShowFilterForm(false);
    }


    const handleSearch = () => {
        const query = searchInput.current.value.trim()
        const sender = selectedSender;
        const before = selectedBeforeDate
        const after = selectedAfterDate
        //const senderAddress = document.getElementById('sender-input').value.trim() //add to filter button
        //const range = { before: 'unixTimestamp', after: 'unixTimestamp' } //add to filter button

        if (!query) return

        navigate(`/search/results?query=${encodeURIComponent(query)}&sender=${encodeURIComponent(sender)}&before=${before}&after=${after}`);

    };


    // put this inside of searchResults component before api call is made

    // const searchParams =
    // {
    //     query: document.getElementById('search-input').value,
    //     senderAddress: document.getElementById('sender-input').value,
    //     range: {
    //         before: unixTimestamp,
    //         after: unixTimestamp
    //     }
    //     OR
    //     range: range
    // }

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container-fluid vh-100 search-bg" >
            <div className="row" >
                <Navbar className="navbar-bg custom-mb-5" data-bs-theme="dark" >
                    <Navbar.Brand className="col-5 mx-3">
                        <img src={magGlass} alt="magGlass" className="magGlass-nav ms-5 me-2" />
                        Gmail AI SmartFilter
                    </Navbar.Brand>
                    <Nav className="me-auto ms-4" >
                        <Nav.Link href="/history">History</Nav.Link>
                        <Nav.Link href="/search">Search</Nav.Link>
                        <Nav.Link href="/account">Account</Nav.Link>
                    </Nav>
                </Navbar>
            </div>

            <div className="row">
                <div className="col" style={{ backgroundColor: '#202124', minHeight: '100px' }}></div>
            </div>


            <div className="row justify-content-center search-bg">
                <div className="col-md-6 mt-5"  >
                    <img src={aiLogo} alt="Logo" className="logo-image" />
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control search-input"
                            ref={searchInput}
                            placeholder="Search Gmail"
                            aria-label="Search Gmail"
                            aria-describedby="search-button"
                            onKeyDown={handleKeyPress}
                        />
                        <button className="btn" type="button" onClick={handleSearch}>
                            <img src={magGlass} alt="Button" className="magGlass-search-bar"/>
                        </button>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center search-bg" >

                <div className="col-md-6">
                    <button className="btn" type="button"
                        onClick={() => toggleFilterForm(selectedSender, selectedBeforeDate, selectedAfterDate)}
                    >
                        <img src={filterIcon} alt="filter icon" className="filter-icon " />
                    </button>
                </div>

                {showFilterForm && (
                    <div className="modal popup-below" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Filter Options</h5>
                                    <button type="button" className="close"
                                        onClick={() => toggleFilterForm(selectedSender, selectedBeforeDate, selectedAfterDate)}
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="sender" className="form-label">Sender Email Address:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="sender"
                                                value={tempSelectedSender}
                                                onChange={e => setTempSelectedSender(e.target.value)}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="mb-3">
                                                    <label htmlFor="beforeDate" className="form-label">Sent Before:</label>
                                                    <DatePicker
                                                        selected={tempSelectedBeforeDate}
                                                        onChange={date => setTempSelectedBeforeDate(date)}
                                                        className="form-control"
                                                        id="beforeDate"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="mb-3">
                                                    <label htmlFor="afterDate" className="form-label">Sent After: </label>
                                                    <DatePicker
                                                        selected={tempSelectedAfterDate}
                                                        onChange={date => setTempSelectedAfterDate(date)}
                                                        className="form-control"
                                                        id="afterDate"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Add date pickers for before and after dates */}
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary"
                                        onClick={() => toggleFilterForm(selectedSender, selectedBeforeDate, selectedAfterDate)}
                                    >Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary"
                                        onClick={() => applyFilterss(
                                            tempSelectedSender,
                                            tempSelectedBeforeDate,
                                            tempSelectedAfterDate)}
                                    > Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>




    )
}

export default Search;