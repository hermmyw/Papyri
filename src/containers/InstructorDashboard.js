import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import './Dashboard.css';
import Sidebar from '../components/Sidebar.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom";
import DayPicker from 'react-day-picker';


/**
 * Container for instructor dashboard
 */

class InstructorDashboard extends React.Component {
    
    /**
     * 
     * Constructor for the Instructor Dashboard
     * @param {array} props Properties that are passed into element when being used.
     */
    constructor(props) {
        super(props);
        this.getDashboard = this.getDashboard.bind(this);
    }

    componentDidMount() {
        console.log("mounting");
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    /**
     * Makes an http request to endpoint to retrieve information about attendance and quiz scores to display in the form of graphs
     */
    getDashboard() {

    }

    /**
     * renders the Instructor Dashboard view
     */
    render() {

        return (
            <div>
                <Sidebar view="dashboard" />
                <div className="main-area">
                    <p>Dashboard</p>
                </div>
            </div>
        )
    }
}

export default InstructorDashboard;