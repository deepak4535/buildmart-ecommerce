import { useEffect, useState } from "react";
import {
  Calendar,
  Edit3,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Shield,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { usersApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.pincode || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setSuccessMessage("");
    setError("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage("");
    setError("");
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || "",
    });

    setIsEditing(false);
    setSuccessMessage("");
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      setError("Unable to identify your account.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const updatedUser = {
        ...user,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      };

      const response = await usersApi.updateUser(
        user.id,
        updatedUser
      );

      const savedUser = response.data;

      localStorage.setItem(
        "constructionUser",
        JSON.stringify(savedUser)
      );

      window.dispatchEvent(
        new Event("constructionUserUpdated")
      );

      setIsEditing(false);

      setSuccessMessage(
        "Your profile has been updated successfully."
      );

      window.location.reload();
    } catch (err) {
      console.error(
        "Error updating profile:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="loading-page">
        <h2>Loading Profile...</h2>

        <p>
          Please wait while we load your account.
        </p>
      </div>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-page-header">
        <div>
          <p className="profile-page-label">
            MY ACCOUNT
          </p>

          <h1>My Profile</h1>

          <p>
            Manage your account information and
            preferences.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="profile-success-message">
          <Shield size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="profile-error-message">
          <span>{error}</span>
        </div>
      )}

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            <User size={42} />
          </div>

          <h2>
            {user.name || "Customer"}
          </h2>

          <p>{user.email}</p>

          <span className="profile-role">
            {user.role === "admin"
              ? "Administrator"
              : "Customer"}
          </span>

          <div className="profile-sidebar-links">
            <Link to="/orders">
              <Package size={18} />
              My Orders
            </Link>

            <Link to="/wishlist">
              <Heart size={18} />
              My Wishlist
            </Link>

            <Link to="/cart">
              <Package size={18} />
              My Cart
            </Link>
          </div>

          <button
            type="button"
            className="profile-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <div className="profile-main">
          <div className="profile-card">
            <div className="profile-card-header">
              <div>
                <h2>Personal Information</h2>

                <p>
                  Keep your account information
                  up to date.
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  className="profile-edit-button"
                  onClick={handleEdit}
                >
                  <Edit3 size={17} />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form
                className="profile-form"
                onSubmit={handleSave}
              >
                <div className="profile-form-grid">
                  <div className="profile-form-group">
                    <label htmlFor="profile-name">
                      Full Name
                    </label>

                    <div className="profile-input-wrapper">
                      <User size={17} />

                      <input
                        id="profile-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="profile-phone">
                      Phone Number
                    </label>

                    <div className="profile-input-wrapper">
                      <Phone size={17} />

                      <input
                        id="profile-phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="profile-form-group">
                  <label htmlFor="profile-address">
                    Address
                  </label>

                  <div className="profile-input-wrapper profile-textarea-wrapper">
                    <MapPin size={17} />

                    <textarea
                      id="profile-address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="profile-form-grid">
                  <div className="profile-form-group">
                    <label htmlFor="profile-city">
                      City
                    </label>

                    <input
                      id="profile-city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="profile-state">
                      State
                    </label>

                    <input
                      id="profile-state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                    />
                  </div>
                </div>

                <div className="profile-form-group profile-pincode-group">
                  <label htmlFor="profile-pincode">
                    Pincode
                  </label>

                  <input
                    id="profile-pincode"
                    name="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter your pincode"
                    maxLength="6"
                  />
                </div>

                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X size={17} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={saving}
                  >
                    <Save size={17} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-information">
                <div className="profile-information-item">
                  <div className="profile-information-icon">
                    <User size={19} />
                  </div>

                  <div>
                    <span>Full Name</span>

                    <strong>
                      {user.name || "Not provided"}
                    </strong>
                  </div>
                </div>

                <div className="profile-information-item">
                  <div className="profile-information-icon">
                    <Mail size={19} />
                  </div>

                  <div>
                    <span>Email Address</span>

                    <strong>
                      {user.email}
                    </strong>
                  </div>
                </div>

                <div className="profile-information-item">
                  <div className="profile-information-icon">
                    <Phone size={19} />
                  </div>

                  <div>
                    <span>Phone Number</span>

                    <strong>
                      {user.phone ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>

                <div className="profile-information-item">
                  <div className="profile-information-icon">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <span>Address</span>

                    <strong>
                      {user.address ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>

                <div className="profile-information-item">
                  <div className="profile-information-icon">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <span>Location</span>

                    <strong>
                      {[
                        user.city,
                        user.state,
                        user.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ") ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>

                <div className="profile-information-item">
                  <div className="profile-information-icon">
                    <Shield size={19} />
                  </div>

                  <div>
                    <span>Account Type</span>

                    <strong>
                      {user.role === "admin"
                        ? "Administrator"
                        : "Customer"}
                    </strong>
                  </div>
                </div>

                <div className="profile-information-item">
                  <div className="profile-information-icon">
                    <Calendar size={19} />
                  </div>

                  <div>
                    <span>Member Since</span>

                    <strong>
                      {formatDate(
                        user.createdAt
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-quick-actions">
            <Link
              to="/orders"
              className="profile-quick-action"
            >
              <Package size={24} />

              <div>
                <strong>My Orders</strong>

                <span>
                  View your order history
                </span>
              </div>
            </Link>

            <Link
              to="/wishlist"
              className="profile-quick-action"
            >
              <Heart size={24} />

              <div>
                <strong>My Wishlist</strong>

                <span>
                  View your saved products
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;