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


    /**
     * renders the Specific Quiz page
     */
    render() {

        return (
            <div>
                <Card>
                    <CardBody>
                        <CardTitle>{this.state.question.title}</CardTitle>
                        <CardBody>
                            <CardTitle>{this.state.question.choiceA.title}</CardTitle>
                            <CardText>{this.state.question.choiceA.content}</CardText>
                            <Progress value={this.state.question.choiceA.numResponses} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody>
                            <CardTitle>{this.state.question.choiceB.title}</CardTitle>
                            <CardText>{this.state.question.choiceB.content}</CardText>
                            <Progress value={this.state.question.choiceB.numResponses} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody>
                            <CardTitle>{this.state.question.choiceC.title}</CardTitle>
                            <CardText>{this.state.question.choiceC.content}</CardText>
                            <Progress value={this.state.question.choiceC.numResponses} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody>
                            <CardTitle>{this.state.question.choiceD.title}</CardTitle>
                            <CardText>{this.state.question.choiceD.content}</CardText>
                            <Progress value={this.state.question.choiceD.numResponses} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default InstructorQuizzes;