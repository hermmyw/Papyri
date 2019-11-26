import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Row, Col, Button, Form, FormGroup, Input, Label, FormFeedback, FormText} from 'reactstrap';
import '../components/UI/UI.css';
import { IoIosArrowBack } from "react-icons/io";


/**
 * Container for the Create Class page on the Instructor interface.
 * Renders a form to register a new class
 */
class EnrollClass extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            registrationCode: '',
            failedToEnroll: false,
            enrolled: false,
            classID: '',
            className: ''
        }
        
        this.enrollClass = this.enrollClass.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
    }

    /**
     * Makes an http request to endpoint to register a new class for the instructor.
     */

    enrollClass() {
        console.log("enrolling in class");

        // REPLACE WITH API CALL
        // response from api call
        // test input
        var response = {
            enrolled: false,
            classID: "123456",
            className: "CS130"
        }
        /////////////////////

        if (response.enrolled) {
            this.setState({
                enrolled: true,
                classID: response.classID,
                className: response.className
            });
        }

        else {
            this.setState({failedToEnroll: true});
        }
    }

    handleRegistrationCodeChange(e) {
        this.setState({
            registrationCode: e.target.value,
            failedToEnroll: false
        });
    }

    handleBackClick() {
        this.setState({
            registrationCode: '',
            failedToEnroll: false,
            enrolled: false,
            classID: '',
            className: ''
        })
    }

    render() {
        console.log("rendering");
        console.log(this.state);

        var display, inputField = null;

        if (this.state.failedToEnroll) {
            inputField = (
                <FormGroup>
                    <Label>Enroll in a Class</Label>
                    <Input 
                        className="custom-input" 
                        type="text"
                        onChange={ (e) => this.handleRegistrationCodeChange(e) }
                        value={this.state.registrationCode} 
                        placeholder="Registration Code" 
                        invalid />
                    <FormText style={{color: 'red'}}>Registration code not valid</FormText>
                    <FormText>Ask instructor for registration code</FormText>
                </FormGroup>
            )
        }

        else {
            inputField = (
                <FormGroup>
                    <Label>Enroll in a Class</Label>
                    <Input 
                        className="custom-input" 
                        type="text"
                        onChange={ (e) => this.handleRegistrationCodeChange(e) }
                        value={this.state.registrationCode} 
                        placeholder="Registration Code" />
                    <FormText>Ask instructor for registration code</FormText>
                </FormGroup>
            )
        }

        if (this.state.enrolled) {
            display = (
                <div>
                    <Sidebar view="create class" />
                    <div className="main-area">
                        Success! You have enrolled in {this.state.className}
                        <Row>
                            <Col><Button className="link-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Enroll in another class</Button></Col>
                        </Row>
                    </div>
                </div>
            )
        }

        else {
            display = (
                <div>
                    <Sidebar view="create class" />
                    <div className="main-area">
                        <Form>
                            {inputField}
                            <FormGroup>
                                <Button className="yellow-button" size="lg" block onClick={this.enrollClass}>Enroll In Class</Button>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {display}
            </div>
        )
    }
}

export default EnrollClass;