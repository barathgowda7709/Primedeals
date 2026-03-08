import { useState, useEffect } from "react";
import * as api from "./api";

const CATEGORIES = [
  { id: 1, name: "Electronics", icon: "💻", color: "#e8f4f8" },
  { id: 2, name: "Books", icon: "📚", color: "#fef9e7" },
  { id: 3, name: "Clothing", icon: "👕", color: "#fdf2f8" },
  { id: 4, name: "Home & Kitchen", icon: "🏠", color: "#f0fff4" },
  { id: 5, name: "Sports", icon: "⚽", color: "#fff5f5" },
  { id: 6, name: "Toys", icon: "🎮", color: "#f5f0ff" },
];

const CATEGORY_ICONS = {
  Electronics: "💻", Books: "📖", Clothing: "👕",
  "Home & Kitchen": "🏠", Sports: "⚽", Toys: "🎮",
  default: "📦",
};
const getIcon = (category) => CATEGORY_ICONS[category] || CATEGORY_ICONS.default;

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#f0a500", fontSize: "13px", letterSpacing: "1px" }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const Spinner = () => (
  <div style={{ textAlign: "center", padding: "60px" }}>
    <div style={{ fontSize: "32px", animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</div>
    <p style={{ color: "#888", marginTop: "12px" }}>Loading...</p>
  </div>
);

const Navbar = ({ cartCount, onNavigate, searchQuery, onSearch, user, onLogout, products = [] }) => {
  const [query, setQuery] = useState(searchQuery || "");
  useEffect(() => { setQuery(searchQuery || ""); }, [searchQuery]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = query.trim().length > 0
    ? products
        .filter(p => p.name?.toLowerCase().includes(query.toLowerCase()))
        .map(p => p.name)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 8)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
    onNavigate("products");
  };

  const pickSuggestion = (s) => {
    setQuery(s);
    setShowSuggestions(false);
    onSearch(s);
    onNavigate("products");
  };

  const highlightMatch = (text, q) => {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <span style={{ color: "#131921" }}>{text}</span>;
    return (
      <span>
        <span style={{ color: "#888" }}>{text.slice(0, idx)}</span>
        <span style={{ color: "#131921", fontWeight: 700 }}>{text.slice(idx, idx + q.length)}</span>
        <span style={{ color: "#888" }}>{text.slice(idx + q.length)}</span>
      </span>
    );
  };
  return (
    <header>
      <div style={{ background: "#131921", padding: "8px 16px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 1000 }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "2px", minWidth: "130px", padding: "6px 8px", borderRadius: "3px", border: "1px solid transparent" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
          <span style={{ color: "white", fontSize: "22px", fontWeight: 800, fontFamily: "'Georgia', serif", letterSpacing: "-1px" }}>amazon</span>
          <span style={{ color: "#ff9900", fontSize: "22px", fontWeight: 800 }}>.</span>
          <span style={{ color: "#ff9900", fontSize: "10px", marginTop: "8px" }}>in</span>
        </div>
        <div style={{ color: "white", fontSize: "11px", minWidth: "80px", padding: "6px 8px", borderRadius: "3px", border: "1px solid transparent" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
          <div style={{ color: "#ccc" }}>Deliver to</div>
          <div style={{ fontWeight: 700, fontSize: "13px" }}>📍 India</div>
        </div>
        <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", borderRadius: "4px", overflow: "hidden", height: "40px", position: "relative" }}>
          <select style={{ background: "#e3e6e6", border: "none", padding: "0 8px", fontSize: "12px", color: "#333", cursor: "pointer", outline: "none", borderRight: "1px solid #ccc" }}>
            <option>All</option>
            {CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
          </select>
          <div style={{ flex: 1, position: "relative" }}>
            <input value={query}
              onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search Amazon"
              style={{ width: "100%", height: "100%", border: "none", padding: "0 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            {showSuggestions && suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #ccc", borderTop: "none", borderRadius: "0 0 4px 4px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 9999 }}>
                {suggestions.map((s, i) => (
                  <div key={i} onMouseDown={() => pickSuggestion(s)}
                    style={{ padding: "9px 14px", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: "#131921" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0f2f2"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <span style={{ color: "#aaa", fontSize: "12px" }}>🔍</span>
                    {highlightMatch(s, query)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" style={{ background: "#ff9900", border: "none", padding: "0 16px", cursor: "pointer", fontSize: "18px" }}>🔍</button>
        </form>
        <div style={{ position: "relative" }}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}>
          <div style={{ color: "white", fontSize: "12px", cursor: "pointer", padding: "6px 8px", borderRadius: "3px", border: "1px solid transparent", minWidth: "110px" }}
            onClick={() => !user && onNavigate("login")}
            onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
            <div style={{ color: "#ccc" }}>Hello, {user ? user.name : "sign in"}</div>
            <div style={{ fontWeight: 700, fontSize: "13px" }}>Account & Lists ▾</div>
          </div>
          {user && showDropdown && (
            <div style={{ position: "absolute", top: "100%", right: 0, background: "white", borderRadius: "4px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", minWidth: "220px", zIndex: 9999, padding: "8px 0", border: "1px solid #e3e6e6" }}>
              <div style={{ padding: "8px 16px 6px", borderBottom: "1px solid #e3e6e6", marginBottom: "4px" }}>
                <div style={{ fontSize: "12px", color: "#555" }}>Signed in as</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#131921" }}>{user.name}</div>
              </div>
              {[
                { label: "Your Account", icon: "👤", page: "account" },
                { label: "Your Orders", icon: "📦", page: "orders" },
                { label: "Returns", icon: "↩️", page: "orders" },
                { label: "Your Seller Account", icon: "🏪", page: null },
                { label: "Membership & Subscriptions", icon: "⭐", page: null },
              ].map(item => (
                <div key={item.label}
                  onClick={() => { if (item.page) { onNavigate(item.page); setShowDropdown(false); } }}
                  style={{ padding: "9px 16px", fontSize: "13px", color: "#131921", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}>
                  <span>{item.icon}</span> {item.label}
                </div>
              ))}
              <div style={{ borderTop: "1px solid #e3e6e6", marginTop: "4px" }}>
                <div onClick={() => { onLogout(); setShowDropdown(false); }}
                  style={{ padding: "9px 16px", fontSize: "13px", color: "#c7511f", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff5ee"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}>
                  <span>🚪</span> Sign Out
                </div>
              </div>
            </div>
          )}
        </div>
        <div onClick={() => onNavigate("orders")} style={{ color: "white", fontSize: "12px", cursor: "pointer", padding: "6px 8px", borderRadius: "3px", border: "1px solid transparent" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
          <div style={{ color: "#ccc" }}>Returns</div>
          <div style={{ fontWeight: 700, fontSize: "13px" }}>& Orders</div>
        </div>
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
      <div style={{ background: "#232f3e", padding: "4px 16px", display: "flex", gap: "4px", alignItems: "center", overflowX: "auto" }}>
        {["All", "Today's Deals", "Customer Service", "Gift Cards", "Sell"].map(item => (
          <div key={item} onClick={() => item === "Customer Service" ? onNavigate("account", "contact") : null}
            style={{ color: "white", fontSize: "13px", padding: "6px 10px", whiteSpace: "nowrap", cursor: "pointer", borderRadius: "3px", border: "1px solid transparent" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
            {item === "All" ? "☰ All" : item}
          </div>
        ))}
      </div>
    </header>
  );
};

const ProductCard = ({ product, onAddToCart, onClick, cartItem, onRemoveFromCart }) => (
  <div style={{ border: "1px solid #e3e6e6", borderRadius: "8px", padding: "16px", cursor: "pointer", transition: "box-shadow 0.2s", background: "white", display: "flex", flexDirection: "column" }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
    <div onClick={onClick} style={{ fontSize: "52px", textAlign: "center", padding: "16px 0" }}>
      {product.imageUrl && product.imageUrl.startsWith("http")
        ? <img src={product.imageUrl} alt={product.name} style={{ width: "80px", height: "80px", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
        : null}
      <span>{getIcon(product.category)}</span>
    </div>
    <div onClick={onClick} style={{ flex: 1 }}>
      <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", lineHeight: "1.4", color: "#0f1111" }}>{product.name}</div>
      <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>{product.brand}</div>
      <div style={{ marginBottom: "4px" }}><Stars rating={product.rating || 0} /></div>
      <div style={{ fontSize: "11px", color: "#007185", marginBottom: "8px" }}>{product.numReviews || 0} reviews</div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "18px", fontWeight: 700, color: "#0f1111" }}>₹{product.price?.toLocaleString()}</span>
      </div>
      <div style={{ color: "#007185", fontSize: "11px", fontWeight: 600, marginTop: "4px" }}>✓ Prime FREE Delivery</div>
    </div>
    {cartItem ? (
      <div style={{ display: "flex", alignItems: "center", marginTop: "12px", border: "1px solid #ddd", borderRadius: "20px", overflow: "hidden" }}>
        <button onClick={(e) => { e.stopPropagation(); onRemoveFromCart(product.id, cartItem.cartItemId); }}
          style={{ flex: 1, background: "#f8f8f8", border: "none", padding: "8px", cursor: "pointer", color: "#c45500", fontSize: "14px", fontWeight: 700 }}>🗑</button>
        <span style={{ flex: 1, textAlign: "center", fontSize: "14px", fontWeight: 700, color: "#0f1111" }}>{cartItem.qty}</span>
        <button onClick={(e) => { e.stopPropagation(); if(cartItem.qty < 5) onAddToCart(product); }}
          disabled={cartItem.qty >= 5}
          style={{ flex: 1, background: cartItem.qty >= 5 ? "#ccc" : "#ff9900", border: "none", padding: "8px", cursor: cartItem.qty >= 5 ? "not-allowed" : "pointer", color: "#131921", fontSize: "18px", fontWeight: 700 }}>+</button>
      </div>
    ) : (
      <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
        style={{ marginTop: "12px", background: "#ff9900", border: "none", borderRadius: "20px", padding: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", color: "#131921", transition: "background 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "#fa8900"}
        onMouseLeave={e => e.currentTarget.style.background = "#ff9900"}>
        Add to Cart
      </button>
    )}
  </div>
);

const HomePage = ({ onNavigate, onAddToCart, onProductClick, products, cart, onRemoveFromCart }) => {
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
        <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
          {banners.map((_, i) => <div key={i} onClick={() => setBannerIndex(i)}
            style={{ width: i === bannerIndex ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === bannerIndex ? "white" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.3s" }} />)}
        </div>
      </div>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 16px" }}>
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
        <div style={{ background: "white", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, fontFamily: "Georgia, serif" }}>Best Sellers</h2>
            <span onClick={() => onNavigate("products")} style={{ color: "#007185", cursor: "pointer", fontSize: "14px" }}>See all →</span>
          </div>
          {products.length === 0 ? <Spinner /> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
              {products.slice(0, 6).map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onClick={() => onProductClick(p)} cartItem={cart.find(i => i.id === p.id)} onRemoveFromCart={onRemoveFromCart} />
              ))}
            </div>
          )}
        </div>
        <div style={{ background: "linear-gradient(135deg, #0f2942, #1a4a7a)", borderRadius: "8px", padding: "32px", textAlign: "center", color: "white", marginBottom: "20px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>👑</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Try Amazon Prime</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 20px" }}>Free fast delivery, exclusive deals & more</p>
          <button style={{ background: "#ff9900", color: "#131921", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
            Start Free Trial
          </button>
        </div>
      </div>
      <footer style={{ background: "#232f3e", color: "white", padding: "40px 20px", marginTop: "20px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "24px" }}>
          {[
            { title: "Get to Know Us", links: ["Careers", "Blog", "About Amazon", "Sustainability"] },
            { title: "Make Money with Us", links: ["Sell on Amazon", "Become Affiliate", "Advertise"] },
            { title: "Amazon Payment", links: ["Amazon Pay", "Gift Cards", "Amazon Cash"] },
            { title: "Let Us Help You", links: ["Your Account", "Your Orders", "Returns & Replacements"] },
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
          <div style={{ marginTop: "8px" }}>© 2025 Prime Deals. Built with React + Spring Boot.</div>
        </div>
      </footer>
    </div>
  );
};

const ProductsPage = ({ onAddToCart, onProductClick, filterCategory, searchQuery, products, loading, cart, onRemoveFromCart, onLoadMore, hasMore }) => {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCat, setSelectedCat] = useState(filterCategory || "All");
  let filtered = products;
  if (selectedCat !== "All") filtered = filtered.filter(p => p.category === selectedCat);
  if (searchQuery) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 16px", display: "flex", gap: "20px" }}>
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
          <div style={{ background: "white", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 700 }}>Sort By</h3>
            {[["featured", "Featured"], ["price-asc", "Price: Low to High"], ["price-desc", "Price: High to Low"], ["rating", "Top Rated"]].map(([val, label]) => (
              <div key={val} onClick={() => setSortBy(val)}
                style={{ padding: "4px 0", fontSize: "14px", cursor: "pointer", color: sortBy === val ? "#c45500" : "#007185", fontWeight: sortBy === val ? 700 : 400 }}>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {searchQuery && <><b>Results for "{searchQuery}"</b> · </>}
              <b>{filtered.length}</b> results
            </div>
          </div>
          {loading ? <Spinner /> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onClick={() => onProductClick(p)} cartItem={cart.find(i => i.id === p.id)} onRemoveFromCart={onRemoveFromCart} />)}
              {filtered.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#888" }}>
                  <div style={{ fontSize: "48px" }}>🔍</div>
                  <p>No products found. Try a different search or category.</p>
                </div>
              )}
            </div>
          )}
          {!searchQuery && !filterCategory && hasMore && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <button onClick={onLoadMore}
                style={{ background: "#ff9900", border: "none", borderRadius: "4px", padding: "10px 32px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductDetailPage = ({ product, onAddToCart, onNavigate }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ fontSize: "13px", color: "#007185", marginBottom: "16px" }}>
          <span onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Home</span> &gt;{" "}
          <span onClick={() => onNavigate("products")} style={{ cursor: "pointer" }}>{product.category}</span> &gt;{" "}
          <span style={{ color: "#555" }}>{product.name}</span>
        </div>
        <div style={{ background: "white", borderRadius: "8px", padding: "24px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
          <div style={{ width: "320px", flexShrink: 0, textAlign: "center" }}>
            <div style={{ fontSize: "100px", padding: "40px", background: "#f8f8f8", borderRadius: "8px" }}>
              {getIcon(product.category)}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: "280px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 400, margin: "0 0 4px", fontFamily: "Georgia, serif", lineHeight: 1.4 }}>{product.name}</h1>
            <div style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>by {product.brand}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Stars rating={product.rating || 0} />
              <span style={{ color: "#007185", fontSize: "13px" }}>{product.numReviews || 0} ratings</span>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #e3e6e6", margin: "12px 0" }} />
            <div style={{ fontSize: "28px", fontWeight: 700, color: "#cc0c39", marginBottom: "8px" }}>₹{product.price?.toLocaleString()}</div>
            <div style={{ color: "#007185", fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>✓ FREE Delivery by Prime</div>
            <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.6, marginBottom: "16px" }}>{product.description}</p>
            <div style={{ color: "#007b23", fontWeight: 600, fontSize: "14px", marginBottom: "16px" }}>In Stock ({product.stock} left)</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <span style={{ fontSize: "14px" }}>Qty:</span>
              <select value={qty} onChange={e => setQty(Number(e.target.value))}
                style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" }}>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleAdd}
                style={{ background: added ? "#5cb85c" : "#ff9900", color: added ? "white" : "#131921", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
              <button style={{ background: "#ffb703", color: "#131921", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, onRemove, onUpdateQty, onNavigate }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cart.length === 0) return (
    <div style={{ background: "#eaeded", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "8px", padding: "60px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🛒</div>
        <h2 style={{ fontFamily: "Georgia, serif", margin: "0 0 12px" }}>Your Cart is empty</h2>
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
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 400, margin: "0 0 4px", fontFamily: "Georgia, serif" }}>Shopping Cart</h1>
            <hr style={{ border: "none", borderTop: "1px solid #e3e6e6", margin: "12px 0" }} />
            {cart.map(item => (
              <div key={item.cartItemId} style={{ display: "flex", gap: "16px", padding: "16px 0", borderBottom: "1px solid #e3e6e6", flexWrap: "wrap" }}>
                <div style={{ fontSize: "52px", background: "#f8f8f8", borderRadius: "8px", padding: "12px", width: "80px", textAlign: "center", flexShrink: 0 }}>
                  {getIcon(item.category)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px", color: "#007185" }}>{item.name}</div>
                  <div style={{ color: "#007185", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>✓ Prime</div>
                  <div style={{ color: "#007b23", fontSize: "13px", marginBottom: "8px" }}>In Stock</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <select value={item.qty} onChange={e => onUpdateQty(item.id, Number(e.target.value))}
                      style={{ padding: "4px 8px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px" }}>
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span style={{ color: "#666" }}>|</span>
                    <span onClick={() => onRemove(item.id, item.cartItemId)} style={{ color: "#c45500", fontSize: "13px", cursor: "pointer" }}>Delete</span>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: "18px" }}>₹{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
            <div style={{ textAlign: "right", fontSize: "18px", padding: "16px 0" }}>
              Subtotal ({itemCount} items): <span style={{ fontWeight: 700 }}>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div style={{ width: "280px", flexShrink: 0 }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
            <div style={{ color: "#007b23", fontSize: "13px", marginBottom: "12px" }}>✓ Your order qualifies for FREE Delivery</div>
            <div style={{ fontSize: "18px", marginBottom: "16px" }}>
              Subtotal ({itemCount} items): <span style={{ fontWeight: 700 }}>₹{total.toLocaleString()}</span>
            </div>
            <button onClick={() => onNavigate("checkout")}
              style={{ width: "100%", background: "#ff9900", color: "#131921", border: "none", padding: "12px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
              Proceed to Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin, onNavigate }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await api.register({ name: form.name, email: form.email, password: form.password });
        const res = await api.login({ email: form.email, password: form.password });
        localStorage.setItem("token", res.data.token);
        onLogin({ name: form.name, email: form.email });
      } else {
        const res = await api.login({ email: form.email, password: form.password });
        localStorage.setItem("token", res.data.token);
        onLogin({ name: res.data.name || form.email.split("@")[0], email: form.email });
      }
      onNavigate("home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ background: "#eaeded", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", marginBottom: "24px" }}>
        <span style={{ fontSize: "28px", fontWeight: 800, fontFamily: "Georgia, serif", color: "#131921" }}>amazon</span>
        <span style={{ color: "#ff9900", fontSize: "28px" }}>.</span>
      </div>
      <div style={{ background: "white", border: "1px solid #e3e6e6", borderRadius: "8px", padding: "28px", width: "100%", maxWidth: "360px" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: "22px", fontWeight: 400, fontFamily: "Georgia, serif" }}>
          {isRegister ? "Create Account" : "Sign in"}
        </h2>
        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #f5c6c6", borderRadius: "4px", padding: "10px", fontSize: "13px", color: "#c0392b", marginBottom: "16px" }}>
            {error}
          </div>
        )}
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
          <button type="submit" disabled={loading}
            style={{ width: "100%", background: loading ? "#ccc" : "#ff9900", color: "#131921", border: "none", padding: "10px", borderRadius: "20px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Please wait..." : isRegister ? "Create your Amazon account" : "Sign in"}
          </button>
        </form>
        <hr style={{ border: "none", borderTop: "1px solid #e3e6e6", margin: "20px 0" }} />
        <div style={{ textAlign: "center", fontSize: "14px" }}>
          {isRegister ? "Already have an account?" : "New to Amazon?"}{" "}
          <span onClick={() => { setIsRegister(!isRegister); setError(""); }} style={{ color: "#c45500", cursor: "pointer" }}>
            {isRegister ? "Sign in" : "Create your Amazon account"}
          </span>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = ({ cart, user, onNavigate, onPlaceOrder }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: user?.name || "", street: "", city: "", state: "", pin: "", phone: "" });
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const handleOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const shippingAddress = `${address.name}, ${address.street}, ${address.city}, ${address.state} - ${address.pin}`;
      await onPlaceOrder(shippingAddress);
      setStep(4);
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (step === 4) return (
    <div style={{ background: "#eaeded", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "8px", padding: "60px", textAlign: "center", maxWidth: "480px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ color: "#007b23", fontFamily: "Georgia, serif", margin: "0 0 12px" }}>Order Placed!</h2>
        <p style={{ color: "#555", marginBottom: "8px" }}>Thank you! Your order has been confirmed.</p>
        <p style={{ color: "#007185", fontSize: "13px", marginBottom: "24px" }}>Estimated delivery: 2-5 business days</p>
        <button onClick={() => onNavigate("orders")}
          style={{ background: "#ff9900", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer", marginRight: "12px" }}>
          View Orders
        </button>
        <button onClick={() => onNavigate("home")}
          style={{ background: "white", border: "1px solid #ddd", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", cursor: "pointer" }}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", marginBottom: "20px", background: "white", borderRadius: "8px", overflow: "hidden" }}>
          {["Address", "Payment", "Review"].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: "12px", textAlign: "center", background: step === i + 1 ? "#131921" : step > i + 1 ? "#232f3e" : "white", color: step >= i + 1 ? "white" : "#888", fontSize: "14px", fontWeight: step === i + 1 ? 700 : 400 }}>
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
            <button onClick={() => setStep(3)}
              style={{ marginTop: "8px", background: "#ff9900", color: "#131921", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
              Use this payment method
            </button>
          </div>
        )}
        {step === 3 && (
          <div style={{ background: "white", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontFamily: "Georgia, serif" }}>Review your order</h2>
            {error && <div style={{ background: "#fff5f5", border: "1px solid #f5c6c6", borderRadius: "4px", padding: "10px", color: "#c0392b", marginBottom: "16px" }}>{error}</div>}
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e3e6e6" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "28px" }}>{getIcon(item.category)}</span>
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
            <button onClick={handleOrder} disabled={loading}
              style={{ width: "100%", background: loading ? "#ccc" : "#ff9900", color: "#131921", border: "none", padding: "14px", borderRadius: "24px", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Placing order..." : "Place your order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const OrdersPage = ({ user, onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) { onNavigate("login"); return; }
    api.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);
  if (loading) return <div style={{ background: "#eaeded", minHeight: "100vh" }}><Spinner /></div>;
  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px 16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 400, fontFamily: "Georgia, serif", margin: "0 0 20px" }}>Your Orders</h1>
        {orders.length === 0 ? (
          <div style={{ background: "white", borderRadius: "8px", padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "48px" }}>📦</div>
            <h2 style={{ fontFamily: "Georgia, serif" }}>No orders yet</h2>
            <p style={{ color: "#888", marginBottom: "20px" }}>When you place orders, they'll appear here.</p>
            <button onClick={() => onNavigate("products")}
              style={{ background: "#ff9900", border: "none", padding: "12px 28px", borderRadius: "24px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
              Start Shopping
            </button>
          </div>
        ) : orders.map((order) => (
          <div key={order.orderId} style={{ background: "white", borderRadius: "8px", marginBottom: "16px", overflow: "hidden" }}>
            <div style={{ background: "#f7f7f7", padding: "12px 20px", display: "flex", gap: "32px", flexWrap: "wrap", borderBottom: "1px solid #e3e6e6" }}>
              <div><div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase" }}>Order placed</div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div></div>
              <div><div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase" }}>Total</div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>₹{order.totalPrice?.toLocaleString()}</div></div>
              <div><div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase" }}>Status</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: order.status === "DELIVERED" ? "#007b23" : order.status === "CANCELLED" ? "#cc0c39" : "#c45500" }}>{order.status}</div></div>
              <div style={{ marginLeft: "auto" }}><div style={{ fontSize: "11px", color: "#555" }}>Order #{order.orderId}</div></div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "28px" }}>{getIcon(item.category)}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#007185" }}>{item.productName}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>Qty: {item.quantity} · ₹{item.priceAtPurchase?.toLocaleString()} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const AccountPage = ({ user, onNavigate, defaultTab }) => {
  const [tab, setTab] = useState(defaultTab || "orders");
  useEffect(() => { if (defaultTab) setTab(defaultTab); }, [defaultTab]);
  const [profile, setProfile] = useState({ name: user?.name || "", phone: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addrForm, setAddrForm] = useState({ street: "", city: "", state: "", pinCode: "", phoneNumber: "", name: "" });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrMsg, setAddrMsg] = useState("");
  const [addrErr, setAddrErr] = useState("");

  useEffect(() => {
    api.getProfile().then(r => setProfile({ name: r.data.name, phone: r.data.phone || "" })).catch(() => {});
    api.getAddresses().then(r => setAddresses(r.data)).catch(() => {});
  }, []);

  const saveProfile = async () => {
    try {
      await api.updateProfile({ name: profile.name, phone: profile.phone });
      setProfileMsg("✓ Profile updated!");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch { setProfileMsg("Failed to update."); }
  };

  const changePassword = async () => {
    if (passwords.newPass !== passwords.confirm) { setPassMsg("Passwords don't match."); return; }
    try {
      await api.updateProfile({ currentPassword: passwords.current, newPassword: passwords.newPass });
      setPassMsg("✓ Password changed!");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setPassMsg(""), 3000);
    } catch (e) { setPassMsg(e.response?.data?.message || "Current password incorrect."); }
  };

  const addAddr = async () => {
    if (!/^[0-9]{10}$/.test(addrForm.phone)) { setAddrMsg("Phone must be exactly 10 digits."); return; }
    if (!/^[0-9]{6}$/.test(addrForm.pinCode)) { setAddrMsg("PIN code must be exactly 6 digits."); return; }
    try {
      const res = await api.addAddress(addrForm);
      setAddresses(prev => [...prev, res.data]);
      setAddrForm({ street: "", city: "", state: "", pinCode: "", phone: "", fullName: "" });
      setShowAddrForm(false);
      setAddrMsg("✓ Address added!");
      setTimeout(() => setAddrMsg(""), 3000);
    } catch { setAddrMsg("Failed to add address."); }
  };

  const removeAddr = async (id) => {
    try {
      await api.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch {}
  };

  const tabs = [
    { id: "orders", label: "📦 Your Orders" },
    { id: "security", label: "🔒 Login & Security" },
    { id: "payment", label: "💳 Payment Methods" },
    { id: "contact", label: "📞 Contact Us" },
    { id: "addresses", label: "📍 Your Addresses" },
  ];

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", marginBottom: "12px" };
  const btnStyle = { background: "#ff9900", border: "none", padding: "10px 24px", borderRadius: "20px", fontWeight: 700, fontSize: "14px", cursor: "pointer" };

  return (
    <div style={{ background: "#eaeded", minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, marginBottom: "24px" }}>Your Account</h1>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {/* Sidebar */}
          <div style={{ width: "220px", flexShrink: 0 }}>
            {tabs.map(t => (
              <div key={t.id} onClick={() => t.id === "orders" ? onNavigate("orders") : setTab(t.id)}
                style={{ padding: "12px 16px", background: tab === t.id ? "#fff3cd" : "white", borderLeft: tab === t.id ? "4px solid #ff9900" : "4px solid transparent", cursor: "pointer", marginBottom: "4px", borderRadius: "4px", fontWeight: tab === t.id ? 700 : 400, fontSize: "14px" }}>
                {t.label}
              </div>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: "300px", background: "white", borderRadius: "8px", padding: "28px" }}>

            {/* LOGIN & SECURITY */}
            {tab === "security" && (
              <div>
                <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, marginBottom: "24px" }}>Login & Security</h2>
                <h3 style={{ fontSize: "15px", marginBottom: "12px" }}>Edit Name & Mobile</h3>
                <input placeholder="Full Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={inputStyle} />
                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ padding: "10px 12px", background: "#f0f0f0", border: "1px solid #ddd", borderRadius: "6px 0 0 6px", fontSize: "14px", whiteSpace: "nowrap" }}>+91</span>
                  <input placeholder="10-digit mobile number" value={profile.phone}
                    inputMode="numeric"
                    maxLength={10}
                    onChange={e => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    style={{ ...inputStyle, marginBottom: 0, borderRadius: "0 6px 6px 0", borderLeft: "none" }} />
                </div>
                <div style={{ color: "#888", fontSize: "13px", marginBottom: "12px" }}>Email: {user?.email} (cannot be changed)</div>
                {profileMsg && <div style={{ color: profileMsg.startsWith("✓") ? "green" : "red", marginBottom: "12px", fontSize: "13px" }}>{profileMsg}</div>}
                <button style={btnStyle} onClick={saveProfile}>Save Changes</button>
                <hr style={{ margin: "28px 0", border: "none", borderTop: "1px solid #eee" }} />
                <h3 style={{ fontSize: "15px", marginBottom: "12px" }}>Change Password</h3>
                <input placeholder="Current Password" type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} style={inputStyle} />
                <input placeholder="New Password" type="password" value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} style={inputStyle} />
                <input placeholder="Confirm New Password" type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} style={inputStyle} />
                {passMsg && <div style={{ color: passMsg.startsWith("✓") ? "green" : "red", marginBottom: "12px", fontSize: "13px" }}>{passMsg}</div>}
                <button style={btnStyle} onClick={changePassword}>Change Password</button>
              </div>
            )}

            {/* PAYMENT METHODS */}
            {tab === "payment" && (
              <div>
                <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, marginBottom: "24px" }}>Payment Methods</h2>
                {[
                  { icon: "👛", title: "Amazon Pay Wallet", sub: "Balance: ₹0.00", color: "#e8f4f8" },
                  { icon: "💳", title: "Debit Card", sub: "Add a debit card for easy payments", color: "#fef9e7" },
                  { icon: "💰", title: "Credit Card", sub: "Add a credit card for easy payments", color: "#fdf2f8" },
                ].map(p => (
                  <div key={p.title} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px", border: "1px solid #e3e6e6", borderRadius: "8px", marginBottom: "12px", background: p.color }}>
                    <span style={{ fontSize: "32px" }}>{p.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px" }}>{p.title}</div>
                      <div style={{ fontSize: "13px", color: "#555", marginTop: "2px" }}>{p.sub}</div>
                    </div>
                    <button style={{ marginLeft: "auto", background: "#ff9900", border: "none", padding: "8px 16px", borderRadius: "16px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>Add</button>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACT US */}
            {tab === "contact" && (
              <div>
                <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, marginBottom: "24px" }}>Contact Us</h2>
                <div style={{ display: "grid", gap: "16px" }}>
                  {[
                    { icon: "📞", label: "Customer Care (24x7)", value: "1800-419-7355" },
                    { icon: "📞", label: "Prime Support", value: "1800-3000-9009" },
                    { icon: "📞", label: "Seller Support", value: "1800-572-1571" },
                    { icon: "✉️", label: "Email Support", value: "support@primedeals.in" },
                    { icon: "✉️", label: "Grievance Officer", value: "grievance@primedeals.in" },
                  ].map(c => (
                    <div key={c.label} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "16px", border: "1px solid #e3e6e6", borderRadius: "8px" }}>
                      <span style={{ fontSize: "22px" }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: "13px", color: "#888" }}>{c.label}</div>
                        <div style={{ fontWeight: 700, fontSize: "15px", color: "#007185" }}>{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "12px", color: "#aaa", marginTop: "20px" }}>Available Mon-Sun, 8 AM – 10 PM IST</p>
              </div>
            )}

            {/* ADDRESSES */}
            {tab === "addresses" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, margin: 0 }}>Your Addresses</h2>
                  <button style={btnStyle} onClick={() => setShowAddrForm(!showAddrForm)}>+ Add Address</button>
                </div>
                {addrMsg && <div style={{ color: addrMsg.startsWith("✓") ? "green" : "red", marginBottom: "12px", fontSize: "13px" }}>{addrMsg}</div>}
                {showAddrForm && (
                  <div style={{ border: "1px solid #e3e6e6", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "15px", marginBottom: "14px" }}>New Address</h3>
                    {[["Full Name", "fullName"], ["Street / Area", "street"], ["City", "city"], ["State", "state"], ["PIN Code", "pinCode"], ["Phone (10 digits)", "phone"]].map(([lbl, key]) => (
                      <input key={key} placeholder={lbl} value={addrForm[key]}
                        inputMode={key === "phone" || key === "pinCode" ? "numeric" : "text"}
                        maxLength={key === "phone" ? 10 : key === "pinCode" ? 6 : undefined}
                        onChange={e => {
                          const val = key === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 10) : key === "pinCode" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value;
                          setAddrForm({ ...addrForm, [key]: val });
                        }} style={inputStyle} />
                    ))}
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button style={btnStyle} onClick={addAddr}>Save Address</button>
                      <button style={{ ...btnStyle, background: "#eee", color: "#333" }} onClick={() => setShowAddrForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}
                {addresses.length === 0 && !showAddrForm && (
                  <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>📍</div>
                    <p>No saved addresses yet.</p>
                  </div>
                )}
                {addresses.map(a => (
                  <div key={a.id} style={{ border: "1px solid #e3e6e6", borderRadius: "8px", padding: "16px", marginBottom: "12px", position: "relative" }}>
                    <div style={{ fontWeight: 700 }}>{a.fullName}</div>
                    <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>{a.street}, {a.city}, {a.state} - {a.pinCode}</div>
                    <div style={{ fontSize: "13px", color: "#555" }}>Phone: {a.phone}</div>
                    <button onClick={() => removeAddr(a.id)} style={{ marginTop: "10px", background: "none", border: "1px solid #c45500", color: "#c45500", padding: "4px 14px", borderRadius: "12px", fontSize: "12px", cursor: "pointer" }}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsPage, setProductsPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState(null);
  const [navParam, setNavParam] = useState(null);

  useEffect(() => {
    api.getProducts(0, 40)
      .then(res => {
        setProducts(res.data);
        setHasMore(res.data.length === 40);
        setProductsPage(0);
      })
      .catch(() => console.error("Could not load products"))
      .finally(() => setProductsLoading(false));
  }, []);

  const loadMoreProducts = () => {
    const nextPage = productsPage + 1;
    api.getProducts(nextPage, 40)
      .then(res => {
        setProducts(prev => [...prev, ...res.data]);
        setHasMore(res.data.length === 40);
        setProductsPage(nextPage);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.getCart();
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
    if (target === "account") setNavParam(extra || null);
    if (target === "home") setSearchQuery("");
    setPage(target);
    window.scrollTo(0, 0);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = async (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✓ "${product.name}" added to cart`);
    if (localStorage.getItem("token")) {
      try {
        await api.addToCart(product.id, 1);
        await fetchCart();
      } catch (err) {
        console.error("Cart sync failed:", err);
      }
    }
  };

  const removeFromCart = async (id,cartItemId) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
    if (localStorage.getItem("token")) {
      try {
        await api.removeFromCart(cartItemId);
      } catch (err) {
        console.error("Remove cart sync failed:", err);
      }
    }
  };

  const updateQty = (id, qty) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));

  const productClick = (product) => {
    setSelectedProduct(product);
    navigate("product");
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    fetchCart();
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
      case "home": return <HomePage onNavigate={navigate} onAddToCart={addToCart} onProductClick={productClick} products={products} cart={cart} onRemoveFromCart={removeFromCart} />;
      case "products": return <ProductsPage onAddToCart={addToCart} onProductClick={productClick} filterCategory={filterCategory} searchQuery={searchQuery} products={products} loading={productsLoading} cart={cart} onRemoveFromCart={removeFromCart} onLoadMore={loadMoreProducts} hasMore={hasMore} />;
      case "product": return selectedProduct ? <ProductDetailPage product={selectedProduct} onAddToCart={addToCart} onNavigate={navigate} /> : null;
      case "cart": return <CartPage cart={cart} onRemove={removeFromCart} onUpdateQty={updateQty} onNavigate={navigate} />;
      case "checkout": return <CheckoutPage cart={cart} user={user} onNavigate={navigate} onPlaceOrder={placeOrder} />;
      case "login": return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case "account": return <AccountPage user={user} onNavigate={navigate} defaultTab={navParam} />;
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
          products={products}
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
