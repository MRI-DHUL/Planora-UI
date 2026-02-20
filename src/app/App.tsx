import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../features/auth/AuthContext";
import AppRoutes from "./AppRoutes";
import { Toaster } from "react-hot-toast";
import { DateProvider } from "../context/DateContext";

const GOOGLE_CLIENT_ID = "...";

function App() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <DateProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </DateProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
