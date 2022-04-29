import React, { Component } from 'react';
import {
    Alert,
    Row,
    Col,
    Form, Card, Accordion, Button,Table
} from 'react-bootstrap';
import './HealthCareSettings.css';
import { store } from 'react-notifications-component';
import TextField from '@material-ui/core/TextField/TextField';
import MenuItem from '@material-ui/core/MenuItem';

class HealthCareSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            isValidated:false,
            isChecked: false,
            karFhirServerURLList:[],
            karsByHsIdList:[],
            isKarFhirServerURLSelected:false,
            selectedKARDetails:[],
            outputFormats:["FHIR","CDA_R11","CDA_R30","Both"],
            hsKARStatus:[]
        };
        this.selectedHealthCareSettings = this.props.selectedHealthCareSettings;
        console.log(this.props.addNewHealthCare);
        const propType = typeof this.props.addNewHealthCare;
        if(propType === "boolean"){
            this.addNewHealthCare = this.props.addNewHealthCare ? this.props.addNewHealthCare : false;
        } else {
            this.addNewHealthCare = this.props.addNewHealthCare ? this.props.addNewHealthCare.addNewHealthCare : false;
        }
        
        console.log(this.addNewHealthCare);
        console.log(this.selectedHealthCareSettings);
        if (!this.addNewHealthCare && !this.isEmpty(this.selectedHealthCareSettings)) {
          console.log("Inside If");
            if (this.selectedHealthCareSettings.authType === 'SofProvider') {
                this.state.authType = this.selectedHealthCareSettings.authType;
                this.state.clientId = this.selectedHealthCareSettings.clientId;
            }
            if (this.selectedHealthCareSettings.authType === 'SofSystem') {
                this.state.authType = this.selectedHealthCareSettings.authType;
                this.state.clientId = this.selectedHealthCareSettings.clientId;
                this.state.clientSecret = this.selectedHealthCareSettings.clientSecret;
            }
            if (this.selectedHealthCareSettings.authType === 'userAccountLaunch') {
                this.state.authType = this.selectedHealthCareSettings.authType;
                this.state.username = this.selectedHealthCareSettings.clientId;
                this.state.password = this.selectedHealthCareSettings.clientSecret;
            }
            if (this.selectedHealthCareSettings.isDirect) {
                this.state.directType = 'direct';
            }
            if (this.selectedHealthCareSettings.isXdr) {
                this.state.directType = 'xdr';
            }
            if (this.selectedHealthCareSettings.isRestAPI) {
                this.state.directType = 'restApi';
            }
            
            this.state.clientId = this.selectedHealthCareSettings.clientId;
            this.state.clientSecret = this.selectedHealthCareSettings.clientSecret;
            this.state.fhirServerBaseURL = this.selectedHealthCareSettings.fhirServerBaseURL;
            this.state.tokenEndpoint = this.selectedHealthCareSettings.tokenUrl;
            this.state.scopes = this.selectedHealthCareSettings.scopes;
            this.state.directHost = this.selectedHealthCareSettings.directHost;
            this.state.directUserName = this.selectedHealthCareSettings.directUser;
            this.state.directPwd = this.selectedHealthCareSettings.directPwd;
            this.state.directRecipientAddress = this.selectedHealthCareSettings.directRecipientAddress;
            this.state.smtpPort = this.selectedHealthCareSettings.smtpPort;
            this.state.imapPort = this.selectedHealthCareSettings.imapPort;
            this.state.restApiUrl= this.selectedHealthCareSettings.restApiUrl;
            this.state.assigningAuthorityId = this.selectedHealthCareSettings.assigningAuthorityId;
            this.state.startThreshold = this.selectedHealthCareSettings.encounterStartThreshold;
            this.state.endThreshold = this.selectedHealthCareSettings.encounterEndThreshold;
            this.state.subscriptionsEnabled = this.selectedHealthCareSettings.subscriptionsEnabled;
            this.state.trustedThirdParty = this.selectedHealthCareSettings.trustedThirdParty;
            this.state.orgName = this.selectedHealthCareSettings.orgName;
            this.state.orgIdSystem = this.selectedHealthCareSettings.orgIdSystem;
            this.state.orgId = this.selectedHealthCareSettings.orgId;
            this.getKARs();
            this.getKARSByHsId(this.selectedHealthCareSettings.id);
        } else {
            this.state.authType = 'SofProvider';
            this.state.directType = 'direct';
        }
        this.state.isSaved = false;
        this.saveHealthCareSettings = this.saveHealthCareSettings.bind(this);
        // this.saveKARSWithHealthCareSettings = this.saveKARSWithHealthCareSettings(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleDirectChange = this.handleDirectChange.bind(this);
        this.handleReportChange = this.handleReportChange.bind(this);
        this.openHealthCareSettingsList = this.openHealthCareSettingsList.bind(this);
        this.openKAR = this.openKAR.bind(this);
    }

    getKARs(){
        console.log("clicked");
        fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/kars/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    const errorMessage = response.json();
                    console.log(errorMessage);
                    store.addNotification({
                        title: '' + response.status + '',
                        message: 'Error in fetching the KARs',
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
                    console.log(result);
                    this.setState({
                        karFhirServerURLList:result
                    })
                }

            });
    }

    getKARSByHsId(hsId){
        console.log("clicked");
        fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/karStatusByHsId?hsId="+hsId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    const errorMessage = response.json();
                    console.log(errorMessage);
                    store.addNotification({
                        title: '' + response.status + '',
                        message: 'Error in fetching the KARs By HsId',
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
                if (result) {
                    console.log(result);
                    this.setState({
                        karsByHsIdList:result
                    })
                }

            });
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
        if(e.target.value === "SofProvider" || e.target.value === "SofSystem"){
            this.setState({
                username:'',
                password:''
            })
        }
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

    async handleKARChange(e){
        console.log(this.state.karsByHsIdList);
        const karsByHsIdList = this.state.karsByHsIdList;
        console.log(this.state.karFhirServerURLList)
        console.log(e.target.value);
        let kARDetails = this.state.karFhirServerURLList.filter(x=> {
            return x.id== e.target.value;
        });
        const karInfoList = kARDetails[0].karsInfo;
        karInfoList.sort(function(a, b) { 
            return b.id - a.id;
          });
        for(var i=0; i<karsByHsIdList.length; i++){
            const versionAndKarIdArr = karsByHsIdList[i].versionUniqueKarId.split("|");
            console.log(versionAndKarIdArr[0]);
            console.log(versionAndKarIdArr[1]);
            karInfoList.filter(x=>{
                if(x.karId === versionAndKarIdArr[0] && x.karVersion === versionAndKarIdArr[1]){
                    x['isActive'] = karsByHsIdList[i].isActive;
                    x['subscriptionsEnabled'] = karsByHsIdList[i].subscriptionsEnabled;
                    x['covidOnly'] = karsByHsIdList[i].covidOnly;
                    x['outputFormat'] = karsByHsIdList[i].outputFormat;
                }
            })
        }
        console.log(karInfoList);
        await this.setState({
             karFhirServerURL: e.target.value,
             isKarFhirServerURLSelected: true,
             selectedKARDetails: karInfoList
        })
        
        console.log(this.state.selectedKARDetails);
    }

    handleOutputFormatChange(e,rowData){
        console.log(e.target.value);
        console.log(rowData);
        rowData['outputFormat'] = e.target.value;
        rowData['isChanged'] = true;
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

    handleCheckboxChange(e,rowData,columnType){
        console.log(e.target.checked);
        console.log(rowData);
        console.log(columnType);
        if(columnType === "Activation"){
            rowData['isActive'] = e.target.checked;
            rowData['isChanged'] = true;
        } 
        if(columnType === "EnableSubscriptions"){
            rowData['subscriptionsEnabled'] = e.target.checked;
            rowData['isChanged'] = true;
        }
        if(columnType === "EnableCovidReporting"){
            rowData['covidOnly'] = e.target.checked;
            rowData['isChanged'] = true;
        }
        console.log(rowData);
        this.state.selectedKARDetails.filter(x=>{
            if(x.id === rowData.id && rowData.isChanged){
                x = rowData;
            }
        })
        this.setState({
            selectedKARDetails:[ ...this.state.selectedKARDetails ]
        })
    }

    openHealthCareSettingsList() {
        this.props.history.push('healthCareSettingsList');
    }
    openKAR(){
        this.props.history.push('kar');
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
        console.log(this.selectedHealthCareSettings);
        console.log(this.state.xdrRecipientAddress);
        var requestMethod = '';
        var healthCareSettings = {
            authType: this.state.authType,
            clientId: this.state.authType === "userAccountLaunch"?this.state.username:this.state.clientId,
            isDirect: this.state.directType === "direct" ? true : false,
            isXdr: this.state.directType === "xdr" ? true : false,
            isRestAPI: this.state.directType === "restApi" ? true : false,
            clientSecret: this.state.clientSecret && this.state.authType === 'SofSystem'  ? this.state.clientSecret : this.state.password,
            fhirServerBaseURL: this.state.fhirServerBaseURL,
            tokenUrl: this.state.tokenEndpoint ? this.state.tokenEndpoint : null,
            scopes: this.state.scopes,
            directHost: this.state.directHost && this.state.directType === "direct" ? this.state.directHost : null,
            directUser: this.state.directUserName && this.state.directType === "direct" ? this.state.directUserName : null,
            directPwd: this.state.directPwd && this.state.directType === "direct" ? this.state.directPwd : null,
            smtpPort: this.state.smtpPort && this.state.directType === "direct" ? this.state.smtpPort : null,
            imapPort: this.state.imapPort && this.state.directType === "direct" ? this.state.imapPort : null,
            directRecipientAddress: this.state.directRecipientAddress && this.state.directType === "direct" ? this.state.directRecipientAddress : null,
            xdrRecipientAddress: this.state.xdrRecipientAddress && this.state.directType === "xdr" ? this.state.xdrRecipientAddress : null,
            restApiUrl: this.state.restApiUrl && this.state.directType === "restApi" ? this.state.restApiUrl : null,
            assigningAuthorityId : this.state.assigningAuthorityId?this.state.assigningAuthorityId:null,
            encounterStartThreshold: this.state.startThreshold,
            encounterEndThreshold: this.state.endThreshold,
            subscriptionsEnabled: this.state.SubscriptionsEnabled,
            trustedThirdParty: this.state.trustedThirdParty,
            orgName: this.state.orgName ? this.state.orgName : null,
            orgIdSystem: this.state.orgIdSystem,
            orgId: this.state.orgId,
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
                        restApiUrl: ""
                    });
                    store.addNotification({
                        title: 'Success',
                        message: 'HealthCare Settings are saved successfully.',
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
                    this.saveKARSWithHealthCareSettings(this.selectedHealthCareSettings);
                    
                }

            });
    }

    saveKARSWithHealthCareSettings(hcs) {
        console.log(this.state.selectedKARDetails);
        const kars =  this.state.selectedKARDetails;
        const updatedRows = kars.filter(x=>{
            return x.isChanged === true;
        });
        const hsKARStatus = [];
        for(var i=0; i<updatedRows.length; i++){
            const karWithHsObj = {
                hsId : this.selectedHealthCareSettings.id,
                karId : updatedRows[i].karId,
                karVersion : updatedRows[i].karVersion,
                versionUniqueKarId : updatedRows[i].karId + "|" + updatedRows[i].karVersion,
                isActive : updatedRows[i].isActive?updatedRows[i].isActive:false,
                subscriptionsEnabled : updatedRows[i].subscriptionsEnabled?updatedRows[i].subscriptionsEnabled:false,
                covidOnly: updatedRows[i].covidOnly?updatedRows[i].covidOnly:false,
                // directHost: hcs.directHost,
                // directUser: hcs.directUser,
                // directPwd: hcs.directPwd,
                // smtpPort: hcs.smtpPort,
                // imapPort: hcs.imapPort,
                // directRecipientAddress: hcs.directRecipientAddress,
                // xdrRecipientAddress: hcs.xdrRecipientAddress,
                // restApiUrl: hcs.restApiUrl,
                // assigningAuthorityId:hcs.assigningAuthorityId,
                // encounterStartThreshold:hcs.encounterStartThreshold,
                // encounterEndThreshold:hcs.encounterEndThreshold,
                outputFormat : updatedRows[i].outputFormat
            }
            hsKARStatus.push(karWithHsObj);
        }
        fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/addKARStatus/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hsKARStatus)
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
                        message: 'Error in Saving the Knowledge Artifacts Status',
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
                this.openHealthCareSettingsList();
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
                    <Col md="3" className="clientCol">
                        <Button onClick={this.openHealthCareSettingsList}>Existing HealthCareSettings</Button>
                    </Col>
                    <Col md="3" className="clientCol">
                        <Button onClick={this.openKAR}>eCR Specifications/KAR</Button>
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
                                                        <Col sm={4}>
                                                            <Form.Check type="radio" id="userAccountLaunch">
                                                                <Form.Check.Input type="radio" checked={this.state.authType === 'userAccountLaunch'} value="userAccountLaunch" onChange={e => this.handleRadioChange(e)} />
                                                                <Form.Check.Label>Username & Password</Form.Check.Label>
                                                            </Form.Check>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Form.Group>
                                            {this.state.authType === 'SofSystem' || this.state.authType === 'SofProvider' ? (
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
                                            </Form.Group>):(
                                                <Form.Group as={Row} controlId="formHorizontalClientId">
                                                <Form.Label column sm={2}>
                                                    Username:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control type="text" placeholder="Username" name="username" required onChange={e => this.handleChange(e)} value={this.state.username} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Username.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                            )}

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

                                            {this.state.authType === 'userAccountLaunch' ? (
                                                <Form.Group as={Row} controlId="formHorizontalClientSecret">
                                                    <Form.Label column sm={2}>
                                                        Password:
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control type="password" placeholder="Password" name="password" required={this.state.launchType === 'userAccountLaunch' ? true : false} onChange={e => this.handleChange(e)} value={this.state.password} />
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
                                            <Form.Group as={Row} controlId="formHorizaontalSubscriptionsEnabled">
                                                <Form.Label column sm={2}>
                                                    Subscriptions Enabled:
                                                </Form.Label>
                                                <Col sm={10}>
                                                    <Row>
                                                        <Col sm={4}>
                                                            <Form.Check type="checkbox" id="subscriptionsEnabled">
                                                                <Form.Check.Input type="checkbox" value={this.state.subscriptionsEnabled} onChange={e => this.setState( (prevState) => {return {subscriptionsEnabled: !prevState.subscriptionsEnabled}})} />
                                                            </Form.Check>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="formHorizontalOrgName">
                                                        <Form.Label column sm={2}>
                                                            Org Name:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Organization Name" name="orgName" onChange={e => this.handleChange(e)} value={this.state.orgName || ''}/>
                                                        </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="formHorizontalOrgIdSystem">
                                                        <Form.Label column sm={2}>
                                                            Org ID System:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Organization ID System" name="orgIdSystem" onChange={e => this.handleChange(e)} value={this.state.orgIdSystem || ''}/>
                                                        </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="formHorizontalOrgId">
                                                        <Form.Label column sm={2}>
                                                            Org ID:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Organization ID" name="orgId" onChange={e => this.handleChange(e)} value={this.state.orgId || ''}/>
                                                        </Col>
                                            </Form.Group>
                                            
                                                <Form.Group as={Row} controlId="formHorizontalTokenURL">
                                                    <Form.Label column sm={2}>
                                                        Token Endpoint:
                                                    </Form.Label>
                                                    <Col sm={10}>
                                                        <Form.Control type="text" placeholder="Token Endpoint" name="tokenEndpoint"  onChange={e => this.handleChange(e)} value={this.state.tokenEndpoint} isInvalid={this.state.isValidated && (this.state.tokenEndpoint === '' || this.state.tokenEndpoint === undefined)}/>

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
                                                            <Form.Control type="text" placeholder="Direct Host" name="directHost" required={this.state.directType === 'direct' ? true : false} onChange={e => this.handleChange(e)} value={this.state.directHost} isInvalid={this.state.isValidated && (this.state.directHost === '' || this.state.directHost === undefined)}/>
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
                                                            <Form.Control type="text" placeholder="Direct Sender User Name" required={this.state.directType === 'direct' ? true : false} name="directUserName" onChange={e => this.handleChange(e)} value={this.state.directUserName} isInvalid={this.state.isValidated && (this.state.directUserName === '' || this.state.directUserName === undefined)}/>
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
                                                            <Form.Control type="password" name="directPwd" placeholder="Direct Sender Password" required={this.state.directType === 'direct' ? true : false} onChange={e => this.handleChange(e)} value={this.state.directPwd} isInvalid={this.state.isValidated && (this.state.directPwd === '' || this.state.directPwd === undefined)}/>
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
                                                            <Form.Control type="text" name="directRecipientAddress" required={this.state.directType === 'direct' ? true : false} placeholder="Direct Receipient Address" onChange={e => this.handleChange(e)} value={this.state.directRecipientAddress} isInvalid={this.state.isValidated && (this.state.directRecipientAddress === '' || this.state.directRecipientAddress === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a Direct Recipient Address.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} controlId="smtpPort">
                                                        <Form.Label column sm={2}>
                                                            SMTP Port:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" name="smtpPort" required={this.state.directType === 'direct' ? true : false} placeholder="SMTP Port" onChange={e => this.handleChange(e)} value={this.state.smtpPort} isInvalid={this.state.isValidated && (this.state.smtpPort === '' || this.state.smtpPort === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a SMTP Port.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} controlId="imapPort">
                                                        <Form.Label column sm={2}>
                                                            IMAP Port:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" name="imapPort" required={this.state.directType === 'direct' ? true : false} placeholder="IMAP Port" onChange={e => this.handleChange(e)} value={this.state.imapPort} isInvalid={this.state.isValidated && (this.state.imapPort === '' || this.state.imapPort === undefined)}/>
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
                                                            <Form.Control type="text" placeholder="XDR Recipient Address" required={this.state.directType === 'xdr' ? true : false} name="xdrRecipientAddress" onChange={e => this.handleChange(e)} value={this.state.xdrRecipientAddress} isInvalid={this.state.isValidated && (this.state.xdrRecipientAddress === '' || this.state.xdrRecipientAddress === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a XDR Recipient Address.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
                                                </div>
                                            ) : ''}

                                            {this.state.directType === 'restApi' ? (
                                                <div>
                                                    <Form.Group as={Row} controlId="restApiUrl">
                                                        <Form.Label column sm={2}>
                                                            Rest API URL:
                                                        </Form.Label>
                                                        <Col sm={10}>
                                                            <Form.Control type="text" placeholder="Rest API URL" required={this.state.directType === 'restApi' ? true : false} name="restApiUrl" onChange={e => this.handleChange(e)} value={this.state.restApiUrl} isInvalid={this.state.isValidated && (this.state.restApiUrl === '' || this.state.restApiUrl === undefined)}/>
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide Rest API URL.
                                                            </Form.Control.Feedback>
                                                        </Col>
                                                    </Form.Group>
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
                                                    <Form.Control type="text" placeholder="Assigning Authority Id" required name="assigningAuthorityId" onChange={e => this.handleChange(e)} value={this.state.assigningAuthorityId} isInvalid={this.state.isValidated && (this.state.assigningAuthorityId === '' || this.state.assigningAuthorityId === undefined)}/>
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
                                                    <Form.Control type="text" placeholder="Encounter Start Time Threshold" required name="startThreshold" onChange={e => this.handleChange(e)} value={this.state.startThreshold} isInvalid={this.state.isValidated && (this.state.startThreshold === '' || this.state.startThreshold === undefined)}/>
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
                                                    <Form.Control type="text" placeholder="Encounter End Time Threshold" required name="endThreshold" onChange={e => this.handleChange(e)} value={this.state.endThreshold} isInvalid={this.state.isValidated && (this.state.endThreshold === '' || this.state.endThreshold === undefined)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a Encounter End Time Threshold.
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            
                                {!this.addNewHealthCare?(
                                <Card className="accordionCards">
                                    <Accordion.Toggle as={Card.Header} eventKey="3">
                                        eCR Specifications/KAR Configuration
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body className="appConfiguration">

                                        <Form.Group as={Row} controlId="fhirServerURLPickList">
                                            <Form.Label column lg="3">
                                                Select FHIR Server URL:
                                            </Form.Label>
                                            <Col lg="9">
                                            <Form.Control as="select" defaultValue="Select FHIR Server URL" onChange={e=>this.handleKARChange(e)}>
                                                <option>Select FHIR Server URL</option>
                                                {this.state.karFhirServerURLList.map(option => (
                                                    <option key={option.id} value={option.id}>
                                                    {option.repoName +" - "+option.fhirServerURL}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                        Please provide a Encounter End Time Threshold.
                                                    </Form.Control.Feedback>
                                            </Col>
                                            </Form.Group>

                                            {this.state.isKarFhirServerURLSelected  ? (
                                                <Row>
                                                <Col>
                                                    <Table responsive="lg" striped bordered hover size="sm" className="karsTable">
                                                        <tbody>
                                                            <tr>
                                                                {/* <th>PlanDefinitionId</th> */}
                                                                <th>Name</th>
                                                                <th>Publisher</th>
                                                                <th>Version</th>
                                                                <th>Activate</th>
                                                                <th>Enable Subscriptions</th>
                                                                <th>Only Covid?</th>
                                                                <th className="outputFormat">Output Format</th>
                                                            </tr>
                                                            {
                                                                this.state.selectedKARDetails.map(get =>
                                                                    <tr key={get.karId}>
                                                                        {/* <td>{get.karId}</td> */}
                                                                        <td className="karTableName">{get.karName}</td>
                                                                        <td className="karTablePublisher">{get.karPublisher}</td>
                                                                        <td>{get.karVersion}</td>
                                                                        <td className="karCheckBoxes"><Form.Check type="checkbox" name="karActive" onChange={(e) => this.handleCheckboxChange(e, get,"Activation")} className="tableCheckboxes" checked={get.isActive}/></td>
                                                                        <td className="karCheckBoxes"><Form.Check type="checkbox" name="karSubscribed" onChange={(e) => this.handleCheckboxChange(e, get,"EnableSubscriptions")} className="tableCheckboxes" checked={get.subscriptionsEnabled}/></td>
                                                                        <td className="karCheckBoxes"><Form.Check type="checkbox" name="covidEnabled" onChange={(e) => this.handleCheckboxChange(e, get,"EnableCovidReporting")} className="tableCheckboxes" checked={get.covidOnly}/></td>
                                                                        <td>
                                                                        <Form.Control as="select" size="sm" defaultValue={get.outputFormat} onChange={e=>this.handleOutputFormatChange(e,get)}>
                                                                            <option>Select Output Format</option>
                                                                            {this.state.outputFormats.map(option => (
                                                                                <option key={option} value={option}>
                                                                                {option}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Control>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }
                                                        </tbody>
                                                    </Table> 
                                                </Col>
                                            </Row>
                                                ):''}
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>):''}
                                
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
