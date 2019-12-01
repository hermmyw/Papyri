// Show question + answer choices, correct answer is highlighted 
// (api call: show specific quiz information)
// Show list of student answers: first name, last name, uid, 
// answer (api call: get list of student answers to specific quiz)

import React from 'react';
import {     
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,

    Collapse,

    Progress,
    
    Nav, NavItem, NavLink } from 'reactstrap';
import './Dashboard.css';
import convertDate from '../functions/convertDate';
import Sidebar from '../components/Sidebar';
  
class InstrListQuizzes extends React.Component {
    
    constructor(props) {
        super(props);
        this.getQuizzes = this.getQuizzes.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderQuizzes = this.renderQuizzes.bind(this);
        this.state = {
            quizzes: [],
            classid: this.props.classid
        }
    }

    componentDidMount() {
        console.log("mounting");
        this.getQuizzes();
    }

    componentWillUnmount() {
        console.log("unmounting");
    }


    // Go to specific quiz page
    // Pass in the specific quiz as a prop to the InstrSpecificQuiz object
    handleClick(quiz) {
        // TODO: IMPLEMENT STACK NAVIGATION: QUIZZES/SPECIFICQUIZ/SPECIFICQUESTION
        let params = this.props.match.params;
        this.props.history.push(`/instructor/quiz/${params.userid}/${params.classid}/${quiz.id}`);
    }


    /**
     * GETQUIZZES
     * When page renders,
     * Retrieve list of quizzes, store in state
     */
    getQuizzes() {
        console.log("retrieving quizzes");

        fetch(`http://127.0.0.1:8000/api/quiz/list/released/${this.props.match.params.classid}/`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                console.log(res);
                if (res.ok) {
                    return (res.json());
                }
                
                throw Error(res.statusText);
            })
            .then(
                (result) => {
                    console.log("past quizzes: ", result);
                    this.setState({quizzes: result});
                }
            )
            .catch (error => {
                console.log('get past quizzes error: ', error);
                /* docCookies.removeItem('token', '/');
                localStorage.clear();
                this.props.history.push('/');*/
            })
    }


    /**
     * RENDERQUIZZES
     * Shows list of quizzes (with title, date, id, score)
     * Click button to view that specific quiz
     */
    renderQuizzes() {
        return (this.state.quizzes.map(quiz => {
            return (
                <Card>
                    <CardTitle>{quiz.name}</CardTitle>
                    <CardBody>
                        <CardText>{convertDate(quiz.time_created.substring(0, 10))}</CardText>
                        <CardText>{quiz.question}</CardText>
                        <CardText>Class Score: {quiz.score}</CardText>
                        <Button onClick={() => this.handleClick(quiz)}>View Quiz</Button>
                    </CardBody>
                </Card>
            )
        }))
    }


    /**
     * renders the InstrListQuiz page
     */
    render() {
        console.log('states: ', this.state);
        return (
            <div>
                <Sidebar view="past quizzes" />
                <div className="main-area">
                    {this.renderQuizzes()}
                </div>
            </div>
        )
    }
}

export default InstrListQuizzes;