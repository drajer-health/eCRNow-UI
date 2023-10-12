import React, { Component } from "react";
import {
  Alert,
  Row,
  Col,
  Form,
  Card, Accordion,Button,Table,
} from "react-bootstrap";
import "./HealthCareSettings.css";
import { store } from "react-notifications-component";
class HealthCareSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      isValidated: false,
      isChecked: false,
      isAudRequired: false,
      ehrSupportsSubscriptions: false,
      smtpAuthEnabled: "",
      smtpSslEnabled: "",
      imapAuthEnabled: "",
      imapSslEnabled: "",
      karFhirServerURLList: [],
      karsByHsIdList: [],
      isKarFhirServerURLSelected: false,
      selectedKARDetails: [],
      outputFormats: ["CDA_R11","CDAR31_FOR_TRIAL_IMPLEMENTATION"],
      hsKARStatus: [],
    };
    this.selectedHealthCareSettings = this.props.selectedHealthCareSettings;
    console.log(this.props.addNewHealthCare);

    const propType = typeof this.props.addNewHealthCare;
    if (propType === "boolean") {
      this.addNewHealthCare = this.props.addNewHealthCare? this.props.addNewHealthCare: false;
    } else {
      this.addNewHealthCare = this.props.addNewHealthCare? this.props.addNewHealthCare.addNewHealthCare: false;
    }
    console.log(this.addNewHealthCare);
    console.log(this.selectedHealthCareSettings);

    if (!this.addNewHealthCare &&!this.isEmpty(this.selectedHealthCareSettings) ) {
      console.log("Inside If");
      if (this.selectedHealthCareSettings.authType === "SofBackend") {
        this.state.authType = this.selectedHealthCareSettings.authType;
        this.state.clientId = this.selectedHealthCareSettings.clientId;
      }
      if (this.selectedHealthCareSettings.authType === "System") {
        this.state.authType = this.selectedHealthCareSettings.authType;
        this.state.clientId = this.selectedHealthCareSettings.clientId;
        this.state.clientSecret = this.selectedHealthCareSettings.clientSecret;
      }
      if (this.selectedHealthCareSettings.authType === 'UserNamePwd') {
        this.state.authType = this.selectedHealthCareSettings.authType;
        this.state.username = this.selectedHealthCareSettings.username;
        this.state.password = this.selectedHealthCareSettings.password;
      }
      if (this.selectedHealthCareSettings.isDirect) {
        this.state.directType = "direct";
      }
      if (this.selectedHealthCareSettings.isRestAPI) {
        this.state.directType = "restApi";
      }
      if (this.selectedHealthCareSettings.fhirAPI) {
        this.state.directType = "fhir";
      }
      if ( this.selectedHealthCareSettings.imapPort != null && this.selectedHealthCareSettings.imapUrl != null) {
        this.state.readMessageType = "imap";
      } else if (this.selectedHealthCareSettings.popPort != null &&this.selectedHealthCareSettings.popUrl != null) {
        this.state.readMessageType = "pop3";
      } else {
        this.state.readMessageType = "pop3";
      }
      if (this.selectedHealthCareSettings.createDocRefForResponse) {
        this.state.responseProcessingType = "createDocRef";
      } else if (this.selectedHealthCareSettings.handOffResponseToRestApi != null) {
        this.state.responseProcessingType = "invokeRestAPI";
      } else if (this.selectedHealthCareSettings.noAction) {
        this.state.responseProcessingType= "noACtion";
      }
      if (this.selectedHealthCareSettings.phaUrl != null) {
        this.state.submitReportTo = "pha";
      } else if (this.selectedHealthCareSettings.trustedThirdParty != null) {
        this.state.submitReportTo = "ttp";
      }
      this.state.clientId = this.selectedHealthCareSettings.clientId;
      this.state.clientSecret = this.selectedHealthCareSettings.clientSecret;
      this.state.username = this.selectedHealthCareSettings.username;
      this.state.password = this.selectedHealthCareSettings.password;
      this.state.fhirServerBaseURL =this.selectedHealthCareSettings.fhirServerBaseURL;
      this.state.tokenEndpoint = this.selectedHealthCareSettings.tokenUrl;
      this.state.scopes = this.selectedHealthCareSettings.scopes;
      this.state.directHost = this.selectedHealthCareSettings.directHost;
      this.state.directUserName = this.selectedHealthCareSettings.directUser;
      this.state.directPwd = this.selectedHealthCareSettings.directPwd;
      this.state.directEndpointCertificateNameOrAlia =this.selectedHealthCareSettings.directEndpointCertificateNameOrAlia;
      this.state.directRecipientAddress =this.selectedHealthCareSettings.directRecipientAddress;
      this.state.smtpPort = this.selectedHealthCareSettings.smtpPort;
      this.state.smtpUrl = this.selectedHealthCareSettings.smtpUrl;
      this.state.imapUrl = this.selectedHealthCareSettings.imapUrl;
      this.state.imapPort = this.selectedHealthCareSettings.imapPort;
      this.state.pop3Url = this.selectedHealthCareSettings.popUrl;
      this.state.pop3Port = this.selectedHealthCareSettings.popPort;
      this.state.restApiUrl = this.selectedHealthCareSettings.restApiUrl;
      this.state.assigningAuthorityId =this.selectedHealthCareSettings.assigningAuthorityId;
      this.state.startThreshold =this.selectedHealthCareSettings.encounterStartThreshold;
      this.state.endThreshold =this.selectedHealthCareSettings.encounterEndThreshold;
      this.state.orgName = this.selectedHealthCareSettings.orgName;
      this.state.orgIdSystem = this.selectedHealthCareSettings.orgIdSystem;
      this.state.orgId = this.selectedHealthCareSettings.orgId;
      this.state.defaultProviderId = this.selectedHealthCareSettings.defaultProviderId;
      this.state.handOffResponseToRestApi =this.selectedHealthCareSettings.handOffResponseToRestApi;
      this.state.noAction = this.selectedHealthCareSettings.noAction;
      this.state.docRefMimeType =this.selectedHealthCareSettings.docRefMimeType;
      this.state.keystoreAlias =this.selectedHealthCareSettings.backendAuthKeyAlias;
      this.state.phaUrl = this.selectedHealthCareSettings.phaUrl;
      this.state.ttpUrl = this.selectedHealthCareSettings.trustedThirdParty;

      if (this.selectedHealthCareSettings.requireAud) {
        this.state.isAudRequired = true;
      }
      if (this.selectedHealthCareSettings.ehrSupportsSubscriptions) {
        this.state.ehrSupportsSubscriptions = true;
      }
      this.getKARs();
      this.getKARSByHsId(this.selectedHealthCareSettings.id);
    } else {
      this.state.authType = "System";
      this.state.directType = "direct";
    }
    this.state.isSaved = false;
    this.saveHealthCareSettings = this.saveHealthCareSettings.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleDirectChange = this.handleDirectChange.bind(this);
    this.handleReportChange = this.handleReportChange.bind(this);
    this.openHealthCareSettingsList = this.openHealthCareSettingsList.bind(this);
    this.openKAR = this.openKAR.bind(this);
  }
  getKARs() {
    console.log("clicked");
    fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/kars/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          const errorMessage = response.json();
          console.log(errorMessage);
          store.addNotification({
            title: "" + response.status + "",
            message: "Error in fetching the KARs",
            type: "danger",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              click: true,
              onScreen: true,
            },
          });
          return;
        }
      })
      .then((result) => {
        console.log(result);
        if (result) {
          console.log(result);
          this.setState({
            karFhirServerURLList: result,
          });
        }
      });
  }

  getKARSByHsId(hsId) {
    console.log("clicked");
    fetch(
      process.env.REACT_APP_ECR_BASE_URL + "/api/karStatusByHsId?hsId=" + hsId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          const errorMessage = response.json();
          console.log(errorMessage);
          store.addNotification({
            title: "" + response.status + "",
            message: "Error in fetching the KARs By HsId",
            type: "danger",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              click: true,
              onScreen: true,
            },
          });
          return;
        }
      })
      .then((result) => {
        if (result) {
          console.log(result);
          this.setState({
            karsByHsIdList: result,
          });
        }
      });
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleRadioChange(e) {
    console.log(e.target.value);
    if(e.target.value === "UserNamePwd"){
      this.setState({
          username:''
      })
  }
    if (e.target.value === "SofBackend" || e.target.value === "System") {
      this.setState({
        username:'',
        password:'',
        clientId: '',
        clientSecret: '',
      });
    }
    this.setState({
      authType: e.target.value,
    });
  }

  handleDirectChange(e) {
    console.log(e.target.value);
    this.setState({
      directType: e.target.value,
    });
  }

  handleReadMessageTypeChange(e) {
    console.log(e.target.value);
    this.setState({
      readMessageType: e.target.value,
    });
  }

  handleSubmitReportToChange(e) {
    console.log(e.target.value);
    if (e.target.value === "pha") {
      this.state.ttpUrl = "";
    }
    if (e.target.value === "ttp") {
      this.state.ttpUrl = "";
    }
    this.setState({
      submitReportTo: e.target.value,
    });
  }

  handleResponseProcessingChange(e) {
    this.setState({
      responseProcessingType: e.target.value ,   
      
    });
  }
    handleReportChange(e) {
    this.setState({
      reportType: e.target.value,
    });
  }

  async handleKARChange(e) {
    console.log(this.state.karsByHsIdList);
    const karsByHsIdList = this.state.karsByHsIdList;
    console.log(this.state.karFhirServerURLList);
    console.log(e.target.value);
    let kARDetails = this.state.karFhirServerURLList.filter((x) => {
      return x.id == e.target.value;
    });
    const karInfoList = kARDetails[0].karsInfo;
    karInfoList.sort(function (a, b) {
      return b.id - a.id;
    });
    for (var i = 0; i < karsByHsIdList.length; i++) {
      const versionAndKarIdArr =
        karsByHsIdList[i].versionUniqueKarId.split("|");
      console.log(versionAndKarIdArr[0]);
      console.log(versionAndKarIdArr[1]);
      karInfoList.filter((x) => {
        if (
          x.karId === versionAndKarIdArr[0] &&
          x.karVersion === versionAndKarIdArr[1]
        ) {
          x["isActive"] = karsByHsIdList[i].isActive;
          x["subscriptionsEnabled"] = karsByHsIdList[i].subscriptionsEnabled;
          x["covidOnly"] = karsByHsIdList[i].covidOnly;         
          x["outputFormat"] = karsByHsIdList[i].outputFormat==="CDA_R30"?"CDAR31_FOR_TRIAL_IMPLEMENTATION":karsByHsIdList[i].outputFormat;
          
        }
      });
    }
    console.log(karInfoList);
    await this.setState({
      karFhirServerURL: e.target.value,
      isKarFhirServerURLSelected: true,
      selectedKARDetails: karInfoList,
    });

    console.log(this.state.selectedKARDetails);
  }

  handleOutputFormatChange(e, rowData) {
    console.log(e.target.value);
    console.log(rowData);
    const { value } = e.target;
    rowData["outputFormat"] = value;
    rowData["isChanged"] = value !== "";
    //this.setState({ ...this.state, isValidated: value === "" });
  }

  handleToggleButton(e) {
    console.log(e);
    console.log(e.target.value);
    if (this.state.isAudRequired) {
      console.log("inside if");
      this.setState({ isAudRequired: false });
    } else {
      console.log("inside else");
      this.setState({ isAudRequired: true });
    }
    console.log(this.state);
  }

  handleEHRSubscriptionsToggle(e) {
    if (this.state.ehrSupportsSubscriptions) {
      this.setState({ ehrSupportsSubscriptions: false });
    } else {
      this.setState({ ehrSupportsSubscriptions: true });
    }
  }
  handleSmtpAuthEnabled = (e) => {
    this.setState({
      smtpAuthEnabled: e.target.value === "true",
    });
  };

  handleSmtpSslEnabled = (e) => {
    this.setState({
      smtpSslEnabled: e.target.value === "true",
    });
  };
  handleImapAuthEnabled = (e) => {
    this.setState({
      imapAuthEnabled: e.target.value === "true",
    });
  };

  handleImapSslEnabled = (e) => {
    this.setState({
      imapSslEnabled: e.target.value === "true",
    });
  };

  handleCheckboxChange(e, rowData, columnType) {
    console.log(e.target.checked);
    console.log(rowData);
    console.log(columnType);
    if (columnType === "Activation") {
      rowData["isActive"] = e.target.checked;
      rowData["isChanged"] = true;
    }
    if (columnType === "EnableSubscriptions") {
      rowData["subscriptionsEnabled"] = e.target.checked;
      rowData["isChanged"] = true;
    }
    if (columnType === "EnableCovidReporting") {
      rowData["covidOnly"] = e.target.checked;
      rowData["isChanged"] = true;
    }
    console.log(rowData);
    this.state.selectedKARDetails.filter((x) => {
      if (x.id === rowData.id && rowData.isChanged) {
        x = rowData;
      }
    });
    this.setState({
      selectedKARDetails: [...this.state.selectedKARDetails],
    });
  }

  openHealthCareSettingsList() {
    this.props.history.push("healthCareSettingsList");
  }
  openKAR() {
    this.props.history.push("kar");
  }

  geturl() {
    var protocol, context, host, strurl;
    protocol = window.location.protocol;
    host = window.location.host;
    context = window.location.pathname.substring(
      0,
      window.location.pathname.indexOf("/", 2)
    );
    strurl = protocol + "//" + host + context;
    return strurl;
  }

  saveHealthCareSettings() {
    console.log("clicked");
    console.log(this.selectedHealthCareSettings);
    console.log(this.state.submitReportTo);
    console.log(this.state.phaUrl);
    var requestMethod = "";
    var healthCareSettings = {
      authType: this.state.authType,
      clientId: (this.state.authType === "System"||this.state.authType === "SofBackend")&&this.state.clientId ?this.state.clientId:this.state.username,
      isDirect: this.state.directType === "direct" ? true : false,
      isRestAPI: this.state.directType === "restApi" ? true : false,
      fhirAPI: this.state.directType === "fhir" ? true : false,
      clientSecret: this.state.clientSecret ? this.state.clientSecret : null,
      fhirServerBaseURL: this.state.fhirServerBaseURL,
      tokenUrl: this.state.tokenEndpoint ? this.state.tokenEndpoint : null,
      scopes: this.state.scopes,
      directHost: this.state.directHost && this.state.directType === "direct" ? this.state.directHost: null,
      directUser:this.state.directUserName && this.state.directType === "direct"? this.state.directUserName: null,
      directPwd:this.state.directPwd && this.state.directType === "direct"? this.state.directPwd: null,
      smtpPort:this.state.smtpPort && this.state.directType === "direct"? this.state.smtpPort: null,
      smtpUrl:this.state.smtpUrl && this.state.directType === "direct"? this.state.smtpUrl: null,
      imapUrl:this.state.readMessageType === "imap" &&this.state.directType === "direct" &&this.state.imapUrl? this.state.imapUrl: null,
      imapPort:this.state.readMessageType === "imap" && this.state.imapPort &&this.state.directType === "direct"? this.state.imapPort: null,
      popUrl:this.state.readMessageType === "pop3" &&this.state.directType === "direct" &&this.state.pop3Url? this.state.pop3Url: null,
      popPort: this.state.readMessageType === "pop3" &&this.state.pop3Port &&this.state.directType === "direct"? this.state.pop3Port: null,
      directRecipientAddress:this.state.directRecipientAddress && this.state.directType === "direct"? this.state.directRecipientAddress: null,
      directEndpointCertificateNameOrAlia:this.state.directEndpointCertificateNameOrAlia &&this.state.directType === "direct"? this.state.directEndpointCertificateNameOrAlia: null,
      restApiUrl:this.state.restApiUrl && this.state.directType === "restApi"? this.state.restApiUrl: null,
      assigningAuthorityId: this.state.assigningAuthorityId? this.state.assigningAuthorityId: null,
      encounterStartThreshold: this.state.startThreshold,
      encounterEndThreshold: this.state.endThreshold,
      lastUpdated: new Date(),
      requireAud: this.state.isAudRequired,
      ehrSupportsSubscriptions: this.state.ehrSupportsSubscriptions,
      smtpAuthEnabled: this.state.smtpAuthEnabled,
      smtpSslEnabled: this.state.smtpSslEnabled,
      imapAuthEnabled: this.state.imapAuthEnabled,
      imapSslEnabled: this.state.imapSslEnabled,
      backendAuthKeyAlias: this.state.keystoreAlias? this.state.keystoreAlias: null,
      username: this.state.username?this.state.username:null,
      password:this.state.password? this.state.password: null,
      createDocRefForResponse:this.state.responseProcessingType === "createDocRef" ? true : false,
      noAction: this.state.responseProcessingType==="noAction",
      docRefMimeType:this.state.responseProcessingType === "createDocRef" &&this.state.docRefMimeType != null? this.state.docRefMimeType: null,
      handOffResponseToRestApi:this.state.responseProcessingType === "invokeRestAPI" &&this.state.handOffResponseToRestApi? this.state.handOffResponseToRestApi: null,
      phaUrl:this.state.submitReportTo === "pha" && this.state.phaUrl? this.state.phaUrl: null,
      trustedThirdParty:this.state.submitReportTo === "ttp" && this.state.ttpUrl? this.state.ttpUrl: null,
      orgName: this.state.orgName ? this.state.orgName : null,
      orgIdSystem: this.state.orgIdSystem ? this.state.orgIdSystem : null,
      orgId: this.state.orgId ? this.state.orgId : null,
      assigningAuthorityId: this.state.assigningAuthorityId? this.state.assigningAuthorityId: null,
      defaultProviderId: this.state.defaultProviderId? this.state.defaultProviderId: null,
    };
    if (!this.addNewHealthCare && this.selectedHealthCareSettings) {
      healthCareSettings["id"] = this.selectedHealthCareSettings.id;
      requestMethod = "PUT";
    } else {
      requestMethod = "POST";
    }
    console.log(this.geturl());
    console.log(healthCareSettings);
    fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/healthcareSettings", {
      method: requestMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(healthCareSettings),
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            isSaved: true,
          });
          return response.json();
        } else {
          const errorMessage = response.json();
          console.log(errorMessage);
          store.addNotification({
            title: "" + response.status + "",
            message: "Error in Saving the HealthCare Settings",
            type: "danger",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              click: true,
              onScreen: true,
            },
          });
          return;
        }
      })
      .then((result) => {
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
            restApiUrl: "",
            
          });
          store.addNotification({
            title: "Success",
            message: "HealthCare Settings are saved successfully.",
            type: "success",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,

              click: true,
              onScreen: true,
            },
          });
          this.saveKARSWithHealthCareSettings(this.selectedHealthCareSettings);
        }
      });
  }
  saveKARSWithHealthCareSettings(hcs) {
    console.log(this.state.selectedKARDetails);
    const kars = this.state.selectedKARDetails;
    const updatedRows = kars.filter((x) => {
      return x.isChanged === true;
    });
    const hsKARStatus = [];
    for (var i = 0; i < updatedRows.length; i++) {     
      const karWithHsObj = {
        hsId: this.selectedHealthCareSettings.id,
        karId: updatedRows[i].karId,
        karVersion: updatedRows[i].karVersion,
        versionUniqueKarId:updatedRows[i].karId + "|" + updatedRows[i].karVersion,
        isActive: updatedRows[i].isActive ? updatedRows[i].isActive : false,
        subscriptionsEnabled: updatedRows[i].subscriptionsEnabled? updatedRows[i].subscriptionsEnabled: false,
        covidOnly: updatedRows[i].covidOnly ? updatedRows[i].covidOnly : false,        
        outputFormat: updatedRows[i].outputFormat        
      };      
      hsKARStatus.push(karWithHsObj);
    }
    fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/addKARStatus/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hsKARStatus),
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            isSaved: true,
          });
          return response.json();
        } else {
          const errorMessage = response.json();
          console.log(errorMessage);
          store.addNotification({
            title: "" + response.status + "",
            message: "Error in Saving the Knowledge Artifacts Status",
            type: "danger",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              click: true,
              onScreen: true,
            },
          });
          return;
        }
      })
      .then((result) => {
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
          isValidated: true,
        });
        event.preventDefault();
        event.stopPropagation();
        store.addNotification({
          title: "Warning",
          message: "Please enter all the required fields.",
          type: "warning",
          insert: "bottom",
          container: "bottom-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 5000,
            click: true,
            onScreen: true,
          },
        });
        return;
      }
      if (form.checkValidity() === true) {
        this.saveHealthCareSettings();
        this.setState({
          validated: true,
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
            <Button onClick={this.openHealthCareSettingsList}>
              Existing HealthCareSettings
            </Button>
          </Col>
          <Col md="3" className="clientCol">
            <Button onClick={this.openKAR}>eCR Specifications/KAR</Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Alert variant="success"show={this.state.isSaved}  onClose={() => setShow()} dismissible>
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
                              <Form.Check type="radio" id="systemLaunch">
                                <Form.Check.Input
                                  type="radio"
                                  checked={this.state.authType === "System"}
                                  value="System"
                                  onChange={(e) => this.handleRadioChange(e)}
                                />
                                <Form.Check.Label>
                                  System Launch
                                </Form.Check.Label>
                              </Form.Check>
                            </Col>
                            <Col sm={4}>
                              <Form.Check type="radio" id="backend">
                                <Form.Check.Input
                                  type="radio"
                                  checked={this.state.authType === "SofBackend"}
                                  value="SofBackend"
                                  name="authType"
                                  onChange={(e) => this.handleRadioChange(e)}
                                />
                                <Form.Check.Label>Backend</Form.Check.Label>
                              </Form.Check>
                            </Col>
                            <Col sm={4}>
                              <Form.Check type="radio" id="UserNamePwd">
                                <Form.Check.Input 
                                  type="radio" 
                                  checked={this.state.authType === 'UserNamePwd'} 
                                  value="UserNamePwd" 
                                  onChange={e => this.handleRadioChange(e)}
                                 />
                                <Form.Check.Label>Username & Password</Form.Check.Label>                          
                              </Form.Check>
                            </Col>
                          </Row>
                        </Col>
                      </Form.Group>
                      {this.state.authType === "System" || this.state.authType === "SofBackend" ? (
                        <Form.Group as={Row} controlId="formHorizontalClientId">
                          <Form.Label column sm={2}>
                            Client Id:
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              placeholder="ClientId"
                              name="clientId"
                              required={this.state.authType !== 'UserNamePwd' ? true : false} 
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.clientId}
                              isInvalid={this.state.isValidated &&this.state.authType !== 'UserNamePwd'&&(this.state.clientId === "" ||this.state.clientId === undefined)}
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a Client Id.
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      ) : (
                        <Form.Group as={Row} controlId="formHorizontalUsername">
                        <Form.Label column sm={2}>
                            Username:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                              type="text" 
                              placeholder="Username"
                              name="username" 
                              required onChange={e => this.handleChange(e)} 
                              value={this.state.username} />
                            <Form.Control.Feedback type="invalid">Please provide a Username. </Form.Control.Feedback>                               
                           
                        </Col>
                    </Form.Group>
                      )}
                      {this.state.authType === "System" ? (
                        <Form.Group as={Row} controlId="formHorizontalClientSecret" >
                          <Form.Label column sm={2}>
                            Client Secret:
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              placeholder="Client Secret"
                              name="clientSecret"
                              required={this.state.launchType === "systemLaunch"? true: false}
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.clientSecret}
                              isInvalid={this.state.isValidated &&(this.state.clientSecret === "" ||this.state.clientSecret === undefined)}
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a Client Secret.
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      ) : ''}
                        {this.state.authType === 'UserNamePwd' ? (
                          <Form.Group as={Row} controlId="formHorizontalClientSecret">
                              <Form.Label column sm={2}>
                                  Password:
                              </Form.Label>
                              <Col sm={10}>
                                  <Form.Control type="password" placeholder="Password" name="password" required={this.state.authType === 'UserNamePwd' ? true : false} onChange={e => this.handleChange(e)} value={this.state.password} />
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
                          <Form.Control
                            as="textarea"
                            rows="3"
                            name="scopes"
                            onChange={(e) => this.handleChange(e)}
                            required
                            value={this.state.scopes}
                            isInvalid={this.state.isValidated &&(this.state.scopes === "" ||this.state.scopes === undefined)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide Scopes.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row}controlId="formHorizontalFHIRBaseURL">
                        <Form.Label column sm={2}>
                          FHIR Server Base URL:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="FHIR Server Base URL"
                            name="fhirServerBaseURL"
                            required
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.fhirServerBaseURL}
                            isInvalid={this.state.isValidated &&(this.state.fhirServerBaseURL === "" ||this.state.fhirServerBaseURL === undefined)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a FHIR Server Base URL.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="formHorizontalTokenURL">
                        <Form.Label column sm={2}>
                          Token Endpoint:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="Token Endpoint"
                            name="tokenEndpoint"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.tokenEndpoint}
                            isInvalid={this.state.isValidated && (this.state.tokenEndpoint === "" ||this.state.tokenEndpoint === undefined)}
                          />

                          <Form.Control.Feedback type="invalid">
                            Please provide a FHIR Server Token URL.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      {this.state.authType === "System" ? (
                        <div>
                          <Form.Group as={Row} controlId="requireAud">
                            <Form.Label column sm={3}>
                              Require Aud Parameter?
                            </Form.Label>
                            <Col sm={9}>
                              <Form.Check
                                type="switch"
                                id="enableLogging-switch2"
                                onChange={(e) => this.handleToggleButton(e)}
                                label=""
                                className="switchBtn"
                                name="requireAud"
                                checked={this.state.isAudRequired}
                              />
                            </Col>
                          </Form.Group>
                          <Form.Group as={Row} controlId="ehrSupportsSubscriptions">
                            <Form.Label column sm={3}>
                              EHR Supports Subscriptions?
                            </Form.Label>
                            <Col sm={7}>
                              <Form.Check
                                type="switch"
                                id="enableLogging-switch10"
                                onChange={(e) =>this.handleEHRSubscriptionsToggle(e)}
                                label=""
                                className="switchBtn"
                                name="ehrSupportsSubscriptions"
                                checked={this.state.ehrSupportsSubscriptions}
                              />
                            </Col>
                          </Form.Group>
                        </div>
                      ) : (
                        ""
                      )}
                      {this.state.authType === "SofBackend" ? (
                        <Form.Group as={Row} controlId="formHorizontalKeystoreAlias">
                          <Form.Label column sm={2}>
                            Keystore Alias:
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              placeholder="Keystore Alias"
                              name="keystoreAlias"
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.keystoreAlias}
                              isInvalid={this.state.isValidated &&(this.state.keystoreAlias === "" ||this.state.keystoreAlias === undefined)}
                            />

                            <Form.Control.Feedback type="invalid">
                              Please provide Keystore Alias.
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      ) : (
                        ""
                      )}
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
                                <Form.Check.Input
                                  type="radio"
                                  checked={this.state.directType === "direct"}
                                  value="direct"
                                  onChange={(e) => this.handleDirectChange(e)}
                                />
                                <Form.Check.Label>Direct</Form.Check.Label>
                              </Form.Check>
                            </Col>
                            <Col sm={4}>
                              <Form.Check type="radio" id="restApi">
                                <Form.Check.Input
                                  type="radio"
                                  checked={this.state.directType === "restApi"}
                                  value="restApi"
                                  onChange={(e) => this.handleDirectChange(e)}
                                />
                                <Form.Check.Label>Rest API</Form.Check.Label>
                              </Form.Check>
                            </Col>
                            <Col sm={4}>
                              <Form.Check type="radio" id="fhir">
                                <Form.Check.Input
                                  type="radio"
                                  checked={this.state.directType === "fhir"}
                                  value="fhir"
                                  onChange={(e) => this.handleDirectChange(e)}
                                />
                                <Form.Check.Label>FHIR Test</Form.Check.Label>
                              </Form.Check>
                            </Col>
                          </Row>
                        </Col>
                      </Form.Group>
                      {this.state.directType === "direct" ? (
                        <div>
                          <Form.Group as={Row} controlId="directHost">
                            <Form.Label column sm={2}>
                              Direct Host:
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                placeholder="Direct Host"
                                name="directHost"
                                required={this.state.directType === "direct"? true: false}
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.directHost}
                                isInvalid={this.state.isValidated &&(this.state.directHost === "" ||this.state.directHost === undefined)}
                              />
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
                              <Form.Control
                                type="text"
                                placeholder="Direct Sender User Name"
                                required={this.state.directType === "direct"? true: false}
                                name="directUserName"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.directUserName}
                                isInvalid={this.state.isValidated &&(this.state.directUserName === "" ||this.state.directUserName === undefined)}
                              />
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
                              <Form.Control
                                type="password"
                                name="directPwd"
                                placeholder="Direct Sender Password"
                                required={this.state.directType === "direct"? true: false}
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.directPwd}
                                isInvalid={this.state.isValidated &&(this.state.directPwd === "" ||this.state.directPwd === undefined)}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a Direct Password.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          <Form.Group as={Row} controlId="directPwd">
                            <Form.Label column sm={2}>
                              Direct Endpoint Certificate Name or Alia:
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                name="directEndpointCertificateNameOrAlia"
                                placeholder="Direct Endpoint Certificate Name or Alia"
                                required={this.state.directType === "direct" ? true: false}
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.directEndpointCertificateNameOrAlia}
                                isInvalid={this.state.isValidated &&(this.state.directEndpointCertificateNameOrAlia ==="" ||this.state.directEndpointCertificateNameOrAlia ===undefined)
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a Direct Endpoint Certificate
                                Name or Alia.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            controlId="directRecipientAddress"
                          >
                            <Form.Label column sm={2}>
                              Direct Recipient Address:
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                name="directRecipientAddress"
                                required={this.state.directType === "direct"? true: false}
                                placeholder="Direct Receipient Address"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.directRecipientAddress}
                                isInvalid={this.state.isValidated &&(this.state.directRecipientAddress === "" ||this.state.directRecipientAddress ===undefined)}
                              />
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
                              <Form.Control
                                type="text"
                                name="smtpUrl"
                                required={this.state.directType === "direct"? true: false}
                                placeholder="SMTP URL"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.smtpUrl}
                                isInvalid={this.state.isValidated && (this.state.smtpUrl === "" ||this.state.smtpUrl === undefined)}
                              />
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
                              <Form.Control
                                type="text"
                                name="smtpPort"
                                required={this.state.directType === "direct"? true: false}
                                placeholder="SMTP Port"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.smtpPort}
                                isInvalid={this.state.isValidated &&(this.state.smtpPort === "" || this.state.smtpPort === undefined)}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a SMTP Port.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            controlId="formHorizontalReceiveType"
                          >
                            <Form.Label column sm={2}>
                              SMTP Auth Enabled:
                            </Form.Label>
                            <Col sm={10}>
                              <Row>
                                <Col sm={4}>
                                  <Form.Check type="radio" id="smtpAuthEnabled">
                                    <Form.Check.Input
                                      type="radio"
                                      id="smtpAuthEnabled"
                                      label="True"
                                      name="smtpAuthEnabled"
                                      value="true"
                                      checked={this.state.smtpAuthEnabled === true}
                                      onChange={this.handleSmtpAuthEnabled}
                                    />
                                    <Form.Check.Label>True</Form.Check.Label>
                                  </Form.Check>
                                </Col>
                                <Col sm={4}>
                                  <Form.Check type="radio" id="smtpAuthEnabled">
                                    <Form.Check.Input
                                      type="radio"
                                      id="smtpAuthEnabled"
                                      label="False"
                                      name="smtpAuthEnabled"
                                      value="false"
                                      checked={this.state.smtpAuthEnabled === false}
                                      onChange={this.handleSmtpAuthEnabled}
                                    />
                                    <Form.Check.Label>False</Form.Check.Label>
                                  </Form.Check>
                                </Col>
                              </Row>
                            </Col>
                          </Form.Group>
                          <Form.Group
                            as={Row}
                            controlId="formHorizontalReceiveType"
                          >
                            <Form.Label column sm={2}>
                              SMTP SSL Enabled:
                            </Form.Label>
                            <Col sm={10}>
                              <Row>
                                <Col sm={4}>
                                  <Form.Check type="radio" id="smtpSslEnabled">
                                    <Form.Check.Input
                                      type="radio"
                                      id="smtpSslEnabled"
                                      label="True"
                                      name="smtpSslEnabled"
                                      value="true"
                                      checked={this.state.smtpSslEnabled === true}
                                      onChange={this.handleSmtpSslEnabled}
                                    />
                                    <Form.Check.Label>True</Form.Check.Label>
                                  </Form.Check>
                                </Col>
                                <Col sm={4}>
                                  <Form.Check type="radio" id="smtpSslEnabled">
                                    <Form.Check.Input
                                      type="radio"
                                      id="smtpSslEnabled"
                                      label="False"
                                      name="smtpSslEnabled"
                                      value="false"
                                      checked={this.state.smtpSslEnabled === false}
                                      onChange={this.handleSmtpSslEnabled}
                                    />
                                    <Form.Check.Label>False</Form.Check.Label>
                                  </Form.Check>
                                </Col>
                              </Row>
                            </Col>
                          </Form.Group>

                          <Form.Group
                            as={Row}
                            controlId="formHorizontalReceiveType"
                          >
                            <Form.Label column sm={2}>
                              Read Messages Using:
                            </Form.Label>
                            <Col sm={10}>
                              <Row>
                                <Col sm={4}>
                                  <Form.Check type="radio" id="pop3">
                                    <Form.Check.Input
                                      type="radio"
                                      checked={this.state.readMessageType === "pop3"}
                                      value="pop3"
                                      onChange={(e) =>this.handleReadMessageTypeChange(e)}
                                    />
                                    <Form.Check.Label>POP3</Form.Check.Label>
                                  </Form.Check>
                                </Col>
                                <Col sm={4}>
                                  <Form.Check type="radio" id="imap">
                                    <Form.Check.Input
                                      type="radio"
                                      checked={this.state.readMessageType === "imap"}
                                      value="imap"
                                      onChange={(e) => this.handleReadMessageTypeChange(e)}
                                    />
                                    <Form.Check.Label>IMAP</Form.Check.Label>
                                  </Form.Check>
                                </Col>
                              </Row>
                            </Col>
                          </Form.Group>

                          {this.state.readMessageType === "imap" ? (
                            <div>
                              <Form.Group as={Row} controlId="imapUrl">
                                <Form.Label column sm={2}>
                                  IMAP URL:
                                </Form.Label>
                                <Col sm={10}>
                                  <Form.Control
                                    type="text"
                                    name="imapUrl"
                                    required={this.state.readMessagesType === "imap"? true: false}
                                    placeholder="IMAP URL"
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.imapUrl}
                                    isInvalid={this.state.isValidated &&(this.state.imapUrl === "" ||this.state.imapUrl === undefined)}
                                  />
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
                                  <Form.Control
                                    type="text"
                                    name="imapPort"
                                    required={this.state.directType === "imap"? true: false}
                                    placeholder="IMAP Port"
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.imapPort}
                                    isInvalid={this.state.isValidated &&(this.state.imapPort === "" ||this.state.imapPort === undefined)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a IMAP Port.
                                  </Form.Control.Feedback>
                                </Col>
                              </Form.Group>
                              <Form.Group
                                as={Row}
                                controlId="formHorizontalReceiveType"
                              >
                                <Form.Label column sm={2}>
                                  IMAP Auth Enabled:
                                </Form.Label>
                                <Col sm={10}>
                                  <Row>
                                    <Col sm={4}>
                                      <Form.Check type="radio"id="imapAuthEnabled">
                                        <Form.Check.Input
                                          type="radio"
                                          id="imapAuthEnabled"
                                          label="True"
                                          name="imapAuthEnabled"
                                          value="true"
                                          checked={this.state.imapAuthEnabled === true}
                                          onChange={this.handleImapAuthEnabled}
                                        />
                                        <Form.Check.Label>
                                          True
                                        </Form.Check.Label>
                                      </Form.Check>
                                    </Col>
                                    <Col sm={4}>
                                      <Form.Check type="radio"id="imapAuthEnabled" >
                                        <Form.Check.Input
                                          type="radio"
                                          id="imapAuthEnabled"
                                          label="False"
                                          name="imapAuthEnabled"
                                          value="false"
                                          checked={this.state.imapAuthEnabled === false}
                                          onChange={this.handleImapAuthEnabled}
                                        />
                                        <Form.Check.Label>
                                          False
                                        </Form.Check.Label>
                                      </Form.Check>
                                    </Col>
                                  </Row>
                                </Col>
                              </Form.Group>
                              <Form.Group
                                as={Row}
                                controlId="formHorizontalReceiveType"
                              >
                                <Form.Label column sm={2}>
                                  IMAP SSL Enabled:
                                </Form.Label>
                                <Col sm={10}>
                                  <Row>
                                    <Col sm={4}>
                                      <Form.Check type="radio"id="imapSslEnabled" >
                                        <Form.Check.Input
                                          type="radio"
                                          id="imapSslEnabled"
                                          label="True"
                                          name="imapSslEnabled"
                                          value="true"
                                          checked={this.state.imapSslEnabled === true}
                                          onChange={this.handleImapSslEnabled}
                                        />
                                        <Form.Check.Label>
                                          True
                                        </Form.Check.Label>
                                      </Form.Check>
                                    </Col>
                                    <Col sm={4}>
                                      <Form.Check type="radio" id="imapSslEnabled">
                                        <Form.Check.Input
                                          type="radio"
                                          id="imapSslEnabled"
                                          label="False"
                                          name="imapSslEnabled"
                                          value="false"
                                          checked={this.state.imapSslEnabled === false}
                                          onChange={this.handleImapSslEnabled}
                                        />
                                        <Form.Check.Label>
                                          False
                                        </Form.Check.Label>
                                      </Form.Check>
                                    </Col>
                                  </Row>
                                </Col>
                              </Form.Group>
                            </div>
                          ) : ( "")}

                          {this.state.readMessageType === "pop3" ? (
                            <div>
                              <Form.Group as={Row} controlId="pop3Url">
                                <Form.Label column sm={2}>
                                  POP3 URL:
                                </Form.Label>
                                <Col sm={10}>
                                  <Form.Control
                                    type="text"
                                    name="pop3Url"
                                    required={this.state.readMessagesType === "pop3"? true: false}
                                    placeholder="POP3 URL"
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.pop3Url}
                                    isInvalid={this.state.isValidated &&(this.state.pop3Url === "" ||this.state.pop3Url === undefined)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a POP3 URL.
                                  </Form.Control.Feedback>
                                </Col>
                              </Form.Group>
                              <Form.Group as={Row} controlId="pop3Port">
                                <Form.Label column sm={2}>
                                  POP3 Port:
                                </Form.Label>
                                <Col sm={10}>
                                  <Form.Control
                                    type="text"
                                    name="pop3Port"
                                    required={this.state.directType === "pop3"? true: false }
                                    placeholder="POP3 Port"
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.pop3Port}
                                    isInvalid={this.state.isValidated &&(this.state.pop3Port === "" ||this.state.pop3Port === undefined)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide a POP3 Port.
                                  </Form.Control.Feedback>
                                </Col>
                              </Form.Group>
                            </div>
                          ) : ("")}
                        </div>
                      ) : ( "")}
                      {this.state.directType === "restApi" ? (
                        <div>
                          <Form.Group as={Row} controlId="restApiUrl">
                            <Form.Label column sm={2}>
                              Rest API URL:
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                placeholder="Rest API URL"
                                required={this.state.directType === "restApi"? true: false}
                                name="restApiUrl"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.restApiUrl}
                                isInvalid={this.state.isValidated &&(this.state.restApiUrl === "" ||this.state.restApiUrl === undefined)}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide Rest API URL.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                        </div>
                      ) : ("")}
                      {this.state.directType === "fhir" ? (
                        <div>
                          <Form.Group  as={Row} controlId="formHorizontalSubmitReportTo">
                            <Form.Label column sm={2}>
                              Submit Report To:
                            </Form.Label>
                            <Col sm={10}>
                              <Row>
                                <Col sm={4}>
                                  <Form.Check type="radio" id="pha">
                                    <Form.Check.Input
                                      type="radio"
                                      checked={this.state.submitReportTo === "pha"}
                                      value="pha"
                                      onChange={(e) =>this.handleSubmitReportToChange(e)}
                                    />
                                    <Form.Check.Label>
                                      Public Health Authority
                                    </Form.Check.Label>
                                  </Form.Check>
                                </Col>
                                <Col sm={4}>
                                  <Form.Check type="radio" id="ttp">
                                    <Form.Check.Input
                                      type="radio"
                                      checked={this.state.submitReportTo === "ttp"}
                                      value="ttp"
                                      onChange={(e) =>this.handleSubmitReportToChange(e)}
                                    />
                                    <Form.Check.Label>
                                      Trusted Third Party
                                    </Form.Check.Label>
                                  </Form.Check>
                                </Col>
                              </Row>
                            </Col>
                          </Form.Group>
                          {this.state.submitReportTo === "pha" ? (
                            <div>
                              <Form.Group as={Row} controlId="phaUrl">
                                <Form.Label column sm={2}>
                                  Public Health Authority Endpoint:
                                </Form.Label>
                                <Col sm={10}>
                                  <Form.Control
                                    type="text"
                                    placeholder="PHA URL"
                                    required={this.state.submitReportTo === "pha"? true: false}
                                    name="phaUrl"
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.phaUrl}
                                    isInvalid={this.state.isValidated &&(this.state.phaUrl === "" ||this.state.phaUrl === undefined)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide PHA URL.
                                  </Form.Control.Feedback>
                                </Col>
                              </Form.Group>
                            </div>
                          ) : (
                            ""
                          )}
                          {this.state.submitReportTo === "ttp" ? (
                            <div>
                              <Form.Group as={Row} controlId="ttpUrl">
                                <Form.Label column sm={2}>
                                  Trusted Third Party URL:
                                </Form.Label>
                                <Col sm={10}>
                                  <Form.Control
                                    type="text"
                                    placeholder="Trusted Third Party URL"
                                    required={this.state.submitReportTo === "ttp"? true: false }
                                    name="ttpUrl"
                                    onChange={(e) => this.handleChange(e)}
                                    value={this.state.ttpUrl}
                                    isInvalid={this.state.isValidated &&(this.state.ttpUrl === "" ||this.state.ttpUrl === undefined)}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please provide TTP URL.
                                  </Form.Control.Feedback>
                                </Col>
                              </Form.Group>
                            </div>
                          ) : ("")}
                        </div>
                      ) : ("")}
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
                          Encounter Start Time Threshold in hours:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="Encounter Start Time Threshold in hours"
                            required
                            name="startThreshold"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.startThreshold}
                            isInvalid={this.state.isValidated &&(this.state.startThreshold === "" ||this.state.startThreshold === undefined)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a Encounter Start Time Threshold in hours.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="endThreshold">
                        <Form.Label column sm={2}>
                          Encounter End Time Threshold in hours:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="Encounter End Time Threshold in hours"
                            required
                            name="endThreshold"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.endThreshold}
                            isInvalid={this.state.isValidated &&(this.state.endThreshold === "" ||this.state.endThreshold === undefined)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a Encounter End Time Threshold in hours.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card className="accordionCards">
                  <Accordion.Toggle as={Card.Header} eventKey="4">
                    Organization Defaults
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="4">
                    <Card.Body className="Organization Defaults">
                      <Form.Group as={Row} controlId="orgName">
                        <Form.Label column sm={2}>
                          Organization Name:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="Organization Name"
                            required
                            name="orgName"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.orgName}
                            isInvalid={this.state.isValidated &&(this.state.orgName === "" ||this.state.orgName === undefined)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide Organization Name.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="orgIdSystem">
                        <Form.Label column sm={2}>
                          Organization Name Space URL:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="Organization Name Space URL"
                            required
                            name="orgIdSystem"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.orgIdSystem}
                            isInvalid={this.state.isValidated &&(this.state.orgIdSystem === "" ||this.state.orgIdSystem === undefined)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide Organization Name Space URL.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="endThreshold">
                        <Form.Label column sm={2}>
                          Organization Id:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="Organization Id"
                            required
                            name="orgId"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.orgId}
                            isInvalid={this.state.isValidated &&(this.state.orgId === "" ||this.state.orgId === undefined)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide Organization Id.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="assigningAuthorityId">
                        <Form.Label column sm={2}>
                          Assigning Authority Id:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="Assigning Authority Id"
                            required
                            name="assigningAuthorityId"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.assigningAuthorityId}
                            isInvalid={this.state.isValidated &&(this.state.assigningAuthorityId === "" ||this.state.assigningAuthorityId === undefined)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide Assigning Authority Id.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} controlId="defaultProviderId">
                        <Form.Label column sm={2}>
                          Default Provider Id for Document Reference creation:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="Default Provider Id for Document Reference creation"
                            required
                            name="defaultProviderId"
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.defaultProviderId}
                            isInvalid={this.state.isValidated &&(this.state.defaultProviderId === "" ||this.state.defaultProviderId === undefined)}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide Default Provider Id for Document Reference creation.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>

                <Card className="accordionCards">
                  <Accordion.Toggle as={Card.Header} eventKey="5">
                    Response Options
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="5">
                    <Card.Body className="Organization Defaults">
                      <Form.Group as={Row} controlId="responseProcessingType">
                        <Form.Label column sm={2}>
                          Response Processing Type:
                        </Form.Label>
                        <Col sm={10}>
                          <Row>
                            <Col sm={4}>
                            <Form.Check type="radio" id="createDocRef">
                                <Form.Check.Input
                                  type="radio"
                                  checked={this.state.responseProcessingType ==="createDocRef"}
                                  value="createDocRef"
                                  onChange={(e) =>this.handleResponseProcessingChange(e)}
                                />
                                <Form.Check.Label>
                                  Create Document Reference
                                </Form.Check.Label>
                              </Form.Check>
                            </Col>
                            <Col sm={4}>
                              <Form.Check type="radio" id="invokeRestAPI">
                                <Form.Check.Input
                                  type="radio"  
                                  checked={this.state.responseProcessingType ==="invokeRestAPI"}
                                  value="invokeRestAPI"
                                  onChange={(e) => this.handleResponseProcessingChange(e)}
                                />
                                <Form.Check.Label>
                                  Invoke Rest API
                                </Form.Check.Label>
                              </Form.Check>
                            </Col>
                            <Col sm={4}>
                              <Form.Check type="radio" id="noAction">
                                <Form.Check.Input
                                  type="radio"
                                  checked={this.state.responseProcessingType ==="noAction"}                                  
                                  value="noAction"
                                  onChange={(e) =>this.handleResponseProcessingChange(e)}
                                />
                                <Form.Check.Label>No Action</Form.Check.Label>
                              </Form.Check>
                            </Col>
                          </Row>
                        </Col>
                      </Form.Group>

                      {this.state.responseProcessingType === "invokeRestAPI" ? (
                        <div>
                          <Form.Group as={Row} controlId="handOffResponseToRestApi">
                            <Form.Label column sm={2}>
                              Hand off Response to Rest API URL:
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                placeholder="Rest API URL"
                                required={this.state.responseProcessingType ==="invokeRestAPI"? true: false}
                                name="handOffResponseToRestApi"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.handOffResponseToRestApi}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a Rest API URL.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                        </div>
                      ) : ("")}
                      {this.state.responseProcessingType === "createDocRef" ? (
                        <div>
                          <Form.Group as={Row} controlId="docRefMimeType">
                            <Form.Label column sm={2}>
                              Document Reference Mime Type:
                            </Form.Label>
                            <Col sm={10}>
                              <Form.Control
                                type="text"
                                placeholder="DocumentReference Mime Type"
                                required={ this.state.responseProcessingType === "createDocRef" ? true: false}
                                name="docRefMimeType"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.docRefMimeType}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide DocumentReference Mime Type.
                              </Form.Control.Feedback>
                            </Col>
                          </Form.Group>
                        </div>
                      ) : ("")}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>

                {!this.addNewHealthCare ? (
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
                            <Form.Control
                              as="select"
                              defaultValue="Select FHIR Server URL"
                              onChange={(e) => this.handleKARChange(e)}
                              required={true}
                            >
                              <option>Select FHIR Server URL</option>
                              {this.state.karFhirServerURLList.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.repoName + " - " +option.fhirServerURL}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              Please provide a Encounter End Time Threshold.
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>

                        {this.state.isKarFhirServerURLSelected ? (
                          <Row>
                            <Col>
                              <Table
                                responsive="lg"
                                striped
                                bordered
                                hover
                                size="sm"
                                className="karsTable"
                              >
                                <tbody>
                                  <tr>
                                    {/* <th>PlanDefinitionId</th> */}
                                    <th>Name</th>
                                    <th>Publisher</th>
                                    <th>Version</th>
                                    <th>Activate</th>
                                    <th>Enable Subscriptions</th>
                                    <th>Emergent Reporting</th>
                                    <th className="outputFormat">
                                      Output Format
                                    </th>
                                  </tr>
                                  {this.state.selectedKARDetails.map((get) => (
                                    <tr key={get.karId}>
                                      {/* <td>{get.karId}</td> */}
                                      <td className="karTableName">
                                        {get.karName}
                                      </td>
                                      <td className="karTablePublisher">
                                        {get.karPublisher}
                                      </td>
                                      <td>{get.karVersion}</td>
                                      <td className="karCheckBoxes">
                                        <Form.Check
                                          type="checkbox"
                                          name="karActive"
                                          onChange={(e) =>this.handleCheckboxChange(e,get,"Activation")}
                                          className="tableCheckboxes"
                                          checked={get.isActive}
                                        />
                                      </td>
                                      <td className="karCheckBoxes">
                                        <Form.Check
                                          type="checkbox"
                                          name="karSubscribed"
                                          onChange={(e) =>this.handleCheckboxChange(e,get,"EnableSubscriptions")}
                                          className="tableCheckboxes"
                                          checked={get.subscriptionsEnabled}
                                        />
                                      </td>
                                      <td className="karCheckBoxes">
                                        <Form.Check
                                          type="checkbox"
                                          name="covidEnabled"
                                          onChange={(e) =>this.handleCheckboxChange(e,get,"EnableCovidReporting")}
                                          className="tableCheckboxes"
                                          checked={get.covidOnly}
                                        />
                                      </td>
                                      <td>
                                        <Form.Control
                                          as="select"
                                          size="sm"
                                          defaultValue={get.outputFormat}
                                          onChange={(e) =>this.handleOutputFormatChange(e,get)}
                                        >
                                          <option value="">
                                            Select Output Format
                                          </option>
                                          {this.state.outputFormats.map(
                                            (option,index) => (
                                              <option
                                                key={index}
                                                value={option}
                                              >
                                                {option}
                                              </option>
                                            )
                                          )}
                                        </Form.Control>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </Col>
                          </Row>
                        ) : ("")}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                ) : ("")}
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
