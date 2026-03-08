import axios from "axios";
const API = axios.create({
  baseURL: "https://prime-deals-backend-production.up.railway.app/api",
});
// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const getProducts = (page = 0, size = 40) => API.get(`/products?page=${page}&size=${size}`);
export const getProductById = (id) => API.get(`/products/${id}`);
// ─── CART ─────────────────────────────────────────────────────────────────────
export const getCart = () => API.get("/cart");
export const addToCart = (productId, quantity) =>
  API.post("/cart/add", { productId, quantity });
export const removeFromCart = (productId) =>
  API.delete(`/cart/remove/${productId}`);
export const clearCart = () => API.delete("/cart/clear");
// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const placeOrder = (shippingAddress) =>
  API.post("/orders", { shippingAddress });
export const getMyOrders = () => API.get("/orders");
export const cancelOrder = (orderId) =>
  API.put(`/orders/${orderId}/cancel`);
// ─── PROFILE ──────────────────────────────────────────────────────────────────
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);
// ─── ADDRESSES ────────────────────────────────────────────────────────────────
export const getAddresses = () => API.get("/addresses");
export const addAddress = (data) => API.post("/addresses", data);
export const deleteAddress = (id) => API.delete(`/addresses/${id}`);
export const setDefaultAddress = (id) => API.put(`/addresses/${id}/default`);
// ─── SELLER ───────────────────────────────────────────────────────────────────
export const checkIsSeller      = ()       => API.get("/seller/check");
export const registerAsSeller   = (data)   => API.post("/seller/register", data);
export const getSellerProfile   = ()       => API.get("/seller/profile");
export const updateSellerProfile= (data)   => API.put("/seller/profile", data);
export const getSellerProducts  = ()       => API.get("/seller/products");
export const addSellerProduct   = (data)   => API.post("/seller/products", data);
export const updateSellerProduct= (id, data) => API.put(`/seller/products/${id}`, data);
export const deleteSellerProduct= (id)     => API.delete(`/seller/products/${id}`);
export const createOrder   = (data) => API.post("/orders", data);
export const getOrders     = ()     => API.get("/orders");
