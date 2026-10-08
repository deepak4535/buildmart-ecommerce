import axios from "axios";

// JSON Server base URL
const API_URL = "http://localhost:3000";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   USERS / AUTHENTICATION
========================= */

export const usersApi = {
  getUsers: () => api.get("/users"),

  getUserById: (id) => api.get(`/users/${id}`),

  registerUser: (userData) => api.post("/users", userData),

  updateUser: (id, userData) => api.put(`/users/${id}`, userData),

  deleteUser: (id) => api.delete(`/users/${id}`),
};


/* =========================
   PRODUCTS
========================= */

export const productsApi = {
  getProducts: () => api.get("/products"),

  getProductById: (id) => api.get(`/products/${id}`),

  createProduct: (productData) => api.post("/products", productData),

  updateProduct: (id, productData) =>
    api.put(`/products/${id}`, productData),

  deleteProduct: (id) => api.delete(`/products/${id}`),

  searchProducts: (searchText) =>
    api.get(`/products?q=${encodeURIComponent(searchText)}`),

  getProductsByCategory: (category) =>
    api.get(`/products?category=${encodeURIComponent(category)}`),
};


/* =========================
   CATEGORIES
========================= */

export const categoriesApi = {
  getCategories: () => api.get("/categories"),

  getCategoryById: (id) => api.get(`/categories/${id}`),

  createCategory: (categoryData) =>
    api.post("/categories", categoryData),

  updateCategory: (id, categoryData) =>
    api.put(`/categories/${id}`, categoryData),

  deleteCategory: (id) =>
    api.delete(`/categories/${id}`),
};


/* =========================
   CART
========================= */

export const cartApi = {
  getCart: () => api.get("/cart"),

  getCartItemById: (id) => api.get(`/cart/${id}`),

  addToCart: (cartItem) =>
    api.post("/cart", cartItem),

  updateCartItem: (id, cartItem) =>
    api.put(`/cart/${id}`, cartItem),

  removeFromCart: (id) =>
    api.delete(`/cart/${id}`),
};


/* =========================
   WISHLIST
========================= */

export const wishlistApi = {
  getWishlist: () => api.get("/wishlist"),

  addToWishlist: (wishlistItem) =>
    api.post("/wishlist", wishlistItem),

  removeFromWishlist: (id) =>
    api.delete(`/wishlist/${id}`),
};


/* =========================
   ORDERS
========================= */

export const ordersApi = {
  getOrders: () => api.get("/orders"),

  getOrderById: (id) =>
    api.get(`/orders/${id}`),

  createOrder: (orderData) =>
    api.post("/orders", orderData),

  updateOrder: (id, orderData) =>
    api.put(`/orders/${id}`, orderData),

  deleteOrder: (id) =>
    api.delete(`/orders/${id}`),
};


/* =========================
   REVIEWS
========================= */

export const reviewsApi = {
  getReviews: () => api.get("/reviews"),

  getProductReviews: (productId) =>
    api.get(`/reviews?productId=${productId}`),

  createReview: (reviewData) =>
    api.post("/reviews", reviewData),

  updateReview: (id, reviewData) =>
    api.put(`/reviews/${id}`, reviewData),

  deleteReview: (id) =>
    api.delete(`/reviews/${id}`),
};


/* =========================
   PAYMENTS
========================= */

export const paymentsApi = {
  getPayments: () => api.get("/payments"),

  getPaymentById: (id) =>
    api.get(`/payments/${id}`),

  createPayment: (paymentData) =>
    api.post("/payments", paymentData),

  updatePayment: (id, paymentData) =>
    api.put(`/payments/${id}`, paymentData),
};


/* =========================
   CONTACT
========================= */

export const contactApi = {
  getMessages: () => api.get("/contact"),

  sendMessage: (messageData) =>
    api.post("/contact", messageData),

  deleteMessage: (id) =>
    api.delete(`/contact/${id}`),
};


/* =========================
   DEFAULT AXIOS INSTANCE
========================= */

export default api;