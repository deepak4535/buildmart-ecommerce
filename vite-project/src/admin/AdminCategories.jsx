import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Edit,
  FolderTree,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { categoriesApi } from "../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

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
        err.response?.data?.message ||
          "Unable to load categories. Please make sure JSON Server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const search =
      searchText.trim().toLowerCase();

    if (!search) {
      return categories;
    }

    return categories.filter((category) => {
      const name = String(
        category.name ||
          category.title ||
          category.category ||
          ""
      ).toLowerCase();

      const description = String(
        category.description || ""
      ).toLowerCase();

      return (
        name.includes(search) ||
        description.includes(search)
      );
    });
  }, [categories, searchText]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });

    setEditingCategory(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setError("");
    setSuccess("");

    setFormData({
      name: "",
      description: "",
      image: "",
    });

    setEditingCategory(null);
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setError("");
    setSuccess("");

    setFormData({
      name:
        category.name ||
        category.title ||
        category.category ||
        "",
      description:
        category.description || "",
      image:
        category.image ||
        category.imageUrl ||
        "",
    });

    setEditingCategory(category);
    setShowForm(true);
  };

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
    setSuccess("");

    const name = formData.name.trim();
    const description =
      formData.description.trim();
    const image = formData.image.trim();

    if (!name) {
      setError(
        "Please enter a category name."
      );
      return;
    }

    try {
      setSaving(true);

      if (editingCategory) {
        const updatedCategory = {
          ...editingCategory,
          name,
          title: name,
          description,
          image,
          updatedAt: new Date().toISOString(),
        };

        const response =
          await categoriesApi.updateCategory(
            editingCategory.id,
            updatedCategory
          );

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id ===
            editingCategory.id
              ? response.data
              : category
          )
        );

        setSuccess(
          `"${name}" was updated successfully.`
        );
      } else {
        const newCategory = {
          name,
          title: name,
          description,
          image,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const response =
          await categoriesApi.createCategory(
            newCategory
          );

        setCategories((currentCategories) => [
          ...currentCategories,
          response.data,
        ]);

        setSuccess(
          `"${name}" was created successfully.`
        );
      }

      setFormData({
        name: "",
        description: "",
        image: "",
      });

      setEditingCategory(null);
      setShowForm(false);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Error saving category:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save the category. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const categoryName =
      category.name ||
      category.title ||
      category.category ||
      "this category";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${categoryName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);
      setError("");
      setSuccess("");

      await categoriesApi.deleteCategory(
        category.id
      );

      setCategories((currentCategories) =>
        currentCategories.filter(
          (item) => item.id !== category.id
        )
      );

      if (
        editingCategory &&
        editingCategory.id === category.id
      ) {
        resetForm();
      }

      setSuccess(
        `"${categoryName}" was deleted successfully.`
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Error deleting category:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete the category."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-page">
        <FolderTree size={42} />

        <h2>Loading Categories...</h2>

        <p>
          Please wait while we load your product
          categories.
        </p>
      </div>
    );
  }

  return (
    <section className="admin-categories-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-label">
            CATEGORY MANAGEMENT
          </p>

          <h1>Manage Categories</h1>

          <p>
            Create, edit, search, and manage your
            construction material categories.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={loadCategories}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add Category
          </button>
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

      <div className="admin-category-summary">
        <div>
          <span>Total Categories</span>
          <strong>{categories.length}</strong>
        </div>

        <div>
          <span>Showing</span>
          <strong>
            {filteredCategories.length}
          </strong>
        </div>
      </div>

      <div className="admin-categories-toolbar">
        <div className="admin-search-wrapper">
          <FolderTree size={19} />

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="Search categories..."
          />
        </div>
      </div>

      {showForm && (
        <div className="admin-category-form-card">
          <div className="admin-category-form-header">
            <div>
              <p className="admin-page-label">
                {editingCategory
                  ? "EDIT CATEGORY"
                  : "NEW CATEGORY"}
              </p>

              <h2>
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h2>
            </div>

            <button
              type="button"
              className="admin-modal-close"
              onClick={resetForm}
              aria-label="Close category form"
            >
              <X size={22} />
            </button>
          </div>

          <form
            className="admin-category-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="category-name">
                  Category Name
                  <span>*</span>
                </label>

                <input
                  id="category-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Cement"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="category-image">
                  Image URL
                </label>

                <div className="admin-input-with-icon">
                  <ImageIcon size={19} />

                  <input
                    id="category-image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/category.jpg"
                  />
                </div>
              </div>

              <div className="admin-form-group admin-form-full">
                <label htmlFor="category-description">
                  Description
                </label>

                <textarea
                  id="category-description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the products included in this category..."
                />
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : editingCategory
                  ? "Update Category"
                  : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredCategories.length === 0 ? (
        <div className="admin-empty-state">
          <FolderTree size={52} />

          <h2>No Categories Found</h2>

          <p>
            {categories.length === 0
              ? "There are no categories in your store yet."
              : "No categories match your current search."}
          </p>

          {categories.length === 0 ? (
            <button
              type="button"
              className="admin-primary-button"
              onClick={openAddForm}
            >
              <Plus size={18} />
              Add Your First Category
            </button>
          ) : (
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() =>
                setSearchText("")
              }
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="admin-category-grid">
          {filteredCategories.map(
            (category) => {
              const categoryName =
                category.name ||
                category.title ||
                category.category ||
                "Unnamed Category";

              const image =
                category.image ||
                category.imageUrl ||
                "";

              return (
                <div
                  className="admin-category-card"
                  key={category.id}
                >
                  <div className="admin-category-card-image">
                    {image ? (
                      <img
                        src={image}
                        alt={categoryName}
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <FolderTree size={42} />
                    )}
                  </div>

                  <div className="admin-category-card-content">
                    <div>
                      <span className="admin-category-id">
                        ID: #{category.id}
                      </span>

                      <h3>
                        {categoryName}
                      </h3>

                      <p>
                        {category.description ||
                          "No category description available."}
                      </p>
                    </div>

                    <div className="admin-category-card-actions">
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() =>
                          openEditForm(
                            category
                          )
                        }
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-icon-button delete"
                        title="Delete Category"
                        aria-label={`Delete ${categoryName}`}
                        onClick={() =>
                          handleDelete(
                            category
                          )
                        }
                        disabled={
                          deletingId ===
                          category.id
                        }
                      >
                        {deletingId ===
                        category.id ? (
                          <RefreshCw
                            size={17}
                            className="admin-spin"
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}

export default AdminCategories;