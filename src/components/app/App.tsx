import React from 'react';
import './App.css';
import Navbar from "../navbar/Navbar"
import Tables from "../tables/Tables";
import Login from "../user/Login"
import Logout from "../user/Logout"
import {Route, Switch} from 'react-router'
import Table from "../tables/Table";

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="header">
                <Navbar></Navbar>
            </div>
            <div className="content">
                <Switch>
                    <Route exact path="/" component={Tables}/>
                    <Route path="/tables/:id" component={Table}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/logout" component={Logout}/>
                </Switch>
            </div>
        </div>
    );
};

export default App;
