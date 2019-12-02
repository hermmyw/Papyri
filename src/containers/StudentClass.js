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
import { getDistance } from 'geolib';

class StudentClass extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            student_id: this.props.student_id,
            name: this.props.name,
            profilePic: this.props.profilePic,
            attended: null,
            missed: null,
            submittedQuiz: false,
            active: (localStorage.getItem('isClassActive') === 'true'),
            lat: null,
            long: null,
            userPhoto: null,
            mostRecentLecture: localStorage.getItem('mostRecentLecture'),
            currentQuiz: [],
            selectedAnswer: null
        };
        this.handleAttendance = this.handleAttendance.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchAttendanceData = this.fetchAttendanceData.bind(this);
        this.getCurrentQuiz = this.getCurrentQuiz.bind(this);
        //this.setWebcamRef = this.setWebcamRef.bind(this);
        this.handleExitClass = this.handleExitClass.bind(this);
    }

    componentDidMount() {
        console.log('state: ', this.state);
        console.log('local storage: ', localStorage);
        this.fetchAttendanceData();
        this.getCurrentQuiz();
        this.getLectures();
    }

    getLectures() {
        console.log("lectures");
        fetch(`http://127.0.0.1:8000/api/attendance/${this.props.match.params.classid}`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log('lectures: ', result);
                if (result.length > 0) {
                    this.setState({
                        lat: result[0].latitude,
                        long: result[0].longitude,
                        active: result[0].in_session
                    });
                }
                else {
                    this.setState({
                        lat: null,
                        long: null,
                        active: false
                    });
                }
                
            })
    }


    handleSelectAnswer(answer) {
        this.setState({selectedAnswer: answer});
    }

    getCurrentQuiz() {
        console.log('classid: ', this.props.match.params.classid);
        fetch(`http://127.0.0.1:8000/api/quiz/list/active/${this.props.match.params.classid}`, { 
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((result) => {
            console.log("current quiz", result);
            this.setState({currentQuiz: result});
        })
    }


    fetchAttendanceData() {
        fetch(`http://127.0.0.1:8000/api/attendance/${this.props.match.params.classid}/${this.props.match.params.userid}`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log('attended data: ', result);
                return (
                    [
                        result.days_attended.map((record) =>{
                            var y = record.date.substring(0, 4);
                            var m = record.date.substring(5, 7) - 1;
                            var d = record.date.substring(8, 10);
                            return (
                                new Date(y, m, d)
                            )
                        }),
                        result.days_absent.map((record) => {
                            var y = record.date.substring(0, 4);
                            var m = record.date.substring(5, 7) - 1;
                            var d = record.date.substring(8, 10);
                            return (
                                new Date(y, m, d)
                            )
                        })
                    ]
                )
            })
            .then((formattedResult) => {
                console.log('formattedResult: ', formattedResult);
                this.setState({
                    attended: formattedResult[0],
                    missed: formattedResult[1]
                })
            })
    }

    handleSubmit(e) {
        console.log('submitted');
        fetch("http://127.0.0.1:8000/api/answer/create/", { // TODO
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                choice: this.state.selectedAnswer,
                quiz_id: this.state.currentQuiz[0].id,
                student: this.props.match.params.userid
            }),
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        alert("Ypu have submitted your answer!");
                        console.log('answer submitted: ', result);
                        this.setState({
                            submittedQuiz: true
                        });
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
        const imgSubmit = this.webcam.getScreenshot();
        console.log('imgSubmit: ', imgSubmit);

        console.log(this.state.student_id, this.state.userPhoto);

        var thisClass = this;
        //post snapshot and student id 

            function handleLocationInfo(position) {
                var lng = position.coords.longitude;
                var lat = position.coords.latitude;

                let dist = getDistance(
                    {
                        latitude: thisClass.state.lat,
                        longitude: thisClass.state.long
                    }, 
                    {
                        latitude: lat,
                        longitude: lng
                    }
                );
                
                console.log(`longitude: ${ lng } | latitude: ${ lat }`);
                console.log('distance: ', dist, ' meters');
                let today = new Date();
                let todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
                // TODO get last lecture and check whether last lecture is the same day
                // if so give warning that earlier lectures on the same day will be nulled
                // need to send location to backend
                console.log(todayString);
                if (dist > 50) {
                    alert('Attendance not taken because you are not in the same location as the instructor');
                }
                else {
                    fetch("http://127.0.0.1:8000/api/attendance/attend/", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            lecture_id: thisClass.state.mostRecentLecture,
                            student_id: thisClass.props.match.params.userid,
                            // img: imgSubmit
                        }),
                    })
                        .then(res => res.json())
                        .then(
                            (result) => {
                                console.log(result);
                                alert('Attendance taken!')
                                thisClass.setState(state => ({
                                    modalShow: false,
                                    userPhoto: imgSubmit
                                }));
                            }
                        )
                }
                
            }
    
            function handleLocationError() {
                alert('You need to give location to access this feature/ Please refresh page to try again.');
            }
    
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(handleLocationInfo, handleLocationError);
            } else {
                console.log('geolocation disabled');
                alert('Sorry feature is not supported by your browser');
            }
    }

    setWebcamRef = (webcam) => {
        this.webcam = webcam;
    }

    handleExitClass() {
        localStorage.removeItem('classid');
        localStorage.removeItem('isClassActive');
        localStorage.removeItem('mostRecentLecture');
        let userID = this.props.match.params.userid;
        this.props.history.push(`/student/${userID}`);
    }

    render() {
        console.log('state: ', this.state);
        const videoConstraints = {
            width: 200,
            height: 200,
            audio: false,
            facingMode: "user"
        };

        const modifiers = {
            missed: this.state.missed,
            attended: this.state.attended
            
        };

        const modifiersStyles = {
            missed: {
                color: 'white',
                backgroundColor: 'red',
            },
            attended: {
                color: 'white',
                backgroundColor: 'green',
                
            }
        }

        var attendanceButton, cameraModal = null;
        console.log('state active', this.state.active);
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
                <Button variant="secondary" title="Lecture has not started" onClick={() => this.handleAttendance(this.state.classid)} disabled>Take Attendance</Button>
            );
        }

        var quizDisplay = null;
        if (this.state.currentQuiz.length > 0 && !this.state.submittedQuiz) {
            var currQuiz = this.state.currentQuiz[0];
            var quizDisplay = (
                <Card className="quiz">
                    <Card.Header as="h5">Current Quiz</Card.Header>
                    <Card.Body>
                        <Card.Title>{currQuiz.question}</Card.Title>
                        <Button className="quiz-option" onClick={() => this.handleSelectAnswer(0) } active={this.state.selectedAnswer === 0} variant="outline-dark">{currQuiz.answer_0}</Button><br/>
                        <Button className="quiz-option" onClick={() => this.handleSelectAnswer(1) } active={this.state.selectedAnswer === 1} variant="outline-dark">{currQuiz.answer_1}</Button><br/>
                        <Button className="quiz-option" onClick={() => this.handleSelectAnswer(2) } active={this.state.selectedAnswer === 2} variant="outline-dark">{currQuiz.answer_2}</Button><br/>
                        <Button className="quiz-option" onClick={() => this.handleSelectAnswer(3) } active={this.state.selectedAnswer === 3} variant="outline-dark">{currQuiz.answer_3}</Button><br/>
                        <Button 
                            className="quiz-option"
                            variant="primary"
                            type="submit"
                            onClick={ (e) => this.handleSubmit(e) }
                        >submit</Button>
                    </Card.Body>
                </Card>
            )
        }

        var finalDisplay = null

        if (this.state.missed !== null && this.state.attended !== null) {
            var finalDisplay = (
                <DayPicker 
                    className="day-picker"
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    showOutsideDays
                />
            )
        }
        
        return (
            <div className="regular-container">
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
                                    {finalDisplay}
                                    </Col>
                                </Row>
                            </div>
                            <Row>
                                <Col>
                                    {attendanceButton}
                                    {cameraModal}
                                </Col>
                            </Row>
                            {quizDisplay}
                        </div>
                        </Col>
                    </Row>
                </Container>
                </div>
        )
    }
}

export default StudentClass;