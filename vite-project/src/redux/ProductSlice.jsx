import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  searchText: "",
  selectedCategory: "All",
};

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },

    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    addProduct: (state, action) => {
      state.products.push(action.payload);
    },

    updateProduct: (state, action) => {
      const updatedProduct = action.payload;

      const index = state.products.findIndex(
        (product) => product.id === updatedProduct.id
      );

      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    },

    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },

    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
  setSearchText,
  setSelectedCategory,
  clearSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;