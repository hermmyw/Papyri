import React, { useState } from 'react';
import {     
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,

    Collapse,

    Progress,
    
    Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import './Dashboard.css';


const ToggleHook = (props) => {
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
                setCollapse_0(!collapse_0);
                break;
            case 1:
                setCollapse_1(!collapse_1);
                break;
            case 2:
                setCollapse_2(!collapse_2);
                break;
            case 3:
                setCollapse_3(!collapse_3);
                break;
            default:
                break;
        }
    }

    const getToggle = (idx) => {
        switch(idx) {
            case 0:
                return collapse_0;
            case 1:
                return collapse_1;
            case 2:
                return collapse_2;
            case 3:
                return collapse_3;
        }
    }
    console.log('props: ', props);
    return(
        props.answers.map((answer, idx) => {
            const toggleState = getToggle(idx);
            const ans = answer;
            if (idx === props.correct) {
                return (
                    <div>
                        <Button color="success" onClick={() => toggle(idx)} style={{ marginBottom: '1rem' }}>{ans} <b>Total: {props.classifiedAnswers[idx].length}</b></Button>
                        <Collapse isOpen={toggleState}>
                            <Card>
                            <CardBody>
                                {formatStudentAnswers(props.classifiedAnswers, idx)}
                            </CardBody>
                            </Card>
                        </Collapse>
                    </div>
                )
            }
            else {
                return (
                    <div>
                        <Button color="primary" onClick={() => toggle(idx)} style={{ marginBottom: '1rem' }}>{ans} <b>Total: {props.classifiedAnswers[idx].length}</b></Button>
                        <Collapse isOpen={toggleState}>
                            <Card>
                            <CardBody>
                                {formatStudentAnswers(props.classifiedAnswers, idx)}
                            </CardBody>
                            </Card>
                        </Collapse>
                    </div>
                )
            }
        })
    )
}

const formatStudentAnswers = (studentArr, idx) => {
    console.log('studentArr', studentArr);
    if (studentArr[idx].length === 0) {
        return (
            <Row>
                <Col>
                    No students picked this answer!
                </Col>
            </Row>
        )
    }
    else {
        
        return (
            studentArr[idx].map((student) => {
                return (
                    <Row>
                        <Col>
                            <Button className="yellow-button" size="lg" block >
                                Student {student.student}
                            </Button>
                        </Col>
                    </Row>
                )
            })
        )
    }
}

  
class InstrSpecificQuiz extends React.Component {
    
    constructor(props) {
        super(props);

        this.getStudentResponses = this.getStudentResponses.bind(this);
        this.getPercentage = this.getPercentage.bind(this);
        this.getQuizScore = this.getQuizScore.bind(this);

        this.state = {
            quiz: this.props.quiz,
            answersOptions: [this.props.quiz.answer_0, this.props.quiz.answer_1, this.props.quiz.answer_2, this.props.quiz.answer_3],
            classifiedAnswers: null,
            score: this.props.quiz.score,
            scoreInfo: null,
            studentResponseArray: [],
            correctAnswer: null,
            num_students: null
        }
    }

    componentDidMount() {
        console.log("mounting");
        this.getStudentResponses();
        this.getQuizScore();
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    getQuizScore() {
        fetch(`http://127.0.0.1:8000/api/quiz/result/${this.props.quiz.id}/`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                console.log(res);
                if (res.ok) {
                    return (res.json());
                }
                else {
                    throw Error(res.statusText);
                }
            })
            .then((result) => {
                console.log('quiz score: ', result);
                this.setState({
                    scoreInfo: result,
                    correctAnswer: result.correct_answer,
                    studentResponseArray: [result.choice_0_percent, result.choice_1_percent, result.choice_2_percent, result.choice_3_percent],
                    numStudents: result.num_students
                });
            })
            .catch (error => {
                console.log('get quiz score error: ', error);
                /* docCookies.removeItem('token', '/');
                localStorage.clear();
                this.props.history.push('/');*/
            })
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
    getStudentResponses = () => {
        console.log("retrieving questions");

        const groupByAnswer = (answers) => {
            var ret = [[], [], [], []];
            var promise = new Promise(() =>
                answers.forEach( (answer) => {
                    ret[answer.choice].push(answer);
                })
            )
            
            promise.then(
                this.setState({classifiedAnswers: ret})
            )
        }

        // TODO: IMPLEMENT FETCH PROPERLY
        fetch(`http://127.0.0.1:8000/api/answer/quiz/${this.state.quiz.id}`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                console.log(res);
                if (res.ok) {
                    return (res.json());
                }
                else {
                    throw Error(res.statusText);
                }
            })
            .then(
                (result) => {
                    console.log("student answers: ", result);
                    groupByAnswer(result);
                    /*return(
                        result.map((answer) => {

                        })
                    )*/
                }
            )
            /*.then(() => {
                this.setState({studentAnswers: answerArray});
            })*/
            .catch (error => {
                console.log('get student answers error: ', error);
                /* docCookies.removeItem('token', '/');
                localStorage.clear();
                this.props.history.push('/');*/
            })
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


    /**
     * renders the Specific Quiz page
     */
    render() {
        console.log('states: ', this.state);
        var display = null;
        if (this.state.classifiedAnswers !== null) {
            var display = (
                <ToggleHook 
                    answers={this.state.answersOptions} 
                    classifiedAnswers={this.state.classifiedAnswers} 
                    score={this.state.score}
                    correct={this.state.quiz.correct_answer}/>
            )
        }
        
        if (this.state.studentResponseArray !== []) {
            return (
                <div>
                    {this.state.quiz.question}
                    {display}
                    <Row>
                        <Col>
                        Class Score: {this.state.studentResponseArray[this.state.correctAnswer]} out of {this.state.numStudents} responses correct.
                        </Col>
                    </Row>
                </div>
            )
        }
        else {
            return (
                <div></div>
            )
        }
        
    }
}

export default InstrSpecificQuiz;