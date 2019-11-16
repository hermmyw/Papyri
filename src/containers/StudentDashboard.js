import React from 'react';
import '../styles/index.css';
import './Landing.css';
import '../components/UI/UI.css';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Media } from 'reactstrap';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './Dashboard.css';
// import Image from 'react-bootstrap/Image';
import { IoIosArrowBack } from "react-icons/io";
// import { ReactComponent } from '*.svg';

class StudentDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: this.props.name,
            profilePic: this.props.profilePic
        }
    }

    render() {
        return(

            <Container>
                <Row>
                    <Col sm="4">
                        <img className="profile" src='/default_profile.jpg' />
                        <h3 className="subheader">Katie Lin</h3>
                        <Button color="primary" block>Classes</Button>                        
                        <Button color="primary" block>Forum</Button>
                    </Col>
                    <Col>
                        <div className="mainContent">
                            <h3 className="subheader">Attendance</h3>
                            <DayPicker />
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