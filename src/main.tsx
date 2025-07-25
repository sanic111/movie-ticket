import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "@styles/main.scss";
import "./i18n.ts"; 
import App from "./App.tsx"; // App có RouterProvider


createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);