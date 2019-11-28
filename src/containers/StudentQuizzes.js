import React from 'react';
import Sidebar from '../components/Sidebar';
import { Container, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';

/**
 * Container for the Pending Quizzes page shown on the Instructor Sidebar
 */
class StudentQuizzes extends React.Component {

    constructor(props) {
        super(props);
        this.getStudentQuizzes = this.getStudentQuizzes.bind(this);
    }

    /**
     * makes api call to get list of pending quizzes and creates pretty display
     */
    getStudentQuizzes() {

    }

    render() {
        return (
            <div>
                <Sidebar view="student quizzes" />
                <div className="main-area">
                    Student Quizzes
                </div>
            </div>
        )
    }
}

export default StudentQuizzes;