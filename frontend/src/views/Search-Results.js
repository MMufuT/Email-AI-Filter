import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import magGlass from '../images/smartfilter128.png';
import axios from 'axios'
import { Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import aiLogo from '../images/ai-logo.png'
import filterIcon from '../images/filter-icon.png'
import convertStringToUnixTimestamp from '../functions/string-to-unix';
import handleSearch from '../functions/handle-search';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/search-results.css'


const SearchResults = () => {
  const searchInput = useRef(null);
  const navigate = useNavigate()
  const location = useLocation();
  const tempParam = new URLSearchParams(location.search)
  const pageQuery = tempParam.get('query')

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

  const applyFilters = (sender, beforeDate, afterDate) => {
    setSelectedSender(sender)
    setSelectedBeforeDate(beforeDate)
    setSelectedAfterDate(afterDate)
    setShowFilterForm(false);
  }

  const [results, setResults] = useState([]);



  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleSearch(
        navigate,
        searchInput.current.value.trim(),
        selectedSender,
        selectedBeforeDate,
        selectedAfterDate
      )
    }
  };

  useEffect(() => {

    const checkStatus = (async () => {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/login-status`, { withCredentials: true })
        .then((response) => {
          // If user is authorized (logged in), no action needed
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            // If user is unauthorized (not logged in), redirect to Google OAuth login
            window.location.href = process.env.REACT_APP_GOOGLE_OAUTH_LOGIN_URL;
          }
        });

      await axios.get(`${process.env.REACT_APP_SERVER_URL}/onboarding/onboarded-status`, { withCredentials: true })
        .then((response) => {
          if (!response.data.onboarded) {
            // redirects if user is already onboarded
            navigate('/onboarding/form')
          } else {

            const searchParams = new URLSearchParams(location.search);

            const searchConfig = {
              query: searchParams.get('query'),
              senderAddress: searchParams.get('sender'), // or specify an email address
              range: {
                before: convertStringToUnixTimestamp(searchParams.get('before')),
                after: convertStringToUnixTimestamp(searchParams.get('after'))
              }
            };

            axios.post(`${process.env.REACT_APP_SERVER_URL}/search`, searchConfig, { withCredentials: true })
              .then((response) => {
                setResults(response.data.results)
                console.log(response)
              })
              .catch((error) => {
                console.log(error)
              });
          }
        })
        .catch((error) => {
          console.log(error)
        })
    });



    checkStatus()
  }, [location.search]);

  return (
    <div className="container-fluid search-bg">

      <div className="row" >
        <Navbar className="navbar-bg custom-mb-5" data-bs-theme="dark" >
          <Navbar.Brand className="col-5 mx-3">
            <img src={magGlass} alt="magGlass" className="magGlass-nav ms-5 me-2" />
            Gmail AI SmartFilter
          </Navbar.Brand>
          <Nav className="me-auto ms-2" >
            <Nav.Link href="/history">History</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/account">Account</Nav.Link>
          </Nav>
        </Navbar>
      </div>

      <div className="row justify-content-start search-bg" >

        <div className="col-md-6 mt-4 ms-3 d-flex align-items-center"  >
          <img src={aiLogo} alt="Logo" className="results-logo-image me-3" style={{ outline: "0px solid green" }} />
          <div className="input-group" style={{ outline: "0px solid red" }} >
            <input
              type="text"
              className="form-control search-input"
              ref={searchInput}
              placeholder="Search Gmail"
              aria-label="Search Gmail"
              aria-describedby="search-button"
              defaultValue={pageQuery}
              onKeyDown={handleKeyPress}
            />
            <button className="btn" type="button"
              onClick={() =>
                handleSearch(
                  navigate,
                  searchInput.current.value.trim(),
                  selectedSender,
                  selectedBeforeDate,
                  selectedAfterDate
                )}
            >
              <img src={magGlass} alt="Button" className="magGlass-search-bar" />
            </button>
          </div>
        </div>

        <div className="row justify-content-start search-bg" >

          <div className="col-md-2 mb-2 " style={{ outline: '0px solid red' }}>
            <button className="btn" type="button"
              onClick={() => toggleFilterForm(selectedSender, selectedBeforeDate, selectedAfterDate)}
            >
              <img src={filterIcon} alt="filter icon" className="results-filter-icon " />
            </button>
          </div>

          {showFilterForm && (
            <div className="modal results-filter-popup" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
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
                            <label htmlFor="afterDate" className="form-label">Sent After:</label>
                            <DatePicker
                              selected={tempSelectedAfterDate}
                              onChange={date => setTempSelectedAfterDate(date)}
                              className="form-control"
                              id="afterDate"
                            />
                          </div>
                        </div>
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

                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary"
                      onClick={() => toggleFilterForm(selectedSender, selectedBeforeDate, selectedAfterDate)}
                    >Cancel
                    </button>
                    <button type="button" className="btn btn-primary"
                      onClick={() => applyFilters(
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

          <div className="row justify-content-start search-bg">
            <div className="col-md-6">

                <text className="results-results-filter">Parameters:</text>
                <text className="results-results-filter">Parameters:</text>
                <text className="results-results-filter">Parameters:</text>
                <text className="results-results-filter">Parameters:</text>

              {/* Loop through search results */}
              {results.map((results, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  style={{ color: 'white' }}
                  onClick={() => window.open(results.emailLink, '_blank')}
                >
                  <h4>{results.subject}</h4>
                  <p>{results.sender}</p>
                  {/* You can add more properties from your JSON data here */}
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>


    </div>
  );


}

export default SearchResults
