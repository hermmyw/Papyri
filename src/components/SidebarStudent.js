import React from 'react';
import { SelectedButton, NonselectedButton } from './UI/SidebarComponents.js';
import headshot from '../containers/images/headshot.png';
import Button from 'react-bootstrap/Button';
import './UI/UI.css';
import { withRouter} from 'react-router-dom';
import * as docCookies from 'doc-cookies';

// dummy user, class, and quiz id
var ids = {
    userid: 12345,
    classid: 12345,
    quizid: 12345
}

/**
 * Renders a sidebar for all the different pages on the User interface.
 */
class SidebarStudent extends React.Component {

    /**
     * Constructor for Sidebar component.
     * Sets the view state based on value passed into props.
     * Renders differently depending on whether user is Instructor or Student.
     * @param {array} props Properties that are passed into element when being used.
     */
    constructor(props) {
        super(props);
        this.handleClassHome = this.handleClassHome.bind(this);
        this.handleQuizzes = this.handleQuizzes.bind(this);
        this.handleSettings = this.handleSettings.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.getNavButtons = this.getNavButtons.bind(this);

        this.state = { 
            view: this.props.view,
            profilePic: this.props.profilePic
        };

    }

    componentDidMount() {
        console.log("mounting");
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    /**
     * Event handler for when user clicks on 'Class Home' button.
     * Changes button selection on sidebar and redirects to page showing stats for particular class
     */
    handleClassHome() {
        let path = `/student/class/${ids.userid}/${ids.classid}`;
        this.props.history.push(path);
    }

    /**
     * Event handler for when user clicks on 'Past Quizzes' button.
     * Changes button selection on sidebar and redirects to page showing list of past quizzes
     */
    handleQuizzes() {
        let path = `/student/quizzes/${ids.userid}/${ids.classid}`;
        this.props.history.push(path);
    }

    /**
     * Event handler for when user clicks on setting button.
     * Changes button selection on sidebar and redirects to account setting page.
     */
    handleSettings() {
        let path = `/student/settings/${ids.userid}`;
        this.props.history.push(path);
    }

    handleLogout() {
        console.log("logging out");

        const promise = new Promise(() => {
            if (docCookies.hasItem('token')) {
                console.log("removing token");
                docCookies.removeItem('token', '/');
                localStorage.clear();
            }
        });

        promise.then(this.props.history.push('/'));
    }

    /**
     * Renders the sidebar based on state of sidebar so that correct button is selected.
     */
    getNavButtons() {
        switch(this.state.view) {

            case "class home":
                return (
                    <div>
                        <SelectedButton>Class Home</SelectedButton>
                        <NonselectedButton onClick={this.handleQuizzes}>Quizzes</NonselectedButton>
                        <NonselectedButton onClick={this.handleSettings}>Settings</NonselectedButton>
                        <NonselectedButton onClick={this.handleLogout}>Log Out</NonselectedButton>
                    </div>
                )  
                
            case "student quizzes":
                return (
                    <div>
                        <NonselectedButton onClick={this.handleClassHome.bind(this)}>Class Home</NonselectedButton>
                        <SelectedButton>Quizzes</SelectedButton>
                        <NonselectedButton onClick={this.handleSettings}>Settings</NonselectedButton>
                        <NonselectedButton onClick={this.handleLogout}>Log Out</NonselectedButton>
                    </div>
                )
            
            case "settings":
                return (
                    <div>
                        <NonselectedButton onClick={this.handleClassHome.bind(this)}>Class Home</NonselectedButton>
                        <NonselectedButton onClick={this.handleQuizzes}>Quizzes</NonselectedButton>
                        <SelectedButton>Settings</SelectedButton>
                        <NonselectedButton onClick={this.handleLogout}>Log Out</NonselectedButton>
                    </div>
                )
            
            default:
                return (<div></div>);
        }
    }

    render() {
        console.log("profile pic", this.props.profilePic);
        var studentName = localStorage.getItem('firstName') + " " + localStorage.getItem('lastName');
        return (
            <div className="dashboard-sidebar">
                <img className="profile-image" src={this.props.profilePic} />
                <SelectedButton style="margin-top: 20px">{studentName}</SelectedButton>
                {this.getNavButtons()}
            </div>
        )
    }

}

SidebarStudent.defaultProps = {
    profilePic: headshot
}

var SidebarRouterStudent = withRouter(SidebarStudent)
export default SidebarRouterStudent;