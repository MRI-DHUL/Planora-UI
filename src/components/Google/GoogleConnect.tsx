import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleConnect() {
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar",
    onSuccess: (tokenResponse) => {
      localStorage.setItem(
        "google_access_token",
        tokenResponse.access_token
      );
      alert("Google Connected Successfully");
    },
    onError: () => {
      alert("Google Login Failed");
    },
  });

  return (
    <button
      onClick={() => login()}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      Connect Google Calendar
    </button>
  );
}
