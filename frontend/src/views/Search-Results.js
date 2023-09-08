import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import magGlass from '../images/smartfilter128.png';
import { useNavigate } from 'react-router-dom';
import aiLogo from '../images/ai-logo.png'
import filterIcon from '../images/filter-icon.png'
import searchRedirect from '../functions/search-redirect';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/search-results.css'
import CustomNavbar from '../components/Custom-Navbar'
import searchCall from '../functions/search-call'
import FilterModal from '../components/Filter-Modal';


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
  const [searchConfig, setSearchConfig] = useState({});

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      searchRedirect(
        navigate,
        searchInput.current.value.trim(),
        selectedSender,
        selectedBeforeDate,
        selectedAfterDate
      )
      setTempSelectedSender('');
      setTempSelectedBeforeDate('');
      setTempSelectedAfterDate('');
    }
  };

  useEffect(() => {
    searchCall(navigate, location, setResults, setSearchConfig)
  }, [location.search, navigate]);

  return (
    <div className="container-fluid search-bg vh-100">

      <CustomNavbar />
      <div className="row justify-content-start search-bg" >

        <div className="col-md-6 mt-4 ms-3 d-flex align-items-center"  >
          <img src={aiLogo} alt="Logo" className="results-logo-image me-3"/>
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
              onClick={() => {
                searchRedirect(
                  navigate,
                  searchInput.current.value.trim(),
                  selectedSender,
                  selectedBeforeDate,
                  selectedAfterDate
                )
                setTempSelectedSender('');
                setTempSelectedBeforeDate('');
                setTempSelectedAfterDate('');
              }}
            >
              <img src={magGlass} alt="Button" className="magGlass-search-bar" />
            </button>
          </div>
        </div>

        <div className="row justify-content-start search-bg" >

          <div className="col-md-2" style={{ outline: '0px solid red' }}>
            <button className="btn" type="button"
              onClick={() => toggleFilterForm(selectedSender, selectedBeforeDate, selectedAfterDate)}
            >
              <img src={filterIcon} alt="filter icon" className="results-filter-icon " />
            </button>
          </div>

          <FilterModal
            modalClassName="results-filter-popup"
            showFilterForm={showFilterForm}
            toggleFilterForm={toggleFilterForm}
            selectedSender={selectedSender}
            selectedBeforeDate={selectedBeforeDate}
            selectedAfterDate={selectedAfterDate}
            tempSelectedSender={tempSelectedSender}
            setTempSelectedSender={setTempSelectedSender}
            tempSelectedBeforeDate={tempSelectedBeforeDate}
            setTempSelectedBeforeDate={setTempSelectedBeforeDate}
            tempSelectedAfterDate={tempSelectedAfterDate}
            setTempSelectedAfterDate={setTempSelectedAfterDate}
            applyFilters={applyFilters}
          />

          <div className="row justify-content-start search-bg">
            <div className="col-md-6">


              <div className="mb-3">
                {searchConfig.query && (
                  <>
                    <span className="results-results-filter"><em>Query: {searchConfig.query}</em></span><br />
                  </>
                )}
                {searchConfig.senderAddress && (
                  <>
                    <span className="results-results-filter"><em>Sender: {searchConfig.senderAddress}</em></span><br />
                  </>
                )}
                {searchConfig.range && searchConfig.range.after && (
                  <>
                    <span className="results-results-filter"><em>After: {searchConfig.range.after}</em></span><br />
                  </>
                )}
                {searchConfig.range && searchConfig.range.before && (
                  <>
                    <span className="results-results-filter"><em>Before: {searchConfig.range.before}</em></span><br />
                  </>
                )}
              </div>



              {/* Loop through search results */}
              {results.map((result, index) => (
                <div
                  key={index}
                  className="search-result-item mb-3"
                  style={{ color: 'white' }}
                >
                  <div className="sender">{result.sender}</div>
                  <a href={result.emailLink} className="subject">
                    {result.subject}
                  </a>
                  <div className="email-body">{result.body}</div>
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
