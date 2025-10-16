import React, { useEffect, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Authorizations.css";
import {
  AuthData,
  AuthorizationsProps,
  ClientDetails,
  State,
} from "../../Models/Authorizations.model";

export function geturl(): string {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const context = window.location.pathname.substring(
    0,
    window.location.pathname.indexOf("/", 2)
  );
  return `${protocol}//${host}${context}`;
}

export function getParamValue(variable: string): string | undefined {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (const param of vars) {
    const pair = param.split("=");
    if (pair[0] === variable) return pair[1];
  }
}

const Authorizations: React.FC<AuthorizationsProps> = ({ authData }) => {
  const [state, setState] = useState<State>({
    ...authData,
    isAuthorized: false,
    access_token: "",
    baseURL: getParamValue("iss"),
    launch: getParamValue("launch"),
    code: getParamValue("code"),
    state: getParamValue("state"),
    patientId: "",
  });
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(
    null
  );

  function authorizeWithServer(details: ClientDetails) {
    const array = new Uint32Array(1);
    const newState = window.crypto.getRandomValues(array)[0].toString();
    const clientid = details.clientId;
    const redirecturi = window.location.href.split("?")[0];
    const scopes = details.scopes;
    const strURL = decodeURIComponent(details.fhirServerBaseURL);

    fetch(`${strURL}/metadata?_format=json`)
      .then((res) => res.json())
      .then((result) => {
        let fhirVersion = "";
        if (result.fhirVersion === "1.0.2") fhirVersion = "DSTU2";
        if (result.fhirVersion === "4.0.0") fhirVersion = "R4";

        const ext = result.rest[0].security.extension[0].extension;
        const regurl = ext.find((e: any) => e.url === "register")?.valueUri;
        const authurl = ext.find((e: any) => e.url === "authorize")?.valueUri;
        const tokenurl = ext.find((e: any) => e.url === "token")?.valueUri;

        setState((prev: any) => ({ ...prev, regurl, authurl, tokenurl }));

        sessionStorage.clear();
        sessionStorage.setItem(
          newState,
          JSON.stringify({
            clientid,
            authUrl: authurl,
            redirecturi,
            tokenurl,
            strurl: strURL,
            scopes,
            launch: state.launch,
            fhirVersion,
            clientDetails: details,
          })
        );

        fhirOAuth(clientid, scopes, redirecturi, authurl, strURL, newState);
      });
  }

  function fhirOAuth(
    clientId: string,
    scopes: string,
    redirectURI: string,
    authorizeURL: string,
    baseURL: string,
    stateVal: string
  ) {
    const queryParams = [
      `response_type=code`,
      `client_id=${clientId}`,
      `redirect_uri=${redirectURI}`,
      `launch=${state.launch}`,
      `state=${stateVal}`,
      `scope=${scopes}`,
      `aud=${state.baseURL}`,
    ];
    const url = `${authorizeURL}?${queryParams.join("&")}`;
    window.location.replace(url);
  }

  function getAuthorizeToken(code: string, stateKey: string) {
    const params = JSON.parse(sessionStorage.getItem(stateKey) || "{}");
    setClientDetails(params.clientDetails);
    const tokenParams = {
      grant_type: "authorization_code",
      code,
      redirect_uri: params.redirecturi,
      client_id: params.clientid,
    };

    const searchParams = new URLSearchParams(tokenParams).toString();

    fetch(params.tokenurl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: searchParams,
    })
      .then((res) => res.json())
      .then((body) => {
        const updatedState = {
          isAuthorized: true,
          access_token: body.access_token,
          refreshToken: body.refresh_token,
          expiry: body.expires_in,
          authUrl: params.authUrl,
          baseURL: params.strurl,
          patientId: body.patient,
          tokenUrl: params.tokenurl,
          userId: body.user,
          fhirVersion: params.fhirVersion,
        };
        setState((prev: any) => ({ ...prev, ...updatedState }));
      });
  }

  function getClientDetails(baseURL: string) {
    fetch(`${geturl()}/api/clientDetails?url=${baseURL}`)
      .then((res) =>
        res.status === 200 ? res.json() : Promise.reject("Unauthorized")
      )
      .then((result) => {
        setClientDetails(result);
        authorizeWithServer(result);
      })
      .catch(() => {
        toast.error("UnAuthorized. The Server is not registered.", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
        });
      });
  }

  useEffect(() => {
    if (state.launch && state.baseURL) getClientDetails(state.baseURL);
    if (state.code && state.state) getAuthorizeToken(state.code, state.state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="authorizations">
      <Alert
        variant="success"
        show={state.isAuthorized}
        onClose={() =>
          setState((prev: any) => ({ ...prev, isAuthorized: false }))
        }
        dismissible
      >
        Application has been authorized with EHR successfully.
      </Alert>
      <div className="requests text-center">
        <Row>
          <Col>
            <p>
              This "splash screen" will only be present if the eCR Now App has
              not been automatically launched. It is preferable to launch the
              App with an automated process at the start of encounters that does
              not have this user interface, does not impact healthcare provider
              workflow, and insures consistent operation. Specific launch
              implementation will depend on the EHR. The launch API is detailed
              in the available implementation specifications.
            </p>
            <p>
              In the circumstance that automated launching cannot be
              accomplished, this text can be replaced with an appropriate
              message.
            </p>
          </Col>
        </Row>
      </div>
      <div className="centeredDiv text-center">
        <button className="btn btn-primary submitBtn" type="button">
          Ok
        </button>
      </div>
    </div>
  );
};

export default Authorizations;
