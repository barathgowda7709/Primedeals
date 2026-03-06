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
export const getProducts = () => API.get("/products");
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
