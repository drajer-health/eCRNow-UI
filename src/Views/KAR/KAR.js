import React, { Component } from "react";
import {
  Alert,
  Row,
  Col,
  Form,
  Card,
  Button,
  Table,
} from "react-bootstrap";
import "./KAR.css";
import { toast } from "react-toastify";
import { withRouter } from "../../withRouter";
import axiosInstance from "../../Services/AxiosConfig";

class KAR extends Component {
  constructor(props) {
    super(props);
    this.state = this.props;
    this.state = {
      isSaved: false,
      validated: false,
      karRetrieved: false,
      details: [],
    };

    this.getKARs = this.getKARs.bind(this);
    this.openAddNewHealthCareSettings =
      this.openAddNewHealthCareSettings.bind(this);
    this.saveKAR = this.saveKAR.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  openAddNewHealthCareSettings() {
    // this.props.history.push('healthCareSettings');
    this.props.navigate("/healthCareSettings");
  }

  getKARs() {
    fetch(this.state.fhirServerURL + "/PlanDefinition/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          // const errorMessage = response.json();
          toast.error("Error in fetching the PlanDefinitions", {
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
      })
      .then((result) => {
        if (result) {
          this.setState({
            karRetrieved: true,
          });
          this.renderKARTable(result);
        }
      });
  }

  renderKARTable(bundle) {
    const tableEntries = [];
    const bundleEntries = bundle.entry;
    if (bundleEntries.length > 0) {
      for (var i = 0; i < bundleEntries.length; i++) {
        const resource = bundleEntries[i].resource;
        const tableRow = {
          karId: resource.id ? resource.id : "",
          karName: resource.name ? resource.name : "",
          karPublisher: resource.publisher ? resource.publisher : "",
          karVersion: resource.version ? resource.version : "",
        };
        tableEntries.push(tableRow);
      }
    }
    this.setState({
      details: tableEntries,
    });
  }

  async saveKAR() {
    const karObj = {
      repoName: this.state.repoName,
      fhirServerURL: this.state.fhirServerURL,
      karsInfo: this.state.details,
    };

    try {
      const response = await axiosInstance.post("/api/kar", karObj);
      if (response.status === 200) {
        this.setState({
          isSaved: true,
          fhirServerURL: "",
          details: [],
          karRetrieved: false,
        });
  
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
  }

  render() {
    const setShow = () => this.setState({ isSaved: false });
// eslint-disable-next-line 
    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
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
            <h2>eCR Specifications/KAR</h2>
          </Col>
          <Col className="addClient">
            <Button onClick={this.openAddNewHealthCareSettings}>
              Add New HealthCare Settings
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
              KAR is saved successfully.
            </Alert>
            <Form>
              <Card className="accordionCards">
                <Card.Body className="fhirConfiguration">
                  <Form.Group as={Row} controlId="formHorizontalClientId">
                    <Form.Label column sm={2}>
                      Repository Name:
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        placeholder="Repository Name"
                        name="repoName"
                        required
                        onChange={(e) => this.handleChange(e)}
                        value={this.state.repoName || ""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a Repository Name.
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formHorizontalClientId">
                    <Form.Label column sm={2}>
                      FHIR Server URL:
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        placeholder="FHIR Server URL"
                        name="fhirServerURL"
                        required
                        onChange={(e) => this.handleChange(e)}
                        value={this.state.fhirServerURL || ""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a FHIR Server URL.
                      </Form.Control.Feedback>
                    </Col>
                    <Col sm={2}>
                      <Button
                        type="button"
                        disabled={
                          this.state.repoName === undefined &&
                          this.state.fhirServerURL === undefined
                        }
                        onClick={this.getKARs}
                      >
                        Search KAR
                      </Button>
                    </Col>
                  </Form.Group>
                </Card.Body>
              </Card>
              {this.state.karRetrieved ? (
                <Row>
                  <Col>
                    <Table responsive="lg" striped bordered hover size="sm">
                      <tbody>
                        <tr>
                          <th>PlanDefinitionId</th>
                          <th>Name</th>
                          <th>Publisher</th>
                          <th>Version</th>
                        </tr>
                        {this.state.details.map((get) => (
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
              ) : (
                ""
              )}

              <Row>
                <Col className="text-center">
                  <Button
                    type="button"
                    disabled={!this.state.karRetrieved}
                    onClick={this.saveKAR}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(KAR);
