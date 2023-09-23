import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import magGlass from '../images/smartfilter128.png'
import logoutIcon from '../images/logout.png'
import '../styles/search.css'
import logout from '../functions/logout'
import { useNavigate } from 'react-router-dom'

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />


const CustomNavbar = () => {

  const navigate = useNavigate()

  return (
    <div className="row">
      <Navbar className="navbar-bg custom-mb-5" data-bs-theme="dark">
        <Navbar.Brand className="col-5 mx-3">
          <img src={magGlass} alt="magGlass" className="magGlass-nav ms-5 me-2" />
          Gmail AI SmartFilter
        </Navbar.Brand>
        <Nav className="me-auto ms-2">
          <Nav.Link href="/history">History</Nav.Link>
          <Nav.Link href="/search">Search</Nav.Link>
          <Nav.Link href="/account">Account</Nav.Link>
        </Nav>
        <div className="col-xs-1 d-flex" style={{ outline: "0px solid red", marginTop:"0.4%"}}>
          <a href="https://www.buymeacoffee.com/MufuT" target="_blank">
            <img style={{ height: "85%", width: "auto" }} src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=MufuT&button_colour=8d8d8b&font_colour=000000&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" />
          </a>
        </div>
        <div className="col-xs-1 d-flex me-3" style={{ outline: "0px solid red" }}>
          <button className=" btn btn-danger" onClick={() => logout(navigate)}>Logout<img src={logoutIcon} alt="logout" className="logout-nav ms-2" /></button>
        </div>
      </Navbar>

    </div>
  )
}

export default CustomNavbar