import React from 'react';
import './App.css';
import Navbar from "../navbar/Navbar"
import Tables from "../tables/Tables";
import Login from "../user/Login"
import Logout from "../user/Logout"
import {Route, Switch,Redirect} from 'react-router'
import Table from "../tables/Table";
import SharedCard from "../cards/SharedCard";

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="header">
                <Navbar/>
            </div>
            <div className="content">
                <Switch>
                    {redirectToLogin()}
                    <Route exact path="/tables" component={Tables}/>
                    <Route path="/tables/:id" component={Table}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/card/:id" component={SharedCard}/>
                    {/*<Route path="/settings" component={}/>*/}
                    {/*<Route path="/profile" component={}/>*/}
                </Switch>
            </div>
        </div>
    );
};

function redirectToLogin() {
    const isLogged = localStorage.getItem('user_token')!=null;
    if(isLogged){
        return <Route exact path="/" component={Tables}/>
    }else{
        return [<Route exact path="/" component={Login}/>,<Redirect to="/" />]

    }
}


export default App;
