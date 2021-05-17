import React, { Component } from 'react';
import {
    Alert,
    Row,
    Col,
    Form, Card, Accordion, Button,Table,OverlayTrigger
} from 'react-bootstrap';
import './KAR.css';
import { store } from 'react-notifications-component';

class KAR extends Component {
    constructor(props) {
        super(props);
        this.state = this.props;
        this.state = {
          isSaved:false,
          validated: false,
          karRetrieved:false,
          details:[]
        }

        this.getKARs = this.getKARs.bind(this);
        this.openAddNewHealthCareSettings =this.openAddNewHealthCareSettings.bind(this);
        this.saveKAR = this.saveKAR.bind(this);
    }

    handleChange(e) {
      this.setState({
          [e.target.name]: e.target.value
      });
  }

  openAddNewHealthCareSettings() {
    this.props.history.push('healthCareSettings');
}

    getKARs() {
        console.log("clicked");
        console.log(this.state.fhirServerURL);
        fetch(this.state.fhirServerURL + "/PlanDefinition/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    const errorMessage = response.json();
                    console.log(errorMessage);
                    store.addNotification({
                        title: '' + response.status + '',
                        message: 'Error in fetching the PlanDefinitions',
                        type: 'danger',
                        insert: 'bottom',
                        container: 'bottom-right',
                        animationIn: ['animated', 'fadeIn'],
                        animationOut: ['animated', 'fadeOut'],
                        dismiss: {
                            duration: 5000,
                            click: true,
                            onScreen: true
                        }
                    });
                    return;
                }
            })
            .then(result => {
                console.log(result);
                if (result) {
                    console.log(result);
                    this.setState({
                      karRetrieved:true
                    })
                    this.renderKARTable(result);
                }

            });
    }

    renderKARTable(bundle){
      const tableEntries = [];
      const bundleEntries = bundle.entry;
      if(bundleEntries.length>0){
        for(var i=0; i<bundleEntries.length; i++){
          const resource = bundleEntries[i].resource;
          console.log(resource.id);
          const tableRow = {
            planDefinitionId: resource.id,
            planDefinitionName: resource.name,
            planDefinitionPublisher: resource.publisher,
            planDefinitionVersion: resource.version
          }
          tableEntries.push(tableRow);
        }
      }
      console.log(tableEntries);
      this.setState({
        details:tableEntries
      })
    }

    saveKAR(){
      const karObj = {
        fhirServerURL: this.state.fhirServerURL,
        kars_info: this.state.details
      }

      fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/kar", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(karObj)
    })
        .then(response => {
            if (response.status === 200) {
                this.setState({
                    isSaved: true
                });
                return response.json();
            } else {
                const errorMessage = response.json();
                console.log(errorMessage);
                store.addNotification({
                    title: '' + response.status + '',
                    message: 'Error in Saving the Knowledge Artifact Repositories',
                    type: 'danger',
                    insert: 'bottom',
                    container: 'bottom-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                        duration: 5000,
                        click: true,
                        onScreen: true
                    }
                });
                return;
            }
        })
        .then(result => {
            console.log(result);
            if (result) {
                this.setState({
                    fhirServerURL: "",
                    details:[],
                    karRetrieved:false
                });
                store.addNotification({
                    title: 'Success',
                    message: 'KAR Details are saved successfully.',
                    type: 'success',
                    insert: 'bottom',
                    container: 'bottom-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                        duration: 5000,
                        click: true,
                        onScreen: true
                    }
                });

            }

        });
    }

    render() {
        const setShow = () => this.setState({ isSaved: false });

        const handleSubmit = (event) => {
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (form.checkValidity() === true) {
                this.saveHealthCareSettings();
                this.setState({
                    validated: true
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
                        <h2>Knowledge Artifact Repository</h2>
                    </Col>
                    <Col className="addClient">
                        <Button onClick={this.openAddNewHealthCareSettings}>Add New HealthCare Settings</Button>
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
                        <Form >
                                <Card className="accordionCards">
                                        <Card.Body className="fhirConfiguration">
                                            <Form.Group as={Row} controlId="formHorizontalClientId">
                                                <Form.Label column sm={2}>
                                                    FHIR Server URL:
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control type="text" placeholder="FHIR Server URL" name="fhirServerURL" required onChange={e => this.handleChange(e)} value={this.state.fhirServerURL} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide a FHIR Server URL.
                                                    </Form.Control.Feedback>
                                                </Col>
                                                <Col sm={2}>
                                                <Button type="button" onClick={this.getKARs}>Search KAR</Button>
                                                </Col>
                                            </Form.Group>
                                        </Card.Body>
                                </Card>
                                {this.state.karRetrieved  ? (
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
                                              {
                                                  this.state.details.map(get =>
                                                      <tr key={get.planDefinitionId}>
                                                          <td>{get.planDefinitionId}</td>
                                                          <td>{get.planDefinitionName}</td>
                                                          <td>{get.planDefinitionPublisher}</td>
                                                          <td>{get.planDefinitionVersion}</td>
                                                      </tr>
                                                  )
                                              }
                                          </tbody>
                                      </Table>
                                  </Col>
                              </Row>
                                ):''}
                                
                                
                            <Row>
                                <Col className="text-center">
                                    <Button type="button" disabled={!this.state.karRetrieved} onClick={this.saveKAR}>Save</Button>
                                </Col>
                            </Row>
                        </Form>
                        {/* <Row>
                            <Col className="text-center">
                                <button
                                    className="btn btn-primary submitBtn"
                                    type="button"
                                    onClick={e => this.saveClientDetails(e)}
                                >
                                    Save
                                </button>
                            </Col>
                        </Row> */}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default KAR;
