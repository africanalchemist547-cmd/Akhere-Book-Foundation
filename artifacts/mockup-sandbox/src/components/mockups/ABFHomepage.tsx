/**
 * ABF Homepage — Akhere Book Foundation
 * Stage 1: Complete homepage with all sections and modals
 *
 * Asset paths reference /assets/* (served from public/assets/)
 * Real ABF contact info extracted from supplied brand materials.
 */

import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";

// Resolve assets relative to Vite's base URL so images work on both
// localhost (BASE_URL="/") and Replit (BASE_URL may differ).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const asset = (name: string) => `${BASE}/assets/${name}`;

// ─── ASSET PATHS ────────────────────────────────────────────
const ASSETS = {
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
  ig11: asset("Screenshot_20260811-212603_1786625635640.png"),
  ig12: asset("Screenshot_20260811-212733_1786625635605.png"),
  ig13: asset("Screenshot_20260811-212757_1786625635567.png"),
  ig14: asset("Screenshot_20260811-212806_1786625635535.png"),
  ig15: asset("Screenshot_20260811-212833_1786625635467.png"),

};

// ─── ABF CONTACT INFO (from supplied materials) ─────────────
const CONTACT = {
  instagram: "https://www.instagram.com/akhere_book_foundation",
  twitter: "https://twitter.com/AkhereBook",
  email: "akherebookfoundation@gmail.com",
  phone1: "+234 814 267 9392",
  phone2: "+234 803 406 4395",
  whatsapp: "https://wa.me/2348142679392",
};

// ─── ICONS (inline SVG) ──────────────────────────────────────
const Icon = {
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

// ─── TYPES ─────────────────────────────────────────────────
interface LatestCard {
  id: number;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

interface TeamMember {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface Partner {
  id: number;
  name: string;
  description: string;
  initials: string;
  color: string;
}

// ─── STATIC DATA ─────────────────────────────────────────────
const LATEST_CARDS: LatestCard[] = [
  {
    id: 1,
    category: "PROJECT",
    categoryColor: "#2d6a2d",
    title: "Azu-Ogbunike Community Library",
    excerpt: "A community space where children and adults can read, study, research and discover new possibilities. ABF's first major project is still very much alive.",
    image: ASSETS.library,
    slug: "/latest/azu-ogbunike-community-library",
  },
  {
    id: 2,
    category: "PROJECT / IMPACT",
    categoryColor: "#2d6a2d",
    title: "One Year Later: A Library Still Growing",
    excerpt: "A year ago, ABF commissioned its first project. The library is still functional, still in good condition, and children are still reading.",
    image: ASSETS.ig12,
    slug: "/latest/one-year-later",
  },
  {
    id: 3,
    category: "NEWS & ADVOCACY",
    categoryColor: "#b83232",
    title: "When Schools Are Attacked, The Future Is Attacked Too",
    excerpt: "Schools should be spaces of learning, curiosity and hope — not fear. ABF stands in solidarity with every child and teacher affected.",
    image: ASSETS.schoolAttacks1,
    slug: "/latest/when-schools-are-attacked",
  },
  {
    id: 4,
    category: "BOOK DRIVE",
    categoryColor: "#8dc63f",
    title: "We Need Story Books",
    excerpt: "The Azu-Ogbunike Library is growing — and so is the appetite for books. Children who once hadn't seen a library are now avid readers.",
    image: ASSETS.ig7,
    slug: "/latest/we-need-story-books",
  },
  {
    id: 5,
    category: "COMMUNITY",
    categoryColor: "#f5a623",
    title: "Celebrating the People Behind ABF",
    excerpt: "ABF is built by people who believe in children and in the power of access to change a life. Here's to the team that makes it happen.",
    image: ASSETS.ig15,
    slug: "/latest/celebrating-the-people",
  },
  {
    id: 6,
    category: "IMPACT STORY",
    categoryColor: "#2d6a2d",
    title: "A Child, A Book, A New Possibility",
    excerpt: "Grace was a quiet junior secondary student — until she found the library. Page by page, she discovered new worlds, new words, and the courage to write her own stories.",
    image: ASSETS.ig13,
    slug: "/latest/a-child-a-book-a-new-possibility",
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Oluwatosin Aina",
    description: "A familiar presence in ABF's journey from the very beginning — part of the vision, part of the work happening today.",
    image: ASSETS.ig10,
  },
  {
    id: 2,
    name: "Jennifer Odimgbe-James",
    description: "One of the dedicated people behind ABF's everyday effort to make books and learning more accessible to children and communities.",
    image: ASSETS.ig5,
  },
];

const PARTNERS: Partner[] = [
  {
    id: 1,
    name: "Azu-Ogbunike Library Project",
    description: "Community library partnership",
    initials: "AOL",
    color: "#2d6a2d",
  },
  {
    id: 2,
    name: "St. Thomas Comprehensive Secondary School",
    description: "School partnership — Ogbunike",
    initials: "STC",
    color: "#8dc63f",
  },
  {
    id: 3,
    name: "[ABF TO PROVIDE]",
    description: "Partner organisation",
    initials: "P",
    color: "#aaa",
  },
];

// ─── SMALL REUSABLE COMPONENTS ─────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
      <div style={{ width: 32, height: 3, background: "#8dc63f", borderRadius: 2 }} />
      <span style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.1em", color: "#8dc63f", textTransform: "uppercase" }}>
        {text}
      </span>
    </div>
  );
}

function CategoryBadge({ label, color }: { label: string; color: string }) {
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

function DonateMoneyModal({ onClose }: { onClose: () => void }) {
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
        {/* Header */}
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

        {/* Amount input */}
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

        {/* Quick amounts */}
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

        {/* Frequency */}
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

        {/* FAQ section */}
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

        {/* Ask us */}
        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6a7a64", marginBottom: "1rem" }}>
          Still have a question?{" "}
          <a href={`mailto:${CONTACT.email}`} style={{ color: "#2d6a2d", fontWeight: 600, textDecoration: "none" }}>
            Ask us
          </a>
        </p>

        {/* WhatsApp button */}
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

function DonateBookModal({ onClose }: { onClose: () => void }) {
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
        {/* Header */}
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

        {/* Categories */}
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

        {/* Fields */}
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

        {/* WhatsApp */}
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

function Header({
  onDonate,
}: {
  onDonate: () => void;
}) {
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

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Latest from ABF", href: "/latest" },
    { label: "Meet the Team", href: "/team" },
    { label: "Get Involved", href: "/get-involved" },
  ];

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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`abf-nav-link${link.href === "/" ? " active" : ""}`}
                style={{ padding: "0.5rem 0.875rem", textDecoration: "none", fontSize: "0.9rem" }}
              >
                {link.label}
              </a>
            ))}
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
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: "0.875rem 1rem",
                    textDecoration: "none",
                    color: link.href === "/" ? "#2d6a2d" : "#2c3424",
                    fontWeight: link.href === "/" ? 700 : 500,
                    fontSize: "1rem",
                    borderRadius: 10,
                    background: link.href === "/" ? "#f0f7f0" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {link.label}
                </a>
              ))}
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

// ─── HERO ─────────────────────────────────────────────────────

function HeroSection({ onDonate, onDonateBook }: { onDonate: () => void; onDonateBook: () => void }) {
  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
    }}>
      {/* Background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${ASSETS.hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        transform: "scale(1.02)",
      }} />

      {/* Overlay */}
      <div className="abf-hero-overlay" style={{ position: "absolute", inset: 0 }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 1280,
        margin: "0 auto",
        padding: "7rem 1.5rem 5rem",
        width: "100%",
      }}>
        <div style={{ maxWidth: 680 }}>
          <SectionLabel text="Akhere Book Foundation" />

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.07,
            marginBottom: "1.5rem",
            letterSpacing: "-0.02em",
          }}>
            Help Build<br />
            <span style={{ color: "#8dc63f" }}>What Comes Next.</span>
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.7,
            marginBottom: "1rem",
            maxWidth: 560,
          }}>
            Every child deserves access to books, knowledge and the opportunity to discover what they can become. ABF works to put those tools within reach.
          </p>

          <p style={{
            fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: 520,
            fontStyle: "italic",
          }}>
            "We may never know which child will become the next great writer, scientist, teacher, entrepreneur or leader. But we can help make sure they have the opportunity to learn."
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.25rem" }}>
            <button className="abf-btn-donate" onClick={onDonate} style={{ fontSize: "1rem", padding: "1rem 2.25rem" }}>
              💚 Donate
            </button>
            <button className="abf-btn-secondary" onClick={onDonateBook} style={{ fontSize: "1rem", padding: "0.9375rem 2rem" }}>
              Get Involved
            </button>
          </div>

          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }}>
            No contribution is too small.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.375rem",
        opacity: 0.5,
      }}>
        <span style={{ fontSize: "0.75rem", color: "white", letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll</span>
        <div style={{
          width: 1,
          height: 32,
          background: "linear-gradient(to bottom, white, transparent)",
          animation: "pulse 2s infinite",
        }} />
      </div>
    </section>
  );
}

// ─── TRUST BADGES ─────────────────────────────────────────────

function TrustBadges() {
  const badges = [
    {
      icon: "📚",
      title: "Books & Learning",
      desc: "Helping children gain access to reading and educational resources that open new worlds.",
    },
    {
      icon: "🏘️",
      title: "Community",
      desc: "Creating spaces where children and communities can learn and grow together.",
    },
    {
      icon: "🎯",
      title: "Real Impact",
      desc: "Focused on turning access to resources into meaningful, lasting learning opportunities.",
    },
    {
      icon: "💡",
      title: "Transparency",
      desc: "Showing supporters clearly where their contributions are making a difference.",
    },
  ];

  return (
    <section style={{ background: "#f8faf6", padding: "4rem 1.5rem", borderBottom: "1px solid #e8f0e8" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}>
          {badges.map((b, i) => (
            <div key={i} className="abf-trust-card">
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "linear-gradient(135deg, #e8f5e8, #d4edd4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}>
                {b.icon}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a2218", marginBottom: "0.5rem" }}>{b.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "#6a7a64", lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── YOUR SUPPORT GOES FAR ───────────────────────────────────

function SupportSection() {
  const stats = [
    { label: "Schools / Communities Reached", value: "[XX+]" },
    { label: "Books Made Available", value: "[XX+]" },
    { label: "Children & Community Members Reached", value: "[XX+]" },
    { label: "Library Users", value: "[XX+]" },
  ];

  return (
    <section style={{ padding: "6rem 1.5rem", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Headline */}
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 4rem" }}>
          <SectionLabel text="Your Support Goes Far" />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#1a2218", lineHeight: 1.15, marginBottom: "1.25rem" }}>
            Small contributions can<br />open <span style={{ color: "#2d6a2d" }}>big doors.</span>
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.75, maxWidth: 580, margin: "0 auto" }}>
            Not everyone can give a lot. But when many people give what they can, those contributions can become books, learning resources, safer spaces to study and opportunities for children to discover more of the world.
          </p>
        </div>

        {/* Library Feature */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2.5rem",
          alignItems: "center",
          marginBottom: "4rem",
          background: "#f8faf6",
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid #e8f0e8",
        }}>
          {/* Image */}
          <div style={{ position: "relative", minHeight: 320, overflow: "hidden" }}>
            <img
              src={ASSETS.library}
              alt="Azu-Ogbunike Community Library"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 320 }}
            />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(26,34,24,0.7), transparent)",
              padding: "1.5rem 1.25rem 1.25rem",
            }}>
              <CategoryBadge label="ABF PROJECT" color="#8dc63f" />
            </div>
          </div>

          {/* Text */}
          <div style={{ padding: "2.5rem" }}>
            <h3 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.875rem", lineHeight: 1.2 }}>
              Azu-Ogbunike Community Library
            </h3>
            <p style={{ fontSize: "1rem", color: "#4a5a44", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              One of ABF's clearest examples of what access can create: a community space where children and adults can read, study, research and discover new possibilities. The library was commissioned by ABF and is still active and functional today.
            </p>
            <a href="/projects" style={{ textDecoration: "none" }}>
              <button className="abf-btn-primary" style={{ fontSize: "0.9375rem" }}>
                See Our Projects <Icon.ChevronRight />
              </button>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
        }}>
          {stats.map((s, i) => (
            <div key={i} className="abf-stat-card">
              <div style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "#2d6a2d",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}>
                {s.value}
              </div>
              <p style={{ fontSize: "0.875rem", color: "#6a7a64", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
                {s.label}
              </p>
              <p style={{ fontSize: "0.7rem", color: "#aab8a4", marginTop: "0.375rem", fontStyle: "italic" }}>
                (figures to be confirmed)
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FUTURE SECTION ───────────────────────────────────────────

function FutureSection() {
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      {/* Background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${ASSETS.future})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to right, rgba(26,34,24,0.92) 0%, rgba(26,34,24,0.85) 55%, rgba(26,34,24,0.5) 100%)",
      }} />

      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 1280,
        margin: "0 auto",
        padding: "7rem 1.5rem",
      }}>
        <div style={{ maxWidth: 640 }}>
          <SectionLabel text="The Bigger Picture" />

          <h2 style={{
            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
          }}>
            Who knows who the next<br />
            <span style={{ color: "#8dc63f" }}>great mind</span> will be?
          </h2>

          <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: "1.25rem", maxWidth: 540 }}>
            The next writer, teacher, engineer, scientist, entrepreneur or community leader may already be sitting in a classroom today. Access to books and learning can help a child discover an ability they did not yet know they had.
          </p>

          <p style={{
            fontSize: "1.125rem",
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1.75,
            fontStyle: "italic",
            borderLeft: "3px solid #8dc63f",
            paddingLeft: "1.25rem",
            maxWidth: 520,
          }}>
            "We are not only helping children today. We are helping build a brighter tomorrow for all of us."
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── LATEST FROM ABF CAROUSEL ────────────────────────────────

function LatestCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.firstElementChild?.clientWidth ?? 320;
    el.scrollBy({ left: dir === "right" ? cardW + 20 : -(cardW + 20), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const cardW = el.firstElementChild?.clientWidth ?? 320;
      setActiveIdx(Math.round(el.scrollLeft / (cardW + 20)));
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <section style={{ padding: "6rem 0", background: "#f8faf6" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <SectionLabel text="What We've Been Up To" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#1a2218", margin: 0 }}>
              Latest from ABF
            </h2>
          </div>
          <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
            <button
              onClick={() => scroll("left")}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid #dde8dd", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2c3424", transition: "all 0.2s" }}
            >
              <Icon.ChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid #dde8dd", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#2c3424", transition: "all 0.2s" }}
            >
              <Icon.ChevronRight />
            </button>
            <a href="/latest" style={{ textDecoration: "none" }}>
              <button className="abf-btn-primary" style={{ fontSize: "0.875rem", padding: "0.625rem 1.25rem" }}>
                See All <Icon.ChevronRight />
              </button>
            </a>
          </div>
        </div>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="abf-carousel hide-scrollbar"
          style={{
            display: "flex",
            gap: "1.25rem",
            overflowX: "auto",
            paddingBottom: "1rem",
            cursor: "grab",
            scrollSnapType: "x mandatory",
          }}
        >
          {LATEST_CARDS.map((card) => (
            <a
              key={card.id}
              href={card.slug}
              style={{ textDecoration: "none", scrollSnapAlign: "start" }}
            >
              <div
                className="abf-content-card"
                style={{ width: 300, flexShrink: 0 }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img
                    src={card.image}
                    alt={card.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div style={{ padding: "1.25rem" }}>
                  <CategoryBadge label={card.category} color={card.categoryColor} />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a2218", margin: "0.75rem 0 0.5rem", lineHeight: 1.35 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#6a7a64", lineHeight: 1.6, margin: "0 0 1rem" }}>
                    {card.excerpt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#2d6a2d", fontWeight: 700, fontSize: "0.875rem" }}>
                    Read more <Icon.ArrowRight />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "1.5rem" }}>
          {LATEST_CARDS.map((_, i) => (
            <button
              key={i}
              className={`abf-dot${i === activeIdx ? " active" : ""}`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const cardW = el.firstElementChild?.clientWidth ?? 320;
                el.scrollTo({ left: i * (cardW + 20), behavior: "smooth" });
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MEET THE TEAM TEASER ─────────────────────────────────────

function TeamTeaser() {
  return (
    <section style={{ padding: "6rem 1.5rem", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionLabel text="The People" />
          <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#1a2218", margin: 0 }}>
            Meet the People Behind the Mission
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 360px))",
          gap: "1.5rem",
          justifyContent: "center",
          marginBottom: "2.5rem",
        }}>
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="abf-team-card">
              {/* Photo */}
              <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(to top, rgba(26,34,24,0.5), transparent)",
                }} />
              </div>

              {/* Info */}
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1875rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>
                  {member.name}
                </h3>
                <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.65, margin: 0 }}>
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <a href="/team" style={{ textDecoration: "none" }}>
            <button className="abf-btn-primary">
              Meet the Team <Icon.ArrowRight />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PARTNERS SECTION ─────────────────────────────────────────

function PartnersSection() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <SectionLabel text="Partners & Supporters" />
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 900, color: "#1a2218", marginBottom: "0.875rem" }}>
            Growing This Mission Together
          </h2>
          <p style={{ fontSize: "1rem", color: "#4a5a44", lineHeight: 1.7, maxWidth: 540, margin: "0 auto" }}>
            Every organisation, individual and partner who contributes to this work helps us take another step toward making learning more accessible.
          </p>
        </div>

        {/* Partner cards */}
        <div style={{
          display: "flex",
          gap: "1.25rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "2.5rem",
        }}>
          {PARTNERS.map((p) => (
            <div key={p.id} className="abf-partner-card">
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: p.id === 3 ? "#f0f0f0" : `${p.color}18`,
                border: `1px solid ${p.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.875rem",
                color: p.id === 3 ? "#aaa" : p.color,
                flexShrink: 0,
              }}>
                {p.initials}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: p.id === 3 ? "#aaa" : "#1a2218" }}>
                  {p.name}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#8a9a84" }}>{p.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1rem", color: "#4a5a44", marginBottom: "1rem" }}>
            Want to support the work in your own way?
          </p>
          <a href="mailto:akherebookfoundation@gmail.com" style={{ textDecoration: "none" }}>
            <button className="abf-btn-primary">
              Partner with ABF <Icon.ArrowRight />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ───────────────────────────────────────────────

function FinalCTA({ onDonate, onDonateBook }: { onDonate: () => void; onDonateBook: () => void }) {
  const actions = [
    {
      emoji: "📚",
      title: "Donate a Book",
      desc: "Give a child another story to discover.",
      cta: "Donate a Book",
      onClick: onDonateBook,
      style: "book",
    },
    {
      emoji: "💚",
      title: "Donate Money",
      desc: "Even a small contribution can go a long way.",
      cta: "Donate Money",
      onClick: onDonate,
      style: "money",
    },
    {
      emoji: "🙌",
      title: "Volunteer",
      desc: "Bring your skills, time or ideas.",
      cta: "Get Involved",
      href: "/get-involved",
      style: "volunteer",
    },
  ];

  return (
    <section style={{
      padding: "7rem 1.5rem",
      background: "linear-gradient(135deg, #1a3d1a 0%, #2d6a2d 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -60, width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Headline */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: "1.25rem" }}>
            Help Build<br /><span style={{ color: "#8dc63f" }}>What Comes Next.</span>
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.75)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            You don't have to do everything. You only have to do what you can.
          </p>
        </div>

        {/* Action cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          maxWidth: 900,
          margin: "0 auto",
        }}>
          {actions.map((action, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "2.25rem 2rem",
                border: "1px solid rgba(255,255,255,0.12)",
                textAlign: "center",
                transition: "background 0.2s, transform 0.2s",
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                margin: "0 auto 1.25rem",
              }}>
                {action.emoji}
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", marginBottom: "0.625rem" }}>
                {action.title}
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {action.desc}
              </p>
              {action.href ? (
                <a href={action.href} style={{ textDecoration: "none" }}>
                  <button className="abf-btn-secondary" style={{ fontSize: "0.9375rem" }}>
                    {action.cta}
                  </button>
                </a>
              ) : (
                <button className="abf-btn-secondary" onClick={action.onClick} style={{ fontSize: "0.9375rem" }}>
                  {action.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL SECTION ───────────────────────────────────────────

function SocialSection() {
  return (
    <section style={{ padding: "4rem 1.5rem", background: "white", borderTop: "1px solid #e8f0e8" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <SectionLabel text="Stay Connected" />
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#1a2218", marginBottom: "0.875rem" }}>
          Follow Us For More Stories
        </h2>
        <p style={{ fontSize: "1rem", color: "#4a5a44", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 2rem" }}>
          Follow ABF to see the people, projects and stories behind the mission.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9375rem",
              textDecoration: "none",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: "0 4px 16px rgba(220,39,67,0.25)",
            }}
          >
            <Icon.Instagram />
            @akhere_book_foundation
          </a>

          <a
            href={CONTACT.twitter}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              background: "#1a1a1a",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9375rem",
              textDecoration: "none",
              transition: "transform 0.15s",
            }}
          >
            <Icon.Twitter />
            @AkhereBook
          </a>

          <a
            href={`mailto:${CONTACT.email}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              background: "#f0f7f0",
              color: "#2d6a2d",
              fontWeight: 700,
              fontSize: "0.9375rem",
              textDecoration: "none",
              border: "2px solid #dde8dd",
              transition: "all 0.15s",
            }}
          >
            <Icon.Mail />
            {CONTACT.email}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────

function Footer({ onDonate }: { onDonate: () => void }) {
  const year = new Date().getFullYear();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Latest from ABF", href: "/latest" },
    { label: "Meet the Team", href: "/team" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Donate", onClick: onDonate },
  ];

  return (
    <footer style={{ background: "#111a10", color: "rgba(255,255,255,0.8)", padding: "4rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Top section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "3rem",
          marginBottom: "3rem",
          paddingBottom: "3rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          {/* Logo + description */}
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

          {/* Navigation */}
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

          {/* Contact */}
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

            {/* Social */}
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

        {/* Bottom */}
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

// ─── MAIN PAGE ASSEMBLY ──────────────────────────────────────

export default function ABFHomepage() {
  const [donateMoneyOpen, setDonateMoneyOpen] = useState(false);
  const [donateBookOpen, setDonateBookOpen] = useState(false);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDonateMoneyOpen(false);
        setDonateBookOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", minHeight: "100vh" }}>
      <Header onDonate={() => setDonateMoneyOpen(true)} />

      <main>
        {/* 1. Hero */}
        <HeroSection
          onDonate={() => setDonateMoneyOpen(true)}
          onDonateBook={() => setDonateBookOpen(true)}
        />

        {/* 2. Trust Badges */}
        <TrustBadges />

        {/* 3. Your Support Goes Far */}
        <SupportSection />

        {/* 4. Future / Impact Message */}
        <FutureSection />

        {/* 5. Latest from ABF */}
        <LatestCarousel />

        {/* 6. Meet the Team Teaser */}
        <TeamTeaser />

        {/* 7. Partners */}
        <PartnersSection />

        {/* 8. Final CTA */}
        <FinalCTA
          onDonate={() => setDonateMoneyOpen(true)}
          onDonateBook={() => setDonateBookOpen(true)}
        />

        {/* 9. Social */}
        <SocialSection />
      </main>

      {/* Footer */}
      <Footer onDonate={() => setDonateMoneyOpen(true)} />

      {/* Modals */}
      {donateMoneyOpen && <DonateMoneyModal onClose={() => setDonateMoneyOpen(false)} />}
      {donateBookOpen && <DonateBookModal onClose={() => setDonateBookOpen(false)} />}
    </div>
  );
}
