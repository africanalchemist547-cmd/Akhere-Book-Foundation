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
  BASE,
  PartnerWithABFModal,
  VolunteerModal
} from "./_shared";

export default function ABFGetInvolved() {
  const [donateMoneyOpen, setDonateMoneyOpen] = useState(false);
  const [donateBookOpen, setDonateBookOpen] = useState(false);
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  useEffect(() => {
    document.title = "Get Involved | Akhere Book Foundation";
  }, []);

  // Keyboard escape listeners
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDonateMoneyOpen(false);
        setDonateBookOpen(false);
        setVolunteerOpen(false);
        setPartnerOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Sync scrolling state
  useEffect(() => {
    if (volunteerOpen || partnerOpen || donateMoneyOpen || donateBookOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [volunteerOpen, partnerOpen, donateMoneyOpen, donateBookOpen]);

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
                margin: "0 0 2rem",
              }}>
                ABF's work is powered not only by donations, but by people who are willing to contribute their time, skills, ideas and energy.
              </p>

              {/* Hero Action Button */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  className="abf-btn-primary"
                  onClick={() => setVolunteerOpen(true)}
                  style={{
                    fontSize: "1rem",
                    padding: "1rem 2.25rem",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  🙌 Become a Volunteer
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section style={{ padding: "5.5rem 1.5rem", background: "white" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <SectionLabel text="Ways to Participate" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900, color: "#1a2218", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              There's More Than One Way to Help
            </h2>
            <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, margin: "0 0 2rem" }}>
              Akhere Book Foundation is not looking only for financial donors. We believe that local support has many dimensions. Depending on current project needs, individuals can contribute through library supervision, homework aid, distributing book drives, sorting collections, or documenting our milestones. Every form of assistance helps optimize the impact we have in Ogbunike.
            </p>
            <button
              className="abf-btn-primary"
              onClick={() => setVolunteerOpen(true)}
              style={{
                fontSize: "1rem",
                padding: "0.9375rem 2.25rem",
                margin: "0 auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              🙌 Get Involved as a Volunteer
            </button>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
              <button className="abf-btn-primary" onClick={() => setPartnerOpen(true)} style={{ fontSize: "0.875rem" }}>
                Partner with ABF
              </button>
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

      {/* Footer */}
      <Footer onDonate={() => setDonateMoneyOpen(true)} />

      {/* Modals */}
      {donateMoneyOpen && <DonateMoneyModal onClose={() => setDonateMoneyOpen(false)} />}
      {donateBookOpen && <DonateBookModal onClose={() => setDonateBookOpen(false)} />}
      {partnerOpen && <PartnerWithABFModal onClose={() => setPartnerOpen(false)} />}
      {volunteerOpen && <VolunteerModal onClose={() => setVolunteerOpen(false)} />}
    </div>
  );
}
