import React, { Component } from "react";
import '../app/App.css';
import Login from "../user/Login"
import {Route, Redirect} from 'react-router'
import {Link} from "react-router-dom";

class Navbar extends Component {

  loginPage() {

  }

  render() {
    return (
        <React.Fragment>
            <nav className="navbar navbar-dark bg-dark mb-3">

                <a className="navbar-brand" href="/">
                    <h2><span className="badge badge-primary">Trollo</span></h2>
                </a> 

                <a href="/login">
                    <img src="https://img.icons8.com/bubbles/50/000000/user.png"/>
                </a>
            </nav>
      </React.Fragment>
    );
  }
}
 
export default Navbar;