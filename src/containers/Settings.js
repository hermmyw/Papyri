import React from 'react';
import Sidebar from '../components/Sidebar.js';
//import { Container, Row, Col, Button, Form, FormGroup, Input } from 'reactstrap';

/**
 * Container for the Settings page
 */
class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.changeSettings = this.changeSettings.bind(this);
    }

    /**
     * makes api call to change settings
     */
    changeSettings() {

    }

    render() {
        return (
            <div>
                <Sidebar view="settings" />
                <div className="main-area">
                    Settings
                </div>
            </div>
        )
    }
}

export default Settings;