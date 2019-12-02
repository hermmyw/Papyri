import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Row, Col, Button, Form, FormGroup, Input, Label, FormFeedback, FormText, Container } from 'reactstrap';
import '../components/UI/UI.css';
import { IoIosArrowBack } from "react-icons/io";
import Chart from 'react-google-charts';
import handleQuizClick from '../functions/handleQuizClick';
import convertDate from '../functions/convertDate';


const emptyLectures = [["-", 0], ["-", 0], ["-", 0], ["-", 0], ["-", 0], ["-", 0], ["-", 0], ["-", 0], ["-", 0], ["-", 0],];
/**
 * Container for the Create Class page on the Instructor interface.
 * Renders a form to register a new class
 */
class SpecificInstructorClass extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            attendanceData: [],
            quizData: [],
            activeLectureId: null
        }

        this.handleViewAllClosedQuizzes = this.handleViewAllClosedQuizzes.bind(this);
        this.showRecentClosedQuizzes = this.showRecentClosedQuizzes.bind(this);
        this.showAttendanceGraph = this.showAttendanceGraph.bind(this);
        this.handleExitClass = this.handleExitClass.bind(this);
        this.handleTakeAttendance = this.handleTakeAttendance.bind(this);
        this.handleStopAttendance = this.handleStopAttendance.bind(this);
    }

    componentDidMount() {
        console.log('mounting');
        console.log('local storage: ', localStorage);
        console.log('states: ', this.state);
        this.getLectures();
        this.getClosedQuizzes();
    }

    /**
     * Makes an http request to endpoint to register a new class for the instructor.
     */
    handleViewAllClosedQuizzes() {
        console.log("view all closed quizzes");

        // go to View All Closed Quizzes Page

        this.props.history.push(`/instructor/quizzes/${this.props.match.params.userid}/${this.props.match.params.classid}`);
    }

    getClosedQuizzes() {
        fetch(`http://127.0.0.1:8000/api/quiz/list/released/${this.props.match.params.classid}`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log("recent quizzes: ", result);
                this.setState({quizData: result});
            })
    }

    getLectures() {
        console.log("lectures");

        const fillLecture = (lecs => {
            const promise = new Promise(() => {
                while (lecs.length < 10) {
                    lecs.push(["", 0])
                }
            })

            promise.then(() => {
                console.log('filled lectures: ', lecs);
                return lecs;
            })
        })

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
                var lecID = null;
                var insess = false;
                if (result.length > 0 && result[0].in_session) {
                    var lecID = result[0].lecture_id;
                    var insess = result[0].in_session;
                }
                return (
                    [result.map((lecture) => (
                        [
                            convertDate(lecture.date.substring(0, 10)),
                            lecture.attendance
                        ]
                    )).reverse(), lecID, insess]
                );
            })
            /*.then(([lectures, lectureID, active]) => {
                return([fillLecture(lectures.slice(0, 10)), lectureID, active]);
            })*/
            .then(([lectures, lectureID, active]) => {
                console.log('attendance data:', lectures);
                this.setState({
                    attendanceData: lectures.slice(0, 10),
                    isActive: active,
                    activeLectureId: lectureID,
                });
            })
    }

    showRecentClosedQuizzes(e) {
        return (
            this.state.quizData.map((d) => (
                <div>
                    <Row>
                        <Col>
                            <Button className="yellow-button" size="lg" block onClick={() => handleQuizClick(this, d.id)}>
                                <span style={{float: "left"}}>{d.question}</span><span style={{float: "right"}}>{convertDate(d.time_created.substring(0, 10))}</span>
                            </Button>
                        </Col>
                    </Row>
                </div>
            ))
        )
    }

    showAttendanceGraph() {
        if (this.state.attendanceData.length > 0) {
            return (
                <Row>
                    <Col>
                        <Chart
                            width={'500px'}
                            height={'300px'}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={[['Date', 'Students']].concat(this.state.attendanceData).concat(emptyLectures).splice(0, 11)}
                            options={{
                                // Material design options
                                chart: {
                                    title: 'Attendance',
                                    subtitle: 'Number of students that showed up for up to the past 10 lectures',
                                    chartArea: {width: '90%', height: '90%'},
                                    vAxis: { gridlines: { count: 4 }}
                                },
                            }}
                            // For tests
                            rootProps={{ 'data-testid': '2' }}
                        />
                    </Col>
                </Row>
            )
        }
        else {
            return (
                <Container>
                    No attendance data to show. Please start a lecture to get attendance data.
                </Container>

            )
        }
    }

    handleTakeAttendance(thisClass) {
        function handleLocationInfo(position) {
            var lng = position.coords.longitude;
            var lat = position.coords.latitude;
            
            console.log(`longitude: ${ lng } | latitude: ${ lat }`);
            let today = new Date();
            let todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            // TODO get last lecture and check whether last lecture is the same day
            // if so give warning that earlier lectures on the same day will be nulled
            // need to send location to backend
            console.log(todayString);
            fetch("http://127.0.0.1:8000/api/attendance/start/", { 
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    c_id: thisClass.props.match.params.classid,
                    latitude: lat,
                    longitude: lng
                }),
            })
            .then(res => res.json())
            .then((result) => {
                console.log("attendance started", result);
                localStorage.setItem('isClassActive', true);
                localStorage.setItem('activeLectureID', result.id);
                thisClass.setState({
                    isActive: true
                })
            })
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

    handleStopAttendance() {
        console.log('lecture id: ', this.state.activeLectureId);
        fetch(`http://127.0.0.1:8000/api/attendance/stop/`, { // TODO
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.activeLectureId
            }),
        })
        .then(res => res.json())
        .then(
            (result) => {
                console.log("attendance ended", result);
                localStorage.setItem('isClassActive', false);
                localStorage.setItem('activeLectureID', null);
                this.setState({
                    isActive: false
                })
            }
        )
    }

    handleExitClass() {
        localStorage.removeItem('classid');
        localStorage.removeItem('isClassActive');
        let userID = this.props.match.params.userid;
        this.props.history.push(`/instructor/${userID}`);
    }

    render() {
        console.log("rendering");
        console.log('states: ', this.state);

        var graph, recentQuizzes, attendanceButton = null;

        graph = this.showAttendanceGraph();
        recentQuizzes = this.showRecentClosedQuizzes();

        if (this.state.isActive === false) {
            var attendanceButton = (
                <Row>
                    <Col><Button className="yellow-button" size="lg" block onClick={() => this.handleTakeAttendance(this)}>Start Lecture</Button></Col>
                </Row>
            )
        }
        else {
            var attendanceButton = (
                <Row>
                    <Col><Button className="yellow-button" size="lg" block onClick={() => this.handleStopAttendance(this)}>End Lecture</Button></Col>
                </Row>
            )
        }
        

        return (
            <div>
                <Sidebar view="class home" />
                <div className="main-area">
                    <Row>
                        <Col><Button className="yellow-button" size="lg" block onClick={this.handleExitClass}>Exit Class</Button></Col>
                    </Row>
                    {attendanceButton}
                    {graph}
                    {recentQuizzes}
                    <Button className="yellow-button" size="lg" block onClick={this.handleViewAllClosedQuizzes}>
                        View All Past Quizzes
                    </Button>
                </div>
                
            </div>
        )
    }
}

export default SpecificInstructorClass;