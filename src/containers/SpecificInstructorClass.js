import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Row, Col, Button, Form, FormGroup, Input, Label, FormFeedback, FormText} from 'reactstrap';
import '../components/UI/UI.css';
import { IoIosArrowBack } from "react-icons/io";
import Chart from 'react-google-charts';
import handleQuizClick from '../functions/handleQuizClick';
import convertDate from '../functions/convertDate';

const getAttendanceURL = "";
const getClosedQuizzesURL = "";

var closedQuizData = {
    data: [
            {
                question: "What is the definition of strategy design pattern?",
                date: "2019-09-25",
                quiz_id: "34523"
            },
            {
                question: "What is the definition of observer design pattern?",
                date: "2019-10-25",
                quiz_id: "65456"
            },
            {
                question: "What is the definition of factory method design pattern?",
                date: "2019-11-25",
                quiz_id: "78768"
            },
        ]
};
var attendanceData = {
    data: [
        {
            date: "2019-11-25",
            n_students: 145
        },
        {
            date: "2019-11-20",
            n_students: 135
        },
        {
            date: "2019-11-18",
            n_students: 126
        },
        {
            date: "2019-11-13",
            n_students: 139
        },
        {
            date: "2019-11-11",
            n_students: 120
        },
        {
            date: "2019-11-06",
            n_students: 156
        },
        {
            date: "2019-11-04",
            n_students: 134
        },
        {
            date: "2019-10-30",
            n_students: 119
        },
        {
            date: "2019-10-28",
            n_students: 129
        },
        {
            date: "2019-10-23",
            n_students: 156
        }
    ]
}

var attendanceDataG = attendanceData.data.map((d) => [convertDate(d.date), d.n_students]).reverse();


/**
 * Container for the Create Class page on the Instructor interface.
 * Renders a form to register a new class
 */
class SpecificInstructorClass extends React.Component {

    constructor(props) {
        super(props);

        // for sake of testing. instructor classes view should set this variable 
        // before being directed to this page
        localStorage.setItem('classID', '12345');

        this.state = {
            isActive: localStorage.getItem('isClassActive')
        }

        this.handleViewAllClosedQuizzes = this.handleViewAllClosedQuizzes.bind(this);
        this.showRecentClosedQuizzes = this.showRecentClosedQuizzes.bind(this);
        this.showAttendanceGraph = this.showAttendanceGraph.bind(this);
        this.handleExitClass = this.handleExitClass.bind(this);
        this.handleTakeAttendance = this.handleTakeAttendance.bind(this);
        this.handleStopAttendance = this.handleStopAttendance.bind(this);
        
        // var closedQuizData = this.makeRecentClosedQuizzesCall();
        // var attendanceData = this.makeAttendanceCall();
    }

    /**
     * Makes an http request to endpoint to register a new class for the instructor.
     */
    handleViewAllClosedQuizzes() {
        console.log("view all closed quizzes");

        // go to View All Closed Quizzes Page

        this.props.history.push(`/instructor/quizzes/${this.props.match.params.userid}/${this.props.match.params.classid}`);
    }

    /*makeRecentClosedQuizzesCall() {
        fetch(getClosedQuizzesURL, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                class_id: this.state.classID,
                limit: 3,
                offset: 0
            }),
        })
            .then(res => res.json())
    }

    makeAttendanceCall() {
        fetch(getAttendanceURL, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                class_id: this.state.classID,
                limit: 10,
                offset: 0
            }),
        })
            .then(res => res.json())
    }*/

    showRecentClosedQuizzes(e) {
        return (
            closedQuizData.data.map((d) => (
                <div>
                    <Row>
                        <Col>
                            <Button className="yellow-button" size="lg" block onClick={() => handleQuizClick(this, d.quiz_id)}>
                                <span style={{float: "left"}}>{d.question}</span><span style={{float: "right"}}>{convertDate(d.date)}</span>
                            </Button>
                        </Col>
                    </Row>
                </div>
            ))
        )
    }

    showAttendanceGraph() {
        return (
            <Row>
                <Col>
                    <Chart
                        width={'500px'}
                        height={'300px'}
                        chartType="Bar"
                        loader={<div>Loading Chart</div>}
                        data={[['Date', 'Students']].concat(attendanceDataG)}
                        options={{
                            // Material design options
                            chart: {
                            title: 'Attendance',
                            subtitle: 'Number of students that showed up for the last 10 lectures',
                            },
                        }}
                        // For tests
                        rootProps={{ 'data-testid': '2' }}
                    />
                </Col>
            </Row>
        )
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
                    c_id: thisClass.props.match.params.classid
                }),
            })
            .then(res => res.json())
            .then((result) => {
                console.log(result);
                localStorage.setItem('isClassActive', true);
                localStorage.setItem('activeLectureID', result.id);
                thisClass.setState({
                    isActive: true
                })
            })
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleLocationInfo);
        } else {
            console.log('geolocation disabled');
            alert('Sorry feature is not supported by your browser');
        }
    }

    handleStopAttendance() {
        fetch("http://127.0.0.1:8000/api/attendance/stop/", { // TODO
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 1 // localStorage.getItem('activeLectureID')
            }),
        })
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
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
        let userID = this.props.match.params.userid;
        this.props.history.push(`/instructor/${userID}`);
    }

    render() {
        console.log("rendering");
        console.log(this.state);

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