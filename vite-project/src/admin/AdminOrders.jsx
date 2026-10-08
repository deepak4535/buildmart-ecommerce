import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ClipboardList,
  Eye,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { ordersApi } from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("All");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadOrders = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await ordersApi.getOrders();

      setOrders(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Error loading admin orders:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load orders. Please make sure JSON Server is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
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
      const quantity =
        Number(item.quantity) || 1;

      return total + price * quantity;
    }, 0);
  };

  const getOrderItems = (order) => {
    if (Array.isArray(order.items)) {
      return order.items;
    }

    if (Array.isArray(order.products)) {
      return order.products;
    }

    return [];
  };

  const getCustomerName = (order) => {
    return (
      order.customerName ||
      order.name ||
      order.userName ||
      order.customer?.name ||
      "Customer"
    );
  };

  const getCustomerEmail = (order) => {
    return (
      order.userEmail ||
      order.email ||
      order.customer?.email ||
      "Email not available"
    );
  };

  const getOrderDate = (order) => {
    return (
      order.createdAt ||
      order.orderDate ||
      order.date ||
      ""
    );
  };

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

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const normalizeStatus = (status) => {
    return String(status || "Pending")
      .trim()
      .toLowerCase();
  };

  const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);

    if (
      normalized === "delivered" ||
      normalized === "completed"
    ) {
      return "completed";
    }

    if (
      normalized === "processing" ||
      normalized === "confirmed" ||
      normalized === "shipped"
    ) {
      return "processing";
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return "cancelled";
    }

    return "pending";
  };

  const filteredOrders = useMemo(() => {
    const search =
      searchText.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = String(
        order.id || ""
      ).toLowerCase();

      const customerName =
        getCustomerName(order).toLowerCase();

      const customerEmail =
        getCustomerEmail(order).toLowerCase();

      const status = String(
        order.status || "Pending"
      ).toLowerCase();

      const matchesSearch =
        !search ||
        orderId.includes(search) ||
        customerName.includes(search) ||
        customerEmail.includes(search) ||
        status.includes(search);

      const matchesStatus =
        selectedStatus === "All" ||
        normalizeStatus(order.status) ===
          normalizeStatus(selectedStatus);

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [
    orders,
    searchText,
    selectedStatus,
  ]);

  const statusCounts = useMemo(() => {
    return {
      all: orders.length,

      pending: orders.filter(
        (order) =>
          normalizeStatus(order.status) ===
          "pending"
      ).length,

      processing: orders.filter((order) => {
        const status =
          normalizeStatus(order.status);

        return (
          status === "processing" ||
          status === "confirmed" ||
          status === "shipped"
        );
      }).length,

      completed: orders.filter((order) => {
        const status =
          normalizeStatus(order.status);

        return (
          status === "delivered" ||
          status === "completed"
        );
      }).length,

      cancelled: orders.filter((order) => {
        const status =
          normalizeStatus(order.status);

        return (
          status === "cancelled" ||
          status === "canceled"
        );
      }).length,
    };
  }, [orders]);

  const handleStatusChange = async (
    order,
    newStatus
  ) => {
    try {
      setError("");
      setSuccess("");

      const updatedOrder = {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      const response =
        await ordersApi.updateOrder(
          order.id,
          updatedOrder
        );

      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          item.id === order.id
            ? response.data
            : item
        )
      );

      setSelectedOrder((currentOrder) =>
        currentOrder &&
        currentOrder.id === order.id
          ? response.data
          : currentOrder
      );

      setSuccess(
        `Order #${order.id} status updated to ${newStatus}.`
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Error updating order status:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update the order status."
      );
    }
  };

  const handleDelete = async (order) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Order #${order.id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(order.id);
      setError("");
      setSuccess("");

      await ordersApi.deleteOrder(order.id);

      setOrders((currentOrders) =>
        currentOrders.filter(
          (item) => item.id !== order.id
        )
      );

      if (
        selectedOrder &&
        selectedOrder.id === order.id
      ) {
        setSelectedOrder(null);
      }

      setSuccess(
        `Order #${order.id} was deleted successfully.`
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Error deleting order:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete the order."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-page">
        <ClipboardList size={42} />

        <h2>Loading Orders...</h2>

        <p>
          Please wait while we load customer orders.
        </p>
      </div>
    );
  }

  return (
    <section className="admin-orders-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-label">
            ORDER MANAGEMENT
          </p>

          <h1>Manage Orders</h1>

          <p>
            View customer orders and manage their
            current status.
          </p>
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={() => loadOrders(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={18}
            className={
              refreshing ? "admin-spin" : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh Orders"}
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          <AlertCircle size={20} />

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success">
          <span>✓</span>

          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Close success message"
          >
            ×
          </button>
        </div>
      )}

      <div className="admin-order-summary-grid">
        <div className="admin-order-summary-card">
          <span>Total Orders</span>
          <strong>{statusCounts.all}</strong>
        </div>

        <div className="admin-order-summary-card">
          <span>Pending</span>
          <strong>{statusCounts.pending}</strong>
        </div>

        <div className="admin-order-summary-card">
          <span>Processing</span>
          <strong>
            {statusCounts.processing}
          </strong>
        </div>

        <div className="admin-order-summary-card">
          <span>Completed</span>
          <strong>
            {statusCounts.completed}
          </strong>
        </div>

        <div className="admin-order-summary-card">
          <span>Cancelled</span>
          <strong>
            {statusCounts.cancelled}
          </strong>
        </div>
      </div>

      <div className="admin-orders-toolbar">
        <div className="admin-search-wrapper">
          <Search size={19} />

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="Search order ID, customer or email..."
          />
        </div>

        <div className="admin-filter-wrapper">
          <label htmlFor="order-status">
            Status
          </label>

          <select
            id="order-status"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(
                event.target.value
              )
            }
          >
            <option value="All">
              All Orders
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="admin-empty-state">
          <ClipboardList size={52} />

          <h2>No Orders Found</h2>

          <p>
            {orders.length === 0
              ? "Customer orders will appear here after a purchase."
              : "No orders match your current search or status filter."}
          </p>

          {orders.length > 0 && (
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => {
                setSearchText("");
                setSelectedStatus("All");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="admin-orders-table-card">
          <div className="admin-products-table-header">
            <div>
              <h2>Customer Orders</h2>

              <p>
                {filteredOrders.length} order
                {filteredOrders.length !== 1
                  ? "s"
                  : ""}{" "}
                displayed
              </p>
            </div>
          </div>

          <div className="admin-orders-table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const items =
                    getOrderItems(order);

                  const status =
                    order.status || "Pending";

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong>
                          #{order.id}
                        </strong>
                      </td>

                      <td>
                        <div className="admin-customer-info">
                          <strong>
                            {getCustomerName(
                              order
                            )}
                          </strong>

                          <small>
                            {getCustomerEmail(
                              order
                            )}
                          </small>
                        </div>
                      </td>

                      <td>
                        {formatDate(
                          getOrderDate(order)
                        )}
                      </td>

                      <td>
                        {items.length}
                      </td>

                      <td>
                        <strong>
                          ₹
                          {getOrderTotal(
                            order
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`admin-order-status-badge ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="admin-product-actions">
                          <button
                            type="button"
                            className="admin-icon-button view"
                            title="View Order"
                            aria-label={`View order ${order.id}`}
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            className="admin-icon-button delete"
                            title="Delete Order"
                            aria-label={`Delete order ${order.id}`}
                            onClick={() =>
                              handleDelete(order)
                            }
                            disabled={
                              deletingId ===
                              order.id
                            }
                          >
                            {deletingId ===
                            order.id ? (
                              <RefreshCw
                                size={17}
                                className="admin-spin"
                              />
                            ) : (
                              <Trash2
                                size={17}
                              />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          className="admin-order-modal-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >
          <div
            className="admin-order-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-order-modal-header">
              <div>
                <p className="admin-page-label">
                  ORDER DETAILS
                </p>

                <h2>
                  Order #{selectedOrder.id}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setSelectedOrder(null)
                }
                aria-label="Close order details"
              >
                <X size={22} />
              </button>
            </div>

            <div className="admin-order-modal-content">
              <div className="admin-order-detail-grid">
                <div>
                  <span>Customer</span>

                  <strong>
                    {getCustomerName(
                      selectedOrder
                    )}
                  </strong>
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {getCustomerEmail(
                      selectedOrder
                    )}
                  </strong>
                </div>

                <div>
                  <span>Order Date</span>

                  <strong>
                    {formatDateTime(
                      getOrderDate(
                        selectedOrder
                      )
                    )}
                  </strong>
                </div>

                <div>
                  <span>Total Amount</span>

                  <strong>
                    ₹
                    {getOrderTotal(
                      selectedOrder
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              </div>

              <div className="admin-order-status-section">
                <label htmlFor="modal-order-status">
                  Update Order Status
                </label>

                <select
                  id="modal-order-status"
                  value={
                    selectedOrder.status ||
                    "Pending"
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      selectedOrder,
                      event.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              <div className="admin-order-items-section">
                <h3>Order Items</h3>

                {getOrderItems(
                  selectedOrder
                ).length === 0 ? (
                  <p>
                    No item details are available
                    for this order.
                  </p>
                ) : (
                  <div className="admin-order-items-list">
                    {getOrderItems(
                      selectedOrder
                    ).map(
                      (item, index) => {
                        const itemName =
                          item.name ||
                          item.title ||
                          "Product";

                        const itemPrice =
                          Number(
                            item.price
                          ) || 0;

                        const quantity =
                          Number(
                            item.quantity
                          ) || 1;

                        return (
                          <div
                            className="admin-order-item"
                            key={
                              item.id ||
                              `${selectedOrder.id}-${index}`
                            }
                          >
                            <div className="admin-order-item-image">
                              {item.image ? (
                                <img
                                  src={
                                    item.image
                                  }
                                  alt={
                                    itemName
                                  }
                                />
                              ) : (
                                <Package
                                  size={25}
                                />
                              )}
                            </div>

                            <div className="admin-order-item-info">
                              <strong>
                                {itemName}
                              </strong>

                              <small>
                                Quantity:{" "}
                                {quantity}
                              </small>
                            </div>

                            <strong>
                              ₹
                              {(
                                itemPrice *
                                quantity
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>

              <div className="admin-order-modal-footer">
                <strong>
                  Order Total
                </strong>

                <strong>
                  ₹
                  {getOrderTotal(
                    selectedOrder
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminOrders;