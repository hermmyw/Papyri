import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Row, Col, Button, Form, FormGroup, Input, Label, FormFeedback, FormText} from 'reactstrap';
import '../components/UI/UI.css';
import { IoIosArrowBack } from "react-icons/io";
import Chart from 'react-google-charts';

const getAttendanceURL = "";
const getClosedQuizzesURL = "";
// var closedQuizData, attendanceData = null;
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

function convertDate(isoShortDate) {
    var newDate = new Date(isoShortDate);
    var dd = newDate.getDate();
    var mm = newDate.getMonth() + 1; //January is 0!

    var yyyy = newDate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    } 
    if (mm < 10) {
        mm = '0' + mm;
    }

    return(mm + '/' + dd + '/' + yyyy);
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
            classID: localStorage.getItem('classID'),
            quizID: null,
        }

        this.handleViewAllClosedQuizzes = this.handleViewAllClosedQuizzes.bind(this);
        this.showRecentClosedQuizzes = this.showRecentClosedQuizzes.bind(this);
        this.showAttendanceGraph = this.showAttendanceGraph.bind(this);
        this.handleExitClass = this.handleExitClass.bind(this);
        
        // var closedQuizData = this.makeRecentClosedQuizzesCall();
        // var attendanceData = this.makeAttendanceCall();
    }

    /**
     * Makes an http request to endpoint to register a new class for the instructor.
     */
    handleViewAllClosedQuizzes() {
        console.log("view all closed quizzes");

        // go to View All Closed Quizzes Page
    }

    // set localstorage variable and go to 
    handleQuizClick(qid) {
        console.log("quizID: " + qid);
        localStorage.setItem('quizID', qid);

        // go to specific quiz view for instructor
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
                            <Button className="yellow-button" size="lg" block onClick={() => this.handleQuizClick(d.quiz_id)}>
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

    handleExitClass() {
        localStorage.removeItem('classid');
        let userID = this.props.match.params.userid;
        this.props.history.push(`/instructor/${userID}`);
    }

    render() {
        console.log("rendering");
        console.log(this.state);

        var graph, recentQuizzes = null;

        graph = this.showAttendanceGraph();
        recentQuizzes = this.showRecentClosedQuizzes();

        return (
            <div>
                <Sidebar view="class home" />
                <div className="main-area">
                    <Row>
                        <Col><Button className="yellow-button" size="lg" block onClick={this.handleExitClass}>Exit Class</Button></Col>
                    </Row>
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