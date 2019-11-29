import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../components/UI/UI.css';
import { Row, Col } from 'reactstrap';
import PendingQuizModal from '../functions/PendingQuizModal';
import * as docCookies from 'doc-cookies';

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
 * Container for the Pending Quizzes page shown on the Instructor Sidebar
 */
class PendingQuizzes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            clickedQuizID: 34523
        }
        this.getPendingQuizzes = this.getPendingQuizzes.bind(this);

    }

    /**
     * makes api call to get list of pending quizzes and creates pretty display
     */
    getPendingQuizzes() {

        const classid = this.props.match.params.classid;
        const unreleasedQuizzesURL = `http://127.0.0.1:8000/api/quiz/list/unreleased/${classid}/`;

        /* fetch(unreleasedQuizzesURL, {
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
                        <PendingQuizModal quiz={quiz} />
                    </Col>
                </Row>
            ));

            return quizzesDisplay;

    }

    render() {
        let quizzesDisplay = this.getPendingQuizzes();

        return (
            <div>
                <Sidebar view="pending quizzes" />
                <div className="main-area">
                    Pending Quizzes
                    {quizzesDisplay}
                </div>
            </div>
        )
    }
}

export default PendingQuizzes;