import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Container, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';

/**
 * Container for the Pending Quizzes page shown on the Instructor Sidebar
 */
class PendingQuizzes extends React.Component {

    constructor(props) {
        super(props);
        this.getPendingQuizzes = this.getPendingQuizzes.bind(this);
    }

    /**
     * makes api call to get list of pending quizzes and creates pretty display
     */
    getPendingQuizzes() {

    }

    render() {
        return (
            <div>
                <Sidebar view="pending quizzes" />
                <div className="main-area">
                    Pending Quizzes
                </div>
            </div>
        )
    }
}

export default PendingQuizzes;