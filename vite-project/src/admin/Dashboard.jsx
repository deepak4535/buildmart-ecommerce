import { useEffect, useState } from "react";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  FolderTree,
  IndianRupee,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  productsApi,
  ordersApi,
  usersApi,
  categoriesApi,
} from "../services/api";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          productsResponse,
          ordersResponse,
          usersResponse,
          categoriesResponse,
        ] = await Promise.all([
          productsApi.getProducts(),
          ordersApi.getOrders(),
          usersApi.getUsers(),
          categoriesApi.getCategories(),
        ]);

        setProducts(
          Array.isArray(productsResponse.data)
            ? productsResponse.data
            : []
        );

        setOrders(
          Array.isArray(ordersResponse.data)
            ? ordersResponse.data
            : []
        );

        setUsers(
          Array.isArray(usersResponse.data)
            ? usersResponse.data
            : []
        );

        setCategories(
          Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : []
        );
      } catch (err) {
        console.error(
          "Error loading admin dashboard:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard information. Please make sure JSON Server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getOrderTotal = (order) => {
    if (order.totalAmount !== undefined) {
      return Number(order.totalAmount) || 0;
    }

    if (order.total !== undefined) {
      return Number(order.total) || 0;
    }

    if (order.amount !== undefined) {
      return Number(order.amount) || 0;
    }

    const items = Array.isArray(order.items)
      ? order.items
      : Array.isArray(order.products)
      ? order.products
      : [];

    return items.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;

      return total + price * quantity;
    }, 0);
  };

  const totalSales = orders.reduce(
    (total, order) =>
      total + getOrderTotal(order),
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      String(order.status || "Pending").toLowerCase() ===
      "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      String(order.status || "").toLowerCase() ===
        "processing" ||
      String(order.status || "").toLowerCase() ===
        "confirmed"
  ).length;

  const completedOrders = orders.filter((order) => {
    const status = String(
      order.status || ""
    ).toLowerCase();

    return (
      status === "delivered" ||
      status === "completed"
    );
  }).length;

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.orderDate || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.orderDate || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="admin-loading-page">
        <Boxes size={42} />

        <h2>Loading Admin Dashboard...</h2>

        <p>
          Please wait while we load your store
          information.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-page">
        <h2>Unable to Load Dashboard</h2>

        <p>{error}</p>

        <Link
          to="/"
          className="admin-primary-button"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <section className="admin-dashboard-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-label">
            ADMINISTRATION
          </p>

          <h1>Dashboard</h1>

          <p>
            Manage your Construction Material Workplace
            store from one place.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="admin-primary-button"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Package size={23} />
          </div>

          <div>
            <span>Total Products</span>

            <strong>{products.length}</strong>

            <small>
              Products in store
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <ClipboardList size={23} />
          </div>

          <div>
            <span>Total Orders</span>

            <strong>{orders.length}</strong>

            <small>
              Customer orders
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Users size={23} />
          </div>

          <div>
            <span>Total Users</span>

            <strong>{users.length}</strong>

            <small>
              Registered accounts
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FolderTree size={23} />
          </div>

          <div>
            <span>Categories</span>

            <strong>{categories.length}</strong>

            <small>
              Product categories
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <IndianRupee size={23} />
          </div>

          <div>
            <span>Total Sales</span>

            <strong>
              ₹{totalSales.toLocaleString("en-IN")}
            </strong>

            <small>
              From all orders
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <TrendingUp size={23} />
          </div>

          <div>
            <span>Completed Orders</span>

            <strong>{completedOrders}</strong>

            <small>
              Delivered / completed
            </small>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-card">
          <div className="admin-dashboard-card-header">
            <div>
              <h2>Order Status</h2>

              <p>
                Current order overview
              </p>
            </div>

            <ClipboardList size={21} />
          </div>

          <div className="admin-order-status-list">
            <div className="admin-order-status-item">
              <span className="admin-status-dot pending" />

              <div>
                <span>Pending</span>

                <strong>
                  {pendingOrders}
                </strong>
              </div>
            </div>

            <div className="admin-order-status-item">
              <span className="admin-status-dot processing" />

              <div>
                <span>Processing</span>

                <strong>
                  {processingOrders}
                </strong>
              </div>
            </div>

            <div className="admin-order-status-item">
              <span className="admin-status-dot completed" />

              <div>
                <span>Completed</span>

                <strong>
                  {completedOrders}
                </strong>
              </div>
            </div>
          </div>

          <Link
            to="/admin/orders"
            className="admin-card-link"
          >
            Manage Orders
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <div className="admin-dashboard-card-header">
            <div>
              <h2>Quick Actions</h2>

              <p>
                Common administration tasks
              </p>
            </div>

            <ShoppingCart size={21} />
          </div>

          <div className="admin-quick-actions">
            <Link
              to="/admin/products"
              className="admin-quick-action"
            >
              <Package size={19} />

              <span>
                Manage Products
              </span>

              <ArrowRight size={16} />
            </Link>

            <Link
              to="/admin/products/add"
              className="admin-quick-action"
            >
              <Plus size={19} />

              <span>
                Add New Product
              </span>

              <ArrowRight size={16} />
            </Link>

            <Link
              to="/admin/categories"
              className="admin-quick-action"
            >
              <FolderTree size={19} />

              <span>
                Manage Categories
              </span>

              <ArrowRight size={16} />
            </Link>

            <Link
              to="/admin/orders"
              className="admin-quick-action"
            >
              <ClipboardList size={19} />

              <span>
                Manage Orders
              </span>

              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-card admin-recent-orders-card">
        <div className="admin-dashboard-card-header">
          <div>
            <h2>Recent Orders</h2>

            <p>
              Latest customer orders
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="admin-card-link"
          >
            View All
            <ArrowRight size={17} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="admin-empty-state">
            <ClipboardList size={36} />

            <h3>No Orders Yet</h3>

            <p>
              Customer orders will appear here after
              the first purchase.
            </p>
          </div>
        ) : (
          <div className="admin-recent-orders-table-wrapper">
            <table className="admin-recent-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => {
                  const status =
                    order.status || "Pending";

                  const customer =
                    order.customerName ||
                    order.name ||
                    order.userEmail ||
                    order.email ||
                    "Customer";

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong>
                          #{order.id}
                        </strong>
                      </td>

                      <td>{customer}</td>

                      <td>
                        {formatDate(
                          order.createdAt ||
                            order.orderDate ||
                            order.date
                        )}
                      </td>

                      <td>
                        ₹
                        {getOrderTotal(
                          order
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <span className="admin-table-status">
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-dashboard-footer-links">
        <Link to="/products">
          <Package size={18} />
          View Store
        </Link>

        <Link to="/admin/products">
          <Boxes size={18} />
          Products
        </Link>

        <Link to="/admin/orders">
          <ClipboardList size={18} />
          Orders
        </Link>
      </div>
    </section>
  );
}

export default Dashboard;