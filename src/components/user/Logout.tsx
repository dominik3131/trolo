import React, {Component}  from "react";
import { Redirect } from "react-router";
import axios from 'axios';

class Logout extends Component {
    logout() {
        axios.post(`/api/logout/`)
            .then( () => {
                localStorage.removeItem("user_token")
            })
            .catch((error: { response: any; request: any; message: any; config: any; }) => {
                if (error.response) {
                    alert(error.response);
                } else if (error.request) {
                    alert(error.request);
                } else {
                    alert('Error'+ error.message);
                }
            });
    }

    render() {
        this.logout()
        return <Redirect to='/login'/>;
    }
}
export default Logout;