import React, { useState } from 'react';
import {     
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,

    Collapse,

    Progress,
    
    Nav, NavItem, NavLink } from 'reactstrap';
import './Dashboard.css';
  
class InstrSpecificQuiz extends React.Component {
    
    constructor(props) {
        super(props);

        this.getQuestions = this.getQuestions.bind(this);
        this.getPercentage = this.getPercentage.bind(this);
        this.getStudentAnswers = this.getStudentAnswers.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.toggle = this.toggle.bind(this);

        this.state = {
            quiz: this.props.quiz,
        }
    }

    componentDidMount() {
        console.log("mounting");
    }

    componentWillUnmount() {
        console.log("unmounting");
    }


    // // Go to specific question page
    // // Pass in the specific question as a prop to the SpecificQuestion object
    // handleClick() {
    //     // TODO: IMPLEMENT STACK NAVIGATION (AS WITH INSTRLISTQUIZZES): QUIZZES/SPECIFICQUIZ/SPECIFICQUESTION
    //     return 0;
    // }


    /**
     * GETQUESTIONS
     * When page renders,
     * Retrieve list of quizzes, store in state
     */
    getQuestions = () => {
        console.log("retrieving questions");

        // TODO: IMPLEMENT FETCH PROPERLY
        fetch("http://127.0.0.1:8000/api/quiz/list/question/" + this.props.match.params.classid)
        // .then(res => res.json())
        //     .then(data => data.classes.map(myclass => (
        //         {
        //             classname: `${myclass.name}`,
        //             classid: `${myclass.class_id}`,
        //             instructor: `${myclass.instructor}`,
        //             active: `${myclass.active}`,
        //         }
        //     )))
        //     .then(classes => this.setState({
        //         classes,
        //         isLoading: false
        //     }))
        //     .catch(error => console.log('parsing failed', error));
    }

    /*
     * TODO: Makes http request to endpoint to retrieve list of student answers from a given question
     * Return such list as a JSX list of Cards representing student responses
     */
    getStudentAnswers = () => {
        return 0;
    }


    /*
    * GETPERCENTAGE
    * Return the percentage of students who selected a given answer choice
    */
    getPercentage = (question, answerChoice) => {

        return ( 
            (answerChoice.numResponses /
            (question.answer_0.numResponses + 
                question.answer_1.numResponses +
                question.answer_2.numResponses +
                question.answer_3.numResponses))*100).toString();
    }


    /*
    * Constants to keep track of state for Collapse menu for list of students who selected a given answer
    */
    const [collapse_0, setCollapse_0] = useState(false);
    const [collapse_1, setCollapse_1] = useState(false);
    const [collapse_2, setCollapse_2] = useState(false);
    const [collapse_3, setCollapse_3] = useState(false);

    /*
    * TOGGLE
    * Upon clicking "View Responses" for a given answer, show/hide the responses
    */
    const toggle = answerChoice => {
        switch(answerChoice) {
            case 0:
                setCollapse(!collapse_0);
                break;
            case 1:
                setCollapse(!collapse_1);
                break;
            case 2:
                setCollapse(!collapse_2);
                break;
            case 3:
                setCollapse(!collapse_3);
                break;
            default:
                break;
        }
    }


    /**
     * RENDERQUESTIONS
     * Render each question
     * Current implementation of this application only supports one question per quiz,
     * but this function is adaptable for multiple questions (which is why I left the map function alone)
     */
    renderQuestions = () => {
        this.state.quiz.map(question => {
            return (
                <Card>
                    <CardTitle>{question.question}</CardTitle>
                    <CardBody>
                        <CardBody inverse color={question.correct_answer == 0 ? "success" : "danger"}>
                            <CardTitle>A</CardTitle>
                            <CardText>{question.answer_0}</CardText>
                            <Progress value={this.getPercentage(question, question.answer_0)} />
                            <Button onClick={toggle(0)}>View/Hide Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody inverse color={question.correct_answer == 1 ? "success" : "danger"}>
                            <CardTitle>B</CardTitle>
                            <CardText>{question.answer_1}</CardText>
                            <Progress value={this.getPercentage(question, question.answer_1)} />
                            <Button onClick={toggle(1)}>View/Hide Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody inverse color={question.correct_answer == 2 ? "success" : "danger"}>
                            <CardTitle>C</CardTitle>
                            <CardText>{question.answer_2}</CardText>
                            <Progress value={this.getPercentage(question, question.answer_2)} />
                            <Button onClick={toggle(2)}>View/Hide Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody inverse color={question.correct_answer == 3 ? "success" : "danger"}>
                            <CardTitle>D</CardTitle>
                            <CardText>{question.answer_3}</CardText>
                            <Progress value={this.getPercentage(question, question.answer_3)} />
                            <Button onClick={toggle(3)}>View/Hide Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
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
                        {this.renderQuestions}
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default InstrSpecificQuiz;