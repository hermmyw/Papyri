import React from 'react'
import { Route , withRouter} from 'react-router-dom';
import './UI.css'

class SidebarOld extends React.Component {
    render() {
        return (
            <div className="dashboard-sidebar">{this.props.children}</div>
        )
    }
}

class SelectedButton extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        //this.props.history.push("#");
    }

    render() {
        var buttonStyle = this.props.style;
        console.log(buttonStyle);
        return (
            <div className="selected-sidebar-button" onClick={this.handleClick} style={{buttonStyle}}>{this.props.children}</div>
        )
    }
}

class NonselectedButton extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        //this.props.history.push("#");
    }

    render() {
        var buttonStyle = this.props.style;
        console.log(buttonStyle);
        return (
            <div className="nonselected-sidebar-button" onClick={this.props.onClick} style={{buttonStyle}}>{this.props.children}</div>
        )
    }
}

class BackButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.history.push('/');
    }

    render() {
        var buttonStyle = this.props.style;
        return (
            <div className="back-sidebar-button" onClick={this.props.onClick} style={{buttonStyle}}>{this.props.children}</div>
        )
    }
}
//var RouterSelectedButton = withRouter(SelectedButton);
//var RouterNonselectedButton = withRouter(NonselectedButton);
export { SelectedButton, NonselectedButton, BackButton };