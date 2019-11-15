import React from 'react';
import Sidebar from '../components/Sidebar.js';

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
        this.createQuiz = this.createQuiz.bind(this);
    }

    /**
     * Makes an http request to an endpoint to create a quiz.
     */
    createQuiz() {

    }

    render() {
        return (
            <div>
                <Sidebar view="create quiz" />
                <div className="main-area">
                    <p>Create Quiz</p>
                </div>
            </div>
        )
    }
}

export default CreateQuiz;