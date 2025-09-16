import React, { useEffect, useState } from "react";
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
import {
  PublicHealthAuthorityListProps,
} from "../../Models/PublicHealthAuthorityList.model";

const PublicHealthAuthorityList: React.FC<PublicHealthAuthorityListProps> = ({
  addNewPublicHealthAuthority,
  selectedPublicHealthAuthority,
  navigate,
}) => {
  const [details, setDetails] = useState<any[]>([]);

  useEffect(() => {
    getAllPublicHealthAuthorities();
  }, []);

  const geturl = (): string => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const context = window.location.pathname.substring(
      0,
      window.location.pathname.indexOf("/", 2)
    );
    return `${protocol}//${host}${context}`;
  };

  const getAllPublicHealthAuthorities = (): void => {
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
        }
        return response.data;
      })
      .then((result) => {
        if (result) {
          setDetails(result);
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
  };

  const openAddNewPublicHealthAuthority = (): void => {
    addNewPublicHealthAuthority({ addNewHealthCare: true });
    selectedPublicHealthAuthority({});
    navigate("/publicHealthAuthority");
  };

  const editPublicHealthAuthority = (selectedPHA: any): void => {
    addNewPublicHealthAuthority({
      addNewPublicHealthAuthority: false,
    });
    selectedPublicHealthAuthority(selectedPHA);
    navigate("/publicHealthAuthority");
  };

  return (
    <div className="publicHealthAuthority">
      <br />
      <Row>
        <Col md="6">
          <h2>Public Health Authority List</h2>
        </Col>
        <Col className="addClient">
          <Button onClick={openAddNewPublicHealthAuthority}>
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
              {details.map((get) => (
                <tr key={get.id}>
                  <td>{get.id}</td>
                  <td>{get.clientId}</td>
                  <td>{get.fhirServerBaseURL}</td>
                  <td>{get.authType}</td>
                  <td className="actionColumn">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip">Edit</Tooltip>}
                    >
                      <Button
                        className="editButton"
                        onClick={() => editPublicHealthAuthority(get)}
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
};

export default withRouter(PublicHealthAuthorityList);
