import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Container, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';
import '../components/UI/UI.css';

/**
 * Container for the Create Class page on the Instructor interface.
 * Renders a form to register a new class
 */
class CreateClass extends React.Component {

    constructor(props) {
        super(props);
        this.createClass = this.createClass.bind(this);
    }

    /**
     * Makes an http request to endpoint to register a new class for the instructor.
     */
    createClass() {

    }

    render() {
        return (
            <div>
                <Sidebar view="create class" />
                <div class="main-area">
                    <Form  onSubmit={ e => this.createClass(e) }>
                        <FormGroup>
                            <Input className="custom-input" type="email" name="email" id="className" placeholder="Class Name" />
                        </FormGroup>
                        <FormGroup>
                            <Input className="custom-input" type="password" name="password" id="classYear" placeholder="Year" />
                        </FormGroup>
                        <FormGroup>
                            <Input className="custom-input" type="password" name="password" id="classID" placeholder="ID" />
                        </FormGroup>
                        <FormGroup>
                            <Button className="yellow-button" size="lg" block type="submit">Create New Class</Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
}

export default CreateClass;