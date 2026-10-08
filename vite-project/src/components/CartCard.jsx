import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";

import {
  removeFromCart,
  updateQuantity,
} from "../redux/CartSlice";

function CartCard({ item }) {
  const dispatch = useDispatch();

  const price = Number(item?.price) || 0;
  const quantity = Number(item?.quantity) || 1;

  const handleDecrease = () => {
    if (quantity > 1) {
      dispatch(
        updateQuantity({
          id: item.id,
          quantity: quantity - 1,
        })
      );
    }
  };

  const handleIncrease = () => {
    dispatch(
      updateQuantity({
        id: item.id,
        quantity: quantity + 1,
      })
    );
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  const itemTotal = price * quantity;

  return (
    <article className="cart-card">
      <div className="cart-card-image-wrapper">
        {item?.image ? (
          <img
            src={item.image}
            alt={item?.name || "Construction material"}
            className="cart-card-image"
          />
        ) : (
          <div className="cart-card-image-placeholder">
            <span>🏗️</span>
          </div>
        )}
      </div>

      <div className="cart-card-details">
        <div className="cart-card-main-info">
          <h3>{item?.name || "Construction Material"}</h3>

          {item?.category && (
            <p className="cart-card-category">
              {item.category}
            </p>
          )}

          {item?.description && (
            <p className="cart-card-description">
              {item.description}
            </p>
          )}
        </div>

        <div className="cart-card-price-section">
          <span className="cart-card-unit-price">
            ₹{price.toLocaleString("en-IN")} each
          </span>

          <strong className="cart-card-total">
            ₹{itemTotal.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="cart-card-actions">
          <div className="quantity-control">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              aria-label={`Decrease quantity of ${item?.name || "product"}`}
            >
              <Minus size={16} />
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={handleIncrease}
              aria-label={`Increase quantity of ${item?.name || "product"}`}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            className="cart-remove-button"
            onClick={handleRemove}
          >
            <Trash2 size={17} />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

export default CartCard;