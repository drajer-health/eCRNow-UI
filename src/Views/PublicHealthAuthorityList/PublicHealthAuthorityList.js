import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "./PublicHealthAuthorityList.css";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { withRouter } from "../../withRouter";
import axiosInstance from "../../Services/AxiosConfig";

class PublicHealthAuthorityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
    };

    this.openAddNewPublicHealthAuthority =
      this.openAddNewPublicHealthAuthority.bind(this);
  }

  componentDidMount() {
    this.getAllPublicHealthAuthorities();
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

  getAllPublicHealthAuthorities() {
    axiosInstance
      .get("/api/publicHealthAuthority/")
      .then((response) => {
        if (response.status !== 200) {
          toast.error("Error in getting the PublicHealthAuthorities", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        } else {
          return response.data;
        }
      })
      .then((result) => {
        if (result) {
          this.setState({ details: result });
        }
      })
      .catch((error) => {
        console.error("Error in getting the PublicHealthAuthorities:", error);
        toast.error("Error in getting the PublicHealthAuthorities", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  }
  

  openAddNewPublicHealthAuthority() {
    this.props.addNewPublicHealthAuthority({ addNewHealthCare: true });
    this.props.selectedPublicHealthAuthority({});
    this.props.navigate("/publicHealthAuthority");
  }

  editPublicHealthAuthority(selectedPHA) {
    this.props.addNewPublicHealthAuthority({
      addNewPublicHealthAuthority: false,
    });
    this.props.selectedPublicHealthAuthority(selectedPHA);
    this.props.navigate("/publicHealthAuthority");
  }

  render() {
    return (
      <div className="publicHealthAuthority">
        <br />
        <Row>
          <Col md="6">
            <h2>Public Health Authority List</h2>
          </Col>
          <Col className="addClient">
            <Button onClick={this.openAddNewPublicHealthAuthority}>
              Add New Public Health Authority
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
                        overlay={<Tooltip>Edit</Tooltip>}
                      >
                        <Button
                          className="editButton"
                          onClick={(e) => this.editPublicHealthAuthority(get)}
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

export default withRouter(PublicHealthAuthorityList);
