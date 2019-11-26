import React from 'react';
import { SelectedButton, NonselectedButton, BackButton } from './UI/SidebarComponents.js';
import headshot from '../containers/images/headshot.png';
import Button from 'react-bootstrap/Button';
import './UI/UI.css';
import { withRouter} from 'react-router-dom';
import * as docCookies from 'doc-cookies';

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
        this.handleShowDashboard = this.handleShowDashboard.bind(this);
        this.handleEnrollClass = this.handleEnrollClass.bind(this);
        this.handleForum = this.handleForum.bind(this);
        this.handleSetting = this.handleSetting.bind(this);
        this.getNavButtons = this.getNavButtons.bind(this);

        var viewProp = this.props.view;
        this.state = { view: viewProp };
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        console.log("mounting");
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    /**
     * Event handler for when user clicks on profile name.
     * Changes button selection on sidebar and redirects to dashboard page.
     */
    handleShowDashboard() {
        console.log("show student dashboard");
        this.setState(state => ({
            view: "dashboard"
        }));

        let path = '/student/dashboard';
        this.props.history.push(path);
    }

    /**
     * Event handler for when user clicks on create enroll class button.
     * Changes button selection on sidebar and redirects to form to enroll new class.
     */
    handleEnrollClass() {
        console.log("enroll class");
        this.setState(state => ({
            view: "enroll class"
        }));

        //let path = '/student/enrollclass';
        //this.props.history.push(path);
    }

    /**
     * Even handler for when user clicks on forum button.
     * Changes button selection on sidear and redirects to forum page.
     */
    handleForum() {
        console.log("forum");
        this.setState(state => ({
            view: "forum"
        }));
    }

    /**
     * Event handler for when user clicks on setting button.
     * Changes button selection on sidebar and redirects to account setting page.
     */
    handleSetting() {
        console.log("setting");
        this.setState(state => ({
            view: "setting"
        }));
    }

    handleBack() {
        console.log("back");
        this.setState(state => ({
            view: "class"
        }));
        this.props.history.push("/student/dashboard");
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
        var studentName = localStorage.getItem('firstName') + " " + localStorage.getItem('lastName');

        switch(this.state.view) {
            case "dashboard":
                return (
                    <div>
                        <SelectedButton style="margin-top: 20px">{studentName}</SelectedButton>
                        <NonselectedButton onClick={this.handleEnrollClass.bind(this)}>Enroll Class</NonselectedButton>
                        <NonselectedButton onClick={this.handleForum.bind(this)}>Forum</NonselectedButton>
                        <NonselectedButton onClick={this.handleSetting.bind(this)}>Setting</NonselectedButton>
                        <NonselectedButton onClick={this.handleLogout}>Log Out</NonselectedButton>
                    </div>
                )
            
            case "enroll class":
                return (
                    <div>
                        <NonselectedButton onClick={this.handleShowDashboard.bind(this)} style="margin-top: 20px">{studentName}</NonselectedButton>
                        <SelectedButton>Enroll Class</SelectedButton>
                        <NonselectedButton onClick={this.handleForum.bind(this)}>Forum</NonselectedButton>
                        <NonselectedButton onClick={this.handleSetting.bind(this)}>Setting</NonselectedButton>
                        <NonselectedButton onClick={this.handleLogout}>Log Out</NonselectedButton>
                    </div>
                ) 
                
            case "forum":
                return (
                    <div>
                        <NonselectedButton onClick={this.handleShowDashboard.bind(this)} style="margin-top: 20px">{studentName}</NonselectedButton>
                        <NonselectedButton onClick={this.handleEnrollClass.bind(this)}>Enroll Class</NonselectedButton>
                        <SelectedButton>Forum</SelectedButton>
                        <NonselectedButton onClick={this.handleSetting.bind(this)}>Setting</NonselectedButton>
                        <NonselectedButton onClick={this.handleLogout}>Log Out</NonselectedButton>
                    </div>
                )

            
            case "setting":
                return (
                    <div>
                        <NonselectedButton onClick={this.handleShowDashboard.bind(this)} style="margin-top: 20px">{studentName}</NonselectedButton>
                        <NonselectedButton onClick={this.handleEnrollClass.bind(this)}>Enroll Class</NonselectedButton>
                        <NonselectedButton onClick={this.handleForum.bind(this)}>Forum</NonselectedButton>
                        <SelectedButton>Setting</SelectedButton>
                        <NonselectedButton onClick={this.handleLogout}>Log Out</NonselectedButton>
                    </div>
                )
            
            case "class":
                return (
                    <div>
                        <Button onClick={this.handleBack.bind(this)}>Back to Dashboard</Button>
                    </div>
                )
            default:
                return (<div></div>);
        }
    }

    render() {
        return (
            <div className="dashboard-sidebar">
                <img className="profile-image" src={headshot} />
                {this.getNavButtons()}
            </div>
        )
    }

}

var SidebarRouterStudent = withRouter(SidebarStudent)
export default SidebarRouterStudent;