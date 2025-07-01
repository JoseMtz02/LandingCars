import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomeView from "./pages/home/views/home.view.tsx";
import AvisoPrivacidad from "./pages/aviso-privacidad/views/aviso-privacidad.view.tsx";
import TerminosCondicionesView from "./pages/terminos-condiciones/views/terminos-condiciones.view.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
        <Route
          path="/terminos-condiciones"
          element={<TerminosCondicionesView />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
