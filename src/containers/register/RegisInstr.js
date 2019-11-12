import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";
import './Register.css';

class RegisInstr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {submitClicked: false};
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
    }

    handleSubmitClick() {
        console.log("student submitted!");
        this.setState(state => ({
            submitClicked: true
        }));
    }

    handleBackClick() {
        console.log("go back!");
        this.setState(state => ({
            snapClicked: false,
            submitClicked: false
        }));
        this.props.history.push('/');
    }

    render() {
        var display, backButton, submitButton = null;
        if (!this.state.submitClicked) {
            display = (
                <div>
                    <Row><Col><p className="register-info">First name</p></Col></Row>
                    <Row>
                        <Col>
                            <Form>
                                <FormGroup>
                                    <Input className="register-input-center" type="name" name="firstname" id="exampleFirstName" />
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row><Col><p className="register-info">Last name</p></Col></Row>
                    <Row>
                        <Col>
                            <Form>
                                <FormGroup>
                                    <Input className="register-input-center" type="name" name="lastname" id="exampleLastName" />
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row><Col><p className="register-info">University ID</p></Col></Row>
                    <Row>
                        <Col>
                        <Form>
                            <FormGroup>
                                <Input className="register-input-center" type="id" name="id" id="exampleId" />
                            </FormGroup>
                        </Form>
                        </Col>
                    </Row>
                    <Row><Col><p className="register-info">Email</p></Col></Row>
                    <Row>
                    <Col>
                        <Form>
                            <FormGroup>
                                <Input className="register-input-center" type="email" name="email" id="exampleEmail" />
                            </FormGroup>
                        </Form>
                    </Col>
                    </Row>
                </div>
            );

            submitButton = (
                <div>
                    <Row>
                        <Col><Button className="submit-button-center" block onClick={this.handleSubmitClick}>Submit</Button></Col>
                    </Row>
                </div>
            );

            backButton = (
                <div>
                    <Row>
                        <Col><Button className="link-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Back</Button></Col>
                    </Row>
                </div>
            );
        }

        if (this.state.submitClicked) {
            display = (
                <div>
                    <Row>
                        <Col>Your submission is successful!</Col>
                    </Row>
                    
                </div>
            );
            backButton = (
                <div>
                    <Row>
                        <Col><Button className="link-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Back to Login</Button></Col>
                    </Row>
                </div>
            );
        }

        return (
            <Container className="wide-container">
                <Row>
                    <Col><p className="register-heading">Become an Instructor</p></Col>
                </Row>
                <div>
                    {display}
                    {submitButton}
                    {backButton}
                </div>
            </Container>
        )
    }
} 

export default RegisInstr;