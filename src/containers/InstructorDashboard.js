import React from 'react';
import './Dashboard.css';
import Sidebar from '../components/Sidebar.js';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';


/**
 * Container for instructor dashboard
 */

class InstructorDashboard extends React.Component {
    
    /**
     * 
     * Constructor for the Instructor Dashboard
     * @param {array} props Properties that are passed into element when being used.
     */
    constructor(props) {
        super(props);
        // Default values
        this.state = {
            lastname: 'Kim',
            classes: [
                {
                    classname: 'CS130',
                    classid: '12345',
                    instructor: 'Kim',
                    active: 'true'
                },
                {
                    classname: 'CS230',
                    classid: '12346',
                    instructor: 'Kim',
                    active: 'false'
                },
                {
                    classname: 'CS330',
                    classid: '12347',
                    instructor: 'Kim',
                    active: 'false'
                },
                {
                    classname: 'CS131',
                    classid: '12367',
                    instructor: 'Eggert',
                    active: 'false'
                },
            ]
        };
        this.getDashboard = this.getDashboard.bind(this);
        this.handleDetails = this.handleDetails.bind(this);
        this.handleStartLecture = this.handleStartLecture.bind(this);
        this.handleEndLecture = this.handleEndLecture.bind(this);
    }

    componentDidMount() {
        console.log("mounting");
        // // make api call GET request
        // fetch("http://127.0.0.1:8000/api/classes/teacher/")
        //     .then(res => res.json())
        //     .then(data => data.classes.map(myclass => (
        //         {
        //             classname: `${myclass.name}`,
        //             classid: `${myclass.class_id}`,
        //             instructor: `${myclass.instructor}`,
        //             active: `${myclass.active}`,
        //         }
        //     )))
        //     .then(classes => this.setState({
        //         classes,
        //         isLoading: false
        //     }))
        //     .catch(error => console.log('parsing failed', error));
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    handleStartLecture(classid) {
        console.log("start lecture");
        // make api call POST
        fetch("http://127.0.0.1:8000/api/attendance/start/", { // TODO
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            class_id: this.state.classid,
            date: new Date(),
            active: true
        }),
    })
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
            }
        )
    }

    handleEndLecture(classid) {
        console.log("end lecture ", this.state.classid, new Date());
        // make api call POST
        fetch("http://127.0.0.1:8000/api/attendance/stop/", { // TODO
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lecture_id: this.state.classid,
            date: new Date(),
            active: false
        }),
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                }
            )
    }

    handleDetails(classid) {
        console.log("click details");
        let currentDate = new Date();
        let month = currentDate.getMonth()+1;
        let year = currentDate.getFullYear();

        // make api call
        // fetch("http://127.0.0.1:8000/api/user/", { // TODO
        //     method: "POST",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         class_id:  classid,
        //         student_id: this.state.studentid,
        //         month: `${month}`,
        //         year: `${year}`
        //     }),
        // })
        //     .then(res => res.json())
        //     .then(
        //         (result) => {
        //             console.log(result);
        //         }
        //     )
        
            // let path = '/student/class/' + classid;
            let path = '/instructor/class/';
            this.props.history.push(path);
    }

    /**
     * Makes an http request to endpoint to retrieve information about attendance and quiz scores to display in the form of graphs
     */
    getDashboard() {

    }

    /**
     * renders the Instructor Dashboard view
     */
    render() {

        // return (
        //     <div>
        //         <Sidebar view="dashboard" />
        //         <div className="main-area">
        //             <p>Dashboard</p>
        //         </div>
        //     </div>
        // )
        var obj = null;
        obj = this;
        return(
            <Container className="main-content">
                <Sidebar view="dashboard" />
                <div className="subheader">
                    Hello, Professor {this.state.lastname}!
                </div>
                <CardDeck className="class-list">
                    {this.state.classes.map(function(item, index) {
                        console.log("The class is active: ", item.active);
                        var attendanceButton = null;
                        if (item.active === "true") {
                            attendanceButton = (
                                // TODO: ButtonToggle
                                <Button variant="danger" onClick={() => obj.handleEndLecture(item.classid)}>End Lecture</Button>
                            );
                        } else if (item.active === "false") {
                            attendanceButton = (
                                <Button variant="success" onClick={() => obj.handleStartLecture(item.classid)}>Start Lecture</Button>
                            );
                        }
                        return (
                            <Card style={{ width: '14rem' }} key={index}>
                                <Card.Header className="card-header">{item.classname}</Card.Header>
                                <Card.Body className="card-body">
                                <Card.Title>Professor {item.instructor}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                                <Card.Text>
                                {attendanceButton}
                                </Card.Text>
                                <Button variant='outline-primary' onClick={() => obj.handleDetails(item.classid)}>Details</Button>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </CardDeck>
            </Container>
            
        )
    }
}

export default InstructorDashboard;