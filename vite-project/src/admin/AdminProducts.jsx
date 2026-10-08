import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Edit,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { productsApi, categoriesApi } from "../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, categoriesResponse] =
        await Promise.all([
          productsApi.getProducts(),
          categoriesApi.getCategories(),
        ]);

      setProducts(
        Array.isArray(productsResponse.data)
          ? productsResponse.data
          : []
      );

      setCategories(
        Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : []
      );
    } catch (err) {
      console.error("Error loading admin products:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load products. Please make sure JSON Server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getCategoryName = (product) => {
    if (product.categoryName) {
      return product.categoryName;
    }

    if (product.category) {
      return product.category;
    }

    if (product.categoryId) {
      const category = categories.find(
        (item) => String(item.id) === String(product.categoryId)
      );

      return category?.name || "Uncategorized";
    }

    return "Uncategorized";
  };

  const filteredProducts = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return products.filter((product) => {
      const productName = String(
        product.name || product.title || ""
      ).toLowerCase();

      const productDescription = String(
        product.description || ""
      ).toLowerCase();

      const productId = String(product.id || "").toLowerCase();

      const categoryName = getCategoryName(product).toLowerCase();

      const matchesSearch =
        !search ||
        productName.includes(search) ||
        productDescription.includes(search) ||
        productId.includes(search) ||
        categoryName.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        categoryName === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [
    products,
    categories,
    searchText,
    selectedCategory,
  ]);

  const handleDelete = async (product) => {
    const productName =
      product.name || product.title || "this product";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);
      setError("");
      setSuccess("");

      await productsApi.deleteProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );

      setSuccess(
        `"${productName}" was deleted successfully.`
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting product:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete the product. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = async () => {
    setSuccess("");
    await loadProducts();
  };

  const getProductImage = (product) => {
    return (
      product.image ||
      product.imageUrl ||
      product.thumbnail ||
      ""
    );
  };

  const getProductPrice = (product) => {
    const price = Number(product.price);

    return Number.isFinite(price) ? price : 0;
  };

  const getProductStock = (product) => {
    if (product.stock !== undefined) {
      return Number(product.stock) || 0;
    }

    if (product.quantity !== undefined) {
      return Number(product.quantity) || 0;
    }

    return 0;
  };

  const getStockClass = (stock) => {
    if (stock <= 0) {
      return "out";
    }

    if (stock <= 10) {
      return "low";
    }

    return "available";
  };

  const getStockText = (stock) => {
    if (stock <= 0) {
      return "Out of Stock";
    }

    if (stock <= 10) {
      return `Low Stock (${stock})`;
    }

    return `${stock} in stock`;
  };

  if (loading) {
    return (
      <div className="admin-loading-page">
        <Package size={42} />

        <h2>Loading Products...</h2>

        <p>
          Please wait while we load your product
          inventory.
        </p>
      </div>
    );
  }

  return (
    <section className="admin-products-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-label">
            PRODUCT MANAGEMENT
          </p>

          <h1>Manage Products</h1>

          <p>
            Add, edit, search, and manage all construction
            materials available in your store.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={handleRefresh}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <Link
            to="/admin/products/add"
            className="admin-primary-button"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
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

      <div className="admin-products-summary">
        <div>
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>

        <div>
          <span>Showing</span>
          <strong>{filteredProducts.length}</strong>
        </div>

        <div>
          <span>Categories</span>
          <strong>{categories.length}</strong>
        </div>
      </div>

      <div className="admin-products-toolbar">
        <div className="admin-search-wrapper">
          <Search size={19} />

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search products, category or ID..."
          />
        </div>

        <div className="admin-filter-wrapper">
          <label htmlFor="product-category">
            Category
          </label>

          <select
            id="product-category"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
          >
            <option value="All">All Categories</option>

            {categories.map((category) => {
              const categoryName =
                category.name ||
                category.title ||
                category.category ||
                "";

              if (!categoryName) {
                return null;
              }

              return (
                <option
                  key={category.id}
                  value={categoryName}
                >
                  {categoryName}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="admin-empty-state admin-products-empty">
          <Package size={52} />

          <h2>No Products Found</h2>

          <p>
            {products.length === 0
              ? "Your store does not have any products yet."
              : "No products match your current search or category filter."}
          </p>

          {products.length === 0 ? (
            <Link
              to="/admin/products/add"
              className="admin-primary-button"
            >
              <Plus size={18} />
              Add Your First Product
            </Link>
          ) : (
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => {
                setSearchText("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="admin-products-table-card">
          <div className="admin-products-table-header">
            <div>
              <h2>Product Inventory</h2>

              <p>
                {filteredProducts.length} product
                {filteredProducts.length !== 1
                  ? "s"
                  : ""}{" "}
                displayed
              </p>
            </div>
          </div>

          <div className="admin-products-table-wrapper">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const productName =
                    product.name ||
                    product.title ||
                    "Unnamed Product";

                  const image =
                    getProductImage(product);

                  const category =
                    getCategoryName(product);

                  const price =
                    getProductPrice(product);

                  const stock =
                    getProductStock(product);

                  const stockClass =
                    getStockClass(stock);

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-info">
                          <div className="admin-product-image">
                            {image ? (
                              <img
                                src={image}
                                alt={productName}
                              />
                            ) : (
                              <Package size={26} />
                            )}
                          </div>

                          <div>
                            <strong>
                              {productName}
                            </strong>

                            <small>
                              ID: #{product.id}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-category-badge">
                          {category}
                        </span>
                      </td>

                      <td>
                        <strong>
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>

                      <td>{stock}</td>

                      <td>
                        <span
                          className={`admin-stock-badge ${stockClass}`}
                        >
                          {getStockText(stock)}
                        </span>
                      </td>

                      <td>
                        <div className="admin-product-actions">
                          <Link
                            to={`/product/${product.id}`}
                            className="admin-icon-button view"
                            title="View Product"
                            aria-label={`View ${productName}`}
                          >
                            <Eye size={17} />
                          </Link>

                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="admin-icon-button edit"
                            title="Edit Product"
                            aria-label={`Edit ${productName}`}
                          >
                            <Edit size={17} />
                          </Link>

                          <button
                            type="button"
                            className="admin-icon-button delete"
                            title="Delete Product"
                            aria-label={`Delete ${productName}`}
                            onClick={() =>
                              handleDelete(product)
                            }
                            disabled={
                              deletingId === product.id
                            }
                          >
                            {deletingId === product.id ? (
                              <RefreshCw
                                size={17}
                                className="admin-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
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
    </section>
  );
}

export default AdminProducts;