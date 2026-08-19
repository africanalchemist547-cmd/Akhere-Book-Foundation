import { useState, useEffect } from "react";
import {
  ASSETS,
  CONTACT,
  Icon,
  SectionLabel,
  CategoryBadge,
  DonateMoneyModal,
  DonateBookModal,
  Header,
  Footer,
  BASE
} from "./_shared";

// ─── TYPES & INTERFACES ──────────────────────────────────────
interface VolunteerForm {
  fullName: string;
  email: string;
  phone: string;
  ageRange: string;
  location: string;
  motivation: string;
  areas: string[];
  skills: string;
  availability: string;
  additionalInfo: string;
  consent: boolean;
}

export default function ABFGetInvolved() {
  const [donateMoneyOpen, setDonateMoneyOpen] = useState(false);
  const [donateBookOpen, setDonateBookOpen] = useState(false);

  useEffect(() => {
    document.title = "Get Involved | Akhere Book Foundation";
  }, []);
  
  // Volunteer Modal State
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Form State Values
  const [formData, setFormData] = useState<VolunteerForm>({
    fullName: "",
    email: "",
    phone: "",
    ageRange: "",
    location: "",
    motivation: "",
    areas: [],
    skills: "",
    availability: "",
    additionalInfo: "",
    consent: false
  });

  // Keyboard escape listeners
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDonateMoneyOpen(false);
        setDonateBookOpen(false);
        setVolunteerOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Sync scrolling state
  useEffect(() => {
    if (volunteerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [volunteerOpen]);

  const handleAreaToggle = (area: string) => {
    setFormData((prev) => {
      const nextAreas = prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area];
      return { ...prev, areas: nextAreas };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!formData.fullName.trim()) errors.push("Please enter your full name.");
    if (!formData.email.trim()) {
      errors.push("Please enter your email address.");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Please enter a valid email address.");
    }
    if (!formData.phone.trim()) errors.push("Please enter your phone or WhatsApp number.");
    if (!formData.ageRange) errors.push("Please select your age range.");
    if (!formData.location.trim()) errors.push("Please enter where you are based.");
    if (!formData.motivation.trim()) errors.push("Please tell us what made you interested in ABF.");
    if (formData.areas.length === 0) errors.push("Please select at least one way you would like to contribute.");
    if (!formData.availability) errors.push("Please select your time availability.");
    if (!formData.consent) errors.push("Please accept the volunteer consent checkbox.");

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setFormSubmitted(true);
  };

  const handleResetModal = () => {
    setVolunteerOpen(false);
    setFormSubmitted(false);
    setFormErrors([]);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      ageRange: "",
      location: "",
      motivation: "",
      areas: [],
      skills: "",
      availability: "",
      additionalInfo: "",
      consent: false
    });
  };

  const volunteerRoles = [
    {
      title: "Reading & Library Support",
      desc: "Help create an environment where children feel comfortable discovering books and learning.",
      bullets: [
        "Support reading activities and book circles",
        "Help organise books and supervise library shelves",
        "Encourage younger readers to develop reading habits",
        "Assist local coordinators during library activities"
      ],
      fit: "You enjoy working with children, books or learning."
    },
    {
      title: "Educational Activities",
      desc: "Provide study guidance and academic support to secondary or school exam candidates.",
      bullets: [
        "Provide homework assistance to visiting students",
        "Support students preparing for WAEC/NECO exams",
        "Facilitate structured workshops or literacy classes",
        "Help explain reference work and research projects"
      ],
      fit: "You enjoy helping students achieve academic goals."
    },
    {
      title: "Community Outreach & Book Drive",
      desc: "Help raise awareness of ABF's campaigns and support book collection drives.",
      bullets: [
        "Help distribute school-safety or book-drive flyers",
        "Coordinate and sort books collected from local donors",
        "Assist in setting up public awareness campaigns",
        "Liaise with local schools to promote library visits"
      ],
      fit: "You are active in local networks and advocacy."
    },
    {
      title: "Media & Storytelling",
      desc: "Help document ABF's work and share milestones with our wider supporters network.",
      bullets: [
        "Capture photos of library events and milestones",
        "Help write local draft updates or student highlights",
        "Assist in preparing campaign flyers or newsletters",
        "Document growth stories (like Grace's story)"
      ],
      fit: "You enjoy creative design, writing or photography."
    }
  ];

  const inputStyle: React.CSSProperties = {
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
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#fafaf7" }}>
      {/* Navigation Header */}
      <Header onDonate={() => setDonateMoneyOpen(true)} />

      <div style={{ paddingTop: 72 }}>
        
        {/* Page Hero */}
        <section style={{
          position: "relative",
          minHeight: "50vh",
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
            padding: "4rem 1.5rem",
            width: "100%",
          }}>
            <div style={{ maxWidth: 800 }}>
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem", marginBottom: "1.5rem", fontWeight: 500 }}>
                <a href="/" style={{ color: "rgba(255, 255, 255, 0.6)", textDecoration: "none" }}>Home</a>
                <span>/</span>
                <span style={{ color: "#8dc63f", fontWeight: 600 }}>Get Involved</span>
              </div>

              <SectionLabel text="Join the Mission" />

              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
                letterSpacing: "-0.02em",
              }}>
                Your Time, Skills or Ideas<br />
                <span style={{ color: "#8dc63f" }}>Can Help Build Something Bigger.</span>
              </h1>

              <p style={{
                fontSize: "1.125rem",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.7,
                maxWidth: 620,
                margin: 0
              }}>
                ABF's work is powered not only by donations, but by people who are willing to contribute their time, skills, ideas and energy.
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section style={{ padding: "6rem 1.5rem", background: "white" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <SectionLabel text="Ways to Participate" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900, color: "#1a2218", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              There's More Than One Way to Help
            </h2>
            <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, margin: 0 }}>
              Akhere Book Foundation is not looking only for financial donors. We believe that local support has many dimensions. Depending on current project needs, individuals can contribute through library supervision, homework aid, distributing book drives, sorting collections, or documenting our milestones. Every form of assistance helps optimize the impact we have in Ogbunike.
            </p>
          </div>
        </section>

        {/* Volunteer Roles Section */}
        <section style={{ padding: "0 1.5rem 6rem", background: "white" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
                Where Could You Fit In?
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "#6a7a64", marginTop: "0.5rem" }}>
                Possibilities to share your skills, depending on ABF's active project schedules.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "2rem",
              marginBottom: "3rem"
            }}>
              {volunteerRoles.map((role, idx) => (
                <div key={idx} className="abf-trust-card" style={{ padding: "2.25rem 2rem", background: "#f8faf6", border: "1px solid #e8f0e8" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e8f5e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", marginBottom: "1.25rem" }}>
                    {idx === 0 && "📚"}
                    {idx === 1 && "💡"}
                    {idx === 2 && "📢"}
                    {idx === 3 && "📸"}
                  </div>
                  <h3 style={{ fontSize: "1.1875rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.75rem" }}>
                    {role.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#6a7a64", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                    {role.desc}
                  </p>
                  
                  <ul style={{ paddingLeft: "1.25rem", margin: "0 0 1.5rem", fontSize: "0.875rem", color: "#4a5a44", lineHeight: 1.7 }}>
                    {role.bullets.map((bullet, bidx) => (
                      <li key={bidx} style={{ marginBottom: "0.375rem" }}>{bullet}</li>
                    ))}
                  </ul>

                  <div style={{
                    marginTop: "auto",
                    padding: "0.75rem 1rem",
                    background: "white",
                    borderRadius: 10,
                    border: "1px dashed #dde8dd",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#2c3424"
                  }}>
                    🌟 <strong>Good Fit If:</strong> {role.fit}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.8125rem", color: "#8a9a84", fontStyle: "italic", textAlign: "center", margin: 0 }}>
              * Depending on ABF's current needs, volunteers may be able to contribute through these areas. Submitting does not guarantee immediate assignment.
            </p>
          </div>
        </section>

        {/* Why Volunteer Section */}
        <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <SectionLabel text="The Core Value" />
              <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
                Why Give Your Time?
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
              {[
                { title: "Help Create Access", text: "A small contribution of time can help children gain access to desks, books, reference works, and opportunities that shape performance.", emoji: "💡" },
                { title: "Build With the Community", text: "Volunteering is about community coordination and partnership, working together with local leaders to build something that lasts.", emoji: "🤝" },
                { title: "Help Children Discover Possibility", text: "We help children build vocabulary, confidence, and self-study habits, showing them what they are capable of becoming.", emoji: "🌱" },
                { title: "Grow With the Work", text: "Bring your unique professional skills, share ideas, learn from local coordinators, and grow along with ABF's milestones.", emoji: "📈" }
              ].map((item, idx) => (
                <div key={idx} style={{ background: "white", padding: "2rem", borderRadius: 20, border: "1px solid #e8f0e8", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{item.emoji}</div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#6a7a64", lineHeight: 1.65, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy Block */}
        <section style={{ padding: "6rem 1.5rem", background: "white" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontSize: "2.5rem" }}>🌱</span>
            <blockquote style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              fontWeight: 800,
              color: "#2d6a2d",
              lineHeight: 1.5,
              margin: "1.5rem 0",
              fontStyle: "italic"
            }}>
              "None of us knows which child sitting with a book today will grow into someone who shapes tomorrow. Supporting education is an investment in the future of everyone."
            </blockquote>
            <p style={{ fontSize: "0.9375rem", color: "#6a7a64", margin: 0 }}>
              — Akhere Book Foundation Philosophy
            </p>
          </div>
        </section>

        {/* Not Ready to Volunteer Options */}
        <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8", borderBottom: "1px solid #e8f0e8" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <SectionLabel text="Other Ways to Support" />
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1a2218", marginBottom: "1.25rem" }}>
              Not Ready to Volunteer?
            </h2>
            <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              There are other valuable ways you can support ABF's operations and libraries.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem"
            }}>
              <div style={{ background: "white", padding: "1.75rem", borderRadius: 16, border: "1px solid #e8f0e8", textAlign: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>💚</span>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#1a2218", margin: "0.5rem 0 1rem" }}>Donate Money</h3>
                <button className="abf-btn-primary" onClick={() => setDonateMoneyOpen(true)} style={{ fontSize: "0.875rem", width: "100%", justifyContent: "center" }}>
                  Donate
                </button>
              </div>

              <div style={{ background: "white", padding: "1.75rem", borderRadius: 16, border: "1px solid #e8f0e8", textAlign: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>📚</span>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#1a2218", margin: "0.5rem 0 1rem" }}>Donate Books</h3>
                <button className="abf-btn-primary" onClick={() => setDonateBookOpen(true)} style={{ fontSize: "0.875rem", width: "100%", justifyContent: "center" }}>
                  Donate Books
                </button>
              </div>

              <div style={{ background: "white", padding: "1.75rem", borderRadius: 16, border: "1px solid #e8f0e8", textAlign: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>📢</span>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#1a2218", margin: "0.5rem 0 1rem" }}>Follow ABF</h3>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "#f5f5f3", color: "#cc2366" }}>
                    <Icon.Instagram />
                  </a>
                  <a href={CONTACT.twitter} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "#f5f5f3", color: "#1a1a1a" }}>
                    <Icon.Twitter />
                  </a>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "3rem", borderTop: "1px solid #dde8dd", paddingTop: "2rem" }}>
              <p style={{ fontSize: "0.9375rem", color: "#4a5a44", marginBottom: "0.75rem" }}>
                Have an organisation or business that could partner with us?
              </p>
              <a href={`mailto:${CONTACT.email}`} style={{ textDecoration: "none" }}>
                <button className="abf-btn-secondary" style={{ fontSize: "0.875rem" }}>
                  Partner with ABF
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Volunteer Application Trigger Banner */}
        <section style={{
          padding: "7rem 1.5rem",
          background: "linear-gradient(135deg, #1a3d1a 0%, #2d6a2d 100%)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -100, left: -60, width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ maxWidth: 640, margin: "0 auto 2.5rem" }}>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: "1.25rem" }}>
                Interested in<br /><span style={{ color: "#8dc63f" }}>Volunteering?</span>
              </h2>
              <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
                Tell us a little about yourself, what you enjoy doing and how you think you could contribute. We'll take it from there.
              </p>
            </div>
            
            <button className="abf-btn-secondary" onClick={() => setVolunteerOpen(true)} style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}>
              Become a Volunteer
            </button>
          </div>
        </section>
      </div>

      {/* Conversational Volunteer Modal Dialog */}
      {volunteerOpen && (
        <div className="abf-modal-overlay" onClick={handleResetModal} style={{ zIndex: 200 }}>
          <div
            className="abf-animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 24,
              width: "100%",
              maxWidth: 580,
              maxHeight: "92vh",
              overflowY: "auto",
              padding: "2rem",
              boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
              border: "1px solid #dde8dd",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0f7f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>🙌</span>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a2218", margin: 0, lineHeight: 1.2 }}>Let's Get to Know You</h2>
              </div>
              <button
                onClick={handleResetModal}
                style={{ background: "#f5f5f3", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", flexShrink: 0 }}
              >
                <Icon.X />
              </button>
            </div>

            {formSubmitted ? (
              // ─── SUCCESS SCREEN STATE ──────────────────────────────
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <span style={{ fontSize: "4rem" }}>💚</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2d6a2d", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
                  Thank You for Reaching Out
                </h3>
                <p style={{ fontSize: "1rem", color: "#4a5a44", lineHeight: 1.65, margin: "0 0 2rem" }}>
                  We've received your interest in volunteering with ABF. Your willingness to contribute matters!
                </p>
                <div style={{
                  background: "#fcf9f2",
                  padding: "1.25rem",
                  borderRadius: 12,
                  border: "1px dashed #c98f3b",
                  fontSize: "0.875rem",
                  color: "#845e28",
                  lineHeight: 1.5,
                  marginBottom: "2rem"
                }}>
                  🛠️ <strong>Development Notice:</strong> This form is currently being prepared for ABF's volunteer system. We will contact you when the volunteer database is connected in Stage 4.
                </div>
                <button className="abf-btn-primary" onClick={handleResetModal} style={{ width: "100%", justifyContent: "center" }}>
                  Done
                </button>
              </div>
            ) : (
              // ─── CONVERSATIONAL FORM FIELDS ────────────────────────
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

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                  
                  {/* Name */}
                  <div>
                    <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>

                  {/* Contact Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    <div>
                      <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Email Address *</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        placeholder="e.g. +234..."
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Age & Location Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    <div>
                      <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>Age Range *</label>
                      <select
                        value={formData.ageRange}
                        onChange={(e) => setFormData(prev => ({ ...prev, ageRange: e.target.value }))}
                        style={inputStyle}
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
                        type="text"
                        placeholder="e.g. Ogbunike, Awka, Lagos..."
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Motivation */}
                  <div>
                    <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>What made you interested in ABF? *</label>
                    <textarea
                      placeholder="Please tell us a little about what caught your eye..."
                      rows={3}
                      value={formData.motivation}
                      onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                      style={{ ...inputStyle, resize: "vertical", height: 80 }}
                    />
                  </div>

                  {/* Contribution Areas */}
                  <div>
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
                          >
                            {selected && <Icon.Check />}
                            {area}
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
                    />
                  </div>

                  {/* Time Availability */}
                  <div>
                    <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a2218" }}>How much time could you realistically contribute? *</label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                      style={inputStyle}
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
                    />
                  </div>

                  {/* Consent checkbox */}
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginTop: "0.5rem" }}>
                    <input
                      type="checkbox"
                      id="consent-check"
                      checked={formData.consent}
                      onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                      style={{ marginTop: "0.25rem", cursor: "pointer" }}
                    />
                    <label htmlFor="consent-check" style={{ fontSize: "0.8125rem", color: "#4a5a44", lineHeight: 1.4, cursor: "pointer" }}>
                      I understand that submitting this form does not guarantee a volunteer position and that ABF may contact me using the info provided. *
                    </label>
                  </div>

                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="abf-btn-primary"
                  style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "1rem" }}
                >
                  Submit Application
                </button>

              </form>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onDonate={() => setDonateMoneyOpen(true)} />

      {/* Modals */}
      {donateMoneyOpen && <DonateMoneyModal onClose={() => setDonateMoneyOpen(false)} />}
      {donateBookOpen && <DonateBookModal onClose={() => setDonateBookOpen(false)} />}
    </div>
  );
}
