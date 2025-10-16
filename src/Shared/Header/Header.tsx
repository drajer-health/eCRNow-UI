import React, { useState } from "react";
import { Navbar } from "react-bootstrap";
import HeaderMenu from "../HeaderMenu/HeaderMenu";
import "./Header.css";
import { HeaderProps } from "../../Models/Header.model";

const Header: React.FC<HeaderProps> = ({ bypassAuth }) => {
  const [appName] = useState("eCRNow");
  const [appDesc] = useState("Electronic Case Reporting(eCR)");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Not currently used

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <Navbar className="navbar" fixed="top">
      <div className="header-INT">
        <div className="logo">
          <div className="site-name">
            <h1>
              {appName} &nbsp;{appDesc}
            </h1>
          </div>
        </div>
        <HeaderMenu bypassAuth={bypassAuth} />
      </div>
    </Navbar>
  );
};

export default Header;
