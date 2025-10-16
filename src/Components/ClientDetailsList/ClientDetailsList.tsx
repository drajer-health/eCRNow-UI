import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Services/AxiosConfig";

import {
  ClientDetail,
  ClientDetailsListProps,
} from "../../Models/ClientDetailsList.model";

import "./ClientDetailsList.css";
import axios from "axios";

const ClientDetailsList: React.FC<ClientDetailsListProps> = ({
  addNew,
  selectedClientDetails,
}) => {
  const [details, setDetails] = useState<ClientDetail[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllClientDetails();
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

  const getAllClientDetails = async (): Promise<void> => {
    try {
      const url = "/api/clientDetails/";
      const response = await axiosInstance.get<ClientDetail[]>(url);
      setDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch client details:", error);
      toast.error("Failed to fetch client details.", {
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

  const openAddNewClient = (): void => {
    addNew({ addNew: true });
    navigate("/clientDetails");
  };

  const editClient = (selectedClient: ClientDetail): void => {
    addNew({ addNew: false });
    selectedClientDetails(selectedClient);
    navigate("/clientDetails");
  };

  return (
    <div className="clientDetails">
      <br />
      <Row>
        <Col md="6">
          <h2>Client Details List</h2>
        </Col>
        <Col className="addClient">
          <Button onClick={openAddNewClient}>Add Client Details</Button>
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
              {details.map((get) => (
                <tr key={get.id}>
                  <td>{get.id}</td>
                  <td>{get.clientId}</td>
                  <td>{get.fhirServerBaseURL}</td>
                  <td>
                    {get.isDirect ? "Direct " : ""}
                    {get.isRestAPI ? "Rest API " : ""}
                    {get.isXdr ? "XDR" : ""}
                  </td>
                  <td className="actionColumn">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip">Edit</Tooltip>}
                    >
                      <Button
                        data-testid={`edit-btn-${get.id}`}
                        className="editButton"
                        onClick={() => editClient(get)}
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

export default ClientDetailsList;
