export interface SelectedClientDetails {
  id?: string;
  clientId?: string;
  clientSecret?: string;
  fhirServerBaseURL?: string;
  tokenURL?: string;
  scopes?: string;
  directHost?: string;
  directUser?: string;
  directPwd?: string;
  smtpUrl?: string;
  smtpPort?: string;
  imapUrl?: string;
  imapPort?: string;
  directRecipientAddress?: string;
  xdrRecipientAddress?: string;
  restAPIURL?: string;
  rrRestAPIUrl?: string;
  assigningAuthorityId?: string;
  encounterStartThreshold?: string;
  encounterEndThreshold?: string;
  rrDocRefMimeType?: string;
  isProvider?: boolean;
  isSystem?: boolean;
  isUserAccountLaunch?: boolean;
  isDirect?: boolean;
  isXdr?: boolean;
  isRestAPI?: boolean;
  isCovid?: boolean;
  isFullEcr?: boolean;
  isCreateDocRef?: boolean;
  isInvokeRestAPI?: boolean;
  isBoth?: boolean;
  debugFhirQueryAndEicr?: boolean;
}

export interface ClientDetailsProps {
  selectedClientDetails: SelectedClientDetails;
  addNew?: { addNew: boolean };
}
