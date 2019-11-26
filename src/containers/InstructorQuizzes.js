// Show question + answer choices, correct answer is highlighted 
// (api call: show specific quiz information)
// Show list of student answers: first name, last name, uid, 
// answer (api call: get list of student answers to specific quiz)

import React from 'react';
import {     
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,

    Collapse,

    Progress,
    
    Nav, NavItem, NavLink } from 'reactstrap';
import './Dashboard.css';
  
class InstructorQuizzes extends React.Component {
    
    constructor(props) {
        super(props);
        this.getQuizzes = this.getQuizzes.bind(this);
        this.renderQuizzes = this.renderQuizzes.bind(this);
        this.state = {
            quizzes: this.getQuizzes(),
        }
    }

    componentDidMount() {
        console.log("mounting");
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    /**
     * Makes an http request to endpoint to retrieve list of quizzes for instructor
     */
    getQuizzes() {
        return 0;
    }

    renderQuizzes() {
        this.state.quizzes.map(quiz => {
            return (
                <Card>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardBody>
                        <CardText>{quiz.date}</CardText>
                        <CardText>{quiz.id}</CardText>
                        <CardText>{quiz.score}</CardText>
                    </CardBody>
                </Card>

            )
        })
    }


    /**
     * renders the Specific Quiz page
     */
    render() {

        return (
            <div>
                <Card>
                    <CardBody>
                        {this.renderQuizzes}
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default InstructorQuizzes;