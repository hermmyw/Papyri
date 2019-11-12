import React from 'react';
import '../styles/index.css';
import './Landing.css';
import '../components/UI/UI.css';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loginClicked: false, registerClicked: false};
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.handleRegisterInstructor = this.handleRegisterInstructor.bind(this);
        this.handleRegisterStudent = this.handleRegisterStudent.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
    }

    handleLoginClick() {
        console.log("login button clicked!");
        this.setState(state => ({
            loginClicked: true
        }));
    }

    handleRegisterClick() {
        this.setState(state => ({
            registerClicked: true
        }));
    }

    handleRegisterInstructor() {
        
    }

    handleRegisterStudent() {

    }

    handleBackClick() {
        this.setState(state => ({
            loginClicked: false,
            registerClicked: false
        }))
    }

    render() {
        var display, backButton = null;

        if (!this.state.loginClicked && !this.state.registerClicked) {
            display = (
                <div>
                    <Row>
                        <Col><Button className="yellow-button" size="lg" block onClick={this.handleLoginClick}>Login</Button></Col>
                    </Row>
                    <Row>
                        <Col><Button className="white-button" size="lg" block onClick={this.handleRegisterClick}>Register</Button></Col>
                    </Row>
                </div>
            );
        }

        else if (this.state.loginClicked) {
            display = (
                <div>
                    <Form>
                        <FormGroup>
                        <Input className="custom-input" type="email" name="email" id="exampleEmail" placeholder="Email" />
                        </FormGroup>
                        <FormGroup>
                        <Input className="custom-input" type="password" name="password" id="examplePassword" placeholder="Password" />
                        </FormGroup>
                    </Form>
                </div>
            );
        }

        else if (this.state.registerClicked) {
            display = (
                <div>
                    <Row>
                        <Col><Button className="yellow-button" size="lg" block onClick={this.handleRegisterInstructor}>I am a Instructor</Button></Col>
                    </Row>
                    <Row>
                        <Col><Button className="white-button" size="lg" block onClick={this.handleRegisterStudent}>I am a Student</Button></Col>
                    </Row>
                </div>
            );
        }

        if (this.state.loginClicked || this.state.registerClicked) {
            backButton = (
                <Row>
                    <Col><Button className="link-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Back</Button></Col>
                </Row>
            );
        }

        return (
            <Container className="narrow-container">
                <Row>
                    <Col><p className="papyri-heading">Papyri</p></Col>
                </Row>
                {display}
                {backButton}
            </Container>
        )
    }
}

export default Landing;