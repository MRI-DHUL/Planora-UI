import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import toast from "react-hot-toast";
import { useEffect, type JSX } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in first to continue");
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
