import React from 'react';
import Sidebar from '../components/Sidebar.js';
import { Button, Form, FormGroup, Input, Label, CustomInput} from 'reactstrap';
import '../components/UI/UI.css';


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
            }
        }

        this.createClass = this.createClass.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
            
    }

    /**
     * Makes an http request to endpoint to register a new class for the instructor.
     */
    createClass() {

        // response to http request should contain access token
        // go to new class page
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

    render() {
        console.log("rendering");
        console.log(this.state);
        return (
            <div>
                <Sidebar view="create class" />
                <div className="main-area">
                    <Form  onSubmit={this.createClass}>
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
                        <FormGroup>
                            <Button className="yellow-button" size="lg" block type="submit">Create New Class</Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
}

export default CreateClass;