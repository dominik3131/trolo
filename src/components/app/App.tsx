import React from 'react';
import './App.css';
import Tables from "../tables/Tables";
import {Route, Switch} from 'react-router'
import Table from "../tables/Table";
import {Link} from "react-router-dom";

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="header">
                <Link to={{
                    pathname: `/`
                }}>
                    <h2 className="h2-responsive"><strong>Trolo</strong></h2>
                </Link>
            </div>
            <div className="content">
                <Switch>
                    <Route exact path="/" component={Tables}/>
                    <Route path="/tables/:id" component={Table}/>
                </Switch>
            </div>
        </div>
    );
};

export default App;
