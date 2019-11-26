import React from 'react';
import '../styles/index.css';
import '../index.js';
import './Landing.css';
import '../components/UI/UI.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Modal from 'react-bootstrap/Modal';
import 'react-day-picker/lib/style.css';
import './Dashboard.css';
import Sidebar from '../components/SidebarStudent.js';
import Webcam from 'react-webcam';
// import Image from 'react-bootstrap/Image';
// import { IoIosArrowBack } from "react-icons/io";
// import { triggerAsyncId } from 'async_hooks';
// import { ReactComponent } from '*.svg';


/**
 * Container for web cam pop-up
 * @param {array} props 
 */
function MyVerticallyCenteredModal(props) {
    const videoConstraints = {
        width: 200,
        height: 200,
        audio: false,
        facingMode: "user"
    };
    return (
        <>
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
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
                    videoConstraints={videoConstraints}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>submit</Button>
            </Modal.Footer>
            </Modal>
        </>
    );
}


/**
 * Container for student dashboard
 */

class StudentDashboard extends React.Component {

    /**
     * 
     * Constructor for the student dashboard
     * @param {array} props Properties that are passed into element
     */
    constructor(props) {
        super(props);
        // Default values
        this.state = { 
            isLoading: true,
            firstname: 'Katie',
            lastname: 'Lin',
            profilePic: '',
            studentid:'123456789',
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
            ],
            attemptAttendance: false,
            modalShow: false
        };
        this.handleDetails = this.handleDetails.bind(this);
        this.handleAttendance = this.handleAttendance.bind(this);
        this.handleModalShowClose = this.handleModalShowClose.bind(this);
    }

    componentDidMount() {
        console.log("mounting");
        // GET request
        // fetch("http://127.0.0.1:8000/api/classes/student/"+this.state.studentid) //TODO
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

    handleAttendance(classid) {
        console.log("click attendance");
        console.log(classid);
        this.setState(state => ({
            attemptAttendance: true,
            modalShow: true
        }));
        // make api call POST request
        // fetch("http://127.0.0.1:8000/api/attendance/attend/", {
        // method: "POST",
        // headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        // },
        // body: JSON.stringify({
        //     lecture_id: classid,
        //     student_id: this.state.studentid
        // }),
        // })
        //     .then(res => res.json())
        //     .then(
        //         (result) => {
        //             console.log(result);
        //         }
        //     )

        console.log(classid);
    }

    handleModalShowClose() {
        this.setState(state => ({
            modalShow: false
        }));
    }

    handleDetails(classid) {
        console.log("click details");
        let currentDate = new Date();
        let month = currentDate.getMonth()+1;
        let year = currentDate.getFullYear();

        // make api call
        fetch("http://127.0.0.1:8000/api/classes/student/" + classid)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                }
            )
        
        // let path = '/student/class/' + classid;
        let path = '/student/class/';
        this.props.history.push(path);
        
        
    }
    
    render() {
        var obj, cameraModal = null;
        obj = this;

        const videoConstraints = {
            width: 200,
            height: 200,
            audio: false,
            facingMode: "user"
        };

        // if (this.state.attemptAttendance) {
        //     camera = (
        //         <Webcam
        //                 audio={false}
        //                 height={200}
        //                 width={200}
        //                 ref={this.setRef}
        //                 screenshotFormat='image/jpeg'
        //                 videoConstraints={videoConstraints}
        //         />
        //     );
        // }
        return(
            <Container className="main-content">
                <Sidebar view="dashboard" />
                <div className="subheader">
                    Hello,  {this.state.firstname}!
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
                            cameraModal = (
                                <MyVerticallyCenteredModal
                                    show={obj.state.modalShow}
                                    onHide={() => obj.handleModalShowClose()}
                                />
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
                                {cameraModal}
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