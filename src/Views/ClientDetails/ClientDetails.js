import React, { Component } from 'react';
import {
    Alert,
    Row,
    Col,
    Form, Card, Accordion, Button
} from 'react-bootstrap';
import './ClientDetails.css';
import { toast } from "react-toastify";
import { withRouter } from '../../withRouter';

class ClientDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            isValidated:false,
            isChecked: false
        };
        this.selectedClientDetails = this.props.selectedClientDetails;
        this.addNew = this.props.addNew ? this.props.addNew.addNew : false;
        if (!this.addNew && !this.isEmpty(this.selectedClientDetails)) {
            if (this.selectedClientDetails.isProvider) {
                this.state.launchType = 'providerLaunch';
                this.state.clientId = this.selectedClientDetails.clientId;
            }
            if (this.selectedClientDetails.isSystem) {
                this.state.launchType = 'systemLaunch';
                this.state.clientId = this.selectedClientDetails.clientId;
                this.state.clientSecret = this.selectedClientDetails.clientSecret;
            }
            if (this.selectedClientDetails.isMultiTenantSystemLaunch) {
                this.state.launchType = 'multiTenantSystemLaunch';
                this.state.clientId = this.selectedClientDetails.clientId;
                this.state.clientSecret = this.selectedClientDetails.clientSecret;
            }
            if (this.selectedClientDetails.isUserAccountLaunch) {
                this.state.launchType = 'userAccountLaunch';
                this.state.username = this.selectedClientDetails.clientId;
                this.state.password = this.selectedClientDetails.clientSecret;
            }
            
            
            this.state.fhirServerBaseURL = this.selectedClientDetails.fhirServerBaseURL;
            this.state.tokenEndpoint = this.selectedClientDetails.tokenURL;
            this.state.scopes = this.selectedClientDetails.scopes;
            if (this.selectedClientDetails.isDirect) {
                this.state.directType = 'direct';
            }
            if (this.selectedClientDetails.isXdr) {
                this.state.directType = 'xdr';
            }
            if (this.selectedClientDetails.isRestAPI) {
                this.state.directType = 'restApi';
            }
            this.state.directHost = this.selectedClientDetails.directHost;
            this.state.directUserName = this.selectedClientDetails.directUser;
            this.state.directPwd = this.selectedClientDetails.directPwd;
            this.state.directRecipientAddress = this.selectedClientDetails.directRecipientAddress;
            this.state.smtpUrl = this.selectedClientDetails.smtpUrl;
            this.state.smtpPort = this.selectedClientDetails.smtpPort;
            this.state.imapUrl = this.selectedClientDetails.imapUrl;
            this.state.imapPort = this.selectedClientDetails.imapPort;
            this.state.restAPIURL= this.selectedClientDetails.restAPIURL;
            this.state.rrRestAPIUrl = this.selectedClientDetails.rrRestAPIUrl;
            this.state.xdrRecipientAddress = this.selectedClientDetails.xdrRecipientAddress;
            this.state.assigningAuthorityId = this.selectedClientDetails.assigningAuthorityId;
            this.state.startThreshold = this.selectedClientDetails.encounterStartThreshold;
            this.state.endThreshold = this.selectedClientDetails.encounterEndThreshold;
            this.state.rrDocRefMimeType = this.selectedClientDetails.rrDocRefMimeType;
            if (this.selectedClientDetails.isCovid) {
                this.state.reportType = "covid19";
            }
            if (this.selectedClientDetails.isFullEcr) {
                this.state.reportType = "fullecr";
            }
            if (this.selectedClientDetails.isCreateDocRef) {
                this.state.rrProcessingType = "createDocRef";
            }
            if (this.selectedClientDetails.isInvokeRestAPI) {
                this.state.rrProcessingType = "invokeRestAPI";
            }
            if (this.selectedClientDetails.isBoth) {
                this.state.rrProcessingType = "both";
            }
            if(this.selectedClientDetails.debugFhirQueryAndEicr){
                this.state.isChecked =true;
            }
        } else {
            this.state.launchType = 'providerLaunch';
            this.state.directType = 'direct';
            this.state.reportType = 'covid19';
            this.state.rrProcessingType = 'createDocRef';
        }
        this.state.isSaved = false;
        this.saveClientDetails = this.saveClientDetails.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleDirectChange = this.handleDirectChange.bind(this);
        this.handleReportChange = this.handleReportChange.bind(this);
        this.handleRRProcessingChange = this.handleRRProcessingChange.bind(this);
        this.openClientDetailsList = this.openClientDetailsList.bind(this);
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
        if(e.target.value === "userAccountLaunch"){
            this.setState({
                clientId:''
            })
        }
        if(e.target.value === "systemLaunch" || e.target.value === "providerLaunch"){
            this.setState({
                username:'',
                password:''
            })
        }
        this.setState({
            launchType: e.target.value
        });
    }

    handleDirectChange(e) {
        
        this.setState({
            directType: e.target.value
        });
    }
    handleReportChange(e) {
        this.setState({
            reportType: e.target.value
        });
    }

    handleRRProcessingChange(e) {
        this.setState({
            rrProcessingType: e.target.value
        });
    }

    handleToggleButton(e) {
        
        
        if (this.state.isChecked) {
            this.setState({ isChecked: false, isLoggingEnabled: false });
        } else {
            this.setState({ isChecked: true, isLoggingEnabled: true });
        }
        
    }

    openClientDetailsList() {
        // this.props.history.push('clientDetailsList');
        this.props.navigate('/clientDetailsList');
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

    saveClientDetails() {
        
        
        
        var requestMethod = '';
        var clientDetails = {
            isProvider: this.state.launchType === "providerLaunch" ? true : false,
            isSystem: this.state.launchType === 'systemLaunch' ? true : false,
            isMultiTenantSystemLaunch: this.state.launchType === 'multiTenantSystemLaunch' ?true : false,
            isUserAccountLaunch: this.state.launchType === "userAccountLaunch"? true : false,
            isMultiTenantSystemLaunch: this.state.launchType === "multiTenantSystemLaunch"? true : false,
            clientId: this.state.launchType === "userAccountLaunch"?this.state.username:this.state.clientId,
            clientSecret: this.state.clientSecret && (this.state.launchType === 'systemLaunch' || this.state.launchType === 'multiTenantSystemLaunch')  ? this.state.clientSecret : this.state.password,
            fhirServerBaseURL: this.state.fhirServerBaseURL,
            tokenURL: this.state.tokenEndpoint ? this.state.tokenEndpoint : null,
            scopes: this.state.scopes,
            isDirect: this.state.directType === "direct" ? true : false,
            isXdr: this.state.directType === "xdr" ? true : false,
            isRestAPI: this.state.directType === "restApi" ? true : false,
            directHost: this.state.directHost && this.state.directType === "direct" ? this.state.directHost : null,
            directUser: this.state.directUserName && this.state.directType === "direct" ? this.state.directUserName : null,
            directPwd: this.state.directPwd && this.state.directType === "direct" ? this.state.directPwd : null,
            smtpUrl: this.state.smtpUrl && this.state.directType === "direct" ? this.state.smtpUrl : null,
            smtpPort: this.state.smtpPort && this.state.directType === "direct" ? this.state.smtpPort : null,
            imapUrl: this.state.imapUrl && this.state.directType === "direct" ? this.state.imapUrl : null,
            imapPort: this.state.imapPort && this.state.directType === "direct" ? this.state.imapPort : null,
            directRecipientAddress: this.state.directRecipientAddress && this.state.directType === "direct" ? this.state.directRecipientAddress : null,
            xdrRecipientAddress: this.state.xdrRecipientAddress && this.state.directType === "xdr" ? this.state.xdrRecipientAddress : null,
            restAPIURL: this.state.restAPIURL && this.state.directType === "restApi" ? this.state.restAPIURL : null,
            assigningAuthorityId: this.state.assigningAuthorityId,
            encounterStartThreshold: this.state.startThreshold,
            encounterEndThreshold: this.state.endThreshold,
            isCovid: this.state.reportType === "covid19" ? true : false,
            isFullEcr: this.state.reportType === "fullecr" ? true : false,
            isCreateDocRef : this.state.rrProcessingType === 'createDocRef'?true:false,
            isInvokeRestAPI : this.state.rrProcessingType === 'invokeRestAPI' ? true: false,
            isBoth: this.state.rrProcessingType === 'both' ? true : false,
            rrRestAPIUrl : this.state.rrRestAPIUrl,
            rrDocRefMimeType: this.state.rrDocRefMimeType,
            debugFhirQueryAndEicr: this.state.isLoggingEnabled ? this.state.isLoggingEnabled : false,
            lastUpdated:new Date(),
            accessToken: this.selectedClientDetails?this.selectedClientDetails.accessToken:null,
            tokenExpiry: this.selectedClientDetails?this.selectedClientDetails.tokenExpiry:null,
            tokenExpiryDateTime: this.selectedClientDetails?this.selectedClientDetails.tokenExpiryDateTime:null,
            // tokenIntrospectionURL: this.state.tokenIntrospectionURL ? this.state.tokenIntrospectionURL : null,
            // ehrClientId: this.state.ehrClientId ? this.state.ehrClientId : null,
            // ehrClientSecret: this.state.ehrClientSecret ? this.state.ehrClientSecret : null,
            // ehrAuthorizationUrl: this.state.ehrAuthorizationUrl ? this.state.ehrAuthorizationUrl : null
        };
        if (!this.addNew && this.selectedClientDetails) {
            clientDetails['id'] = this.selectedClientDetails.id;
            requestMethod = 'PUT';
        } else {
            requestMethod = 'POST';
        }
        
        
        // var serviceURL = this.geturl();
        fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/clientDetails", {
            method: requestMethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientDetails)
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        isSaved: true
                    });
                    return response.json();
                } else {
                    // const errorMessage = response.json();
                    toast.error("Error in Saving the Client Details", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                      });
                    return;
                }
            })
            .then(result => {
                
                if (result) {
                    this.setState({
                        launchType: "providerLaunch",
                        clientId: "",
                        clientSecret: "",
                        fhirServerBaseURL: "",
                        // tokenEndpoint: "",
                        scopes: "",
                        directType: "direct",
                        directHost: "",
                        directUserName: "",
                        directPwd: "",
                        directRecipientAddress: "",
                        xdrRecipientAddress: "",
                        assigningAuthorityId: "",
                        startThreshold: "",
                        endThreshold: "",
                        reportType: "covid19",
                        rrProcessingType: "createDocRef",
                        ersdFileLocation: "",
                        schematronLocation: ""
                    });
                    toast.success("Client Details are saved successfully.", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                      });

                    this.openClientDetailsList();
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
                toast.error("Please enter all the required fields.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                  });
                return;
            }
            if (form.checkValidity() === true) {
                this.saveClientDetails();
                this.setState({
                    validated: true
                });
                event.preventDefault();
                event.stopPropagation();
            }

        };
        return (
            <div className="clientDetails">
                <br />
                <Row>
                    <Col md="6">
                        <h2>Client Details Configuration</h2>
                    </Col>
                    <Col md="6" className="clientCol">
                        <Button onClick={this.openClientDetailsList}>Existing Client Details</Button>
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
                            Client Details are saved successfully.
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
                                                        <Col sm={3}>
                                                            <Form.Check type="radio" id="providerLaunch">
                                                                <Form.Check.Input type="radio" checked={this.state.launchType === 'providerLaunch'} value="providerLaunch" name="launchType" onChange={e => this.handleRadioChange(e)} />
                                                                <Form.Check.Label>Provider Launch</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <Form.Check type="radio" id="systemLaunch">
                                                                <Form.Check.Input type="radio" checked={this.state.launchType === 'systemLaunch'} value="systemLaunch" onChange={e => this.handleRadioChange(e)} />
                                                                <Form.Check.Label>System Launch</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <Form.Check type="radio" id="multiTenantSystemLaunch">
                                                                <Form.Check.Input type="radio" checked={this.state.launchType === 'multiTenantSystemLaunch'} value="multiTenantSystemLaunch" onChange={e => this.handleRadioChange(e)} />
                                                                <Form.Check.Label>Multi-Tenant System Launch</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <Form.Check type="radio" id="userAccountLaunch">
                                                                <Form.Check.Input type="radio" checked={this.state.launchType === 'userAccountLaunch'} value="userAccountLaunch" onChange={e => this.handleRadioChange(e)} />
                                                                <Form.Check.Label>Username & Password</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Form.Group>
                                            {this.state.launchType === 'systemLaunch' || this.state.launchType === 'multiTenantSystemLaunch' || this.state.launchType === 'providerLaunch' ? (
                                            
                                            <Form.Group as={Row} controlId="formHorizontalClientId">
                                                <Form.Label column sm={2}>
                                                    Client Id:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="ClientId" name="clientId" required onChange={e => this.handleChange(e)} value={this.state.clientId || ''} isInvalid={this.state.isValidated && (this.state.clientId === '' || this.state.clientId === undefined)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Client Id.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>):(
                                                <Form.Group as={Row} controlId="formHorizontalClientId">
                                                <Form.Label column sm={2}>
                                                    Username:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Username" name="username" required onChange={e => this.handleChange(e)} value={this.state.username || ''} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Username.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                            )}
                                            

                                            {this.state.launchType === 'systemLaunch' || this.state.launchType === 'multiTenantSystemLaunch'? (
                                                <Form.Group as={Row} controlId="formHorizontalClientSecret">
                                                    <Form.Label column sm={2}>
                                                        Client Secret:
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control type="text" placeholder="Client Secret" name="clientSecret" required={this.state.launchType === 'systemLaunch' ? true : false} onChange={e => this.handleChange(e)} value={this.state.clientSecret || ''} isInvalid={this.state.isValidated && (this.state.clientSecret === '' || this.state.clientSecret === undefined)}/>
                                                        <Form.Control.Feedback type="invalid">
                                                            Please provide a Client Secret.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>
                                            ) : ''}

                                            {this.state.launchType === 'userAccountLaunch' ? (
                                                <Form.Group as={Row} controlId="formHorizontalClientSecret">
                                                    <Form.Label column sm={2}>
                                                        Password:
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control type="password" placeholder="Password" name="password" required={this.state.launchType === 'userAccountLaunch' ? true : false} onChange={e => this.handleChange(e)} value={this.state.password || ''} />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please provide a Password.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>
                                            ) : ''}

                                            <Form.Group as={Row} controlId="formHorizontalScopes">
                                                <Form.Label column sm={2}>
                                                    Scopes:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control as="textarea" rows="3" name="scopes" onChange={e => this.handleChange(e)} required value={this.state.scopes || ''} isInvalid={this.state.isValidated && (this.state.scopes === '' || this.state.scopes === undefined)}/>
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
                                                    <Form.Control type="text" placeholder="FHIR Server Base URL" name="fhirServerBaseURL" required onChange={e => this.handleChange(e)} value={this.state.fhirServerBaseURL || ''} isInvalid={this.state.isValidated && (this.state.fhirServerBaseURL === '' || this.state.fhirServerBaseURL === undefined)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a FHIR Server Base URL.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            {/*this.state.launchType === 'userAccountLaunch' ? (
                                                <Form.Group as={Row} controlId="formHorizontalTokenURL">
                                                    <Form.Label column sm={2}>
                                                        Token Endpoint:
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control type="text" placeholder="Token Endpoint" name="tokenEndpoint" onChange={e => this.handleChange(e)} value={this.state.tokenEndpoint} />

                                                        <Form.Control.Feedback type="invalid">
                                                            Please provide a FHIR Server Token URL.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>
                                            ) : ''} */}
                                            <Form.Group as={Row} controlId="formHorizontalTokenURL">
                                                    <Form.Label column sm={2}>
                                                        Token Endpoint:
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control type="text" placeholder="Token Endpoint" name="tokenEndpoint" onChange={e => this.handleChange(e)} value={this.state.tokenEndpoint || ''} />

                                                        <Form.Control.Feedback type="invalid">
                                                            Please provide a FHIR Server Token URL.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Form.Group>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                <Card className="accordionCards">
                                    <Accordion.Toggle as={Card.Header} eventKey="1">
                                        Transport Configuration
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body className="transportConfiguration">
                                            <Form.Group as={Row} controlId="formHorizontalClientId">
                                                <Form.Label column sm={2}>
                                                    Direct Type:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Row>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="direct">
                                                                <Form.Check.Input type="radio" checked={this.state.directType === 'direct'} value="direct" onChange={e => this.handleDirectChange(e)} />
                                                                <Form.Check.Label>Direct</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="xdr">
                                                                <Form.Check.Input type="radio" checked={this.state.directType === 'xdr'} value="xdr" onChange={e => this.handleDirectChange(e)} />
                                                                <Form.Check.Label>XDR</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="restApi">
                                                                <Form.Check.Input type="radio" checked={this.state.directType === 'restApi'} value="restApi" onChange={e => this.handleDirectChange(e)} />
                                                                <Form.Check.Label>Rest API</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Form.Group>
                                            {this.state.directType === 'direct' ? (
                                                <div>
                                                    <Form.Group as={Row} controlId="directHost">
                                                        <Form.Label column sm={2}>
                                                            Direct Host:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Direct Host" name="directHost" required={this.state.directType === 'direct' ? true : false} onChange={e => this.handleChange(e)} value={this.state.directHost || ''} isInvalid={this.state.isValidated && (this.state.directHost === '' || this.state.directHost === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a Direct Host name.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>


                                                    <Form.Group as={Row} controlId="directUserName">
                                                        <Form.Label column sm={2}>
                                                            Direct Sender User Name:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Direct Sender User Name" required={this.state.directType === 'direct' ? true : false} name="directUserName" onChange={e => this.handleChange(e)} value={this.state.directUserName || ''} isInvalid={this.state.isValidated && (this.state.directUserName === '' || this.state.directUserName === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a Direct Sender User Name.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} controlId="directPwd">
                                                        <Form.Label column sm={2}>
                                                            Direct Sender Password:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="password" name="directPwd" placeholder="Direct Sender Password" required={this.state.directType === 'direct' ? true : false} onChange={e => this.handleChange(e)} value={this.state.directPwd || ''} isInvalid={this.state.isValidated && (this.state.directPwd === '' || this.state.directPwd === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a Direct Password.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} controlId="directRecipientAddress">
                                                        <Form.Label column sm={2}>
                                                            Direct Recipient Address:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" name="directRecipientAddress" required={this.state.directType === 'direct' ? true : false} placeholder="Direct Receipient Address" onChange={e => this.handleChange(e)} value={this.state.directRecipientAddress || ''} isInvalid={this.state.isValidated && (this.state.directRecipientAddress === '' || this.state.directRecipientAddress === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a Direct Recipient Address.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} controlId="smtpUrl">
                                                        <Form.Label column sm={2}>
                                                            SMTP URL:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" name="smtpUrl" placeholder="SMTP URL" onChange={e => this.handleChange(e)} value={this.state.smtpUrl || ''} />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a SMTP URL.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} controlId="smtpPort">
                                                        <Form.Label column sm={2}>
                                                            SMTP Port:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" name="smtpPort" required={this.state.directType === 'direct' ? true : false} placeholder="SMTP Port" onChange={e => this.handleChange(e)} value={this.state.smtpPort || ''} isInvalid={this.state.isValidated && (this.state.smtpPort === '' || this.state.smtpPort === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a SMTP Port.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} controlId="imapUrl">
                                                        <Form.Label column sm={2}>
                                                            IMAP Port:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" name="imapUrl" placeholder="IMAP URL" onChange={e => this.handleChange(e)} value={this.state.imapUrl || ''} />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a IMAP URL.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} controlId="imapPort">
                                                        <Form.Label column sm={2}>
                                                            IMAP Port:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" name="imapPort" required={this.state.directType === 'direct' ? true : false} placeholder="IMAP Port" onChange={e => this.handleChange(e)} value={this.state.imapPort || ''} isInvalid={this.state.isValidated && (this.state.imapPort === '' || this.state.imapPort === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a IMAP Port.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                            ) : ''}

                                            {this.state.directType === 'xdr' ? (
                                                <div>
                                                    <Form.Group as={Row} controlId="xdrRecipientAddress">
                                                        <Form.Label column sm={2}>
                                                            XDR Recipient Address:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="XDR Recipient Address" required={this.state.directType === 'xdr' ? true : false} name="xdrRecipientAddress" onChange={e => this.handleChange(e)} value={this.state.xdrRecipientAddress || ''} isInvalid={this.state.isValidated && (this.state.xdrRecipientAddress === '' || this.state.xdrRecipientAddress === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a XDR Recipient Address.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                            ) : ''}

                                            {this.state.directType === 'restApi' ? (
                                                <div>
                                                    <Form.Group as={Row} controlId="restAPIURL">
                                                        <Form.Label column sm={2}>
                                                            Rest API URL:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Rest API URL" required={this.state.directType === 'restApi' ? true : false} name="restAPIURL" onChange={e => this.handleChange(e)} value={this.state.restAPIURL || ''} isInvalid={this.state.isValidated && (this.state.restAPIURL === '' || this.state.restAPIURL === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide Rest API URL.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                    {/* <Form.Group as={Row} controlId="ehrClientId">
                                                        <Form.Label column sm={2}>
                                                            Client Id:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Client Id" required={this.state.directType === 'restApi' ? true : false} name="ehrClientId" onChange={e => this.handleChange(e)} value={this.state.ehrClientId} />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide ClientId.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} controlId="ehrClientSecret">
                                                        <Form.Label column sm={2}>
                                                            Client Secret:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Client Secret" required={this.state.directType === 'restApi' ? true : false} name="ehrClientSecret" onChange={e => this.handleChange(e)} value={this.state.ehrClientSecret} />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide Client Secret.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} controlId="ehrAuthorizationUrl">
                                                        <Form.Label column sm={2}>
                                                            Authorization URL:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Authorization URL" required={this.state.directType === 'restApi' ? true : false} name="ehrAuthorizationUrl" onChange={e => this.handleChange(e)} value={this.state.ehrAuthorizationUrl} />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide Authorization URL.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group> */}
                                                </div>
                                            ) : ''}
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                <Card className="accordionCards">
                                    <Accordion.Toggle as={Card.Header} eventKey="2">
                                        App Configuration
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body className="appConfiguration">
                                            <Form.Group as={Row} controlId="assigningAuthorityId">
                                                <Form.Label column sm={2}>
                                                    Assigning Authority Id:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Assigning Authority Id" required name="assigningAuthorityId" onChange={e => this.handleChange(e)} value={this.state.assigningAuthorityId || ''} isInvalid={this.state.isValidated && (this.state.assigningAuthorityId === '' || this.state.assigningAuthorityId === undefined)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Assigning Authority Id.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="startThreshold">
                                                <Form.Label column sm={2}>
                                                    Encounter Start Time Threshold:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Encounter Start Time Threshold" required name="startThreshold" onChange={e => this.handleChange(e)} value={this.state.startThreshold || ''} isInvalid={this.state.isValidated && (this.state.startThreshold === '' || this.state.startThreshold === undefined)}/>
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
                                                    <Form.Control type="text" placeholder="Encounter End Time Threshold" required name="endThreshold" onChange={e => this.handleChange(e)} value={this.state.endThreshold || ''} isInvalid={this.state.isValidated && (this.state.endThreshold === '' || this.state.endThreshold === undefined)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Encounter End Time Threshold.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="rrProcessing">
                                                <Form.Label column sm={2}>
                                                    RR Processing:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Row>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="createDocRef">
                                                                <Form.Check.Input type="radio" checked={this.state.rrProcessingType === 'createDocRef'} value="createDocRef" onChange={e => this.handleRRProcessingChange(e)} />
                                                                <Form.Check.Label>Create Document Reference</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="invokeRestAPI">
                                                                <Form.Check.Input type="radio" checked={this.state.rrProcessingType === 'invokeRestAPI'} value="invokeRestAPI" onChange={e => this.handleRRProcessingChange(e)} />
                                                                <Form.Check.Label>Invoke Rest API</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="both">
                                                                <Form.Check.Input type="radio" checked={this.state.rrProcessingType === 'both'} value="both" onChange={e => this.handleRRProcessingChange(e)} />
                                                                <Form.Check.Label>Both</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Form.Group>
                                            
                                            {this.state.rrProcessingType === 'invokeRestAPI' || this.state.rrProcessingType === 'both' ? (
                                                <div>
                                                    <Form.Group as={Row} controlId="rrRestAPIUrl">
                                                        <Form.Label column sm={2}>
                                                            RR Rest API URL:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="RR Rest API URL" required={this.state.rrProcessingType === 'invokeRestAPI' || this.state.rrProcessingType === 'both' ? true : false} name="rrRestAPIUrl" onChange={e => this.handleChange(e)} value={this.state.rrRestAPIUrl || ''} />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a RR Rest API URL.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                            ) : ''}

                                            <Form.Group as={Row} controlId="rrDocRefMimeType">
                                                        <Form.Label column sm={2}>
                                                            RR Doc Ref Mime Type:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="RR DocumentReference Mime Type" name="rrDocRefMimeType" onChange={e => this.handleChange(e)} value={this.state.rrDocRefMimeType || ''} />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide DocumentReference Mime Type.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>

                                            <Form.Group as={Row} controlId="reportType">
                                                <Form.Label column sm={2}>
                                                    Report Type:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Row>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="covid19">
                                                                <Form.Check.Input type="radio" checked={this.state.reportType === 'covid19'} value="covid19" onChange={e => this.handleReportChange(e)} />
                                                                <Form.Check.Label>Covid-19</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="fullecr">
                                                                <Form.Check.Input type="radio" checked={this.state.reportType === 'fullecr'} value="fullecr" onChange={e => this.handleReportChange(e)} />
                                                                <Form.Check.Label>Full ECR Report</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="debugFhirQueryAndEicr">
                                                <Form.Label column sm={2}>
                                                Debug Fhir Query And Eicr
                                                </Form.Label>
                                                <Col sm={9}>
                                                    <Form.Check
                                                        type="switch"
                                                        id="enableLogging-switch"
                                                        onChange={e => this.handleToggleButton(e)}
                                                        label=""
                                                        className="switchBtn"
                                                        name="debugFhirQueryAndEicr"
                                                        checked={this.state.isChecked}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            {/* <Form.Group as={Row} controlId="tokenIntrospectionURL">
                                                <Form.Label column sm={2}>
                                                    Token Introspection URL:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Token Introspection URL" required name="tokenIntrospectionURL" onChange={e => this.handleChange(e)} value={this.state.tokenIntrospectionURL} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Token Introspection URL.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group> */}
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

export default withRouter(ClientDetails);
