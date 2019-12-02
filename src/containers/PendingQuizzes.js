import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../components/UI/UI.css';
import { Row, Col, Container, Button } from 'reactstrap';
import PendingQuizModal from './PendingQuizModal';
import * as docCookies from 'doc-cookies';

/**
 * Container for the Pending Quizzes page shown on the Instructor Sidebar
 */
class PendingQuizzes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            quizzesDisplay: null,
            trigger: false
        }
        this.getPendingQuizzes = this.getPendingQuizzes.bind(this);
        this.handleCreateQuizClick = this.handleCreateQuizClick.bind(this);

    }

    componentDidMount() {
        this.getPendingQuizzes();
    }

    handleCreateQuizClick() {
        this.props.history.push(`/instructor/createquiz/${this.props.match.params.userid}/${this.props.match.params.classid}`);
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
                                <Button className="yellow-button" size="lg" block onClick={this.handleCreateQuizClick}>
                                    Create a quiz here
                                </Button>
                                You have not created any quizzes for this class
                            </Container>
                        )
                    }

                    else {
                        console.log('calling pending quiz modal');
                        return(result.map((myquiz) => (
                            <Row>
                                <Col>
                                    <PendingQuizModal quiz={myquiz} this={this} />
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