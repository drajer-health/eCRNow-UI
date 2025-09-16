import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./HeaderMenu.css";
import { menuData } from "./NavLinks";
import { HeaderProps, MenuItem } from "../../Models/Header.model";

const HeaderMenu: React.FC<HeaderProps> = ({ bypassAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuIconRef.current &&
        !menuIconRef.current.contains(target)
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

  const getLinkClassName = (path: string): string => {
    return location.pathname === path ? "active" : "";
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
            {(menuData as MenuItem[]).map((item) => {
              if (item.authRequired && bypassAuth) return null;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={getLinkClassName(item.path)}
                    onClick={closeMenu}
                  >
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
