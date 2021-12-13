import React from 'react';
import './Dashboard.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import { Row, Col } from 'react-bootstrap';
import handleLogout from '../functions/logout';
import Topbar from '../components/Topbar';




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
            classes: []
        };
        this.handleDetails = this.handleDetails.bind(this);
        this.handleStartLecture = this.handleStartLecture.bind(this);
        this.handleEndLecture = this.handleEndLecture.bind(this);
        this.handleEnterClass = this.handleEnterClass.bind(this);
        this.handleCreateClass = this.handleCreateClass.bind(this);
    }

    componentDidMount() {
        console.log("mounting");
        // // make api call GET request
        fetch(`http://127.0.0.1:8000/api/classes/teacher/${this.props.match.params.userid}`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return(res.json());
            })
            .then(data => {
                console.log('fetched data: ', data);
                this.setState({
                    classes: data
                })
            })
            .catch(error => console.log('parsing failed', error));
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
        // let currentDate = new Date();
        // let month = currentDate.getMonth()+1;
        // let year = currentDate.getFullYear();

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

    handleEnterClass(classID) {
        localStorage.setItem('classid', classID);
        localStorage.setItem('isClassActive', false);
        let userID = this.props.match.params.userid;
        this.props.history.push(`/instructor/class/${userID}/${classID}`)
    }

    handleCreateClass() {
        let userID = this.props.match.params.userid;
        this.props.history.push(`/instructor/createclass/${userID}`);
    }

    handleRegCode(idx) {
        alert('Registration Code for ' + this.state.classes[idx].name + ': ' + this.state.classes[idx].registration_code);
    }

    /**
     * renders the Instructor Dashboard view
     */
    render() {
        console.log(this.state.classes);
        var obj = null;
        obj = this;
        return(
            <div className="regular-container">
            <Topbar/>
            <Container>
                <div className="subheader">
                    Hello, Professor {localStorage.getItem('lastName')}!
                </div>
                <CardDeck className="class-list">
                    {this.state.classes.map(function(item, index) {
                        /*console.log("The class is active: ", item.active);
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
                        }*/
                        return (
                            <Card style={{ width: '14rem', cursor: "pointer"  }} key={index} onClick={() => obj.handleEnterClass(item.id)} >
                                <Card.Header className="card-header">{item.name}</Card.Header>
                                <Card.Body className="card-body">
                                <Card.Title>{item.term.toUpperCase()} {item.year}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                                <Card.Text>
                                Registration Code <br></br>
                                <div style={{ color: '#EC7357'}} >{obj.state.classes[index].registration_code}</div>
                                </Card.Text>
                                {/*<Button variant='outline-primary' onClick={() => obj.handleRegCode(index)}>Show Registration Code</Button>*/}
                                </Card.Body>
                            </Card>
                        );
                    })}
                </CardDeck>
                <Row>
                    <Col><Button className="white-button" size="lg" block onClick={this.handleCreateClass}>Create Class</Button></Col>
                </Row>
                <Row>
                    <Col><Button className="yellow-button" size="lg" block onClick={() => handleLogout(this)}>Log Out</Button></Col>
                </Row>

            </Container>
            </div>
        )
    }
}

export default InstructorDashboard;