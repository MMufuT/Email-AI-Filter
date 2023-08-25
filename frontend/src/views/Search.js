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



const Search = () => {
    const navbarRef = useRef(null); // Ref to the Navbar row element
    const searchInput = useRef(null);
    const blankRowRef = useRef(null); // Ref to the blank row element
    const searchRowRef = useRef(null)
    const [combinedRowHeight, setCombinedRowHeight] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (navbarRef.current && blankRowRef.current && searchRowRef.current) {
            const totalHeight = navbarRef.current.clientHeight + blankRowRef.current.clientHeight + searchRowRef.current.clientHeight;
            setCombinedRowHeight(totalHeight);
        }
    }, []);

    const handleSearch = () => {
        const query = searchInput.current.value.trim()
        //const senderAddress = document.getElementById('sender-input').value.trim() //add to filter button
        //const range = { before: 'unixTimestamp', after: 'unixTimestamp' } //add to filter button

        if (!query) return

        navigate(`/search/results?query=${encodeURIComponent(query)}&sender=${encodeURIComponent('hello')}&before=${'hello'}&after=${'hello'}`);

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
        <div className="container-fluid" >
            <div className="row" ref={navbarRef}  >
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

            <div className="row" ref={blankRowRef}>
                <div className="col" style={{ backgroundColor: '#202124', minHeight: '100px' }}></div>
            </div>


            <div
                className="row justify-content-center search-bg"
                ref={searchRowRef}
            // style={{ minHeight: `calc(100vh - ${combinedRowHeight}px)` }}
            // add this element to combined row height in next row
            >
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
                            <img src={magGlass} alt="Button" className="magGlass-search-bar" alignSelf="center" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center search-bg" style={{ minHeight: `calc(100vh - ${combinedRowHeight}px)`}} >

                <div className="col-md-6 " style={{ outline: "0px solid red" }} >
                    <button className="btn" type="button">
                        <img src={filterIcon} alt="filter icon" className="filter-icon " />
                    </button>
                </div>


            </div>
        </div>




    )
}

export default Search;