import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";

import { clearCart } from "../redux/CartSlice.jsx";
import { ordersApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useAuth();

  const {
    items,
    totalQuantity,
    totalAmount,
  } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });

  const [errors, setErrors] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));

    setOrderError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "PIN code is required.";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode =
        "Enter a valid 6-digit PIN code.";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod =
        "Please select a payment method.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (items.length === 0) {
      setOrderError(
        "Your cart is empty. Please add products before placing an order."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setPlacingOrder(true);
    setOrderError("");

    try {
      const orderData = {
        userId: user?.id || null,

        customer: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },

        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },

        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          category: item.category || "",
          price: Number(item.price || 0),
          quantity: item.quantity,
          image: item.image || "",
        })),

        totalQuantity,

        subtotal: Number(totalAmount || 0),

        deliveryCharge: 0,

        totalAmount: Number(totalAmount || 0),

        paymentMethod: formData.paymentMethod,

        paymentStatus:
          formData.paymentMethod === "Cash on Delivery"
            ? "Pending"
            : "Pending",

        orderStatus: "Placed",

        orderDate: new Date().toISOString(),
      };

      const response = await ordersApi.createOrder(
        orderData
      );

      if (!response.data) {
        throw new Error(
          "Order could not be created."
        );
      }

      dispatch(clearCart());

      navigate("/orders", {
        replace: true,
        state: {
          orderPlaced: true,
          order: response.data,
        },
      });
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      setOrderError(
        error.response?.data?.message ||
          error.message ||
          "Unable to place the order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">

        <div className="checkout-empty-state">

          <div className="checkout-empty-icon">
            <ShoppingBag size={50} />
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Add construction materials to your
            cart before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="checkout-back-products"
          >
            <ArrowLeft size={18} />
            Browse Products
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="checkout-page-header">

        <Link
          to="/cart"
          className="checkout-back-link"
        >
          <ArrowLeft size={17} />
          Back to Cart
        </Link>

        <h1>
          Checkout
        </h1>

        <p>
          Enter your delivery details and
          select your payment method.
        </p>

      </div>


      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {orderError && (
        <div className="checkout-error-message">
          {orderError}
        </div>
      )}


      <form
        className="checkout-layout"
        onSubmit={handlePlaceOrder}
      >

        {/* =========================
            CUSTOMER DETAILS
        ========================= */}

        <div className="checkout-main">

          <section className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-card-icon">
                <User size={20} />
              </div>

              <div>
                <h2>
                  Customer Information
                </h2>

                <p>
                  Enter your contact details.
                </p>
              </div>

            </div>


            <div className="checkout-form-grid">

              <div className="checkout-form-group">

                <label htmlFor="fullName">
                  Full Name
                </label>

                <div className="checkout-input-wrapper">

                  <User size={17} />

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />

                </div>

                {errors.fullName && (
                  <span className="checkout-field-error">
                    {errors.fullName}
                  </span>
                )}

              </div>


              <div className="checkout-form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />

                {errors.email && (
                  <span className="checkout-field-error">
                    {errors.email}
                  </span>
                )}

              </div>


              <div className="checkout-form-group checkout-full-width">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="checkout-input-wrapper">

                  <Phone size={17} />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />

                </div>

                {errors.phone && (
                  <span className="checkout-field-error">
                    {errors.phone}
                  </span>
                )}

              </div>

            </div>

          </section>


          {/* =========================
              SHIPPING ADDRESS
          ========================= */}

          <section className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-card-icon">
                <MapPin size={20} />
              </div>

              <div>
                <h2>
                  Delivery Address
                </h2>

                <p>
                  Where should we deliver your order?
                </p>
              </div>

            </div>


            <div className="checkout-form-grid">

              <div className="checkout-form-group checkout-full-width">

                <label htmlFor="address">
                  Complete Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House/Flat No., Street, Area"
                  rows="4"
                />

                {errors.address && (
                  <span className="checkout-field-error">
                    {errors.address}
                  </span>
                )}

              </div>


              <div className="checkout-form-group">

                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />

                {errors.city && (
                  <span className="checkout-field-error">
                    {errors.city}
                  </span>
                )}

              </div>


              <div className="checkout-form-group">

                <label htmlFor="state">
                  State
                </label>

                <input
                  id="state"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />

                {errors.state && (
                  <span className="checkout-field-error">
                    {errors.state}
                  </span>
                )}

              </div>


              <div className="checkout-form-group">

                <label htmlFor="pincode">
                  PIN Code
                </label>

                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  maxLength="6"
                />

                {errors.pincode && (
                  <span className="checkout-field-error">
                    {errors.pincode}
                  </span>
                )}

              </div>

            </div>

          </section>


          {/* =========================
              PAYMENT METHOD
          ========================= */}

          <section className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-card-icon">
                <CreditCard size={20} />
              </div>

              <div>
                <h2>
                  Payment Method
                </h2>

                <p>
                  Select how you want to pay.
                </p>
              </div>

            </div>


            <div className="payment-methods">

              <label
                className={`payment-option ${
                  formData.paymentMethod ===
                  "Cash on Delivery"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={
                    formData.paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={handleChange}
                />

                <div>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order is delivered.
                  </span>
                </div>

              </label>


              <label
                className={`payment-option ${
                  formData.paymentMethod ===
                  "UPI"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={
                    formData.paymentMethod ===
                    "UPI"
                  }
                  onChange={handleChange}
                />

                <div>
                  <strong>
                    UPI
                  </strong>

                  <span>
                    Pay using UPI.
                  </span>
                </div>

              </label>


              <label
                className={`payment-option ${
                  formData.paymentMethod ===
                  "Card"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={
                    formData.paymentMethod ===
                    "Card"
                  }
                  onChange={handleChange}
                />

                <div>
                  <strong>
                    Credit / Debit Card
                  </strong>

                  <span>
                    Pay securely using your card.
                  </span>
                </div>

              </label>

            </div>

            {errors.paymentMethod && (
              <span className="checkout-field-error">
                {errors.paymentMethod}
              </span>
            )}

          </section>

        </div>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="checkout-summary">

          <div className="checkout-summary-header">
            <h2>
              Order Summary
            </h2>
          </div>


          <div className="checkout-summary-items">

            {items.map((item) => (

              <div
                className="checkout-summary-item"
                key={item.id}
              >

                <div className="checkout-summary-item-info">

                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    Qty: {item.quantity}
                  </span>

                </div>

                <strong>
                  ₹
                  {(
                    Number(item.price || 0) *
                    item.quantity
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            ))}

          </div>


          <div className="checkout-summary-divider" />


          <div className="checkout-summary-row">

            <span>
              Total Items
            </span>

            <strong>
              {totalQuantity}
            </strong>

          </div>


          <div className="checkout-summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {Number(
                totalAmount || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>


          <div className="checkout-summary-row">

            <span>
              Delivery
            </span>

            <strong className="checkout-free">
              FREE
            </strong>

          </div>


          <div className="checkout-summary-divider" />


          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {Number(
                totalAmount || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>


          <button
            type="submit"
            className="place-order-button"
            disabled={placingOrder}
          >

            {placingOrder ? (
              <>
                <LoaderCircle
                  size={19}
                  className="checkout-spinner"
                />

                Placing Order...
              </>
            ) : (
              <>
                <CheckCircle size={19} />

                Place Order
              </>
            )}

          </button>


          <div className="checkout-secure-note">

            🔒 Secure order processing

          </div>

        </aside>

      </form>

    </div>
  );
}

export default Checkout;