import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../redux/CartSlice.jsx";

import { addToWishlist } from "../redux/wishlistSlice.js";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items,
    totalQuantity,
    totalAmount,
  } = useSelector((state) => state.cart);

  const handleIncrease = (item) => {
    dispatch(
      updateQuantity({
        id: item.id,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      return;
    }

    dispatch(
      updateQuantity({
        id: item.id,
        quantity: item.quantity - 1,
      })
    );
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleMoveToWishlist = (item) => {
    dispatch(addToWishlist(item));
    dispatch(removeFromCart(item.id));

    window.alert(
      "Product moved to your wishlist."
    );
  };

  const handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all products from your cart?"
    );

    if (!confirmed) {
      return;
    }

    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">

        <div className="cart-empty-state">

          <div className="cart-empty-icon">
            <ShoppingCart size={55} />
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            You haven't added any construction
            materials to your cart yet.
          </p>

          <Link
            to="/products"
            className="cart-shop-button"
          >
            <ShoppingBag size={19} />
            Browse Products
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="cart-page-header">

        <div>

          <Link
            to="/products"
            className="cart-back-link"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

          <h1>
            Shopping Cart
          </h1>

          <p>
            Review your construction materials
            before checkout.
          </p>

        </div>

        <div className="cart-header-count">

          <ShoppingCart size={20} />

          <span>
            {totalQuantity}{" "}
            {totalQuantity === 1
              ? "Item"
              : "Items"}
          </span>

        </div>

      </div>


      {/* =========================
          CART CONTENT
      ========================= */}

      <div className="cart-layout">

        {/* =========================
            CART ITEMS
        ========================= */}

        <section className="cart-items-section">

          <div className="cart-section-header">

            <h2>
              Cart Items
            </h2>

            <button
              type="button"
              className="cart-clear-button"
              onClick={handleClearCart}
            >
              <Trash2 size={17} />
              Clear Cart
            </button>

          </div>


          <div className="cart-items-list">

            {items.map((item) => (

              <div
                className="cart-item-card"
                key={item.id}
              >

                {/* IMAGE */}

                <div className="cart-item-image-container">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  ) : (
                    <div className="cart-item-image-placeholder">
                      <PackageIcon />
                    </div>
                  )}

                </div>


                {/* DETAILS */}

                <div className="cart-item-details">

                  <Link
                    to={`/product/${item.id}`}
                    className="cart-item-name"
                  >
                    {item.name}
                  </Link>

                  <p className="cart-item-category">
                    {item.category}
                  </p>

                  {item.brand && (
                    <p className="cart-item-brand">
                      Brand: {item.brand}
                    </p>
                  )}

                  <p className="cart-item-unit">
                    Price per {item.unit || "piece"}:
                    {" "}
                    <strong>
                      ₹
                      {Number(
                        item.price || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </p>

                </div>


                {/* QUANTITY */}

                <div className="cart-item-quantity">

                  <span>
                    Quantity
                  </span>

                  <div className="cart-quantity-controls">

                    <button
                      type="button"
                      onClick={() =>
                        handleDecrease(item)
                      }
                      disabled={
                        item.quantity <= 1
                      }
                      title="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <strong>
                      {item.quantity}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        handleIncrease(item)
                      }
                      title="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                </div>


                {/* TOTAL */}

                <div className="cart-item-price">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {(
                      Number(item.price || 0) *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>


                {/* ACTIONS */}

                <div className="cart-item-actions">

                  <button
                    type="button"
                    className="cart-wishlist-button"
                    onClick={() =>
                      handleMoveToWishlist(item)
                    }
                    title="Move to Wishlist"
                  >
                    <Heart size={18} />
                  </button>

                  <button
                    type="button"
                    className="cart-remove-button"
                    onClick={() =>
                      handleRemove(item.id)
                    }
                    title="Remove from Cart"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="cart-summary">

          <div className="cart-summary-header">

            <h2>
              Order Summary
            </h2>

          </div>


          <div className="cart-summary-row">

            <span>
              Items
            </span>

            <strong>
              {totalQuantity}
            </strong>

          </div>


          <div className="cart-summary-row">

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


          <div className="cart-summary-row">

            <span>
              Delivery
            </span>

            <strong className="cart-free-delivery">
              FREE
            </strong>

          </div>


          <div className="cart-summary-divider" />


          <div className="cart-summary-total">

            <span>
              Total Amount
            </span>

            <strong>
              ₹
              {Number(
                totalAmount || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>


          <button
            type="button"
            className="cart-checkout-button"
            onClick={handleCheckout}
          >
            Proceed to Checkout
            <ArrowRight size={19} />
          </button>


          <Link
            to="/products"
            className="cart-continue-button"
          >
            Continue Shopping
          </Link>


          <div className="cart-security-note">

            <span>
              🔒
            </span>

            <p>
              Secure checkout with protected
              order processing.
            </p>

          </div>

        </aside>

      </div>

    </div>
  );
}


/* =========================
   IMAGE PLACEHOLDER ICON
========================= */

function PackageIcon() {
  return (
    <ShoppingBag
      size={40}
    />
  );
}

export default Cart;