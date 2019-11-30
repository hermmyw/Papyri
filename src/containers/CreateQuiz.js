import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

const createQuizURL = "http://127.0.0.1:8000/api/quiz/create/";

/**
 * Container for the Create Quiz page on the Instructor interface 
 * Renders form for Instructor to create a multiple choice quiz
 */
class CreateQuiz extends React.Component {

    /**
     *
     * Constructor for CreateQuiz component.
     * @@param {array} props Properties that are passed into element when being used
     */
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleAddAnswer = this.handleAddAnswer.bind(this);
        this.state = {
            quizName: '',
            quizQuestion: '',
            nQuestions: 1
        }
    }


    handleChange(e) {
        this.setState({
            [ e.target.name ]: e.target.value,
        });
    }

    /**
     * api call to add answer choices to a particular quiz
     * user should be brought to pending quizzes page after submitting quiz
     * @param {*} e event 
     */
    addAnswersCall(e) {
        fetch(createQuizURL, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.quizName,
                description: this.state.quizQuestion,
                class_id: localStorage.getItem('classID')
            }),
        })
            .then(res => {
                if (res.ok) {
                    return(res.json());
                }

                throw Error(res.statusText);
            })
            .then(
                (result) => {

                    const userID = this.props.match.params.userid;
                    const classID = this.props.match.params.classid;
                    console.log(result);
                    this.props.history.push(`/instructor/pendingquizzes/${userID}/${classID}`)
                }
            )
            .catch (error => {
                console.log("Error: ", error);
                this.setState({
                    errorText: error.message,
                    error: true
                })
            })
    }

    /**
     * Makes an http request to an endpoint to create a quiz.
     */
    handleSubmit(e) {


        // go back to quiz page after submit
        fetch(createQuizURL, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.quizName,
                description: this.state.quizQuestion,
                class_id: this.props.match.params.classid
            }),
        })
            .then(res => {
                if (res.ok) {
                    return(res.json());
                }

                throw Error(res.statusText);
            })
            .then(
                (result) => {
                    const userID = this.props.match.params.userid;
                    const classID = this.props.match.params.classid;
                    console.log(result);
                    this.props.history.push(`/instructor/pendingquizzes/${userID}/${classID}`)
                }
            )
            .catch (error => {
                console.log("Error: ", error);
                this.setState({
                    errorText: error.message,
                    error: true
                })
            })
    }

    render() {

        return (
            <div>
                <Sidebar view="create quiz" />
                <div className="main-area">
                    <div>
                        <Form  onSubmit={ e => this.handleSubmit(e) }>
                            <FormGroup>
                                <Label>Quiz Question</Label>
                                <Input 
                                    className="custom-input" 
                                    type="textarea" 
                                    name="quizQuestion" 
                                    id="quizQuestion" 
                                    placeholder="Quiz Question"
                                    value={this.state.quizName} />
                                <Input 
                                    className="custom-input" 
                                    type="textarea" 
                                    name="quizName" 
                                    id="quizName" 
                                    placeholder="Quiz Name"
                                    value={this.state.quizQuestion} />
                            </FormGroup>
                            <AnswerList />
                            <FormGroup>
                                <Button className="yellow-button" size="lg" block onClick={this.handleSubmit}>Add Quiz</Button>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

class AnswerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [{ answer: "" }]
        };

        console.log("constructor: ")
        console.log(this.state.answers);
    }

    handleUpdateValue = (id, e) => {
        console.log("update value: ");
        const newAnswers = this.state.answers.map((currAnswer, index) => {
            if (id !== index) return currAnswer;
            return {...currAnswer, answer: e.target.value };
        });
        this.setState({ answers: newAnswers })
    }

    handleAddAnswer = () => {
        console.log("add answer pressed");
        this.setState({
            answers: this.state.answers.concat([{answer: ""}])
        });
        console.log(this.state.answers);
    }

    handleDeleteAnswer = id => {
        console.log("delete answer: " + id);
        const newAnswers = this.state.answers.filter((currAnswer, index) => id !== index);
        this.setState({ answers: newAnswers });
    }

    render() {
        console.log("rendering: ")
        console.log(this.state.answers);
        var button = null;
        if (this.state.answers.length < 5) {
            button = (
                <FormGroup>
                    <Button 
                        className="yellow-button" 
                        size="lg" 
                        block 
                        onClick={this.handleAddAnswer}>Add Answer</Button>
                </FormGroup>
            )
        }

        return (
            <div>
                <Sidebar view="create quiz" />
                {this.state.answers.map((currAnswer, id) => 
                    <FormGroup key={id}>
                        <Input 
                            className="custom-input" 
                            type="text"
                            id={id} 
                            placeholder="Quiz Answer" 
                            onChange={this.handleUpdateValue.bind(undefined, id)}
                            value={currAnswer.answer}
                        />
                        <Button 
                            className="yellow-button" 
                            size="lg" 
                            block 
                            onClick={() => this.handleDeleteAnswer(id)}
                        >
                                delete answer</Button>
                    </FormGroup>
                )}
                {button}
            </div>
        )
    }
}

export default CreateQuiz;