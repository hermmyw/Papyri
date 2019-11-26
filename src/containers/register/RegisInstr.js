import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";
import './Register.css';
import * as docCookies from 'doc-cookies';

const userInfoURL = "http://127.0.0.1:8000/api/user/";
const registerURL = "http://127.0.0.1:8000/api/user/register/";


class RegisInstr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitClicked: false,
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            uid: '',
            error: false,
            errorText: ""
        };
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkAuthorization = this.checkAuthorization.bind(this);
    }

    handleSubmitClick(e) {
        e.preventDefault();
        console.log("instructor submitted!");
        console.log(`Email: ${ this.state.email }`);
        console.log(`Username: ${ this.state.email }`);
        console.log(`Password: ${ this.state.password }`);
        console.log(`First Name: ${ this.state.firstname }`);
        console.log(`Last Name: ${ this.state.lastname }`);
        console.log(`UID: ${ this.state.uid }`);

        // make api call
        fetch(registerURL, {
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
                is_student: false,
                pic1: null,
                pic2: null,
                pic3: null,
                pic4: null,
                pic5: null
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
                    docCookies.setItem('token', result.token, Infinity, '/');
                    this.checkAuthorization();
                }
            )
            .catch (error => {
                console.log("Error: ", error);
                this.setState({
                    errorText: error.message,
                    error: true
                })
            })
    }

    checkAuthorization() {
        console.log("checking whether authentication exists");
        var authenticationField = "Token " + docCookies.getItem('token');
        console.log(authenticationField);
        
        //try {
            fetch(userInfoURL, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'authorization':  authenticationField
                },
            })
                .then(res => {
                    console.log(res);
                    if (res.ok) {
                        return (res.json());
                    }
                    
                    throw Error(res.statusText);
                })
                .then(
                    (result) => {
                        console.log("status:");
                        console.log(result);
                        let userType = result.user_info.is_student;
                        localStorage.setItem('userID', result.user.id);
                        localStorage.setItem('firstName', result.user.first_name);
                        localStorage.setItem('lastName', result.user.last_name);
                        localStorage.setItem('isStudent', userType);
                        localStorage.setItem('uid', result.user_info.uid);

                        if (userType) {
                            localStorage.setItem('user', 'student');
                            this.props.history.push('student/dashboard');
                        }
                        else {
                            localStorage.setItem('user', 'instructor');
                            this.props.history.push('/instructor/dashboard');
                        }
                    }
                )
                .catch (error => {
                    console.log("Error: ", error);
                    docCookies.removeItem('token', '/');
                    localStorage.clear();
                    this.props.history.push('/');
                })
        // } catch (error) {
        //     console.log("Error: ", error);
        //     this.setState({authorizationError: true})
        // }
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
        var display, backButton, errorDisplay = null;

        if (this.state.error) {
            errorDisplay = (
                <FormText style={{color: 'red'}}>There was a problem registering user: {this.state.errorText}. Please try again.</FormText>
            )
        }

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
                                    {errorDisplay}
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