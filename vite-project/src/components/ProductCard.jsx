import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  addToCart,
} from "../redux/CartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const price = Number(product?.price) || 0;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <article className="product-card">
      <div className="product-card-image-wrapper">
        {product?.image ? (
          <img
            src={product.image}
            alt={product?.name || "Construction material"}
            className="product-card-image"
          />
        ) : (
          <div className="product-card-image-placeholder">
            <span>🏗️</span>
          </div>
        )}

        <button
          type="button"
          className={`product-wishlist-button ${
            isWishlisted ? "active" : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? `Remove ${product?.name} from wishlist`
              : `Add ${product?.name} to wishlist`
          }
        >
          <Heart
            size={19}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="product-card-content">
        {product?.category && (
          <span className="product-card-category">
            {product.category}
          </span>
        )}

        <Link
          to={`/product/${product.id}`}
          className="product-card-title"
        >
          {product?.name || "Construction Material"}
        </Link>

        <p className="product-card-description">
          {product?.description ||
            "Quality construction material for your project."}
        </p>

        <div className="product-card-bottom">
          <strong className="product-card-price">
            ₹{price.toLocaleString("en-IN")}
          </strong>

          <button
            type="button"
            className="product-add-cart-button"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={17} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;