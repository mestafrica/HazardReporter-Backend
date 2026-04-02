import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import PasswordRecovery from "./pages/passwordRecovery";
import MapPage from "./pages/mapPage";
import FrontEndLayout from "./layouts/FrontEndLayout";
import Overview from "./components/Overview";
import Settings from "./components/Settings";
import Map from "./components/Map";
import { ROUTES } from "./constants/routes";
import DashboardHomePage from "./pages/DashboardHomePage";
import CoordinatesAndLocation from "./components/CoordinatesAndLocation";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/" element={<Login />} />
          <Route path="/map" element={<MapPage />} />
          <Route
            path="/co-ordinates-location"
            element={<CoordinatesAndLocation />}
          />
          <Route path={`/${ROUTES.dashboard}`} element={<FrontEndLayout />}>
            <Route path="" element={<DashboardHomePage />} />
            <Route path="map" element={<Map />} />
            <Route path="overview" element={<Overview />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
