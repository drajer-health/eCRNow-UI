import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Authorizations from "./Components/Authorizations/Authorizations";
import ClientDetails from "./Components/ClientDetails/ClientDetails";
import ClientDetailsList from "./Components/ClientDetailsList/ClientDetailsList";
import HealthCareSettings from "./Components/HealthCareSettings/HealthCareSettings";
import HealthCareSettingsList from "./Components/HealthCareSettingsList/HealthCareSettingsList";
import KAR from "./Components/KAR/KAR";
import Loginpage from "./Components/LoginPage/Loginpage";
import Logout from "./Components/Logout/Logout";
import PublicHealthAuthority from "./Components/PublicHealthAuthority/PublicHealthAuthority";
import PublicHealthAuthorityList from "./Components/PublicHealthAuthorityList/PublicHealthAuthorityList";
import Header from "./Shared/Header/Header";

const App: React.FC = () => {
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [authorize, setAuthorize] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bypassAuth, setBypassAuth] = useState(false);
  const [selectedClientDetails, setSelectedClientDetails] = useState<any>({});
  const [selectedHealthCareSettings, setSelectedHealthCareSettings] = useState<any>({});
  const [selectedPublicHealthAuthority, setSelectedPublicHealthAuthority] = useState<any>({});
  const [addNew, setAddNew] = useState<boolean>(true);
  const [addNewHealthCare, setAddNewHealthCare] = useState<boolean>(true);
  const [addNewPublicHealthAuthority, setAddNewPublicHealthAuthority] = useState<boolean>(true);

  const navigate = useNavigate();

  const setAuthorized = (value: boolean) => {
    setIsAuthorize(value);
    setLoading(false);
  };

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    const bypass = import.meta.env.VITE_BYPASS_AUTH !== "false";
    setBypassAuth(bypass);

    if (token) {
      setAuthorized(true);
    } else {
      try {
        const isAuthorized = bypass;
        setAuthorized(isAuthorized);
        setAuthorize(isAuthorized);
      } catch (error) {
        console.error("Error in authorization:", error);
        setAuthorized(false);
        setAuthorize(false);
      }
    }
  }, []);

  // Monitor logout state changes
  useEffect(() => {
    const handleStorageChange = () => {
      const logoutSuccess = localStorage.getItem("logoutSuccess");
      if (logoutSuccess) {
        setIsAuthorize(false);
        setAuthorize(false);
        setLoading(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header bypassAuth={authorize} />
      <div className="main">
        <Container>
          <Routes>
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/login"
              element={
                isAuthorize ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Loginpage
                    setAuthorized={setAuthorized}
                  />
                )
              }
            />
            <Route
              path="/home"
              element={
                isAuthorize ? (
                  <Authorizations
                    authData={{
                      isAuthorize,
                      authorize,
                      loading,
                      bypassAuth,
                      selectedClientDetails,
                      selectedHealthCareSettings,
                      selectedPublicHealthAuthority,
                      addNewHealthCare,
                    }}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/clientDetails"
              element={
                isAuthorize ? (
                  <ClientDetails
                    selectedClientDetails={selectedClientDetails}
                    addNew={{ addNew }}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/clientDetailsList"
              element={
                isAuthorize ? (
                  <ClientDetailsList
                    navigate={navigate}
                    selectedClientDetails={setSelectedClientDetails}
                    addNew={({ addNew }) => setAddNew(addNew)}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/healthCareSettings"
              element={
                isAuthorize ? (
                  <HealthCareSettings
                    selectedHealthCareSettings={selectedHealthCareSettings}
                    addNewHealthCare={addNewHealthCare}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/healthCareSettingsList"
              element={
                isAuthorize ? (
                  <HealthCareSettingsList
                    navigate={navigate}
                    selectedHealthCareSettings={setSelectedHealthCareSettings}
                    addNewHealthCare={({ addNewHealthCare }) => setAddNewHealthCare(addNewHealthCare)}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/publicHealthAuthority"
              element={
                isAuthorize ? (
                  <PublicHealthAuthority
                    selectedPublicHealthAuthority={selectedPublicHealthAuthority}
                    addNewHealthAuthority={addNewPublicHealthAuthority}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/publicHealthAuthorityList"
              element={
                isAuthorize ? (
                  <PublicHealthAuthorityList
                    navigate={navigate}
                    selectedPublicHealthAuthority={setSelectedPublicHealthAuthority}
                    addNewPublicHealthAuthority={setAddNewPublicHealthAuthority}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/kar"
              element={isAuthorize ? <KAR /> : <Navigate to="/login" replace />}
            />
            <Route
              path="*"
              element={<Navigate to={isAuthorize ? "/home" : "/login"} replace />}
            />
          </Routes>
        </Container>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;