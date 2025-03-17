import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import './Header.css';
import HeaderMenu from '../../Components/HeaderMenu/HeaderMenu';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: 'eCRNow',
      appDesc: 'Electronic Case Reporting(eCR)',
      isMenuOpen: false, // State to track menu open/close
    };
  }
  // componentDidMount() {
  //   this.updateHeader();
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   if (window.location.pathname !== prevState.currentPath) {
  //     this.updateHeader();
  //   }
  // }

  // updateHeader = () => {
  //   const { pathname } = window.location;
  //   let appName = 'eCRNow';
  //   let appDesc = 'Electronic Case Reporting(eCR)';

  //   if (
  //     pathname === '/healthCareSettings' ||
  //     pathname === '/healthCareSettingsList' ||
  //     pathname === '/kar'
  //   ) {
  //     appName = 'eCRNow/BSA';
  //     appDesc = '';
  //   }

  //   this.setState({ appName, appDesc, currentPath: pathname });
  // };

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  render() {
    const {bypassAuth} = this.props
    return (
      <Navbar className="navbar" fixedtop="true">
        <div className="header-INT">
          <div className="logo">
            <div className="site-name">
              <h1>
                {this.state.appName} &nbsp;{this.state.appDesc}
              </h1>
            </div>
          </div>
          <HeaderMenu bypassAuth={bypassAuth}/>
        </div>
        
      </Navbar>
    );
  }
}

export default Header;