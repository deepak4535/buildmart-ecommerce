import { Link } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Heart,
  User,
  LogIn,
  UserPlus,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="navbar-logo"
        >
          Construction Material Workplace
        </Link>


        {/* =========================
            NAVIGATION
        ========================= */}

        <div className="navbar-links">

          <Link to="/">
            <Home size={17} />
            Home
          </Link>

          <Link to="/products">
            <Package size={17} />
            Products
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/contact">
            Contact
          </Link>

          <Link to="/faq">
            FAQ
          </Link>


          {/* =========================
              LOGGED-IN USER LINKS
          ========================= */}

          {isAuthenticated && (
            <>
              <Link to="/cart">
                <ShoppingCart size={17} />
                Cart
              </Link>

              <Link to="/wishlist">
                <Heart size={17} />
                Wishlist
              </Link>

              <Link to="/orders">
                Orders
              </Link>

              <Link to="/profile">
                <User size={17} />
                Profile
              </Link>
            </>
          )}


          {/* =========================
              ADMIN LINK
          ========================= */}

          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin"
              className="admin-navbar-link"
            >
              <ShieldCheck size={17} />
              Admin
            </Link>
          )}


          {/* =========================
              AUTHENTICATION
          ========================= */}

          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <LogIn size={17} />
                Login
              </Link>

              <Link to="/register">
                <UserPlus size={17} />
                Register
              </Link>
            </>
          ) : (
            <button
              type="button"
              className="navbar-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;