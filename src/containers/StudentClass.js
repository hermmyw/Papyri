import React from 'react';
import '../styles/index.css';
import './Landing.css';
import '../components/UI/UI.css';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Media } from 'reactstrap';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './Dashboard.css';
import Sidebar from '../components/SidebarStudent.js';

// import Image from 'react-bootstrap/Image';
import { IoIosArrowBack } from "react-icons/io";
// import { ReactComponent } from '*.svg';

class StudentDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: this.props.name,
            profilePic: this.props.profilePic,
            attended: this.props.attended,
            missed: this.props.missed,
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
       // GET request
       fetch("...") //TODO
       .then(res => res.json())
       .then(function(data) {
           this.state.attended = JSON.parse(data.attendedDates);
           this.state.missed = JSON.parse(data.missedDates);
        })
       .catch(error => console.log('parsing failed', error));
    }


    render() {
        const modifiers = {
            attended: [
                new Date(2019, 10, 4),
                new Date(2019, 10, 11),
                new Date(2019, 10, 6),
                new Date(2019, 10, 13),
            ],
            missed: [
                new Date(2019, 10, 18),
                new Date(2019, 10, 20),
            ]
            
        };

        const modifiersStyles = {
            attended: {
                color: 'white',
                backgroundColor: 'green',
                
            },

            missed: {
                color: 'white',
                backgroundColor: 'red',
            }
        }
          

        return (
            <Container>
                <Sidebar view="class" />
                <Row>
                <Col>
                    <div className="main-content">
                        <h3 className="subheader">Attendance</h3>
                        <div className="calendar">
                        
                        <DayPicker 
                            className="day-picker"
                            modifiers={modifiers}
                            modifiersStyles={modifiersStyles}
                            showOutsideDays
                        />
                        </div>
                        
                        <h3 className="subheader">Quizzes</h3>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>
                                <ListGroupItemHeading>Quiz 3</ListGroupItemHeading>
                                <ListGroupItemText>Score: 2/20</ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem>
                                <ListGroupItemHeading>Quiz 2</ListGroupItemHeading>
                                <ListGroupItemText>Score: 14.5/20</ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem>
                                <ListGroupItemHeading>Quiz 1</ListGroupItemHeading>
                                <ListGroupItemText>Score: 17.5/20</ListGroupItemText>
                            </ListGroupItem>
                        </ListGroup>
                    </div>
                </Col>
            </Row>
            </Container>
        )
    }
}

export default StudentDashboard;