// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Load products from backend on startup
  useEffect(() => {
    api.getProducts()
      .then(res => setProducts(res.data))
      .catch(() => console.error("Could not load products"))
      .finally(() => setProductsLoading(false));
  }, []);

  // Restore user from localStorage on startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchCart();
    }
  }, []);

  // ─── Fetch cart from backend ─────────────────────────────────────────────
  const fetchCart = async () => {
    try {
      const res = await api.getCart();
      // Map backend CartResponse fields to frontend cart format
      const backendCart = (res.data.items || []).map(item => ({
        id: item.productId,
        cartItemId: item.cartItemId,
        name: item.productName,
        price: item.price,
        imageUrl: item.imageUrl,
        qty: item.quantity,
      }));
      setCart(backendCart);
    } catch (err) {
      console.error("Could not load cart:", err);
    }
  };

  const navigate = (target, extra) => {
    if (target === "products" && extra) setFilterCategory(extra);
    else if (target !== "products") setFilterCategory(null);
    setPage(target);
    window.scrollTo(0, 0);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ─── Add to cart (local + backend) ───────────────────────────────────────
  const addToCart = async (product) => {
    // Update local state immediately for fast UI
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✓ "${product.name}" added to cart`);

    // Sync with backend if logged in
    if (localStorage.getItem("token")) {
      try {
        await api.addToCart(product.id, 1);
      } catch (err) {
        console.error("Cart sync failed:", err);
      }
    }
  };

  // ─── Remove from cart (local + backend) ──────────────────────────────────
  const removeFromCart = async (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    if (localStorage.getItem("token")) {
      try {
        await api.removeFromCart(id);
      } catch (err) {
        console.error("Remove cart sync failed:", err);
      }
    }
  };

  const updateQty = (id, qty) => setCart(prev =>
    prev.map(i => i.id === id ? { ...i, qty } : i)
  );

  const productClick = (product) => {
    setSelectedProduct(product);
    navigate("product");
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    fetchCart(); // Load cart from backend after login
  };

  const handleLogout = async () => {
    if (localStorage.getItem("token")) {
      try { await api.clearCart(); } catch (err) {}
    }
    setUser(null);
    setCart([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("home");
  };

  const placeOrder = async (shippingAddress) => {
    if (!user) { navigate("login"); throw new Error("Not logged in"); }
    await api.placeOrder(shippingAddress);
    setCart([]);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage onNavigate={navigate} onAddToCart={addToCart} onProductClick={productClick} products={products} />;
      case "products": return <ProductsPage onAddToCart={addToCart} onProductClick={productClick} filterCategory={filterCategory} searchQuery={searchQuery} products={products} loading={productsLoading} />;
      case "product": return selectedProduct ? <ProductDetailPage product={selectedProduct} onAddToCart={addToCart} onNavigate={navigate} /> : null;
      case "cart": return <CartPage cart={cart} onRemove={removeFromCart} onUpdateQty={updateQty} onNavigate={navigate} />;
      case "checkout": return <CheckoutPage cart={cart} user={user} onNavigate={navigate} onPlaceOrder={placeOrder} />;
      case "login": return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case "orders": return <OrdersPage user={user} onNavigate={navigate} />;
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      {page !== "login" && (
        <Navbar
          cartCount={cartCount}
          onNavigate={navigate}
          searchQuery={searchQuery}
          onSearch={q => { setSearchQuery(q); navigate("products"); }}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#232f3e", color: "white", padding: "12px 24px", borderRadius: "24px", fontSize: "14px", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", zIndex: 9999 }}>
          {toast}
        </div>
      )}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
      `}</style>
    </div>
  );
}
