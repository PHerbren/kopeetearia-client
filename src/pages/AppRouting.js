import React from 'react';
import Menu from './Menu';
import Home from './Home';
import Login from './Login';
import Navbar from '../components/Navbar';
import Admin from './Admin';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function AppRouting(props) {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/menu' component={Menu} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/admin' component={Admin} />
            </Switch>
        </Router>
    );
}

export default AppRouting;
