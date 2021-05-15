import React, { Component } from 'react';
import {
    Alert,
    Row,
    Col,
    Form, Card, Accordion, Button
} from 'react-bootstrap';
import './HealthCareSettings.css';
import { store } from 'react-notifications-component';

class HealthCareSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            isChecked: false
        };
        this.selectedHealthCareSettings = this.props.selectedHealthCareSettings;
        console.log(this.props);
        this.addNewHealthCare = this.props.addNewHealthCare ? this.props.addNewHealthCare.addNewHealthCare : false;
        console.log(this.addNewHealthCare);
        console.log(this.selectedHealthCareSettings);
        if (!this.addNewHealthCare && !this.isEmpty(this.selectedHealthCareSettings)) {
          console.log("Inside If")
            this.state.authType = this.selectedHealthCareSettings.authType;
            this.state.clientId = this.selectedHealthCareSettings.clientId;
            this.state.clientSecret = this.selectedHealthCareSettings.clientSecret;
            this.state.fhirServerBaseURL = this.selectedHealthCareSettings.fhirServerBaseURL;
            this.state.tokenEndpoint = this.selectedHealthCareSettings.tokenURL;
            this.state.scopes = this.selectedHealthCareSettings.scopes;
            this.state.restAPIURL= this.selectedHealthCareSettings.restAPIURL;
            this.state.startThreshold = this.selectedHealthCareSettings.encounterStartThreshold;
            this.state.endThreshold = this.selectedHealthCareSettings.encounterEndThreshold;
        } else {
            this.state.authType = 'SofProvider';
        }
        this.state.isSaved = false;
        this.saveHealthCareSettings = this.saveHealthCareSettings.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleDirectChange = this.handleDirectChange.bind(this);
        this.handleReportChange = this.handleReportChange.bind(this);
        this.openHealthCareSettingsList = this.openHealthCareSettingsList.bind(this);
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleRadioChange(e) {
        this.setState({
          authType: e.target.value
        });
    }

    handleDirectChange(e) {
        console.log(e.target.value);
        this.setState({
            directType: e.target.value
        });
    }
    handleReportChange(e) {
        this.setState({
            reportType: e.target.value
        });
    }

    handleToggleButton(e) {
        console.log(e);
        console.log(e.target.value);
        if (this.state.isChecked) {
            this.setState({ isChecked: false, isLoggingEnabled: false });
        } else {
            this.setState({ isChecked: true, isLoggingEnabled: true });
        }
        console.log(this.state);
    }

    openHealthCareSettingsList() {
        this.props.history.push('healthCareSettingsList');
    }

    geturl() {
        var protocol, context, host, strurl;
        protocol = window.location.protocol;
        host = window.location.host;
        //port = window.location.port;
        context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
        strurl = protocol + "//" + host + context;
        return strurl;
    };

    saveHealthCareSettings() {
        console.log("clicked");
        console.log(this.state.xdrRecipientAddress);
        var requestMethod = '';
        var healthCareSettings = {
            authType: this.state.authType,
            clientId: this.state.clientId,
            clientSecret: this.state.clientSecret && this.state.authType === 'SofSystem' ? this.state.clientSecret : null,
            fhirServerBaseURL: this.state.fhirServerBaseURL,
            tokenURL: this.state.tokenEndpoint ? this.state.tokenEndpoint : null,
            scopes: this.state.scopes,
            restAPIURL: this.state.restAPIURL ? this.state.restAPIURL : null,
            encounterStartThreshold: this.state.startThreshold,
            encounterEndThreshold: this.state.endThreshold,
            lastUpdated:new Date()
        };
        if (!this.addNewHealthCare && this.selectedHealthCareSettings) {
          healthCareSettings['id'] = this.selectedHealthCareSettings.id;
            requestMethod = 'PUT';
        } else {
            requestMethod = 'POST';
        }
        console.log(this.geturl());
        console.log(JSON.stringify(healthCareSettings));
        // var serviceURL = this.geturl();
        fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/healthcareSettings", {
            method: requestMethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(healthCareSettings)
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        isSaved: true
                    });
                    return response.json();
                } else {
                    const errorMessage = response.json();
                    console.log(errorMessage);
                    store.addNotification({
                        title: '' + response.status + '',
                        message: 'Error in Saving the HealthCare Settings',
                        type: 'danger',
                        insert: 'bottom',
                        container: 'bottom-right',
                        animationIn: ['animated', 'fadeIn'],
                        animationOut: ['animated', 'fadeOut'],
                        dismiss: {
                            duration: 5000,
                            click: true,
                            onScreen: true
                        }
                    });
                    return;
                }
            })
            .then(result => {
                console.log(result);
                if (result) {
                    this.setState({
                        authType: "SofProvider",
                        clientId: "",
                        clientSecret: "",
                        fhirServerBaseURL: "",
                        tokenEndpoint: "",
                        scopes: "",
                        startThreshold: "",
                        endThreshold: "",
                        restAPIURL: ""
                    });
                    store.addNotification({
                        title: 'Success',
                        message: 'Client Details are saved successfully.',
                        type: 'success',
                        insert: 'bottom',
                        container: 'bottom-right',
                        animationIn: ['animated', 'fadeIn'],
                        animationOut: ['animated', 'fadeOut'],
                        dismiss: {
                            duration: 5000,
                            click: true,
                            onScreen: true
                        }
                    });

                    this.openHealthCareSettingsList();
                }

            });
    }

    render() {
        const setShow = () => this.setState({ isSaved: false });

        const handleSubmit = (event) => {
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (form.checkValidity() === true) {
                this.saveHealthCareSettings();
                this.setState({
                    validated: true
                });
                event.preventDefault();
                event.stopPropagation();
            }

        };
        return (
            <div className="healthCareSettings">
                <br />
                <Row>
                    <Col md="6">
                        <h2>HealthCare Settings</h2>
                    </Col>
                    <Col md="6" className="clientCol">
                        <Button onClick={this.openHealthCareSettingsList}>Existing HealthCareSettings</Button>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <Alert
                            variant="success"
                            show={this.state.isSaved}
                            onClose={() => setShow()}
                            dismissible
                        >
                            HealthCare Settings are saved successfully.
        </Alert>
                        <Form noValidate validated={this.state.validated} onSubmit={handleSubmit} >
                            <Accordion defaultActiveKey="0">
                                <Card className="accordionCards">
                                    <Accordion.Toggle as={Card.Header} eventKey="0">
                                        FHIR Configuration
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body className="fhirConfiguration">
                                            <Form.Group as={Row} controlId="formHorizontalClientId">
                                                <Form.Label column sm={2}>
                                                    Launch Type:
                                    </Form.Label>
                                                <Col sm={10}>
                                                    <Row>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="providerLaunch">
                                                                <Form.Check.Input type="radio" checked={this.state.authType === 'SofProvider'} value="SofProvider" name="authType" onChange={e => this.handleRadioChange(e)} />
                                                                <Form.Check.Label>Provider Launch</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="systemLaunch">
                                                                <Form.Check.Input type="radio" checked={this.state.authType === 'SofSystem'} value="SofSystem" onChange={e => this.handleRadioChange(e)} />
                                                                <Form.Check.Label>System Launch</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="formHorizontalClientId">
                                                <Form.Label column sm={2}>
                                                    Client Id:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="ClientId" name="clientId" required onChange={e => this.handleChange(e)} value={this.state.clientId} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Client Id.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            {this.state.authType === 'SofSystem' ? (
                                                <Form.Group as={Row} controlId="formHorizontalClientSecret">
                                                    <Form.Label column sm={2}>
                                                        Client Secret:
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control type="text" placeholder="Client Secret" name="clientSecret" required={this.state.launchType === 'systemLaunch' ? true : false} onChange={e => this.handleChange(e)} value={this.state.clientSecret} />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please provide a Client Secret.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>
                                            ) : ''}

                                            <Form.Group as={Row} controlId="formHorizontalScopes">
                                                <Form.Label column sm={2}>
                                                    Scopes:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control as="textarea" rows="3" name="scopes" onChange={e => this.handleChange(e)} required value={this.state.scopes} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide Scopes.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="formHorizontalFHIRBaseURL">
                                                <Form.Label column sm={2}>
                                                    FHIR Server Base URL:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="FHIR Server Base URL" name="fhirServerBaseURL" required onChange={e => this.handleChange(e)} value={this.state.fhirServerBaseURL} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a FHIR Server Base URL.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            {this.state.authType === 'SofSystem' ? (
                                                <Form.Group as={Row} controlId="formHorizontalTokenURL">
                                                    <Form.Label column sm={2}>
                                                        Token Endpoint:
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control type="text" placeholder="Token Endpoint" name="tokenEndpoint" required={this.state.launchType === 'systemLaunch' ? true : false} onChange={e => this.handleChange(e)} value={this.state.tokenEndpoint} />

                                                        <Form.Control.Feedback type="invalid">
                                                            Please provide a FHIR Server Token URL.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>
                                            ) : ''} 
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                <Card className="accordionCards">
                                    <Accordion.Toggle as={Card.Header} eventKey="1">
                                        Transport Configuration
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body className="transportConfiguration">
                                                    <Form.Group as={Row} controlId="restAPIURL">
                                                        <Form.Label column sm={2}>
                                                            Rest API URL:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Rest API URL" required={this.state.directType === 'restApi' ? true : false} name="restAPIURL" onChange={e => this.handleChange(e)} value={this.state.restAPIURL} />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide Rest API URL.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                <Card className="accordionCards">
                                    <Accordion.Toggle as={Card.Header} eventKey="2">
                                        App Configuration
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body className="appConfiguration">

                                            <Form.Group as={Row} controlId="startThreshold">
                                                <Form.Label column sm={2}>
                                                    Encounter Start Time Threshold:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Encounter Start Time Threshold" required name="startThreshold" onChange={e => this.handleChange(e)} value={this.state.startThreshold} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Encounter Start Time Threshold.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="endThreshold">
                                                <Form.Label column sm={2}>
                                                    Encounter End Time Threshold:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Encounter End Time Threshold" required name="endThreshold" onChange={e => this.handleChange(e)} value={this.state.endThreshold} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Encounter End Time Threshold.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                            <Row>
                                <Col className="text-center">
                                    <Button type="submit">Save</Button>
                                </Col>
                            </Row>
                        </Form>
                        {/* <Row>
                            <Col className="text-center">
                                <button
                                    className="btn btn-primary submitBtn"
                                    type="button"
                                    onClick={e => this.saveClientDetails(e)}
                                >
                                    Save
                                </button>
                            </Col>
                        </Row> */}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default HealthCareSettings;
