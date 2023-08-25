import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React, { useRef, useEffect, useState } from 'react';
import { Nav, Navbar} from 'react-bootstrap';
import magGlass from '../smartfilter128.png';
import aiLogo from '../ai-logo.png'
import '../styles/search.css';



const Search = () => {
    const navbarRef = useRef(null); // Ref to the Navbar row element
    const blankRowRef = useRef(null); // Ref to the blank row element
    const [combinedRowHeight, setCombinedRowHeight] = useState(0);
  
    useEffect(() => {
      if (navbarRef.current && blankRowRef.current) {
        const totalHeight = navbarRef.current.clientHeight + blankRowRef.current.clientHeight;
        setCombinedRowHeight(totalHeight);
      }
    }, []);


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
                className="row justify-content-center  search-bg"
                style={{ minHeight: `calc(100vh - ${combinedRowHeight}px)` }}
            >
                <div className="col-md-6 mt-5" >
                    <img src={aiLogo} alt="Logo" className="logo-image" />
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search Gmail"
                            aria-label="Search Gmail"
                            aria-describedby="search-button"
                        />
                        <button className="btn" type="button">
                            <img src={magGlass} alt="Button" className="magGlass-search-bar" alignSelf="center" />
                        </button>
                    </div>
                </div>
            </div>
        </div>




    )
}

export default Search;