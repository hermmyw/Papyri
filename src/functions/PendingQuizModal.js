import React from 'react';
import '../components/UI/UI.css';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import convertDate from './convertDate';
import * as docCookies from 'doc-cookies';


var sampleQuizzesWithAnswers = {
    34523: {
        question: "What is the definition of strategy design pattern?",
        date: "2019-09-25",
        answers: ['answer1', 'answer2', 'answer3', 'answer4'],
        correct_answer: 2
    },
    65456: {
        question: "What is the definition of observer design pattern?",
        date: "2019-10-25",
        answers: ['answer1', 'answer2', 'answer3', 'answer4'],
        correct_answer: 1
    },
    78768: {
        question: "What is the definition of factory method design pattern?",
        date: "2019-11-25",
        answers: ['answer1', 'answer2', 'answer3', 'answer4'],
        correct_answer: 0
    },
}



class PendingQuizModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            released: false,
            closed: false
        }

        this.toggle = this.toggle.bind(this);
        this.handleCloseQuiz = this.handleCloseQuiz.bind(this);
        this.handleReleaseQuiz = this.handleReleaseQuiz.bind(this);
    }


    getQuizInfo = () => {
        console.log(this.props.quiz);
        const unreleasedQuizURL = `http://127.0.0.1:8000/api/quiz/list/question/${this.props.quiz.quiz_id}`;

        /* fetch(unreleasedQuizURL, {
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
                    console.log("quiz info:");
                    console.log(result);

                    let answerLabel = ['A', 'B', 'C', 'D']

                    var answersDisplay = result.answers.map((answer, idx) => {
                        var answerButton = (
                            <Button className="white-button" size="lg" block>
                                {answerLabel[idx]}: {answer}
                            </Button>
                        )

                        if (idx === result.correct_answer) {
                            var answerButton = (
                                <Button className="yellow-button" size="lg" block>
                                    {answer}
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
                        </Container>
                    )

                    return quizDisplay;
                }
            )
            .catch (error => {
                
                docCookies.removeItem('token', '/');
                localStorage.clear();
                comp.props.history.push('/');
            }) */

            let answerLabel = ['A', 'B', 'C', 'D'];
            let result = sampleQuizzesWithAnswers[this.props.quiz.quiz_id];

            var answersDisplay = result.answers.map((answer, idx) => {
                var answerButton = (
                    <Button className="white-button" size="lg" block>
                        {answerLabel[idx]}: {answer}
                    </Button>
                )

                if (idx === result.correct_answer) {
                    var answerButton = (
                        <Button className="yellow-button" size="lg" block>
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
                </Container>
            )

            return quizDisplay;
    }

    toggle() {
        this.setState(prevState => ({
            show: !prevState.show
        }));
    }

    handleReleaseQuiz() {
        const releaseQuizURL = `http://127.0.0.1:8000/api/quiz/activate/${this.props.quiz.quiz_id}`;

        /*fetch(releaseQuizURL, {
            method: "PUT",
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
            .catch (error => {
                
                docCookies.removeItem('token', '/');
                localStorage.clear();
                this.props.history.push('/');
            });*/

        this.setState({
            released: true
        });
    }

    handleCloseQuiz() {
        const closeQuizURL = `http://127.0.0.1:8000/api/quiz/release/${this.props.quiz.quiz_id}`;

        /*fetch(closeQuizURL, {
            method: "PUT",
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
            .catch (error => {
                docCookies.removeItem('token', '/');
                localStorage.clear();
                this.props.history.push('/');
            });*/

        this.setState({
            closed: true
        })
    }
  
    render() {
        var activateButton = null;
        if (this.state.released) {
            activateButton = (
                <Button color="danger" onClick={this.handleCloseQuiz}>Close Quiz</Button>
            )
        }

        else if (!this.state.released) {
            activateButton = (
                <Button color="success" onClick={this.handleReleaseQuiz}>Open Quiz</Button>
            )
        }

        return (
            <div>
                <Button className="yellow-button" size="lg" block onClick={this.toggle}>
                    <span style={{float: "left"}}>{this.props.quiz.question}</span><span style={{float: "right"}}>{convertDate(this.props.quiz.date)}</span>
                </Button>
                <Modal isOpen={this.state.show} toggle={this.toggle} className={this.props.className}>
                    <ModalBody>
                        {this.getQuizInfo()}

                    </ModalBody>
                    <ModalFooter>
                        {activateButton}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default PendingQuizModal;