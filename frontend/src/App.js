import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

//Pages
import Home from './views/Home.js'
import OnboardingLoading from './views/Onboarding-Loading'
import OnboardingForm from './views/Onboarding-Form'
import Search from './views/Search'
import SearchResults from './views/Search-Results'
import History from './views/History'
import Account from './views/Account'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding/loading" element={<OnboardingLoading />} />
        <Route path="/onboarding/form" element={<OnboardingForm />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/results" element={<SearchResults />} />
        <Route path="/history" element={<History />} />
        <Route path="/account" element={<Account />} />
      </Routes> 
    </Router>
  )
}

export default App
