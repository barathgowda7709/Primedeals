import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, name: "Electronics", icon: "💻", color: "#e8f4f8" },
  { id: 2, name: "Books", icon: "📚", color: "#fef9e7" },
  { id: 3, name: "Clothing", icon: "👕", color: "#fdf2f8" },
  { id: 4, name: "Home & Kitchen", icon: "🏠", color: "#f0fff4" },
  { id: 5, name: "Sports", icon: "⚽", color: "#fff5f5" },
  { id: 6, name: "Toys", icon: "🎮", color: "#f5f0ff" },
];

const PRODUCTS = [
  { id: 1, name: "Apple MacBook Pro 14\"", category: "Electronics", price: 1999.99, originalPrice: 2499.99, rating: 4.8, reviews: 2341, image: "💻", badge: "Best Seller", description: "M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals.", prime: true },
  { id: 2, name: "Sony WH-1000XM5 Headphones", category: "Electronics", price: 279.99, originalPrice: 399.99, rating: 4.7, reviews: 8923, image: "🎧", badge: "Deal", description: "Industry-leading noise cancellation with 30hr battery life.", prime: true },
  { id: 3, name: "The Pragmatic Programmer", category: "Books", price: 34.99, originalPrice: 49.99, rating: 4.9, reviews: 15234, image: "📖", badge: "Best Seller", description: "Your journey to mastery. Essential reading for every developer.", prime: true },
  { id: 4, name: "Nike Air Max 270", category: "Clothing", price: 89.99, originalPrice: 130.00, rating: 4.5, reviews: 5672, image: "👟", badge: "", description: "Lightweight comfort with Max Air cushioning for all-day wear.", prime: true },
  { id: 5, name: "Instant Pot Duo 7-in-1", category: "Home & Kitchen", price: 79.99, originalPrice: 99.99, rating: 4.7, reviews: 43211, image: "🍲", badge: "Best Seller", description: "7-in-1 multi-use pressure cooker. 6 quart capacity.", prime: true },
  { id: 6, name: "Kindle Paperwhite", category: "Electronics", price: 139.99, originalPrice: 159.99, rating: 4.8, reviews: 12098, image: "📱", badge: "Prime Deal", description: "Now with 6.8\" display and adjustable warm light.", prime: true },
  { id: 7, name: "LEGO Technic Bugatti", category: "Toys", price: 349.99, originalPrice: 449.99, rating: 4.9, reviews: 3421, image: "🏎️", badge: "", description: "3599 pieces. 1:8 scale. Authentic Bugatti Chiron replica.", prime: false },
  { id: 8, name: "Yoga Mat Premium", category: "Sports", price: 49.99, originalPrice: 79.99, rating: 4.6, reviews: 7832, image: "🧘", badge: "Deal", description: "Extra thick 6mm non-slip mat with alignment lines.", prime: true },
  { id: 9, name: "Samsung 65\" 4K OLED TV", category: "Electronics", price: 1299.99, originalPrice: 1799.99, rating: 4.7, reviews: 4521, image: "📺", badge: "Deal", description: "4K OLED display with Dolby Atmos and Smart TV features.", prime: true },
  { id: 10, name: "Clean Code by Robert Martin", category: "Books", price: 27.99, originalPrice: 39.99, rating: 4.7, reviews: 9823, image: "📗", badge: "", description: "A handbook of agile software craftsmanship.", prime: true },
  { id: 11, name: "Coffee Maker Pro", category: "Home & Kitchen", price: 129.99, originalPrice: 179.99, rating: 4.5, reviews: 6234, image: "☕", badge: "Best Seller", description: "Brew the perfect cup every time with programmable settings.", prime: true },
  { id: 12, name: "Running Shoes Ultra", category: "Sports", price: 119.99, originalPrice: 159.99, rating: 4.6, reviews: 3298, image: "🏃", badge: "", description: "Lightweight, breathable, and cushioned for long runs.", prime: false },
];

const DEALS = [
  { id: 1, name: "Today's Deal", product: PRODUCTS[1], discount: 30, timeLeft: "08:42:15" },
  { id: 2, name: "Lightning Deal", product: PRODUCTS[4], discount: 20, timeLeft: "02:15:33" },
  { id: 3, name: "Limited Offer", product: PRODUCTS[7], discount: 37, timeLeft: "11:58:02" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#f0a500", fontSize: "13px", letterSpacing: "1px" }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const Discount = ({ original, current }) => {
  const pct = Math.round((1 - current / original) * 100);
  return <span style={{ background: "#cc0c39", color: "white", fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px" }}>-{pct}%</span>;
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const Navbar = ({ cartCount, onNavigate, currentPage, searchQuery, onSearch, user, onLogout }) => {
  const [query, setQuery] = useState(searchQuery || "");
  const [selectedCat, setSelectedCat] = useState("All");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
    onNavigate("products");
  };

  return (
    <header>
      {/* Main Nav */}
      <div style={{ background: "#131921", padding: "8px 16px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 1000 }}>
        {/* Logo */}
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "2px", minWidth: "130px", padding: "6px 8px", borderRadius: "3px", border: "1px solid transparent" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
          <span style={{ color: "white", fontSize: "22px", fontWeight: 800, fontFamily: "'Georgia', serif", letterSpacing: "-1px" }}>amazon</span>
          <span style={{ color: "#ff9900", fontSize: "22px", fontWeight: 800 }}>.</span>
          <span style={{ color: "#ff9900", fontSize: "10px", marginTop: "8px", fontFamily: "Georgia" }}>in</span>
        </div>

        {/* Location */}
        <div style={{ color: "white", fontSize: "11px", minWidth: "80px", cursor: "pointer", padding: "6px 8px", borderRadius: "3px", border: "1px solid transparent" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
          <div style={{ color: "#ccc" }}>Deliver to</div>
          <div style={{ fontWeight: 700, fontSize: "13px" }}>📍 India</div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", borderRadius: "4px", overflow: "hidden", height: "40px" }}>
          <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
            style={{ background: "#e3e6e6", border: "none", padding: "0 8px", fontSize: "12px", color: "#333", cursor: "pointer", outline: "none", borderRight: "1px solid #ccc" }}>
            <option>All</option>
            {CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
          </select>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search Amazon"
            style={{ flex: 1, border: "none", padding: "0 12px", fontSize: "14px", outline: "none" }} />
          <button type="submit" style={{ background: "#ff9900", border: "none", padding: "0 16px", cursor: "pointer", fontSize: "18px" }}>🔍</button>
        </form>

        {/* Account */}
        <div style={{ color: "white", fontSize: "12px", cursor: "pointer", padding: "6px 8px", borderRadius: "3px", border: "1px solid transparent", minWidth: "110px" }}
          onClick={() => user ? onLogout() : onNavigate("login")}
          onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
          <div style={{ color: "#ccc" }}>Hello, {user ? user.name : "sign in"}</div>
          <div style={{ fontWeight: 700, fontSize: "13px" }}>Account & Lists {user ? "▼" : ""}</div>
        </div>

        {/* Orders */}
        <div onClick={() => onNavigate("orders")} style={{ color: "white", fontSize: "12px", cursor: "pointer", padding: "6px 8px", borderRadius: "3px", border: "1px solid transparent" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
          <div style={{ color: "#ccc" }}>Returns</div>
          <div style={{ fontWeight: 700, fontSize: "13px" }}>& Orders</div>
        </div>

        {/* Cart */}
        <div onClick={() => onNavigate("cart")} style={{ color: "white", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", padding: "6px 8px", borderRadius: "3px", border: "1px solid transparent" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: "26px" }}>🛒</span>
            <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#ff9900", color: "#131921", borderRadius: "50%", fontSize: "11px", fontWeight: 800, width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: "13px" }}>Cart</span>
        </div>
      </div>

      {/* Sub Nav */}
      <div style={{ background: "#232f3e", padding: "4px 16px", display: "flex", gap: "4px", alignItems: "center", overflowX: "auto" }}>
        {["All", "Today's Deals", "Customer Service", "Registry", "Gift Cards", "Sell"].map(item => (
          <div key={item} style={{ color: "white", fontSize: "13px", padding: "6px 10px", whiteSpace: "nowrap", cursor: "pointer", borderRadius: "3px", border: "1px solid transparent" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
            {item === "All" ? "☰ All" : item}
          </div>
        ))}
      </div>
    </header>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = ({ onNavigate, onAddToCart, onProductClick }) => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const banners = [
    { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "Incredible Deals on Electronics", sub: "Up to 70% off on top brands", btn: "Shop Electronics" },
    { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", text: "Fashion for Every Season", sub: "New arrivals & exclusive styles", btn: "Shop Fashion" },
    { bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", text: "Home & Kitchen Essentials", sub: "Upgrade your space today", btn: "Shop Home" },
  ];

  useEffect(() => {
    const t = setInterval(() => setBannerIndex(i => (i + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = banners[bannerIndex];

  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      {/* Hero Banner */}
      <div style={{ background: b.bg, transition: "background 0.8s ease", padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ color: "white", fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 800, margin: "0 0 12px", fontFamily: "Georgia, serif" }}>{b.text}</h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", margin: "0 0 24px" }}>{b.sub}</p>
          <button onClick={() => onNavigate("products")}
            style={{ background: "#ff9900", color: "#131921", border: "none", padding: "14px 32px", borderRadius: "24px", fontSize: "16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,153,0,0.5)" }}>
            {b.btn} →
          </button>
        </div>
        {/* Dots */}
        <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
          {banners.map((_, i) => <div key={i} onClick={() => setBannerIndex(i)}
            style={{ width: i === bannerIndex ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === bannerIndex ? "white" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.3s" }} />)}
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 16px" }}>
        {/* Categories */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 16px", fontFamily: "Georgia, serif" }}>Shop by Category</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} onClick={() => onNavigate("products", cat.name)}
                style={{ background: cat.color, borderRadius: "8px", padding: "20px 12px", textAlign: "center", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>{cat.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Deals */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, fontFamily: "Georgia, serif" }}>Today's Deals</h2>
            <span onClick={() => onNavigate("products")} style={{ color: "#007185", cursor: "pointer", fontSize: "14px" }}>See all deals →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
            {DEALS.map(deal => (
              <div key={deal.id} onClick={() => onProductClick(deal.product)}
                style={{ border: "1px solid #e3e6e6", borderRadius: "8px", padding: "16px", cursor: "pointer", transition: "box-shadow 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
                <div style={{ background: "#cc0c39", color: "white", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", display: "inline-block", marginBottom: "8px" }}>
                  {deal.name} · {deal.discount}% off
                </div>
                <div style={{ fontSize: "48px", textAlign: "center", padding: "16px 0" }}>{deal.product.image}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px", lineHeight: "1.3" }}>{deal.product.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "#cc0c39" }}>₹{deal.product.price.toLocaleString()}</span>
                  <span style={{ fontSize: "12px", textDecoration: "line-through", color: "#888" }}>₹{deal.product.originalPrice.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "6px" }}>⏱ Ends in: {deal.timeLeft}</div>
                {/* Progress bar */}
                <div style={{ background: "#e3e6e6", borderRadius: "4px", height: "6px", marginTop: "8px", overflow: "hidden" }}>
                  <div style={{ background: "#cc0c39", width: `${30 + Math.random() * 60}%`, height: "100%", borderRadius: "4px" }} />
                </div>
                <div style={{ fontSize: "11px", color: "#cc0c39", fontWeight: 600, marginTop: "4px" }}>🔥 Limited time deal</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div style={{ background: "white", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, fontFamily: "Georgia, serif" }}>Best Sellers</h2>
            <span onClick={() => onNavigate("products")} style={{ color: "#007185", cursor: "pointer", fontSize: "14px" }}>See all →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
            {PRODUCTS.slice(0, 6).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onClick={() => onProductClick(product)} />
            ))}
          </div>
        </div>

        {/* Prime Banner */}
        <div style={{ background: "linear-gradient(135deg, #0f2942, #1a4a7a)", borderRadius: "8px", padding: "32px", textAlign: "center", color: "white", marginBottom: "20px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>👑</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Try Amazon Prime</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 20px" }}>Free fast delivery, exclusive deals & more</p>
          <button style={{ background: "#ff9900", color: "#131921", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#232f3e", color: "white", padding: "40px 20px", marginTop: "20px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "24px" }}>
          {[
            { title: "Get to Know Us", links: ["Careers", "Blog", "About Amazon", "Sustainability"] },
            { title: "Make Money with Us", links: ["Sell on Amazon", "Become Affiliate", "Advertise Your Products"] },
            { title: "Amazon Payment", links: ["Amazon Pay", "Amazon Business Card", "Gift Cards", "Amazon Cash"] },
            { title: "Let Us Help You", links: ["COVID-19 Info", "Your Account", "Your Orders", "Returns & Replacements"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 700 }}>{col.title}</h4>
              {col.links.map(l => <div key={l} style={{ fontSize: "13px", color: "#ccc", marginBottom: "6px", cursor: "pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #3d4f5c", fontSize: "13px", color: "#aaa" }}>
          <span style={{ fontSize: "20px", fontWeight: 800, fontFamily: "Georgia, serif", color: "white" }}>amazon</span>
          <span style={{ color: "#ff9900", fontSize: "20px" }}>.</span>
          <div style={{ marginTop: "8px" }}>© 2025 Amazon Clone. Built with React + Spring Boot.</div>
        </div>
      </footer>
    </div>
  );
};

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAddToCart, onClick }) => (
  <div style={{ border: "1px solid #e3e6e6", borderRadius: "8px", padding: "16px", cursor: "pointer", transition: "box-shadow 0.2s", background: "white", display: "flex", flexDirection: "column" }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
    {product.badge && (
      <div style={{ background: product.badge === "Best Seller" ? "#e17b31" : "#cc0c39", color: "white", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", display: "inline-block", marginBottom: "8px", alignSelf: "flex-start" }}>
        {product.badge}
      </div>
    )}
    <div onClick={onClick} style={{ fontSize: "52px", textAlign: "center", padding: "16px 0" }}>{product.image}</div>
    <div onClick={onClick} style={{ flex: 1 }}>
      <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", lineHeight: "1.4", color: "#0f1111" }}>{product.name}</div>
      <div style={{ marginBottom: "4px" }}><Stars rating={product.rating} /></div>
      <div style={{ fontSize: "11px", color: "#007185", marginBottom: "8px" }}>{product.reviews.toLocaleString()} reviews</div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "18px", fontWeight: 700, color: "#0f1111" }}>₹{product.price.toLocaleString()}</span>
        {product.originalPrice > product.price && <Discount original={product.originalPrice} current={product.price} />}
      </div>
      {product.prime && <div style={{ color: "#007185", fontSize: "11px", fontWeight: 600, marginTop: "4px" }}>✓ Prime FREE Delivery</div>}
    </div>
    <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
      style={{ marginTop: "12px", background: "#ff9900", border: "none", borderRadius: "20px", padding: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#131921", transition: "background 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.background = "#fa8900"}
      onMouseLeave={e => e.currentTarget.style.background = "#ff9900"}>
      Add to Cart
    </button>
  </div>
);

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
const ProductsPage = ({ onAddToCart, onProductClick, filterCategory, searchQuery }) => {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCat, setSelectedCat] = useState(filterCategory || "All");
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [primeOnly, setPrimeOnly] = useState(false);

  let filtered = PRODUCTS;
  if (selectedCat !== "All") filtered = filtered.filter(p => p.category === selectedCat);
  if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  if (primeOnly) filtered = filtered.filter(p => p.prime);
  filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 16px", display: "flex", gap: "20px" }}>
        {/* Sidebar */}
        <div style={{ width: "220px", flexShrink: 0 }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 700 }}>Department</h3>
            {["All", ...CATEGORIES.map(c => c.name)].map(cat => (
              <div key={cat} onClick={() => setSelectedCat(cat)}
                style={{ padding: "4px 0", fontSize: "14px", cursor: "pointer", color: selectedCat === cat ? "#c45500" : "#007185", fontWeight: selectedCat === cat ? 700 : 400 }}>
                {cat}
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 700 }}>Prime</h3>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
              <input type="checkbox" checked={primeOnly} onChange={e => setPrimeOnly(e.target.checked)} />
              Prime Eligible
            </label>
          </div>
          <div style={{ background: "white", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 700 }}>Price</h3>
            {[["Under ₹500", 0, 500], ["₹500 - ₹2,000", 500, 2000], ["₹2,000 - ₹50,000", 2000, 50000], ["All Prices", 0, 99999]].map(([label, min, max]) => (
              <div key={label} onClick={() => setPriceRange([min, max])}
                style={{ padding: "4px 0", fontSize: "14px", cursor: "pointer", color: priceRange[0] === min && priceRange[1] === max ? "#c45500" : "#007185", fontWeight: priceRange[0] === min && priceRange[1] === max ? 700 : 400 }}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1 }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {searchQuery && <><b>Results for "{searchQuery}"</b> · </>}
              <b>{filtered.length}</b> results
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px" }}>Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding: "4px 8px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onClick={() => onProductClick(p)} />)}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#888" }}>
                <div style={{ fontSize: "48px" }}>🔍</div>
                <p>No products found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PRODUCT DETAIL ────────────────────────────────────────────────────────────
const ProductDetailPage = ({ product, onAddToCart, onNavigate }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 16px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: "13px", color: "#007185", marginBottom: "16px" }}>
          <span onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Home</span> &gt;{" "}
          <span onClick={() => onNavigate("products", product.category)} style={{ cursor: "pointer" }}>{product.category}</span> &gt;{" "}
          <span style={{ color: "#555" }}>{product.name}</span>
        </div>

        <div style={{ background: "white", borderRadius: "8px", padding: "24px", display: "flex", gap: "32px", flexWrap: "wrap", marginBottom: "20px" }}>
          {/* Image */}
          <div style={{ width: "320px", flexShrink: 0, textAlign: "center" }}>
            <div style={{ fontSize: "120px", padding: "40px", background: "#f8f8f8", borderRadius: "8px", marginBottom: "16px" }}>{product.image}</div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: "280px" }}>
            {product.badge && (
              <div style={{ background: "#e17b31", color: "white", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", display: "inline-block", marginBottom: "8px" }}>
                #{product.badge}
              </div>
            )}
            <h1 style={{ fontSize: "22px", fontWeight: 400, margin: "0 0 8px", fontFamily: "Georgia, serif", lineHeight: 1.4 }}>{product.name}</h1>
            <div style={{ color: "#007185", fontSize: "13px", marginBottom: "4px" }}>Visit the Amazon Store</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Stars rating={product.rating} />
              <span style={{ color: "#007185", fontSize: "13px" }}>{product.rating}</span>
              <span style={{ color: "#007185", fontSize: "13px" }}>{product.reviews.toLocaleString()} ratings</span>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #e3e6e6", margin: "12px 0" }} />
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", color: "#555" }}>Price:</span>
                <span style={{ fontSize: "28px", fontWeight: 700, color: "#cc0c39" }}>₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span style={{ fontSize: "14px", textDecoration: "line-through", color: "#888" }}>₹{product.originalPrice.toLocaleString()}</span>
                    <Discount original={product.originalPrice} current={product.price} />
                  </>
                )}
              </div>
              {product.prime && <div style={{ color: "#007185", fontSize: "13px", fontWeight: 600, marginTop: "4px" }}>✓ FREE Delivery by Prime</div>}
            </div>
            <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.6, marginBottom: "16px" }}>{product.description}</p>
            <hr style={{ border: "none", borderTop: "1px solid #e3e6e6", margin: "12px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px" }}>Qty:</span>
              <select value={qty} onChange={e => setQty(Number(e.target.value))}
                style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" }}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={handleAdd}
                style={{ background: added ? "#5cb85c" : "#ff9900", color: added ? "white" : "#131921", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", minWidth: "160px" }}>
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
              <button style={{ background: "#ffb703", color: "#131921", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
                Buy Now
              </button>
            </div>
          </div>

          {/* Buy Box */}
          <div style={{ width: "220px", border: "1px solid #e3e6e6", borderRadius: "8px", padding: "16px", alignSelf: "flex-start" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#cc0c39", marginBottom: "4px" }}>₹{product.price.toLocaleString()}</div>
            {product.prime && <div style={{ color: "#007185", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>✓ FREE Prime Delivery</div>}
            <div style={{ fontSize: "12px", color: "#333", marginBottom: "4px" }}>In Stock</div>
            <div style={{ color: "#007b23", fontWeight: 600, fontSize: "14px", marginBottom: "12px" }}>• Available</div>
            <button onClick={handleAdd}
              style={{ width: "100%", background: "#ff9900", color: "#131921", border: "none", padding: "10px", borderRadius: "20px", fontSize: "14px", fontWeight: 700, cursor: "pointer", marginBottom: "8px" }}>
              Add to Cart
            </button>
            <button style={{ width: "100%", background: "#ffb703", color: "#131921", border: "none", padding: "10px", borderRadius: "20px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
              Buy Now
            </button>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "12px" }}>Sold by Amazon</div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 16px", fontFamily: "Georgia, serif" }}>Related Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
              {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onClick={() => {}} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CART PAGE ────────────────────────────────────────────────────────────────
const CartPage = ({ cart, onRemove, onUpdateQty, onNavigate }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cart.length === 0) return (
    <div style={{ background: "#eaeded", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "8px", padding: "60px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
        <h2 style={{ fontFamily: "Georgia, serif", margin: "0 0 12px" }}>Your Amazon Cart is empty</h2>
        <p style={{ color: "#555", marginBottom: "24px" }}>Add items to get started</p>
        <button onClick={() => onNavigate("products")}
          style={{ background: "#ff9900", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 16px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Cart Items */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 400, margin: "0 0 4px", fontFamily: "Georgia, serif" }}>Shopping Cart</h1>
            <div style={{ color: "#007185", fontSize: "13px", textAlign: "right", marginBottom: "12px" }}>Price</div>
            <hr style={{ border: "none", borderTop: "1px solid #e3e6e6" }} />

            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: "16px", padding: "16px 0", borderBottom: "1px solid #e3e6e6", flexWrap: "wrap" }}>
                <div style={{ fontSize: "60px", background: "#f8f8f8", borderRadius: "8px", padding: "12px", width: "80px", textAlign: "center", flexShrink: 0 }}>
                  {item.image}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px", color: "#007185", cursor: "pointer" }}>{item.name}</div>
                  {item.prime && <div style={{ color: "#007185", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>✓ Prime</div>}
                  <div style={{ color: "#007b23", fontSize: "13px", marginBottom: "8px" }}>In Stock</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <select value={item.qty} onChange={e => onUpdateQty(item.id, Number(e.target.value))}
                      style={{ padding: "4px 8px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px" }}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span style={{ color: "#666" }}>|</span>
                    <span onClick={() => onRemove(item.id)} style={{ color: "#c45500", fontSize: "13px", cursor: "pointer" }}>Delete</span>
                    <span style={{ color: "#666" }}>|</span>
                    <span style={{ color: "#c45500", fontSize: "13px", cursor: "pointer" }}>Save for later</span>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: "18px", flexShrink: 0 }}>₹{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}

            <div style={{ textAlign: "right", fontSize: "18px", padding: "16px 0" }}>
              Subtotal ({itemCount} items): <span style={{ fontWeight: 700 }}>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ width: "280px", flexShrink: 0 }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
            {cart.some(i => i.prime) && (
              <div style={{ color: "#007b23", fontSize: "13px", marginBottom: "12px" }}>✓ Your order qualifies for FREE Delivery</div>
            )}
            <div style={{ fontSize: "18px", marginBottom: "16px" }}>
              Subtotal ({itemCount} items): <span style={{ fontWeight: 700 }}>₹{total.toLocaleString()}</span>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginBottom: "16px", cursor: "pointer" }}>
              <input type="checkbox" /> This is a gift
            </label>
            <button onClick={() => onNavigate("checkout")}
              style={{ width: "100%", background: "#ff9900", color: "#131921", border: "none", padding: "12px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer", marginBottom: "8px" }}>
              Proceed to Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin, onNavigate }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (isRegister && !form.name) { setError("Please enter your name."); return; }
    onLogin({ name: form.name || form.email.split("@")[0], email: form.email });
    onNavigate("home");
  };

  return (
    <div style={{ background: "#eaeded", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", marginBottom: "24px" }}>
        <span style={{ fontSize: "28px", fontWeight: 800, fontFamily: "Georgia, serif", color: "#131921" }}>amazon</span>
        <span style={{ color: "#ff9900", fontSize: "28px" }}>.</span>
      </div>
      <div style={{ background: "white", border: "1px solid #e3e6e6", borderRadius: "8px", padding: "28px", width: "100%", maxWidth: "360px" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: "22px", fontWeight: 400, fontFamily: "Georgia, serif" }}>{isRegister ? "Create Account" : "Sign in"}</h2>
        {error && <div style={{ background: "#fff5f5", border: "1px solid #f5c6c6", borderRadius: "4px", padding: "10px", fontSize: "13px", color: "#c0392b", marginBottom: "16px" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>Your name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="First and last name"
                style={{ width: "100%", padding: "8px", border: "1px solid #aaa", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
          )}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>Email</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email address"
              style={{ width: "100%", padding: "8px", border: "1px solid #aaa", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>Password</label>
            <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} type="password" placeholder="At least 6 characters"
              style={{ width: "100%", padding: "8px", border: "1px solid #aaa", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }} />
          </div>
          <button type="submit"
            style={{ width: "100%", background: "#ff9900", color: "#131921", border: "none", padding: "10px", borderRadius: "20px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
            {isRegister ? "Create your Amazon account" : "Sign in"}
          </button>
        </form>
        {!isRegister && (
          <div style={{ fontSize: "12px", color: "#555", textAlign: "center", marginTop: "16px" }}>
            By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.
          </div>
        )}
        <hr style={{ border: "none", borderTop: "1px solid #e3e6e6", margin: "20px 0" }} />
        <div style={{ textAlign: "center", fontSize: "14px" }}>
          {isRegister ? "Already have an account?" : "New to Amazon?"}{" "}
          <span onClick={() => { setIsRegister(!isRegister); setError(""); }}
            style={{ color: "#c45500", cursor: "pointer" }}>
            {isRegister ? "Sign in" : "Create your Amazon account"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── CHECKOUT PAGE ─────────────────────────────────────────────────────────────
const CheckoutPage = ({ cart, user, onNavigate, onPlaceOrder }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: user?.name || "", street: "", city: "", state: "", pin: "", phone: "" });
  const [payment, setPayment] = useState("cod");
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleOrder = () => {
    onPlaceOrder();
    setStep(3);
  };

  if (step === 3) return (
    <div style={{ background: "#eaeded", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "8px", padding: "60px", textAlign: "center", maxWidth: "480px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ color: "#007b23", fontFamily: "Georgia, serif", margin: "0 0 12px" }}>Order Placed!</h2>
        <p style={{ color: "#555", marginBottom: "8px" }}>Thank you for your order. Your order #AMZ-{Math.floor(Math.random()*900000+100000)} has been confirmed.</p>
        <p style={{ color: "#007185", fontSize: "13px", marginBottom: "24px" }}>Estimated delivery: 2-5 business days</p>
        <button onClick={() => onNavigate("home")}
          style={{ background: "#ff9900", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 16px" }}>
        {/* Steps */}
        <div style={{ display: "flex", gap: "0", marginBottom: "20px", background: "white", borderRadius: "8px", overflow: "hidden" }}>
          {["Address", "Payment", "Review"].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: "12px", textAlign: "center", background: step === i + 1 ? "#131921" : step > i + 1 ? "#232f3e" : "white", color: step >= i + 1 ? "white" : "#888", fontSize: "14px", fontWeight: step === i + 1 ? 700 : 400, cursor: step <= i + 1 ? "default" : "pointer" }}
              onClick={() => step > i + 1 && setStep(i + 1)}>
              {step > i + 1 ? "✓ " : ""}{i + 1}. {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ background: "white", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontFamily: "Georgia, serif" }}>Delivery Address</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[["Full name", "name"], ["Street address", "street"], ["City", "city"], ["State", "state"], ["PIN code", "pin"], ["Phone number", "phone"]].map(([label, key]) => (
                <div key={key} style={{ gridColumn: key === "street" ? "1/-1" : "auto" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>{label}</label>
                  <input value={address[key]} onChange={e => setAddress({ ...address, [key]: e.target.value })}
                    style={{ width: "100%", padding: "8px", border: "1px solid #aaa", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)}
              style={{ marginTop: "20px", background: "#ff9900", color: "#131921", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
              Use this address
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: "white", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontFamily: "Georgia, serif" }}>Payment Method</h2>
            {[["cod", "💵", "Cash on Delivery"], ["card", "💳", "Credit / Debit Card"], ["upi", "📱", "UPI Payment"], ["netbanking", "🏦", "Net Banking"]].map(([val, icon, label]) => (
              <label key={val} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", border: `2px solid ${payment === val ? "#ff9900" : "#e3e6e6"}`, borderRadius: "8px", marginBottom: "10px", cursor: "pointer", background: payment === val ? "#fffbf0" : "white" }}>
                <input type="radio" name="payment" value={val} checked={payment === val} onChange={() => setPayment(val)} />
                <span style={{ fontSize: "22px" }}>{icon}</span>
                <span style={{ fontSize: "15px", fontWeight: payment === val ? 700 : 400 }}>{label}</span>
              </label>
            ))}
            <button onClick={() => setStep(3 - 1 + 1) || setStep(3)}
              style={{ marginTop: "8px", background: "#ff9900", color: "#131921", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
              Use this payment method
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: "white", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontFamily: "Georgia, serif" }}>Review your order</h2>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e3e6e6" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "28px" }}>{item.image}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>Qty: {item.qty}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>₹{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
            <div style={{ textAlign: "right", padding: "16px 0", fontSize: "18px" }}>
              Order Total: <span style={{ fontWeight: 700 }}>₹{total.toLocaleString()}</span>
            </div>
            <button onClick={handleOrder}
              style={{ width: "100%", background: "#ff9900", color: "#131921", border: "none", padding: "14px", borderRadius: "24px", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
              Place your order
            </button>
            <p style={{ fontSize: "11px", color: "#888", textAlign: "center", marginTop: "12px" }}>
              By placing your order, you agree to Amazon's privacy notice and conditions of use.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
const OrdersPage = ({ orders }) => (
  <div style={{ background: "#eaeded", minHeight: "100vh" }}>
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px 16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 400, fontFamily: "Georgia, serif", margin: "0 0 20px" }}>Your Orders</h1>
      {orders.length === 0 ? (
        <div style={{ background: "white", borderRadius: "8px", padding: "60px", textAlign: "center" }}>
          <div style={{ fontSize: "48px" }}>📦</div>
          <h2 style={{ fontFamily: "Georgia, serif" }}>No orders yet</h2>
          <p style={{ color: "#888" }}>When you place orders, they'll appear here.</p>
        </div>
      ) : orders.map((order, i) => (
        <div key={i} style={{ background: "white", borderRadius: "8px", marginBottom: "16px", overflow: "hidden" }}>
          <div style={{ background: "#f7f7f7", padding: "12px 20px", display: "flex", gap: "32px", flexWrap: "wrap", borderBottom: "1px solid #e3e6e6" }}>
            <div><div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase" }}>Order placed</div><div style={{ fontSize: "14px", fontWeight: 600 }}>{order.date}</div></div>
            <div><div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase" }}>Total</div><div style={{ fontSize: "14px", fontWeight: 600 }}>₹{order.total.toLocaleString()}</div></div>
            <div style={{ marginLeft: "auto" }}><div style={{ fontSize: "11px", color: "#555" }}>Order #{order.id}</div></div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ color: "#007b23", fontWeight: 700, marginBottom: "12px" }}>✓ Delivered</div>
            {order.items.map(item => (
              <div key={item.id} style={{ display: "flex", gap: "12px", marginBottom: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "28px" }}>{item.image}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#007185" }}>{item.name}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>Qty: {item.qty} · ₹{item.price.toLocaleString()} each</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);

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

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✓ "${product.name}" added to cart`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));

  const productClick = (product) => {
    setSelectedProduct(product);
    navigate("product");
  };

  const placeOrder = () => {
    const newOrder = {
      id: `AMZ-${Math.floor(Math.random() * 900000 + 100000)}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      items: cart,
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage onNavigate={navigate} onAddToCart={addToCart} onProductClick={productClick} />;
      case "products": return <ProductsPage onAddToCart={addToCart} onProductClick={productClick} filterCategory={filterCategory} searchQuery={searchQuery} />;
      case "product": return selectedProduct ? <ProductDetailPage product={selectedProduct} onAddToCart={addToCart} onNavigate={navigate} /> : null;
      case "cart": return <CartPage cart={cart} onRemove={removeFromCart} onUpdateQty={updateQty} onNavigate={navigate} />;
      case "checkout": return <CheckoutPage cart={cart} user={user} onNavigate={navigate} onPlaceOrder={placeOrder} />;
      case "login": return <LoginPage onLogin={setUser} onNavigate={navigate} />;
      case "orders": return <OrdersPage orders={orders} />;
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Amazon Ember', Arial, sans-serif", minHeight: "100vh" }}>
      {page !== "login" && (
        <Navbar
          cartCount={cartCount}
          onNavigate={navigate}
          currentPage={page}
          searchQuery={searchQuery}
          onSearch={q => { setSearchQuery(q); navigate("products"); }}
          user={user}
          onLogout={() => { setUser(null); navigate("home"); }}
        />
      )}
      {renderPage()}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#232f3e", color: "white", padding: "12px 24px", borderRadius: "24px", fontSize: "14px", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", zIndex: 9999, animation: "fadeIn 0.2s ease" }}>
          {toast}
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  );
}
