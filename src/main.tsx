import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthInitializer } from "./components/AuthInitializer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeView from "./pages/home/views/home.view.tsx";
import AvisoPrivacidad from "./pages/aviso-privacidad/views/aviso-privacidad.view.tsx";
import TerminosCondicionesView from "./pages/terminos-condiciones/views/terminos-condiciones.view.tsx";
import LoginView from "./pages/auth/views/login.view.tsx";
import DashboardView from "./pages/dashboard/views/dashboard.view.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthInitializer>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
          <Route
            path="/terminos-condiciones"
            element={<TerminosCondicionesView />}
          />
          <Route path="/login" element={<LoginView />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthInitializer>
  </StrictMode>
);
