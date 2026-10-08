import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  PackagePlus,
  Save,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { productsApi, categoriesApi } from "../services/api";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    brand: "",
    unit: "piece",
  });

  const [loadingCategories, setLoadingCategories] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const response =
          await categoriesApi.getCategories();

        setCategories(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (err) {
        console.error(
          "Error loading categories:",
          err
        );

        setError(
          "Unable to load categories. You can still enter a category manually."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const name = formData.name.trim();
    const description = formData.description.trim();
    const category = formData.category.trim();
    const image = formData.image.trim();
    const brand = formData.brand.trim();

    const price = Number(formData.price);
    const stock = Number(formData.stock);

    if (!name) {
      setError("Please enter a product name.");
      return;
    }

    if (!description) {
      setError("Please enter a product description.");
      return;
    }

    if (!category) {
      setError("Please select or enter a category.");
      return;
    }

    if (!formData.price || !Number.isFinite(price) || price < 0) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      formData.stock === "" ||
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    try {
      setSaving(true);

      const newProduct = {
        name,
        title: name,
        description,
        price,
        category,
        categoryName: category,
        image,
        stock,
        quantity: stock,
        brand,
        unit: formData.unit,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await productsApi.createProduct(newProduct);

      navigate("/admin/products");
    } catch (err) {
      console.error(
        "Error creating product:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to create the product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-form-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-label">
            PRODUCT MANAGEMENT
          </p>

          <h1>Add Product</h1>

          <p>
            Add a new construction material to your
            store inventory.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="admin-secondary-button"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className="admin-form-layout">
        <div className="admin-form-card">
          <div className="admin-form-card-header">
            <div className="admin-form-icon">
              <PackagePlus size={23} />
            </div>

            <div>
              <h2>Product Information</h2>

              <p>
                Enter the basic information for your
                construction material.
              </p>
            </div>
          </div>

          <form
            className="admin-product-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-full">
                <label htmlFor="name">
                  Product Name
                  <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: UltraTech Cement 50kg"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="category">
                  Category
                  <span>*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select Category"}
                  </option>

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

                {!loadingCategories &&
                  categories.length === 0 && (
                    <small>
                      No categories found. You can enter
                      a category below.
                    </small>
                  )}
              </div>

              <div className="admin-form-group">
                <label htmlFor="brand">
                  Brand
                </label>

                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Example: UltraTech"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="price">
                  Price
                  <span>*</span>
                </label>

                <div className="admin-input-with-prefix">
                  <span>₹</span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="stock">
                  Stock Quantity
                  <span>*</span>
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="unit">
                  Unit
                </label>

                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="piece">
                    Piece
                  </option>

                  <option value="bag">
                    Bag
                  </option>

                  <option value="kg">
                    Kilogram
                  </option>

                  <option value="ton">
                    Ton
                  </option>

                  <option value="meter">
                    Meter
                  </option>

                  <option value="sqft">
                    Sq. Ft.
                  </option>

                  <option value="liter">
                    Liter
                  </option>

                  <option value="box">
                    Box
                  </option>
                </select>
              </div>

              <div className="admin-form-group admin-form-full">
                <label htmlFor="image">
                  Product Image URL
                </label>

                <div className="admin-input-with-icon">
                  <ImageIcon size={19} />

                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/product-image.jpg"
                  />
                </div>

                <small>
                  Enter a valid image URL. You can add
                  local product images later.
                </small>
              </div>

              <div className="admin-form-group admin-form-full">
                <label htmlFor="description">
                  Product Description
                  <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product, its quality, usage, specifications, and other important details..."
                  required
                />
              </div>
            </div>

            <div className="admin-form-actions">
              <Link
                to="/admin/products"
                className="admin-secondary-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                <Save size={18} />

                {saving
                  ? "Saving Product..."
                  : "Save Product"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-form-preview-card">
          <div className="admin-form-card-header">
            <div className="admin-form-icon">
              <ImageIcon size={23} />
            </div>

            <div>
              <h2>Product Preview</h2>

              <p>
                Preview how your product information
                looks.
              </p>
            </div>
          </div>

          <div className="admin-product-preview">
            <div className="admin-product-preview-image">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt={
                    formData.name ||
                    "Product preview"
                  }
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <PackagePlus size={48} />
              )}
            </div>

            <div className="admin-product-preview-content">
              <span className="admin-preview-category">
                {formData.category ||
                  "Product Category"}
              </span>

              <h3>
                {formData.name ||
                  "Product Name"}
              </h3>

              <p>
                {formData.description ||
                  "Product description will appear here."}
              </p>

              <div className="admin-preview-details">
                <strong>
                  ₹
                  {formData.price
                    ? Number(
                        formData.price
                      ).toLocaleString("en-IN")
                    : "0"}
                </strong>

                <span>
                  Stock:{" "}
                  {formData.stock || "0"}{" "}
                  {formData.unit}
                </span>
              </div>

              {formData.brand && (
                <small>
                  Brand: {formData.brand}
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddProduct;