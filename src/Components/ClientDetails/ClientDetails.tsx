import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Alert,
  Row,
  Col,
  Form,
  Card,
  Accordion,
  Button,
} from "react-bootstrap";
import "./ClientDetails.css";
import { withRouter } from "../../withRouter";
import { ClientDetailsProps } from "../../Models/ClientDetails.model";
import FormInputGroup from "../../ReUsables/FormInputGroup";
import FormRadioGroup from "../../ReUsables/FormRadioGroup";
import FormButtonGroup from "../../ReUsables/FormButtonGroup";
import axiosInstance from "../../Services/AxiosConfig";

const ClientDetails: React.FC<ClientDetailsProps> = ({
  selectedClientDetails,
  addNew = { addNew: false },
}) => {
  const navigate = useNavigate();

  const launchTypeOptions = [
    { id: "providerLaunch", label: "Provider Launch", value: "providerLaunch" },
    { id: "systemLaunch", label: "System Launch", value: "systemLaunch" },
    {
      id: "userAccountLaunch",
      label: "Username & Password",
      value: "userAccountLaunch",
    },
  ];

  const directTypeOptions = [
    { id: "direct", label: "Direct", value: "direct" },
    { id: "xdr", label: "XDR", value: "xdr" },
    { id: "restApi", label: "Rest API", value: "restApi" },
  ];

  const rrProcessingOptions = [
    {
      id: "createDocRef",
      label: "Create Document Reference",
      value: "createDocRef",
    },
    { id: "invokeRestAPI", label: "Invoke Rest API", value: "invokeRestAPI" },
    { id: "both", label: "Both", value: "both" },
  ];

  const reportTypeOptions = [
    { id: "covid19", label: "Covid-19", value: "covid19" },
    { id: "fullecr", label: "Full ECR Report", value: "fullecr" },
  ];

  const [state, setState] = useState<any>({
    validated: false,
    isValidated: false,
    isChecked: false,
    isSaved: false,
    launchType: "providerLaunch",
    directType: "direct",
    reportType: "covid19",
    rrProcessingType: "createDocRef",
  });

  const isEmpty = (obj: any) => Object.keys(obj).length === 0;

  useEffect(() => {
    if (!addNew.addNew && !isEmpty(selectedClientDetails)) {
      const updatedState: any = { ...state };

      if (selectedClientDetails.isProvider) {
        updatedState.launchType = "providerLaunch";
        updatedState.clientId = selectedClientDetails.clientId;
      }
      if (selectedClientDetails.isSystem) {
        updatedState.launchType = "systemLaunch";
        updatedState.clientId = selectedClientDetails.clientId;
        updatedState.clientSecret = selectedClientDetails.clientSecret;
      }
      if (selectedClientDetails.isUserAccountLaunch) {
        updatedState.launchType = "userAccountLaunch";
        updatedState.username = selectedClientDetails.clientId;
        updatedState.password = selectedClientDetails.clientSecret;
      }

      updatedState.fhirServerBaseURL = selectedClientDetails.fhirServerBaseURL;
      updatedState.tokenEndpoint = selectedClientDetails.tokenURL;
      updatedState.scopes = selectedClientDetails.scopes;

      if (selectedClientDetails.isDirect) updatedState.directType = "direct";
      if (selectedClientDetails.isXdr) updatedState.directType = "xdr";
      if (selectedClientDetails.isRestAPI) updatedState.directType = "restApi";

      updatedState.directHost = selectedClientDetails.directHost;
      updatedState.directUserName = selectedClientDetails.directUser;
      updatedState.directPwd = selectedClientDetails.directPwd;
      updatedState.directRecipientAddress =
        selectedClientDetails.directRecipientAddress;
      updatedState.smtpUrl = selectedClientDetails.smtpUrl;
      updatedState.smtpPort = selectedClientDetails.smtpPort;
      updatedState.imapUrl = selectedClientDetails.imapUrl;
      updatedState.imapPort = selectedClientDetails.imapPort;
      updatedState.restAPIURL = selectedClientDetails.restAPIURL;
      updatedState.rrRestAPIUrl = selectedClientDetails.rrRestAPIUrl;
      updatedState.xdrRecipientAddress =
        selectedClientDetails.xdrRecipientAddress;
      updatedState.assigningAuthorityId =
        selectedClientDetails.assigningAuthorityId;
      updatedState.startThreshold =
        selectedClientDetails.encounterStartThreshold;
      updatedState.endThreshold = selectedClientDetails.encounterEndThreshold;
      updatedState.rrDocRefMimeType = selectedClientDetails.rrDocRefMimeType;

      if (selectedClientDetails.isCovid) updatedState.reportType = "covid19";
      if (selectedClientDetails.isFullEcr) updatedState.reportType = "fullecr";
      if (selectedClientDetails.isCreateDocRef)
        updatedState.rrProcessingType = "createDocRef";
      if (selectedClientDetails.isInvokeRestAPI)
        updatedState.rrProcessingType = "invokeRestAPI";
      if (selectedClientDetails.isBoth) updatedState.rrProcessingType = "both";
      if (selectedClientDetails.debugFhirQueryAndEicr) {
        updatedState.isChecked = true;
        updatedState.isLoggingEnabled = true;
      }

      setState(updatedState);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState: any = {
      launchType: e.target.value,
    };
    if (e.target.value === "userAccountLaunch") newState.clientId = "";
    if (
      e.target.value === "systemLaunch" ||
      e.target.value === "providerLaunch"
    ) {
      newState.username = "";
      newState.password = "";
    }
    setState({ ...state, ...newState });
  };

  const handleDirectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, directType: e.target.value });
  };

  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, reportType: e.target.value });
  };

  const handleRRProcessingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, rrProcessingType: e.target.value });
  };

  const handleToggleButton = () => {
    setState({
      ...state,
      isChecked: !state.isChecked,
      isLoggingEnabled: !state.isChecked,
    });
  };

  const openClientDetailsList = () => {
    navigate("/clientDetailsList");
  };

  const getUrl = () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const context = window.location.pathname.substring(
      0,
      window.location.pathname.indexOf("/", 2)
    );
    return `${protocol}//${host}${context}`;
  };

  const saveClientDetails = async () => {
    const clientDetails = {
      isProvider: state.launchType === "providerLaunch",
      isSystem: state.launchType === "systemLaunch",
      isUserAccountLaunch: state.launchType === "userAccountLaunch",
      isMultiTenantSystemLaunch: state.launchType === "multiTenantSystemLaunch",
      clientId:
        state.launchType === "userAccountLaunch"
          ? state.username
          : state.clientId,
      clientSecret:
        state.launchType === "systemLaunch"
          ? state.clientSecret
          : state.password,
      fhirServerBaseURL: state.fhirServerBaseURL,
      tokenURL: state.tokenEndpoint || null,
      scopes: state.scopes,
      isDirect: state.directType === "direct",
      isXdr: state.directType === "xdr",
      isRestAPI: state.directType === "restApi",
      directHost: state.directType === "direct" ? state.directHost : null,
      directUser: state.directType === "direct" ? state.directUserName : null,
      directPwd: state.directType === "direct" ? state.directPwd : null,
      smtpUrl: state.directType === "direct" ? state.smtpUrl : null,
      smtpPort: state.directType === "direct" ? state.smtpPort : null,
      imapUrl: state.directType === "direct" ? state.imapUrl : null,
      imapPort: state.directType === "direct" ? state.imapPort : null,
      directRecipientAddress:
        state.directType === "direct" ? state.directRecipientAddress : null,
      xdrRecipientAddress:
        state.directType === "xdr" ? state.xdrRecipientAddress : null,
      restAPIURL: state.directType === "restApi" ? state.restAPIURL : null,
      assigningAuthorityId: state.assigningAuthorityId,
      encounterStartThreshold: state.startThreshold,
      encounterEndThreshold: state.endThreshold,
      isCovid: state.reportType === "covid19",
      isFullEcr: state.reportType === "fullecr",
      isCreateDocRef: state.rrProcessingType === "createDocRef",
      isInvokeRestAPI: state.rrProcessingType === "invokeRestAPI",
      isBoth: state.rrProcessingType === "both",
      rrRestAPIUrl: state.rrRestAPIUrl,
      rrDocRefMimeType: state.rrDocRefMimeType,
      debugFhirQueryAndEicr: !!state.isLoggingEnabled,
      lastUpdated: new Date(),
    };

    if (!addNew.addNew && selectedClientDetails?.id) {
      (clientDetails as any)["id"] = selectedClientDetails.id;
    }

    const method = !addNew.addNew && selectedClientDetails ? "put" : "post";

    try {
      const url = "/api/clientDetails";
      const response = await axiosInstance[method](url, clientDetails);

      if (response.status === 200) {
        toast.success("Client Details are saved successfully.", {
          position: "bottom-right",
        });

        setState((prev: any) => ({
          ...prev,
          isSaved: true,
          launchType: "providerLaunch",
          clientId: "",
          clientSecret: "",
          fhirServerBaseURL: "",
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
        }));

        openClientDetailsList();
      } else {
        toast.error("Error in Saving the Client Details", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Failed to save client details", {
        position: "bottom-right",
      });
      console.error("Error saving client details:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      setState({ ...state, isValidated: true });
      toast.error("Please enter all the required fields.", {
        position: "bottom-right",
      });
      return;
    }

    saveClientDetails();
    setState({ ...state, validated: true });
  };

  const setShow = () => setState({ ...state, isSaved: false });

  return (
    <div className="clientDetails">
      <br />
      <Row>
        <Col md="6">
          <h2>Client Details Configuration</h2>
        </Col>
        <Col md="6" className="clientCol">
          <FormButtonGroup
            label="Existing Client Details"
            onClick={openClientDetailsList}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Alert
            variant="success"
            show={state.isSaved}
            onClose={() => setShow()}
            dismissible
          >
            Client Details are saved successfully.
          </Alert>
          <Form
            noValidate
            validated={state.validated}
            onSubmit={handleSubmit}
            data-testid="client-form"
          >
            <Accordion defaultActiveKey="0">
              <Card className="accordionCards">
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  FHIR Configuration
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body className="fhirConfiguration">
                    <FormRadioGroup
                      label="Launch Type:"
                      name="launchType"
                      value={state.launchType}
                      options={launchTypeOptions}
                      onChange={handleRadioChange}
                    />

                    {state.launchType === "systemLaunch" ||
                    state.launchType === "providerLaunch" ? (
                      <FormInputGroup
                        data-testid="clientId"
                        label="Client Id:"
                        name="clientId"
                        type="text"
                        placeholder="Enter ClientId"
                        value={state.clientId || ""}
                        onChange={handleChange}
                        isInvalid={
                          state.isValidated &&
                          (state.clientId === "" ||
                            state.clientId === undefined)
                        }
                        feedback="Please provide a Client Id."
                        required
                      />
                    ) : (
                      <FormInputGroup
                        label="Username:"
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={state.username || ""}
                        onChange={handleChange}
                        isInvalid={
                          state.isValidated &&
                          (state.username === "" ||
                            state.username === undefined)
                        }
                        feedback="Please provide a Username."
                        required
                      />
                    )}

                    {state.launchType === "systemLaunch" ? (
                      <FormInputGroup
                        label="Client Secret:"
                        name="clientSecret"
                        type="text"
                        placeholder="Enter Secret"
                        value={state.clientSecret || ""}
                        onChange={handleChange}
                        isInvalid={
                          state.isValidated &&
                          (state.clientSecret === "" ||
                            state.clientSecret === undefined)
                        }
                        feedback="Please provide a Client Secret."
                        required={
                          state.launchType === "systemLaunch" ? true : false
                        }
                      />
                    ) : (
                      ""
                    )}

                    {state.launchType === "userAccountLaunch" ? (
                      <FormInputGroup
                        label="Password:"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={state.password || ""}
                        onChange={handleChange}
                        isInvalid={
                          state.isValidated &&
                          (state.password === "" ||
                            state.password === undefined)
                        }
                        feedback="Please provide a Password."
                        required={
                          state.launchType === "userAccountLaunch"
                            ? true
                            : false
                        }
                      />
                    ) : (
                      ""
                    )}

                    <FormInputGroup
                      label="Scopes:"
                      name="scopes"
                      placeholder="Enter Scopes"
                      as="textarea"
                      rows={3}
                      value={state.scopes}
                      onChange={handleChange}
                      isInvalid={
                        state.isValidated &&
                        (state.scopes === "" || state.scopes === undefined)
                      }
                      feedback="Please provide Scopes."
                      required
                    />

                    <FormInputGroup
                      label="FHIR Server Base URL:"
                      name="fhirServerBaseURL"
                      type="text"
                      placeholder=" Enter FHIR Server Base URL"
                      value={state.fhirServerBaseURL || ""}
                      onChange={handleChange}
                      isInvalid={
                        state.isValidated &&
                        (state.fhirServerBaseURL === "" ||
                          state.fhirServerBaseURL === undefined)
                      }
                      feedback="Please provide a FHIR Server Base URL."
                      required
                    />

                    <FormInputGroup
                      label="Token Endpoint:"
                      name="tokenEndpoint"
                      type="text"
                      placeholder="Enter Token Endpoint"
                      value={state.tokenEndpoint || ""}
                      onChange={handleChange}
                      isInvalid={state.isValidated && !state.tokenEndpoint}
                      feedback="Please provide a FHIR Server Token URL."
                      required
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="accordionCards">
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Transport Configuration
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body className="transportConfiguration">
                    <FormRadioGroup
                      label="Direct Type:"
                      name="directType"
                      value={state.directType}
                      options={directTypeOptions}
                      onChange={handleDirectChange}
                    />

                    {state.directType === "direct" ? (
                      <div>
                        <FormInputGroup
                          label="Direct Host:"
                          name="directHost"
                          type="text"
                          placeholder="Direct Host"
                          value={state.directHost || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.directHost === "" ||
                              state.directHost === undefined)
                          }
                          feedback="Please provide a Direct Host name."
                          required={
                            state.directType === "direct" ? true : false
                          }
                        />

                        <FormInputGroup
                          label="Direct Sender User Name:"
                          name="directUserName"
                          type="text"
                          placeholder=" Enter Direct Sender User Name"
                          value={state.directUserName || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.directUserName === "" ||
                              state.directUserName === undefined)
                          }
                          feedback="Please provide a Direct Sender User Name."
                          required
                        />

                        <FormInputGroup
                          label="Direct Sender Password:"
                          name="directPwd"
                          type="password"
                          placeholder="Enter Direct Sender Password"
                          value={state.directPwd || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.directPwd === "" ||
                              state.directPwd === undefined)
                          }
                          feedback="Please provide Direct Sender Password."
                          required={
                            state.directType === "direct" ? true : false
                          }
                        />

                        <FormInputGroup
                          label="Direct Recipient Address:"
                          name="directRecipientAddress"
                          type="text"
                          placeholder=" Enter Direct Recipient Address"
                          value={state.directRecipientAddress || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.directRecipientAddress === "" ||
                              state.directRecipientAddress === undefined)
                          }
                          feedback="Please provide a Direct Recipient Address."
                          required={
                            state.directType === "direct" ? true : false
                          }
                        />

                        <FormInputGroup
                          label="SMTP URL:"
                          name="smtpUrl"
                          type="text"
                          placeholder="Enter SMTP URL"
                          value={state.smtpUrl || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.smtpUrl === "" ||
                              state.smtpUrl === undefined)
                          }
                          feedback="Please provide a SMTP URL."
                          required={
                            state.directType === "direct" ? true : false
                          }
                        />

                        <FormInputGroup
                          label="SMTP Port:"
                          name="smtpPort"
                          type="text"
                          placeholder="Enter SMTP Port"
                          value={state.smtpPort || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.smtpPort === "" ||
                              state.smtpPort === undefined)
                          }
                          feedback="Please provide a SMTP Port."
                          required={
                            state.directType === "direct" ? true : false
                          }
                        />

                        <FormInputGroup
                          label="IMAP URL:"
                          name="imapUrl"
                          type="text"
                          placeholder="Enter IMAP URL"
                          value={state.imapUrl || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.imapUrl === "" ||
                              state.imapUrl === undefined)
                          }
                          feedback="Please provide a IMAP URL."
                          required={
                            state.directType === "direct" ? true : false
                          }
                        />

                        <FormInputGroup
                          label="IMAP Port:"
                          name="imapPort"
                          type="text"
                          placeholder="Enter IMAP Port"
                          value={state.imapPort || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.imapPort === "" ||
                              state.imapPort === undefined)
                          }
                          feedback="Please provide a IMAP Port."
                          required={
                            state.directType === "direct" ? true : false
                          }
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    {state.directType === "xdr" ? (
                      <div>
                        <FormInputGroup
                          label="XDR Recipient Address:"
                          name="xdrRecipientAddress"
                          type="text"
                          placeholder="Enter XDR Recipient Address"
                          value={state.xdrRecipientAddress || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.xdrRecipientAddress === "" ||
                              state.xdrRecipientAddress === undefined)
                          }
                          feedback="Please provide a XDR Recipient Address."
                          required={state.directType === "xdr" ? true : false}
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    {state.directType === "restApi" ? (
                      <div>
                        <FormInputGroup
                          label="Rest API URL:"
                          name="restAPIURL"
                          type="text"
                          placeholder="Enter Rest API URL"
                          value={state.restAPIURL || ""}
                          onChange={handleChange}
                          isInvalid={
                            state.isValidated &&
                            (state.restAPIURL === "" ||
                              state.restAPIURL === undefined)
                          }
                          feedback="Please provide a Rest API URL."
                          required={state.directType === "xdr" ? true : false}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              <Card className="accordionCards">
                <Accordion.Toggle as={Card.Header} eventKey="2">
                  App Configuration
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="2">
                  <Card.Body className="appConfiguration">
                    <FormInputGroup
                      label="Assigning Authority Id:"
                      name="assigningAuthorityId"
                      type="text"
                      placeholder="Enter Assigning Authority Id"
                      value={state.assigningAuthorityId || ""}
                      onChange={handleChange}
                      isInvalid={
                        state.isValidated &&
                        (state.assigningAuthorityId === "" ||
                          state.assigningAuthorityId === undefined)
                      }
                      feedback="Please provide a Assigning Authority Id."
                    />

                    <FormInputGroup
                      label="Encounter Start Time Threshold:"
                      name="startThreshold"
                      type="text"
                      placeholder="Enter Encounter Start Time Threshold"
                      value={state.startThreshold || ""}
                      onChange={handleChange}
                      isInvalid={
                        state.isValidated &&
                        (state.startThreshold === "" ||
                          state.startThreshold === undefined)
                      }
                      feedback="Please provide a Encounter Start Time Threshold."
                      required
                    />

                    <FormInputGroup
                      label="Encounter End Time Threshold:"
                      name="endThreshold"
                      type="text"
                      placeholder="Enter Encounter End Time Threshold"
                      value={state.endThreshold || ""}
                      onChange={handleChange}
                      isInvalid={
                        state.isValidated &&
                        (state.endThreshold === "" ||
                          state.endThreshold === undefined)
                      }
                      feedback="Please provide a Encounter End Time Threshold."
                      required
                    />

                    <FormRadioGroup
                      label="RR Processing:"
                      name="rrProcessingType"
                      value={state.rrProcessingType}
                      options={rrProcessingOptions}
                      onChange={handleRRProcessingChange}
                    />

                    {state.rrProcessingType === "invokeRestAPI" ||
                    state.rrProcessingType === "both" ? (
                      <div>
                        <FormInputGroup
                          label="RR Rest API URL:"
                          name="rrRestAPIUrl"
                          type="text"
                          placeholder="Enter RR Rest API URL"
                          value={state.rrRestAPIUrl || ""}
                          onChange={handleChange}
                          isInvalid={state.rrRestAPIUrl || ""}
                          feedback="Please provide a RR Rest API URL."
                          required={
                            state.rrProcessingType === "invokeRestAPI" ||
                            state.rrProcessingType === "both"
                              ? true
                              : false
                          }
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <Form.Group as={Row} controlId="rrDocRefMimeType">
                      <Form.Label column sm={2}>
                        RR Doc Ref Mime Type:
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="text"
                          placeholder="RR DocumentReference Mime Type"
                          name="rrDocRefMimeType"
                          onChange={(e) => handleChange(e)}
                          value={state.rrDocRefMimeType || ""}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide DocumentReference Mime Type.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <FormRadioGroup
                      label="Report Type:"
                      name="reportType"
                      value={state.reportType}
                      options={reportTypeOptions}
                      onChange={handleReportChange}
                    />

                    <Form.Group as={Row} controlId="debugFhirQueryAndEicr">
                      <Form.Label column sm={2}>
                        Debug Fhir Query And Eicr
                      </Form.Label>
                      <Col sm={9}>
                        <Form.Check
                          type="switch"
                          id="enableLogging-switch"
                          onChange={(e) => handleToggleButton()}
                          label=""
                          className="switchBtn"
                          name="debugFhirQueryAndEicr"
                          checked={state.isChecked}
                        />
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
};

export default ClientDetails;
