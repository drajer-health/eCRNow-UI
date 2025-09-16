import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  Alert,
  Row,
  Col,
  Form,
  Card,
  Accordion,
  Button,
  Table,
} from "react-bootstrap";
import "./HealthCareSettings.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Services/AxiosConfig";
import { withRouter } from "../../withRouter";
import { HealthCareSettingsProps } from "../../Models/HealthCareSettings.model";
import FormInputGroup from "../../ReUsables/FormInputGroup";
import FormRadioGroup from "../../ReUsables/FormRadioGroup";
import FormButtonGroup from "../../ReUsables/FormButtonGroup";
import {
  authTypeOptions,
  directTypeOptions,
  smtpAuthEnabledOptions,
  readMessageTypeOptions,
  submitReportToOptions,
  tlsVersionOptions,
  offhoursOptions,
  debugEnabledOptions,
  responseProcessingOptions,
  outputFormatsList,
} from "./RadioOptions";

const numberRegex = /^\d+$/;

const HealthCareSettings: React.FC<HealthCareSettingsProps> = ({
  selectedHealthCareSettings,
  addNewHealthCare,
}) => {
  const navigate = useNavigate();

  const imapAuthOptions = [
    { id: "imapAuthEnabledTrue", label: "True", value: "true" },
    { id: "imapAuthEnabledFalse", label: "False", value: "false" },
  ];

  const imapSslOptions = [
    { id: "imapSslEnabledTrue", label: "True", value: "true" },
    { id: "imapSslEnabledFalse", label: "False", value: "false" },
  ];

  // Convert prop to boolean
  const isAddNew =
    typeof addNewHealthCare === "boolean"
      ? addNewHealthCare
      : addNewHealthCare?.addNewHealthCare ?? false;

  // State
  const [validated, setValidated] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAudRequired, setIsAudRequired] = useState(false);
  const [ehrSupportsSubscriptions, setEhrSupportsSubscriptions] =
    useState(false);

  const [smtpAuthEnabled, setSmtpAuthEnabled] = useState(false);
  const [smtpSslEnabled, setSmtpSslEnabled] = useState(false);
  const [directTlsVersion, setDirectTlsVersion] = useState("");

  const [imapAuthEnabled, setImapAuthEnabled] = useState(false);
  const [imapSslEnabled, setImapSslEnabled] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);

  const [karFhirServerURLList, setKarFhirServerURLList] = useState<any[]>([]);
  const [karsByHsIdList, setKarsByHsIdList] = useState<any[]>([]);
  const [isKarFhirServerURLSelected, setIsKarFhirServerURLSelected] =
    useState(false);
  const [selectedKARDetails, setSelectedKARDetails] = useState<any[]>([]);
  const [outputFormats] = useState(["CDA_R11", "CDA_R30", "FHIR"]);
  const [hsKARStatus, setHsKARStatus] = useState<any[]>([]);
  const [formState, setFormState] = useState<any>({}); // holds fields like authType, clientId, etc.

  const [isSaved, setIsSaved] = useState(false);

  // useEffect for initialization
  useEffect(() => {
    if (!isAddNew && !isEmpty(selectedHealthCareSettings)) {
      const settings = selectedHealthCareSettings;
      const newFormState: any = {};

      // Auth Type logic
      if (settings.authType === "SofBackend") {
        newFormState.authType = settings.authType;
        newFormState.clientId = settings.clientId;
      } else if (settings.authType === "System") {
        newFormState.authType = settings.authType;
        newFormState.clientId = settings.clientId;
        newFormState.clientSecret = settings.clientSecret;
      } else if (settings.authType === "UserNamePwd") {
        newFormState.authType = settings.authType;
        newFormState.username = settings.username;
        newFormState.password = settings.password;
      }

      // Direct type
      if (settings.isDirect) newFormState.directType = "direct";
      else if (settings.isRestAPI) newFormState.directType = "restApi";
      else if (settings.fhirAPI) newFormState.directType = "fhir";

      // Message reading protocol
      if (settings.imapPort && settings.imapUrl) {
        newFormState.readMessageType = "imap";
      } else if (settings.popPort && settings.popUrl) {
        newFormState.readMessageType = "pop3";
      } else {
        newFormState.readMessageType = "";
      }

      // Report submission method
      if (settings.createDocRefForResponse) {
        newFormState.responseProcessingType = "createDocRef";
      } else if (settings.handOffResponseToRestApi != null) {
        newFormState.responseProcessingType = "invokeRestAPI";
      } else if (settings.noAction) {
        newFormState.responseProcessingType = "noAction";
      }

      if (settings.phaUrl != null) {
        newFormState.submitReportTo = "pha";
      } else if (settings.trustedThirdParty != null) {
        newFormState.submitReportTo = "ttp";
      }
      if (settings.trustedThirdParty) {
        newFormState.trustedThirdParty = settings.trustedThirdParty;
      }

      // Copy all other simple fields
      const keysToCopy = [
        "clientId",
        "clientSecret",
        "username",
        "password",
        "fhirServerBaseURL",
        "tokenUrl",
        "scopes",
        "directHost",
        "directUser",
        "directPwd",
        "directEndpointCertificateNameOrAlias",
        "directRecipientAddress",
        "smtpPort",
        "smtpUrl",
        "smtpAuthEnabled",
        "debugEnabled",
        "imapAuthEnabled",
        "imapSslEnabled",
        "smtpSslEnabled",
        "directTlsVersion",
        "imapUrl",
        "imapPort",
        "popUrl",
        "popPort",
        "restApiUrl",
        "assigningAuthorityId",
        "encounterStartThreshold",
        "encounterEndThreshold",
        "orgName",
        "orgIdSystem",
        "orgId",
        "defaultProviderId",
        "handOffResponseToRestApi",
        "noAction",
        "docRefMimeType",
        "backendAuthKeyAlias",
        "phaUrl",
        "trustedThirdParty",
        "offhoursEnabled",
        "offHoursStart",
        "offHoursStartMin",
        "offHoursEnd",
        "offHoursEndMin",
        "offHoursTimezone",
      ];

      keysToCopy.forEach((key) => {
        newFormState[key] = settings[key];
      });

      newFormState.tokenEndpoint = settings.tokenUrl;
      newFormState.directUserName = settings.directUser;
      newFormState.startThreshold = settings.encounterStartThreshold;
      newFormState.endThreshold = settings.encounterEndThreshold;
      newFormState.keystoreAlias = settings.backendAuthKeyAlias;
      setSmtpSslEnabled(
        settings.smtpSslEnabled === true || settings.smtpSslEnabled === "true"
      );
      setDirectTlsVersion(settings.directTlsVersion ?? "");
      setSmtpAuthEnabled(
        settings.smtpAuthEnabled === true || settings.smtpAuthEnabled === "true"
      );
      setDebugEnabled(
        settings.debugEnabled === true || settings.debugEnabled === "true"
      );

      if (settings.requireAud) setIsAudRequired(true);
      if (settings.ehrSupportsSubscriptions) setEhrSupportsSubscriptions(true);

      setFormState(newFormState);

      getKARs();
      getKARSByHsId(settings.id);
    } else {
      // Defaults for new entry
      setFormState({
        authType: "System",
        directType: "direct",
      });
    }

    setIsSaved(false);
  }, []);

  // Check if object is empty
  const isEmpty = (obj: any): boolean => {
    return Object.keys(obj).length === 0;
  };

  // Get all KARs
  const getKARs = async () => {
    try {
      const response = await axiosInstance.get("/api/kars/");
      if (response.status === 200) {
        setKarFhirServerURLList(response.data || []);
      }
    } catch (error) {
      toast.error("Error in fetching the KARs", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  // Get KARs by Healthcare Setting ID
  const getKARSByHsId = async (hsId: string | number) => {
    try {
      const response = await axiosInstance.get(
        `/api/karStatusByHsId?hsId=${hsId}`
      );
      if (response.status === 200) {
        setKarsByHsIdList(response.data || []);
      }
    } catch (error) {
      toast.error("Error in fetching the KARs By HsId", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev: any) => ({
      ...prev,
      [name]: value.trimStart(), // Prevent leading spaces
    }));
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updates: any = { authType: value };

    if (value === "UserNamePwd") {
      updates.username = "";
    }

    if (value === "SofBackend" || value === "System") {
      updates.username = "";
      updates.password = "";
      updates.clientId = "";
      updates.clientSecret = "";
    }

    setFormState((prev: any) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleDirectChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev: any) => ({
      ...prev,
      directType: e.target.value,
    }));
  };

  const handleReadMessageTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev: any) => ({
      ...prev,
      readMessageType: e.target.value,
    }));
  };

  const handleOffHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev: any) => ({
      ...prev,
      offhoursEnabled: e.target.value === "True",
    }));
  };

  const handleSubmitReportToChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updates: any = { submitReportTo: value };

    if (value === "pha" || value === "ttp") {
      updates.trustedThirdParty = "";
    }

    setFormState((prev: any) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleResponseProcessingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev: any) => ({
      ...prev,
      responseProcessingType: e.target.value,
    }));
  };

  const handleReportChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev: any) => ({
      ...prev,
      reportType: e.target.value,
    }));
  };

  const handleKARChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    if (!karFhirServerURLList.length) return;

    const kARDetails = karFhirServerURLList.filter(
      (x) => String(x.id) === String(selectedId)
    );
    if (kARDetails.length === 0) return;

    const karInfoList = [...(kARDetails[0]?.karsInfo || [])];
    karInfoList.sort((a, b) => b.id - a.id);

    // Merge with karsByHsIdList
    const updatedKarInfoList = karInfoList.map((kar) => {
      const match = karsByHsIdList.find((k) => {
        const [karId, karVersion] = k.versionUniqueKarId.split("|");
        return kar.karId === karId && kar.karVersion === karVersion;
      });
      return match ? { ...kar, ...match } : kar;
    });

    setFormState((prev: any) => ({
      ...prev,
      karFhirServerURL: selectedId,
    }));
    setIsKarFhirServerURLSelected(true);
    setSelectedKARDetails(updatedKarInfoList);
  };

  const handleOutputFormatChange = (
    e: ChangeEvent<HTMLSelectElement>,
    rowData: any
  ) => {
    rowData.outputFormat = e.target.value;
    rowData.isChanged = e.target.value !== "";
    setSelectedKARDetails([...selectedKARDetails]);
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    rowData: any,
    columnType: string
  ) => {
    const updated = selectedKARDetails.map((row) => {
      if (row.id === rowData.id) {
        const updatedRow = { ...row, covidOnly: false }; // set covidOnly to false
        switch (columnType) {
          case "Activation":
            updatedRow.isActive = e.target.checked;
            break;
          case "EnableSubscriptions":
            updatedRow.subscriptionsEnabled = e.target.checked;
            break;
          // case "EnableCovidReporting":
          //   updatedRow.covidOnly = e.target.checked;
          //   break;
        }
        updatedRow.isChanged = true;
        return updatedRow;
      }
      return row;
    });
    setSelectedKARDetails(updated);
  };

  const handleToggleButton = () => {
    setIsAudRequired((prev) => !prev);
  };

  const handleEHRSubscriptionsToggle = () => {
    setEhrSupportsSubscriptions((prev) => !prev);
  };

  const handleSmtpAuthEnabled = (e: ChangeEvent<HTMLInputElement>) => {
    setSmtpAuthEnabled(e.target.value === "true");
  };

  const handleSmtpSslEnabled = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "true";
    setSmtpSslEnabled(value);
    if (!value) setDirectTlsVersion("");
  };

  const handleTlsVersionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDirectTlsVersion(e.target.value as "TLSv1.1" | "TLSv1.2");
  };

  const handleImapAuthEnabled = (e: ChangeEvent<HTMLInputElement>) => {
    setImapAuthEnabled(e.target.value === "true");
  };

  const handleImapSslEnabled = (e: ChangeEvent<HTMLInputElement>) => {
    setImapSslEnabled(e.target.value === "true");
  };

  const handleDebugEnabled = (e: ChangeEvent<HTMLInputElement>) => {
    setDebugEnabled(e.target.value === "true");
  };

  const openHealthCareSettingsList = () => {
    navigate("/healthCareSettingsList");
  };

  const openKAR = () => {
    navigate("/kar");
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

  const saveHealthCareSettings = async () => {
    const s = formState;

    const healthCareSettings: any = {
      authType: s.authType,
      clientId:
        (s.authType === "System" || s.authType === "SofBackend") && s.clientId
          ? s.clientId
          : s.username,
      isDirect: s.directType === "direct",
      isRestAPI: s.directType === "restApi",
      fhirAPI: s.directType === "fhir",
      clientSecret: s.clientSecret ?? null,
      fhirServerBaseURL: s.fhirServerBaseURL,
      tokenUrl: s.tokenEndpoint ?? null,
      scopes: s.scopes,
      directHost: s.directType === "direct" ? s.directHost ?? null : null,
      directUser: s.directType === "direct" ? s.directUserName ?? "" : "",
      directPwd: s.directType === "direct" ? s.directPwd ?? null : null,
      smtpPort: s.directType === "direct" ? s.smtpPort ?? null : null,
      smtpUrl: s.directType === "direct" ? s.smtpUrl ?? null : null,
      imapUrl:
        s.readMessageType === "imap" && s.directType === "direct"
          ? s.imapUrl ?? null
          : null,
      imapPort:
        s.readMessageType === "imap" && s.directType === "direct"
          ? s.imapPort ?? null
          : null,
      popUrl:
        s.readMessageType === "pop3" && s.directType === "direct"
          ? s.popUrl ?? null
          : null,
      popPort:
        s.readMessageType === "pop3" && s.directType === "direct"
          ? s.popPort ?? null
          : null,
      directRecipientAddress:
        s.directType === "direct" ? s.directRecipientAddress ?? null : null,
      directEndpointCertificateNameOrAlias:
        s.directType === "direct"
          ? s.directEndpointCertificateNameOrAlias ?? null
          : null,
      restApiUrl: s.directType === "restApi" ? s.restApiUrl ?? null : null,
      assigningAuthorityId: s.assigningAuthorityId ?? null,
      encounterStartThreshold: s.startThreshold,
      encounterEndThreshold: s.endThreshold,
      lastUpdated: new Date(),
      requireAud: isAudRequired,
      ehrSupportsSubscriptions,
      smtpAuthEnabled,
      smtpSslEnabled,
      directTlsVersion: smtpSslEnabled ? directTlsVersion : null,
      imapAuthEnabled,
      imapSslEnabled,
      debugEnabled,
      backendAuthKeyAlias: s.keystoreAlias ?? null,
      username: s.username ?? "",
      password: s.password ?? "",
      createDocRefForResponse:
        s.responseProcessingType === "createDocRef" ? true : false,
      noAction: s.responseProcessingType === "noAction",
      docRefMimeType:
        s.responseProcessingType === "createDocRef"
          ? s.docRefMimeType ?? null
          : null,
      handOffResponseToRestApi:
        s.responseProcessingType === "invokeRestAPI"
          ? s.handOffResponseToRestApi ?? null
          : null,
      phaUrl: s.submitReportTo === "pha" ? s.phaUrl ?? null : null,
      trustedThirdParty:
        s.submitReportTo === "ttp" ? s.trustedThirdParty ?? null : null,
      orgName: s.orgName ?? null,
      orgIdSystem: s.orgIdSystem ?? null,
      orgId: s.orgId ?? null,
      defaultProviderId: s.defaultProviderId ?? null,
      offhoursEnabled: s.offhoursEnabled === true,
      offHoursStart: s.offHoursStart ?? null,
      offHoursStartMin: s.offHoursStartMin ?? null,
      offHoursEnd: s.offHoursEnd ?? null,
      offHoursEndMin: s.offHoursEndMin ?? null,
      offHoursTimezone: s.offHoursTimezone ?? null,
    };

    // PUT if editing, POST if creating
    const requestMethod =
      !isAddNew && selectedHealthCareSettings ? "PUT" : "POST";
    if (requestMethod === "PUT") {
      healthCareSettings["id"] = selectedHealthCareSettings.id;
    }

    try {
      const response = await axiosInstance({
        method: requestMethod,
        url: "/api/healthcareSettings",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(healthCareSettings),
      });

      if (response.status === 200) {
        setIsSaved(true);
        toast.success("Success", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
        });

        await saveKARSWithHealthCareSettings(selectedHealthCareSettings);
        // Optionally reset form values here
        setFormState((prev: any) => ({
          ...prev,
          authType: "SofProvider",
          clientId: "",
          clientSecret: "",
          fhirServerBaseURL: "",
          tokenEndpoint: "",
          scopes: "",
          startThreshold: "",
          endThreshold: "",
          restApiUrl: "",
        }));
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error saving settings", error);
      toast.error("Error in Saving the HealthCare Settings", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  const saveKARSWithHealthCareSettings = async (hcs: any) => {
    try {
      const updatedRows = selectedKARDetails.filter(
        (x) => x.isChanged === true
      );
      const hsKARStatus = updatedRows.map((row) => ({
        hsId: hcs.id,
        karId: row.karId,
        karVersion: row.karVersion,
        versionUniqueKarId: `${row.karId}|${row.karVersion}`,
        isActive: row.isActive || false,
        subscriptionsEnabled: row.subscriptionsEnabled || false,
        covidOnly: row.covidOnly || false,
        outputFormat: row.outputFormat,
      }));

      const response = await axiosInstance.post(
        "/api/addKARStatus/",
        hsKARStatus
      );

      if (response.status === 200) {
        setIsSaved(true);
        openHealthCareSettingsList();
      }
    } catch (error) {
      console.error("Error saving KAR status", error);
      toast.error("Error in Saving the Knowledge Artifacts Status", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if ((form as HTMLFormElement).checkValidity() === false) {
      setIsValidated(true);
      toast.warn("Please enter all the required fields.", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
      });
      return;
    }

    saveHealthCareSettings();
    setValidated(true);
  };

  const setShow = () => {
    setIsSaved(false);
  };

  return (
    <div className="healthCareSettings">
      <br />
      <Row>
        <Col md="6">
          <h2>HealthCare Settings</h2>
        </Col>
        <Col md="3" className="clientCol">
          <FormButtonGroup
            label="Existing HealthCareSettings"
            onClick={openHealthCareSettingsList}
          />
        </Col>
        <Col md="3" className="clientCol">
          <FormButtonGroup label="eCR Specifications/KAR" onClick={openKAR} />
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Alert
            variant="success"
            show={isSaved}
            onClose={() => setShow()}
            dismissible
          >
            HealthCare Settings are saved successfully.
          </Alert>

          <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
            <Accordion defaultActiveKey="0">
              {/*  FHIR Configuration  */}
              <Card className="accordionCards">
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  FHIR Configuration
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body className="fhirConfiguration">
                    <FormRadioGroup
                      label="Launch Type:"
                      name="authType"
                      value={formState.authType}
                      options={authTypeOptions}
                      onChange={handleRadioChange}
                    />

                    {formState.authType === "System" ||
                      formState.authType === "SofBackend" ? (
                      <FormInputGroup
                        label="Client Id:"
                        name="clientId"
                        placeholder="Enter Client Id"
                        value={formState.clientId}
                        onChange={handleChange}
                        isInvalid={isValidated && !formState.clientId?.trim()}
                        feedback="Please provide a Client Id."
                        required
                      />
                    ) : (
                      <FormInputGroup
                        label="username:"
                        name="username"
                        placeholder="Enter username"
                        value={formState.username}
                        onChange={handleChange}
                        isInvalid={isValidated && !formState.username?.trim()}
                        feedback="Please provide a username."
                        required
                      />
                    )}

                    {formState.authType === "System" && (
                      <FormInputGroup
                        label="Client Secret:"
                        name="clientSecret"
                        placeholder="Enter clientSecret"
                        value={formState.clientSecret}
                        onChange={handleChange}
                        isInvalid={
                          isValidated && !formState.clientSecret?.trim()
                        }
                        feedback="Please provide a clientSecret."
                        required
                      />
                    )}

                    {formState.authType === "UserNamePwd" && (
                      <FormInputGroup
                        label="Password:"
                        name="password"
                        placeholder="Enter password"
                        value={formState.password}
                        onChange={handleChange}
                        isInvalid={isValidated && !formState.password?.trim()}
                        feedback="Please provide a password."
                        required
                      />
                    )}

                    <FormInputGroup
                      label="Scopes:"
                      name="scopes"
                      placeholder="Enter scopes"
                      value={formState.scopes}
                      onChange={handleChange}
                      isInvalid={isValidated && !formState.scopes?.trim()}
                      feedback="Please provide a scopes."
                      required
                    />
                    <FormInputGroup
                      label="FHIR Server Base URL:"
                      name="fhirServerBaseURL"
                      placeholder="Enter fhirServerBaseURL"
                      value={formState.fhirServerBaseURL}
                      onChange={handleChange}
                      isInvalid={
                        isValidated && !formState.fhirServerBaseURL?.trim()
                      }
                      feedback="Please provide a FHIR Server Base URL."
                      required
                    />
                    <FormInputGroup
                      label="Token Endpoint:"
                      name="tokenEndpoint"
                      placeholder="Enter Token Endpoint:"
                      value={formState.tokenEndpoint}
                      onChange={handleChange}
                      isInvalid={
                        isValidated && !formState.tokenEndpoint?.trim()
                      }
                      feedback="Please provide a FHIR Server Token URL."
                      required
                    />

                    {formState.authType === "System" && (
                      <>
                        <div className="d-flex align-items-center mb-4">
                          <label className="me-5" htmlFor="requireAudParam">Require Aud Parameter?</label>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="requireAudParam"
                              onChange={handleToggleButton}
                              checked={isAudRequired}
                            />
                          </div>
                        </div>

                        <div className="d-flex align-items-center mb-4">
                          <label className="me-3" htmlFor="ehrSupportsSubscriptions">
                            EHR Supports Subscriptions?
                          </label>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ehrSupportsSubscriptions"
                              onChange={handleEHRSubscriptionsToggle}
                              checked={ehrSupportsSubscriptions}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {formState.authType === "SofBackend" && (
                      <FormInputGroup
                        label="Keystore Alias:"
                        name="keystoreAlias"
                        placeholder="Enter Keystore Alias"
                        value={formState.keystoreAlias}
                        onChange={handleChange}
                        isInvalid={
                          isValidated && !formState.keystoreAlias?.trim()
                        }
                        feedback="Please provide a keystore Alias."
                        required
                      />
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              {/*  Transport Configuration  */}
              <Card className="accordionCards">
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Transport Configuration
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body className="transportConfiguration">
                    <FormRadioGroup
                      label="Direct Type:"
                      name="directType"
                      value={formState.directType}
                      options={directTypeOptions}
                      onChange={handleDirectChange}
                    />

                    {/* DIRECT Transport Section */}
                    {formState.directType === "direct" && (
                      <>
                        <FormInputGroup
                          label="Direct Host:"
                          name="directHost"
                          placeholder="Enter Direct Host"
                          value={formState.directHost}
                          onChange={handleChange}
                          isInvalid={
                            isValidated && !formState.directHost?.trim()
                          }
                          feedback="Please provide a Direct Host."
                          required
                        />
                        <FormInputGroup
                          label="Direct Sender User Name:"
                          name="directUserName"
                          placeholder="Enter Direct Sender User Name"
                          value={formState.directUserName}
                          onChange={handleChange}
                          isInvalid={
                            isValidated && !formState.directUserName?.trim()
                          }
                          feedback="Please provide a Direct Sender User Name."
                          required
                        />
                        <FormInputGroup
                          label="Direct Sender Password:"
                          name="directPwd"
                          placeholder="Enter Direct Sender Password"
                          value={formState.directPwd}
                          onChange={handleChange}
                          isInvalid={
                            isValidated && !formState.directPwd?.trim()
                          }
                          feedback="Please provide a Direct Sender Password."
                          required
                        />
                        <FormInputGroup
                          label=" Direct Endpoint Certificate Name or Alias:"
                          name="directEndpointCertificateNameOrAlias"
                          placeholder="Enter  Direct Endpoint Certificate Name or Alias:"
                          value={formState.directEndpointCertificateNameOrAlias}
                          onChange={handleChange}
                          isInvalid={
                            isValidated &&
                            !formState.directEndpointCertificateNameOrAlias?.trim()
                          }
                          feedback="Please provide a  Direct Endpoint Certificate Name or Alias."
                          required
                        />
                        <FormInputGroup
                          label="Direct Recipient Address:"
                          name="directRecipientAddress"
                          placeholder="Enter Direct Recipient Address"
                          value={formState.directRecipientAddress}
                          onChange={handleChange}
                          isInvalid={
                            isValidated &&
                            !formState.directRecipientAddress?.trim()
                          }
                          feedback="Please provide a Direct Recipient Address."
                          required
                        />
                        <FormInputGroup
                          label="SMTP URL:"
                          name="smtpUrl"
                          placeholder="Enter SMTP URL"
                          value={formState.smtpUrl}
                          onChange={handleChange}
                          isInvalid={isValidated && !formState.smtpUrl?.trim()}
                          feedback="Please provide a SMTP URL."
                          required
                        />
                        <FormInputGroup
                          label="SMTP Port:"
                          name="smtpPort"
                          placeholder="Enter SMTP Port"
                          value={formState.smtpPort}
                          onChange={handleChange}
                          isInvalid={isValidated && !formState.smtpPort?.trim()}
                          feedback="Please provide a SMTP Port."
                          required
                        />

                        <FormRadioGroup
                          label="SMTP Auth Enabled:"
                          name="smtpAuthEnabled"
                          value={smtpAuthEnabled ? "true" : "false"}
                          options={smtpAuthEnabledOptions}
                          onChange={handleSmtpAuthEnabled}
                        />

                        {/* SMTP SSL Enabled */}
                        <Form.Group as={Row} controlId="smtpSslEnabled">
                          <Form.Label column sm={2}>
                            SMTP SSL Enabled:
                          </Form.Label>
                          <Col sm={10}>
                            <Row>
                              <Col sm={4}>
                                <Form.Check type="radio">
                                  <Form.Check.Input
                                    type="radio"
                                    name="smtpSslEnabled"
                                    value="true"
                                    checked={smtpSslEnabled === true}
                                    onChange={handleSmtpSslEnabled}
                                  />
                                  <Form.Check.Label>True</Form.Check.Label>
                                </Form.Check>

                                {smtpSslEnabled && (
                                  <FormRadioGroup
                                    label=""
                                    name="directTlsVersion"
                                    value={directTlsVersion}
                                    options={tlsVersionOptions}
                                    onChange={handleTlsVersionChange}
                                    required
                                  />
                                )}
                              </Col>

                              <Col sm={4}>
                                <Form.Check type="radio">
                                  <Form.Check.Input
                                    type="radio"
                                    name="smtpSslEnabled"
                                    value="false"
                                    checked={smtpSslEnabled === false}
                                    onChange={handleSmtpSslEnabled}
                                  />
                                  <Form.Check.Label>False</Form.Check.Label>
                                </Form.Check>
                              </Col>
                            </Row>
                          </Col>
                        </Form.Group>

                        <FormRadioGroup
                          label="Read Messages Using:"
                          name="readMessageType"
                          value={formState.readMessageType}
                          options={readMessageTypeOptions}
                          onChange={handleChange}
                          required={false}
                        />

                        {/* IMAP Fields */}
                        {formState.readMessageType === "imap" && (
                          <>
                            <FormInputGroup
                              label="IMAP URL:"
                              name="imapUrl"
                              placeholder="Enter IMAP URL"
                              value={formState.imapUrl}
                              onChange={handleChange}
                              isInvalid={
                                isValidated && !formState.imapUrl?.trim()
                              }
                              feedback="Please provide a IMAP URL."
                              required
                            />

                            <FormInputGroup
                              label="IMAP Port:"
                              name="imapPort"
                              placeholder="Enter IMAP Port"
                              value={formState.imapPort}
                              onChange={handleChange}
                              isInvalid={
                                isValidated && !formState.imapPort?.trim()
                              }
                              feedback="Please provide a IMAP Port."
                              required
                            />

                            <FormRadioGroup
                              label="IMAP Auth Enabled:"
                              name="imapAuthEnabled"
                              value={formState.imapAuthEnabled}
                              onChange={handleChange}
                              options={imapAuthOptions}
                              isInvalid={
                                isValidated && !formState.imapAuthEnabled
                              }
                              feedback="Please select IMAP Auth option."
                              required={false}
                            />

                            <FormRadioGroup
                              label="IMAP SSL Enabled:"
                              name="imapSslEnabled"
                              value={formState.imapSslEnabled}
                              onChange={handleChange}
                              options={imapSslOptions}
                              isInvalid={
                                isValidated && !formState.imapSslEnabled
                              }
                              feedback="Please select IMAP SSL option."
                              required={false}
                            />
                          </>
                        )}

                        {/*  POP3 Fields  */}
                        {formState.readMessageType === "pop3" && (
                          <>
                            <FormInputGroup
                              label="POP3 URL:"
                              name="popUrl"
                              placeholder="Enter POP3 URL"
                              value={formState.popUrl}
                              onChange={handleChange}
                              isInvalid={
                                isValidated && !formState.popUrl?.trim()
                              }
                              feedback="Please provide a POP3 URL."
                              required
                            />
                            <FormInputGroup
                              label="POP3 Port:"
                              name="popPort"
                              placeholder="Enter POP3 Port"
                              value={formState.popPort}
                              onChange={handleChange}
                              isInvalid={
                                isValidated && !formState.popPort?.trim()
                              }
                              feedback="Please provide a POP3 Port."
                              required
                            />
                          </>
                        )}
                      </>
                    )}

                    {/* REST API section */}
                    {formState.directType === "restApi" && (
                      <FormInputGroup
                        label=" Rest API URL:"
                        name="restApiUrl"
                        placeholder="Enter Rest API URL"
                        value={formState.restApiUrl}
                        onChange={handleChange}
                        isInvalid={isValidated && !formState.restApiUrl?.trim()}
                        feedback="Please provide a  Rest API URL."
                        required
                      />
                    )}

                    {/* FHIR test type */}
                    {formState.directType === "fhir" && (
                      <>
                        <FormRadioGroup
                          label="Submit Report To:"
                          name="submitReportTo"
                          value={formState.submitReportTo}
                          onChange={handleSubmitReportToChange}
                          options={submitReportToOptions}
                          required={true}
                        />

                        {formState.submitReportTo === "pha" && (
                          <FormInputGroup
                            label="Public Health Authority Endpoint:"
                            name="phaUrl"
                            placeholder="Enter PHA URL"
                            value={formState.phaUrl}
                            onChange={handleChange}
                            isInvalid={isValidated && !formState.phaUrl?.trim()}
                            feedback="Please provide a PHA URL."
                            required
                          />
                        )}
                        {formState.submitReportTo === "ttp" && (
                          <FormInputGroup
                            label="Trusted Third Party URL:"
                            name="trustedThirdParty"
                            placeholder="Enter Trusted Third Party URL"
                            value={formState.trustedThirdParty}
                            onChange={handleChange}
                            isInvalid={
                              isValidated &&
                              !formState.trustedThirdParty?.trim()
                            }
                            feedback="Please provide a TTP URL."
                            required
                          />
                        )}
                      </>
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              {/*  Submit Report To section under fhir  */}
              {/* Submit Report To form controls shown conditionally under Transport Configuration */}

              {/*  App Configuration  */}
              <Card className="accordionCards">
                <Accordion.Toggle as={Card.Header} eventKey="2">
                  App Configuration
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="2">
                  <Card.Body className="appConfiguration">
                    <FormInputGroup
                      label="Encounter Start Time Threshold in hours:"
                      name="startThreshold"
                      placeholder="Enter Encounter Start Time Threshold in hours"
                      value={formState.startThreshold}
                      onChange={handleChange}
                      isInvalid={
                        isValidated && !formState.startThreshold?.trim()
                      }
                      feedback="Please provide a Encounter Start Time Threshold in hours."
                      required
                    />
                    <FormInputGroup
                      label="Encounter End Time Threshold in hours:"
                      name="endThreshold"
                      placeholder="Enter Encounter End Time Threshold in hours"
                      value={formState.endThreshold}
                      onChange={handleChange}
                      isInvalid={isValidated && !formState.endThreshold?.trim()}
                      feedback="Please provide a Encounter End Time Threshold in hours."
                      required
                    />

                    <FormRadioGroup
                      label="Off Hours Enabled:"
                      name="offhoursEnabled"
                      value={formState.offhoursEnabled ? "True" : "False"}
                      options={offhoursOptions}
                      onChange={handleOffHoursChange}
                    />

                    {formState.offhoursEnabled === true && (
                      <>
                        <FormInputGroup
                          label="Off Hours Start Hour:"
                          name="offHoursStart"
                          type="number"
                          placeholder="Enter Off Hours Start Hour"
                          value={formState.offHoursStart}
                          onChange={handleChange}
                          isInvalid={
                            isValidated &&
                            (formState.offHoursStart === "")
                          }
                          min={0}
                          feedback="Please provide an Off Hours Start Hour."
                          required
                        />

                        <FormInputGroup
                          label="Off Hours Start Minute:"
                          name="offHoursStartMin"
                          type="number"
                          placeholder="Enter Off Hours Start Minute"
                          value={formState.offHoursStartMin}
                          onChange={handleChange}
                          isInvalid={
                            isValidated &&
                            (formState.offHoursStartMin === "")
                          }
                          min={0}
                          feedback="Please provide an Off Hours Start Minute."
                          required
                        />

                        <FormInputGroup
                          label="Off Hours End Hour:"
                          name="offHoursEnd"
                          type="number"
                          placeholder="Enter Off Hours End Hour"
                          value={formState.offHoursEnd}
                          onChange={handleChange}
                          isInvalid={
                            isValidated &&
                            (formState.offHoursEnd === "")
                          }
                          min={0}
                          feedback="Please provide an Off Hours End Hour."
                          required
                        />
                        <FormInputGroup
                          label="Off Hours End Minute:"
                          name="offHoursEndMin"
                          type="number"
                          placeholder="Enter Off Hours End Minute"
                          value={formState.offHoursEndMin}
                          onChange={handleChange}
                          isInvalid={
                            isValidated &&
                            (formState.offHoursEndMin === "")
                          }
                          min={0}
                          feedback="Please provide an Off Hours End Minute."
                          required
                        />  

                        <FormInputGroup
                          label="Off Hours Timezone:"
                          name="offHoursTimezone"
                          placeholder="Enter Off Hours Timezone (e.g. PST)"
                          value={formState.offHoursTimezone}
                          onChange={handleChange}
                          isInvalid={
                            isValidated &&
                            (typeof formState.offHoursTimezone !== "string" ||
                              !formState.offHoursTimezone)
                          }
                          feedback="Please provide a valid Off Hours Timezone (e.g. PST)."
                          required
                        />
                      </>
                    )}

                    <FormRadioGroup
                      label="Debug Enabled:"
                      name="debugEnabled"
                      value={debugEnabled ? "true" : "false"}
                      options={debugEnabledOptions}
                      onChange={handleDebugEnabled}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              {/*  Organization Defaults  */}
              <Card className="accordionCards">
                <Accordion.Toggle as={Card.Header} eventKey="4">
                  Organization Defaults
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="4">
                  <Card.Body className="Organization Defaults">
                    <FormInputGroup
                      label="Organization Name:"
                      name="orgName"
                      placeholder="Enter Organization Name"
                      value={formState.orgName}
                      onChange={handleChange}
                      isInvalid={isValidated && !formState.orgName?.trim()}
                      feedback="Please provide a Organization Name."
                      required
                    />
                    <FormInputGroup
                      label="Organization Name Space URL:"
                      name="orgIdSystem"
                      placeholder="Enter Organization Name Space URL"
                      value={formState.orgIdSystem}
                      onChange={handleChange}
                      isInvalid={isValidated && !formState.orgIdSystem?.trim()}
                      feedback="Please provide a Organization Name Space URL."
                      required
                    />
                    <FormInputGroup
                      label="Organization Id:"
                      name="orgId"
                      placeholder="Enter Organization Id"
                      value={formState.orgId}
                      onChange={handleChange}
                      isInvalid={isValidated && !formState.orgId?.trim()}
                      feedback="Please provide a Organization Id."
                      required
                    />
                    <FormInputGroup
                      label="Assigning Authority Id:"
                      name="assigningAuthorityId"
                      placeholder="Enter Assigning Authority Id"
                      value={formState.assigningAuthorityId}
                      onChange={handleChange}
                      isInvalid={
                        isValidated && !formState.assigningAuthorityId?.trim()
                      }
                      feedback="Please provide a Assigning Authority Id."
                      required
                    />
                    <FormInputGroup
                      label="Default Provider Id for Document Reference creation:"
                      name="defaultProviderId"
                      placeholder="Enter Default Provider Id for Document Reference creation"
                      value={formState.defaultProviderId}
                      onChange={handleChange}
                      isInvalid={
                        isValidated && !formState.defaultProviderId?.trim()
                      }
                      feedback="Please provide a Default Provider Id for Document Reference creation."
                      required
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              {/*  Response Options  */}
              <Card className="accordionCards">
                <Accordion.Toggle as={Card.Header} eventKey="5">
                  Response Options
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="5">
                  <Card.Body className="Organization Defaults">
                    <FormRadioGroup
                      label="Response Processing Type:"
                      name="responseProcessingType"
                      value={formState.responseProcessingType}
                      options={responseProcessingOptions}
                      onChange={handleResponseProcessingChange}
                      required={false}
                    />
                    {formState.responseProcessingType === "invokeRestAPI" && (
                      <Form.Group as={Row} controlId="handOffResponseToRestApi">
                        <Form.Label column sm={2}>
                          Hand off Response to Rest API URL:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="Rest API URL"
                            required
                            name="handOffResponseToRestApi"
                            onChange={handleChange}
                            value={formState.handOffResponseToRestApi || ""}
                            isInvalid={
                              isValidated && !formState.handOffResponseToRestApi
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a Rest API URL.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>
                    )}

                    {formState.responseProcessingType === "createDocRef" && (
                      <Form.Group as={Row} controlId="docRefMimeType">
                        <Form.Label column sm={2}>
                          Document Reference Mime Type:
                        </Form.Label>
                        <Col sm={10}>
                          <Form.Control
                            type="text"
                            placeholder="DocumentReference Mime Type"
                            required
                            name="docRefMimeType"
                            onChange={handleChange}
                            value={formState.docRefMimeType || ""}
                            isInvalid={isValidated && !formState.docRefMimeType}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide DocumentReference Mime Type.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

              {/*  eCR Specifications / KAR Configuration  */}
              {!isAddNew && (
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
                            onChange={handleKARChange}
                            required
                            className="select-drop-down"
                          >
                            <option>Select FHIR Server URL</option>
                            {Array.isArray(karFhirServerURLList) &&
                              karFhirServerURLList.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.repoName +
                                    " - " +
                                    option.fhirServerURL}
                                </option>
                              ))}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid FHIR Server URL.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      {isKarFhirServerURLSelected && (
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
                              <thead>
                                <tr>
                                  {/* <th>PlanDefinitionId</th> */}
                                  <th>Name</th>
                                  <th>Publisher</th>
                                  <th>Version</th>
                                  <th>Activate</th>
                                  <th>Enable Subscriptions</th>
                                  {/* <th>Emergent Reporting</th> */}
                                  <th className="outputFormat">
                                    Output Format
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedKARDetails.map((get) => (
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
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            e,
                                            get,
                                            "Activation"
                                          )
                                        }
                                        className="tableCheckboxes"
                                        checked={get.isActive}
                                      />
                                    </td>
                                    <td className="karCheckBoxes">
                                      <Form.Check
                                        type="checkbox"
                                        name="karSubscribed"
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            e,
                                            get,
                                            "EnableSubscriptions"
                                          )
                                        }
                                        className="tableCheckboxes"
                                        checked={get.subscriptionsEnabled}
                                      />
                                    </td>                    
                                    {/* <td className="karCheckBoxes">
                                      <Form.Check
                                        type="checkbox"
                                        name="covidEnabled"
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            e,
                                            get,
                                            "EnableCovidReporting"
                                          )
                                        }
                                        className="tableCheckboxes"
                                        checked={get.covidOnly}
                                      />
                                    </td> */}
                                    <td>
                                      <Form.Control
                                        as="select"
                                        size="sm"
                                        defaultValue={get.outputFormat}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLSelectElement>
                                        ) => handleOutputFormatChange(e, get)}
                                      >
                                        <option value="">
                                          Select Output Format
                                        </option>
                                        {outputFormats.map((option, index) => (
                                          <option key={index} value={option}>
                                            {
                                              option as keyof typeof outputFormatsList
                                            }
                                          </option>
                                        ))}
                                      </Form.Control>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              )}
            </Accordion>

            {/*  Save Button  */}
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

export default withRouter(HealthCareSettings);
