import React from 'react';
import './App.css';
import Navbar from "../navbar/Navbar"
import Tables from "../tables/Tables";
import Login from "../user/Login"
import {Route, Switch} from 'react-router'
import Table from "../tables/Table";
import {Link} from "react-router-dom";

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
                </Switch>
            </div>
        </div>
    );
};

export default App;
