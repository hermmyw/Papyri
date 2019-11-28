import React from 'react';
import Sidebar from '../components/SidebarStudent.js';
import { Row, Col, Button, Form, FormGroup, Input, Label, FormFeedback, FormText} from 'reactstrap';
import '../components/UI/UI.css';
import { IoIosArrowBack } from "react-icons/io";

const enrollClassURL = "http://127.0.0.1:8000/api/classes/student/";


/**
 * Container for the Enroll in Class page on the Student interface.
 * Renders a form to enroll in a new class
 */
class EnrollClass extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            registrationCode: '',
            failedToEnroll: false,
            enrolled: false,
            error: false,
            errorText: ''
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

        fetch(enrollClassURL, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: localStorage.getItem('userID'),
                registration_code: this.state.registrationCode
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

                    // user object and authentication token
                    console.log(result);
                    localStorage.push('classID', result.class_id);
                    this.props.history.push('/student/class')
                }
            )
            .catch (error => {
                console.log("Error: ", error);
                this.setState({
                    failedToEnroll: true
                })
            })
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
                    <Sidebar view="enroll class" />
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
                    <Sidebar view="enroll class" />
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