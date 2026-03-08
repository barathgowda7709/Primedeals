import { useState, useEffect, useRef } from "react";
import * as api from "./api";

// ── Theme ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#0A0A0A", surface: "#111111", surface2: "#181818", surface3: "#1F1F1F",
  gold: "#C5A059", goldLight: "#E8C97A", goldDim: "rgba(197,160,89,0.15)",
  border: "rgba(197,160,89,0.18)", borderFaint: "rgba(255,255,255,0.06)",
  text: "#FFFFFF", textMuted: "#A1A1AA", textFaint: "#555",
  red: "#ef4444", green: "#22c55e",
};

const SERIF = "'Playfair Display', Georgia, serif";
const SANS  = "'Inter', sans-serif";

const CATEGORIES = [
  { id: 1, name: "Mobiles",          img: "https://picsum.photos/seed/mobile99/600/800" },
  { id: 2, name: "Laptops",          img: "https://picsum.photos/seed/laptop88/600/800" },
  { id: 3, name: "Electronics",      img: "https://picsum.photos/seed/elec77/600/800"   },
  { id: 4, name: "Clothing",         img: "https://picsum.photos/seed/cloth66/600/800"  },
  { id: 5, name: "Home & Kitchen",   img: "https://picsum.photos/seed/kitchen55/600/800"},
  { id: 6, name: "Sports & Fitness", img: "https://picsum.photos/seed/sport44/600/800"  },
  { id: 7, name: "Beauty & Personal Care", img: "https://picsum.photos/seed/beauty33/600/800"},
  { id: 8, name: "Books",            img: "https://picsum.photos/seed/book22/600/800"   },
  { id: 9, name: "Furniture",        img: "https://picsum.photos/seed/furn11/600/800"   },
  { id:10, name: "Toys & Games",     img: "https://picsum.photos/seed/toys10/600/800"   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const Stars = ({ rating = 0 }) => {
  const full = Math.floor(rating), half = rating % 1 >= 0.5;
  return (
    <span style={{ color: T.gold, fontSize: "12px", letterSpacing: "1px" }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const GoldBtn = ({ children, onClick, style = {}, outline = false, small = false }) => (
  <button onClick={onClick} style={{
    background: outline ? "transparent" : `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
    color: outline ? T.gold : "#0A0A0A",
    border: outline ? `1px solid ${T.gold}` : "none",
    borderRadius: "2px", fontFamily: SANS, fontWeight: 600,
    padding: small ? "6px 16px" : "12px 28px",
    fontSize: small ? "12px" : "14px",
    cursor: "pointer", letterSpacing: "0.5px",
    transition: "all 0.2s ease",
    ...style,
  }}
    onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
  >{children}</button>
);

const Divider = ({ style = {} }) => (
  <div style={{ height: "1px", background: T.border, ...style }} />
);

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = ({ cartCount, onNavigate, searchQuery, onSearch, user, onLogout, products = [] }) => {
  const [query, setQuery]               = useState(searchQuery || "");
  const [showAcct, setShowAcct]         = useState(false);
  const [showSugg, setShowSugg]         = useState(false);
  const [scrolled, setScrolled]         = useState(false);

  useEffect(() => { setQuery(searchQuery || ""); }, [searchQuery]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const suggestions = query.trim().length > 0
    ? products.filter(p => p.name?.toLowerCase().includes(query.toLowerCase()))
        .map(p => p.name).filter((v, i, a) => a.indexOf(v) === i).slice(0, 8)
    : [];

  const handleSearch = e => { e.preventDefault(); setShowSugg(false); onSearch(query); onNavigate("products"); };

  const highlightMatch = (text, q) => {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <span style={{ color: T.text }}>{text}</span>;
    return <span>
      <span style={{ color: T.textMuted }}>{text.slice(0, idx)}</span>
      <span style={{ color: T.gold, fontWeight: 600 }}>{text.slice(idx, idx + q.length)}</span>
      <span style={{ color: T.textMuted }}>{text.slice(idx + q.length)}</span>
    </span>;
  };

  const navStyle = {
    position: "sticky", top: 0, zIndex: 1000,
    background: scrolled ? "rgba(10,10,10,0.92)" : "rgba(10,10,10,0.7)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
    transition: "all 0.3s ease",
    padding: "0 40px", height: "68px",
    display: "flex", alignItems: "center", gap: "32px",
  };

  return (
    <header style={navStyle}>
      {/* Logo */}
      <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: "3px", minWidth: "140px" }}>
        <span style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 700, color: T.text, letterSpacing: "-0.5px" }}>Prime</span>
        <span style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: 400, fontStyle: "italic", color: T.gold }}>Deals</span>
      </div>

      {/* Nav links */}
      <nav style={{ display: "flex", gap: "28px", flex: 1 }}>
        {[["New Arrivals","products"],["Collections","products"],["Boutique","products"]].map(([label, pg]) => (
          <span key={label} onClick={() => onNavigate(pg)}
            style={{ color: T.textMuted, fontSize: "13px", letterSpacing: "0.5px", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = T.gold}
            onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>{label}</span>
        ))}
      </nav>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ position: "relative", width: "280px" }}>
        <div style={{ display: "flex", alignItems: "center", background: T.surface2, border: `1px solid ${T.borderFaint}`, borderRadius: "2px", overflow: "visible" }}>
          <input value={query}
            onChange={e => { setQuery(e.target.value); setShowSugg(true); }}
            onFocus={() => setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            placeholder="Search products..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "9px 14px", color: T.text, fontSize: "13px", fontFamily: SANS }} />
          <button type="submit" style={{ background: "none", border: "none", padding: "0 12px", cursor: "pointer", color: T.textMuted, fontSize: "15px" }}>⌕</button>
        </div>
        {showSugg && suggestions.length > 0 && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: T.surface, border: `1px solid ${T.border}`, borderRadius: "2px", zIndex: 9999, overflow: "hidden" }}>
            {suggestions.map((s, i) => (
              <div key={i} onMouseDown={() => { setQuery(s); setShowSugg(false); onSearch(s); onNavigate("products"); }}
                style={{ padding: "9px 14px", fontSize: "13px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? `1px solid ${T.borderFaint}` : "none" }}
                onMouseEnter={e => e.currentTarget.style.background = T.surface2}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {highlightMatch(s, query)}
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Right icons */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {/* Cart */}
        <div onClick={() => onNavigate("cart")} style={{ position: "relative", cursor: "pointer" }}>
          <span style={{ fontSize: "20px", color: T.textMuted }}>🛒</span>
          {cartCount > 0 && (
            <span style={{ position: "absolute", top: "-8px", right: "-8px", background: T.gold, color: "#0A0A0A", borderRadius: "50%", width: "17px", height: "17px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
          )}
        </div>

        {/* Account */}
        <div style={{ position: "relative" }} onMouseEnter={() => setShowAcct(true)} onMouseLeave={() => setShowAcct(false)}>
          <div onClick={() => !user && onNavigate("login")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: T.goldDim, border: `1px solid ${T.gold}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.gold, fontSize: "13px", fontWeight: 600 }}>
              {user ? user.name?.[0]?.toUpperCase() : "?"}
            </div>
            <span style={{ fontSize: "12px", color: T.textMuted }}>{user ? user.name?.split(" ")[0] : "Sign in"}</span>
          </div>
          {user && showAcct && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: T.surface, border: `1px solid ${T.border}`, borderRadius: "2px", minWidth: "200px", zIndex: 9999, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.borderFaint}` }}>
                <div style={{ fontSize: "11px", color: T.textMuted, letterSpacing: "0.5px" }}>SIGNED IN AS</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: T.text, marginTop: "2px" }}>{user.name}</div>
              </div>
              {[["👤 Your Account","account"],["📦 Your Orders","orders"],["↩️ Returns","orders"]].map(([label, pg]) => (
                <div key={label} onClick={() => { onNavigate(pg); setShowAcct(false); }}
                  style={{ padding: "10px 16px", fontSize: "13px", color: T.textMuted, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.surface2; e.currentTarget.style.color = T.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; }}>{label}</div>
              ))}
              <div style={{ borderTop: `1px solid ${T.borderFaint}` }}>
                <div onClick={() => { onLogout(); setShowAcct(false); }}
                  style={{ padding: "10px 16px", fontSize: "13px", color: T.red, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surface2}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>🚪 Sign Out</div>
              </div>
            </div>
          )}
        </div>

        {/* Customer service */}
        <span onClick={() => onNavigate("account", "contact")} style={{ fontSize: "12px", color: T.textMuted, cursor: "pointer", letterSpacing: "0.3px" }}
          onMouseEnter={e => e.currentTarget.style.color = T.gold}
          onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>Help</span>
      </div>
    </header>
  );
};

// ── ProductCard ───────────────────────────────────────────────────────────────
const ProductCard = ({ product, onProductClick, onAddToCart, cart, onRemoveFromCart }) => {
  const cartItem = cart?.find(i => i.id === product.id);
  const qty = cartItem?.qty || 0;

  const cardStyle = {
    background: T.surface, border: `1px solid ${T.borderFaint}`,
    borderRadius: "2px", overflow: "hidden", cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
    display: "flex", flexDirection: "column",
  };

  return (
    <div style={cardStyle}
      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${T.border}`; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${T.borderFaint}`; e.currentTarget.style.transform = "translateY(0)"; }}>
      {/* Image */}
      <div style={{ position: "relative", paddingTop: "100%", overflow: "hidden", background: T.surface2 }}
        onClick={() => onProductClick(product)}>
        <img src={product.imageUrl} alt={product.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          onError={e => { e.target.style.display = "none"; }} />
        {product.stock < 10 && product.stock > 0 && (
          <span style={{ position: "absolute", top: "10px", left: "10px", background: T.gold, color: "#0A0A0A", fontSize: "9px", fontWeight: 700, padding: "3px 7px", borderRadius: "1px", letterSpacing: "0.5px" }}>LOW STOCK</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "1.5px", textTransform: "uppercase" }}>{product.brand}</div>
        <div onClick={() => onProductClick(product)} style={{ fontSize: "13px", fontWeight: 500, color: T.text, lineHeight: "1.4", cursor: "pointer" }}>{product.name}</div>
        <Stars rating={product.rating || 0} />
        <div style={{ fontSize: "10px", color: T.textFaint }}>{product.numReviews?.toLocaleString()} reviews</div>
        <div style={{ marginTop: "auto", paddingTop: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: SERIF, fontSize: "16px", color: T.gold }}>₹{product.price?.toLocaleString("en-IN")}</span>
          {qty === 0 ? (
            <GoldBtn small onClick={e => { e.stopPropagation(); onAddToCart(product); }}>+ Add</GoldBtn>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0", border: `1px solid ${T.border}`, borderRadius: "2px", overflow: "hidden" }}>
              {qty === 1
                ? <button onClick={e => { e.stopPropagation(); onRemoveFromCart(cartItem.cartItemId); }}
                    style={{ background: "none", border: "none", color: T.textMuted, padding: "5px 10px", cursor: "pointer", fontSize: "12px" }}>🗑</button>
                : <button onClick={e => { e.stopPropagation(); onRemoveFromCart(cartItem.cartItemId); }}
                    style={{ background: "none", border: "none", color: T.textMuted, padding: "5px 10px", cursor: "pointer", fontSize: "14px" }}>−</button>}
              <span style={{ padding: "5px 10px", fontSize: "13px", color: T.text, minWidth: "28px", textAlign: "center" }}>{qty}</span>
              <button onClick={e => { e.stopPropagation(); if (qty < 5) onAddToCart(product); }}
                style={{ background: qty >= 5 ? "none" : T.gold, border: "none", color: qty >= 5 ? T.textFaint : "#0A0A0A", padding: "5px 10px", cursor: qty >= 5 ? "default" : "pointer", fontSize: "14px", fontWeight: 700 }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── HomePage ──────────────────────────────────────────────────────────────────
const HomePage = ({ onNavigate, onAddToCart, onProductClick, products, cart, onRemoveFromCart }) => {
  const featured = products.slice(0, 8);

  return (
    <div style={{ background: T.bg }}>
      {/* Hero */}
      <div style={{ position: "relative", height: "88vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <img src="https://picsum.photos/seed/luxhero2024/1600/900" alt="hero"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.35)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.9) 40%, transparent)" }} />
        <div className="fade-in" style={{ position: "relative", maxWidth: "600px", padding: "0 80px" }}>
          <div style={{ fontSize: "11px", color: T.gold, letterSpacing: "3px", marginBottom: "20px", textTransform: "uppercase" }}>New Season 2024</div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.1, color: T.text, marginBottom: "20px" }}>
            The Art of<br /><em style={{ color: T.gold }}>Smart Shopping</em>
          </h1>
          <p style={{ fontSize: "15px", color: T.textMuted, lineHeight: 1.7, marginBottom: "36px", maxWidth: "420px" }}>
            Discover curated collections across Electronics, Fashion, Home & more — delivered to your door.
          </p>
          <div style={{ display: "flex", gap: "14px" }}>
            <GoldBtn onClick={() => onNavigate("products")}>Shop Now</GoldBtn>
            <GoldBtn outline onClick={() => onNavigate("products")}>View Collections</GoldBtn>
          </div>
        </div>
        {/* Stats */}
        <div style={{ position: "absolute", bottom: "40px", left: "80px", display: "flex", gap: "48px" }}>
          {[["2,000+","Products"],["10","Categories"],["Free","Delivery"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: SERIF, fontSize: "28px", color: T.gold }}>{num}</div>
              <div style={{ fontSize: "11px", color: T.textMuted, letterSpacing: "1px", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "80px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", color: T.gold, letterSpacing: "3px", marginBottom: "12px" }}>BROWSE BY</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "36px", color: T.text }}>Collections</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
          {CATEGORIES.slice(0, 5).map(cat => (
            <div key={cat.id} onClick={() => onNavigate("products", cat.name)}
              style={{ position: "relative", height: "220px", overflow: "hidden", cursor: "pointer", borderRadius: "2px" }}
              onMouseEnter={e => e.currentTarget.querySelector("img").style.transform = "scale(1.08)"}
              onMouseLeave={e => e.currentTarget.querySelector("img").style.transform = "scale(1)"}>
              <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45)", transition: "transform 0.5s ease" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.85), transparent)" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px" }}>
                <div style={{ fontFamily: SERIF, fontSize: "15px", color: T.text, fontWeight: 600 }}>{cat.name}</div>
                <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "1px", marginTop: "2px" }}>EXPLORE →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider style={{ margin: "0 60px" }} />

      {/* Featured Products */}
      <div style={{ padding: "80px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
          <div>
            <div style={{ fontSize: "11px", color: T.gold, letterSpacing: "3px", marginBottom: "10px" }}>HANDPICKED</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "36px", color: T.text }}>Featured Products</h2>
          </div>
          <GoldBtn outline small onClick={() => onNavigate("products")}>View All →</GoldBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {featured.map(p => (
            <ProductCard key={p.id} product={p} onProductClick={onProductClick} onAddToCart={onAddToCart} cart={cart} onRemoveFromCart={onRemoveFromCart} />
          ))}
        </div>
      </div>

      {/* Heritage Banner */}
      <div style={{ margin: "0 60px 80px", position: "relative", height: "300px", overflow: "hidden", borderRadius: "2px" }}>
        <img src="https://picsum.photos/seed/heritage2024/1400/400" alt="banner"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: T.gold, letterSpacing: "3px", marginBottom: "16px" }}>THE INNER CIRCLE</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "36px", color: T.text, marginBottom: "12px" }}>Exclusive Member Benefits</h2>
          <p style={{ color: T.textMuted, marginBottom: "28px", maxWidth: "400px" }}>Free delivery, early access to deals, and members-only pricing.</p>
          <GoldBtn onClick={() => onNavigate("account")}>Join Now</GoldBtn>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: "60px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px" }}>
        <div>
          <div style={{ fontFamily: SERIF, fontSize: "20px", color: T.text, marginBottom: "12px" }}>Prime<em style={{ color: T.gold }}>Deals</em></div>
          <p style={{ fontSize: "13px", color: T.textMuted, lineHeight: 1.8, maxWidth: "260px" }}>Your destination for quality products at unbeatable prices across India.</p>
        </div>
        {[
          { title: "SHOP", links: ["New Arrivals","Best Sellers","Collections","Sale"] },
          { title: "ACCOUNT", links: ["Your Account","Orders","Returns","Wishlist"] },
          { title: "HELP", links: ["Contact Us","FAQs","Shipping","Privacy Policy"] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "2px", marginBottom: "16px" }}>{col.title}</div>
            {col.links.map(l => (
              <div key={l} style={{ fontSize: "13px", color: T.textMuted, marginBottom: "10px", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = T.text}
                onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>{l}</div>
            ))}
          </div>
        ))}
        <div style={{ gridColumn: "1/-1", borderTop: `1px solid ${T.borderFaint}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: T.textFaint }}>© 2024 PrimeDeals. All rights reserved.</span>
          <span style={{ fontSize: "12px", color: T.textFaint }}>Made in India 🇮🇳</span>
        </div>
      </footer>
    </div>
  );
};

// ── ProductsPage ──────────────────────────────────────────────────────────────
const ProductsPage = ({ onAddToCart, onProductClick, filterCategory, searchQuery, products, loading, cart, onRemoveFromCart, onLoadMore, hasMore }) => {
  const [sortBy, setSortBy]       = useState("featured");
  const [selectedCat, setSelectedCat] = useState(filterCategory || "All");
  useEffect(() => { if (filterCategory) setSelectedCat(filterCategory); }, [filterCategory]);

  let filtered = products;
  if (selectedCat !== "All") filtered = filtered.filter(p => p.category === selectedCat);
  if (searchQuery) filtered = filtered.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase()));
  if (sortBy === "low")   filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "high")  filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rated") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const cats = ["All", ...CATEGORIES.map(c => c.name)];

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "0 60px 60px" }}>
      {/* Header */}
      <div style={{ padding: "40px 0 32px", borderBottom: `1px solid ${T.borderFaint}`, marginBottom: "32px" }}>
        {searchQuery
          ? <h1 style={{ fontFamily: SERIF, fontSize: "28px", color: T.text }}>Results for "<span style={{ color: T.gold }}>{searchQuery}</span>"</h1>
          : <h1 style={{ fontFamily: SERIF, fontSize: "28px", color: T.text }}>{selectedCat === "All" ? "All Products" : selectedCat}</h1>}
        <div style={{ fontSize: "13px", color: T.textMuted, marginTop: "6px" }}>{filtered.length} products</div>
      </div>

      <div style={{ display: "flex", gap: "32px" }}>
        {/* Sidebar */}
        <div style={{ width: "200px", flexShrink: 0 }}>
          <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "2px", marginBottom: "16px" }}>CATEGORIES</div>
          {cats.map(c => (
            <div key={c} onClick={() => setSelectedCat(c)}
              style={{ padding: "9px 0", fontSize: "13px", cursor: "pointer", color: selectedCat === c ? T.gold : T.textMuted, borderLeft: `2px solid ${selectedCat === c ? T.gold : "transparent"}`, paddingLeft: "12px", marginBottom: "2px", transition: "all 0.2s" }}
              onMouseEnter={e => { if (selectedCat !== c) e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { if (selectedCat !== c) e.currentTarget.style.color = T.textMuted; }}>{c}</div>
          ))}
          <Divider style={{ margin: "20px 0" }} />
          <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "2px", marginBottom: "16px" }}>SORT BY</div>
          {[["featured","Featured"],["low","Price: Low"],["high","Price: High"],["rated","Top Rated"]].map(([val, label]) => (
            <div key={val} onClick={() => setSortBy(val)}
              style={{ padding: "9px 0 9px 12px", fontSize: "13px", cursor: "pointer", color: sortBy === val ? T.gold : T.textMuted, borderLeft: `2px solid ${sortBy === val ? T.gold : "transparent"}`, marginBottom: "2px", transition: "all 0.2s" }}>{label}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {Array(8).fill(0).map((_, i) => (
                <div key={i} style={{ background: T.surface, height: "320px", borderRadius: "2px", background: `linear-gradient(90deg, ${T.surface} 25%, ${T.surface2} 50%, ${T.surface} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "100px 0", color: T.textMuted }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text, marginBottom: "8px" }}>No products found</div>
              <div style={{ fontSize: "14px" }}>Try a different search or category</div>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                {filtered.map(p => (
                  <ProductCard key={p.cartItemId || p.id} product={p} onProductClick={onProductClick} onAddToCart={onAddToCart} cart={cart} onRemoveFromCart={onRemoveFromCart} />
                ))}
              </div>
              {!searchQuery && hasMore && (
                <div style={{ textAlign: "center", marginTop: "48px" }}>
                  <GoldBtn outline onClick={onLoadMore}>Load More Products</GoldBtn>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── ProductDetailPage ─────────────────────────────────────────────────────────
const ProductDetailPage = ({ product, onAddToCart, onNavigate }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const handleAdd = () => { for (let i = 0; i < qty; i++) onAddToCart(product); setAdded(true); setTimeout(() => setAdded(false), 2000); };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "60px" }}>
      <div style={{ color: T.textMuted, fontSize: "13px", marginBottom: "32px", cursor: "pointer" }} onClick={() => onNavigate("products")}>← Back to Products</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", maxWidth: "1100px" }}>
        {/* Image */}
        <div style={{ background: T.surface, borderRadius: "2px", overflow: "hidden", aspectRatio: "1" }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
        </div>
        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "11px", color: T.gold, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>{product.brand} · {product.category}</div>
            <h1 style={{ fontFamily: SERIF, fontSize: "32px", color: T.text, lineHeight: 1.2, marginBottom: "16px" }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Stars rating={product.rating} />
              <span style={{ fontSize: "13px", color: T.textMuted }}>{product.numReviews?.toLocaleString()} reviews</span>
            </div>
          </div>
          <Divider />
          <div style={{ fontFamily: SERIF, fontSize: "36px", color: T.gold }}>₹{product.price?.toLocaleString("en-IN")}</div>
          <p style={{ fontSize: "14px", color: T.textMuted, lineHeight: 1.8 }}>{product.description}</p>
          <Divider />
          <div style={{ fontSize: "13px", color: product.stock > 0 ? T.green : T.red }}>{product.stock > 0 ? `✓ In Stock (${product.stock} left)` : "Out of Stock"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", border: `1px solid ${T.border}`, borderRadius: "2px" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "none", border: "none", color: T.textMuted, padding: "10px 16px", cursor: "pointer", fontSize: "16px" }}>−</button>
              <span style={{ padding: "10px 16px", color: T.text, fontSize: "14px", minWidth: "40px", textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ background: "none", border: "none", color: T.textMuted, padding: "10px 16px", cursor: "pointer", fontSize: "16px" }}>+</button>
            </div>
            <GoldBtn onClick={handleAdd} style={{ flex: 1 }}>{added ? "✓ Added to Cart" : "Add to Cart"}</GoldBtn>
          </div>
          <div style={{ fontSize: "12px", color: T.textMuted }}>✈️ Free Prime delivery available</div>
        </div>
      </div>
    </div>
  );
};

// ── CartPage ──────────────────────────────────────────────────────────────────
const CartPage = ({ cart, onRemove, onUpdateQty, onNavigate }) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "60px" }}>
      <h1 style={{ fontFamily: SERIF, fontSize: "32px", color: T.text, marginBottom: "8px" }}>Your Cart</h1>
      <div style={{ fontSize: "13px", color: T.textMuted, marginBottom: "40px" }}>{cart.length} item{cart.length !== 1 ? "s" : ""}</div>
      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text, marginBottom: "12px" }}>Your cart is empty</div>
          <div style={{ color: T.textMuted, marginBottom: "28px" }}>Discover our curated collections</div>
          <GoldBtn onClick={() => onNavigate("products")}>Start Shopping</GoldBtn>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {cart.map(item => (
              <div key={item.cartItemId || item.id} style={{ background: T.surface, padding: "20px", display: "flex", gap: "20px", alignItems: "center" }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "2px", background: T.surface2 }} onError={e => e.target.style.display = "none"} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "1px", marginBottom: "4px" }}>{item.brand}</div>
                  <div style={{ fontSize: "14px", color: T.text, marginBottom: "8px" }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${T.border}`, borderRadius: "2px" }}>
                      <button onClick={() => onUpdateQty(item.cartItemId || item.id, item.qty - 1)} style={{ background: "none", border: "none", color: T.textMuted, padding: "4px 12px", cursor: "pointer" }}>−</button>
                      <span style={{ padding: "4px 10px", color: T.text, fontSize: "13px" }}>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.cartItemId || item.id, item.qty + 1)} style={{ background: "none", border: "none", color: T.textMuted, padding: "4px 12px", cursor: "pointer" }}>+</button>
                    </div>
                    <button onClick={() => onRemove(item.cartItemId)} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: "12px" }}>Remove</button>
                  </div>
                </div>
                <div style={{ fontFamily: SERIF, fontSize: "18px", color: T.gold }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
          {/* Summary */}
          <div style={{ background: T.surface, padding: "28px", borderRadius: "2px", border: `1px solid ${T.border}`, height: "fit-content" }}>
            <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "2px", marginBottom: "20px" }}>ORDER SUMMARY</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", color: T.textMuted }}>
              <span>Subtotal</span><span style={{ color: T.text }}>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", color: T.textMuted }}>
              <span>Delivery</span><span style={{ color: T.green }}>Free</span>
            </div>
            <Divider style={{ margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <span style={{ fontFamily: SERIF, fontSize: "18px", color: T.text }}>Total</span>
              <span style={{ fontFamily: SERIF, fontSize: "22px", color: T.gold }}>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <GoldBtn onClick={() => onNavigate("checkout")} style={{ width: "100%", textAlign: "center" }}>Proceed to Checkout</GoldBtn>
          </div>
        </div>
      )}
    </div>
  );
};

// ── LoginPage ─────────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin, onNavigate }) => {
  const [isReg, setIsReg]   = useState(false);
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const fn = isReg ? api.register : api.login;
      const res = await fn(form);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || (isReg ? "Registration failed" : "Invalid credentials"));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", display: "flex" }}>
      {/* Left image */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <img src="https://picsum.photos/seed/loginlux/800/1200" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(10,10,10,0.8))" }} />
        <div style={{ position: "absolute", bottom: "60px", left: "60px" }}>
          <div style={{ fontFamily: SERIF, fontSize: "36px", color: T.text, marginBottom: "10px" }}>Welcome to<br /><em style={{ color: T.gold }}>PrimeDeals</em></div>
          <div style={{ color: T.textMuted, fontSize: "14px" }}>Your premium shopping destination</div>
        </div>
      </div>
      {/* Form */}
      <div style={{ width: "460px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", background: T.surface }}>
        <div style={{ fontFamily: SERIF, fontSize: "28px", color: T.text, marginBottom: "6px" }}>{isReg ? "Create Account" : "Welcome Back"}</div>
        <div style={{ fontSize: "13px", color: T.textMuted, marginBottom: "36px" }}>{isReg ? "Join PrimeDeals today" : "Sign in to continue"}</div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: `1px solid ${T.red}`, color: T.red, padding: "10px 14px", borderRadius: "2px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

        <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {isReg && (
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name" required
              style={{ background: T.surface2, border: `1px solid ${T.borderFaint}`, color: T.text, padding: "12px 16px", borderRadius: "2px", fontSize: "14px", outline: "none", fontFamily: SANS }} />
          )}
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" type="email" required
            style={{ background: T.surface2, border: `1px solid ${T.borderFaint}`, color: T.text, padding: "12px 16px", borderRadius: "2px", fontSize: "14px", outline: "none", fontFamily: SANS }} />
          <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" type="password" required
            style={{ background: T.surface2, border: `1px solid ${T.borderFaint}`, color: T.text, padding: "12px 16px", borderRadius: "2px", fontSize: "14px", outline: "none", fontFamily: SANS }} />
          <GoldBtn style={{ width: "100%", padding: "14px", marginTop: "4px" }}>{loading ? "Please wait..." : isReg ? "Create Account" : "Sign In"}</GoldBtn>
        </form>
        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: T.textMuted }}>
          {isReg ? "Already have an account? " : "New to PrimeDeals? "}
          <span onClick={() => setIsReg(r => !r)} style={{ color: T.gold, cursor: "pointer" }}>{isReg ? "Sign in" : "Create account"}</span>
        </div>
      </div>
    </div>
  );
};

// ── CheckoutPage ──────────────────────────────────────────────────────────────
const CheckoutPage = ({ cart, user, onNavigate, onPlaceOrder }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: user?.name || "", street: "", city: "", state: "", pin: "", phone: "" });
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const upd = (k, v) => setAddress(a => ({ ...a, [k]: v }));

  const placeOrder = async () => {
    setLoading(true); setError("");
    try { await onPlaceOrder(address, payment); onNavigate("orders"); }
    catch (e) { setError(e.message || "Failed to place order"); setLoading(false); }
  };

  const inputStyle = { background: T.surface2, border: `1px solid ${T.borderFaint}`, color: T.text, padding: "12px 16px", borderRadius: "2px", fontSize: "14px", outline: "none", fontFamily: SANS, width: "100%" };
  const labelStyle = { fontSize: "11px", color: T.gold, letterSpacing: "1px", marginBottom: "6px", display: "block" };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "60px" }}>
      <h1 style={{ fontFamily: SERIF, fontSize: "32px", color: T.text, marginBottom: "8px" }}>Checkout</h1>
      <div style={{ display: "flex", gap: "8px", marginBottom: "40px" }}>
        {["Delivery","Payment","Review"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: step > i ? T.gold : step === i + 1 ? T.gold : T.surface2, color: step > i ? "#0A0A0A" : step === i + 1 ? "#0A0A0A" : T.textFaint, fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <span style={{ fontSize: "12px", color: step === i + 1 ? T.gold : T.textMuted }}>{s}</span>
            {i < 2 && <span style={{ color: T.borderFaint }}>—</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "40px" }}>
        <div style={{ background: T.surface, padding: "32px", borderRadius: "2px" }}>
          {step === 1 && (
            <>
              <div style={{ fontFamily: SERIF, fontSize: "20px", color: T.text, marginBottom: "24px" }}>Delivery Address</div>
              {error && <div style={{ color: T.red, marginBottom: "16px", fontSize: "13px" }}>{error}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[["Full Name","name","text"],["Phone","phone","tel"],["Street Address","street","text"],["City","city","text"],["State","state","text"],["PIN Code","pin","text"]].map(([label, key, type]) => (
                  <div key={key} style={{ gridColumn: key === "street" ? "1/-1" : "auto" }}>
                    <label style={labelStyle}>{label.toUpperCase()}</label>
                    <input value={address[key]} onChange={e => upd(key, key === "phone" ? e.target.value.replace(/\D/g,"").slice(0,10) : key === "pin" ? e.target.value.replace(/\D/g,"").slice(0,6) : e.target.value)} type={type} style={inputStyle} />
                  </div>
                ))}
              </div>
              <GoldBtn onClick={() => setStep(2)} style={{ marginTop: "24px" }}>Continue to Payment</GoldBtn>
            </>
          )}
          {step === 2 && (
            <>
              <div style={{ fontFamily: SERIF, fontSize: "20px", color: T.text, marginBottom: "24px" }}>Payment Method</div>
              {["cod","upi","card"].map(method => (
                <div key={method} onClick={() => setPayment(method)}
                  style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px", marginBottom: "8px", background: payment === method ? T.goldDim : T.surface2, border: `1px solid ${payment === method ? T.gold : T.borderFaint}`, borderRadius: "2px", cursor: "pointer" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${payment === method ? T.gold : T.textFaint}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {payment === method && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.gold }} />}
                  </div>
                  <span style={{ color: T.text, fontSize: "14px" }}>{method === "cod" ? "💵 Cash on Delivery" : method === "upi" ? "📱 UPI / Google Pay" : "💳 Credit / Debit Card"}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <GoldBtn outline onClick={() => setStep(1)}>Back</GoldBtn>
                <GoldBtn onClick={() => setStep(3)}>Continue to Review</GoldBtn>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div style={{ fontFamily: SERIF, fontSize: "20px", color: T.text, marginBottom: "24px" }}>Review Order</div>
              <div style={{ background: T.surface2, padding: "16px", borderRadius: "2px", marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "1px", marginBottom: "8px" }}>DELIVERY TO</div>
                <div style={{ fontSize: "13px", color: T.text }}>{address.name}, {address.phone}</div>
                <div style={{ fontSize: "13px", color: T.textMuted }}>{address.street}, {address.city}, {address.state} - {address.pin}</div>
              </div>
              <div style={{ background: T.surface2, padding: "16px", borderRadius: "2px", marginBottom: "24px" }}>
                <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "1px", marginBottom: "8px" }}>PAYMENT</div>
                <div style={{ fontSize: "13px", color: T.text }}>{payment === "cod" ? "Cash on Delivery" : payment === "upi" ? "UPI Payment" : "Card Payment"}</div>
              </div>
              {error && <div style={{ color: T.red, marginBottom: "16px", fontSize: "13px" }}>{error}</div>}
              <div style={{ display: "flex", gap: "12px" }}>
                <GoldBtn outline onClick={() => setStep(2)}>Back</GoldBtn>
                <GoldBtn onClick={placeOrder}>{loading ? "Placing..." : "Place Order"}</GoldBtn>
              </div>
            </>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background: T.surface, padding: "24px", borderRadius: "2px", border: `1px solid ${T.border}`, height: "fit-content" }}>
          <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "2px", marginBottom: "16px" }}>ORDER SUMMARY</div>
          {cart.map(item => (
            <div key={item.cartItemId || item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ fontSize: "12px", color: T.textMuted, flex: 1, marginRight: "8px" }}>{item.name} ×{item.qty}</div>
              <div style={{ fontSize: "12px", color: T.text }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
            </div>
          ))}
          <Divider style={{ margin: "14px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: SERIF, fontSize: "16px", color: T.text }}>Total</span>
            <span style={{ fontFamily: SERIF, fontSize: "20px", color: T.gold }}>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── OrdersPage ────────────────────────────────────────────────────────────────
const OrdersPage = ({ user, onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    api.getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "60px" }}>
      <h1 style={{ fontFamily: SERIF, fontSize: "32px", color: T.text, marginBottom: "8px" }}>Your Orders</h1>
      <div style={{ fontSize: "13px", color: T.textMuted, marginBottom: "40px" }}>{orders.length} order{orders.length !== 1 ? "s" : ""}</div>
      {loading ? <div style={{ color: T.textMuted }}>Loading...</div>
        : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text, marginBottom: "12px" }}>No orders yet</div>
            <div style={{ color: T.textMuted, marginBottom: "28px" }}>Start shopping to see your orders here</div>
            <GoldBtn onClick={() => onNavigate("products")}>Browse Products</GoldBtn>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: T.surface, border: `1px solid ${T.borderFaint}`, borderRadius: "2px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "1px", marginBottom: "4px" }}>ORDER #{order.id}</div>
                    <div style={{ fontSize: "12px", color: T.textMuted }}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ background: T.goldDim, color: T.gold, border: `1px solid ${T.gold}`, borderRadius: "2px", padding: "4px 10px", fontSize: "11px", letterSpacing: "0.5px" }}>{order.status || "CONFIRMED"}</div>
                    <div style={{ fontFamily: SERIF, fontSize: "18px", color: T.gold, marginTop: "6px" }}>₹{order.totalAmount?.toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <Divider />
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: T.textMuted }}>{item.productName} ×{item.quantity}</span>
                      <span style={{ color: T.text }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

// ── AccountPage ───────────────────────────────────────────────────────────────
const AccountPage = ({ user, onNavigate, defaultTab }) => {
  const [tab, setTab] = useState(defaultTab || "orders");
  useEffect(() => { if (defaultTab) setTab(defaultTab); }, [defaultTab]);

  const [profile, setProfile]   = useState({ name: user?.name || "", phone: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [addresses, setAddresses] = useState([]);
  const [newAddr, setNewAddr]   = useState({ name: "", street: "", city: "", state: "", pin: "", phone: "" });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [msg, setMsg]           = useState("");
  const [err, setErr]           = useState("");

  useEffect(() => {
    api.getProfile().then(r => setProfile({ name: r.data.name, phone: r.data.phone || "" })).catch(() => {});
    api.getAddresses().then(r => setAddresses(r.data)).catch(() => {});
  }, []);

  const flash = (m, isErr = false) => { if (isErr) setErr(m); else setMsg(m); setTimeout(() => { setMsg(""); setErr(""); }, 3000); };

  const saveProfile = async () => {
    try { await api.updateProfile({ name: profile.name, phone: profile.phone }); flash("Profile updated"); }
    catch { flash("Failed to update", true); }
  };

  const changePassword = async () => {
    if (passwords.newPass !== passwords.confirm) return flash("Passwords don't match", true);
    try { await api.updateProfile({ currentPassword: passwords.current, newPassword: passwords.newPass }); flash("Password changed"); setPasswords({ current: "", newPass: "", confirm: "" }); }
    catch { flash("Failed to change password", true); }
  };

  const addAddress = async () => {
    try { const r = await api.addAddress(newAddr); setAddresses(a => [...a, r.data]); setNewAddr({ name: "", street: "", city: "", state: "", pin: "", phone: "" }); setShowAddrForm(false); flash("Address added"); }
    catch { flash("Failed to add address", true); }
  };

  const [isSeller, setIsSeller]       = useState(false);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerForm, setSellerForm]   = useState({ shopName:"", businessType:"SOLE_PROPRIETOR", businessAddress:"", gstNumber:"", panNumber:"", bankAccount:"", ifscCode:"", phone:"" });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name:"", description:"", price:"", stock:"", category:"", brand:"", imageUrl:"" });

  useEffect(() => {
    api.checkIsSeller().then(r => {
      setIsSeller(r.data.isSeller);
      if (r.data.isSeller) {
        api.getSellerProfile().then(s => setSellerProfile(s.data));
        api.getSellerProducts().then(s => setSellerProducts(s.data));
      }
    }).catch(() => {});
  }, []);

  const registerSeller = async () => {
    try {
      const r = await api.registerAsSeller(sellerForm);
      setSellerProfile(r.data); setIsSeller(true); flash("🎉 Seller account activated!");
    } catch(e) { flash(e.response?.data?.message || "Registration failed", true); }
  };

  const saveSellerProfile = async () => {
    try { const r = await api.updateSellerProfile(sellerForm); setSellerProfile(r.data); flash("Profile updated"); }
    catch { flash("Update failed", true); }
  };

  const submitProduct = async () => {
    const price = parseFloat(productForm.price);
    const stock = parseInt(productForm.stock);
    if (!productForm.name?.trim()) return flash("Product name is required", true);
    if (isNaN(price) || price <= 0)  return flash("Enter a valid price", true);
    if (isNaN(stock) || stock < 0)   return flash("Enter a valid stock quantity", true);
    const data = { ...productForm, price, stock };
    try {
      if (editingProduct) {
        const r = await api.updateSellerProduct(editingProduct.id, data);
        setSellerProducts(ps => ps.map(p => p.id === editingProduct.id ? r.data : p));
        flash("Product updated");
      } else {
        const r = await api.addSellerProduct(data);
        setSellerProducts(ps => [...ps, r.data]);
        flash("Product added");
      }
      setShowAddProduct(false); setEditingProduct(null);
      setProductForm({ name:"", description:"", price:"", stock:"", category:"", brand:"", imageUrl:"" });
    } catch(e) { flash(e.response?.data?.message || e.message || "Failed to save product", true); }
  };

  const deleteSellerProduct = async (id) => {
    try { await api.deleteSellerProduct(id); setSellerProducts(ps => ps.filter(p => p.id !== id)); flash("Product deleted"); }
    catch { flash("Failed to delete", true); }
  };

  const tabs = [
    { id: "orders",    label: "Your Orders",       icon: "📦" },
    { id: "security",  label: "Login & Security",   icon: "🔐" },
    { id: "payment",   label: "Payment Methods",    icon: "💳" },
    { id: "addresses", label: "Your Addresses",     icon: "📍" },
    { id: "seller",    label: "Seller Hub",         icon: "🏪" },
    { id: "contact",   label: "Contact Us",         icon: "📞" },
  ];

  const inputStyle = { background: T.surface2, border: `1px solid ${T.borderFaint}`, color: T.text, padding: "10px 14px", borderRadius: "2px", fontSize: "14px", outline: "none", fontFamily: SANS, width: "100%" };
  const labelStyle = { fontSize: "11px", color: T.gold, letterSpacing: "1px", marginBottom: "6px", display: "block" };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "60px", display: "flex", gap: "40px" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0 }}>
        <div style={{ fontFamily: SERIF, fontSize: "20px", color: T.text, marginBottom: "4px" }}>{user?.name}</div>
        <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "28px" }}>{user?.email}</div>
        {tabs.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", marginBottom: "4px", cursor: "pointer", borderLeft: `2px solid ${tab === t.id ? T.gold : "transparent"}`, background: tab === t.id ? T.goldDim : "transparent", borderRadius: "0 2px 2px 0", transition: "all 0.2s" }}
            onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.background = T.surface2; }}
            onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.background = "transparent"; }}>
            <span style={{ fontSize: "15px" }}>{t.icon}</span>
            <span style={{ fontSize: "13px", color: tab === t.id ? T.gold : T.textMuted }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: T.surface, borderRadius: "2px", padding: "32px" }}>
        {msg && <div style={{ background: "rgba(34,197,94,0.1)", border: `1px solid ${T.green}`, color: T.green, padding: "10px 14px", borderRadius: "2px", fontSize: "13px", marginBottom: "20px" }}>{msg}</div>}
        {err && <div style={{ background: "rgba(239,68,68,0.1)", border: `1px solid ${T.red}`, color: T.red, padding: "10px 14px", borderRadius: "2px", fontSize: "13px", marginBottom: "20px" }}>{err}</div>}

        {tab === "orders" && (
          <div>
            <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text, marginBottom: "20px" }}>Your Orders</div>
            <GoldBtn onClick={() => onNavigate("orders")}>View All Orders →</GoldBtn>
          </div>
        )}

        {tab === "security" && (
          <div>
            <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text, marginBottom: "24px" }}>Login & Security</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
              <div><label style={labelStyle}>FULL NAME</label><input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>MOBILE NUMBER</label>
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${T.borderFaint}`, borderRadius: "2px", overflow: "hidden" }}>
                  <span style={{ padding: "10px 12px", background: T.surface3, color: T.textMuted, fontSize: "13px", borderRight: `1px solid ${T.borderFaint}` }}>+91</span>
                  <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value.replace(/\D/g,"").slice(0,10) }))} placeholder="10-digit number" style={{ ...inputStyle, border: "none", borderRadius: 0 }} />
                </div>
              </div>
              <GoldBtn onClick={saveProfile}>Save Profile</GoldBtn>
              <Divider style={{ margin: "8px 0" }} />
              <div style={{ fontFamily: SERIF, fontSize: "18px", color: T.text, marginBottom: "8px" }}>Change Password</div>
              <div><label style={labelStyle}>CURRENT PASSWORD</label><input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} style={inputStyle} /></div>
              <div><label style={labelStyle}>NEW PASSWORD</label><input type="password" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} style={inputStyle} /></div>
              <div><label style={labelStyle}>CONFIRM PASSWORD</label><input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} style={inputStyle} /></div>
              <GoldBtn onClick={changePassword}>Change Password</GoldBtn>
            </div>
          </div>
        )}

        {tab === "payment" && (
          <div>
            <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text, marginBottom: "24px" }}>Payment Methods</div>
            {[{icon:"🏦",title:"Amazon Pay Wallet",sub:"Balance: ₹0.00"},{icon:"💳",title:"Debit Card ending 4242",sub:"Expires 12/26"},{icon:"💳",title:"Credit Card ending 1234",sub:"Expires 08/25"}].map(m => (
              <div key={m.title} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: T.surface2, border: `1px solid ${T.borderFaint}`, borderRadius: "2px", marginBottom: "10px" }}>
                <span style={{ fontSize: "24px" }}>{m.icon}</span>
                <div>
                  <div style={{ color: T.text, fontSize: "14px" }}>{m.title}</div>
                  <div style={{ color: T.textMuted, fontSize: "12px" }}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "addresses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text }}>Your Addresses</div>
              <GoldBtn small outline onClick={() => setShowAddrForm(v => !v)}>+ Add Address</GoldBtn>
            </div>
            {showAddrForm && (
              <div style={{ background: T.surface2, border: `1px solid ${T.border}`, padding: "24px", borderRadius: "2px", marginBottom: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[["Full Name","name","text"],["Phone","phone","tel"],["Street","street","text"],["City","city","text"],["State","state","text"],["PIN","pin","text"]].map(([label, key, type]) => (
                    <div key={key} style={{ gridColumn: key === "street" ? "1/-1" : "auto" }}>
                      <label style={labelStyle}>{label.toUpperCase()}</label>
                      <input value={newAddr[key]} onChange={e => setNewAddr(a => ({ ...a, [key]: key === "phone" ? e.target.value.replace(/\D/g,"").slice(0,10) : key === "pin" ? e.target.value.replace(/\D/g,"").slice(0,6) : e.target.value }))} type={type} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <GoldBtn small onClick={addAddress}>Save Address</GoldBtn>
                  <GoldBtn small outline onClick={() => setShowAddrForm(false)}>Cancel</GoldBtn>
                </div>
              </div>
            )}
            {addresses.length === 0 ? <div style={{ color: T.textMuted, fontSize: "13px" }}>No addresses saved yet.</div>
              : addresses.map(a => (
                <div key={a.id} style={{ padding: "16px", background: T.surface2, border: `1px solid ${T.borderFaint}`, borderRadius: "2px", marginBottom: "10px" }}>
                  <div style={{ fontSize: "14px", color: T.text, marginBottom: "4px" }}>{a.name}</div>
                  <div style={{ fontSize: "12px", color: T.textMuted }}>{a.street}, {a.city}, {a.state} - {a.pin}</div>
                  <div style={{ fontSize: "12px", color: T.textMuted }}>{a.phone}</div>
                  <button onClick={() => api.deleteAddress(a.id).then(() => setAddresses(ads => ads.filter(x => x.id !== a.id)))}
                    style={{ background: "none", border: "none", color: T.red, fontSize: "12px", cursor: "pointer", marginTop: "8px", padding: 0 }}>Remove</button>
                </div>
              ))}
          </div>
        )}

        {tab === "seller" && (
          <div>
            {!isSeller ? (
              /* ── Registration Form ── */
              <div>
                <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text, marginBottom: "6px" }}>Start Selling on PrimeDeals</div>
                <div style={{ fontSize: "13px", color: T.textMuted, marginBottom: "28px" }}>Fill in your business details to activate your seller account</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "600px" }}>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={labelStyle}>SHOP / BUSINESS NAME *</label>
                    <input value={sellerForm.shopName} onChange={e => setSellerForm(f=>({...f,shopName:e.target.value}))} style={inputStyle} placeholder="e.g. TechZone Retail" />
                  </div>
                  <div>
                    <label style={labelStyle}>BUSINESS TYPE *</label>
                    <select value={sellerForm.businessType} onChange={e => setSellerForm(f=>({...f,businessType:e.target.value}))}
                      style={{...inputStyle, cursor:"pointer"}}>
                      {["SOLE_PROPRIETOR","PARTNERSHIP","PVT_LTD","LLP"].map(t=><option key={t} value={t}>{t.replace(/_/g," ")}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>PHONE *</label>
                    <input value={sellerForm.phone} onChange={e => setSellerForm(f=>({...f,phone:e.target.value.replace(/\D/g,"").slice(0,10)}))} style={inputStyle} placeholder="10-digit number" />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={labelStyle}>BUSINESS ADDRESS *</label>
                    <input value={sellerForm.businessAddress} onChange={e => setSellerForm(f=>({...f,businessAddress:e.target.value}))} style={inputStyle} placeholder="Full business address" />
                  </div>
                  <div>
                    <label style={labelStyle}>GST NUMBER *</label>
                    <input value={sellerForm.gstNumber} onChange={e => setSellerForm(f=>({...f,gstNumber:e.target.value.toUpperCase().slice(0,15)}))} style={inputStyle} placeholder="22AAAAA0000A1Z5" />
                  </div>
                  <div>
                    <label style={labelStyle}>PAN NUMBER *</label>
                    <input value={sellerForm.panNumber} onChange={e => setSellerForm(f=>({...f,panNumber:e.target.value.toUpperCase().slice(0,10)}))} style={inputStyle} placeholder="ABCDE1234F" />
                  </div>
                  <div>
                    <label style={labelStyle}>BANK ACCOUNT NUMBER *</label>
                    <input value={sellerForm.bankAccount} onChange={e => setSellerForm(f=>({...f,bankAccount:e.target.value.replace(/\D/g,"")}))} style={inputStyle} placeholder="Account number" />
                  </div>
                  <div>
                    <label style={labelStyle}>IFSC CODE *</label>
                    <input value={sellerForm.ifscCode} onChange={e => setSellerForm(f=>({...f,ifscCode:e.target.value.toUpperCase().slice(0,11)}))} style={inputStyle} placeholder="SBIN0001234" />
                  </div>
                </div>
                <div style={{ marginTop: "8px", fontSize: "12px", color: T.textFaint, maxWidth: "600px" }}>
                  📌 GST, PAN, and Bank details are required for payouts and compliance with Indian tax laws.
                </div>
                <GoldBtn onClick={registerSeller} style={{ marginTop: "20px" }}>Activate Seller Account</GoldBtn>
              </div>
            ) : (
              /* ── Seller Dashboard ── */
              <div>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <div>
                    <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text }}>{sellerProfile?.shopName}</div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "6px", flexWrap: "wrap" }}>
                      <span style={{ background: T.goldDim, color: T.gold, border: `1px solid ${T.gold}`, borderRadius: "2px", padding: "2px 8px", fontSize: "11px" }}>🟢 {sellerProfile?.status}</span>
                      <span style={{ color: T.textMuted, fontSize: "12px" }}>{sellerProfile?.businessType?.replace(/_/g," ")}</span>
                    </div>
                  </div>
                  <GoldBtn small onClick={() => { setShowAddProduct(true); setEditingProduct(null); setProductForm({ name:"", description:"", price:"", stock:"", category:"", brand:"", imageUrl:"" }); }}>+ Add Product</GoldBtn>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
                  {[["🛍", "Products Listed", sellerProducts.length], ["📦", "GST Number", sellerProfile?.gstNumber || "—"], ["🏦", "IFSC Code", sellerProfile?.ifscCode || "—"]].map(([icon, label, val]) => (
                    <div key={label} style={{ background: T.surface2, border: `1px solid ${T.borderFaint}`, borderRadius: "2px", padding: "16px" }}>
                      <div style={{ fontSize: "20px", marginBottom: "6px" }}>{icon}</div>
                      <div style={{ fontSize: "11px", color: T.gold, letterSpacing: "1px" }}>{label.toUpperCase()}</div>
                      <div style={{ fontSize: "16px", color: T.text, marginTop: "4px", fontFamily: SERIF }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Add / Edit Product Form */}
                {showAddProduct && (
                  <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: "2px", padding: "20px", marginBottom: "20px" }}>
                    <div style={{ fontFamily: SERIF, fontSize: "18px", color: T.text, marginBottom: "16px" }}>{editingProduct ? "Edit Product" : "Add New Product"}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[["Product Name","name","text"],["Brand","brand","text"],["Category","category","text"],["Image URL","imageUrl","text"],["Price (₹)","price","number"],["Stock","stock","number"]].map(([label, key, type]) => (
                        <div key={key}>
                          <label style={labelStyle}>{label.toUpperCase()}</label>
                          <input type={type} value={productForm[key]} onChange={e => setProductForm(f=>({...f,[key]:e.target.value}))} style={inputStyle} />
                        </div>
                      ))}
                      <div style={{ gridColumn: "1/-1" }}>
                        <label style={labelStyle}>DESCRIPTION</label>
                        <textarea value={productForm.description} onChange={e => setProductForm(f=>({...f,description:e.target.value}))} rows={3}
                          style={{...inputStyle, resize:"vertical"}} />
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
                      <GoldBtn small onClick={submitProduct}>{editingProduct ? "Update" : "Add Product"}</GoldBtn>
                      <GoldBtn small outline onClick={() => { setShowAddProduct(false); setEditingProduct(null); }}>Cancel</GoldBtn>
                    </div>
                  </div>
                )}

                {/* Product List */}
                <div style={{ fontSize: "10px", color: T.gold, letterSpacing: "2px", marginBottom: "12px" }}>YOUR PRODUCTS ({sellerProducts.length})</div>
                {sellerProducts.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"40px", color:T.textMuted, fontSize:"13px" }}>No products yet. Add your first product above.</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    {sellerProducts.map(p => (
                      <div key={p.id} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"14px", background:T.surface2, border:`1px solid ${T.borderFaint}`, borderRadius:"2px" }}>
                        <img src={p.imageUrl} alt={p.name} style={{ width:"56px", height:"56px", objectFit:"cover", borderRadius:"2px", background:T.surface3 }} onError={e=>e.target.style.display="none"} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"13px", color:T.text, fontWeight:500 }}>{p.name}</div>
                          <div style={{ fontSize:"11px", color:T.textMuted }}>{p.category} · Stock: {p.stock}</div>
                        </div>
                        <div style={{ fontFamily:SERIF, fontSize:"16px", color:T.gold }}>₹{p.price?.toLocaleString("en-IN")}</div>
                        <div style={{ display:"flex", gap:"8px" }}>
                          <button onClick={() => { setEditingProduct(p); setProductForm({name:p.name,description:p.description||"",price:p.price,stock:p.stock,category:p.category||"",brand:p.brand||"",imageUrl:p.imageUrl||""}); setShowAddProduct(true); }}
                            style={{ background:"none", border:`1px solid ${T.border}`, color:T.gold, padding:"5px 12px", borderRadius:"2px", cursor:"pointer", fontSize:"12px" }}>Edit</button>
                          <button onClick={() => deleteSellerProduct(p.id)}
                            style={{ background:"none", border:`1px solid rgba(239,68,68,0.3)`, color:T.red, padding:"5px 12px", borderRadius:"2px", cursor:"pointer", fontSize:"12px" }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "contact" && (
          <div>
            <div style={{ fontFamily: SERIF, fontSize: "24px", color: T.text, marginBottom: "24px" }}>Contact Us</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              {[{icon:"📞",title:"Customer Care",detail:"1800-123-4567",sub:"Mon–Sat, 9AM–9PM IST"},{icon:"📧",title:"Email Support",detail:"support@primedeals.in",sub:"Reply within 24 hours"},{icon:"💬",title:"Live Chat",detail:"Available Now",sub:"Avg wait: 2 mins"},{icon:"🏢",title:"Head Office",detail:"Bangalore, Karnataka",sub:"India 560001"}].map(c => (
                <div key={c.title} style={{ padding: "20px", background: T.surface2, border: `1px solid ${T.borderFaint}`, borderRadius: "2px" }}>
                  <div style={{ fontSize: "24px", marginBottom: "10px" }}>{c.icon}</div>
                  <div style={{ fontSize: "12px", color: T.gold, letterSpacing: "1px", marginBottom: "4px" }}>{c.title.toUpperCase()}</div>
                  <div style={{ fontSize: "14px", color: T.text, marginBottom: "2px" }}>{c.detail}</div>
                  <div style={{ fontSize: "12px", color: T.textMuted }}>{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg }) => msg ? (
  <div style={{ position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", background: T.surface, border: `1px solid ${T.gold}`, color: T.text, padding: "12px 24px", borderRadius: "2px", fontSize: "13px", zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
    <span style={{ color: T.gold, marginRight: "8px" }}>✓</span>{msg}
  </div>
) : null;

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]                   = useState("home");
  const [cart, setCart]                   = useState([]);
  const [user, setUser]                   = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory]   = useState(null);
  const [searchQuery, setSearchQuery]     = useState("");
  const [products, setProducts]           = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsPage, setProductsPage]   = useState(0);
  const [hasMore, setHasMore]             = useState(true);
  const [toast, setToast]                 = useState(null);
  const [navParam, setNavParam]           = useState(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // Load products
  useEffect(() => {
    api.getProducts(0, 40)
      .then(res => { setProducts(res.data); setHasMore(res.data.length === 40); setProductsPage(0); })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  const loadMoreProducts = () => {
    const next = productsPage + 1;
    api.getProducts(next, 40).then(res => { setProducts(p => [...p, ...res.data]); setHasMore(res.data.length === 40); setProductsPage(next); });
  };

  // Auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) { try { setUser(JSON.parse(stored)); } catch {} }
  }, []);

  const handleLogin = data => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
    setUser({ name: data.name, email: data.email });
    fetchCart();
    navigate("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user");
    setUser(null); setCart([]); navigate("home");
  };

  // Cart
  const fetchCart = async () => {
    try { const r = await api.getCart(); setCart(r.data.map(i => ({ ...i, id: i.productId, cartItemId: i.cartItemId }))); } catch {}
  };
  useEffect(() => { if (user) fetchCart(); }, [user]);

  const addToCart = async product => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    try { await api.addToCart(product.id, 1); await fetchCart(); } catch {}
  };

  const removeFromCart = async cartItemId => {
    setCart(prev => {
      const item = prev.find(i => i.cartItemId === cartItemId);
      if (!item) return prev;
      if (item.qty > 1) return prev.map(i => i.cartItemId === cartItemId ? { ...i, qty: i.qty - 1 } : i);
      return prev.filter(i => i.cartItemId !== cartItemId);
    });
    try { await api.removeFromCart(cartItemId); } catch {}
  };

  const updateQty = (cartItemId, qty) => {
    if (qty < 1) { removeFromCart(cartItemId); return; }
    setCart(prev => prev.map(i => i.cartItemId === cartItemId ? { ...i, qty } : i));
  };

  const placeOrder = async (address, payment) => {
    const items = cart.map(i => ({ productId: i.id, quantity: i.qty, price: i.price }));
    await api.createOrder({ items, address, paymentMethod: payment, totalAmount: cart.reduce((s, i) => s + i.price * i.qty, 0) });
    await api.clearCart();
    setCart([]);
  };

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const navigate = (target, extra) => {
    if (target === "products" && extra && CATEGORIES.some(c => c.name === extra)) setFilterCategory(extra);
    else if (target !== "products") setFilterCategory(null);
    if (target === "account") setNavParam(extra || null);
    if (target === "home") { setSearchQuery(""); }
    setPage(target);
    window.scrollTo(0, 0);
  };

  const productClick = product => { setSelectedProduct(product); navigate("product"); };

  const requireAuth = () => { if (!user) { navigate("login"); throw new Error("Not logged in"); } };

  const renderPage = () => {
    switch (page) {
      case "home":     return <HomePage onNavigate={navigate} onAddToCart={p => { try { requireAuth(); addToCart(p); showToast(`${p.name} added to cart`); } catch {} }} onProductClick={productClick} products={products} cart={cart} onRemoveFromCart={removeFromCart} />;
      case "product":  return selectedProduct ? <ProductDetailPage product={selectedProduct} onAddToCart={p => { try { requireAuth(); addToCart(p); showToast(`${p.name} added to cart`); } catch {} }} onNavigate={navigate} /> : null;
      case "products": return <ProductsPage onAddToCart={p => { try { requireAuth(); addToCart(p); showToast(`${p.name} added to cart`); } catch {} }} onProductClick={productClick} filterCategory={filterCategory} searchQuery={searchQuery} products={products} loading={productsLoading} cart={cart} onRemoveFromCart={removeFromCart} onLoadMore={loadMoreProducts} hasMore={hasMore} />;
      case "cart":     return <CartPage cart={cart} onRemove={removeFromCart} onUpdateQty={updateQty} onNavigate={navigate} />;
      case "checkout": return <CheckoutPage cart={cart} user={user} onNavigate={navigate} onPlaceOrder={placeOrder} />;
      case "login":    return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case "account":  return <AccountPage user={user} onNavigate={navigate} defaultTab={navParam} />;
      case "orders":   return <OrdersPage user={user} onNavigate={navigate} />;
      default:         return null;
    }
  };

  return (
    <div style={{ fontFamily: SANS, minHeight: "100vh", background: T.bg, color: T.text }}>
      {page !== "login" && (
        <Navbar cartCount={cartCount} onNavigate={navigate} searchQuery={searchQuery}
          onSearch={q => { setSearchQuery(q); navigate("products"); }} user={user} onLogout={handleLogout} products={products} />
      )}
      <main>{renderPage()}</main>
      <Toast msg={toast} />
    </div>
  );
}
