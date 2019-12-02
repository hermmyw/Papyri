import React from 'react';
import { SelectedButton, NonselectedButton } from './UI/SidebarComponents.js';
import headshot from '../containers/images/headshot.png';
import './UI/UI.css';
import { withRouter} from 'react-router-dom';
import * as docCookies from 'doc-cookies';
import handleLogout from '../functions/logout';

// dummy user, class, and quiz id
var ids = {
    quizid: 12345
}

/**
 * Renders a sidebar for all the different pages on the User interface.
 */
class Sidebar extends React.Component {

    /**
     * Constructor for Sidebar component.
     * Sets the view state based on value passed into props.
     * Renders differently depending on whether user is Instructor or Student.
     * @param {array} props Properties that are passed into element when being used.
     */
    constructor(props) {
        super(props);
        this.handleClassHomeInstructor = this.handleClassHomeInstructor.bind(this);
        this.handlePendingQuizzes = this.handlePendingQuizzes.bind(this);
        this.handlePastQuizzes = this.handlePastQuizzes.bind(this);
        this.handleCreateQuiz = this.handleCreateQuiz.bind(this);
        this.handleClassHomeStudent = this.handleClassHomeStudent.bind(this);
        this.handleQuizzesStudent = this.handleQuizzesStudent.bind(this);
        this.getNavButtonsInstructor = this.getNavButtonsInstructor.bind(this);
        this.getNavButtonsStudent = this.getNavButtonsStudent.bind(this);

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
    handleClassHomeInstructor() {
        let path = `/instructor/class/${localStorage.getItem('userid')}/${localStorage.getItem('classid')}`;
        this.props.history.push(path);
    }

    /**
     * Event handler for when user clicks on 'Pending Quizzes' button.
     * Changes button selection on sidebar and redirects to page showing list of pending quizzes
     */
    handlePendingQuizzes() {
        let path = `/instructor/pendingquizzes/${localStorage.getItem('userid')}/${localStorage.getItem('classid')}`;
        this.props.history.push(path);
    }

    /**
     * Event handler for when user clicks on 'Past Quizzes' button.
     * Changes button selection on sidebar and redirects to page showing list of past quizzes
     */
    handlePastQuizzes() {
        let path = `/instructor/quizzes/${localStorage.getItem('userid')}/${localStorage.getItem('classid')}`;
        this.props.history.push(path);
    }

    /**
     * Event handler for when user clicks on create quiz button.
     * Changes button selection on sidebar and redirects to form to create quiz.
     */
    handleCreateQuiz() {
        let path = `/instructor/createquiz/${localStorage.getItem('userid')}/${localStorage.getItem('classid')}`;
        this.props.history.push(path);
    }

    
    /**
     * Event handler for when user clicks on 'Class Home' button.
     * Changes button selection on sidebar and redirects to page showing stats for particular class
     */
    handleClassHomeStudent() {
        let path = `/student/class/${localStorage.getItem('userid')}/${localStorage.getItem('classid')}`;
        this.props.history.push(path);
    }

    /**
     * Event handler for when user clicks on 'Past Quizzes' button.
     * Changes button selection on sidebar and redirects to page showing list of past quizzes
     */
    handleQuizzesStudent() {
        let path = `/student/quizzes/${localStorage.getItem('userid')}/${localStorage.getItem('classid')}`;
        this.props.history.push(path);
    }

    /**
     * Renders the sidebar based on state of sidebar so that correct button is selected.
     */
    getNavButtonsInstructor() {
        console.log(localStorage);
        // if (instructorName === null || instructorName === "") {
        //     instructorName = "Professor Kim";
        //     console.log("no name");
        // }
        switch(this.state.view) {

            case "class home":
                return (
                    <div>
                        <SelectedButton>Class Home</SelectedButton>
                        <NonselectedButton onClick={this.handlePendingQuizzes}>Pending Quizzes</NonselectedButton>
                        <NonselectedButton onClick={this.handlePastQuizzes}>Past Quizzes</NonselectedButton>
                        <NonselectedButton onClick={this.handleCreateQuiz}>Create Quiz</NonselectedButton>
                        <NonselectedButton onClick={() => handleLogout(this)}>Log Out</NonselectedButton>
                    </div>
                ) 

            case "pending quizzes":
                return (
                    <div>
                        <NonselectedButton onClick={this.handleClassHomeInstructor}>Class Home</NonselectedButton>
                        <SelectedButton>Pending Quizzes</SelectedButton>
                        <NonselectedButton onClick={this.handlePastQuizzes}>Past Quizzes</NonselectedButton>
                        <NonselectedButton onClick={this.handleCreateQuiz}>Create Quiz</NonselectedButton>
                        <NonselectedButton onClick={() => handleLogout(this)}>Log Out</NonselectedButton>
                    </div>
                ) 
                
            case "past quizzes":
                return (
                    <div>
                        <NonselectedButton onClick={this.handleClassHomeInstructor}>Class Home</NonselectedButton>
                        <NonselectedButton onClick={this.handlePendingQuizzes}>Pending Quizzes</NonselectedButton>
                        <SelectedButton>Past Quizzes</SelectedButton>
                        <NonselectedButton onClick={this.handleCreateQuiz}>Create Quiz</NonselectedButton>
                        <NonselectedButton onClick={() => handleLogout(this)}>Log Out</NonselectedButton>
                    </div>
                )
            
            case "create quiz":
                return (
                    <div>
                        <NonselectedButton onClick={this.handleClassHomeInstructor}>Class Home</NonselectedButton>
                        <NonselectedButton onClick={this.handlePendingQuizzes}>Pending Quizzes</NonselectedButton>
                        <NonselectedButton onClick={this.handlePastQuizzes}>Past Quizzes</NonselectedButton>
                        <SelectedButton>Create Quiz</SelectedButton>
                        <NonselectedButton onClick={() => handleLogout(this)}>Log Out</NonselectedButton>
                    </div>
                )
            
            default:
                return (<div></div>);
        }
    }

    /**
     * Renders the sidebar based on state of sidebar so that correct button is selected.
     */
    getNavButtonsStudent() {
        switch(this.state.view) {

            case "class home":
                return (
                    <div>
                        <SelectedButton>Class Home</SelectedButton>
                        <NonselectedButton onClick={this.handleQuizzesStudent}>Quizzes</NonselectedButton>
                        <NonselectedButton onClick={() => handleLogout(this)}>Log Out</NonselectedButton>
                    </div>
                )  
                
            case "student quizzes":
                return (
                    <div>
                        <NonselectedButton onClick={this.handleClassHomeStudent}>Class Home</NonselectedButton>
                        <SelectedButton>Quizzes</SelectedButton>
                        <NonselectedButton onClick={() => handleLogout(this)}>Log Out</NonselectedButton>
                    </div>
                )
            
            default:
                return (<div></div>);
        }
    }

    render() {
        var instructorName = localStorage.getItem('firstName') + " " + localStorage.getItem('lastName');
        var navDisplay = null;
        if (localStorage.getItem('user') === 'student') {
            navDisplay = this.getNavButtonsStudent();
        }
        else {
            navDisplay = this.getNavButtonsInstructor();
        }

        return (
            <div className="dashboard-sidebar">
                <img className="profile-image" src={headshot} />
                <SelectedButton style="margin-top: 20px">{instructorName}</SelectedButton>
                {navDisplay}
            </div>
        )
    }

}

Sidebar.defaultProps = {
    profilePic: headshot
}

var SidebarRouter = withRouter(Sidebar)
export default SidebarRouter;