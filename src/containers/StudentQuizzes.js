import React from 'react';
import Sidebar from '../components/Sidebar';
import '../components/UI/UI.css';
import { Container, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';
import handleQuizClick from '../functions/handleQuizClick';
import convertDate from '../functions/convertDate';
import * as docCookies from 'doc-cookies';
import { IoIosArrowBack } from "react-icons/io";

var sampleQuizzes = [
    {
        question: "What is the definition of strategy design pattern?",
        date: "2019-09-25",
        quiz_id: "34523"
    },
    {
        question: "What is the definition of observer design pattern?",
        date: "2019-10-25",
        quiz_id: "65456"
    },
    {
        question: "What is the definition of factory method design pattern?",
        date: "2019-11-25",
        quiz_id: "78768"
    },
]

/**
 * Container for the (Past) Quizzes page shown on the Student Sidebar
 */
class StudentQuizzes extends React.Component {

    constructor(props) {
        super(props);
        this.getStudentQuizzes = this.getStudentQuizzes.bind(this);
        this.handleQuizClick = this.handleQuizClick.bind(this)
        this.handleBackClick = this.handleBackClick.bind(this)

        this.state = {
            quizzesDisplay: null,
            viewQuiz: false,
            quizSelected: null,
            studentAnswers: {}
        }
    }

    componentDidMount() {
        this.getStudentQuizzes();
        this.getStudentAnswers();
    }

    handleQuizClick(quiz) {
        // let params = this.props.match.params;
        // this.props.history.push(`/student/quiz/${params.userid}/${params.classid}/${quizid}`);
        this.setState({
            viewQuiz: true,
            quizSelected: quiz
        })
    }

    handleBackClick() {
        this.setState({
            viewQuiz: false,
            quizSelected: null
        })
    }

    getStudentAnswers() {
        var answerArray = {};
        fetch(`http://127.0.0.1:8000/api/answer/student/${this.props.match.params.userid}`, {
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
                
                throw Error(res.statusText);
            })
            .then(
                (result) => {
                    console.log("student answers: ", result);
                    result.forEach(answer => answerArray[answer.quiz_id] = answer);
                }
            )
            .then(() => {
                this.setState({studentAnswers: answerArray});
            })
            .catch (error => {
                console.log('get student answers error: ', error);
                /* docCookies.removeItem('token', '/');
                localStorage.clear();
                this.props.history.push('/');*/
            })
    }

    /**
     * makes api call to get list of pending quizzes and creates pretty display
     */
    getStudentQuizzes() {
        fetch(`http://127.0.0.1:8000/api/quiz/list/released/${this.props.match.params.classid}/`, {
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
                
                throw Error(res.statusText);
            })
            .then(
                (result) => {
                    console.log("past quizzes: ", result);

                    if (result.length === 0) {
                        return (
                            <Container>
                                Instructor has not released any quizzes yet!
                            </Container>
                        )
                    }

                    else {
                        return (
                            result.map((quiz) => (
                                <Row>
                                    <Col>
                                        <Button className="yellow-button" size="lg" block onClick={() => this.handleQuizClick(quiz)}>
                                            <span style={{float: "left"}}>{quiz.question}</span><span style={{float: "right"}}>{convertDate(quiz.time_created.substring(0, 10))}</span>
                                        </Button>
                                    </Col>
                                </Row>
                            ))
                        )
                    }
                }
            )
            .then((quizzes) => {
                this.setState({quizzesDisplay: quizzes});
            })
            .catch (error => {
                console.log('get past quizzes error: ', error);
                /* docCookies.removeItem('token', '/');
                localStorage.clear();
                this.props.history.push('/');*/
            })


    }

    render() {
        console.log('student answers: ', this.state.studentAnswers);
        var display = null;
        var backButton = (
            <Row>
                <Col><Button className="link-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Back</Button></Col>
            </Row>
        )
        if (this.state.viewQuiz) {
            var display = backButton;
            let quiz = this.state.quizSelected;
            let answerLabel = ['A', 'B', 'C', 'D'];
            let quizAnswers = [quiz.answer_0, quiz.answer_1, quiz.answer_2, quiz.answer_3];
            console.log('quiz: ', quiz);

            /*let studentUID = localStorage.getItem('uid');

            let studentAnswer = result.student_answers.filter((sAnswer) => {
                return (sAnswer.uid === studentUID);
            });*/

            let studentAnswer = this.state.studentAnswers[quiz.id];

            console.log(studentAnswer);
                
            var correctMessage = (
                <Row>
                    Congratulations! You are correct.
                </Row>
            )

            var answersDisplay = quizAnswers.map((answer, idx) => {
                var answerButton = (
                    <Button color="secondary" size="lg" block>
                        {answerLabel[idx]}: {answer}
                    </Button>
                )

                if (idx === quiz.correct_answer) {
                    var answerButton = (
                        <Button color="success" size="lg" block>
                            {answerLabel[idx]}: {answer}
                        </Button>
                    )
                }

                else if (studentAnswer === undefined) {
                    correctMessage = (
                        <Row>
                            You did not pick an answer!
                        </Row>
                    )
                }

                else if (idx === studentAnswer.choice) {
                    console.log("wrong answer");
                    correctMessage = (
                        <Row>
                            Oh no! Your answer is incorrect.
                        </Row>
                    )
                    var answerButton = (
                        <Button color="danger" size="lg" block>
                            {answerLabel[idx]}: {answer}
                        </Button>
                    )
                }

                return (
                    <Row>
                        {answerButton}
                    </Row>
                );
            });

            var display = (
                <Container>
                    <Row>
                        {quiz.question}
                    </Row>
                    {answersDisplay}
                    {correctMessage}
                    {backButton}
                </Container>
            )
        }
        else {
            var display = this.state.quizzesDisplay;
        }

        return (
            <div className="regular-container">
                <Sidebar view="student quizzes" />
                <div className="main-area">
                    Student Quizzes
                    {display}
                </div>
            </div>
        )
    }
}

export default StudentQuizzes;