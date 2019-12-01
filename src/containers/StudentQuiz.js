import React from 'react';
import Sidebar from '../components/Sidebar';
import '../components/UI/UI.css';
import { Container, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";
import handleQuizClick from '../functions/handleQuizClick';
import convertDate from '../functions/convertDate';
import * as docCookies from 'doc-cookies';


var sampleQuizzesWithAnswers = {
    34523: {
        question: "What is the definition of strategy design pattern?",
        date: "2019-09-25",
        answers: ['answer1', 'answer2', 'answer3', 'answer4'],
        correct_answer: 2,
        overall_score: 50,
        student_answers: [
            {
                name: "Student 1",
                uid: "123456789",
                answer: 2
            },
            {
                name: "Student 2",
                uid: "987654321",
                answer: 1
            },
            {
                name: "Student 3",
                uid: "135792468",
                answer: 0
            },
            {
                name: "Student 4",
                uid: "246813579",
                answer: 2
            },
        ]
    },
    65456: {
        question: "What is the definition of observer design pattern?",
        date: "2019-10-25",
        answers: ['answer1', 'answer2', 'answer3', 'answer4'],
        correct_answer: 1,
        overall_score: 25,
        student_answers: [
            {
                name: "Student 1",
                uid: "123456789",
                answer: 2
            },
            {
                name: "Student 2",
                uid: "987654321",
                answer: 1
            },
            {
                name: "Student 3",
                uid: "135792468",
                answer: 0
            },
            {
                name: "Student 4",
                uid: "246813579",
                answer: 2
            },
        ]
    },
    78768: {
        question: "What is the definition of factory method design pattern?",
        date: "2019-11-25",
        answers: ['answer1', 'answer2', 'answer3', 'answer4'],
        correct_answer: 0,
        overall_score: 25,
        student_answers: [
            {
                name: "Student 1",
                uid: "123456789",
                answer: 2
            },
            {
                name: "Student 2",
                uid: "987654321",
                answer: 1
            },
            {
                name: "Student 3",
                uid: "135792468",
                answer: 0
            },
            {
                name: "Student 4",
                uid: "246813579",
                answer: 2
            },
        ]
    },
}

class StudentQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.getQuizInfo = this.getQuizInfo.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
    }

    getQuizInfo() {
        const quizID = this.props.match.params.quizid;
        const pastQuizInfoURL = `http://127.0.0.1:8000/api/quiz/list/question/${quizID}`;

        fetch(pastQuizInfoURL, {
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
                    console.log("quiz info: ", result);
                    
                    /*let answerLabel = ['A', 'B', 'C', 'D'];
                    let studentUID = localStorage.getItem('uid');

                    let studentAnswer = result.student_answers.filter((sAnswer) => {
                        return (sAnswer.uid === studentUID);
                    })

                    var answersDisplay = result.answers.map((answer, idx) => {
                        var answerButton = (
                            <Button color="secondary" size="lg" block>
                                {answerLabel[idx]}: {answer}
                            </Button>
                        )

                        if (idx === result.correct_answer) {
                            var answerButton = (
                                <Button color="success" size="lg" block>
                                    {answer}
                                </Button>
                            )
                        }

                        else if (idx === studentAnswer.answer) {
                            <Button color="danger" size="lg" block>
                                {answer}
                            </Button>
                        }

                        return (
                            <Row>
                                {answerButton}
                            </Row>
                        );
                    });

                    var quizDisplay = (
                        <Container>
                            <Row>
                                {result.question}
                            </Row>
                            {answersDisplay}
                        </Container>
                    )

                    return quizDisplay;*/
                }
            )
            .catch (error => {
                console.log('get quiz error: ', error);
                // docCookies.removeItem('token', '/');
                // localStorage.clear();
                // this.props.history.push('/');
            })

            /*console.log(localStorage.getItem('uid'));
            let result = sampleQuizzesWithAnswers[quizID];

            let answerLabel = ['A', 'B', 'C', 'D'];
            let studentUID = localStorage.getItem('uid');

            let studentAnswer = result.student_answers.filter((sAnswer) => {
                return (sAnswer.uid === studentUID);
            });

            console.log(studentAnswer);
                
            var correctMessage = (
                <Row>
                    Congratulations! You are correct.
                </Row>
            )

            var answersDisplay = result.answers.map((answer, idx) => {
                var answerButton = (
                    <Button color="secondary" size="lg" block>
                        {answerLabel[idx]}: {answer}
                    </Button>
                )

                if (idx === result.correct_answer) {
                    var answerButton = (
                        <Button color="success" size="lg" block>
                            {answerLabel[idx]}: {answer}
                        </Button>
                    )
                }

                else if (idx === studentAnswer[0].answer) {
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

            var quizDisplay = (
                <Container>
                    <Row>
                        {result.question}
                    </Row>
                    {answersDisplay}
                    {correctMessage}
                </Container>
            )

            return quizDisplay;*/
    }

    handleBackClick() {
        const userID = this.props.match.params.userid;
        const classID = this.props.match.params.classid;
        this.props.history.push(`/student/quizzes/${userID}/${classID}`);
    }

    render() {
        console.log('student quiz page');
        //let quizDisplay = this.getQuizInfo();
        return (
            <div>
                <Sidebar view="student quizzes" />
                <div className="main-area">
                    Student Quizzes
                    {/*quizDisplay*/}
                    <Row>
                        <Col><Button className="link-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Back</Button></Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default StudentQuiz;