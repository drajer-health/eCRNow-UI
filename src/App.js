import React, { Component } from "react";
import "./App.css";
import { Container } from "react-bootstrap";
import Header from "./Layout/Header/Header";
import Authorizations from "./Views/Authorizations/Authorizations";
import ClientDetails from "./Views/ClientDetails/ClientDetails";
import ClientDetailsList from "./Views/ClientDetailsList/ClientDetailsList";
import HealthCareSettings from "./Views/HealthCareSettings/HealthCareSettings";
import HealthCareSettingsList from "./Views/HealthCareSettingsList/HealthCareSettingsList";
import PublicHealthAuthority from "./Views/PublicHealthAuthority/PublicHealthAuthority";
import PublicHealthAuthorityList from "./Views/PublicHealthAuthorityList/PublicHealthAuthorityList";
import KAR from "./Views/KAR/KAR";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      displayJSONObject: false,
      isAuthorized: false,
      selectedClientDetails: {},
      selectedHealthCareSettings: {},
      selectedPublicHealthAuthority: {},
      addNewHealthCare: true,
    };
    this.selectedClientDetails = this.selectedClientDetails.bind(this);
    this.selectedHealthCareSettings =
      this.selectedHealthCareSettings.bind(this);
    this.addNew = this.addNew.bind(this);
    this.addNewHealthCare = this.addNewHealthCare.bind(this);
    this.addNewPublicHealthAuthority =
      this.addNewPublicHealthAuthority.bind(this);
    this.selectedPublicHealthAuthority =
      this.selectedPublicHealthAuthority.bind(this);
  }

  async selectedClientDetails(_state) {
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      selectedClientDetails: updatedState,
    });
  }

  async selectedHealthCareSettings(_state) {
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      selectedHealthCareSettings: updatedState,
    });
  }

  async selectedPublicHealthAuthority(_state) {
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      selectedPublicHealthAuthority: updatedState,
    });
  }

  async addNew(_state) {
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      addNew: updatedState,
    });
  }

  async addNewHealthCare(_state) {
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      addNewHealthCare: updatedState,
    });
  }

  async addNewPublicHealthAuthority(_state) {
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      addPublicHealthAuthority: updatedState,
    });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="main">
          <Container>
            <Router basename={process.env.REACT_APP_ROUTER_BASE || ""}>
              <Routes>
                <Route
                  path="/"
                  element={<Authorizations authData={this.state} />}
                />
                <Route
                  path="/clientDetails"
                  element={
                    <ClientDetails
                      selectedClientDetails={this.state.selectedClientDetails}
                      addNew={this.state.addNew}
                    />
                  }
                />
                <Route
                  path="/clientDetailsList"
                  element={
                    <ClientDetailsList
                      selectedClientDetails={this.selectedClientDetails}
                      addNew={this.addNew}
                    />
                  }
                />
                <Route
                  path="/healthCareSettings"
                  element={
                    <HealthCareSettings
                      selectedHealthCareSettings={
                        this.state.selectedHealthCareSettings
                      }
                      addNewHealthCare={this.state.addNewHealthCare}
                    />
                  }
                />
                <Route
                  path="/healthCareSettingsList"
                  element={
                    <HealthCareSettingsList
                      selectedHealthCareSettings={
                        this.selectedHealthCareSettings
                      }
                      addNewHealthCare={this.addNewHealthCare}
                    />
                  }
                />
                <Route
                  path="/publicHealthAuthority"
                  element={
                    <PublicHealthAuthority
                      selectedPublicHealthAuthority={
                        this.state.selectedPublicHealthAuthority
                      }
                      addNewHealthAuthority={
                        this.state.addNewPublicHealthAuthority
                      }
                    />
                  }
                />
                <Route
                  path="/publicHealthAuthorityList"
                  element={
                    <PublicHealthAuthorityList
                      selectedPublicHealthAuthority={
                        this.selectedPublicHealthAuthority
                      }
                      addNewPublicHealthAuthority={
                        this.addNewPublicHealthAuthority
                      }
                    />
                  }
                />
                <Route path="/kar" element={<KAR />} />
              </Routes>
            </Router>
          </Container>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default App;
