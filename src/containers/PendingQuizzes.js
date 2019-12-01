import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../components/UI/UI.css';
import { Row, Col, Container } from 'reactstrap';
import PendingQuizModal from './PendingQuizModal';
import * as docCookies from 'doc-cookies';

/**
 * Container for the Pending Quizzes page shown on the Instructor Sidebar
 */
class PendingQuizzes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            quizzesDisplay: null
        }
        this.getPendingQuizzes = this.getPendingQuizzes.bind(this);

    }

    /**
     * makes api call to get list of pending quizzes and creates pretty display
     */
    getPendingQuizzes() {

        const classid = this.props.match.params.classid;
        const unreleasedQuizzesURL = `http://127.0.0.1:8000/api/quiz/list/unreleased/${classid}/`;

        fetch(unreleasedQuizzesURL, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.ok) {
                    return (res.json());
                }
                else {
                    console.log('error thrown');
                    throw Error(res.statusText);
                }
            })
            .then((result) => {
                    console.log("pending quizzes: ", result);

                    if (result.length === 0) {
                        console.log('no pending quizzes');
                        return (
                            <Container>
                                Instructor has not released any quizzes yet!
                            </Container>
                        )
                    }

                    else {
                        console.log('calling pending quiz modal');
                        return(result.map((myquiz) => (
                            <Row>
                                <Col>
                                    <PendingQuizModal quiz={myquiz} />
                                </Col>
                            </Row>
                        )))
                    }
                }
            )
            .then( (display) => {
                this.setState({quizzesDisplay: display});
            })
            .catch ((error) => {
                console.log('error:', error);
                // docCookies.removeItem('token', '/');
                // localStorage.clear();
                // this.props.history.push('/');
            })
    }

    render() {
        this.getPendingQuizzes();

        return (
            <div>
                <Sidebar view="pending quizzes" />
                <div className="main-area">
                    Pending Quizzes
                    {this.state.quizzesDisplay}
                </div>
            </div>
        )
    }
}

export default PendingQuizzes;