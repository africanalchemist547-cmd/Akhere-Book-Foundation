/**
 * ABF Homepage â€” Akhere Book Foundation
 * Stage 1: Complete homepage with all sections and modals
 *
 * Asset paths reference /assets/* (served from public/assets/)
 * Real ABF contact info extracted from supplied brand materials.
 */

import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
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
  TEAM_MEMBERS
} from "./_shared";

// â”€â”€â”€ TYPES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ STATIC DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    excerpt: "Schools should be spaces of learning, curiosity and hope â€” not fear. ABF stands in solidarity with every child and teacher affected.",
    image: ASSETS.schoolAttacks1,
    slug: "/latest/when-schools-are-attacked",
  },
  {
    id: 4,
    category: "BOOK DRIVE",
    categoryColor: "#8dc63f",
    title: "We Need Story Books",
    excerpt: "The Azu-Ogbunike Library is growing â€” and so is the appetite for books. Children who once hadn't seen a library are now avid readers.",
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
    excerpt: "Grace was a quiet junior secondary student â€” until she found the library. Page by page, she discovered new worlds, new words, and the courage to write her own stories.",
    image: ASSETS.ig13,
    slug: "/latest/a-child-a-book-a-new-possibility",
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
    description: "School partnership â€” Ogbunike",
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

// â”€â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
              ðŸ’š Donate
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

// â”€â”€â”€ TRUST BADGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TrustBadges() {
  const badges = [
    {
      icon: "ðŸ“š",
      title: "Books & Learning",
      desc: "Helping children gain access to reading and educational resources that open new worlds.",
    },
    {
      icon: "ðŸ˜ï¸",
      title: "Community",
      desc: "Creating spaces where children and communities can learn and grow together.",
    },
    {
      icon: "ðŸŽ¯",
      title: "Real Impact",
      desc: "Focused on turning access to resources into meaningful, lasting learning opportunities.",
    },
    {
      icon: "ðŸ’¡",
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

// â”€â”€â”€ YOUR SUPPORT GOES FAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SupportSection() {
  const stats = [
    { label: "Schools / Communities Reached", value: "[XX+]" },
    { label: "Books Made Available", value: "[XX+]" },
    { label: "Children & Community Members Reached", value: "[XX+]" },
    { label: "Library Users", value: "[XX+]" },
  ];

  return (
    <section id="projects" style={{ padding: "6rem 1.5rem", background: "white" }}>
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
            <a href={window.location.pathname.includes("/preview/") ? `${BASE}/preview/ABFProjects` : "/projects"} style={{ textDecoration: "none" }}>
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

// â”€â”€â”€ FUTURE SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ LATEST FROM ABF CAROUSEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function LatestCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const isPreview = window.location.pathname.includes("/preview/");
  const getPostUrl = (slug: string) => {
    const postSlug = slug.replace(/^\/latest\//, "");
    if (postSlug === "azu-ogbunike-community-library") {
      return isPreview ? `${BASE}/preview/ABFProjects?project=${postSlug}` : `/projects/${postSlug}`;
    }
    return isPreview ? `${BASE}/preview/ABFLatest?post=${postSlug}` : `/latest-from-abf/${postSlug}`;
  };

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
    <section id="latest" style={{ padding: "6rem 0", background: "#f8faf6" }}>
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
            <a href={isPreview ? `${BASE}/preview/ABFLatest` : "/latest"} style={{ textDecoration: "none" }}>
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
              href={getPostUrl(card.slug)}
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

// â”€â”€â”€ MEET THE TEAM TEASER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TeamTeaser() {
  return (
    <section id="team" style={{ padding: "6rem 1.5rem", background: "white" }}>
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
          <a href={isPreview ? `${BASE}/preview/ABFTeam` : "/team"} style={{ textDecoration: "none" }}>
            <button className="abf-btn-primary">
              Meet the Team <Icon.ArrowRight />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ PARTNERS SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ FINAL CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FinalCTA({ onDonate, onDonateBook }: { onDonate: () => void; onDonateBook: () => void }) {
  const actions = [
    {
      emoji: "ðŸ“š",
      title: "Donate a Book",
      desc: "Give a child another story to discover.",
      cta: "Donate a Book",
      onClick: onDonateBook,
      style: "book",
    },
    {
      emoji: "ðŸ’š",
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
      href: window.location.pathname.includes("/preview/") ? `${BASE}/preview/ABFGetInvolved` : "/get-involved",
      style: "volunteer",
    },
  ];

  return (
    <section id="get-involved" style={{
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

// â”€â”€â”€ SOCIAL SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ MAIN PAGE ASSEMBLY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ABFHomepage() {
  const [donateMoneyOpen, setDonateMoneyOpen] = useState(false);
  const [donateBookOpen, setDonateBookOpen] = useState(false);

  useEffect(() => {
    document.title = "Akhere Book Foundation | Building What Comes Next";
  }, []);

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
