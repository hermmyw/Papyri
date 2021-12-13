import React from 'react';
import '../styles/index.css';
import '../index.js';
import './Landing.css';
import './Dashboard.css';
import '../components/UI/UI.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import { Row, Col } from 'react-bootstrap';
import 'react-day-picker/lib/style.css';
import './Dashboard.css';
//import EnrollClass from './EnrollClass';
import handleLogout from '../functions/logout';
import Topbar from '../components/Topbar';



// path('classes/student/<int:student_id>', classes.get_classes_by_student),
// get class list

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
            firstName: localStorage.getItem('firstName'),
            lastName: localStorage.getItem('lastName'),
            profile_pic: localStorage.getItem('profilepic'),
            student_id: localStorage.getItem('uid'),
            classes: [],
            detailClass: null
        };

        this.handleDetails = this.handleDetails.bind(this);
        this.handleEnterClass = this.handleEnterClass.bind(this);
        this.handleEnroll = this.handleEnroll.bind(this);
    }

    componentDidMount() {
        console.log("mounting");
        console.log(this.state);

        // get the class list for the student
        fetch(`http://127.0.0.1:8000/api/classes/student/${this.props.match.params.userid}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                //'authorization':  authenticationField
            }
        }) //TODO
            .then(res => {
                console.log(res);
                if (res.ok) {
                    return (res.json());
                }
                
                throw Error(res.statusText);
            })
            .then(
                (result) =>  {
                    console.log("get class list: ", result);
                    this.setState({
                        classes: result
                    })
                     //if (result !== null) TODO (create_class)
                }
            )
            .catch(error => console.log('parsing failed', error));
    }

    componentWillUnmount() {
        console.log("unmounting");
    }

    handleDetails(classid) {
        console.log("click details");
        // let currentDate = new Date();
        // let month = currentDate.getMonth()+1;
        // let year = currentDate.getFullYear();

        // Send student id and class id 

        // Get class info
        fetch("http://127.0.0.1:8000/api/classes/student/" + classid, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then( res => {
                console.log(res);
                if (res.ok) {
                    return (res.json());
                }
                
                throw Error(res.statusText);
            })
            .then(
                (result) => {
                    // TODO
                    console.log(result);
                    localStorage.setItem('class_id', classid);
                    localStorage.setItem('attended_dates', result.attended_dates);
                    localStorage.setItem('missed_dates', result.missed_dates);
                }
            )
        
        //let path = '/student/class/' + classid;
        let path = '/student/class/';
        this.props.history.push(path);
        this.setState(state => ({
            detailClass: classid
        }))
    }

    handleEnterClass(classID, index) {
        localStorage.setItem('classid', classID);
        localStorage.setItem('isClassActive', this.state.classes[index].in_session);
        localStorage.setItem('mostRecentLecture', this.state.classes[index].most_recent_lecture);
        let userID = this.props.match.params.userid;
        this.props.history.push(`/student/class/${userID}/${classID}`);
    }

    handleEnroll() {
        let userID = this.props.match.params.userid;
        this.props.history.push(`/student/enroll/${userID}`);
    }

    
    
    render() {
        var main, detail = null;
        var obj = this;
        //if (this.state.detailClass === null) {
        if (this.state.classes.length > 0) {
            main = (
                <div>
                    <CardDeck className="class-list">
                        {this.state.classes.map(function(item, index) {
                            console.log("The class is active: ", item.active);
                            return (
                                <Card style={{ width: '14rem', cursor: "pointer" }} key={index} onClick={() => obj.handleEnterClass(item.id, index)}>
                                    <Card.Header className="card-header">{item.name}</Card.Header>
                                    <Card.Body className="card-body">
                                    <Card.Title>Professor {item.teacher_name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                                    <Card.Text>
                                    </Card.Text>
                                    <Button variant='outline-primary' onClick={() => obj.handleDetails(item.id)}>Details</Button>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </CardDeck>
                </div>
            );
        // } else {
        //     detail = (
        //         // <StudentClass
        //         //     class_id={this.state.detailClass}
        //         // />
        //     );
        // }
        }

        else {
            main = (
                <Container>
                    You are not enrolled in any classes!
                </Container>
            )
        }

        
        return( 
            <div className="regular-container">
                <Topbar/>
                <Container>
                    <div className="subheader">
                        Hello,  {localStorage.getItem('firstName')}!
                    </div>
                    {main}
                    {detail}
                <Row>
                        <Col><Button className="white-button" size="lg" block onClick={this.handleEnroll}>Enroll in Class</Button></Col>
                    </Row>
                    {/*<EnrollClass />*/}
                    <Row>
                        <Col><Button className="yellow-button" size="lg" block onClick={() => handleLogout(this)}>Log Out</Button></Col>
                    </Row>
                </Container>
            </div>
            
        )
    }
}

export default StudentDashboard;