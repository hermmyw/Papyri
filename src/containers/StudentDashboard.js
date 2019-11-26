import React from 'react';
import '../styles/index.css';
import '../index.js';
import './Landing.css';
import '../components/UI/UI.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import 'react-day-picker/lib/style.css';
import './Dashboard.css';
import Sidebar from '../components/SidebarStudent.js';
// import Image from 'react-bootstrap/Image';
// import { IoIosArrowBack } from "react-icons/io";
// import { triggerAsyncId } from 'async_hooks';
// import { ReactComponent } from '*.svg';

class StudentDashboard extends React.Component {

    constructor(props) {
        super(props);
        // Default values
        this.state = { 
            isLoading: true,
            firstname: 'Katie',
            lastname: 'Lin',
            profilePic: '',
            studentid:'000000000',
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
        this.handleDetails = this.handleDetails.bind(this);
        this.handleAttendance = this.handleAttendance.bind(this);
    }

    componentDidMount() {
        console.log("mounting");
        // GET request
        fetch("...") //TODO
            .then(res => res.json())
            .then(data => data.classes.map(myclass => (
                {
                    classname: `${myclass.name}`,
                    classid: `${myclass.class_id}`,
                    instructor: `${myclass.instructor}`,
                    active: `${myclass.active}`,
                }
            )))
            .then(classes => this.setState({
                classes,
                isLoading: false
            }))
            .catch(error => console.log('parsing failed', error));        
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    handleAttendance(classid) {
        console.log("click attendance");
        console.log(classid);
        // make api call

        // make api call POST
        fetch("http://127.0.0.1:8000/api/attendance/attend/", { // TODO
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            class_id: this.state.classid,
            student_id: this.state.studentid
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
            let path = '/student/class/';
            this.props.history.push(path);
        
        
    }

    // static navigationOptions = {
    //     //headerTitle: <LogoTitle />,
    //     headerRight: (
    //       <Button
    //         onPress={() => alert('This is a button!')}
    //         title="Info"
    //         color="#fff"
    //       />
    //     ),
    //   };

    render() {
        var obj = null;
        obj = this;
        return(
            <Container className="main-content">
                <Sidebar view="dashboard" />
                <div className="subheader">
                    Hello,  {localStorage.getItem('firstName')}!
                </div>
                <CardDeck className="class-list">
                    {this.state.classes.map(function(item, index) {
                        console.log("The class is active: ", item.active);
                        var attendanceButton = null;
                        if (item.active === "true") {
                            attendanceButton = (
                                // TODO: ButtonToggle
                                <Button variant="success" onClick={() => obj.handleAttendance(item.classid)}>Take Attendance</Button>
                            );
                        } else if (item.active === "false") {
                            attendanceButton = (
                                <Button variant="secondary" onClick={() => obj.handleAttendance(item.classid)} disabled>Take Attendance</Button>
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

export default StudentDashboard;