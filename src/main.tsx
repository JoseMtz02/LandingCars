import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthInitializer } from "./components/AuthInitializer";
import { AuthRedirect } from "./components/AuthRedirect";
import { AuthPersistenceDebugger } from "./components/AuthPersistenceDebugger";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeView from "./pages/home/views/home.view.tsx";
import AvisoPrivacidad from "./pages/aviso-privacidad/views/aviso-privacidad.view.tsx";
import TerminosCondicionesView from "./pages/terminos-condiciones/views/terminos-condiciones.view.tsx";
import LoginView from "./pages/auth/views/login.view.tsx";
import ForgotPasswordView from "./pages/auth/views/forgot-password.view.tsx";
import ResetPasswordView from "./pages/auth/views/reset-password.view.tsx";
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
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <LoginView />
              </AuthRedirect>
            }
          />
          <Route
            path="/auth/login"
            element={
              <AuthRedirect>
                <LoginView />
              </AuthRedirect>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <AuthRedirect>
                <ForgotPasswordView />
              </AuthRedirect>
            }
          />
          <Route
            path="/auth/reset-password"
            element={
              <AuthRedirect>
                <ResetPasswordView />
              </AuthRedirect>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardView />
              </ProtectedRoute>
            }
          />
        </Routes>
        <AuthPersistenceDebugger />
      </BrowserRouter>
    </AuthInitializer>
  </StrictMode>
);
