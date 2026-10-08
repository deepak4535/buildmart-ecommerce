import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },

    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },

    updateOrder: (state, action) => {
      const updatedOrder = action.payload;

      const index = state.orders.findIndex(
        (order) => order.id === updatedOrder.id
      );

      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
    },

    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
    },

    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },

    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },

    setOrderLoading: (state, action) => {
      state.loading = action.payload;
    },

    setOrderError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const {
  setOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  setSelectedOrder,
  clearSelectedOrder,
  setOrderLoading,
  setOrderError,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;