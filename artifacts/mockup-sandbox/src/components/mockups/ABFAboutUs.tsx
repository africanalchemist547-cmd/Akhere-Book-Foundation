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
  VolunteerModal
} from "./_shared";
import { usePublicStatistics, usePublicProjects, findMatchingStatistic } from "../../hooks/useCmsData";

export default function ABFAboutUs() {
  const [donateMoneyOpen, setDonateMoneyOpen] = useState(false);
  const [donateBookOpen, setDonateBookOpen] = useState(false);
  const [volunteerOpen, setVolunteerOpen] = useState(false);

  const { data: dbStats } = usePublicStatistics();
  const { data: projects } = usePublicProjects();

  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const libraryImage = featuredProject?.cover_image || ASSETS.library;
  const libraryLocation = featuredProject?.location || "Ogbunike, Anambra State";

  const aboutStats = [
    findMatchingStatistic(
      dbStats,
      {
        primaryKey: "schools_reached",
        aliases: ["schools_and_communities", "schools", "schools_communities"],
        labelIncludes: ["school"],
      },
      "Schools & Communities",
      "[XX]",
      "ABF TO PROVIDE VERIFIED FIGURES"
    ),
    findMatchingStatistic(
      dbStats,
      {
        primaryKey: "library_users",
        aliases: ["estimated_users", "users"],
        labelIncludes: ["user"],
      },
      "Estimated Users",
      "[XX]",
      "ABF TO PROVIDE VERIFIED FIGURES"
    ),
    findMatchingStatistic(
      dbStats,
      {
        primaryKey: "books_available",
        aliases: ["books_made_available", "books_and_resources", "books"],
        labelIncludes: ["book"],
      },
      "Books & Resources",
      "[XX]",
      "ABF TO PROVIDE VERIFIED FIGURES"
    ),
    findMatchingStatistic(
      dbStats,
      {
        primaryKey: "monthly_hours",
        aliases: ["monthly_usage_hours", "hours"],
        labelIncludes: ["hour"],
      },
      "Monthly Usage Hours",
      "[XX]",
      "ABF TO PROVIDE VERIFIED FIGURES"
    ),
  ];

  useEffect(() => {
    document.title = "About Us | Akhere Book Foundation";
  }, []);

  // Keyboard close
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

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#fafaf7" }}>
      {/* Navigation Header */}
      <Header onDonate={() => setDonateMoneyOpen(true)} />

      <main style={{ paddingTop: 72 }}>
        {/* Page Hero */}
        <section style={{
          position: "relative",
          minHeight: "65vh",
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
            padding: "5rem 1.5rem 4rem",
            width: "100%",
          }}>
            <div style={{ maxWidth: 720 }}>
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem", marginBottom: "1.5rem", fontWeight: 500 }}>
                <a href="/" style={{ color: "rgba(255, 255, 255, 0.6)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#8dc63f"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"}>Home</a>
                <span>/</span>
                <span style={{ color: "#8dc63f", fontWeight: 600 }}>About Us</span>
              </div>

              <SectionLabel text="About Akhere Book Foundation" />

              <h1 style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
                letterSpacing: "-0.02em",
              }}>
                More Than Books.<br />
                <span style={{ color: "#8dc63f" }}>A Foundation for What Comes Next.</span>
              </h1>

              <p style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.7,
                marginBottom: "1rem",
                maxWidth: 620,
              }}>
                At Akhere Book Foundation, we believe access to books and learning can open possibilities that a child may not yet know exist.
              </p>

              <p style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.7,
                maxWidth: 620,
                fontWeight: 500,
              }}>
                We are working to make those possibilities easier to reach.
              </p>
            </div>
          </div>
        </section>

        {/* Section 1 — Why ABF Exists */}
        <section style={{ padding: "6rem 1.5rem", background: "white" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3.5rem", alignItems: "flex-start" }}>
              <div>
                <SectionLabel text="Why We Exist" />
                <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#1a2218", lineHeight: 1.2, margin: "0 0 1.5rem" }}>
                  Access shapes<br /><span style={{ color: "#2d6a2d" }}>what a child can become.</span>
                </h2>
                <div style={{
                  padding: "2rem",
                  background: "#f8faf6",
                  borderLeft: "4px solid #8dc63f",
                  borderRadius: "0 16px 16px 0",
                  fontSize: "1.25rem",
                  fontStyle: "italic",
                  fontWeight: 600,
                  color: "#2c3424",
                  lineHeight: 1.5,
                  boxShadow: "0 4px 20px rgba(45, 106, 45, 0.03)"
                }}>
                  "A book can be a small object. What it can unlock is not."
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
                <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, margin: 0 }}>
                  A child's opportunities are heavily influenced by the tools and resources they have access to. Books are not just paper and ink; they are conduits of knowledge, new perspectives, and imagination.
                </p>
                <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, margin: 0 }}>
                  Access to reading materials builds confidence, sparks curiosity, develops reference frameworks, and strengthens language capability. It allows children to encounter ideas and possibilities far beyond their immediate environments.
                </p>
                <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, margin: 0 }}>
                  But ABF is not merely about giving books away. We are dedicated to creating access to the tools, spaces, and supportive environments that enable children and communities to engage in structured, lifelong learning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — This Work Matters to All of Us */}
        <section style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #142414 0%, #1a381a 50%, #101e10 100%)",
          borderTop: "1px solid rgba(141, 198, 63, 0.1)",
          borderBottom: "1px solid rgba(141, 198, 63, 0.1)",
        }}>
          {/* Subtle ambient lighting */}
          <div style={{
            position: "absolute",
            top: "-15%",
            right: "-10%",
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(141,198,63,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: "-15%",
            left: "-10%",
            width: 450,
            height: 450,
            background: "radial-gradient(circle, rgba(45,106,45,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }} />

          <div style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "7rem 1.5rem",
          }}>
            <div style={{ maxWidth: 720 }}>
              <SectionLabel text="This Work Matters to All of Us" />

              <h2 style={{
                fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}>
                Building the citizens<br />
                <span style={{ color: "#8dc63f" }}>Nigeria needs.</span>
              </h2>

              <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Helping children read and learn is not just about kindness. It is a shared responsibility with tangible benefits for our entire society. The children sitting with books today will eventually become the engineers, doctors, teachers, writers, entrepreneurs, scientists, business leaders, and community thinkers of tomorrow.
              </p>

              <div style={{
                fontSize: "1.1875rem",
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1.75,
                fontStyle: "italic",
                borderLeft: "3px solid #8dc63f",
                paddingLeft: "1.25rem",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}>
                "We do not know who the next Wole Soyinka or Obafemi Awolowo is among the children we serve. Our job is simply to make sure they have the opportunity to develop."
              </div>

              <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, margin: 0 }}>
                When we provide a child with learning tools, we are not only investing in their individual future. We are investing in the community, the economy, and the society that they will eventually help to build and shape.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 — What ABF Believes */}
        <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderBottom: "1px solid #e8f0e8" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 4rem" }}>
              <SectionLabel text="Our Core Beliefs" />
              <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#1a2218", lineHeight: 1.15, margin: 0 }}>
                What We Believe
              </h2>
              <p style={{ fontSize: "1rem", color: "#6a7a64", marginTop: "1rem", lineHeight: 1.6 }}>
                These principles guide our work, from how we source books to how we engage with communities and design projects.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}>
              {[
                {
                  title: "Access Matters",
                  desc: "Children cannot discover what they have never had the opportunity to encounter. We work to break down the physical and financial barriers to books.",
                  emoji: "🔑",
                },
                {
                  title: "Small Contributions Matter",
                  desc: "A contribution does not have to be large to become useful when it is deliberately put to work. Many small actions build lasting change.",
                  emoji: "🌱",
                },
                {
                  title: "Learning Should Lead Somewhere",
                  desc: "The goal is not simply to put books into children's hands, but to encourage curiosity, understanding, confidence, collaboration and meaningful participation in society.",
                  emoji: "🚀",
                },
                {
                  title: "Impact Should Be Visible",
                  desc: "ABF wants supporters to be able to see exactly what their contributions are helping make possible. Trust is built through transparency and real stories.",
                  emoji: "👁️",
                },
              ].map((belief, i) => (
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
                    marginBottom: "1.25rem",
                  }}>
                    {belief.emoji}
                  </div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.75rem" }}>{belief.title}</h3>
                  <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.65, margin: 0 }}>{belief.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 — No Amount Is Too Small */}
        <section style={{ padding: "6rem 1.5rem", background: "white" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div
              className="abf-philosophy-card"
              style={{
                background: "linear-gradient(135deg, #f0f7f0 0%, #e1e1d0 100%)",
                borderRadius: 28,
                padding: "3.5rem 2.5rem",
                border: "1px solid #d4edd4",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "2rem",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <SectionLabel text="Our Philosophy" />
                <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#1a2218", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                  No Amount Is Too Small
                </h2>
                <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, marginBottom: "2rem" }}>
                  Not everyone can give a lot. That has never been the point. A small contribution, when combined with many others and deliberately put to work, can become books, resources, learning spaces and opportunities that reach far beyond the person who gave it.
                </p>

                {/* Highlight box */}
                <div
                  className="abf-recurring-impact-box"
                  style={{
                    background: "white",
                    borderRadius: 16,
                    padding: "1.5rem 2rem",
                    border: "2px dashed #2d6a2d",
                    display: "inline-block",
                    marginBottom: "2rem",
                    boxShadow: "0 10px 30px rgba(45,106,45,0.04)"
                  }}
                >
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#8dc63f", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.375rem" }}>A Recurring Impact</div>
                  <div style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#2d6a2d" }}>
                    ₦500 every two weeks
                  </div>
                  <div style={{ fontSize: "0.9375rem", color: "#6a7a64", marginTop: "0.25rem" }}>
                    can still be a meaningful part of building something bigger.
                  </div>
                </div>

                <div>
                  <button className="abf-btn-primary" onClick={() => setDonateMoneyOpen(true)} style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}>
                    💚 Donate to the Mission
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 — The Azu-Ogbunike Community Library */}
        <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8", borderBottom: "1px solid #e8f0e8" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "4rem",
              alignItems: "center"
            }}>
              {/* Left Column: Image */}
              <div style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 20px 48px rgba(26, 34, 24, 0.08)",
                border: "1px solid #e8f0e8"
              }}>
                <img
                  src={libraryImage}
                  alt="Azu-Ogbunike Public Library"
                  style={{ width: "100%", height: "auto", display: "block", maxHeight: 480, objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "1rem",
                  background: "rgba(26,34,24,0.85)",
                  backdropFilter: "blur(8px)",
                  padding: "0.5rem 1rem",
                  borderRadius: 12,
                  color: "#8dc63f",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  📍 {libraryLocation}
                </div>
              </div>

              {/* Right Column: Story */}
              <div>
                <SectionLabel text="Flagship Project Story" />
                <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#1a2218", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                  A Place to Learn
                </h2>
                <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.75, marginBottom: "1.25rem" }}>
                  The newly completed public library is ABF's current flagship example of impact. This space stands as a physical proof point demonstrating how local support can be optimized to build something lasting.
                </p>
                <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.75, marginBottom: "2rem" }}>
                  Used regularly by students from multiple local schools and adults across the local government area, the library provides a safe, quiet space for reference work, homework, research, and preparation for public school examinations like WAEC and NECO.
                </p>

                {/* Grid of placeholders */}
                <div
                  className="abf-about-stats-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.25rem",
                    marginBottom: "2rem"
                  }}
                >
                  {aboutStats.map((stat, idx) => (
                    <div key={idx} style={{
                      background: "white",
                      padding: "1.25rem",
                      borderRadius: 16,
                      border: "1px solid #e8f0e8",
                      boxShadow: "0 2px 12px rgba(45,106,45,0.02)"
                    }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2d6a2d", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        {stat.value}
                        {stat.isPending && (
                          <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "#aab8a4", background: "#f0f4f0", padding: "0.15rem 0.4rem", borderRadius: 4, textTransform: "uppercase" }}>Pending</span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1a2218", marginTop: "0.375rem" }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: "0.6875rem", color: "#8a9a84", fontStyle: "italic", marginTop: "0.25rem", lineHeight: 1.2 }}>
                        {stat.description || "ABF TO PROVIDE VERIFIED FIGURES"}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <a href="/projects" style={{ textDecoration: "none" }}>
                    <button className="abf-btn-primary">
                      Explore Our Projects <Icon.ChevronRight />
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 — Showing the Impact */}
        <section style={{ padding: "6rem 1.5rem", background: "white" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel text="Transparency & Accountability" />
              <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#1a2218", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                We Want You to See Where the Support Goes
              </h2>
              <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.75, maxW: 640, margin: "0 auto" }}>
                "Your support goes far" should eventually be something our supporters can trace, verify, and understand, not merely a nice phrase. As ABF grows, we are committed to tracking and publishing concrete operational metrics.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem"
            }}>
              {[
                { title: "Academic Prep", text: "Tracking the number of students using the library to study and prepare for WAEC, NECO, and other public examinations." },
                { title: "Community Reach", text: "Counting the number of public and comprehensive schools served by our programs and community drives." },
                { title: "Library Users", text: "Estimating weekly and monthly visitors, research use, reference work, and adult literacy engagement." },
                { title: "Before-and-After", text: "Using local feedback, academic trends, and comparative assessments to check if access is translating into results." }
              ].map((metric, i) => (
                <div key={i} style={{
                  background: "#fafaf7",
                  padding: "1.75rem",
                  borderRadius: 16,
                  border: "1px solid #f0f0ec",
                }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e8f5e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem" }}>💡</div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>{metric.title}</h3>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#6a7a64", lineHeight: 1.6, margin: 0 }}>{metric.text}</p>
                </div>
              ))}
            </div>

            <div style={{
              background: "#fdfbfa",
              padding: "1.5rem",
              borderRadius: 16,
              border: "1px dashed #e6c89c",
              textAlign: "center"
            }}>
              <span style={{ fontSize: "0.875rem", color: "#c98f3b", fontWeight: 700 }}>⚠️ NOTE ON STATISTICS:</span>
              <span style={{ fontSize: "0.875rem", color: "#6a5a44", marginLeft: "0.5rem" }}>
                We are currently establishing monitoring frameworks in our active libraries. Verified operational figures will be published as soon as they are fully audited by the ABF field team.
              </span>
            </div>
          </div>
        </section>

        {/* Section 7 — Our Approach to Supporters */}
        <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <SectionLabel text="Relationship With Supporters" />
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#1a2218", lineHeight: 1.2, marginBottom: "2rem" }}>
              Support Should Feel Like Participation, Not Pressure
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left", padding: "1rem 0" }}>
              <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, margin: 0 }}>
                We believe in a low-pressure, high-gratitude relationship with our supporters. Giving should be easy, occasional, and completely voluntary. No contributor should feel badgered, and no amount should ever be looked down upon.
              </p>
              <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, margin: 0 }}>
                We want you to feel a sense of emotional ownership in what we build together. Rather than constantly asking for more, our focus is on sharing stories, highlighting progress, and showing how your support is optimized on the ground.
              </p>
              <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, margin: 0 }}>
                Supporters are partners in developing the children who will shape Nigeria's future. We want that partnership to be built on mutual respect, long-term trust, and visible milestones.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8 — Our Story Is Still Growing */}
        <section style={{ padding: "6rem 1.5rem", background: "white", borderBottom: "1px solid #e8f0e8" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "4rem",
              alignItems: "center"
            }}>
              <div>
                <SectionLabel text="What Lies Ahead" />
                <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#1a2218", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                  We're Building, Learning and Growing.
                </h2>
                <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.75, marginBottom: "1.25rem" }}>
                  ABF is still in its early chapters. Our story is growing step-by-step alongside the communities we serve. We will continue to expand our reach by establishing more public collections, procuring more books, and offering more structured learning opportunities.
                </p>
                <p style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.75, marginBottom: "0" }}>
                  We do not seek to do this alone. The success of this work depends on community participation, local partnership, and individuals sharing their unique skills, time, resources, and ideas.
                </p>
              </div>

              {/* Carousel Teaser */}
              <div style={{
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid #e8f0e8",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
              }}>
                <img
                  src={ASSETS.ig12}
                  alt="A library still functional, still growing"
                  style={{ width: "100%", height: "auto", display: "block", maxHeight: 380, objectFit: "cover" }}
                />
                <div style={{ padding: "1.5rem", background: "#f8faf6" }}>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#2d6a2d", background: "#e8f5e8", padding: "0.25rem 0.625rem", borderRadius: 9999, display: "inline-block", marginBottom: "0.75rem" }}>PROGRESS SUMMARY</span>
                  <p style={{ fontSize: "0.875rem", color: "#4a5a44", lineHeight: 1.6, margin: 0 }}>
                    Our very first library project continues to remain fully functional, in excellent condition, and actively utilized by local students every week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
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
              {[
                {
                  emoji: "📚",
                  title: "Donate a Book",
                  desc: "Give a child another story to discover.",
                  cta: "Donate a Book",
                  onClick: () => setDonateBookOpen(true),
                },
                {
                  emoji: "💚",
                  title: "Donate Money",
                  desc: "Even a small contribution can go a long way.",
                  cta: "Donate Money",
                  onClick: () => setDonateMoneyOpen(true),
                },
                {
                  emoji: "🙌",
                  title: "Volunteer",
                  desc: "Bring your skills, time or ideas.",
                  cta: "Get Involved",
                  onClick: () => setVolunteerOpen(true),
                },
              ].map((action, i) => (
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
                  <button className="abf-btn-secondary" onClick={action.onClick} style={{ fontSize: "0.9375rem" }}>
                    {action.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Links Section */}
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
      </main>

      {/* Footer component */}
      <Footer onDonate={() => setDonateMoneyOpen(true)} />

      {/* Modals */}
      {donateMoneyOpen && <DonateMoneyModal onClose={() => setDonateMoneyOpen(false)} />}
      {donateBookOpen && <DonateBookModal onClose={() => setDonateBookOpen(false)} />}
      {volunteerOpen && <VolunteerModal onClose={() => setVolunteerOpen(false)} />}
    </div>
  );
}
