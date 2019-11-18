import React from "react";

import LoginPanel from "../user/LoginPanel";
import RegisterPanel from "../user/RegisterPanel";


const Login: React.FC = () => {
    return (
        <table style={{width: "100%", position: "relative"}}>
            <tr>
                <td><LoginPanel/></td>
                <td><RegisterPanel/></td>
            </tr>
        </table>
    )
};

export default Login;