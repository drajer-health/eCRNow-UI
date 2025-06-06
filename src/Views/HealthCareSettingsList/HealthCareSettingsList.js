import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "./HealthCareSettingsList.css";
import { toast } from 'react-toastify';
import EditIcon from "@mui/icons-material/Edit";
import { withRouter } from "../../withRouter";
import axiosInstance from "../../Services/AxiosConfig";

const tooltip = <Tooltip id="tooltip">Edit</Tooltip>;

class HealthCareSettingsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
    };

    this.openAddNewHealthCareSettings =
      this.openAddNewHealthCareSettings.bind(this);
  }

  componentDidMount() {
    this.getAllHealthCareSettings();
  }

  geturl() {
    var protocol, context, host, strurl;
    protocol = window.location.protocol;
    host = window.location.host;
    //port = window.location.port;
    context = window.location.pathname.substring(
      0,
      window.location.pathname.indexOf("/", 2)
    );
    strurl = protocol + "//" + host + context;
    return strurl;
  }

async getAllHealthCareSettings() {
  try {
    const response = await axiosInstance.get("/api/healthcareSettings/");
    if (response.status !== 200) {
      toast.error("Error in getting the HealthCareSettings", {
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
    this.setState({ details: response?.data || [] });

  } catch (error){
    toast.error("Error in getting the HealthCareSettings", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    console.error("Error:", error);
  }
}

  openAddNewHealthCareSettings = () => {
    this.props.addNewHealthCare({ addNewHealthCare: true });
    this.props.navigate("/healthCareSettings");
  };

  editHealthCareSettings(selectedHealthCareSettings) {    
    this.props.addNewHealthCare({ addNewHealthCare: false });
    this.props.selectedHealthCareSettings(selectedHealthCareSettings);
    this.props.navigate("/healthCareSettings");
  }

  render() {
    return (
      <div className="healthCareSettings">
        <br />
        <Row>
          <Col md="6">
            <h2>HealthCare Settings List</h2>
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
            <Table responsive="lg" striped bordered hover size="sm">
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Client Id</th>
                  <th>FHIR Server Url</th>
                  <th>Authentication Type</th>
                  <th>Action</th>
                </tr>
                {this.state.details.map((get) => (
                  <tr key={get.id}>
                    <td>{get.id}</td>
                    <td>{get.clientId}</td>
                    <td>{get.fhirServerBaseURL}</td>
                    <td>{get.authType}</td>
                    <td className="actionColumn">
                      <OverlayTrigger
                        placement="top"
                        overlay={tooltip}
                      >
                        <Button
                          className="editButton"
                          onClick={(e) => this.editHealthCareSettings(get)}
                        >
                          <EditIcon />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(HealthCareSettingsList);
