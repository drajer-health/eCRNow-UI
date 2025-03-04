import React, { Component } from "react";
import {
  Alert,
  Row,
  Col,
  Form,
  Card,
  Accordion,
  Button,
} from "react-bootstrap";
import "./PublicHealthAuthority.css";
import { toast } from "react-toastify";
import { withRouter } from "../../withRouter";
import axiosInstance from "../../Services/AxiosConfig";

class PublicHealthAuthority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      isValidated: false,
      isChecked: false,
    };
    this.selectedPublicHealthAuthority =
      this.props.selectedPublicHealthAuthority;

    const propType = typeof this.props.addNewHealthAuthority;
    if (propType === "boolean") {
      this.addNewHealthAuthority = this.props.addNewHealthAuthority
        ? this.props.addNewHealthAuthority
        : false;
    } else {
      this.addNewHealthAuthority = this.props.addNewHealthAuthority
        ? this.props.addNewHealthAuthority.addNewHealthAuthority
        : false;
    }

    if (
      !this.addNewHealthAuthority &&
      !this.isEmpty(this.selectedPublicHealthAuthority)
    ) {
      this.state.authType = this.selectedPublicHealthAuthority.authType;
      this.state.clientId = this.selectedPublicHealthAuthority.clientId;
      this.state.clientSecret = this.selectedPublicHealthAuthority.clientSecret;

      this.state.username = this.selectedPublicHealthAuthority.username;
      this.state.password = this.selectedPublicHealthAuthority.password;

      this.state.fhirServerBaseURL =
        this.selectedPublicHealthAuthority.fhirServerBaseURL;
      this.state.tokenEndpoint = this.selectedPublicHealthAuthority.tokenUrl;
      this.state.scopes = this.selectedPublicHealthAuthority.scopes;
      this.state.restAPIURL = this.selectedPublicHealthAuthority.restApiUrl;
    } else {
      this.state.authType = "SofProvider";
    }
    this.state.isSaved = false;
    this.savePublicHealthAuthority = this.savePublicHealthAuthority.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleDirectChange = this.handleDirectChange.bind(this);
    this.handleReportChange = this.handleReportChange.bind(this);
    this.openPublicHealthAuthorityList =
      this.openPublicHealthAuthorityList.bind(this);
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value.trimStart() }); // Prevent leading spaces
  };

  handleRadioChange(e) {
    this.setState({
      authType: e.target.value,
    });
  }

  handleDirectChange(e) {
    this.setState({
      directType: e.target.value,
    });
  }
  handleReportChange(e) {
    this.setState({
      reportType: e.target.value,
    });
  }

  handleToggleButton(e) {
    if (this.state.isChecked) {
      this.setState({ isChecked: false, isLoggingEnabled: false });
    } else {
      this.setState({ isChecked: true, isLoggingEnabled: true });
    }
  }

  handleCheckboxChange(e, rowData) {
    console.log(e.target.checked);
    console.log(rowData);
  }

  // openPublicHealthAuthorityList() {
  //     this.props.history.push('PublicHealthAuthorityList');
  // }
  openPublicHealthAuthorityList() {
    this.props.navigate("/publicHealthAuthorityList");
  }

  geturl() {
    var protocol, context, host, strurl;
    protocol = window.location.protocol;
    host = window.location.host;
    //port = window.location.port;
    context = window.location.pathname.substring(
      0,
      window.location.pathname.indexOf("/", 2)
    );
    strurl = protocol + "//" + host + context;
    return strurl;
  }

  savePublicHealthAuthority() {
    let requestMethod = "";
    const publicHealthAuthorityData = {
      authType: this.state.authType,
      clientId: this.state.clientId,
      clientSecret: this.state.clientSecret,
      username: this.state.username,
      password: this.state.password,
      fhirServerBaseURL: this.state.fhirServerBaseURL,
      tokenUrl: this.state.tokenEndpoint ? this.state.tokenEndpoint : null,
      scopes: this.state.scopes,
      lastUpdated: new Date(),
    };
  
    if (!this.addNewHealthAuthority && this.selectedPublicHealthAuthority) {
      publicHealthAuthorityData["id"] = this.selectedPublicHealthAuthority.id;
      requestMethod = "PUT";
    } else {
      requestMethod = "POST";
    }
    
    axiosInstance({
      method: requestMethod,
      url: "/api/publicHealthAuthority",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(publicHealthAuthorityData),
    })
      .then((response) => {
        // You might also consider checking for response.status in a custom manner,
        // but axios throws an error for statuses outside 2xx.
        if (response.status === 200) {
          this.setState({ isSaved: true });
          return response.data;
        } else {
          // This block may not be reached because axios treats non-2xx as error.
          toast.error("Error in Saving the HealthAuthority Settings", {
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
      .then((result) => {
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
            restAPIURL: "",
          });
  
          toast.success("Client Details are saved successfully.", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
  
          this.openPublicHealthAuthorityList();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Error in Saving the HealthAuthority Settings", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
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

        // Replace store notification with react-toastify
        toast.warning("Please enter all the required fields.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        return;
      }

      if (form.checkValidity() === true) {
        this.savePublicHealthAuthority();
        this.setState({
          validated: true,
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
            <Button onClick={this.openPublicHealthAuthorityList}>
              Existing PublicHealthAuthority
            </Button>
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
            <Form
              noValidate
              validated={this.state.validated}
              onSubmit={handleSubmit}
            >
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
                                <Form.Check.Input
                                  type="radio"
                                  checked={
                                    this.state.authType === "SofProvider"
                                  }
                                  value="SofProvider"
                                  name="authType"
                                  onChange={(e) => this.handleRadioChange(e)}
                                />
                                <Form.Check.Label>
                                  Provider Launch
                                </Form.Check.Label>
                              </Form.Check>
                            </Col>
                            <Col sm={4}>
                              <Form.Check type="radio" id="systemLaunch">
                                <Form.Check.Input
                                  type="radio"
                                  checked={this.state.authType === "SofSystem"}
                                  value="SofSystem"
                                  onChange={(e) => this.handleRadioChange(e)}
                                />
                                <Form.Check.Label>
                                  System Launch
                                </Form.Check.Label>
                              </Form.Check>
                            </Col>
                            <Col sm={4}>
                              <Form.Check type="radio" id="systemLaunchs">
                                {" "}
                                <Form.Check.Input
                                  type="radio"
                                  checked={
                                    this.state.authType === "UserNamePwd"
                                  }
                                  value="UserNamePwd"
                                  onChange={(e) => this.handleRadioChange(e)}
                                />
                                <Form.Check.Label>
                                  Username and Password
                                </Form.Check.Label>
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
                          <Form.Control
                            type="text"
                            placeholder="ClientId"
                            name="clientId"
                            required={
                              this.state.authType !== "UserNamePwd"
                                ? true
                                : false
                            }
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.clientId || ""}
                            isInvalid={
                              this.state.isValidated &&
                              (this.state.clientId === "" ||
                                this.state.clientId === undefined)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a Client Id.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      {this.state.authType !== "SofProvider" ? (
                        <Form.Group
                          as={Row}
                          controlId="formHorizontalClientSecret"
                        >
                          <Form.Label column sm={2}>
                            Client Secret:
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              placeholder="Client Secret"
                              name="clientSecret"
                              required={
                                this.state.authType !== "UserNamePwd"
                                  ? true
                                  : false
                              }
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.clientSecret || ""}
                              isInvalid={
                                this.state.isValidated &&
                                (this.state.clientSecret === "" ||
                                  this.state.clientSecret === undefined)
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a Client Secret.
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      ) : (
                        ""
                      )}

                      {this.state.authType === "UserNamePwd" ? (
                        <Form.Group as={Row} controlId="formHorizontalUsername">
                          <Form.Label column sm={2}>
                            Username:
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="text"
                              placeholder="Username"
                              name="username"
                              required
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.username || ""}
                              isInvalid={
                                this.state.isValidated &&
                                (this.state.username === "" ||
                                  this.state.username === undefined)
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a Username.
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      ) : (
                        ""
                      )}

                      {this.state.authType === "UserNamePwd" ? (
                        <Form.Group as={Row} controlId="formHorizontalPassword">
                          <Form.Label column sm={2}>
                            Password:
                          </Form.Label>
                          <Col sm={10}>
                            <Form.Control
                              type="password"
                              placeholder="Password"
                              name="password"
                              required
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.password || ""}
                              isInvalid={
                                this.state.isValidated &&
                                (this.state.password === "" ||
                                  this.state.password === undefined)
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a Password.
                            </Form.Control.Feedback>
                          </Col>
                        </Form.Group>
                      ) : (
                        ""
                      )}

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
                            value={this.state.scopes || ""}
                            isInvalid={
                              this.state.isValidated &&
                              (this.state.scopes === "" ||
                                this.state.scopes === undefined)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide Scopes.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group
                        as={Row}
                        controlId="formHorizontalFHIRBaseURL"
                      >
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
                            value={this.state.fhirServerBaseURL || ""}
                            isInvalid={
                              this.state.isValidated &&
                              (this.state.fhirServerBaseURL === "" ||
                                this.state.fhirServerBaseURL === undefined)
                            }
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
                            required
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.tokenEndpoint || ""}
                            isInvalid = {
                              this.state.isValidated && 
                              (this.state.tokenEndpoint === "" || 
                                this.state.tokenEndpoint === undefined
                              )
                            }
                            />
                          <Form.Control.Feedback type="invalid">
                            Please provide a FHIR Server Token URL.
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(PublicHealthAuthority);
