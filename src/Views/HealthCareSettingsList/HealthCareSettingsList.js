import React, { Component } from 'react';
import {
    Row,
    Col, Button, Table, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import './HealthCareSettingsList.css';
import { store } from 'react-notifications-component';
import Icon from '@material-ui/core/Icon';

const tooltip = <Tooltip id="tooltip">Edit</Tooltip>;

class HealthCareSettingsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: []
        };

        this.openAddNewHealthCareSettings = this.openAddNewHealthCareSettings.bind(this);
    }

    componentDidMount() {
        this.getAllHealthCareSettings();
    }

    geturl() {
        var protocol, context, host, strurl;
        protocol = window.location.protocol;
        host = window.location.host;
        //port = window.location.port;
        context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
        strurl = protocol + "//" + host + context;
        return strurl;
    };

    getAllHealthCareSettings() {
        // const serviceURL = this.geturl();
        fetch(process.env.REACT_APP_ECR_BASE_URL + "/api/healthcareSettings/", {
            method: 'GET'
        }).then(response => {
            console.log(response);
            if (response.status !== 200) {
                store.addNotification({
                    title: '' + response.status + '',
                    message: 'Error in getting the HealthCareSettings',
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
            } else {
                return response.json();
            }
        }).then(result => {
            console.log(result);
            this.setState({
                details: result
            });
        });
    }

    openAddNewHealthCareSettings() {
        this.props.addNewHealthCare({ addNewHealthCare: true });
        this.props.history.push('healthCareSettings');
    }

    editHealthCareSettings(selectedHealthCareSettings) {
        console.log(selectedHealthCareSettings);
        this.props.addNewHealthCare({ addNewHealthCare: false });
        this.props.selectedHealthCareSettings(selectedHealthCareSettings);
        this.props.history.push('healthCareSettings');
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
                        <Button onClick={this.openAddNewHealthCareSettings}>Add New HealthCare Settings</Button>
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
                                {
                                    this.state.details.map(get =>
                                        <tr key={get.id}>
                                            <td>{get.id}</td>
                                            <td>{get.clientId}</td>
                                            <td>{get.fhirServerBaseURL}</td>
                                            <td>{get.authType}</td>
                                            <td className="actionColumn">
                                                <OverlayTrigger placement="top" overlay={tooltip}>
                                                    <Button className="editButton" onClick={e => this.editHealthCareSettings(get)}><Icon>edit</Icon></Button></OverlayTrigger></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default HealthCareSettingsList;
