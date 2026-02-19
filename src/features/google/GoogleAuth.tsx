import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

const SCOPES = "https://www.googleapis.com/auth/calendar";

export default function GoogleAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useGoogleLogin({
    scope: SCOPES,
    onSuccess: (tokenResponse) => {
      console.log("Access Token:", tokenResponse.access_token);
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem("google_access_token", tokenResponse.access_token);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {!accessToken ? (
        <button
          onClick={() => login()}
          className="bg-orange-500 px-4 py-2 rounded text-white"
        >
          Connect Google Calendar
        </button>
      ) : (
        <p className="text-green-500">Google Connected ✅</p>
      )}
    </div>
  );
}
