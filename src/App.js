import React, { Component } from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import Header from './Layout/Header/Header';
import Authorizations from './Views/Authorizations/Authorizations';
import ClientDetails from './Views/ClientDetails/ClientDetails';
import ClientDetailsList from './Views/ClientDetailsList/ClientDetailsList';
import HealthCareSettings from './Views/HealthCareSettings/HealthCareSettings';
import HealthCareSettingsList from './Views/HealthCareSettingsList/HealthCareSettingsList';
import KAR from './Views/KAR/KAR';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';

class App extends Component {
  constructor() {
    super();
    this.state = {
      displayJSONObject: false,
      isAuthorized: false,
      selectedClientDetails: {},
      selectedHealthCareSettings:{},
      addNewHealthCare:true
    };
    this.selectedClientDetails = this.selectedClientDetails.bind(this);
    this.selectedHealthCareSettings = this.selectedHealthCareSettings.bind(this);
    this.addNew = this.addNew.bind(this);
    this.addNewHealthCare = this.addNewHealthCare.bind(this);
  }

  async selectedClientDetails(_state) {
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      selectedClientDetails: updatedState
    });
  }

  async selectedHealthCareSettings(_state) {
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      selectedHealthCareSettings: updatedState
    });
  }

  async addNew(_state) {
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      addNew: updatedState
    });
  }

  async addNewHealthCare(_state) {
    console.log(JSON.stringify(_state));
    const updatedState = JSON.parse(JSON.stringify(_state));
    await this.setState({
      addNewHealthCare: updatedState
    });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="main">
          <Container>
            <Router basename={process.env.REACT_APP_ROUTER_BASE || ''}>
              <Switch>
                <Route exact path="/" render={props => (<Authorizations {...props} authData={this.state}></Authorizations>)}></Route>
              </Switch>
              <Switch>
                <Route exact path="/clientDetails" render={props => (<ClientDetails {...props} selectedClientDetails={this.state.selectedClientDetails} addNew={this.state.addNew}></ClientDetails>)}></Route>
              </Switch>
              <Switch>
                <Route exact path="/clientDetailsList" render={props => (<ClientDetailsList {...props} selectedClientDetails={this.selectedClientDetails} addNew={this.addNew}></ClientDetailsList>)}></Route>
              </Switch>
              <Switch>
                <Route exact path="/healthCareSettings" render={props => (<HealthCareSettings {...props} selectedHealthCareSettings={this.state.selectedHealthCareSettings} addNewHealthCare={this.state.addNewHealthCare}></HealthCareSettings>)}></Route>
              </Switch>
              <Switch>
                <Route exact path="/healthCareSettingsList" render={props => (<HealthCareSettingsList {...props} selectedHealthCareSettings={this.selectedHealthCareSettings} addNewHealthCare={this.addNewHealthCare}></HealthCareSettingsList>)}></Route>
              </Switch>
              <Switch>
                <Route exact path="/kar" render={props => (<KAR {...props} ></KAR>)}></Route>
              </Switch>
            </Router>
          </Container>
        </div>
        <ReactNotification />
      </div>
    );
  }
}

export default App;
