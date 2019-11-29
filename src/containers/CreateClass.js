import React from 'react';
import { Row, Col, Button, Form, FormGroup, FormText, Input, Label, CustomInput} from 'reactstrap';
import '../components/UI/UI.css';
import { Container } from 'react-bootstrap';
import { IoIosArrowBack } from "react-icons/io";

const createClassURL = "http://127.0.0.1:8000/api/classes/";

/**
 * Container for the Create Class page on the Instructor interface.
 * Renders a form to register a new class
 */
class CreateClass extends React.Component {

    constructor(props) {
        super(props);
        var date = new Date,
            years = [],
            year = date.getFullYear();

        for (var i = year; i < year + 5; i++) {
            years.push(i);   
        }

        this.state = {
            name: "",
            term: "",
            year: "",
            yearsOptions: years,
            days: {
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false
            },

            error: false,
            errorText: '',
        }

        this.createClass = this.createClass.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
    }

    /**
     * Makes an http request to endpoint to register a new class for the instructor.
     */
    createClass(e) {

        e.preventDefault();

        // response to http request should contain access token
        // go to new class page
        fetch(createClassURL, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: localStorage.getItem('userID'),
                name: this.state.name,
                teacher_id: localStorage.getItem('uid'),
                term: this.state.term,
                year: this.state.year,
                registration_code: '12345'
            }),
        })
            .then(res => {
                if (res.ok) {
                    return(res.json());
                }

                throw Error(res.statusText);
            })
            .then(
                (result) => {

                    // user object and authentication token
                    console.log(result);
                    this.props.history.push('/instructor/class')
                }
            )
            .catch (error => {
                console.log("Error: ", error);
                this.setState({
                    errorText: error.message,
                    error: true
                })
            })
    }

    handleSelectTerm(e) {
        console.log("select term");

        let options = e.target.options;
        let termString = options[options.selectedIndex].value;
        this.setState({term: termString});
    }

    handleSelectYear(e) {
        console.log("select year");
        let options = e.target.options;
        let newYear = options[options.selectedIndex].value;
        this.setState({year: newYear});
    }

    handleNameChange(e) {
        console.log("name change");
        console.log(e.target.value);
        console.log(this);
        this.setState({name: e.target.value});
    }

    handleDayChange(e) {
        console.log("change day");
        let day = e.target.id;
        let checked = e.target.checked;
        console.log("day: " + day);
        console.log("checked: " + checked);
        // this.setState({year: newYear});

        var newDays = this.state.days;
        newDays[day] = checked;
        this.setState({days: newDays});
    }

    handleBackClick() {
        const userID = this.props.match.params.userid;
        this.props.history.push(`/instructor/${userID}`);
    }

    render() {
        console.log("rendering");
        console.log(this.state);

        var errorMessage = null;

        if (this.state.error) {
            errorMessage = (
                <FormText>Error creating class: {this.state.errorText}. Please try again later.</FormText>
            )
        }

        return (
            <Container>
                <Form  onSubmit={ (e) => this.createClass(e) }>
                    <FormGroup>
                        <Input 
                            className="custom-input" 
                            type="text" 
                            name="class" 
                            id="classID" 
                            onChange={this.handleNameChange}
                            value={this.state.name} 
                            placeholder="Class ID" />
                    </FormGroup>
                    <FormGroup>
                        <Input type="select" bsSize="lg" name="term" onChange={ (e) => this.handleSelectTerm(e) }>
                            <option selected disabled hidden>Term</option>
                            <option value="fall">Fall</option>
                            <option value="winter">Winter</option>
                            <option value="spring">Spring</option>
                        </Input>                        
                    </FormGroup>
                    <FormGroup>
                        <Input type="select" bsSize="lg" name="year" onChange={ (e) => this.handleSelectYear(e) }>
                            <option selected disabled hidden>Year</option>
                            {this.state.yearsOptions.map((year) => 
                                <option value={year}>{year}</option>
                            )}
                        </Input>                        
                    </FormGroup>
                    <FormGroup>
                        <Label>Lecture Days</Label>
                        <div>
                            <CustomInput type="checkbox" id="monday" label="Monday" onClick={ (e) => this.handleDayChange(e) }/>
                            <CustomInput type="checkbox" id="tuesday" label="Tuesday"  onChange={ (e) => this.handleDayChange(e) }/>
                            <CustomInput type="checkbox" id="wednesday" label="Wednesday"  onChange={ (e) => this.handleDayChange(e) }/>
                            <CustomInput type="checkbox" id="thursday" label="Thursday"  onChange={ (e) => this.handleDayChange(e) }/>
                            <CustomInput type="checkbox" id="friday" label="Friday"  onChange={ (e) => this.handleDayChange(e) }/>
                            <CustomInput type="checkbox" id="saturday" label="Saturday"  onChange={ (e) => this.handleDayChange(e) }/>
                            <CustomInput type="checkbox" id="sunday" label="Sunday"  onChange={ (e) => this.handleDayChange(e) }/>
                        </div>
                    </FormGroup>
                    {errorMessage}
                    <FormGroup>
                        <Button className="yellow-button" size="lg" block type="submit">Create New Class</Button>
                    </FormGroup>
                    <Row>
                        <Col><Button className="link-button" color="link" onClick={this.handleBackClick}><IoIosArrowBack />Back</Button></Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}

export default CreateClass;