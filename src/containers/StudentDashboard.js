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
import StudentClass from './StudentClass.js';



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
                    classname: 'CS131',
                    classid: '12367',
                    instructor: 'Eggert',
                    active: 'false'
                },
            ],
            detailClass: null
        };
        this.handleDetails = this.handleDetails.bind(this);
    }

    componentDidMount() {
        console.log("mounting");
        console.log(this.state);

        // get the class list for the student
        fetch("http://127.0.0.1:8000/api/classes/student/"+this.state.student_id, {
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
    
    render() {

        var main, detail = null;
        var obj = this;
        //if (this.state.detailClass === null) {
            main = (
                <Container className="main-content">
                    <Sidebar 
                        view="dashboard"
                        profilepic={localStorage.getItem('profilepic')}
                    />
                    <div className="subheader">
                        Hello,  {localStorage.getItem('firstName')}!
                    </div>
                    <CardDeck className="class-list">
                        {this.state.classes.map(function(item, index) {
                            console.log("The class is active: ", item.active);
                            return (
                                <Card style={{ width: '14rem' }} key={index}>
                                    <Card.Header className="card-header">{item.classname}</Card.Header>
                                    <Card.Body className="card-body">
                                    <Card.Title>Professor {item.instructor}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                                    <Card.Text>
                                    </Card.Text>
                                    <Button variant='outline-primary' onClick={() => obj.handleDetails(item.classid)}>Details</Button>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </CardDeck>
                </Container>
            );
        // } else {
        //     detail = (
        //         // <StudentClass
        //         //     class_id={this.state.detailClass}
        //         // />
        //     );
        // }

        
        return( 
            <div>
                {main}
                {detail}
            </div>
            
        )
    }
}

export default StudentDashboard;