import React, {Component}  from "react";
import {MDBContainer, MDBBtn, MDBCol, MDBRow} from 'mdbreact';
import UserModel from "../../data-models/UserModel";
import axios from 'axios';
import { Redirect } from "react-router";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

class Register extends Component {
    state = {
        username:"",
        password:"",
        rep_pass:"",
    }

    constructor(props: Readonly<{}>) {
        super(props);
        this.registerUser = this.registerUser.bind(this);
    }

    registerUser() {
        let user = new UserModel();
        user.username = this.state.username;
        user.password = this.state.password;
        axios.post(`/api/users/create/`, {...user},{headers: {
            'Content-Type': 'application/json'
        }})
            .then(() => {
                this.handleRegisterAction();
            }).catch((error: { response: any; request: any; message: any; config: any; }) => {
                if (error.response) {
                    alert(error.response.data);
                } else if (error.request) {
                    alert(error.request);
                } else {
                    alert('Error'+ error.message);
                }});

        this.setState({
           login:"",
           password:"" 
        })
    }

    handleRegisterAction() {

    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0 && this.state.password === this.state.rep_pass;
    }

    setLogin = (event: { target: { value: any; }; }) => {
        this.setState({username: event.target.value});
    };
    setPassword = (event: { target: { value: any; }; }) => {
        this.setState({password: event.target.value});
    };

    setRepPass = (event: { target: { value: any; }; }) => {
        this.setState({rep_pass: event.target.value});
    };



    render() {
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol>
                        <form style={{width: "80%",position: "relative"}}>
                            <p className="h5 text-center mb-4">Register</p>
                            <div className="grey-text">
                                <label htmlFor="formLoginLogin" className="grey-text">
                                    Your login
                                </label>
                                <input
                                    type="text"
                                    id="formLoginLogin"
                                    className="form-control"
                                    onChange={this.setLogin}
                                />

                                <label htmlFor="formLoginPassword" className="grey-text">
                                    Your password
                                </label>
                                <input
                                    type="password"
                                    id="formLoginPassword"
                                    className="form-control"
                                    onChange={this.setPassword}

                                />

                                <label htmlFor="formLoginRepPassword" className="grey-text">
                                    Repeat password
                                </label>
                                <input
                                    type="password"
                                    id="formLoginRepPassword"
                                    className="form-control"
                                    onChange={this.setRepPass}

                                />
                            </div>
                            <div className="text-center">
                                <MDBBtn id={'createButton'} onClick={this.registerUser} disabled={!this.validateForm()}
                                    color="primary">Register</MDBBtn>
                            </div>
                        </form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

export default Register;