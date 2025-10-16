import {
  Accordion,
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../../Services/AxiosConfig";
import { withRouter } from "../../withRouter";
import "./PublicHealthAuthority.css";
import FormInputGroup from "../../ReUsables/FormInputGroup";
import { PublicHealthAuthorityProps } from "../../Models/PublicHealthAuthority.model";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormRadioGroup from "../../ReUsables/FormRadioGroup";



const PublicHealthAuthority: React.FC<PublicHealthAuthorityProps> = ({
  selectedPublicHealthAuthority = {},
  addNewHealthAuthority,
}) => {
  const navigate = useNavigate();

  const radioLinks = [{
    id: "providerLaunch",
    value: "SofProvider",
    label: "Provider Launch",
  },
  {
    id: "systemLaunch",
    value: "SofSystem",
    label: "System Launch",
  },
  {
    id: "userPwdLaunch",
    value: "UserNamePwd",
    label: "Username and Password",
  }]

  const isEmpty = (obj: any): boolean => {
    return Object.keys(obj).length === 0;
  };

  const getInitialState = () => {
    const isNew =
      typeof addNewHealthAuthority === "boolean"
        ? addNewHealthAuthority
        : addNewHealthAuthority?.addNewHealthAuthority ?? false;

    if (!isNew && !isEmpty(selectedPublicHealthAuthority)) {
      return {
        authType: selectedPublicHealthAuthority.authType,
        clientId: selectedPublicHealthAuthority.clientId,
        clientSecret: selectedPublicHealthAuthority.clientSecret,
        username: selectedPublicHealthAuthority.username,
        password: selectedPublicHealthAuthority.password,
        fhirServerBaseURL: selectedPublicHealthAuthority.fhirServerBaseURL,
        tokenEndpoint: selectedPublicHealthAuthority.tokenUrl,
        scopes: selectedPublicHealthAuthority.scopes,
        restAPIURL: selectedPublicHealthAuthority.restApiUrl,
        validated: false,
        isValidated: false,
        isChecked: false,
        isLoggingEnabled: false,
        isSaved: false,
      };
    }

    return {
      authType: "SofProvider",
      clientId: "",
      clientSecret: "",
      username: "",
      password: "",
      fhirServerBaseURL: "",
      tokenEndpoint: "",
      scopes: "",
      restAPIURL: "",
      validated: false,
      isValidated: false,
      isChecked: false,
      isLoggingEnabled: false,
      isSaved: false,
    };
  };

  const [state, setState] = useState(getInitialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, authType: e.target.value }));
  };

  const handleDirectChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, directType: e.target.value }));
  };

  const handleReportChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, reportType: e.target.value }));
  };

  const handleToggleButton = () => {
    setState((prev) => ({
      ...prev,
      isChecked: !prev.isChecked,
      isLoggingEnabled: !prev.isChecked,
    }));
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    rowData: any
  ) => {
    console.log(e.target.checked, rowData);
  };

  const openPublicHealthAuthorityList = () => {
    navigate("/publicHealthAuthorityList");
  };

  const geturl = () => {
    const { protocol, host, pathname } = window.location;
    const context = pathname.substring(0, pathname.indexOf("/", 2));
    return `${protocol}//${host}${context}`;
  };

  const savePublicHealthAuthority = () => {
    let requestMethod: "POST" | "PUT" = "POST";

    const data = {
      authType: state.authType,
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      username: state.username,
      password: state.password,
      fhirServerBaseURL: state.fhirServerBaseURL,
      tokenUrl: state.tokenEndpoint || null,
      scopes: state.scopes,
      lastUpdated: new Date(),
    } as any;

    const isNew =
      typeof addNewHealthAuthority === "boolean"
        ? addNewHealthAuthority
        : addNewHealthAuthority?.addNewHealthAuthority ?? false;

    if (!isNew && selectedPublicHealthAuthority) {
      data["id"] = selectedPublicHealthAuthority.id;
      requestMethod = "PUT";
    }

    axiosInstance({
      method: requestMethod,
      url: "/api/publicHealthAuthority",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          setState((prev) => ({ ...prev, isSaved: true }));
          return res.data;
        }
        throw new Error("Non-200 response");
      })
      .then((result) => {
        if (result) {
          setState((prev) => ({
            ...prev,
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
          }));

          toast.success("Client Details are saved successfully.", {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
          });

          openPublicHealthAuthorityList();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("Error in Saving the HealthAuthority Settings", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
        });
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setState((prev) => ({ ...prev, isValidated: true }));
      event.preventDefault();
      event.stopPropagation();

      toast.warning("Please enter all the required fields.", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });

      return;
    }

    savePublicHealthAuthority();
    setState((prev) => ({ ...prev, validated: true }));
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <div className="PublicHealthAuthority">
      <br />
      <Row>
        <Col md="6">
          <h2>Public Health Authority</h2>
        </Col>
        <Col md="6" className="clientCol">
          <Button onClick={openPublicHealthAuthorityList}>
            Existing PublicHealthAuthority
          </Button>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Alert
            variant="success"
            show={state.isSaved}
            onClose={() => setState((prev) => ({ ...prev, isSaved: false }))}
            dismissible
          >
            Public Health Authority are saved successfully.
          </Alert>

          <Form noValidate validated={state.validated} onSubmit={handleSubmit}>
            <Accordion defaultActiveKey="0">
              <Card className="accordionCards">
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  FHIR Configuration
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body className="fhirConfiguration">
                   <FormRadioGroup
                      label="Launch Type:"
                      name="authType"
                      value={state.authType}
                      onChange={handleRadioChange}
                      options={radioLinks}
                      isInvalid={state.isValidated && !state.authType}
                      feedback="Please select an auth type."
                      required
                    />


                    <FormInputGroup
                      label="Client Id:"
                      name="clientId"
                      placeholder="Enter ClientId"
                      value={state.clientId}
                      onChange={handleChange}
                      isInvalid={state.isValidated && !state.clientId}
                      feedback="Please provide a Client Id."
                      required
                    />

                    {state.authType !== "SofProvider" && (
                      <FormInputGroup
                        label="Client Secret:"
                        name="clientSecret"
                        placeholder="Enter Client Secret"
                        value={state.clientSecret}
                        onChange={handleChange}
                        isInvalid={state.isValidated && !state.clientSecret}
                        feedback="Please provide a Client Secret."
                        required
                      />
                    )}

                    {state.authType === "UserNamePwd" && (
                      <>
                        <FormInputGroup
                          label="Username:"
                          name="username"
                          placeholder="Enter Username"
                          value={state.username}
                          onChange={handleChange}
                          isInvalid={state.isValidated && !state.username}
                          feedback="Please provide a Username."
                          required
                        />

                        <FormInputGroup
                          label="Password:"
                          name="password"
                          placeholder="Enter Password"
                          type="password"
                          value={state.password}
                          onChange={handleChange}
                          isInvalid={state.isValidated && !state.password}
                          feedback="Please provide a Password."
                          required
                        />
                      </>
                    )}

                    <FormInputGroup
                      label="Scopes:"
                      name="scopes"
                      placeholder="Enter Scopes"
                      as="textarea"
                      rows={3}
                      value={state.scopes}
                      onChange={handleChange}
                      isInvalid={state.isValidated && !state.scopes}
                      feedback="Please provide Scopes."
                      required
                    />

                    <FormInputGroup
                      label="FHIR Server Base URL:"
                      name="fhirServerBaseURL"
                      placeholder=" Enter FHIR Server Base URL"
                      value={state.fhirServerBaseURL}
                      onChange={handleChange}
                      isInvalid={state.isValidated && !state.fhirServerBaseURL}
                      feedback="Please provide a FHIR Server Base URL."
                      required
                    />

                    <FormInputGroup
                      label="Token Endpoint:"
                      name="tokenEndpoint"
                      placeholder="Enter Token Endpoint"
                      value={state.tokenEndpoint}
                      onChange={handleChange}
                      isInvalid={state.isValidated && !state.tokenEndpoint}
                      feedback="Please provide a FHIR Server Token URL."
                      required
                    />
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

export default withRouter(PublicHealthAuthority);