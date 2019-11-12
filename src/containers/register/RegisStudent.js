import React from 'react';
import './Register.css';

import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { IoIosArrowBack } from "react-icons/io";


const Camera = (props) => (
    <div className="camera">
    <video id="video" hidden></video>
    <a id="startButton"
      onClick={ props.handleStartClick }
    >Take photo</a>
  </div>
);

const Photo = (props) => (
    <div className="output" hidden>
    <img id="photo" alt="Your photo"
    />
    <a id="saveButton"
      onClick={ props.handleSaveClick }
    >Save Photo</a>
  </div>
);

class Capture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            constraints: {
                audio: false,
                video: {width: 0, height: 300}
            }
        }
        this.handleStartClick = this.handleStartClick.bind(this);
        this.takePicture = this.takePicture.bind(this);
    }

    load() {
        const constraints = this.state.constraints;
        const getUserMedia = (params) => (
            new Promise((successCallback, errorCallback) => {
                navigator.webkitGetUserMedia.call(navigator, params, successCallback, errorCallback);
            })
        );

        getUserMedia(constraints).then((stream) => {
            const video = document.querySelector('video');
            const vendorURL = window.URL || window.webkitURL;

            video.src = vendorURL.createObjectURL(stream);
            video.play();
        }).catch((err) => {
            console.log(err);
        });

        this.clearPhoto();
    }

    clearPhoto() {
        const canvas = document.querySelector('canvas');
        const photo = document.getElementById('photo');
        const context = canvas.getContext('2d');
        const { width, height } = this.state.constraints.video;
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, width, height);

        const data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    takePicture() {
        const canvas = document.querySelector('canvas');
        const context = canvas.getContext('2d');
        const video = document.querySelector('video');
        const photo = document.getElementById('photo');
        const { width, height } = this.state.constraints.video;

        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        const data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    handleStartClick(event) {
        event.preventDefault();
        this.takePicture();
    }

    render() {
        return (
            <div className="capture">
                <Camera handleStartClick={ this.handleStartClick }/>
                <canvas id="canvas"></canvas>
            </div>
          );
    }
}

class RegisStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {snapClicked: false, submitClicked: false};
        this.handleSnapClick = this.handleSnapClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
    }

    handleSnapClick() {
        console.log("snapped a photo!");
        this.setState(state => ({
            snapClicked: true
        }));
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
        var display, backButton, snaps, submitButton = null;
        backButton = (
            <div>
                <Row>
                    <Col><Button className="link-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Back</Button></Col>
                </Row>
            </div>
        );

        submitButton = (
            <Row>
                <Col><Button className="submit-button" block onClick={this.handleSubmitClick}>Submit</Button></Col>
            </Row>
        );

        if (!this.state.submitClicked) {
            display = (
                <div>
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

            snaps = (
                <div>
                    <Row>
                        <img src={require('./img/face_1.jpeg')} className="register-sample-photo" />
                        <img src={require('./img/face_2.jpeg')} className="register-sample-photo" />
                        <img src={require('./img/face_3.jpeg')} className="register-sample-photo" />
                        <img src={require('./img/face_4.jpeg')} className="register-sample-photo" />
                        <img src={require('./img/face_5.jpeg')} className="register-sample-photo" />
                    </Row>
                    <Row>
                        <Button className="snap-button">Snap</Button>
                        <Button className="snap-button">Snap</Button>
                        <Button className="snap-button">Snap</Button>
                        <Button className="snap-button">Snap</Button>
                        <Button className="snap-button">Snap</Button>
                    </Row>

                    <Row>
                        <div className="box-grey">snapshot</div>
                        <div className="box-grey">snapshot</div>
                        <div className="box-grey">snapshot</div>
                        <div className="box-grey">snapshot</div>
                        <div className="box-grey">snapshot</div>
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
                    <Col><p className="register-heading">Become a Student</p></Col>
                </Row>
                <div className="left-container">{display}</div>
                <div className="right-container"><Capture />{snaps}</div>
                <div>
                    {submitButton}
                    {backButton}
                </div>
            </Container>
        )
    }
} 

export default RegisStudent;