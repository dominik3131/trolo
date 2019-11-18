import React, {Component} from 'react';
import '../app/App.css';
import {Navbar as NavBarBoot, Nav, NavDropdown} from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";
import {Link} from "react-router-dom";

class Navbar extends Component {
    dropdown() {
        const isLogged = localStorage.getItem('user_token') != null;
        if (isLogged) {
            return <NavDropdown title={
                <img id="imageDropdown" data-toggle="dropdown"
                     src="https://img.icons8.com/bubbles/50/000000/user.png" alt="user"/>
            }
                                id="collasible-nav-dropdown"><LinkContainer to="/profile">
                <NavDropdown.Item>
                    Profile
                </NavDropdown.Item>
            </LinkContainer>
                <LinkContainer to="/settings">
                    <NavDropdown.Item>
                        Settings
                    </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider/>
                <LinkContainer to="/logout">
                    <NavDropdown.Item>
                        Logout
                    </NavDropdown.Item>
                </LinkContainer>
            </NavDropdown>
        } else {
            return null;
        }
    }

    render() {
        return (
            <React.Fragment>
                <NavBarBoot collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Link to={{pathname: `/`}}>
                        <h2><span className="badge badge-primary">Trollo</span></h2>
                    </Link>
                    <NavBarBoot.Toggle aria-controls="responsive-navbar-nav"/>
                    <NavBarBoot.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <LinkContainer to="/">
                                <Nav.Link>Tables</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav>

                            {this.dropdown()}

                        </Nav>
                    </NavBarBoot.Collapse>
                </NavBarBoot>
            </React.Fragment>
        );
    }
}

export default Navbar;