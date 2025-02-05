import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "./ClientDetailsList.css";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { withRouter } from "../../withRouter";

const tooltip = <Tooltip id="tooltip">Edit</Tooltip>;

class ClientDetailsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
    };

    this.openAddNewClient = this.openAddNewClient.bind(this);
  }

  componentDidMount() {
    this.getAllClientDetails();
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

  getAllClientDetails() {
    // const serviceURL = this.geturl();
    fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/clientDetails/", {
      method: "GET",
    })
      .then((response) => {
        if (response.status !== 200) {
          toast.error("Error in getting the Client Details", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
          });
          return;
        } else {
          return response.json();
        }
      })
      .then((result) => {
        this.setState({
          details: result,
        });
      });
  }

  openAddNewClient() {
    this.props.addNew({ addNew: true });
    // this.props.history.push('clientDetails');
    this.props.navigate("/clientDetails");
  }

  editClient(selectedClientDetails) {
    this.props.addNew({ addNew: false });
    this.props.selectedClientDetails(selectedClientDetails);
    // this.props.history.push('clientDetails');
    this.props.navigate("/clientDetails");
  }

  render() {
    return (
      <div className="clientDetails">
        <br />
        <Row>
          <Col md="6">
            <h2>Client Details List</h2>
          </Col>
          <Col className="addClient">
            <Button onClick={this.openAddNewClient}>Add Client Details</Button>
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
                  <th>Transport Type</th>
                  <th>Action</th>
                </tr>
                {this.state.details.map((get) => (
                  <tr key={get.id}>
                    <td>{get.id}</td>
                    <td>{get.clientId}</td>
                    <td>{get.fhirServerBaseURL}</td>
                    <td>
                      {get.isDirect ? "Direct" : ""}
                      {get.isRestAPI ? "Rest API" : ""}
                      {get.isXdr ? "XDR" : ""}
                    </td>
                    <td className="actionColumn">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit</Tooltip>}
                      >
                        <Button
                          className="editButton"
                          onClick={(e) => this.editClient(get)}
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

export default withRouter(ClientDetailsList);
