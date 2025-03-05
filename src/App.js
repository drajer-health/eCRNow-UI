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
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loginpage from "./Views/LoginPage/Loginpage";
import Cookies from "js-cookie";
import Logout from "./Components/Logout/Logout";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isAuthorize: false,
      authorize: false,
      loading: true,
      bypassAuth: false,
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

  setAuthorized = (value) => {
    this.setState({ isAuthorize: value, loading: false }, () => {});
  };


  async componentDidMount() {
    const token = Cookies.get("jwt_token");
    console.log("Raw Env Value:", process.env.REACT_APP_BYPASS_AUTH);
  
    if (token) {
      this.setAuthorized(true);
    } else {
      try {
        // Check if the env variable exists; default to true if not set
        const isAuthorize = 
          process.env.REACT_APP_BYPASS_AUTH 
            ? process.env.REACT_APP_BYPASS_AUTH === "true" 
            : true;  
        this.setAuthorized(isAuthorize);
        this.setState({ authorize: isAuthorize });
  
        // Perform navigation based on the final value of isAuthorize
        if (isAuthorize) {
          return <Navigate to="/home" replace />;
        } else {
          return <Navigate to="/login" replace />;
        }
      } catch (error) {
        console.error("Error in authorization:", error);
        this.setAuthorized(false);
        this.setState({ authorize: false });
      }
    }
  }
  

  render() {
    // While the auth status is loading, show a continuous spinner
    if (this.state.loading) {
      return (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      );
    }

    return (
      <div className="App">
        <Header bypassAuth={this.state.authorize} />
        <div className="main">
          <Container>
            <Routes>
              <Route path="/logout" element={<Logout />} />
              {/* If user is authorized, navigating to /login will redirect them to /home */}
              <Route
                path="/login"
                element={
                  this.state.isAuthorize ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <Loginpage
                      setAuthorized={this.setAuthorized}
                      setIsLoginPageUser={this.props.setIsLoginPageUser}
                    />
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  this.state.isAuthorize ? (
                    <Authorizations authData={this.state} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/clientDetails"
                element={
                  this.state.isAuthorize ? (
                    <ClientDetails
                      selectedClientDetails={this.state.selectedClientDetails}
                      addNew={this.state.addNew}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/clientDetailsList"
                element={
                  this.state.isAuthorize ? (
                    <ClientDetailsList
                      selectedClientDetails={this.selectedClientDetails}
                      addNew={this.addNew}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/healthCareSettings"
                element={
                  this.state.isAuthorize ? (
                    <HealthCareSettings
                      selectedHealthCareSettings={
                        this.state.selectedHealthCareSettings
                      }
                      addNewHealthCare={this.state.addNewHealthCare}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/healthCareSettingsList"
                element={
                  this.state.isAuthorize ? (
                    <HealthCareSettingsList
                      selectedHealthCareSettings={
                        this.selectedHealthCareSettings
                      }
                      addNewHealthCare={this.addNewHealthCare}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/publicHealthAuthority"
                element={
                  this.state.isAuthorize ? (
                    <PublicHealthAuthority
                      selectedPublicHealthAuthority={
                        this.state.selectedPublicHealthAuthority
                      }
                      addNewHealthAuthority={
                        this.state.addNewPublicHealthAuthority
                      }
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/publicHealthAuthorityList"
                element={
                  this.state.isAuthorize ? (
                    <PublicHealthAuthorityList
                      selectedPublicHealthAuthority={
                        this.selectedPublicHealthAuthority
                      }
                      addNewPublicHealthAuthority={
                        this.addNewPublicHealthAuthority
                      }
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/kar"
                element={
                  this.state.isAuthorize ? (
                    <KAR />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Catch-all: redirect to appropriate route */}
              <Route
                path="*"
                element={
                  <Navigate
                    to={this.state.isAuthorized ? "/home" : "/login"}
                    replace
                  />
                }
              />
            </Routes>
          </Container>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default App;
