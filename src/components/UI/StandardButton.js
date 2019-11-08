import React from 'react';

class StandardButton extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const text = this.props.text;
        return (
            <a href={link}>
                <button type="button" class="btn btn-primary btn-lg btn-block">{text}</button>
            </a>
        );
    }
}