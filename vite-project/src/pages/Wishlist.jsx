import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  removeFromWishlist,
  clearWishlist,
} from "../redux/wishlistSlice";

import { addToCart } from "../redux/CartSlice";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  if (wishlistItems.length === 0) {
    return (
      <section className="wishlist-page">
        <div className="empty-wishlist-page">
          <div className="empty-wishlist-icon">
            <Heart size={48} />
          </div>

          <h1>Your Wishlist is Empty</h1>

          <p>
            Save your favorite construction materials here so you
            can easily find them later.
          </p>

          <Link
            to="/products"
            className="primary-button"
          >
            Browse Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="wishlist-page">
      <div className="wishlist-page-header">
        <div>
          <p className="wishlist-page-label">
            SAVED PRODUCTS
          </p>

          <h1>My Wishlist</h1>

          <p>
            Your favorite construction materials are saved
            here for quick access.
          </p>
        </div>

        <div className="wishlist-count">
          <Heart size={19} />

          <span>
            {wishlistItems.length} item
            {wishlistItems.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="wishlist-toolbar">
        <span>
          {wishlistItems.length} saved product
          {wishlistItems.length !== 1 ? "s" : ""}
        </span>

        <button
          type="button"
          className="wishlist-clear-button"
          onClick={handleClearWishlist}
        >
          <Trash2 size={17} />
          Clear Wishlist
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((product) => {
          const price = Number(product?.price) || 0;

          return (
            <article
              className="wishlist-card"
              key={product.id}
            >
              <div className="wishlist-card-image-wrapper">
                {product?.image ? (
                  <img
                    src={product.image}
                    alt={
                      product?.name ||
                      "Construction material"
                    }
                    className="wishlist-card-image"
                  />
                ) : (
                  <div className="wishlist-card-image-placeholder">
                    <span>🏗️</span>
                  </div>
                )}

                <button
                  type="button"
                  className="wishlist-remove-icon-button"
                  onClick={() =>
                    handleRemove(product.id)
                  }
                  aria-label={`Remove ${
                    product?.name || "product"
                  } from wishlist`}
                >
                  <Heart
                    size={19}
                    fill="currentColor"
                  />
                </button>
              </div>

              <div className="wishlist-card-content">
                {product?.category && (
                  <span className="wishlist-card-category">
                    {product.category}
                  </span>
                )}

                <Link
                  to={`/product/${product.id}`}
                  className="wishlist-card-title"
                >
                  {product?.name ||
                    "Construction Material"}
                </Link>

                <p className="wishlist-card-description">
                  {product?.description ||
                    "Quality construction material for your project."}
                </p>

                <div className="wishlist-card-price">
                  ₹{price.toLocaleString("en-IN")}
                </div>

                <div className="wishlist-card-actions">
                  <button
                    type="button"
                    className="wishlist-add-cart-button"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    <ShoppingCart size={17} />
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    className="wishlist-move-cart-button"
                    onClick={() =>
                      handleMoveToCart(product)
                    }
                  >
                    Move to Cart
                  </button>
                </div>

                <button
                  type="button"
                  className="wishlist-remove-button"
                  onClick={() =>
                    handleRemove(product.id)
                  }
                >
                  <Trash2 size={16} />
                  Remove from Wishlist
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Wishlist;