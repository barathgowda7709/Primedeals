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
export const searchProducts = (q) => API.get(`/products?search=${encodeURIComponent(q)}`);
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
// ─── DELIVERY ─────────────────────────────────────────────────────────────────
export const checkDelivery      = (productId, pincode) => API.get(`/delivery/check?productId=${productId}&pincode=${pincode}`);
// ─── SELLER ───────────────────────────────────────────────────────────────────
export const checkIsSeller      = ()       => API.get("/seller/check");
export const registerAsSeller   = (data)   => API.post("/seller/register", data);
export const getSellerProfile   = ()       => API.get("/seller/profile");
export const updateSellerProfile= (data)   => API.put("/seller/profile", data);
export const getSellerProducts  = ()       => API.get("/seller/products");
export const addSellerProduct   = (data)   => API.post("/seller/products", data);
export const updateSellerProduct= (id, data) => API.put(`/seller/products/${id}`, data);
export const deleteSellerProduct= (id)     => API.delete(`/seller/products/${id}`);
export const getSellerPincodes  = ()           => API.get("/seller/pincodes");
export const addSellerPincode   = (data)       => API.post("/seller/pincodes", data);
export const deleteSellerPincode= (id)         => API.delete(`/seller/pincodes/${id}`);
export const createOrder   = (data) => API.post("/orders", data);
export const getOrders     = ()     => API.get("/orders");
// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const adminGetStats          = ()           => API.get("/admin/dashboard");
export const adminGetUsers          = ()           => API.get("/admin/users");
export const adminDeleteUser        = (id)         => API.delete(`/admin/users/${id}`);
export const adminGetSellers        = ()           => API.get("/admin/sellers");
export const adminUpdateSellerStatus= (id, status) => API.put(`/admin/sellers/${id}/status?status=${status}`);
export const adminGetOrders         = ()           => API.get("/admin/orders");
export const adminUpdateOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status?status=${status}`);
export const adminGetProducts       = ()           => API.get("/admin/products");
export const adminDeleteProduct     = (id)         => API.delete(`/admin/products/${id}`);
