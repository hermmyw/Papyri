import React from 'react';
import Webcam from 'react-webcam';

import './Register.css';

import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";

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
            submitClicked: false
        };
        this.handleSnapClick1 = this.handleSnapClick1.bind(this);
        this.handleSnapClick2 = this.handleSnapClick2.bind(this);
        this.handleSnapClick3 = this.handleSnapClick3.bind(this);
        this.handleSnapClick4 = this.handleSnapClick4.bind(this);
        this.handleSnapClick5 = this.handleSnapClick5.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
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

    setRef = (webcam) => {
        this.webcam = webcam;
    }

    render() {
        var display, backButton, camera, sample, snap1, snap2, snap3, snap4, snap5, submitButton = null;
        const videoConstraints = {
            width: 200,
            height: 200,
            audio: false,
            facingMode: "user"
        };

        

        if (!this.state.submitClicked) {
            backButton = (
                <div className="right-container">
                    <Row>
                        <Col><Button className="cancel-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Cancel</Button></Col>
                    </Row>
                </div>
            );
    
            submitButton = (
                <div className="right-container">
                    <Row>
                        <Col><Button className="submit-button" block onClick={this.handleSubmitClick}>Submit</Button></Col>
                    </Row>
                </div>
            );

            display = (
                <div className="left-container">
                    <Row><p className="register-info">First name</p></Row>
                    <Row>
                        <Col>
                            <Form>
                                <FormGroup>
                                    <Input className="register-input" type="name" name="firstname" id="exampleFirstName" />
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row><p className="register-info">Last name</p></Row>
                    <Row>
                        <Col>
                            <Form>
                                <FormGroup>
                                    <Input className="register-input" type="name" name="lastname" id="exampleLastName" />
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row><p className="register-info">University ID</p></Row>
                    <Row>
                        <Col>
                        <Form>
                            <FormGroup>
                                <Input className="register-input" type="id" name="id" id="exampleId" />
                            </FormGroup>
                        </Form>
                        </Col>
                    </Row>
                    <Row><p className="register-info">Email</p></Row>
                    <Row>
                    <Col>
                        <Form>
                            <FormGroup>
                                <Input className="register-input" type="email" name="email" id="exampleEmail" />
                            </FormGroup>
                        </Form>
                    </Col>
                    </Row>
                </div>
            );

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
                        <img src={require('./img/face_1.jpeg')} className="register-sample-photo" />
                        <img src={require('./img/face_2.jpeg')} className="register-sample-photo" />
                        <img src={require('./img/face_3.jpeg')} className="register-sample-photo" />
                        <img src={require('./img/face_4.jpeg')} className="register-sample-photo" />
                        <img src={require('./img/face_5.jpeg')} className="register-sample-photo" />
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
                    <img src={this.state.imgData1} className="snap-photo"/>
                );
            } else {
                snap1 = (
                    <div className="box-grey">snapshot</div>
                );
            }

            if (this.state.snapClicked2) {
                snap2 = (
                    <img src={this.state.imgData2} className="snap-photo"/>
                );
            } else {
                snap2 = (
                    <div className="box-grey">snapshot</div>
                );
            }

            if (this.state.snapClicked3) {
                snap3 = (
                    <img src={this.state.imgData3} className="snap-photo"/>
                );
            } else {
                snap3 = (
                    <div className="box-grey">snapshot</div>
                );
            }

            if (this.state.snapClicked4) {
                snap4 = (
                    <img src={this.state.imgData4} className="snap-photo"/>
                );
            } else {
                snap4 = (
                    <div className="box-grey">snapshot</div>
                );
            }

            if (this.state.snapClicked5) {
                snap5 = (
                    <img src={this.state.imgData5} className="snap-photo"/>
                );
            } else {
                snap5 = (
                    <div className="box-grey">snapshot</div>
                );
            }

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
                <div>
                    <div className="right-container"><Row><Col>{camera}</Col></Row></div>
                    <div className="right-container">
                        {sample}
                        <Row>{snap1}{snap2}{snap3}{snap4}{snap5}</Row>
                    </div>
                </div>
                <div>
                    {submitButton}
                    {backButton}
                </div>
            </Container>
        )
    }
} 

export default RegisStudent;