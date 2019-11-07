import React from 'react';
import './App.css';
import Tables from "../tables/Tables";
import {Route, Switch} from 'react-router'

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="header">
                TROLO
            </div>
            <div className="content">
                <Switch>
                    <Route path="/tables" component={Tables}/>
                </Switch>
                <Tables></Tables>
            </div>
        </div>
    );
}

export default App;
