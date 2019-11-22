import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";
import './Register.css';

const proxyurl = "https://cors-anywhere.herokuapp.com/";

class RegisInstr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitClicked: false,
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            uid: ''
        };
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmitClick(e) {
        e.preventDefault();
        console.log("instructor submitted!");
        console.log(`Email: ${ this.state.email }`)
        /*this.setState(state => ({
            submitClicked: true
        }));*/

        // make api call
        fetch("http://127.0.0.1:8000/api/user/register/", {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username:  this.state.email,
                email: this.state.email,
                password: this.state.password,
                first_name: this.state.firstname,
                last_name: this.state.lastname,
                uid: this.state.uid,
                is_student: false
            }),
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                }
            )
    }

    handleBackClick() {
        console.log("go back!");
        this.setState(state => ({
            snapClicked: false,
            submitClicked: false
        }));
        this.props.history.push('/');
    }
    
    handleChange = async (event) => {
        const { target } = event;
        const value = target.value;
        const { name } = target;
        await this.setState({
            [ name ]: value,
        });
    }

    render() {
        const { firstname, lastname, uid, email, password } = this.state;
        var display, backButton = null;
        if (!this.state.submitClicked) {
            display = (
                <div>
                    <Form onSubmit={ (e) => this.handleSubmitClick(e) }>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>First Name</Label>
                                    <Input 
                                        className="register-input-center" 
                                        type="name" 
                                        name="firstname" 
                                        id="exampleFirstName" 
                                        value={ firstname }
                                        onChange={ (e) => {
                                            this.handleChange(e)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>Last Name</Label>
                                    <Input 
                                        className="register-input-center" 
                                        type="name" 
                                        name="lastname" 
                                        id="exampleLastName" 
                                        value={ lastname }
                                        onChange={ (e) => {
                                            this.handleChange(e)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <FormGroup>
                                <Label>University ID</Label>
                                <Input 
                                    className="register-input-center" 
                                    type="id" 
                                    name="uid" 
                                    id="exampleId" 
                                    value={ uid }
                                    onChange={ (e) => {
                                        this.handleChange(e)
                                    }}
                                />
                            </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>Email</Label>
                                    <Input 
                                        className="register-input-center" 
                                        type="email" 
                                        name="email" 
                                        id="exampleEmail"
                                        value={ email }
                                        onChange={ (e) => {
                                            this.handleChange(e)
                                        }} 
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>Password</Label>
                                    <Input 
                                        className="register-input-center" 
                                        type="password" 
                                        name="password" 
                                        id="examplePassword" 
                                        value={password}
                                        onChange={ (e) => {
                                            this.handleChange(e)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col><Button type="submit" className="submit-button-center" block>Submit</Button></Col>
                        </Row>
                    </Form>
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
                    {backButton}
                </div>
            </Container>
        )
    }
} 

export default RegisInstr;