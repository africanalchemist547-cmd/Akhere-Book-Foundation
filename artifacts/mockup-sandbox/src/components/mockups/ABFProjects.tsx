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

// ─── DATA SYSTEM / INTERFACES ────────────────────────────────
interface Project {
  id: string;
  title: string;
  slug: string;
  status: "PENDING" | "IN PROGRESS" | "FINISHED";
  statusText: string;
  shortDescription: string;
  location: string;
  coverImage: string;
  gallery: string[];
  youtubeVideoId?: string; // e.g. "dQw4w9WgXcQ" for YouTube embed
  impactStats?: Array<{ label: string; value: string; labelSuffix?: string }>;
  whoItServes: string[];
  whatWeBuiltHtml: string;
  whyItMattersHtml: string;
  humanImpactStory?: {
    title: string;
    paragraphs: string[];
    quote?: string;
  };
  relatedPosts?: Array<{
    title: string;
    slug: string;
    category: string;
    categoryColor: string;
    image: string;
  }>;
}

// ─── PROJECTS LIST MOCK ──────────────────────────────────────
const PROJECTS_DATA: Project[] = [
  {
    id: "azu-ogbunike-library",
    title: "Azu-Ogbunike Community Library",
    slug: "azu-ogbunike-community-library",
    status: "FINISHED",
    statusText: "Completed project",
    shortDescription: "A community library created to give children, students and community members greater access to books, learning resources and a place to read, research and study.",
    location: "Ogbunike, Anambra State",
    coverImage: ASSETS.library,
    gallery: [ASSETS.library, ASSETS.ig12, ASSETS.ig15],
    youtubeVideoId: undefined, // ABF TO PROVIDE
    impactStats: [
      { label: "Schools & Communities Reached", value: "[XX]", labelSuffix: "ABF TO PROVIDE VERIFIED FIGURES" },
      { label: "Estimated Users Reached", value: "[XX]", labelSuffix: "ABF TO PROVIDE VERIFIED FIGURES" },
      { label: "Books & Resources Available", value: "[XX]", labelSuffix: "ABF TO PROVIDE VERIFIED FIGURES" },
      { label: "Weekly/Monthly Usage Hours", value: "[XX]", labelSuffix: "ABF TO PROVIDE VERIFIED FIGURES" },
      { label: "WAEC/NECO Preparations", value: "[XX]", labelSuffix: "ABF TO PROVIDE VERIFIED FIGURES" },
      { label: "Adult Literacy Users", value: "[XX]", labelSuffix: "ABF TO PROVIDE VERIFIED FIGURES" },
    ],
    whoItServes: [
      "Students from multiple primary and secondary schools in the area",
      "Children looking for storybooks, educational reading and creative inspiration",
      "Adults in the local government area seeking reference and research materials",
      "Candidates preparing for school exams and national public examinations (WAEC/NECO)",
      "Community members completing homework, self-study, and literacy exercises"
    ],
    whatWeBuiltHtml: `
      <p>ABF commissioned and completed the Azu-Ogbunike Community Library to serve as a functional, clean, and inspiring hub for study and literacy. The project transformed a local space into a structured environment filled with books, homework desks, research tables, and reference materials.</p>
      <p>ABF ensures the library remains in excellent physical condition and is actively stocked with diverse reading books, textbooks, dictionaries, and novels. Field representatives verify that the space continues to be supervised, accessible, and functional for daily readers.</p>
    `,
    whyItMattersHtml: `
      <p>Access to structured learning resources is a critical bridge to opportunity. Many children grow up in homes without textbooks or leisure reading materials, and attend schools without functional libraries. A community library solves this by placing books directly in their hands and providing a quiet, safe space to study.</p>
      <p>By creating a community space, ABF helps children discover subjects, ideas, stories, and educational paths that they might otherwise never encounter. This access fosters self-learning, builds confidence, and supports academic performance in local schools.</p>
    `,
    humanImpactStory: {
      title: "One Child. One Library. A New Possibility.",
      paragraphs: [
        "Grace was a quiet junior secondary student who began visiting the Azu-Ogbunike Community Library shortly after it opened.",
        "Having a designated study desk and a library full of books made a quiet but profound difference. Step by step, Grace grew increasingly interested in reading, exploring shelves and spending hours diving into new stories.",
        "Through this consistent access, she began developing new vocabulary, encountering new ideas, and exploring writing. Inspired by the books she read, Grace eventually found the confidence to start writing her own creative stories.",
      ],
      quote: "Sometimes impact begins quietly."
    },
    relatedPosts: [
      {
        title: "One Year Later: The Library Is Still Growing",
        slug: "/latest/one-year-later",
        category: "PROJECT / IMPACT",
        categoryColor: "#2d6a2d",
        image: ASSETS.ig12,
      },
      {
        title: "We Need Story Books for Anambra Readers",
        slug: "/latest/we-need-story-books",
        category: "BOOK DRIVE",
        categoryColor: "#8dc63f",
        image: ASSETS.ig7,
      },
      {
        title: "Celebrating the People Behind ABF",
        slug: "/latest/celebrating-the-people",
        category: "COMMUNITY",
        categoryColor: "#f5a623",
        image: ASSETS.ig15,
      }
    ]
  }
];

// ─── HELPER FOR ROUTING ──────────────────────────────────────
function parseSlug(): string | null {
  const { pathname, search } = window.location;
  
  // 1. Check preview mode parameter e.g. ?project=azu-ogbunike-community-library
  const searchParams = new URLSearchParams(search);
  const searchSlug = searchParams.get("project");
  if (searchSlug) return searchSlug;

  // 2. Check standard path suffix e.g. /projects/azu-ogbunike-community-library
  const match = pathname.match(/\/projects\/([^/]+)$/);
  return match ? match[1] : null;
}

export default function ABFProjects() {
  const [donateMoneyOpen, setDonateMoneyOpen] = useState(false);
  const [donateBookOpen, setDonateBookOpen] = useState(false);
  
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PENDING" | "IN PROGRESS" | "FINISHED">("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sync state on mount and URL popstates (back/forward browser buttons)
  useEffect(() => {
    setActiveSlug(parseSlug());

    const handlePopState = () => {
      setActiveSlug(parseSlug());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Keyboard close listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDonateMoneyOpen(false);
        setDonateBookOpen(false);
        setLightboxIndex(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleViewProject = (slug: string) => {
    const isPreview = window.location.pathname.includes("/preview/");
    if (isPreview) {
      const newUrl = `${window.location.pathname}?project=${slug}`;
      window.history.pushState({}, "", newUrl);
      setActiveSlug(slug);
    } else {
      window.history.pushState({}, "", `${BASE}/projects/${slug}`);
      setActiveSlug(slug);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    const isPreview = window.location.pathname.includes("/preview/");
    if (isPreview) {
      window.history.pushState({}, "", window.location.pathname);
      setActiveSlug(null);
    } else {
      window.history.pushState({}, "", `${BASE}/projects`);
      setActiveSlug(null);
    }
    window.scrollTo({ top: 0 });
  };

  // Find the selected project
  const selectedProject = PROJECTS_DATA.find((p) => p.slug === activeSlug);

  useEffect(() => {
    if (selectedProject) {
      document.title = `${selectedProject.title} | Projects | Akhere Book Foundation`;
    } else {
      document.title = "Projects | Akhere Book Foundation";
    }
  }, [selectedProject]);

  // Filter project cards
  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeFilter === "ALL") return true;
    return p.status === activeFilter;
  });

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#fafaf7" }}>
      {/* Navigation Header */}
      <Header onDonate={() => setDonateMoneyOpen(true)} />

      {selectedProject ? (
        // ─── PROJECT DETAIL VIEW ────────────────────────────────────
        <div style={{ paddingTop: 72 }}>
          {/* Detail Hero */}
          <section style={{
            position: "relative",
            minHeight: "55vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}>
            {/* Background image */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${selectedProject.coverImage})`,
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
                {/* Back Link */}
                <button
                  onClick={handleBackToList}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    borderRadius: 9999,
                    color: "white",
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "2rem",
                    backdropFilter: "blur(8px)",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Back to Projects
                </button>

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
                  <CategoryBadge label={selectedProject.statusText} color="#8dc63f" />
                  <span style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}>📍 {selectedProject.location}</span>
                </div>

                <h1 style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1.1,
                  margin: "0 0 1rem",
                  letterSpacing: "-0.02em",
                }}>
                  {selectedProject.title}
                </h1>
                <p style={{ fontSize: "1.25rem", color: "rgba(255, 255, 255, 0.95)", lineHeight: 1.6, margin: 0, fontStyle: "italic", fontWeight: 500 }}>
                  "A place where books, curiosity and community come together."
                </p>
              </div>
            </div>
          </section>

          {/* Section: Why This Project Matters & What We Built */}
          <section style={{ padding: "6rem 1.5rem", background: "white" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "5rem" }}>
                
                {/* Column 1: Why It Matters */}
                <div>
                  <SectionLabel text="Why This Project Matters" />
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1a2218", marginBottom: "1.5rem" }}>
                    Unlocking children's growth
                  </h2>
                  <div
                    style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "1rem" }}
                    dangerouslySetInnerHTML={{ __html: selectedProject.whyItMattersHtml }}
                  />
                </div>

                {/* Column 2: What We Built */}
                <div>
                  <SectionLabel text="What We Accomplished" />
                  <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1a2218", marginBottom: "1.5rem" }}>
                    The community learning space
                  </h2>
                  <div
                    style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "1rem" }}
                    dangerouslySetInnerHTML={{ __html: selectedProject.whatWeBuiltHtml }}
                  />
                </div>

              </div>
            </div>
          </section>

          {/* Section: Who it serves */}
          <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                <SectionLabel text="Target Beneficiaries" />
                <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
                  Who Uses the Library?
                </h2>
                <p style={{ fontSize: "1rem", color: "#6a7a64", marginTop: "0.75rem" }}>
                  A public educational hub tailored to accommodate readers of all ages and backgrounds.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {selectedProject.whoItServes.map((profile, index) => (
                  <div key={index} style={{
                    background: "white",
                    padding: "1.5rem 2rem",
                    borderRadius: 16,
                    border: "1px solid #e8f0e8",
                    display: "flex",
                    gap: "1.25rem",
                    alignItems: "center"
                  }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#e8f5e8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.125rem",
                      flexShrink: 0
                    }}>
                      📖
                    </div>
                    <span style={{ fontSize: "1.0625rem", fontWeight: 600, color: "#2c3424", lineHeight: 1.5 }}>
                      {profile}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Human Impact Story */}
          {selectedProject.humanImpactStory && (
            <section style={{ padding: "6rem 1.5rem", background: "white" }}>
              <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "3rem",
                  alignItems: "center",
                  background: "#fdfdfa",
                  borderRadius: 24,
                  padding: "3.5rem 2.5rem",
                  border: "1px solid #f0f0ec",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.01)"
                }}>
                  {/* Text */}
                  <div>
                    <SectionLabel text="Human Impact Story" />
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1a2218", marginBottom: "1.5rem", lineHeight: 1.25 }}>
                      {selectedProject.humanImpactStory.title}
                    </h2>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {selectedProject.humanImpactStory.paragraphs.map((p, idx) => (
                        <p key={idx} style={{ fontSize: "1.0625rem", color: "#4a5a44", lineHeight: 1.75, margin: 0 }}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Card */}
                  <div style={{
                    background: "linear-gradient(135deg, #f0f7f0 0%, #e1e1d0 100%)",
                    borderRadius: 20,
                    padding: "2.5rem 2rem",
                    border: "1px solid #d4edd4",
                    textAlign: "center"
                  }}>
                    <span style={{ fontSize: "3rem" }}>✨</span>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2d6a2d", marginTop: "1rem", marginBottom: "0.5rem" }}>
                      Exploring creative worlds
                    </h3>
                    <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
                      Grace went from exploring library books to writing creative stories of her own.
                    </p>
                    <div style={{
                      display: "inline-block",
                      background: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: 12,
                      fontWeight: 700,
                      color: "#2c3424",
                      border: "1px dashed #2d6a2d",
                      fontSize: "1rem"
                    }}>
                      "{selectedProject.humanImpactStory.quote}"
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section: Media Gallery */}
          <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8", borderBottom: "1px solid #e8f0e8" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                <SectionLabel text="Project Gallery" />
                <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
                  Photos of the Work
                </h2>
                <p style={{ fontSize: "1rem", color: "#6a7a64", marginTop: "0.75rem" }}>
                  A look at the space, the library shelves, and the students engaging in learning.
                </p>
              </div>

              {/* Thumbnails grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.5rem",
                justifyContent: "center"
              }}>
                {selectedProject.gallery.map((imgUrl, index) => (
                  <div
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid #e8f0e8",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 10px 24px rgba(45,106,45,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.03)";
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery view ${index + 1}`}
                      style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
                    />
                  </div>
                ))}
              </div>

              {/* Lightbox Modal */}
              {lightboxIndex !== null && (
                <div
                  onClick={() => setLightboxIndex(null)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.9)",
                    zIndex: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem"
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                    style={{
                      position: "absolute",
                      top: "1.5rem",
                      right: "1.5rem",
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "white",
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon.X />
                  </button>

                  <div style={{ position: "relative", maxWidth: "90%", maxHeight: "80vh" }} onClick={(e) => e.stopPropagation()}>
                    <img
                      src={selectedProject.gallery[lightboxIndex]}
                      alt="Enlarged gallery view"
                      style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: 8 }}
                    />
                    
                    {/* Navigation Buttons */}
                    <button
                      onClick={() => setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : selectedProject.gallery.length - 1))}
                      style={{
                        position: "absolute",
                        left: "-3rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        color: "white",
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Icon.ChevronLeft />
                    </button>
                    
                    <button
                      onClick={() => setLightboxIndex((prev) => (prev! < selectedProject.gallery.length - 1 ? prev! + 1 : 0))}
                      style={{
                        position: "absolute",
                        right: "-3rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        color: "white",
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Icon.ChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section: Impact Statistics */}
          {selectedProject.impactStats && (
            <section style={{ padding: "6rem 1.5rem", background: "white" }}>
              <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                  <SectionLabel text="Optimised Performance" />
                  <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
                    Operational Statistics
                  </h2>
                  <p style={{ fontSize: "1.0625rem", color: "#6a7a64", marginTop: "0.75rem" }}>
                    Supporters deserve to see what their contributions help make possible.
                  </p>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1.5rem"
                }}>
                  {selectedProject.impactStats.map((stat, i) => (
                    <div key={i} style={{
                      background: "#fafaf7",
                      padding: "2rem 1.5rem",
                      borderRadius: 16,
                      border: "1px solid #f0f0ec",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#2d6a2d", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                        {stat.value}
                        <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "#c98f3b", background: "#fdf6ec", padding: "0.2rem 0.5rem", borderRadius: 4, textTransform: "uppercase" }}>Pending</span>
                      </div>
                      <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1a2218", margin: "0.75rem 0 0.25rem", lineHeight: 1.4 }}>
                        {stat.label}
                      </h4>
                      <p style={{ fontSize: "0.75rem", color: "#8a9a84", fontStyle: "italic", margin: 0 }}>
                        {stat.labelSuffix}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section: Related Latest Content Placeholder (Stage 2C Prep) */}
          {selectedProject.relatedPosts && (
            <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8" }}>
              <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                  <SectionLabel text="Related Stories" />
                  <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
                    More From This Project
                  </h2>
                  <p style={{ fontSize: "1rem", color: "#6a7a64", marginTop: "0.75rem" }}>
                    Read local updates and project stories growing from the Azu-Ogbunike library.
                  </p>
                </div>

                <div style={{
                  display: "flex",
                  gap: "1.5rem",
                  overflowX: "auto",
                  paddingBottom: "1.5rem",
                  scrollbarWidth: "thin"
                }}>
                  {selectedProject.relatedPosts.map((post, idx) => (
                    <div key={idx} style={{
                      background: "white",
                      borderRadius: 16,
                      border: "1px solid #e8f0e8",
                      width: 300,
                      flexShrink: 0,
                      overflow: "hidden",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                    }}>
                      <img src={post.image} alt={post.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                      <div style={{ padding: "1.25rem" }}>
                        <CategoryBadge label={post.category} color={post.categoryColor} />
                        <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#1a2218", margin: "0.75rem 0 0.5rem", lineHeight: 1.35 }}>
                          {post.title}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#2d6a2d", fontSize: "0.875rem", fontWeight: 700, marginTop: "1rem", cursor: "pointer" }}>
                          Read update <Icon.ArrowRight />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Project Support CTA */}
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
                  Want to Help Us<br /><span style={{ color: "#8dc63f" }}>Build More?</span>
                </h2>
                <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
                  Projects like this are made possible by people who choose to give what they can — whether that's books, money, time, skills or partnership.
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
                  <a href={window.location.pathname.includes("/preview/") ? `${BASE}/preview/ABFGetInvolved` : "/get-involved"} style={{ textDecoration: "none", width: "100%" }}>
                    <button className="abf-btn-secondary" style={{ fontSize: "0.875rem", width: "100%", justifyContent: "center" }}>
                      Get Involved
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        // ─── PROJECTS LISTING VIEW ─────────────────────────────────
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
                  <a href={import.meta.env.BASE_URL.replace(/\/$/, "") + "/preview/ABFHomepage"} style={{ color: "rgba(255, 255, 255, 0.6)", textDecoration: "none" }}>Home</a>
                  <span>/</span>
                  <span style={{ color: "#8dc63f", fontWeight: 600 }}>Projects</span>
                </div>

                <SectionLabel text="What We Are Doing" />

                <h1 style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1.1,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.02em",
                }}>
                  Projects That Turn Access<br />
                  <span style={{ color: "#8dc63f" }}>Into Opportunity.</span>
                </h1>

                <p style={{
                  fontSize: "1.125rem",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.7,
                  maxWidth: 620,
                  margin: 0
                }}>
                  From books and learning resources to community spaces built around education, ABF's projects are designed to help children and communities gain access to the tools they need to learn, explore and grow.
                </p>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          <section style={{ background: "white", borderBottom: "1px solid #e8f0e8" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.25rem 1.5rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                overflowX: "auto",
                scrollbarWidth: "none"
              }}>
                {(["ALL", "PENDING", "IN PROGRESS", "FINISHED"] as const).map((filter) => {
                  const active = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      style={{
                        background: active ? "#f0f7f0" : "transparent",
                        border: active ? "1px solid #dde8dd" : "1px solid transparent",
                        color: active ? "#2d6a2d" : "#6a7a64",
                        padding: "0.625rem 1.25rem",
                        borderRadius: 9999,
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s"
                      }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.color = "#2d6a2d";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.color = "#6a7a64";
                      }}
                    >
                      {filter === "ALL" && "All Projects"}
                      {filter === "PENDING" && "Preparing to Begin"}
                      {filter === "IN PROGRESS" && "Currently Underway"}
                      {filter === "FINISHED" && "Completed Work"}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Project List / Grid */}
          <section style={{ padding: "6rem 1.5rem" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              {filteredProjects.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 400px))",
                  gap: "2rem",
                  justifyContent: "center"
                }}>
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="abf-content-card"
                      onClick={() => handleViewProject(project.slug)}
                    >
                      {/* Image */}
                      <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                          <CategoryBadge label={project.statusText} color="#2d6a2d" />
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: "2rem" }}>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#8dc63f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                          📍 {project.location}
                        </div>
                        <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#1a2218", margin: "0 0 0.875rem", lineHeight: 1.25 }}>
                          {project.title}
                        </h3>
                        <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.65, margin: "0 0 1.5rem" }}>
                          {project.shortDescription}
                        </p>
                        
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          color: "#2d6a2d",
                          fontWeight: 700,
                          fontSize: "0.9375rem"
                        }}>
                          View Project <Icon.ArrowRight />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // ─── EMPTY STATES ──────────────────────────────────────────
                <div style={{
                  maxWidth: 540,
                  margin: "0 auto",
                  textAlign: "center",
                  padding: "4rem 2rem",
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid #e8f0e8",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.01)"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌱</div>
                  
                  {activeFilter === "PENDING" && (
                    <>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>
                        Preparing to Bring to Life
                      </h3>
                      <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.6, margin: 0 }}>
                        Projects we are preparing to bring to life will appear here. Follow along as we outline new hubs and book collection plans.
                      </p>
                    </>
                  )}

                  {activeFilter === "IN PROGRESS" && (
                    <>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>
                        Currently Underway
                      </h3>
                      <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.6, margin: 0 }}>
                        Follow along as these projects take shape. Active builds, logistics, and book donations will be updated here.
                      </p>
                    </>
                  )}

                  {activeFilter === "FINISHED" && (
                    <>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>
                        Completed Work
                      </h3>
                      <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.6, margin: 0 }}>
                        Explore the work ABF has completed and the stories that have grown from it.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
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
