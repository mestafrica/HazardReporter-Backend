import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import PasswordRecovery from "./pages/passwordRecovery";
import FrontEndLayout from "./layouts/FrontEndLayout";
import Overview from "./components/Overview";
import Settings from "./components/Settings";
import { ROUTES } from "./constants/routes";
import DashboardHomePage from "./pages/DashboardHomePage";
import CoordinatesAndLocation from "./components/CoordinatesAndLocation";
import MapPage from "./pages/mapPage";

export default function App() {
  return (
    <BrowserRouter>
      <main className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route
            path="/co-ordinates-location"
            element={<CoordinatesAndLocation />}
          />
          <Route path={`${ROUTES.dashboard}`} element={<FrontEndLayout />}>
            <Route path="/" element={<DashboardHomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="overview" element={<Overview />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}
