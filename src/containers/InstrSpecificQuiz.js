import React from 'react';
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
        this.handleClick = this.handleClick.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
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


    // Go to specific question page
    // Pass in the specific question as a prop to the SpecificQuestion object
    handleClick() {
        // TODO: IMPLEMENT STACK NAVIGATION (AS WITH INSTRLISTQUIZZES): QUIZZES/SPECIFICQUIZ/SPECIFICQUESTION
        return 0;
    }


    /**
     * GETQUESTIONS
     * When page renders,
     * Retrieve list of quizzes, store in state
     */
    getQuestions() {
        console.log("retrieving questions");

        // TODO: IMPLEMENT FETCH PROPERLY
        fetch("http://127.0.0.1:8000/api/quiz/list/question/" + this.state.classid)
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
     */
    getStudentAnswers() {
        return 0;
    }

    getPercentage(question, answerChoice) {

        return ( 
            (answerChoice.numResponses /
            (question.answer_0.numResponses + 
                question.answer_1.numResponses +
                question.answer_2.numResponses +
                question.answer_3.numResponses))*100).toString();
    }


    /**
     * RENDERQUESTIONS
     * Render each question
     */
    renderQuestions() {
        this.state.quiz.map(question => {
            return (
                <Card>
                    <CardTitle>{question.question}</CardTitle>
                    <CardBody>
                        <CardBody inverse color={question.correct_answer == 0 ? "success" : "danger"}>
                            <CardTitle>A</CardTitle>
                            <CardText>{question.answer_0}</CardText>
                            <Progress value={this.getPercentage(question, question.answer_0)} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody inverse color={question.correct_answer == 1 ? "success" : "danger"}>
                            <CardTitle>B</CardTitle>
                            <CardText>{question.answer_1}</CardText>
                            <Progress value={this.getPercentage(question, question.answer_1)} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody inverse color={question.correct_answer == 2 ? "success" : "danger"}>
                            <CardTitle>C</CardTitle>
                            <CardText>{question.answer_2}</CardText>
                            <Progress value={this.getPercentage(question, question.answer_2)} />
                            <Button>View Responses</Button>
                            <Collapse>{this.getStudentAnswers}</Collapse>
                        </CardBody>
                        <CardBody inverse color={question.correct_answer == 3 ? "success" : "danger"}>
                            <CardTitle>D</CardTitle>
                            <CardText>{question.answer_3}</CardText>
                            <Progress value={this.getPercentage(question, question.answer_3)} />
                            <Button>View Responses</Button>
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