import React from 'react';
import {     
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button,

    Collapse,

    Progress,
    
    Nav, NavItem, NavLink } from 'reactstrap';
import './Dashboard.css';
  
class InstrSpecificQuiz extends React.Component {
    
    constructor(props) {
        super(props);
        this.getQuestions = this.getQuestions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.state = {
            quiz: this.props.quiz,
        }
    }

    componentDidMount() {
        console.log("mounting");
    }

    componentWillUnmount() {
        console.log("unmounting");
    }


    // Go to specific question page
    // Pass in the specific question as a prop to the SpecificQuestion object
    handleClick() {
        // TODO: IMPLEMENT STACK NAVIGATION (AS WITH INSTRLISTQUIZZES): QUIZZES/SPECIFICQUIZ/SPECIFICQUESTION
        return 0;
    }


    /**
     * GETQUESTIONS
     * When page renders,
     * Retrieve list of quizzes, store in state
     */
    getQuestions() {
        console.log("retrieving questions");

        // TODO: IMPLEMENT FETCH PROPERLY
        fetch("http://127.0.0.1:8000/api/quiz/list/question/" + this.state.classid)
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
     * RENDERQUESTIONS
     * Render each question
     */
    renderQuestions() {
        this.state.quiz.map(question => {
            return (
                <Card>
                    <CardTitle>{question.question}</CardTitle>
                    <CardBody>
                        <CardText>{question.answer_0}</CardText>
                        <CardText>{question.answer_1}</CardText>
                        <CardText>{question.answer_2}</CardText>
                        <CardText>{question.answer_3}</CardText>
                        <Button onClick={this.handleClick(quiz)}>View Question</Button>
                    </CardBody>
                </Card>

            )
        })
    }


    /**
     * renders the Specific Quiz page
     */
    render() {

        return (
            <div>
                <Card>
                    <CardBody>
                        {this.renderQuestions}
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default InstrSpecificQuiz;