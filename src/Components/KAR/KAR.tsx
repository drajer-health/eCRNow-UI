import React, { useState } from "react";
import { Alert, Row, Col, Form, Card, Button, Table } from "react-bootstrap";
import "./KAR.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Services/AxiosConfig";
import { KARProps, KARDetail } from "../../Models/KAR.model";
import FormInputGroup from "../../ReUsables/FormInputGroup";

const KAR: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [validated, setValidated] = useState(false);
  const [karRetrieved, setKarRetrieved] = useState(false);
  const [details, setDetails] = useState<KARDetail[]>([]);
  const [repoName, setRepoName] = useState("");
  const [fhirServerURL, setFhirServerURL] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "repoName") setRepoName(value);
    if (name === "fhirServerURL") setFhirServerURL(value);
  };

  const openAddNewHealthCareSettings = () => {
    navigate("/healthCareSettings");
  };

  const getKARs = async () => {
    try {
      const response = await axiosInstance.get(
        `${fhirServerURL}/PlanDefinition/`
      );

      if (response.status === 200) {
        setKarRetrieved(true);
        renderKARTable(response.data);
      }
    } catch (error) {
      toast.error("Error in fetching the PlanDefinitions", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const renderKARTable = (bundle: any) => {
    if (!bundle || !Array.isArray(bundle.entry)) {
      console.error(
        "Invalid bundle format or missing 'entry' property:",
        bundle
      );
      setDetails([]);
      return;
    }

    const tableEntries: KARDetail[] = bundle.entry.map((entry: any) => {
      const resource = entry.resource || {};
      return {
        karId: resource.id || "",
        karName: resource.name || "",
        karPublisher: resource.publisher || "",
        karVersion: resource.version || "",
      };
    });

    setDetails(tableEntries);
  };

  const saveKAR = async () => {
    const karObj = {
      repoName,
      fhirServerURL,
      karsInfo: details,
    };

    try {
      const response = await axiosInstance.post("/api/kar", karObj);
      if (response.status === 200) {
        setIsSaved(true);
        setFhirServerURL("");
        setRepoName("");
        setDetails([]);
        setKarRetrieved(false);

        toast.success("KAR Details are saved successfully.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Error in Saving the Knowledge Artifact Repositories", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    saveKAR();
    setValidated(true);

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="healthCareSettings">
      <br />
      <Row>
        <Col md="6">
          <h2>eCR Specifications/KAR</h2>
        </Col>
        <Col className="addClient">
          <Button onClick={openAddNewHealthCareSettings}>
            Add New HealthCare Settings
          </Button>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Alert
            variant="success"
            show={isSaved}
            onClose={() => setIsSaved(false)}
            dismissible
          >
            KAR is saved successfully.
          </Alert>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            data-testid="kar-form"
          >
            <Card className="accordionCards">
              <Card.Body className="fhirConfiguration">
                <FormInputGroup
                  label="Repository Name:"
                  name="repoName"
                  type="text"
                  placeholder="Enter Repository Name"
                  value={repoName || ""}
                  onChange={handleChange}
                  feedback="Please provide a Repository Name."
                  required
                />

                <Form.Group as={Row} controlId="formFHIRURL">
                  <Form.Label column sm={2}>
                    FHIR Server URL:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      placeholder="FHIR Server URL"
                      name="fhirServerURL"
                      required
                      onChange={handleChange}
                      value={fhirServerURL}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a FHIR Server URL.
                    </Form.Control.Feedback>
                  </Col>
                  <Col sm={2}>
                    <Button
                      type="button"
                      disabled={!repoName || !fhirServerURL}
                      onClick={getKARs}
                    >
                      Search KAR
                    </Button>
                  </Col>
                </Form.Group>
              </Card.Body>
            </Card>

            {karRetrieved && (
              <Row>
                <Col>
                  <Table responsive="lg" striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>PlanDefinitionId</th>
                        <th>Name</th>
                        <th>Publisher</th>
                        <th>Version</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((get) => (
                        <tr key={get.karId}>
                          <td>{get.karId}</td>
                          <td>{get.karName}</td>
                          <td>{get.karPublisher}</td>
                          <td>{get.karVersion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}

            <Row>
              <Col className="text-center">
                <Button type="submit" disabled={!karRetrieved}>
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default KAR;
