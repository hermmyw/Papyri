import React from 'react';
import '../components/UI/UI.css';
import { Container, Row,  Button, Modal,  ModalBody, ModalFooter } from 'reactstrap';
import convertDate from '../functions/convertDate';
//import * as docCookies from 'doc-cookies';

class PendingQuizModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            released: this.props.quiz.released,
            active: this.props.quiz.active,
            closed: false,
            answers: [
                this.props.quiz.answer_0,
                this.props.quiz.answer_1,
                this.props.quiz.answer_2,
                this.props.quiz.answer_3
            ]
        }

        this.toggle = this.toggle.bind(this);
        this.handleCloseQuiz = this.handleCloseQuiz.bind(this);
        this.handleReleaseQuiz = this.handleReleaseQuiz.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            show: !prevState.show
        }));
    }

    handleReleaseQuiz() {
        const releaseQuizURL = `http://127.0.0.1:8000/api/quiz/activate/${this.props.quiz.id}/`;

        fetch(releaseQuizURL, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                console.log('released quiz: ', res);
                if (res.ok) {
                    var resjson = res.json();
                    console.log(resjson);
                    this.setState({
                        active: true
                    });
                }

                else {
                    throw Error(res.statusText);
                }
                
                
            })
            .catch (error => {
                alert(error);
                console.log('activate quiz error: ', error)
                // docCookies.removeItem('token', '/');
                // localStorage.clear();
                // this.props.history.push('/');
            });

    }

    handleCloseQuiz() {
        const closeQuizURL = `http://127.0.0.1:8000/api/quiz/release/${this.props.quiz.id}/`;
        fetch(closeQuizURL, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                console.log(res);
                if (res.ok) {
                    console.log('closed quiz: ', res.json());
                    this.props.this.setState({
                        released: true,
                        active: false
                    })
                    this.setState({
                        released: true,
                        active: false
                    })
                }
                else {
                    throw Error(res.statusText);
                }
                
            })
            .catch (error => {
                console.log('close quiz error: ', error);
                // docCookies.removeItem('token', '/');
                // localStorage.clear();
                // this.props.history.push('/');
            });

    }
  
    render() {
        console.log('rendering modals');
        console.log('states: ', this.state);
        const thisQuiz = this.props.quiz;
        var activateButton = null;
        if (this.state.active) {
            activateButton = (
                <Button color="danger" onClick={this.handleCloseQuiz}>Close Quiz</Button>
            )
        }

        else if (!this.state.active && !this.state.released) {
            activateButton = (
                <Button color="success" onClick={this.handleReleaseQuiz}>Open Quiz</Button>
            )
        }

        let answerLabel = ['A', 'B', 'C', 'D'];
        var answersDisplay = this.state.answers.map((answer, idx) => {
            var answerButton = (
                <Button className="white-button" size="lg" block>
                    {answerLabel[idx]}: {answer}
                </Button>
            )

            if (idx === thisQuiz.correct_answer) {
                answerButton = (
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

        var modalBodyDisplay = (
            <Container>
                <Row>
                    {thisQuiz.question}
                </Row>
                {answersDisplay}
            </Container>
        );

        return (
            <div>
                <Button className="yellow-button" size="lg" block onClick={this.toggle}>
                    <span style={{float: "left"}}>{thisQuiz.question}</span><span style={{float: "right"}}>{convertDate(thisQuiz.time_created.substring(0, 10))}</span>
                </Button>
                <Modal isOpen={this.state.show} toggle={this.toggle} className={this.props.className}>
                    <ModalBody>
                        {modalBodyDisplay}

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