import { useState, useEffect } from "react";
import {
  ASSETS,
  Icon,
  SectionLabel,
  CategoryBadge,
  DonateMoneyModal,
  DonateBookModal,
  Header,
  Footer,
  BASE,
  TEAM_MEMBERS,
  SharedTeamMember
} from "./_shared";

// ─── ROUTING HELPER ──────────────────────────────────────────
function parseMemberSlug(): string | null {
  const { pathname, search } = window.location;
  
  // Check query parameter fallback e.g. ?member=oluwatosin-aina
  const searchParams = new URLSearchParams(search);
  const searchSlug = searchParams.get("member");
  if (searchSlug) return searchSlug;

  // Check standard path suffix e.g. /meet-the-team/slug or /team/slug
  const match = pathname.match(/\/(?:meet-the-team|team)\/([^/]+)$/);
  return match ? match[1] : null;
}

export default function ABFTeam() {
  const [donateMoneyOpen, setDonateMoneyOpen] = useState(false);
  const [donateBookOpen, setDonateBookOpen] = useState(false);

  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Meet the Team | Akhere Book Foundation";
  }, []);

  // Sync state on load and popstates
  useEffect(() => {
    setActiveSlug(parseMemberSlug());

    const handlePopState = () => {
      setActiveSlug(parseMemberSlug());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDonateMoneyOpen(false);
        setDonateBookOpen(false);
        setActiveSlug(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleOpenProfile = (slug: string) => {
    window.history.pushState({}, "", `/meet-the-team/${slug}`);
    setActiveSlug(slug);
  };

  const handleCloseModal = () => {
    window.history.pushState({}, "", "/meet-the-team");
    setActiveSlug(null);
  };

  const selectedMember = TEAM_MEMBERS.find((m) => m.slug === activeSlug);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#fafaf7" }}>
      {/* Navigation Header */}
      <Header onDonate={() => setDonateMoneyOpen(true)} />

      <div style={{ paddingTop: 72 }}>
        {/* Page Hero */}
        <section style={{
          position: "relative",
          minHeight: "45vh",
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
                <span style={{ color: "#8dc63f", fontWeight: 600 }}>Meet the Team</span>
              </div>

              <SectionLabel text="The People Behind the Work" />

              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
                letterSpacing: "-0.02em",
              }}>
                Meet the People Behind ABF
              </h1>

              <p style={{
                fontSize: "1.125rem",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.7,
                maxWidth: 620,
                margin: 0
              }}>
                ABF is built by people who believe that access to learning can help children discover possibilities that reach far beyond the classroom.
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section style={{ padding: "6rem 1.5rem", background: "white" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <SectionLabel text="Our Philosophy" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900, color: "#1a2218", marginBottom: "1.25rem", lineHeight: 1.2 }}>
              People Make the Work Possible
            </h2>
            <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, margin: 0 }}>
              Akhere Book Foundation's projects, library spaces, and book distribution campaigns are supported and carried by people who contribute different skills, time, and perspectives. We are team members, coordinators, volunteers, and community participants working to turn ideas about educational access into real experiences for children.
            </p>
          </div>
        </section>

        {/* Team Grid */}
        <section style={{ padding: "0 1.5rem 6rem", background: "white" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 360px))",
              gap: "2.5rem 2rem",
              justifyContent: "center"
            }}>
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="abf-content-card"
                  onClick={() => handleOpenProfile(member.slug)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Photo */}
                  <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
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
                      height: "50%",
                      background: "linear-gradient(to top, rgba(26,34,24,0.6), transparent)",
                    }} />
                    <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem" }}>
                      <CategoryBadge label={member.role} color="#8dc63f" />
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "1.75rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>
                      {member.name}
                    </h3>
                    <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.65, margin: "0 0 1.5rem" }}>
                      {member.description}
                    </p>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      color: "#2d6a2d",
                      fontWeight: 700,
                      fontSize: "0.9375rem"
                    }}>
                      Meet {member.name.split(" ")[0]} <Icon.ArrowRight />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beyond the Team / Community Section */}
        <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8", borderBottom: "1px solid #e8f0e8" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <SectionLabel text="Our Wider Network" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 900, color: "#1a2218", marginBottom: "1.25rem", lineHeight: 1.25 }}>
              More Than the Names You See Here
            </h2>
            <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.75, marginBottom: "2rem" }}>
              ABF's reach extends beyond a formal directory. Our work on the ground relies on local volunteers who help manage community learning centers, donors who provide books, partners who support project logistics, and residents who participate in maintaining the learning spaces we establish. We are extremely grateful to everyone who chooses to share their time and skills to make learning accessible.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ background: "white", padding: "0.75rem 1.5rem", borderRadius: 12, border: "1px solid #e8f0e8", fontWeight: 700, color: "#2c3424", fontSize: "0.9375rem" }}>👥 Local Volunteers</div>
              <div style={{ background: "white", padding: "0.75rem 1.5rem", borderRadius: 12, border: "1px solid #e8f0e8", fontWeight: 700, color: "#2c3424", fontSize: "0.9375rem" }}>📚 Book Donors</div>
              <div style={{ background: "white", padding: "0.75rem 1.5rem", borderRadius: 12, border: "1px solid #e8f0e8", fontWeight: 700, color: "#2c3424", fontSize: "0.9375rem" }}>🤝 Community Partners</div>
            </div>
          </div>
        </section>

        {/* Bottom Volunteer / Donation CTA */}
        <section style={{
          padding: "7rem 1.5rem",
          background: "linear-gradient(135deg, #1a3d1a 0%, #2d6a2d 100%)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -100, left: -60, width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ maxWidth: 640, margin: "0 auto 3.5rem" }}>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: "1.25rem" }}>
                Want to Be Part<br /><span style={{ color: "#8dc63f" }}>of the Work?</span>
              </h2>
              <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
                Whether you have time to give, books to contribute, skills to share or simply want to support what we're building, there is a place to start.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
              <div style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "1.75rem 1.5rem",
                border: "1px solid rgba(255,255,255,0.12)",
                width: 260,
                textAlign: "center"
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🙌</div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>Volunteer</h3>
                <a href="/get-involved" style={{ textDecoration: "none", width: "100%" }}>
                  <button className="abf-btn-secondary" style={{ fontSize: "0.875rem", width: "100%", justifyContent: "center" }}>
                    Get Involved
                  </button>
                </a>
              </div>

              <div style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "1.75rem 1.5rem",
                border: "1px solid rgba(255,255,255,0.12)",
                width: 260,
                textAlign: "center"
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>💚</div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>Donate Money</h3>
                <button className="abf-btn-secondary" onClick={() => setDonateMoneyOpen(true)} style={{ fontSize: "0.875rem", width: "100%", justifyContent: "center" }}>
                  Donate Money
                </button>
              </div>

              <div style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "1.75rem 1.5rem",
                border: "1px solid rgba(255,255,255,0.12)",
                width: 260,
                textAlign: "center"
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>📚</div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>Donate Books</h3>
                <button className="abf-btn-secondary" onClick={() => setDonateBookOpen(true)} style={{ fontSize: "0.875rem", width: "100%", justifyContent: "center" }}>
                  Donate Books
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Expanded Profile Dialog Modal */}
      {selectedMember && (
        <div className="abf-modal-overlay" onClick={handleCloseModal} style={{ zIndex: 250 }}>
          <div
            className="abf-animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 24,
              width: "100%",
              maxWidth: 680,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.5rem",
              boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
              border: "1px solid #dde8dd",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button
                onClick={handleCloseModal}
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
                  color: "#555"
                }}
              >
                <Icon.X />
              </button>
            </div>

            {/* Profile Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
              alignItems: "flex-start"
            }}>
              {/* Photo */}
              <div style={{
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid #e8f0e8",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)"
              }}>
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  style={{ width: "100%", height: 320, objectFit: "cover", objectPosition: "top" }}
                />
              </div>

              {/* Story Details */}
              <div>
                <CategoryBadge label={selectedMember.role} color="#2d6a2d" />
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1a2218", margin: "0.75rem 0 0.5rem", lineHeight: 1.2 }}>
                  {selectedMember.name}
                </h2>
                
                <p style={{
                  fontSize: "1.0625rem",
                  color: "#4a5a44",
                  lineHeight: 1.75,
                  margin: "1.25rem 0 0",
                  whiteSpace: "pre-wrap"
                }}>
                  {selectedMember.fullStory}
                </p>

                <div style={{
                  marginTop: "2rem",
                  padding: "1rem 1.25rem",
                  background: "#f8faf6",
                  borderRadius: 12,
                  borderLeft: "3px solid #8dc63f",
                  fontSize: "0.875rem",
                  color: "#2c3424",
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  🤝 Part of the dedicated group helping ABF build what comes next.
                </div>
              </div>
            </div>
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
