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
import { usePublicPosts, DbPost } from "../../hooks/useCmsData";

// ─── TYPES & INTERFACES ──────────────────────────────────────
interface Post {
  id: string;
  title: string;
  slug: string;
  category: "PROJECTS" | "EVENTS" | "NEWS & IMPACT";
  excerpt: string;
  contentHtml: string;
  coverImage: string;
  additionalImages?: string[];
  youtubeVideoId?: string;
  date: string;
  projectId?: string;
  projectTitle?: string;
  author: string;
  featured: boolean;
}

// ─── ROUTING HELPER ──────────────────────────────────────────
function parsePostSlug(): string | null {
  const { pathname, search } = window.location;
  
  // Check query parameter fallback e.g. ?post=a-child-a-book-a-new-possibility
  const searchParams = new URLSearchParams(search);
  const searchSlug = searchParams.get("post");
  if (searchSlug) return searchSlug;

  // Check standard path suffix e.g. /latest-from-abf/slug or /latest/slug
  const match = pathname.match(/\/(?:latest-from-abf|latest)\/([^/]+)$/);
  return match ? match[1] : null;
}

export default function ABFLatest() {
  const [donateMoneyOpen, setDonateMoneyOpen] = useState(false);
  const [donateBookOpen, setDonateBookOpen] = useState(false);

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "PROJECTS" | "EVENTS" | "NEWS & IMPACT">("ALL");

  // Query live Supabase CMS posts (published = true enforced)
  const { data: dbPosts, loading: postsLoading } = usePublicPosts();

  const mappedPosts: Post[] = dbPosts.map((p) => {
    let cat: "PROJECTS" | "EVENTS" | "NEWS & IMPACT" = "NEWS & IMPACT";
    if (p.category === "projects") cat = "PROJECTS";
    if (p.category === "events") cat = "EVENTS";

    let dateStr = "";
    try {
      const d = new Date(p.published_at);
      dateStr = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      dateStr = p.published_at || "";
    }

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: cat,
      excerpt: p.excerpt,
      contentHtml: p.content,
      coverImage: p.cover_image || ASSETS.ig13,
      date: dateStr,
      author: p.author || "Akhere Book Foundation",
      featured: p.featured,
    };
  });

  // Sync state on load and popstates
  useEffect(() => {
    setActiveSlug(parsePostSlug());

    const handlePopState = () => {
      setActiveSlug(parsePostSlug());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Keyboard escape
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

  const handleViewPost = (slug: string) => {
    window.history.pushState({}, "", `/latest-from-abf/${slug}`);
    setActiveSlug(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    window.history.pushState({}, "", "/latest-from-abf");
    setActiveSlug(null);
    window.scrollTo({ top: 0 });
  };

  const handleViewProject = (projSlug: string) => {
    window.history.pushState({}, "", `/projects/${projSlug}`);
    window.location.href = `/projects/${projSlug}`;
  };

  // Resolve current active post
  const activePost = mappedPosts.find((p) => p.slug === activeSlug);

  useEffect(() => {
    if (activePost) {
      document.title = `${activePost.title} | Latest from ABF | Akhere Book Foundation`;
    } else {
      document.title = "Latest from ABF | Akhere Book Foundation";
    }
  }, [activePost]);

  // Filter posts list
  const filteredPosts = mappedPosts.filter((p) => {
    // Exclude the featured post from the list view so it's not duplicated on category: ALL
    if (activeCategory === "ALL") return !p.featured;
    return p.category === activeCategory;
  });

  // Featured post
  const featuredPost = mappedPosts.find((p) => p.featured);

  // Related posts (same category or same project, limit 3, exclude active post)
  const relatedPosts = mappedPosts.filter(
    (p) => p.slug !== activeSlug && (p.category === activePost?.category || p.projectId === activePost?.projectId)
  ).slice(0, 3);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#fafaf7" }}>
      {/* Navigation Header */}
      <Header onDonate={() => setDonateMoneyOpen(true)} />

      {activePost ? (
        // ─── POST DETAIL VIEW ────────────────────────────────────────
        <div style={{ paddingTop: 72 }}>
          
          {/* Post Header Banner */}
          <section style={{ padding: "4rem 1.5rem 2rem", background: "white" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              
              {/* Back to List */}
              <button
                onClick={handleBackToList}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2d6a2d",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "2rem",
                  padding: 0
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                Back to Latest Updates
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <CategoryBadge label={activePost.category} color={activePost.category === "PROJECTS" ? "#2d6a2d" : "#8dc63f"} />
                <span style={{ fontSize: "0.875rem", color: "#6a7a64", fontWeight: 500 }}>{activePost.date}</span>
                <span style={{ fontSize: "0.875rem", color: "#6a7a64", fontWeight: 500 }}>• By {activePost.author}</span>
              </div>

              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 900,
                color: "#1a2218",
                lineHeight: 1.15,
                margin: "0 0 1.5rem",
                letterSpacing: "-0.02em"
              }}>
                {activePost.title}
              </h1>
            </div>
          </section>

          {/* Post Cover Image */}
          <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
            <div style={{
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid #e8f0e8",
              boxShadow: "0 12px 36px rgba(0,0,0,0.03)"
            }}>
              <img
                src={activePost.coverImage}
                alt={activePost.title}
                style={{ width: "100%", maxHeight: 520, objectFit: "cover", display: "block" }}
              />
            </div>
          </section>

          {/* Editorial Content Column */}
          <section style={{ padding: "0 1.5rem 6rem", background: "white" }}>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              
              {/* Main Body HTML */}
              <div
                className="abf-editorial-body"
                style={{
                  fontSize: "1.125rem",
                  color: "#2c3424",
                  lineHeight: 1.85,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem"
                }}
                dangerouslySetInnerHTML={{ __html: activePost.contentHtml }}
              />

              {/* pullquote styles placeholder inside component */}
              <style>{`
                .abf-editorial-body blockquote {
                  font-size: 1.375rem;
                  font-weight: 800;
                  color: #2d6a2d;
                  border-left: 4px solid #8dc63f;
                  padding-left: 1.5rem;
                  margin: 2rem 0;
                  line-height: 1.6;
                  font-style: italic;
                }
              `}</style>

              {/* Reusable YouTube Embed Container (hidden since no youtubeVideoId is provided) */}
              {activePost.youtubeVideoId && (
                <div style={{ marginTop: "2.5rem", borderRadius: 16, overflow: "hidden", border: "1px solid #e8f0e8" }}>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${activePost.youtubeVideoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              )}

              {/* Related Project Connection */}
              {activePost.projectId && activePost.projectTitle && (
                <div style={{
                  marginTop: "4rem",
                  background: "#fafaf7",
                  borderRadius: 20,
                  padding: "2rem",
                  border: "1px solid #e8f0e8",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem"
                }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#8dc63f", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.375rem" }}>
                      Associated Project
                    </span>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
                      {activePost.projectTitle}
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "#6a7a64", margin: "0.5rem 0 0", lineHeight: 1.5 }}>
                      This update is part of Akhere Book Foundation's active learning programs and development in Ogbunike.
                    </p>
                  </div>
                  <div>
                    <button
                      className="abf-btn-primary"
                      onClick={() => handleViewProject(activePost.projectId!)}
                      style={{ fontSize: "0.875rem", padding: "0.625rem 1.25rem" }}
                    >
                      View Project Details <Icon.ArrowRight />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Related Posts Grid (More from ABF) */}
          {relatedPosts.length > 0 && (
            <section style={{ padding: "6rem 1.5rem", background: "#f8faf6", borderTop: "1px solid #e8f0e8", borderBottom: "1px solid #e8f0e8" }}>
              <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a2218", marginBottom: "2.5rem", textAlign: "center" }}>
                  More From ABF
                </h3>
                
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "1.5rem",
                  justifyContent: "center"
                }}>
                  {relatedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="abf-content-card"
                      onClick={() => handleViewPost(post.slug)}
                    >
                      <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                      <div style={{ padding: "1.5rem" }}>
                        <CategoryBadge label={post.category} color={post.category === "PROJECTS" ? "#2d6a2d" : "#8dc63f"} />
                        <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#1a2218", margin: "0.75rem 0 0.5rem", lineHeight: 1.35 }}>
                          {post.title}
                        </h4>
                        <span style={{ fontSize: "0.8125rem", color: "#8a9a84" }}>{post.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bottom Support CTA */}
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
                  Help Us Create<br /><span style={{ color: "#8dc63f" }}>More Stories Like These.</span>
                </h2>
                <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
                  Your support helps ABF turn resources into opportunities for children and communities.
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
                  <a href="/get-involved" style={{ textDecoration: "none", width: "100%" }}>
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
        // ─── CONTENT HUB LIST VIEW ──────────────────────────────────
        <div style={{ paddingTop: 72 }}>
          {/* Hero */}
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
                  <span style={{ color: "#8dc63f", fontWeight: 600 }}>Latest from ABF</span>
                </div>

                <SectionLabel text="Updates & Stories" />

                <h1 style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1.1,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.02em",
                }}>
                  Latest from ABF
                </h1>

                <p style={{
                  fontSize: "1.125rem",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.7,
                  maxWidth: 620,
                  margin: 0
                }}>
                  Stories, projects, updates and moments from the work we're building with children and communities.
                </p>
              </div>
            </div>
          </section>

          {/* Sticky Category Bar */}
          <section style={{
            position: "sticky",
            top: 72,
            zIndex: 50,
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e8f0e8",
            boxShadow: "0 4px 16px rgba(45,106,45,0.03)"
          }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1rem 1.5rem" }}>
              <div
                className="abf-filter-bar"
                style={{ display: "flex", gap: "0.5rem", overflowX: "auto", scrollbarWidth: "none" }}
              >
                {(["ALL", "PROJECTS", "EVENTS", "NEWS & IMPACT"] as const).map((cat) => {
                  const active = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="abf-filter-btn"
                      style={{
                        background: active ? "#f0f7f0" : "transparent",
                        border: active ? "1px solid #dde8dd" : "1px solid transparent",
                        color: active ? "#2d6a2d" : "#6a7a64",
                        padding: "0.5rem 1.25rem",
                        borderRadius: 9999,
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s"
                      }}
                    >
                      {cat === "ALL" ? "All Updates" : cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Content Feed */}
          <section style={{ padding: "6rem 1.5rem" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              
              {/* Render Featured Story Block (Only on ALL category) */}
              {activeCategory === "ALL" && featuredPost && (
                <div
                  className="abf-featured-banner"
                  onClick={() => handleViewPost(featuredPost.slug)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "2.5rem",
                    alignItems: "center",
                    background: "white",
                    borderRadius: 24,
                    overflow: "hidden",
                    border: "1px solid #e8f0e8",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    marginBottom: "4rem",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.005)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(45,106,45,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.02)";
                  }}
                >
                  {/* Image */}
                  <div style={{ height: "100%", minHeight: 320, overflow: "hidden" }}>
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 320 }}
                    />
                  </div>
                  {/* Text content */}
                  <div style={{ padding: "3.5rem 2.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 800, color: "white", background: "#d0021b", padding: "0.25rem 0.5rem", borderRadius: 4, textTransform: "uppercase" }}>Featured</span>
                      <CategoryBadge label={featuredPost.category} color="#8dc63f" />
                    </div>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 900, color: "#1a2218", marginBottom: "1rem", lineHeight: 1.2 }}>
                      {featuredPost.title}
                    </h2>
                    <p style={{ fontSize: "1.0625rem", color: "#6a7a64", lineHeight: 1.7, marginBottom: "2rem" }}>
                      {featuredPost.excerpt}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#2d6a2d", fontWeight: 700, fontSize: "0.9375rem" }}>
                      Read Story <Icon.ArrowRight />
                    </div>
                  </div>
                </div>
              )}

              {/* Grid Feed */}
              {filteredPosts.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 360px))",
                  gap: "2.5rem 2rem",
                  justifyContent: "center"
                }}>
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="abf-content-card"
                      onClick={() => handleViewPost(post.slug)}
                    >
                      <div style={{ height: 200, overflow: "hidden" }}>
                        <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ padding: "1.75rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
                          <CategoryBadge label={post.category} color={post.category === "PROJECTS" ? "#2d6a2d" : "#8dc63f"} />
                          <span style={{ fontSize: "0.8125rem", color: "#8a9a84" }}>{post.date}</span>
                        </div>
                        <h3 style={{ fontSize: "1.1875rem", fontWeight: 800, color: "#1a2218", margin: "0 0 0.75rem", lineHeight: 1.35 }}>
                          {post.title}
                        </h3>
                        <p style={{ fontSize: "0.875rem", color: "#6a7a64", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
                          {post.excerpt}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#2d6a2d", fontWeight: 700, fontSize: "0.875rem" }}>
                          Read More <Icon.ArrowRight />
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

                  {activeCategory === "ALL" && (
                    <>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>
                        {postsLoading ? "Loading stories..." : "No stories published yet"}
                      </h3>
                      <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.6, margin: 0 }}>
                        {postsLoading
                          ? "Please wait while we load foundation updates."
                          : "Stories published through the Admin CMS will appear here."}
                      </p>
                    </>
                  )}
                  
                  {activeCategory === "PROJECTS" && (
                    <>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>
                        Project Stories
                      </h3>
                      <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.6, margin: 0 }}>
                        Project stories and updates will appear here.
                      </p>
                    </>
                  )}

                  {activeCategory === "EVENTS" && (
                    <>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>
                        Community Events
                      </h3>
                      <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.6, margin: 0 }}>
                        Events and activities from the ABF community will appear here.
                      </p>
                    </>
                  )}

                  {activeCategory === "NEWS & IMPACT" && (
                    <>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", marginBottom: "0.5rem" }}>
                        Impact & Advocacy
                      </h3>
                      <p style={{ fontSize: "0.9375rem", color: "#6a7a64", lineHeight: 1.6, margin: 0 }}>
                        Stories and updates from ABF will appear here.
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
