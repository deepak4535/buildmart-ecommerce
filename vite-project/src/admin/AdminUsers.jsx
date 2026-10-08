import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  User,
  ShieldCheck,
  Mail,
  CalendarDays,
} from "lucide-react";

import { usersApi } from "../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await usersApi.getUsers();

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to load users:", err);

      setError(
        "Unable to load users. Please make sure JSON Server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (user) => {
    if (user.role === "admin") {
      window.alert("The administrator account cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        user.name || user.email || "this user"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await usersApi.deleteUser(user.id);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => String(item.id) !== String(user.id)
        )
      );

      window.alert("User deleted successfully.");
    } catch (err) {
      console.error("Failed to delete user:", err);

      window.alert("Unable to delete the user.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchText.trim().toLowerCase();

    const matchesSearch =
      !search ||
      String(user.id || "")
        .toLowerCase()
        .includes(search) ||
      String(user.name || "")
        .toLowerCase()
        .includes(search) ||
      String(user.email || "")
        .toLowerCase()
        .includes(search);

    const userRole = user.role || "user";

    const matchesRole =
      roleFilter === "All" || userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const customerCount = users.filter(
    (user) => user.role !== "admin"
  ).length;

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="admin-page-loading">
        <RefreshCw
          size={40}
          className="admin-loading-icon"
        />

        <h2>Loading Users...</h2>

        <p>Please wait while users are loaded.</p>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="admin-page-container">

        {/* PAGE HEADER */}
        <div className="admin-page-header">
          <div>
            <p className="admin-page-eyebrow">
              ADMINISTRATION
            </p>

            <h1>Manage Users</h1>

            <p>
              View and manage registered customers and
              administrators.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadUsers}
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="admin-error-message">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="admin-users-summary">

          <div className="admin-summary-card">
            <div className="admin-summary-icon">
              <User size={23} />
            </div>

            <div>
              <span>Total Users</span>
              <strong>{users.length}</strong>
            </div>
          </div>

          <div className="admin-summary-card">
            <div className="admin-summary-icon">
              <ShieldCheck size={23} />
            </div>

            <div>
              <span>Administrators</span>
              <strong>{adminCount}</strong>
            </div>
          </div>

          <div className="admin-summary-card">
            <div className="admin-summary-icon">
              <User size={23} />
            </div>

            <div>
              <span>Customers</span>
              <strong>{customerCount}</strong>
            </div>
          </div>

          <div className="admin-summary-card">
            <div className="admin-summary-icon">
              <Search size={23} />
            </div>

            <div>
              <span>Showing</span>
              <strong>{filteredUsers.length}</strong>
            </div>
          </div>

        </div>

        {/* SEARCH AND FILTER */}
        <div className="admin-users-filters">

          <div className="admin-search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />
          </div>

          <select
            className="admin-status-filter"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value)
            }
          >
            <option value="All">All Users</option>
            <option value="user">Customers</option>
            <option value="admin">Administrators</option>
          </select>

        </div>

        {/* USERS TABLE */}
        <div className="admin-users-table-card">

          <div className="admin-table-heading">
            <div>
              <h2>Registered Users</h2>

              <p>
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="admin-empty-state">
              <User size={55} />

              <h2>No Users Found</h2>

              <p>
                No users match your current search or filter.
              </p>
            </div>
          ) : (
            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>User ID</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>

                      {/* USER */}
                      <td>
                        <div className="admin-user-info">

                          <div className="admin-user-avatar">
                            {user.name
                              ? user.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "U"}
                          </div>

                          <div>
                            <strong>
                              {user.name || "Unnamed User"}
                            </strong>

                            <span>
                              {user.phone ||
                                "No phone number"}
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* EMAIL */}
                      <td>
                        <div className="admin-user-email">
                          <Mail size={16} />

                          <span>
                            {user.email || "No email"}
                          </span>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td>
                        {user.role === "admin" ? (
                          <span className="admin-user-role admin-role">
                            <ShieldCheck size={15} />
                            Administrator
                          </span>
                        ) : (
                          <span className="admin-user-role customer-role">
                            <User size={15} />
                            Customer
                          </span>
                        )}
                      </td>

                      {/* DATE */}
                      <td>
                        <div className="admin-user-date">
                          <CalendarDays size={15} />

                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      {/* ID */}
                      <td>
                        <span className="admin-user-id">
                          #{user.id}
                        </span>
                      </td>

                      {/* DELETE */}
                      <td>
                        <button
                          type="button"
                          className="admin-delete-user-button"
                          disabled={user.role === "admin"}
                          title={
                            user.role === "admin"
                              ? "Admin account cannot be deleted"
                              : "Delete user"
                          }
                          onClick={() =>
                            handleDelete(user)
                          }
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdminUsers;