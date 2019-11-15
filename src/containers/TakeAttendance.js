import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Container, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';

/**
 * Container for the Take Attendance page shown on the Instructor Sidebar
 */
class TakeAttendance extends React.Component {

    constructor(props) {
        super(props);
        this.takeAttendance = this.takeAttendance.bind(this);
    }

    /**
     * Prompts students to take attendance on their screens
     */
    takeAttendance() {

    }

    render() {
        return (
            <div>
                <Sidebar view="take attendance" />
                <div className="main-area">
                    <Form  onSubmit={ e => this.takeAttendance(e) }>
                        <FormGroup>
                            <Button className="yellow-button" size="lg" block type="submit">Take Attendance</Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
}

export default TakeAttendance;