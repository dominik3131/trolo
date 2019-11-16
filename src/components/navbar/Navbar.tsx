import React, { Component } from "react";
import '../app/App.css';
import {Navbar as NavBarBoot, Nav, NavItem,Form,FormControl,Button,NavDropdown} from 'react-bootstrap';

class Navbar extends Component {

  loginPage() {

  }

  render() {
    return (
        <React.Fragment>
            <NavBarBoot collapseOnSelect expand="lg" bg="dark" variant="dark">
            <a className="navbar-brand" href="/">
                <h2><span className="badge badge-primary">Trollo</span></h2>
            </a> 
            <NavBarBoot.Toggle aria-controls="responsive-navbar-nav" />
                <NavBarBoot.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/">Tables</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title={
                            <a href="#" id="imageDropdown" data-toggle="dropdown">
                                <img src="https://img.icons8.com/bubbles/50/000000/user.png"/>
                            </a>
                            }
                            id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                            <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                            <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </NavBarBoot.Collapse>
            </NavBarBoot>
        </React.Fragment>
    );
  }
}
 
export default Navbar;