import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import Landing from './containers/Landing';
import RegisStudent from './containers/register/RegisStudent';
import RegisInstr from './containers/register/RegisInstr';
import StudentDashboard from './containers/StudentDashboard';
import StudentClass from './containers/StudentClass';
import InstructorDashboard from './containers/InstructorDashboard';
import CreateClass from './containers/CreateClass';
import CreateQuiz from './containers/CreateQuiz';
import EnrollClass from './containers/EnrollClass';
import SpecificInstructorClass from './containers/SpecificInstructorClass'
import PendingQuizzes from './containers/PendingQuizzes'
import Settings from './containers/Settings'
import StudentQuizzes from './containers/StudentQuizzes'
import StudentQuiz from './containers/StudentQuiz'


/*
    TODO: Need to link following pages to sidebar
    past quizzes page for instructor (virgil) /instructor/quizzes/:userid/:classid
    specific past quiz page for instructor (virgil) /instructor/quiz/:userid/:classid/:quizid

    specific past quiz page for student (angela) /student/quiz/:userid/:classid/:quizid

*/

ReactDOM.render(
    <Router>
        <Switch>

            <Route path="/" exact={true} component={Landing}/>
            <Route path="/register/student" exact={true} component={RegisStudent}/>
            <Route path="/register/instructor" exact={true} component={RegisInstr}/>
            <Route path='/student/class/:userid/:classid' exact={true} component={StudentClass} /> 
            <Route path="/instructor/class/:userid/:classid" exact={true} component={SpecificInstructorClass} />
            <Route path="/instructor/createclass/:userid" exact={true} component={CreateClass} />
            <Route path="/instructor/createquiz/:userid/:classid" exact={true} component={CreateQuiz} />
            <Route path="/instructor/pendingquizzes/:userid/:classid" exact={true} component={PendingQuizzes} />
            <Route path="/student/quizzes/:userid/:classid" exact={true} component={StudentQuizzes} />
            <Route path="/student/quiz/:userid/:classid/:quizid" exact={true} component={StudentQuiz} />
            <Route path="/student/enroll/:userid" exact={true} component={EnrollClass} />
            <Route path="/instructor/settings/:userid" exact={true} component={Settings} />
            <Route path="/student/settings/:userid" exact={true} component={Settings} />
            <Route path="/student/:userid" exact={true} component={StudentDashboard} />
            <Route path="/instructor/:userid" exact={true} component={InstructorDashboard} />
        </Switch>
    </Router>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
