import React from 'react';
import Sidebar from '../components/Sidebar';
import '../components/UI/UI.css';
import { Container, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';
import handleQuizClick from '../functions/handleQuizClick';
import convertDate from '../functions/convertDate';
import * as docCookies from 'doc-cookies';

var classid = null;
var pastQuizzesURL = null;

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

        var classid = this.props.match.params.classid;
        var pastQuizzesURL = `http://127.0.0.1:8000/api/quiz/list/released/${classid}/`;

        this.state = {
            quizzes: []
        }
    }

    /**
     * makes api call to get list of pending quizzes and creates pretty display
     */
    getStudentQuizzes() {
        /* fetch(pastQuizzesURL, {
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
                    console.log("status:");
                    console.log(result);
                    let quizzes = result.quizzes;

                    if (quizzes.length === 0) {
                        return (
                            <Container>
                                Instructor has not released any quizzes yet!
                            </Container>
                        )
                    }

                    var quizzesDisplay = quizzes.map((quiz) => {
                        <Row>
                            <Col>
                                <Button className="yellow-button" size="lg" block onClick={() => this.handleQuizClick(quiz.quizID)}>
                                    <span style={{float: "left"}}>{quiz.question}</span><span style={{float: "right"}}>{convertDate(d.date)}</span>
                                </Button>
                            </Col>
                        </Row>
                    });

                    return quizzesDisplay;
                }
            )
            .catch (error => {
                
                docCookies.removeItem('token', '/');
                localStorage.clear();
                this.props.history.push('/');
            })*/

            var quizzesDisplay = sampleQuizzes.map((quiz) => (
                <Row>
                    <Col>
                        <Button className="yellow-button" size="lg" block onClick={() => handleQuizClick(this, quiz.quiz_id)}>
                            <span style={{float: "left"}}>{quiz.question}</span><span style={{float: "right"}}>{convertDate(quiz.date)}</span>
                        </Button>
                    </Col>
                </Row>
            ));

            return quizzesDisplay;

    }

    render() {
        let quizzesDisplay = this.getStudentQuizzes();
        return (
            <div>
                <Sidebar view="student quizzes" />
                <div className="main-area">
                    Student Quizzes
                    {quizzesDisplay}
                </div>
            </div>
        )
    }
}

export default StudentQuizzes;