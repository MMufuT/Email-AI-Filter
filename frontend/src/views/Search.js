import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React, {useRef, useEffect, useState } from 'react';
import magGlass from '../images/smartfilter128.png';
import aiLogo from '../images/ai-logo.png'
import filterIcon from '../images/filter-icon.png'
import '../styles/search.css';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import searchRedirect from '../functions/search-redirect'
import checkLoginStatus from '../functions/login-status';
import CustomNavbar from '../components/Custom-Navbar';
import FilterModal from '../components/Filter-Modal';


const Search = () => {
    const navigate = useNavigate();
    const searchInput = useRef(null);

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

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            searchRedirect(
                navigate,
                searchInput.current.value.trim(),
                selectedSender,
                selectedBeforeDate,
                selectedAfterDate
            );
        }
    };

    useEffect(() => {
        checkLoginStatus(navigate)
    })

    return (
        <div className="container-fluid vh-100 search-bg" >
            <CustomNavbar />

            <div className="row">
                <div className="col" style={{ backgroundColor: '#202124', minHeight: '100px' }}></div>
            </div>


            <div className="row justify-content-center search-bg">
                <div className="col-md-6 mt-5"  >
                    <img src={aiLogo} alt="Logo" className="search-logo-image" />
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
                        <button className="btn" type="button"
                            onClick={() => searchRedirect(
                                navigate,
                                searchInput.current.value.trim(),
                                selectedSender,
                                selectedBeforeDate,
                                selectedAfterDate)}
                        >
                            <img src={magGlass} alt="Button" className="magGlass-search-bar" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center search-bg" >

                <div className="col-md-6">
                    <button className="btn" type="button"
                        onClick={() => toggleFilterForm(selectedSender, selectedBeforeDate, selectedAfterDate)}
                    >
                        <img src={filterIcon} alt="filter icon" className="search-filter-icon " />
                    </button>
                </div>

                <FilterModal
                    modalClassName="search-filter-popup"
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
            </div>
        </div>




    )
}

export default Search;