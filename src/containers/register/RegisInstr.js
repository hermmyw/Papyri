import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";
import Topbar from "../../components/Topbar.js"
import './Register.css';
import authorization from '../../functions/authorization'
import * as docCookies from 'doc-cookies';
import '../Dashboard.css';

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
                    authorization(this);
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
                        {/* <Row>
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
                        </Row> */}
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
            <div>
            
            <div className="regular-container">
            <Topbar/>
            <Container className="wide-container">
                
                    <p className="register-heading">Become an Instructor</p>
                
                <div>
                    {display}
                    {backButton}
                </div>
            </Container>
            </div>
            </div>
        )
    }
} 

export default RegisInstr;