import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ordersApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await ordersApi.getOrderById(id);
        const orderData = response.data;

        if (!orderData) {
          setError("Order not found.");
          return;
        }

        const belongsToUser =
          orderData.userId !== undefined
            ? String(orderData.userId) === String(user?.id)
            : orderData.userEmail !== undefined
            ? orderData.userEmail.toLowerCase() ===
              user?.email?.toLowerCase()
            : orderData.email !== undefined
            ? orderData.email.toLowerCase() ===
              user?.email?.toLowerCase()
            : false;

        if (!belongsToUser) {
          setError(
            "You are not authorized to view this order."
          );
          return;
        }

        setOrder(orderData);
      } catch (err) {
        console.error("Error loading order:", err);

        setError(
          err.response?.status === 404
            ? "The requested order could not be found."
            : "Unable to load order details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrder();
    }
  }, [id, user]);

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
      month: "long",
      year: "numeric",
    });
  };

  const getItems = () => {
    if (Array.isArray(order?.items)) {
      return order.items;
    }

    if (Array.isArray(order?.products)) {
      return order.products;
    }

    return [];
  };

  const getPrice = (item) => {
    return Number(item?.price) || 0;
  };

  const getQuantity = (item) => {
    return Number(item?.quantity) || 1;
  };

  const getSubtotal = () => {
    if (!order) {
      return 0;
    }

    if (order.subtotal !== undefined) {
      return Number(order.subtotal) || 0;
    }

    return getItems().reduce((total, item) => {
      return (
        total +
        getPrice(item) * getQuantity(item)
      );
    }, 0);
  };

  const getShipping = () => {
    if (!order) {
      return 0;
    }

    if (order.shippingCost !== undefined) {
      return Number(order.shippingCost) || 0;
    }

    if (order.shipping !== undefined) {
      return Number(order.shipping) || 0;
    }

    return 0;
  };

  const getTax = () => {
    if (!order) {
      return 0;
    }

    if (order.tax !== undefined) {
      return Number(order.tax) || 0;
    }

    return 0;
  };

  const getTotal = () => {
    if (!order) {
      return 0;
    }

    if (order.totalAmount !== undefined) {
      return Number(order.totalAmount) || 0;
    }

    if (order.total !== undefined) {
      return Number(order.total) || 0;
    }

    if (order.amount !== undefined) {
      return Number(order.amount) || 0;
    }

    return getSubtotal() + getShipping() + getTax();
  };

  const getPaymentMethod = () => {
    if (!order) {
      return "Not specified";
    }

    return (
      order.paymentMethod ||
      order.payment?.method ||
      "Not specified"
    );
  };

  const getStatus = () => {
    return order?.status || "Pending";
  };

  const getStatusClass = () => {
    const normalizedStatus = String(getStatus())
      .toLowerCase()
      .replace(/\s+/g, "-");

    return `order-details-status order-details-status-${normalizedStatus}`;
  };

  const getCustomerName = () => {
    if (!order) {
      return user?.name || "Customer";
    }

    return (
      order.customerName ||
      order.name ||
      order.customer?.name ||
      user?.name ||
      "Customer"
    );
  };

  const getCustomerEmail = () => {
    if (!order) {
      return user?.email || "";
    }

    return (
      order.userEmail ||
      order.email ||
      order.customer?.email ||
      user?.email ||
      ""
    );
  };

  const getAddress = () => {
    if (!order) {
      return null;
    }

    if (order.shippingAddress) {
      return order.shippingAddress;
    }

    if (order.address) {
      return order.address;
    }

    if (order.customer?.address) {
      return order.customer.address;
    }

    return null;
  };

  const address = getAddress();

  if (loading) {
    return (
      <div className="loading-page">
        <Package size={42} />

        <h2>Loading Order Details...</h2>

        <p>
          Please wait while we retrieve your order.
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="error-page">
        <h2>Unable to View Order</h2>

        <p>
          {error || "The requested order does not exist."}
        </p>

        <Link
          to="/orders"
          className="primary-button"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>
      </div>
    );
  }

  const items = getItems();
  const orderDate =
    order.createdAt ||
    order.orderDate ||
    order.date;

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  return (
    <section className="order-details-page">
      <div className="order-details-top">
        <Link
          to="/orders"
          className="back-link"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>
      </div>

      <div className="order-details-header">
        <div>
          <p className="order-details-label">
            ORDER DETAILS
          </p>

          <h1>
            Order #{order.id}
          </h1>

          <p>
            Thank you for your purchase from Construction
            Material Workplace.
          </p>
        </div>

        <div className={getStatusClass()}>
          <CheckCircle size={18} />
          <span>{getStatus()}</span>
        </div>
      </div>

      <div className="order-details-meta">
        <div className="order-details-meta-item">
          <Calendar size={19} />

          <div>
            <span>Order Date</span>

            <strong>
              {formatDate(orderDate)}
            </strong>
          </div>
        </div>

        <div className="order-details-meta-item">
          <CreditCard size={19} />

          <div>
            <span>Payment Method</span>

            <strong>
              {getPaymentMethod()}
            </strong>
          </div>
        </div>

        <div className="order-details-meta-item">
          <Package size={19} />

          <div>
            <span>Products</span>

            <strong>
              {items.length} product
              {items.length !== 1 ? "s" : ""}
            </strong>
          </div>
        </div>
      </div>

      <div className="order-details-layout">
        <div className="order-details-main">
          <div className="order-details-card">
            <div className="order-details-card-header">
              <h2>
                <ShoppingBag size={20} />
                Ordered Products
              </h2>
            </div>

            {items.length === 0 ? (
              <div className="order-empty-items">
                <Package size={38} />

                <p>
                  No product information is available
                  for this order.
                </p>
              </div>
            ) : (
              <div className="order-items-list">
                {items.map((item, index) => {
                  const price = getPrice(item);
                  const quantity = getQuantity(item);
                  const itemTotal =
                    price * quantity;

                  return (
                    <div
                      className="order-item"
                      key={
                        item.id ||
                        `${order.id}-${index}`
                      }
                    >
                      <div className="order-item-image">
                        {item?.image ? (
                          <img
                            src={item.image}
                            alt={
                              item.name ||
                              "Construction material"
                            }
                          />
                        ) : (
                          <span>🏗️</span>
                        )}
                      </div>

                      <div className="order-item-details">
                        <h3>
                          {item?.name ||
                            "Construction Material"}
                        </h3>

                        {item?.category && (
                          <span>
                            {item.category}
                          </span>
                        )}

                        <p>
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}{" "}
                          × {quantity}
                        </p>
                      </div>

                      <strong className="order-item-total">
                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="order-details-card">
            <div className="order-details-card-header">
              <h2>
                <User size={20} />
                Customer Information
              </h2>
            </div>

            <div className="customer-information">
              <div>
                <span>Name</span>
                <strong>
                  {getCustomerName()}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {getCustomerEmail()}
                </strong>
              </div>

              {order.phone && (
                <div>
                  <span>Phone</span>
                  <strong>
                    {order.phone}
                  </strong>
                </div>
              )}
            </div>
          </div>

          <div className="order-details-card">
            <div className="order-details-card-header">
              <h2>
                <MapPin size={20} />
                Delivery Address
              </h2>
            </div>

            {address ? (
              <div className="delivery-address">
                {typeof address === "string" ? (
                  <p>{address}</p>
                ) : (
                  <>
                    {address.fullName && (
                      <strong>
                        {address.fullName}
                      </strong>
                    )}

                    {address.name &&
                      !address.fullName && (
                        <strong>
                          {address.name}
                        </strong>
                      )}

                    {address.address && (
                      <p>{address.address}</p>
                    )}

                    {address.street && (
                      <p>{address.street}</p>
                    )}

                    <p>
                      {[
                        address.city,
                        address.state,
                        address.pincode ||
                          address.zipCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    {address.phone && (
                      <p>
                        Phone: {address.phone}
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="delivery-address">
                <p>
                  Delivery address information is not
                  available for this order.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="order-details-sidebar">
          <div className="order-summary-card">
            <h2>Order Summary</h2>

            <div className="order-summary-row">
              <span>Subtotal</span>

              <strong>
                ₹
                {subtotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="order-summary-row">
              <span>Shipping</span>

              <strong>
                {shipping === 0
                  ? "Free"
                  : `₹${shipping.toLocaleString(
                      "en-IN"
                    )}`}
              </strong>
            </div>

            {tax > 0 && (
              <div className="order-summary-row">
                <span>Tax</span>

                <strong>
                  ₹
                  {tax.toLocaleString("en-IN")}
                </strong>
              </div>
            )}

            <div className="order-summary-divider" />

            <div className="order-summary-total">
              <span>Total</span>

              <strong>
                ₹
                {total.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="order-payment-info">
              <CreditCard size={18} />

              <div>
                <span>Payment</span>

                <strong>
                  {getPaymentMethod()}
                </strong>
              </div>
            </div>
          </div>

          <Link
            to="/products"
            className="continue-shopping-button"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default OrderDetails;