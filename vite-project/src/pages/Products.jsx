import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, SlidersHorizontal, X } from "lucide-react";

import ProductCard from "../components/ProductCard";
import {
  setProducts,
  setLoading,
  setError,
  setSearchText,
  setSelectedCategory,
} from "../redux/ProductSlice";
import { productsApi } from "../services/api";

function Products() {
  const dispatch = useDispatch();

  const {
    products,
    loading,
    error,
    searchText,
    selectedCategory,
  } = useSelector((state) => state.products);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch(setLoading(true));

        const response = await productsApi.getProducts();

        dispatch(setProducts(response.data));
      } catch (err) {
        console.error("Error loading products:", err);

        dispatch(
          setError(
            err.response?.data?.message ||
              "Unable to load products. Please check whether JSON Server is running."
          )
        );
      }
    };

    loadProducts();
  }, [dispatch]);

  const categories = useMemo(() => {
    const categorySet = new Set();

    products.forEach((product) => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });

    return ["All", ...Array.from(categorySet).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        search === "" ||
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchText, selectedCategory]);

  const handleSearchChange = (event) => {
    dispatch(setSearchText(event.target.value));
  };

  const handleCategoryChange = (event) => {
    dispatch(setSelectedCategory(event.target.value));
  };

  const clearFilters = () => {
    dispatch(setSearchText(""));
    dispatch(setSelectedCategory("All"));
  };

  return (
    <section className="products-page">
      <div className="products-page-header">
        <div>
          <p className="products-page-label">CONSTRUCTION MATERIALS</p>

          <h1>Construction Products</h1>

          <p>
            Browse quality construction materials for residential and
            commercial projects.
          </p>
        </div>
      </div>

      <div className="products-toolbar">
        <div className="products-search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search construction materials..."
            value={searchText}
            onChange={handleSearchChange}
          />

          {searchText && (
            <button
              type="button"
              className="clear-search-button"
              onClick={() => dispatch(setSearchText(""))}
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="products-filter-box">
          <SlidersHorizontal size={18} />

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Filter products by category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {(searchText || selectedCategory !== "All") && (
          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="products-summary">
        <span>
          Showing <strong>{filteredProducts.length}</strong> product
          {filteredProducts.length !== 1 ? "s" : ""}
        </span>

        {selectedCategory !== "All" && (
          <span>
            Category: <strong>{selectedCategory}</strong>
          </span>
        )}
      </div>

      {loading && (
        <div className="loading-page">
          <h2>Loading Products...</h2>
          <p>Please wait while we load the construction materials.</p>
        </div>
      )}

      {!loading && error && (
        <div className="error-page">
          <h2>Unable to Load Products</h2>
          <p>{error}</p>
          <p>
            Make sure JSON Server is running and your API is available at
            <strong> http://localhost:3000</strong>.
          </p>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="empty-products-page">
          <div className="empty-products-icon">🔎</div>

          <h2>No Products Found</h2>

          <p>
            We couldn't find any construction materials matching your search
            or category.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={clearFilters}
          >
            View All Products
          </button>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;