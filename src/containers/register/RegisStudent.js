import React from 'react';
import Webcam from 'react-webcam';

import './Register.css';

import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";
import * as docCookies from 'doc-cookies';

const userInfoURL = "http://127.0.0.1:8000/api/user/";
const registerURL = "http://127.0.0.1:8000/api/user/register/";

class RegisStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snapClicked1: false, 
            imgData1: null,
            snapClicked2: false, 
            imgData2: null,
            snapClicked3: false, 
            imgData3: null,
            snapClicked4: false, 
            imgData4: null,
            snapClicked5: false, 
            imgData5: null,
            submitClicked: false,
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            uid: '',
        };
        this.handleSnapClick1 = this.handleSnapClick1.bind(this);
        this.handleSnapClick2 = this.handleSnapClick2.bind(this);
        this.handleSnapClick3 = this.handleSnapClick3.bind(this);
        this.handleSnapClick4 = this.handleSnapClick4.bind(this);
        this.handleSnapClick5 = this.handleSnapClick5.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSnapClick1() {
        console.log("snapped a left90 photo!");
        this.setState(state => ({
            snapClicked1: true
        }));
        const imgSrc = this.webcam.getScreenshot();
        this.setState({imgData1: imgSrc});
    }

    handleSnapClick2() {
        console.log("snapped a left45 photo!");
        this.setState(state => ({
            snapClicked2: true
        }));
        const imgSrc = this.webcam.getScreenshot();
        this.setState({imgData2: imgSrc});
    }

    handleSnapClick3() {
        console.log("snapped a front photo!");
        this.setState(state => ({
            snapClicked3: true
        }));
        const imgSrc = this.webcam.getScreenshot();
        this.setState({imgData3: imgSrc});
    }

    handleSnapClick4() {
        console.log("snapped a right45 photo!");
        this.setState(state => ({
            snapClicked4: true
        }));
        const imgSrc = this.webcam.getScreenshot();
        this.setState({imgData4: imgSrc});
    }

    handleSnapClick5() {
        console.log("snapped a right90 photo!");
        this.setState(state => ({
            snapClicked5: true
        }));
        const imgSrc = this.webcam.getScreenshot();
        this.setState({imgData5: imgSrc});
    }

    handleSubmitClick(e) {
        e.preventDefault();
        console.log("student submitted!");
        /*this.setState(state => ({
            submitClicked: true
        }));*/

        // make api call
        if (!this.state.snapClicked1 ||
            !this.state.snapClicked2 ||
            !this.state.snapClicked3 ||
            !this.state.snapClicked4 ||
            !this.state.snapClicked5) {
                alert("Please provide all profile shots!");
        }
        else {
            console.log(e.target.querySelector("#image1"));
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
                    is_student: true,
                    pic1: this.state.imgData1,
                    pic2: this.state.imgData2,
                    pic3: this.state.imgData3,
                    pic4: this.state.imgData4,
                    pic5: this.state.imgData5,
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

    setRef = (webcam) => {
        this.webcam = webcam;
    }

    render() {
        const { firstname, lastname, uid, email, password} = this.state;
        var display, backButton, camera, sample, snap1, snap2, snap3, snap4, snap5, submitButton = null;
        const videoConstraints = {
            width: 200,
            height: 200,
            audio: false,
            facingMode: "user"
        };

        

        if (!this.state.submitClicked) {

            camera = (
                <Webcam
                        audio={false}
                        height={200}
                        width={200}
                        ref={this.setRef}
                        screenshotFormat='image/jpeg'
                        videoConstraints={videoConstraints}
                />
            );

            sample = (
                <div>
                    <Row>
                        <img src={require('./img/face_1.jpeg')} className="register-sample-photo" alt="sample-1"/>
                        <img src={require('./img/face_2.jpeg')} className="register-sample-photo" alt="sample-2"/>
                        <img src={require('./img/face_3.jpeg')} className="register-sample-photo" alt="sample-3"/>
                        <img src={require('./img/face_4.jpeg')} className="register-sample-photo" alt="sample-4"/>
                        <img src={require('./img/face_5.jpeg')} className="register-sample-photo" alt="sample-5"/>
                    </Row>
                    <Row>
                        <Button className="snap-button" onClick={this.handleSnapClick1}>Snap</Button>
                        <Button className="snap-button" onClick={this.handleSnapClick2}>Snap</Button>
                        <Button className="snap-button" onClick={this.handleSnapClick3}>Snap</Button>
                        <Button className="snap-button" onClick={this.handleSnapClick4}>Snap</Button>
                        <Button className="snap-button" onClick={this.handleSnapClick5}>Snap</Button>
                    </Row>
                </div>

            );
            

            if (this.state.snapClicked1) {
                snap1 = (
                    //<img src={this.state.imgData1} className="snap-photo"/>
                    <input 
                        className="snap-photo"
                        type="image" 
                        name="image1"
                        id="image1"
                        src={this.state.imgData1} />
                );
            } else {
                snap1 = (
                    <div className="box-grey">snapshot</div>
                );
            }

            if (this.state.snapClicked2) {
                snap2 = (
                    <img
                        className="snap-photo" 
                        src={this.state.imgData2} 
                        id="image2"
                        alt="user-2"
                    />
                );
            } else {
                snap2 = (
                    <div className="box-grey">snapshot</div>
                );
            }

            if (this.state.snapClicked3) {
                snap3 = (
                    <img
                        className="snap-photo"
                        src={this.state.imgData3}
                        id="image3"
                        alt="user-3"
                    />
                );
            } else {
                snap3 = (
                    <div className="box-grey">snapshot</div>
                );
            }

            if (this.state.snapClicked4) {
                snap4 = (
                    <img
                        className="snap-photo"
                        src={this.state.imgData4}
                        id="image4"
                        alt="user-4"
                    />
                );
            } else {
                snap4 = (
                    <div className="box-grey">snapshot</div>
                );
            }

            if (this.state.snapClicked5) {
                snap5 = (
                    <img
                        className="snap-photo"
                        src={this.state.imgData5}
                        id="image1"
                        alt="user-5"
                    />
                );
            } else {
                snap5 = (
                    <div className="box-grey">snapshot</div>
                );
            }

            backButton = (
                <div className="right-container">
                    <Row>
                        <Col><Button className="cancel-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Cancel</Button></Col>
                    </Row>
                </div>
            );

            display = (
                <div>
                    <Form onSubmit={ (e) => this.handleSubmitClick(e) }>
                        <div className="left-container">
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label>First Name</Label>
                                        <Input 
                                            className="register-input" 
                                            type="text" 
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
                                            className="register-input" 
                                            type="text" 
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
                                            className="register-input" 
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
                                            className="register-input" 
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
                                            className="register-input" 
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
                                <Col><Button className="submit-button-center" block>Submit</Button></Col>
                            </Row>
                        </div>
                        <div>
                            <div className="right-container"><Row><Col>{camera}</Col></Row></div>
                            <div className="right-container">
                                {sample}
                                <Row>{snap1}{snap2}{snap3}{snap4}{snap5}</Row>
                            </div>
                        </div>
                        <div>
                            {backButton}
                        </div>
                    </Form>
                </div>
            );

        }

        if (this.state.submitClicked) {
            display = (
                <div>
                    <Row>
                        <Col><p>Your submission is successful!</p></Col>
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
                    <Col><p className="register-heading">Become a Student</p></Col>
                </Row>
                <div>{display}</div>
            </Container>
        )
    }
} 

export default RegisStudent;