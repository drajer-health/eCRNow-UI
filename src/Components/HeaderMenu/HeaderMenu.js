import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";  
import MenuIcon from "@mui/icons-material/Menu";
import "./HeaderMenu.css";  
import menuData from "./NavLinks.json";

const HeaderMenu = ({bypassAuth}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const menuRef = useRef(null);
  const menuIconRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

// Handle outside click to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        menuIconRef.current && !menuIconRef.current.contains(event.target)
      ) {
        closeMenu(); 
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Hide menu on login page
  if (location.pathname === "/login" || location.pathname === "/") {
    return null;
  }

  const getLinkClassName = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  return (
    <div>
      {/* Menu Icon */}
      <div 
        className="menu-icon-container" 
        onClick={toggleMenu} 
        ref={menuIconRef}
      >
        <MenuIcon className="menu-icon" />
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="side-menu" ref={menuRef}> 
          <ul>
          {menuData.map((item) => {
            // Hide "Logout" if auth is bypassed
              if (item.authRequired && bypassAuth) return null;
              return (
                <li key={item.path}>

                 <Link to={item.path} className={getLinkClassName(item.path)} onClick={closeMenu}>
                    {item.label}
                  </Link>

              </li>
              );
          })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
