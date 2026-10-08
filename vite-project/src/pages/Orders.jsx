import { useEffect } from "react";
import { Calendar, Eye, Package, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ordersApi } from "../services/api";
import {
  setOrders,
  setOrderLoading,
  setOrderError,
} from "../redux/orderSlice";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const dispatch = useDispatch();

  const { user } = useAuth();

  const {
    orders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        dispatch(setOrders([]));
        return;
      }

      try {
        dispatch(setOrderLoading(true));
        dispatch(setOrderError(null));

        const response = await ordersApi.getOrders();

        const allOrders = Array.isArray(response.data)
          ? response.data
          : [];

        const userOrders = allOrders.filter((order) => {
          if (order.userId !== undefined) {
            return String(order.userId) === String(user.id);
          }

          if (order.userEmail !== undefined) {
            return (
              order.userEmail.toLowerCase() ===
              user.email.toLowerCase()
            );
          }

          if (order.email !== undefined) {
            return (
              order.email.toLowerCase() ===
              user.email.toLowerCase()
            );
          }

          return false;
        });

        const sortedOrders = [...userOrders].sort((a, b) => {
          const dateA = new Date(
            a.createdAt || a.orderDate || 0
          ).getTime();

          const dateB = new Date(
            b.createdAt || b.orderDate || 0
          ).getTime();

          return dateB - dateA;
        });

        dispatch(setOrders(sortedOrders));
      } catch (err) {
        console.error("Error loading orders:", err);

        dispatch(
          setOrderError(
            err.response?.data?.message ||
              "Unable to load your orders. Please make sure JSON Server is running."
          )
        );
      }
    };

    loadOrders();
  }, [dispatch, user]);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

    const items = getOrderItems(order);

    return items.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;

      return total + price * quantity;
    }, 0);
  };

  const getItemCount = (order) => {
    const items = getOrderItems(order);

    return items.reduce((total, item) => {
      return total + (Number(item.quantity) || 1);
    }, 0);
  };

  const getPaymentMethod = (order) => {
    return (
      order.paymentMethod ||
      order.payment?.method ||
      "Not specified"
    );
  };

  const getStatus = (order) => {
    return order.status || "Pending";
  };

  const getStatusClass = (status) => {
    const normalizedStatus = String(status)
      .toLowerCase()
      .replace(/\s+/g, "-");

    return `order-status order-status-${normalizedStatus}`;
  };

  if (loading) {
    return (
      <div className="loading-page">
        <Package size={42} />

        <h2>Loading Your Orders...</h2>

        <p>
          Please wait while we retrieve your order
          history.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Unable to Load Orders</h2>

        <p>{error}</p>

        <Link
          to="/products"
          className="primary-button"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="orders-page">
        <div className="empty-orders-page">
          <div className="empty-orders-icon">
            <ShoppingBag size={48} />
          </div>

          <h1>No Orders Yet</h1>

          <p>
            You haven't placed any orders yet. Start
            shopping for quality construction materials.
          </p>

          <Link
            to="/products"
            className="primary-button"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <div className="orders-page-header">
        <div>
          <p className="orders-page-label">
            PURCHASE HISTORY
          </p>

          <h1>My Orders</h1>

          <p>
            View and track all your construction material
            orders.
          </p>
        </div>

        <div className="orders-count">
          <Package size={19} />

          <span>
            {orders.length} order
            {orders.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="orders-list">
        {orders.map((order) => {
          const totalAmount = getOrderTotal(order);
          const itemCount = getItemCount(order);
          const paymentMethod = getPaymentMethod(order);
          const status = getStatus(order);

          const orderDate =
            order.createdAt ||
            order.orderDate ||
            order.date;

          return (
            <article
              className="order-card"
              key={order.id}
            >
              <div className="order-card-header">
                <div className="order-card-number">
                  <span>Order ID</span>

                  <strong>
                    #{order.id}
                  </strong>
                </div>

                <span
                  className={getStatusClass(status)}
                >
                  {status}
                </span>
              </div>

              <div className="order-card-details">
                <div className="order-info-item">
                  <Calendar size={18} />

                  <div>
                    <span>Order Date</span>

                    <strong>
                      {formatDate(orderDate)}
                    </strong>
                  </div>
                </div>

                <div className="order-info-item">
                  <Package size={18} />

                  <div>
                    <span>Items</span>

                    <strong>
                      {itemCount} item
                      {itemCount !== 1 ? "s" : ""}
                    </strong>
                  </div>
                </div>

                <div className="order-info-item">
                  <ShoppingBag size={18} />

                  <div>
                    <span>Payment</span>

                    <strong>
                      {paymentMethod}
                    </strong>
                  </div>
                </div>

                <div className="order-info-item order-total-item">
                  <div>
                    <span>Total Amount</span>

                    <strong>
                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="order-card-footer">
                <span>
                  Thank you for shopping with Construction
                  Material Workplace.
                </span>

                <Link
                  to={`/orders/${order.id}`}
                  className="order-view-button"
                >
                  <Eye size={17} />
                  View Order
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Orders;