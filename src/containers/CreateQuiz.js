import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

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
            nQuestions: 1
        }
    }

    /**
     * Makes an http request to an endpoint to create a quiz.
     */
    handleSubmit() {


        // go back to quiz page after submit
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
                            <Input className="custom-input" type="textarea" name="quizQuestion" id="quizQuestion" placeholder="Quiz Question" />
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