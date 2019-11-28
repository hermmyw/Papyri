import React from 'react';
import '../styles/index.css';
import './Landing.css';
import '../components/UI/UI.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './Dashboard.css';
import Sidebar from '../components/Sidebar.js';
import Modal from 'react-bootstrap/Modal';
import Webcam from 'react-webcam';
import headshot from './images/headshot.png';

class StudentClass extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            class_id: this.props.class_id,
            student_id: this.props.student_id,
            name: this.props.name,
            profilePic: this.props.profilePic,
            attended: this.props.attended,
            missed: this.props.missed,
            submittedQuiz: false,
            active: false,
            userPhoto: null,
        };
        this.handleAttendance = this.handleAttendance.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.postData = this.postData.bind(this);
        //this.setWebcamRef = this.setWebcamRef.bind(this);
        this.handleExitClass = this.handleExitClass.bind(this);
    }

    componentDidMount() {
        console.log(this.state.class_id);
        this.postData();
        this.fetchData();
    }

    postData() {
        // post student id and class id
    }

    fetchData() {
        // get attendance dates, missed dates, active state, and current quiz
       // GET request
    //    fetch("...") //TODO
    //    .then(res => res.json())
    //    .then(function(data) {
    //        this.state.attended = JSON.parse(data.attendedDates);
    //        this.state.missed = JSON.parse(data.missedDates);
    //     })
    //    .catch(error => console.log('parsing failed', error));

        // Dummy data
        this.setState(state => ({
            attended: [
                new Date(2019, 10, 4),
                new Date(2019, 10, 11),
                new Date(2019, 10, 6),
                new Date(2019, 10, 13),
            ],
            missed: [
                new Date(2019, 10, 18),
                new Date(2019, 10, 20),
            ],
            active: true,
        }));
    }

    handleSubmit(e) {
        this.setState(state => ({
            submittedQuiz: true
        }));
        e.preventDefault();
        console.log('submitted');
        fetch("http://127.0.0.1:8000/api/quiz/create", { // TODO
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // TODO
            }),
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result);
                    }
                )
    }

    handleAttendance(classid) {
        console.log("click attendance");
        console.log(classid);
        this.setState(state => ({
            attemptAttendance: true,
            modalShow: true
        }));
        console.log(classid);
    }

    handleModalSubmit() {
        const img = this.webcam.getScreenshot();
        this.setState(state => ({
            modalShow: false,
            userPhoto: img
        }));
        this.setState({userPhoto: img});

        console.log(this.state.class_id, this.state.student_id, this.state.userPhoto);

        //post snapshot and student id 
        fetch("http://127.0.0.1:8000/api/attendance/attend/", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lecture_id: this.state.classid,
                student_id: this.state.studentid,
                img: this.state.userPhoto
            }),
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                }
            )
    }

    setWebcamRef = (webcam) => {
        this.webcam = webcam;
    }

    handleExitClass() {
        localStorage.removeItem('classid');
        let userID = this.props.match.params.userid;
        this.props.history.push(`/student/${userID}`);
    }

    render() {
        const videoConstraints = {
            width: 200,
            height: 200,
            audio: false,
            facingMode: "user"
        };

        const modifiers = {
            attended: this.state.attended,
            missed: this.state.missed
            
        };

        const modifiersStyles = {
            attended: {
                color: 'white',
                backgroundColor: 'green',
                
            },

            missed: {
                color: 'white',
                backgroundColor: 'red',
            }
        }

        var attendanceButton, cameraModal = null;
        console.log(this.state.active);
        if (this.state.active === true) {
            attendanceButton = (
                // TODO: ButtonToggle
                <Button variant="success" onClick={() => this.handleAttendance(this.state.classid)}>Take Attendance</Button>
            );
            cameraModal = (
                <Modal
                    show={this.state.modalShow}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={() => (this.setState({modalShow: false}))}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Take Attendance
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Webcam
                            audio={false}
                            height={250}
                            width={250}
                            screenshotFormat='image/jpeg'
                            ref={this.setWebcamRef}
                            videoConstraints={videoConstraints}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.handleModalSubmit()}>submit</Button>
                    </Modal.Footer>
                </Modal>
            );
        } else if (this.state.active === false) {
            attendanceButton = (
                <Button variant="secondary" onClick={() => this.handleAttendance(this.state.classid)} disabled>Take Attendance</Button>
            );
        }

        return (
            <Container>
                <Sidebar view="class home"/>
                <Row>
                <Col>
                    <div className="main-content">
                        <Row>
                            <Col><Button className="yellow-button" size="lg" block onClick={this.handleExitClass}>Exit Class</Button></Col>
                        </Row>
                        <h3 className="subheader">Attendance</h3>
                        <div className="calendar">
                            <Row>
                                <Col>
                                    <DayPicker 
                                        className="day-picker"
                                        modifiers={modifiers}
                                        modifiersStyles={modifiersStyles}
                                        showOutsideDays
                                    />
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            <Col>
                                {attendanceButton}
                                {cameraModal}
                            </Col>
                        </Row>
                        <Card className="quiz">
                        <Card.Header as="h5">Current Quiz</Card.Header>
                        <Card.Body>
                            <Card.Title>Question Body</Card.Title>
                            <Button className="quiz-option" variant="outline-dark">Choice 1</Button><br/>
                            <Button className="quiz-option" variant="outline-dark">Choice 2</Button><br/>
                            <Button className="quiz-option" variant="outline-dark">Choice 3</Button><br/>
                            <Button className="quiz-option" variant="outline-dark">Choice 4</Button><br/>
                            <Button 
                                className="quiz-option"
                                variant="primary"
                                type="submit"
                                onClick={ (e) => this.handleSubmit(e) }
                            >submit</Button>
                        </Card.Body>
                        </Card>
                    </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default StudentClass;