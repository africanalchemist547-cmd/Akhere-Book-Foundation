import { useState, useEffect, useRef, type CSSProperties } from "react";

// Resolve assets relative to Vite's base URL so images work on both
// localhost (BASE_URL="/") and Replit (BASE_URL may differ).
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
export const asset = (name: string) => `${BASE}/assets/${name}`;

// ─── ASSET PATHS ────────────────────────────────────────────
export const ASSETS = {
  logoGreen: asset("ABF_green_badge_1786625589612.png"),
  logoAllGreen: asset("ABF_all-green_badge_1786625589656.png"),
  bookDrive: asset("ABF_-_book_drive_'25___t2a_1786625589690.png"),
  schoolAttacks1: asset("ABF_-_School_attacks_A1_1786625589753.png"),
  schoolAttacks2: asset("ABF_-_School_attacks_A2_1786625589723.png"),
  hero: asset("abf_hero.jpg"),
  library: asset("abf_library.jpg"),
  future: asset("abf_future.jpg"),
  // Instagram screenshots
  ig1: asset("Screenshot_20260811-211818_1786625694595.png"),
  ig2: asset("Screenshot_20260811-211840_1786625679365.png"),
  ig3: asset("Screenshot_20260811-211913_1786625694659.png"),
  ig4: asset("Screenshot_20260811-211923_1786625679332.png"),
  ig5: asset("Screenshot_20260811-212000_1786625679296.png"),
  ig6: asset("Screenshot_20260811-212011_1786625679233.png"),
  ig7: asset("Screenshot_20260811-212142_1786625656465.png"),
  ig8: asset("Screenshot_20260811-212208_1786625656432.png"),
  ig9: asset("Screenshot_20260811-212220_1786625656405.png"),
  ig10: asset("Screenshot_20260811-212243_1786625656370.png"),
  ig15: asset("Screenshot_20260811-212833_1786625635467.png"),
  ig13: asset("Screenshot_20260811-212757_1786625635567.png"),
  ig12: asset("Screenshot_20260811-212733_1786625635605.png"),
};

export interface SharedTeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  description: string;
  fullStory: string;
  image: string;
  featured: boolean;
  displayOrder: number;
}

export const TEAM_MEMBERS: SharedTeamMember[] = [
  {
    id: "oluwatosin-aina",
    name: "Oluwatosin Aina",
    slug: "oluwatosin-aina",
    role: "ABF Team Member",
    description: "A familiar presence in ABF's journey from the very beginning — part of the vision, part of the work happening today.",
    fullStory: "Oluwatosin has been a key part of the Akhere Book Foundation journey since its initial planning stages. Believing that every child deserves a chance to discover their potential through reading, Oluwatosin has helped shape the foundation's vision of providing community-level access to books and learning spaces. By coordinating with local coordinators and tracking project progress, Oluwatosin works to make sure the foundation's plans translate into real, operational opportunities for children.",
    image: ASSETS.ig10,
    featured: true,
    displayOrder: 1,
  },
  {
    id: "jennifer-odimgbe-james",
    name: "Jennifer Odimgbe-James",
    slug: "jennifer-odimgbe-james",
    role: "ABF Team Member",
    description: "One of the dedicated people behind ABF's everyday effort to make books and learning more accessible to children and communities.",
    fullStory: "Jennifer plays an active role in the daily coordination and logistics of Akhere Book Foundation's programs. From sorting book donations to liaising with volunteers and community representatives, Jennifer works to keep ABF's reading spaces active and stocked. Jennifer believes that the simple presence of a storybook can spark a lifelong love for learning, and is committed to making sure those books reach the hands of children who need them.",
    image: ASSETS.ig5,
    featured: true,
    displayOrder: 2,
  }
];

// ─── ABF CONTACT INFO ─────────────────────────────────────────
export const CONTACT = {
  instagram: "https://www.instagram.com/akhere_book_foundation",
  twitter: "https://twitter.com/AkhereBook",
  email: "akherebookfoundation@gmail.com",
  phone1: "+234 814 267 9392",
  phone2: "+234 803 406 4395",
  whatsapp: "https://wa.me/2348142679392",
};

// ─── ICONS (inline SVG) ──────────────────────────────────────
export const Icon = {
  Menu: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  X: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Book: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Heart: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Star: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  Twitter: () => (
    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 5.831zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Mail: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.59 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
};

// ─── REUSABLE SMALL COMPONENTS ───────────────────────────────
export function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
      <div style={{ width: 32, height: 3, background: "#8dc63f", borderRadius: 2 }} />
      <span style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.1em", color: "#8dc63f", textTransform: "uppercase" }}>
        {text}
      </span>
    </div>
  );
}

export function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.6875rem",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      background: `${color}18`,
      color,
      border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  );
}

// ─── DONATE MONEY MODAL ─────────────────────────────────────
export function DonateMoneyModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [selectedQuick, setSelectedQuick] = useState<number | null>(null);
  const [frequency, setFrequency] = useState("one-time");

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleQuick = (val: number) => {
    setSelectedQuick(val);
    setAmount(String(val));
  };

  const faqs = [
    "How will my donation be used?",
    "Can I donate a small amount?",
    "Can I support a specific project?",
  ];

  const whatsappMsg = encodeURIComponent(
    `Hi ABF, I'd like to donate${amount ? ` ₦${Number(amount).toLocaleString()}` : ""} (${frequency}). How do I proceed?`
  );

  return (
    <div className="abf-modal-overlay" onClick={onClose}>
      <div
        className="abf-animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 24,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0f7f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.25rem" }}>💚</span>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a2218", margin: 0, lineHeight: 1.2 }}>Every Contribution Counts</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#f5f5f3", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", flexShrink: 0 }}
          >
            <Icon.X />
          </button>
        </div>

        <p style={{ fontSize: "0.9375rem", color: "#4a5a44", lineHeight: 1.65, marginBottom: "1.75rem" }}>
          You don't need to give a lot to make a difference. ABF works to stretch contributions as far as possible so that small acts of support can become meaningful opportunities for children.
        </p>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontWeight: 700, color: "#1a2218", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
            How much would you like to give?
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "#2d6a2d", fontSize: "1.125rem" }}>₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setSelectedQuick(null); }}
              placeholder="Enter amount"
              style={{
                width: "100%",
                padding: "0.9375rem 1rem 0.9375rem 2.25rem",
                border: "2px solid #dde8dd",
                borderRadius: 12,
                fontSize: "1.125rem",
                fontWeight: 600,
                fontFamily: "inherit",
                outline: "none",
                color: "#1a2218",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
              onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {quickAmounts.map((val) => (
            <button
              key={val}
              className={`abf-amount-btn${selectedQuick === val ? " selected" : ""}`}
              onClick={() => handleQuick(val)}
            >
              ₦{val.toLocaleString()}
            </button>
          ))}
          <button
            className={`abf-amount-btn${selectedQuick === -1 ? " selected" : ""}`}
            onClick={() => { setSelectedQuick(-1); setAmount(""); }}
          >
            Other
          </button>
        </div>

        <div style={{ marginBottom: "1.75rem" }}>
          <label style={{ display: "block", fontWeight: 700, color: "#1a2218", marginBottom: "0.75rem", fontSize: "0.9375rem" }}>
            How often?
          </label>
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            {[
              { key: "one-time", label: "One-time" },
              { key: "bi-weekly", label: "Every 2 weeks" },
              { key: "monthly", label: "Monthly" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`abf-freq-btn${frequency === key ? " selected" : ""}`}
                onClick={() => setFrequency(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          background: "#f8faf6",
          borderRadius: 16,
          padding: "1.25rem",
          marginBottom: "1.5rem",
          border: "1px solid #e8f0e8",
        }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1a2218", marginBottom: "0.875rem" }}>
            Have a question before you give?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {faqs.map((q, i) => (
              <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#e8f5e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <svg width="11" height="11" fill="none" stroke="#2d6a2d" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                  </svg>
                </div>
                <span style={{ fontSize: "0.875rem", color: "#4a5a44", lineHeight: 1.5 }}>{q}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6a7a64", marginBottom: "1rem" }}>
          Still have a question?{" "}
          <a href={`mailto:${CONTACT.email}`} style={{ color: "#2d6a2d", fontWeight: 600, textDecoration: "none" }}>
            Ask us
          </a>
        </p>

        <a
          href={`${CONTACT.whatsapp}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", textDecoration: "none" }}
        >
          <button className="abf-btn-whatsapp">
            <Icon.WhatsApp />
            Continue via WhatsApp
          </button>
        </a>

        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9aaa94", marginTop: "0.875rem" }}>
          You'll be connected with our team to complete your contribution.
        </p>
      </div>
    </div>
  );
}

// ─── DONATE BOOK MODAL ───────────────────────────────────────
export function DonateBookModal({ onClose }: { onClose: () => void }) {
  const categories = [
    "Children's books", "Story books", "Educational textbooks",
    "Dictionaries", "Fiction", "Non-fiction", "Poetry",
    "Historical books", "Religious / cultural books", "Comic books",
  ];

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const toggle = (cat: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const buildMsg = () => {
    const cats = Array.from(selected).join(", ") || "[not specified]";
    return encodeURIComponent(
      `Hi ABF, I'd like to donate books.\n\nCategories: ${cats}\nApprox. quantity: ${quantity || "[not specified]"}\nLocation: ${location || "[not specified]"}\nName: ${name || "[not specified]"}\nPhone: ${phone || "[not specified]"}\n\nPlease let me know the next steps. Thank you!`
    );
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "0.8125rem 1rem",
    border: "2px solid #dde8dd",
    borderRadius: 10,
    fontSize: "0.9375rem",
    fontFamily: "inherit",
    outline: "none",
    color: "#1a2218",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
    marginTop: "0.375rem",
    background: "white",
  };

  return (
    <div className="abf-modal-overlay" onClick={onClose}>
      <div
        className="abf-animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 24,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f5fbeb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.25rem" }}>📚</span>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a2218", margin: 0, lineHeight: 1.2 }}>Give a Book. Open a World.</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#f5f5f3", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", flexShrink: 0 }}
          >
            <Icon.X />
          </button>
        </div>

        <p style={{ fontSize: "0.9375rem", color: "#4a5a44", lineHeight: 1.65, marginBottom: "1.5rem" }}>
          You don't need a huge collection. A few good books can still travel a long way. All books should be in <strong>good condition</strong> — no missing pages or covers.
        </p>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 700, color: "#1a2218", marginBottom: "0.75rem", fontSize: "0.9375rem" }}>
            What would you like to donate? <span style={{ fontWeight: 400, color: "#8a9a84" }}>(Select all that apply)</span>
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`abf-category-chip${selected.has(cat) ? " selected" : ""}`}
                onClick={() => toggle(cat)}
              >
                {selected.has(cat) && <Icon.Check />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Approximately how many books?</label>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 10, 25, a box..."
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
              onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Where are you located?</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City / State"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
              onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
              onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Phone / WhatsApp</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
              onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
            />
          </div>
        </div>

        <a
          href={`${CONTACT.whatsapp}?text=${buildMsg()}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", textDecoration: "none" }}
        >
          <button className="abf-btn-whatsapp">
            <Icon.WhatsApp />
            Donate Books via WhatsApp
          </button>
        </a>

        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9aaa94", marginTop: "0.875rem" }}>
          Our team will follow up to arrange collection or drop-off.
        </p>
      </div>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────
export function Header({ onDonate }: { onDonate: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const activePath = window.location.pathname;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Latest from ABF", href: "/latest-from-abf" },
    { label: "Meet the Team", href: "/meet-the-team" },
    { label: "Get Involved", href: "/get-involved" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return activePath === "/" || activePath === "";
    }
    if (href === "/about") {
      return activePath.startsWith("/about");
    }
    if (href === "/projects") {
      return activePath.startsWith("/projects");
    }
    if (href === "/latest-from-abf" || href === "/latest") {
      return activePath.startsWith("/latest");
    }
    if (href === "/meet-the-team" || href === "/team") {
      return activePath.startsWith("/meet-the-team") || activePath.startsWith("/team");
    }
    if (href === "/get-involved") {
      return activePath.startsWith("/get-involved");
    }
    return false;
  };

  return (
    <>
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "white",
        borderBottom: scrolled ? "1px solid #e8f0e8" : "1px solid #f0f4f0",
        boxShadow: scrolled ? "0 2px 24px rgba(45,106,45,0.08)" : "none",
        transition: "all 0.3s ease",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
            <img src={ASSETS.logoGreen} alt="Akhere Book Foundation" style={{ height: 48, width: 48, objectFit: "contain" }} />
            <div className="abf-logo-text">
              <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#2d6a2d", lineHeight: 1.1 }}>Akhere Book</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#8dc63f", lineHeight: 1.1 }}>Foundation</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-nav">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`abf-nav-link${active ? " active" : ""}`}
                  style={{ padding: "0.5rem 0.875rem", textDecoration: "none", fontSize: "0.9rem" }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Donate */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button className="abf-btn-donate" onClick={onDonate} style={{ padding: "0.625rem 1.5rem", fontSize: "0.875rem" }}>
              Donate
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#2d6a2d", display: "flex", padding: "0.25rem" }}
              className="mobile-menu-btn"
              aria-label="Open menu"
            >
              <Icon.Menu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}
          onClick={() => setMobileOpen(false)}
        >
          <div style={{ flex: 1, background: "rgba(0,0,0,0.4)" }} />
          <div
            className="abf-animate-slide-down"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              inset: 0,
              background: "white",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              maxWidth: 320,
              right: 0,
              left: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <img src={ASSETS.logoGreen} alt="ABF" style={{ height: 44, width: 44 }} />
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: "#f5f5f3", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Icon.X />
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: "0.875rem 1rem",
                      textDecoration: "none",
                      color: active ? "#2d6a2d" : "#2c3424",
                      fontWeight: active ? 700 : 500,
                      fontSize: "1rem",
                      borderRadius: 10,
                      background: active ? "#f0f7f0" : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e8f0e8" }}>
              <button
                className="abf-btn-donate"
                onClick={() => { setMobileOpen(false); onDonate(); }}
                style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "1rem" }}
              >
                💚 Donate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for desktop/mobile visibility */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .abf-logo-text { display: none !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none !important; }
          .abf-logo-text { display: block; }
        }
      `}</style>
    </>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
export function Footer({ onDonate }: { onDonate: () => void }) {
  const year = new Date().getFullYear();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Latest from ABF", href: "/latest-from-abf" },
    { label: "Meet the Team", href: "/meet-the-team" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Donate", onClick: onDonate },
  ];

  return (
    <footer style={{ background: "#111a10", color: "rgba(255,255,255,0.8)", padding: "4rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "3rem",
          marginBottom: "3rem",
          paddingBottom: "3rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <img src={ASSETS.logoAllGreen} alt="ABF Logo" style={{ height: 52, width: 52 }} />
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "white" }}>Akhere Book Foundation</div>
                <div style={{ fontSize: "0.8125rem", color: "#8dc63f", fontStyle: "italic" }}>feeding the minds of the future</div>
              </div>
            </div>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(255,255,255,0.65)", maxWidth: 320 }}>
              Helping children access books, learning and the opportunity to discover what they can become.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8dc63f", marginBottom: "1.25rem" }}>
              Navigate
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {navLinks.map((link, i) => (
                link.onClick ? (
                  <button
                    key={i}
                    onClick={link.onClick}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: "0.9375rem", textAlign: "left", padding: 0, transition: "color 0.15s", fontFamily: "inherit" }}
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={i}
                    href={link.href}
                    style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.9375rem", transition: "color 0.15s" }}
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>
          </div>

          <div>
            <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8dc63f", marginBottom: "1.25rem" }}>
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <a href={`mailto:${CONTACT.email}`} style={{ display: "flex", gap: "0.625rem", alignItems: "center", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.9rem" }}>
                <Icon.Mail />
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone1}`} style={{ display: "flex", gap: "0.625rem", alignItems: "center", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.9rem" }}>
                <Icon.Phone />
                {CONTACT.phone1}
              </a>
              <a href={`tel:${CONTACT.phone2}`} style={{ display: "flex", gap: "0.625rem", alignItems: "center", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.9rem" }}>
                <Icon.Phone />
                {CONTACT.phone2}
              </a>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              {[
                { href: CONTACT.instagram, icon: <Icon.Instagram />, label: "Instagram" },
                { href: CONTACT.twitter, icon: <Icon.Twitter />, label: "X/Twitter" },
                { href: `mailto:${CONTACT.email}`, icon: <Icon.Mail />, label: "Email" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
            © {year} Akhere Book Foundation. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            <a href="/privacy" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy</a>
            <a href="/terms" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
