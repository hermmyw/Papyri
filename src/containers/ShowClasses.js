import React from 'react';
import Sidebar from '../components/Sidebar.js';
import '../components/UI/UI.css';

/**
 * Container for the Show Class page. 
 * Shows all the classes an instructor is teaching or a student is enrolled in.
 */

class ShowClasses extends React.Component {
    constructor(props) {
        super(props);
        this.getClasses = this.getClasses.bind(this);
    }

    /**
     * Makes an http requests to endpoint to get classes of instructor or student so they can be rendered
     */
    getClasses() {

    }

    render() {
        return (
            <div>
                <Sidebar view="show classes" />
                <div className="main-area">
                    <p>Show Classes</p>
                </div>
            </div>
        )
    }
}

export default ShowClasses;