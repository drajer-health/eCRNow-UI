// Output format mapping
  export const outputFormatsList = {
    CDA_R11: "CDA_R11",
    CDA_R30: "CDAR31_TEST_FOR_TRIAL_IMPLEMENTATION",
    FHIR: "FHIR_TEST_FOR_TRIAL_IMPLEMENTATION",
  };

  //authTypeOptions
  export const authTypeOptions = [
    { id: "systemLaunch", label: "System Launch", value: "System" },
    { id: "backend", label: "Backend", value: "SofBackend" },
    { id: "UserNamePwd", label: "Username & Password", value: "UserNamePwd" },
  ];

  //directTypeOptions
  export const directTypeOptions = [
    { id: "direct", label: "Direct", value: "direct" },
    { id: "restApi", label: "Rest API", value: "restApi" },
    { id: "fhir", label: "FHIR Test", value: "fhir" },
  ];

  //smtpAuthEnabledOptions
  export const smtpAuthEnabledOptions = [
    { id: "smtpAuthTrue", label: "True", value: "true" },
    { id: "smtpAuthFalse", label: "False", value: "false" },
  ];

//readMessageTypeOptions
  export const readMessageTypeOptions = [
    { id: "pop3", label: "POP3", value: "pop3" },
    { id: "imap", label: "IMAP", value: "imap" },
  ];

//submitReportToOptions
  export const submitReportToOptions = [
    { id: "pha", label: "Public Health Authority", value: "pha" },
    { id: "ttp", label: "Trusted Third Party", value: "ttp" },
  ];

//tlsVersionOptions
  export const tlsVersionOptions = [
    { id: "tls11", label: "TLSv1.1", value: "TLSv1.1" },
    { id: "tls12", label: "TLSv1.2", value: "TLSv1.2" },
  ];

  //Off Hours Options
  export const offhoursOptions = [
    { id: "offhoursTrue", label: "True", value: "True" },
    { id: "offhoursFalse", label: "False", value: "False" },
  ];

  //Debug Enabled Options
  export const debugEnabledOptions = [
    { id: "debugEnabledTrue", label: "True", value: "true" },
    { id: "debugEnabledFalse", label: "False", value: "false" },
  ];

  //Response Processing Options
  export const responseProcessingOptions = [
    { id: "createDocRef", label: "Create Document Reference", value: "createDocRef" },
    { id: "invokeRestAPI", label: "Invoke Rest API", value: "invokeRestAPI" },
    { id: "noAction", label: "No Action", value: "noAction" },
  ];