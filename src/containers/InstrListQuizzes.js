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
  
class InstrListQuizzes extends React.Component {
    
    constructor(props) {
        super(props);
        this.getQuizzes = this.getQuizzes.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderQuizzes = this.renderQuizzes.bind(this);
        this.state = {
            quizzes: this.getQuizzes(),
            classid = this.props.classid
        }
    }

    componentDidMount() {
        console.log("mounting");
    }

    componentWillUnmount() {
        console.log("unmounting");
    }


    // Go to specific quiz page
    // Pass in the specific quiz as a prop to the InstrSpecificQuiz object
    handleClick() {
        // TODO: IMPLEMENT STACK NAVIGATION: QUIZZES/SPECIFICQUIZ/SPECIFICQUESTION
        return 0;
    }


    /**
     * GETQUIZZES
     * When page renders,
     * Retrieve list of quizzes, store in state
     */
    getQuizzes() {
        console.log("retrieving quizzes");

        // TODO: IMPLEMENT FETCH
        fetch("http://127.0.0.1:8000/api/quiz/list/released/" + this.props.match.params.classid)
        // .then(res => res.json())
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


    /**
     * RENDERQUIZZES
     * Shows list of quizzes (with title, date, id, score)
     * Click button to view that specific quiz
     */
    renderQuizzes() {
        this.state.quizzes.map(quiz => {
            return (
                <Card>
                    <CardTitle>{quiz.name}</CardTitle>
                    <CardBody>
                        <CardText>{quiz.time_created}</CardText>
                        <CardText>{quiz.description}</CardText>
                        <CardText>{quiz.score}</CardText>
                        <Button onClick={this.handleClick(quiz)}>View Quiz</Button>
                    </CardBody>
                </Card>
            )
        })
    }


    /**
     * renders the InstrListQuiz page
     */
    render() {

        return (
            <div>
                <Card>
                    <CardBody>
                        {this.renderQuizzes}
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default InstrListQuizzes;