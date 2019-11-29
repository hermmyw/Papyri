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
  
class SpecificQuestion extends React.Component {
    

    constructor(props) {
        super(props);
        this.getQuestion = this.getQuestion.bind(this);
        this.getStudentAnswers = this.getStudentAnswers.bind(this);
        this.state = {
            question: this.props.question,
            answers: this.getStudentAnswers()
        }
    }

    componentDidMount() {
        console.log("mounting");
    }

    componentWillUnmount() {
        console.log("unmounting");
    }


    /*
     * TODO: Makes http request to endpoint to retrieve list of student answers from a given question
     */
    getStudentAnswers() {
        return 0;
    }

    /**
     * renders the Specific Question page
     * NOTE: API needs to return number of responses for a given answer choice
     */
    render() {

        return (
            <div>
                <Card>
                    <CardBody>
                        <CardTitle>{this.state.question.title}</CardTitle>
                        <CardBody>
                            <CardTitle>A</CardTitle>
                            <CardText>{this.state.question.answer_0}</CardText>
                            <Progress value={this.state.question.choiceA.numResponses} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody>
                            <CardTitle>B</CardTitle>
                            <CardText>{this.state.question.answer_1}</CardText>
                            <Progress value={this.state.question.choiceB.numResponses} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody>
                            <CardTitle>C</CardTitle>
                            <CardText>{this.state.question.answer_2}</CardText>
                            <Progress value={this.state.question.choiceC.numResponses} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody>
                            <CardTitle>D</CardTitle>
                            <CardText>{this.state.question.answer_3}</CardText>
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

export default SpecificQuestion;