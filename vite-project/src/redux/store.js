import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./CartSlice.jsx";
import productReducer from "./ProductSlice.jsx";
import orderReducer from "./orderSlice.js";
import wishlistReducer from "./wishlistSlice.js";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
  },
});

export default store;