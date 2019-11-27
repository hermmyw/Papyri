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
import ShowClasses from './containers/ShowClasses';
import CreateClass from './containers/CreateClass';
import CreateQuiz from './containers/CreateQuiz';
import TakeAttendance from './containers/TakeAttendance';
import EnrollClass from './containers/EnrollClass';
import SpecificInstructorClass from './containers/SpecificInstructorClass'
import CurrentQuizzes from './containers/CurrentQuizzes'


/*
    specific quiz for instructor -> /instructor/quiz/:quizID
    specific quiz for student -> /student/quiz/:quizID
    
    /student/class -> /student/:userID/:classID
    /instructor/class -> /instructor/:userID/:classID
    /instructor/createclass -> /createclass/:userID
    /instructor/createquiz -> /createquiz/:userID/:classID
    /student/enroll -> /enroll/:userID

*/

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/" exact={true} component={Landing}/>
            <Route path="/register/student" exact={true} component={RegisStudent}/>
            <Route path="/register/instructor" exact={true} component={RegisInstr}/>
            <Route path='/student/class' exact={true} component={StudentClass} /> 
            <Route path="/instructor/class" exact={true} component={SpecificInstructorClass} />
            <Route path="/instructor/createclass" exact={true} component={CreateClass} />
            <Route path="/instructor/createquiz" exact={true} component={CreateQuiz} />
            <Route path="/student/enroll" exact={true} component={EnrollClass} />
            <Route path="/student/:userid" exact={true} component={StudentDashboard} />
            <Route path="/instructor/:userid" exact={true} component={InstructorDashboard} />
        </Switch>
    </Router>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
