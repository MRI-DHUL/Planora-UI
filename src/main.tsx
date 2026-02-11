import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

const GOOGLE_CLIENT_ID = "...";

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
