import React from 'react';
import './App.css';
import Tables from "../tables/Tables";
import {Route, Switch} from 'react-router'
import Table from "../tables/Table";

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="header">
                TROLO
            </div>
            <div className="content">
                <Switch>
                    <Route exact path="/" component={Tables}/>
                    <Route path="/table/:id" component={Table}/>
                </Switch>
            </div>
        </div>
    );
}

export default App;
