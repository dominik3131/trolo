import React, {Component}  from "react";
import {MDBContainer, MDBBtn, MDBCol, MDBRow} from 'mdbreact';
import UserModel from "../../data-models/UserModel";
import axios from 'axios';
import { Redirect } from "react-router";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

class Login extends Component {
    state = {
        username:"",
        password:"",
        redirect:false
    };

    constructor(props: Readonly<{}>) {
        super(props);
        this.loginUser = this.loginUser.bind(this);
    }

    loginUser() {
        let user = new UserModel();
        user.username = this.state.username;
        user.password = this.state.password;
        axios.post(`/api/login/`, {...user},{headers: {
            'Content-Type': 'application/json'
        }})
            .then( (response) => {
                localStorage.setItem("user_token", response.data.key);
                this.setState({redirect: true})
            })
            .catch((error: { response: any; request: any; message: any; config: any; }) => {
                if (error.response) {
                    this.forceUpdate()
                } else if (error.request) {
                    alert(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    alert('Error'+ error.message);
                }
            });

        this.setState({
           login:"",
           password:"" 
        })
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 7;
    }

    setLogin = (event: { target: { value: any; }; }) => {
        this.setState({username: event.target.value});
    };
    setPassword = (event: { target: { value: any; }; }) => {
        this.setState({password: event.target.value});
    };
    render() {
        if (this.state.redirect) {
            return <Redirect to='/tables/'/>;
        }

        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol>
                        <form style={{width: "80%",position: "relative"}}>
                            <p className="h5 text-center mb-4">Sign in</p>
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
                            </div>
                            <div className="text-center">
                                <MDBBtn id={'createButton'} onClick={this.loginUser} disabled={!this.validateForm()}
                                    color="primary">Sign in</MDBBtn>
                            </div>
                        </form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}

export default Login;