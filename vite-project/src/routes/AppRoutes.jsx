import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";

import Dashboard from "../admin/Dashboard";
import AdminProducts from "../admin/AdminProducts";
import AddProduct from "../admin/AddProduct";
import EditProduct from "../admin/EditProduct";
import AdminOrders from "../admin/AdminOrders";
import AdminCategories from "../admin/AdminCategories";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* ==================== PUBLIC ROUTES ==================== */}

      <Route path="/" element={<Home />} />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      <Route
        path="/faq"
        element={<FAQ />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==================== CUSTOMER ROUTES ==================== */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>


      {/* ==================== ADMIN ROUTES ==================== */}

      <Route element={<AdminRoute />}>

        <Route
          path="/admin"
          element={<Dashboard />}
        />

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin/products/add"
          element={<AddProduct />}
        />

        <Route
          path="/admin/products/edit/:id"
          element={<EditProduct />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin/categories"
          element={<AdminCategories />}
        />

      </Route>


      {/* ==================== 404 ==================== */}

      <Route
        path="*"
        element={
          <div className="not-found-page">
            <h1>404 - Page Not Found</h1>

            <p>
              The page you are looking for does not exist.
            </p>
          </div>
        }
      />

    </Routes>
  );
}

export default AppRoutes;