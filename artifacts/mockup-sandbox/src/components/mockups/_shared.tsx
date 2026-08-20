import { useState, useEffect, useRef, type CSSProperties } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

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
  Lightbulb: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
  Hands: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleQuick = (val: number) => {
    setSelectedQuick(val);
    setAmount(String(val));
  };

  const faqs = [
    {
      q: "How will my donation be used?",
      a: "Your donation goes directly towards purchasing books, building library shelves, and maintaining our community spaces.",
    },
    {
      q: "Can I donate a small amount?",
      a: "Yes! No contribution is too small. Even ₦500 helps us purchase story books and learning tools for children.",
    },
    {
      q: "Can I support a specific project?",
      a: "Yes. You can specify a project (like the Azu-Ogbunike Library) when completing your donation on WhatsApp.",
    },
  ];

  const whatsappMsg = encodeURIComponent(
    `Hi ABF, I'd like to donate${amount ? ` ₦${Number(amount).toLocaleString()}` : ""} (${frequency}).\n\nName: ${name || "[not specified]"}\nEmail: ${email || "[not specified]"}\nPhone: ${phone || "[not specified]"}\n\nHow do I proceed? Thank you!`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const errors: string[] = [];
    if (!amount || Number(amount) <= 0) errors.push("Please enter a valid donation amount.");
    if (!name.trim()) errors.push("Please enter your name.");
    if (!email.trim()) {
      errors.push("Please enter your email address.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Please enter a valid email address.");
    }
    if (!phone.trim()) errors.push("Please enter your phone or WhatsApp number.");

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("donation_inquiries")
          .insert([
            {
              donation_type: "money",
              amount: Number(amount),
              frequency: frequency,
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              status: "new",
            },
          ]);

        if (error) {
          throw new Error(error.message);
        }
      } else {
        if (import.meta.env.PROD) {
          throw new Error("Supabase is not configured in production. Donation cannot be saved.");
        } else {
          console.warn("Supabase is not configured. Simulating successful submission in development.");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      // Open WhatsApp automatically
      try {
        window.open(`${CONTACT.whatsapp}?text=${whatsappMsg}`, "_blank", "noopener,noreferrer");
      } catch (redirectErr) {
        console.warn("Popup blocked automatic WhatsApp redirect.");
      }

      setFormSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while saving your donation inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          maxWidth: 540,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* Fixed Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #eef3ee",
          background: "white",
          flexShrink: 0,
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f0f7f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "1.25rem" }}>💚</span>
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0, lineHeight: 1.2 }}>Every Contribution Counts</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "#f5f5f3",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              flexShrink: 0,
            }}
          >
            <Icon.X />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{
          overflowY: "auto",
          padding: "1.5rem",
          flex: 1,
          WebkitOverflowScrolling: "touch",
        }}>
          {formSubmitted ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
              <span style={{ fontSize: "3.5rem" }}>💚</span>
              <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#2d6a2d", marginTop: "1rem", marginBottom: "0.5rem" }}>
                Inquiry Saved!
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "#4a5a44", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                We have saved your donation inquiry in our database. We also opened a new tab to complete your donation on WhatsApp.
              </p>
              <p style={{ fontSize: "0.875rem", color: "#6a7a64", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                If WhatsApp didn't open automatically, please click the button below to message us directly:
              </p>
              <a
                href={`${CONTACT.whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", textDecoration: "none", marginBottom: "1.5rem" }}
              >
                <button className="abf-btn-whatsapp" style={{ width: "100%", justifyContent: "center" }}>
                  <Icon.WhatsApp />
                  Connect on WhatsApp
                </button>
              </a>
              <button
                onClick={onClose}
                className="abf-btn-primary"
                style={{ background: "transparent", border: "2px solid #dde8dd", color: "#2d6a2d", width: "100%", justifyContent: "center" }}
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: "0.9375rem", color: "#4a5a44", lineHeight: 1.65, marginBottom: "1.75rem" }}>
                You don't need to give a lot to make a difference. ABF works to stretch contributions as far as possible so that small acts of support can become meaningful opportunities for children.
              </p>

              {/* Validation Errors */}
              {formErrors.length > 0 && (
                <div style={{
                  background: "#fdf3f3",
                  border: "1px solid #f5c2c2",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                }}>
                  <h4 style={{ margin: "0 0 0.5rem", color: "#b83232", fontWeight: 700, fontSize: "0.875rem" }}>Please review required details:</h4>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.8125rem", color: "#b83232", lineHeight: 1.5 }}>
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submission Error Box */}
              {submitError && (
                <div style={{
                  background: "#fdf3f3",
                  border: "1px solid #f5c2c2",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  color: "#b83232",
                  fontSize: "0.875rem",
                  textAlign: "left"
                }}>
                  <strong>Error:</strong> {submitError}
                  <div style={{ marginTop: "0.5rem", borderTop: "1px solid rgba(184, 50, 50, 0.2)", paddingTop: "0.5rem" }}>
                    We couldn't save your details, but you can still continue your donation directly via WhatsApp:
                    <div style={{ marginTop: "0.5rem" }}>
                      <a
                        href={`${CONTACT.whatsapp}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="abf-btn-whatsapp"
                        style={{ textDecoration: "none", display: "inline-flex", padding: "0.5rem 1rem", fontSize: "0.8125rem", gap: "0.375rem" }}
                      >
                        <Icon.WhatsApp />
                        Continue via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontWeight: 700, color: "#1a2218", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
                  How much would you like to give? *
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "#2d6a2d", fontSize: "1.125rem" }}>₦</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setSelectedQuick(null); }}
                    placeholder="Enter amount"
                    disabled={submitting}
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
                    type="button"
                    className={`abf-amount-btn${selectedQuick === val ? " selected" : ""}`}
                    onClick={() => handleQuick(val)}
                    disabled={submitting}
                  >
                    ₦{val.toLocaleString()}
                  </button>
                ))}
                <button
                  type="button"
                  className={`abf-amount-btn${selectedQuick === -1 ? " selected" : ""}`}
                  onClick={() => { setSelectedQuick(-1); setAmount(""); }}
                  disabled={submitting}
                >
                  Other
                </button>
              </div>

              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ display: "block", fontWeight: 700, color: "#1a2218", marginBottom: "0.75rem", fontSize: "0.9375rem" }}>
                  How often? *
                </label>
                <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                  {[
                    { key: "one-time", label: "One-time" },
                    { key: "bi-weekly", label: "Every 2 weeks" },
                    { key: "monthly", label: "Monthly" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      className={`abf-freq-btn${frequency === key ? " selected" : ""}`}
                      onClick={() => setFrequency(key)}
                      disabled={submitting}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.75rem" }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..."
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
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
                  {faqs.map((faq, i) => {
                    const isOpen = activeFaq === i;
                    return (
                      <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <div
                          onClick={() => setActiveFaq(isOpen ? null : i)}
                          style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", cursor: "pointer" }}
                        >
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#e8f5e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2d6a2d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                          <span style={{ fontSize: "0.875rem", color: "#2d6a2d", fontWeight: 600, lineHeight: 1.5 }}>{faq.q}</span>
                        </div>
                        {isOpen && (
                          <div style={{ paddingLeft: "1.625rem", fontSize: "0.8125rem", color: "#4a5a44", lineHeight: 1.5 }}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6a7a64", marginBottom: "1rem" }}>
                Still have a question?{" "}
                <a href={`mailto:${CONTACT.email}`} style={{ color: "#2d6a2d", fontWeight: 600, textDecoration: "none" }}>
                  Ask us
                </a>
              </p>

              <button
                type="submit"
                className="abf-btn-whatsapp"
                style={{ width: "100%", justifyContent: "center", border: "none", opacity: submitting ? 0.7 : 1 }}
                disabled={submitting}
              >
                <Icon.WhatsApp />
                {submitting ? "Submitting..." : "Continue via WhatsApp"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9aaa94", marginTop: "0.875rem", margin: "0.875rem 0 0" }}>
                You'll be connected with our team to complete your contribution.
              </p>
            </form>
          )}
        </div>
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
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

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
      `Hi ABF, I'd like to donate books.\n\nCategories: ${cats}\nApprox. quantity: ${quantity || "[not specified]"}\nLocation: ${location || "[not specified]"}\nName: ${name || "[not specified]"}\nEmail: ${email || "[not specified]"}\nPhone: ${phone || "[not specified]"}\n\nPlease let me know the next steps. Thank you!`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const errors: string[] = [];
    if (selected.size === 0) errors.push("Please select at least one book category.");
    if (!name.trim()) errors.push("Please enter your name.");
    if (!email.trim()) {
      errors.push("Please enter your email address.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Please enter a valid email address.");
    }
    if (!phone.trim()) errors.push("Please enter your phone or WhatsApp number.");

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setSubmitting(true);
    setSubmitError(null);

    const questionText = JSON.stringify({
      categories: Array.from(selected),
      quantity: quantity.trim(),
      location: location.trim(),
    });

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("donation_inquiries")
          .insert([
            {
              donation_type: "books",
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              question: questionText,
              status: "new",
            },
          ]);

        if (error) {
          throw new Error(error.message);
        }
      } else {
        if (import.meta.env.PROD) {
          throw new Error("Supabase is not configured in production. Donation cannot be saved.");
        } else {
          console.warn("Supabase is not configured. Simulating successful submission in development.");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      // Open WhatsApp automatically
      try {
        window.open(`${CONTACT.whatsapp}?text=${buildMsg()}`, "_blank", "noopener,noreferrer");
      } catch (redirectErr) {
        console.warn("Popup blocked automatic WhatsApp redirect.");
      }

      setFormSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while saving your donation inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          maxWidth: 540,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* Fixed Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #eef3ee",
          background: "white",
          flexShrink: 0,
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f5fbeb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "1.25rem" }}>📚</span>
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0, lineHeight: 1.2 }}>Give a Book. Open a World.</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "#f5f5f3",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              flexShrink: 0,
            }}
          >
            <Icon.X />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{
          overflowY: "auto",
          padding: "1.5rem",
          flex: 1,
          WebkitOverflowScrolling: "touch",
        }}>
          {formSubmitted ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
              <span style={{ fontSize: "3.5rem" }}>💚</span>
              <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#2d6a2d", marginTop: "1rem", marginBottom: "0.5rem" }}>
                Thank You!
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "#4a5a44", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                We have saved your book donation inquiry in our database. We also opened a new tab to complete your donation on WhatsApp.
              </p>
              <p style={{ fontSize: "0.875rem", color: "#6a7a64", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                If WhatsApp didn't open automatically, please click the button below to message us directly:
              </p>
              <a
                href={`${CONTACT.whatsapp}?text=${buildMsg()}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", textDecoration: "none", marginBottom: "1.5rem" }}
              >
                <button className="abf-btn-whatsapp" style={{ width: "100%", justifyContent: "center" }}>
                  <Icon.WhatsApp />
                  Connect on WhatsApp
                </button>
              </a>
              <button
                onClick={onClose}
                className="abf-btn-primary"
                style={{ background: "transparent", border: "2px solid #dde8dd", color: "#2d6a2d", width: "100%", justifyContent: "center" }}
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: "0.9375rem", color: "#4a5a44", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                You don't need a huge collection. A few good books can still travel a long way. All books should be in <strong>good condition</strong> — no missing pages or covers.
              </p>

              {/* Validation Errors */}
              {formErrors.length > 0 && (
                <div style={{
                  background: "#fdf3f3",
                  border: "1px solid #f5c2c2",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                }}>
                  <h4 style={{ margin: "0 0 0.5rem", color: "#b83232", fontWeight: 700, fontSize: "0.875rem" }}>Please review required details:</h4>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.8125rem", color: "#b83232", lineHeight: 1.5 }}>
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submission Error Box */}
              {submitError && (
                <div style={{
                  background: "#fdf3f3",
                  border: "1px solid #f5c2c2",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  color: "#b83232",
                  fontSize: "0.875rem",
                  textAlign: "left"
                }}>
                  <strong>Error:</strong> {submitError}
                  <div style={{ marginTop: "0.5rem", borderTop: "1px solid rgba(184, 50, 50, 0.2)", paddingTop: "0.5rem" }}>
                    We couldn't save your details, but you can still continue your book donation directly via WhatsApp:
                    <div style={{ marginTop: "0.5rem" }}>
                      <a
                        href={`${CONTACT.whatsapp}?text=${buildMsg()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="abf-btn-whatsapp"
                        style={{ textDecoration: "none", display: "inline-flex", padding: "0.5rem 1rem", fontSize: "0.8125rem", gap: "0.375rem" }}
                      >
                        <Icon.WhatsApp />
                        Continue via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontWeight: 700, color: "#1a2218", marginBottom: "0.75rem", fontSize: "0.9375rem" }}>
                  What would you like to donate? * <span style={{ fontWeight: 400, color: "#8a9a84" }}>(Select all that apply)</span>
                </label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`abf-category-chip${selected.has(cat) ? " selected" : ""}`}
                      onClick={() => toggle(cat)}
                      disabled={submitting}
                    >
                      {selected.has(cat) ? "✓ " : "+ "}{cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>
                    Approximate Quantity * <span style={{ fontWeight: 400, color: "#8a9a84" }}>(e.g. 5 books, 2 boxes, 50 textbooks)</span>
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 10 story books"
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>
                    Your Location * <span style={{ fontWeight: 400, color: "#8a9a84" }}>(City / State)</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Awka, Anambra State / Lagos"
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.75rem" }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "#2c3424" }}>Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..."
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>
              </div>

              <div style={{
                background: "#f8faf6",
                borderRadius: 14,
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem",
                border: "1px solid #e8f0e8",
                fontSize: "0.875rem",
                color: "#4a5a44",
                lineHeight: 1.55,
              }}>
                📦 <strong>How collection works:</strong> Once you submit, our team will review your book details and coordinate drop-off or collection depending on your location.
              </div>

              <button
                type="submit"
                className="abf-btn-whatsapp"
                style={{ width: "100%", justifyContent: "center", border: "none", opacity: submitting ? 0.7 : 1 }}
                disabled={submitting}
              >
                <Icon.WhatsApp />
                {submitting ? "Submitting Inquiry..." : "Donate Books via WhatsApp"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9aaa94", marginTop: "0.875rem", margin: "0.875rem 0 0" }}>
                Our team will follow up to arrange collection or drop-off.
              </p>
            </form>
          )}
        </div>
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
        <div 
          className="abf-header-inner"
          style={{
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
            <button className="abf-btn-donate abf-header-donate" onClick={onDonate} style={{ padding: "0.625rem 1.5rem", fontSize: "0.875rem" }}>
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

// ─── PARTNER WITH ABF MODAL ──────────────────────────────────
export function PartnerWithABFModal({ onClose }: { onClose: () => void }) {
  const [personType, setPersonType] = useState<"individual" | "business" | "other">("individual");
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const partnershipAreas = [
    { label: "Financial Support", value: "financial_support" },
    { label: "Books & Resources", value: "books_resources" },
    { label: "Skills & Expertise", value: "skills_expertise" },
    { label: "Volunteer Support", value: "volunteer_support" },
    { label: "Project Partnership", value: "project_partnership" },
    { label: "Corporate Partnership", value: "corporate_partnership" },
    { label: "Other", value: "other" },
  ];

  const handleAreaToggle = (val: string) => {
    setSelectedAreas((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const errors: string[] = [];
    if (!name.trim()) errors.push("Please enter your name.");
    if (personType === "business" && !organisation.trim()) {
      errors.push("Please enter your organisation name.");
    }
    if (!email.trim()) {
      errors.push("Please enter your email address.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Please enter a valid email address.");
    }
    if (!phone.trim()) errors.push("Please enter your phone or WhatsApp number.");
    if (selectedAreas.length === 0) {
      errors.push("Please select at least one area of partnership interest.");
    }
    if (!message.trim()) errors.push("Please enter your message or proposal details.");
    if (!consent) errors.push("Please accept the partnership consent checkbox.");

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("partnership_inquiries")
          .insert([
            {
              person_type: personType,
              name: name.trim(),
              organisation: organisation.trim() || null,
              email: email.trim(),
              phone: phone.trim(),
              partnership_areas: selectedAreas,
              message: message.trim(),
              consent: consent,
              status: "new",
            },
          ]);

        if (error) {
          throw new Error(error.message);
        }
      } else {
        if (import.meta.env.PROD) {
          throw new Error("Supabase is not configured in production. Partnership inquiry cannot be saved.");
        } else {
          console.warn("Supabase is not configured. Simulating successful submission in development.");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      setFormSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while saving your partnership inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          maxWidth: 540,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* Fixed Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #eef3ee",
          background: "white",
          flexShrink: 0,
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f5fbeb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "1.25rem" }}>🤝</span>
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0, lineHeight: 1.2 }}>Partner With ABF</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "#f5f5f3",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              flexShrink: 0,
            }}
          >
            <Icon.X />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{
          overflowY: "auto",
          padding: "1.5rem",
          flex: 1,
          WebkitOverflowScrolling: "touch",
        }}>
          {formSubmitted ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
              <span style={{ fontSize: "3.5rem" }}>💚</span>
              <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#2d6a2d", marginTop: "1rem", marginBottom: "0.5rem" }}>
                Inquiry Received!
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "#4a5a44", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Thank you for expressing interest in partnering with Akhere Book Foundation. We have stored your inquiry and our team will get in touch with you shortly.
              </p>
              <button
                onClick={onClose}
                className="abf-btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: "0.9375rem", color: "#4a5a44", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                Join us in building community resources. Let us know how you or your organisation would like to collaborate.
              </p>

              {/* Validation Errors */}
              {formErrors.length > 0 && (
                <div style={{
                  background: "#fdf3f3",
                  border: "1px solid #f5c2c2",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                }}>
                  <h4 style={{ margin: "0 0 0.5rem", color: "#b83232", fontWeight: 700, fontSize: "0.875rem" }}>Please review required details:</h4>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.8125rem", color: "#b83232", lineHeight: 1.5 }}>
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submission Error Box */}
              {submitError && (
                <div style={{
                  background: "#fdf3f3",
                  border: "1px solid #f5c2c2",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  color: "#b83232",
                  fontSize: "0.875rem",
                  textAlign: "left"
                }}>
                  <strong>Error:</strong> {submitError}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                {/* Entity Type Selection */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>I am inquiring as a(n): *</label>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                    {[
                      { label: "Individual", value: "individual" },
                      { label: "Organisation / Business", value: "business" },
                      { label: "Other", value: "other" }
                    ].map((option) => (
                      <label key={option.value} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#4a5a44", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="personType"
                          value={option.value}
                          checked={personType === option.value}
                          onChange={() => setPersonType(option.value as any)}
                          disabled={submitting}
                          style={{ cursor: "pointer" }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>
                    {personType === "business" ? "Contact Person Name *" : "Full Name *" }
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                {/* Organisation Name (Conditional) */}
                {personType === "business" && (
                  <div>
                    <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Organisation / Business Name *</label>
                    <input
                      type="text"
                      placeholder="Enter organisation name"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      style={inputStyle}
                      disabled={submitting}
                      onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                      onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                    />
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. +234..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                {/* Partnership Areas */}
                <div>
                  <label style={{ fontWeight: 700, display: "block", fontSize: "0.9rem", color: "#1a2218", marginBottom: "0.5rem" }}>
                    Partnership Areas of Interest * <span style={{ fontWeight: 400, color: "#8a9a84" }}>(Select all that apply)</span>
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {partnershipAreas.map((area) => {
                      const selected = selectedAreas.includes(area.value);
                      return (
                        <button
                          key={area.value}
                          type="button"
                          className={`abf-category-chip${selected ? " selected" : ""}`}
                          onClick={() => handleAreaToggle(area.value)}
                          disabled={submitting}
                        >
                          {selected && <Icon.Check />}
                          {area.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Message / Proposal Details *</label>
                  <textarea
                    placeholder="Please describe how you'd like to collaborate, what you'd like to bring, or any specific project proposal..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ ...inputStyle, resize: "vertical", height: 100 }}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                {/* Consent check */}
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginTop: "0.5rem" }}>
                  <input
                    type="checkbox"
                    id="partner-consent-check"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    style={{ marginTop: "0.25rem", cursor: "pointer" }}
                    disabled={submitting}
                  />
                  <label htmlFor="partner-consent-check" style={{ fontSize: "0.8125rem", color: "#4a5a44", lineHeight: 1.4, cursor: "pointer" }}>
                    I understand that submitting this inquiry does not establish an official partnership and that ABF may contact me using the info provided. *
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="abf-btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "1rem", opacity: submitting ? 0.7 : 1 }}
                disabled={submitting}
              >
                {submitting ? "Submitting Inquiry..." : "Submit Inquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VOLUNTEER MODAL ─────────────────────────────────────────
export function VolunteerModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    ageRange: "",
    location: "",
    motivation: "",
    areas: [] as string[],
    skills: "",
    availability: "",
    additionalInfo: "",
    consent: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAreaToggle = (area: string) => {
    setFormData((prev) => {
      const nextAreas = prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area];
      return { ...prev, areas: nextAreas };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const errors: string[] = [];
    let firstErrorId: string | null = null;

    if (!formData.fullName.trim()) {
      errors.push("Please enter your full name.");
      if (!firstErrorId) firstErrorId = "volunteer-fullName";
    }
    if (!formData.email.trim()) {
      errors.push("Please enter your email address.");
      if (!firstErrorId) firstErrorId = "volunteer-email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Please enter a valid email address.");
      if (!firstErrorId) firstErrorId = "volunteer-email";
    }
    if (!formData.phone.trim()) {
      errors.push("Please enter your phone or WhatsApp number.");
      if (!firstErrorId) firstErrorId = "volunteer-phone";
    }
    if (!formData.ageRange) {
      errors.push("Please select your age range.");
      if (!firstErrorId) firstErrorId = "volunteer-ageRange";
    }
    if (!formData.location.trim()) {
      errors.push("Please enter where you are based.");
      if (!firstErrorId) firstErrorId = "volunteer-location";
    }
    if (!formData.motivation.trim()) {
      errors.push("Please tell us what made you interested in ABF.");
      if (!firstErrorId) firstErrorId = "volunteer-motivation";
    }
    if (formData.areas.length === 0) {
      errors.push("Please select at least one way you would like to contribute.");
      if (!firstErrorId) firstErrorId = "volunteer-areas";
    }
    if (!formData.availability) {
      errors.push("Please select your time availability.");
      if (!firstErrorId) firstErrorId = "volunteer-availability";
    }
    if (!formData.consent) {
      errors.push("Please accept the volunteer consent checkbox.");
      if (!firstErrorId) firstErrorId = "volunteer-consent";
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      if (firstErrorId) {
        setTimeout(() => {
          const el = document.getElementById(firstErrorId!);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus();
          }
        }, 50);
      }
      return;
    }

    setFormErrors([]);
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("volunteer_submissions")
          .insert([
            {
              full_name: formData.fullName.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              age_range: formData.ageRange,
              location: formData.location.trim(),
              motivation: formData.motivation.trim(),
              contribution_areas: formData.areas,
              skills: formData.skills.trim() || null,
              availability: formData.availability,
              additional_information: formData.additionalInfo.trim() || null,
              consent: formData.consent,
              status: "new",
            },
          ]);

        if (error) {
          throw new Error(error.message);
        }
      } else {
        if (import.meta.env.PROD) {
          throw new Error("Supabase is not configured in production. Volunteer application cannot be saved.");
        } else {
          console.warn("Supabase is not configured. Simulating successful volunteer submission in development.");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      setFormSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while saving your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          maxWidth: 580,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* Fixed Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #eef3ee",
          background: "white",
          flexShrink: 0,
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f0f7f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "1.25rem" }}>🙌</span>
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0, lineHeight: 1.2 }}>Let's Get to Know You</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "#f5f5f3",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              flexShrink: 0,
            }}
          >
            <Icon.X />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{
          overflowY: "auto",
          padding: "1.5rem",
          flex: 1,
          WebkitOverflowScrolling: "touch",
        }}>
          {formSubmitted ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
              <span style={{ fontSize: "3.5rem" }}>💚</span>
              <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#2d6a2d", marginTop: "1rem", marginBottom: "0.5rem" }}>
                Thank You for Reaching Out
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "#4a5a44", lineHeight: 1.65, margin: "0 0 1.5rem" }}>
                We've received your interest in volunteering with ABF. We'll be in touch with opportunities to get involved.
              </p>
              <button className="abf-btn-primary" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                We're not looking for a perfect CV. We'd simply like to understand what interests you, what you enjoy doing and where you think you could be useful.
              </p>

              {/* Validation Warnings Box */}
              {formErrors.length > 0 && (
                <div style={{
                  background: "#fdf3f3",
                  border: "1px solid #f5c2c2",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                }}>
                  <h4 style={{ margin: "0 0 0.5rem", color: "#b83232", fontWeight: 700, fontSize: "0.875rem" }}>Please review required details:</h4>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.8125rem", color: "#b83232", lineHeight: 1.5 }}>
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submission Error Box */}
              {submitError && (
                <div style={{
                  background: "#fdf3f3",
                  border: "1px solid #f5c2c2",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  color: "#b83232",
                  fontSize: "0.875rem",
                  textAlign: "left"
                }}>
                  <strong>Error submitting application:</strong> {submitError}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                
                {/* Name */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Full Name *</label>
                  <input
                    id="volunteer-fullName"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    style={inputStyle}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                {/* Contact Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Email Address *</label>
                    <input
                      id="volunteer-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      style={inputStyle}
                      disabled={submitting}
                      onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                      onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Phone / WhatsApp Number *</label>
                    <input
                      id="volunteer-phone"
                      type="tel"
                      placeholder="e.g. +234..."
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      style={inputStyle}
                      disabled={submitting}
                      onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                      onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                    />
                  </div>
                </div>

                {/* Age & Location Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Age Range *</label>
                    <select
                      id="volunteer-ageRange"
                      value={formData.ageRange}
                      onChange={(e) => setFormData(prev => ({ ...prev, ageRange: e.target.value }))}
                      style={inputStyle}
                      disabled={submitting}
                    >
                      <option value="">Select age range</option>
                      <option value="under-18">Under 18</option>
                      <option value="18-24">18 - 24</option>
                      <option value="25-34">25 - 34</option>
                      <option value="35-50">35 - 50</option>
                      <option value="over-50">Over 50</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Where are you based? *</label>
                    <input
                      id="volunteer-location"
                      type="text"
                      placeholder="e.g. Ogbunike, Awka, Lagos..."
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      style={inputStyle}
                      disabled={submitting}
                      onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                      onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                    />
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>What made you interested in ABF? *</label>
                  <textarea
                    id="volunteer-motivation"
                    placeholder="Please tell us a little about what caught your eye..."
                    rows={3}
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical", height: 80 }}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                {/* Contribution Areas */}
                <div id="volunteer-areas">
                  <label style={{ fontWeight: 700, display: "block", fontSize: "0.9rem", color: "#1a2218", marginBottom: "0.5rem" }}>
                    How would you like to contribute? * <span style={{ fontWeight: 400, color: "#8a9a84" }}>(Select all that apply)</span>
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {[
                      "Reading & Library Support",
                      "Educational Activities",
                      "Community Outreach",
                      "Events Coordinator",
                      "Media & Storytelling",
                      "Technology & Digital",
                      "Administration Support",
                      "Fundraising",
                      "Other"
                    ].map((area) => {
                      const selected = formData.areas.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          className={`abf-category-chip${selected ? " selected" : ""}`}
                          onClick={() => handleAreaToggle(area)}
                          disabled={submitting}
                        >
                          {selected ? "✓ " : "+ "}{area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Skills/Interests */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>What skills or interests would you like to bring? <span style={{ fontWeight: 400, color: "#8a9a84" }}>(Optional)</span></label>
                  <textarea
                    placeholder="Describe any creative, teaching, digital or organisational skills..."
                    rows={2}
                    value={formData.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical", height: 60 }}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                {/* Time Availability */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>How much time could you realistically contribute? *</label>
                  <select
                    id="volunteer-availability"
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    style={inputStyle}
                    disabled={submitting}
                  >
                    <option value="">Select availability</option>
                    <option value="occasionally">Occasionally (during campaigns/events)</option>
                    <option value="monthly">A few hours a month</option>
                    <option value="weekly">Weekly</option>
                    <option value="event-specific">During specific events or projects</option>
                    <option value="unsure">I'm not sure yet</option>
                  </select>
                </div>

                {/* Additional Info */}
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Is there anything else you'd like us to know? <span style={{ fontWeight: 400, color: "#8a9a84" }}>(Optional)</span></label>
                  <textarea
                    placeholder="Tell us a little more about yourself..."
                    rows={2}
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    style={{ ...inputStyle, resize: "vertical", height: 60 }}
                    disabled={submitting}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a2d")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde8dd")}
                  />
                </div>

                {/* Consent checkbox */}
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginTop: "0.5rem" }}>
                  <input
                    type="checkbox"
                    id="volunteer-consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                    style={{ marginTop: "0.25rem", cursor: "pointer" }}
                    disabled={submitting}
                  />
                  <label htmlFor="volunteer-consent" style={{ fontSize: "0.8125rem", color: "#4a5a44", lineHeight: 1.4, cursor: "pointer" }}>
                    I understand that submitting this form does not guarantee a volunteer position and that ABF may contact me using the info provided. *
                  </label>
                </div>

              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="abf-btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "1rem", opacity: submitting ? 0.7 : 1 }}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

