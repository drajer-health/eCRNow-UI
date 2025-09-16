export interface ClientDetails {
  clientId: string;
  scopes: string;
  directUser: string;
  directPwd: string;
  directHost: string;
  directRecipientAddress: string;
  assigningAuthorityId: string;
  isCovid: boolean;
  encounterStartThreshold: string;
  encounterEndThreshold: string;
  fhirServerBaseURL: string;
}

export interface AuthData {
  [key: string]: any;
}

export interface AuthorizationsProps {
  authData: AuthData;
}

export interface State {
  isAuthorized: boolean;
  access_token: string;
  baseURL?: string;
  launch?: string;
  code?: string;
  state?: string;
  patientId: string;
  regurl?: string;
  authurl?: string;
  tokenurl?: string;
  refreshToken?: string;
  expiry?: number;
  authUrl?: string;
  tokenUrl?: string;
  userId?: string;
  fhirVersion?: string;
}
