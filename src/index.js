import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import Landing from './containers/Landing';
import RegisStudent from './containers/register/RegisStudent';
import RegisInstr from './containers/register/RegisInstr';

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/" exact={true} component={Landing}/>
            <Route path="/register/student" exact={true} component={RegisStudent}/>
            <Route path="/register/instructor" exact={true} component={RegisInstr}/>
        </Switch>
    </Router>, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
