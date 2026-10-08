import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { productsApi } from "../services/api";
import { addToCart } from "../redux/CartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistSlice";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await productsApi.getProductById(id);

        setProduct(response.data);
      } catch (err) {
        console.error("Error loading product:", err);

        setError(
          err.response?.status === 404
            ? "The requested product could not be found."
            : "Unable to load product details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const isWishlisted = product
    ? wishlistItems.some((item) => item.id === product.id)
    : false;

  const handleDecrease = () => {
    setQuantity((currentQuantity) =>
      currentQuantity > 1 ? currentQuantity - 1 : 1
    );
  };

  const handleIncrease = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let index = 0; index < quantity; index += 1) {
      dispatch(addToCart(product));
    }
  };

  const handleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <h2>Loading Product...</h2>
        <p>Please wait while we load the product details.</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-page">
        <h2>Product Not Found</h2>
        <p>{error || "This product does not exist."}</p>

        <Link to="/products" className="primary-button">
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>
    );
  }

  const price = Number(product.price) || 0;

  const totalPrice = price * quantity;

  return (
    <section className="product-details-page">
      <div className="product-details-back">
        <Link to="/products" className="back-link">
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>

      <div className="product-details-container">
        <div className="product-details-image-section">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name || "Construction material"}
              className="product-details-image"
            />
          ) : (
            <div className="product-details-image-placeholder">
              <span>🏗️</span>
              <p>Construction Material</p>
            </div>
          )}
        </div>

        <div className="product-details-content">
          {product.category && (
            <span className="product-details-category">
              {product.category}
            </span>
          )}

          <h1>
            {product.name || "Construction Material"}
          </h1>

          <div className="product-details-price">
            ₹{price.toLocaleString("en-IN")}
          </div>

          <p className="product-details-description">
            {product.description ||
              "Quality construction material suitable for residential and commercial construction projects."}
          </p>

          {product.brand && (
            <div className="product-details-info">
              <span>Brand</span>
              <strong>{product.brand}</strong>
            </div>
          )}

          {product.unit && (
            <div className="product-details-info">
              <span>Unit</span>
              <strong>{product.unit}</strong>
            </div>
          )}

          {product.stock !== undefined && (
            <div className="product-details-info">
              <span>Availability</span>
              <strong>
                {Number(product.stock) > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </strong>
            </div>
          )}

          <div className="product-details-divider" />

          <div className="product-details-purchase">
            <div className="quantity-control">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={17} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label="Increase quantity"
              >
                <Plus size={17} />
              </button>
            </div>

            <div className="product-details-total">
              <span>Total</span>
              <strong>
                ₹{totalPrice.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <div className="product-details-actions">
            <button
              type="button"
              className="primary-button product-details-cart-button"
              onClick={handleAddToCart}
              disabled={
                product.stock !== undefined &&
                Number(product.stock) <= 0
              }
            >
              <ShoppingCart size={19} />

              {product.stock !== undefined &&
              Number(product.stock) <= 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            <button
              type="button"
              className={`product-details-wishlist-button ${
                isWishlisted ? "active" : ""
              }`}
              onClick={handleWishlist}
            >
              <Heart
                size={19}
                fill={isWishlisted ? "currentColor" : "none"}
              />

              {isWishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>
          </div>

          <div className="product-details-features">
            <div>
              <ShoppingCart size={20} />
              <span>Easy Ordering</span>
            </div>

            <div>
              <Heart size={20} />
              <span>Save to Wishlist</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;