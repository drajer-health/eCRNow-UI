import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "./HealthCareSettingsList.css";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { withRouter } from "../../withRouter";
import axiosInstance from "../../Services/AxiosConfig";
import {
  HealthCareSetting,
  HealthCareSettingsListProps,
} from "../../Models/HealthCareSettingsList.model";

const tooltip = <Tooltip id="tooltip">Edit</Tooltip>;

const HealthCareSettingsList: React.FC<HealthCareSettingsListProps> = ({
  addNewHealthCare,
  selectedHealthCareSettings,
  navigate,
}) => {
  const [details, setDetails] = useState<HealthCareSetting[]>([]);

  useEffect(() => {
    getAllHealthCareSettings();
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

  const getAllHealthCareSettings = (): void => {
    axiosInstance
      .get("/api/healthcareSettings/")
      .then((response) => {
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
        return response.data;
      })
      .then((result: HealthCareSetting[] | undefined) => {
        if (result) {
          setDetails(result);
        }
      })
      .catch((error: any) => {
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
      });
  };

  const openAddNewHealthCareSettings = (): void => {
    addNewHealthCare({ addNewHealthCare: true });
    navigate("/healthCareSettings");
  };

  const editHealthCareSettings = (selected: HealthCareSetting): void => {
    addNewHealthCare({ addNewHealthCare: false });
    selectedHealthCareSettings(selected);
    navigate("/healthCareSettings");
  };

  return (
    <div className="healthCareSettings">
      <br />
      <Row>
        <Col md="6">
          <h2>HealthCare Settings List</h2>
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
                    <OverlayTrigger placement="top" overlay={tooltip}>
                      <Button
                        className="editButton"
                        onClick={() => editHealthCareSettings(get)}
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

export default withRouter(HealthCareSettingsList);