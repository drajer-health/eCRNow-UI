import React, { Component } from 'react';
import {
    Alert,
    Row,
    Col,
    Form, Card, Accordion, Button,Table
} from 'react-bootstrap';
import './PublicHealthAuthority.css';
import { store } from 'react-notifications-component';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem';

class PublicHealthAuthority extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            isValidated:false,
            isChecked: false,
        };
        this.selectedPublicHealthAuthority = this.props.selectedPublicHealthAuthority;
        console.log(this.props.addNewHealthAuthority);
        const propType = typeof this.props.addNewHealthAuthority;
        if(propType === "boolean"){
            this.addNewHealthAuthority = this.props.addNewHealthAuthority ? this.props.addNewHealthAuthority : false;
        } else {
            this.addNewHealthAuthority = this.props.addNewHealthAuthority ? this.props.addNewHealthAuthority.addNewHealthAuthority : false;
        }
        
        console.log(this.addNewHealthAuthority);
        console.log(this.selectedPublicHealthAuthority);
        if (!this.addNewHealthAuthority && !this.isEmpty(this.selectedPublicHealthAuthority)) {
          console.log("Inside If")
            this.state.authType = this.selectedPublicHealthAuthority.authType;
            this.state.clientId = this.selectedPublicHealthAuthority.clientId;
            this.state.clientSecret = this.selectedPublicHealthAuthority.clientSecret;

            this.state.username = this.selectedPublicHealthAuthority.username;
            this.state.password = this.selectedPublicHealthAuthority.password;

            this.state.fhirServerBaseURL = this.selectedPublicHealthAuthority.fhirServerBaseURL;
            this.state.tokenEndpoint = this.selectedPublicHealthAuthority.tokenUrl;
            this.state.scopes = this.selectedPublicHealthAuthority.scopes;
            this.state.restAPIURL= this.selectedPublicHealthAuthority.restApiUrl;
        } else {
            this.state.authType = 'SofProvider';
        }
        this.state.isSaved = false;
        this.savePublicHealthAuthority = this.savePublicHealthAuthority.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleDirectChange = this.handleDirectChange.bind(this);
        this.handleReportChange = this.handleReportChange.bind(this);
        this.openPublicHealthAuthorityList = this.openPublicHealthAuthorityList.bind(this);
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

    handleCheckboxChange(e,rowData){
        console.log(e.target.checked);
        console.log(rowData);
    }

    openPublicHealthAuthorityList() {
        this.props.history.push('PublicHealthAuthorityList');
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

    savePublicHealthAuthority() {
        console.log("save pha");
        var requestMethod = '';
        var PublicHealthAuthority = {
            authType: this.state.authType,
            clientId: this.state.clientId,
            clientSecret: this.state.clientSecret && this.state.authType === 'SofSystem' ? this.state.clientSecret : null,
            username: this.state.username,
            password: this.state.password,
            fhirServerBaseURL: this.state.fhirServerBaseURL,
            tokenUrl: this.state.tokenEndpoint ? this.state.tokenEndpoint : null,
            scopes: this.state.scopes,
            lastUpdated:new Date()
        };
        if (!this.addNewHealthAuthority && this.selectedPublicHealthAuthority) {
          PublicHealthAuthority['id'] = this.selectedPublicHealthAuthority.id;
            requestMethod = 'PUT';
        } else {
            requestMethod = 'POST';
        }
        console.log(this.geturl());
        console.log(JSON.stringify(PublicHealthAuthority));
        fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/publicHealthAuthority", {
            method: requestMethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(PublicHealthAuthority)
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
                        message: 'Error in Saving the HealthAuthority Settings',
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
                        username: "",
                        password: "",
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

                    this.openPublicHealthAuthorityList();
                }

            });
    }

    render() {
        const setShow = () => this.setState({ isSaved: false });

        const handleSubmit = (event) => {
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                this.setState({
                    isValidated: true
                });
                event.preventDefault();
                event.stopPropagation();
                store.addNotification({
                    title: 'Warning',
                    message: 'Please enter all the required fields.',
                    type: 'warning',
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
            if (form.checkValidity() === true) {
                this.savePublicHealthAuthority();
                this.setState({
                    validated: true
                });
                event.preventDefault();
                event.stopPropagation();
            }

        };
        return (
            <div className="PublicHealthAuthority">
                <br />
                <Row>
                    <Col md="6">
                        <h2>Public Health Authority</h2>
                    </Col>
                    <Col md="6" className="clientCol">
                        <Button onClick={this.openPublicHealthAuthorityList}>Existing PublicHealthAuthority</Button>
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
                            Public Health Authority are saved successfully.
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
                                                    <Form.Control type="text" placeholder="ClientId" name="clientId" required onChange={e => this.handleChange(e)} value={this.state.clientId} isInvalid={this.state.isValidated && (this.state.clientId === '' || this.state.clientId === undefined)}/>
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
                                                        <Form.Control type="text" placeholder="Client Secret" name="clientSecret" required={this.state.launchType === 'systemLaunch' ? true : false} onChange={e => this.handleChange(e)} value={this.state.clientSecret} isInvalid={this.state.isValidated && (this.state.clientSecret === '' || this.state.clientSecret === undefined)}/>
                                                        <Form.Control.Feedback type="invalid">
                                                            Please provide a Client Secret.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>
                                            ) : ''}


                                            <Form.Group as={Row} controlId="formHorizontalUsername">
                                                <Form.Label column sm={2}>
                                                    Username:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Username" name="username" onChange={e => this.handleChange(e)} value={this.state.username} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Username.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>


                                            <Form.Group as={Row} controlId="formHorizontalPassword">
                                                <Form.Label column sm={2}>
                                                    Password:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="password" placeholder="Password" name="password" onChange={e => this.handleChange(e)} value={this.state.password} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Password.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="formHorizontalScopes">
                                                <Form.Label column sm={2}>
                                                    Scopes:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control as="textarea" rows="3" name="scopes" onChange={e => this.handleChange(e)} required value={this.state.scopes} isInvalid={this.state.isValidated && (this.state.scopes === '' || this.state.scopes === undefined)}/>
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
                                                    <Form.Control type="text" placeholder="FHIR Server Base URL" name="fhirServerBaseURL" required onChange={e => this.handleChange(e)} value={this.state.fhirServerBaseURL} isInvalid={this.state.isValidated && (this.state.fhirServerBaseURL === '' || this.state.fhirServerBaseURL === undefined)}/>
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
                                
                            </Accordion>
                            <Row>
                                <Col className="text-center">
                                    <Button type="submit">Save</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PublicHealthAuthority;
