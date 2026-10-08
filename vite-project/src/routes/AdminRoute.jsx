import { Navigate, Outlet, useLocation, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-page">
        <h2>Loading...</h2>

        <p>
          Checking administrator access.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="access-denied-page">

        <div className="access-denied-card">

          <div className="access-denied-icon">
            🔒
          </div>

          <h1>
            Access Denied
          </h1>

          <p>
            You do not have administrator permission
            to access this page.
          </p>

          <Link
            to="/"
            className="admin-primary-button"
          >
            Back to Home
          </Link>

        </div>

      </div>
    );
  }

  return <Outlet />;
}

export default AdminRoute;