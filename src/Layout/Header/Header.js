import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import './Header.css';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state ={}
  }

  componentDidMount(){
    if(window.location.pathname === '/clientDetails'||window.location.pathname === '/clientDetailsList'||window.location.pathname === '/'){
      this.setState({
        appName:'eCR Now',
        appDesc: 'Electronic Case Reporting(eCR)'
      })
    } else if(window.location.pathname === '/healthCareSettings' || window.location.pathname === '/healthCareSettingsList' || window.location.pathname === '/kar' ){
      this.setState({
        appName:'BSA',
        appDesc:'(Backend Service APP)'
      })
    }
  }

  render() {
    // const location = window.location.pathname.split("/");
    return (
      <Navbar className="navbar" fixedtop="true">
        <div className="header-INT">
          <div className="logo">
            <div className="site-name">
              <h1>{this.state.appName} &nbsp; &nbsp;{this.state.appDesc}</h1>
            </div>
          </div>
        </div>
      </Navbar>
    );
  }
}

export default Header;
