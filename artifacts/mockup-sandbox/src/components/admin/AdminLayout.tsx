import React, { useState } from "react";
import { useAdminAuth } from "./AdminAuthContext";
import AdminLogin from "./AdminLogin";
import AdminOverview from "./AdminOverview";
import VolunteersView from "./submissions/VolunteersView";
import BookDonationsView from "./submissions/BookDonationsView";
import MoneyDonationsView from "./submissions/MoneyDonationsView";
import PartnershipsView from "./submissions/PartnershipsView";
import ProjectsManager from "./cms/ProjectsManager";
import PostsManager from "./cms/PostsManager";
import TeamManager from "./cms/TeamManager";
import PartnersManager from "./cms/PartnersManager";
import StatisticsManager from "./cms/StatisticsManager";
import { ASSETS } from "../mockups/_shared";

export default function AdminLayout({ initialTab }: { initialTab?: string }) {
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<string>(initialTab || "overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf7" }}>
        <div style={{ textAlign: "center" }}>
          <img src={ASSETS.logoGreen} alt="" style={{ width: 48, height: 48, margin: "0 auto 1rem" }} />
          <div style={{ fontSize: "0.9375rem", color: "#4a5a44", fontWeight: 600 }}>
            Verifying administrative access...
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin || !user) {
    return <AdminLogin onLoginSuccess={() => setActiveTab("overview")} />;
  }

  const navItems = [
    { section: "GENERAL" },
    { id: "overview", label: "Overview", icon: "📊" },
    { section: "SUBMISSIONS & INQUIRIES" },
    { id: "volunteers", label: "Volunteer Applications", icon: "👥" },
    { id: "book-donations", label: "Book Donations", icon: "📚" },
    { id: "money-donations", label: "Money Donations", icon: "💚" },
    { id: "partnerships", label: "Partnership Proposals", icon: "🤝" },
    { section: "CONTENT MANAGEMENT (CMS)" },
    { id: "cms-projects", label: "Projects Manager", icon: "🏗️" },
    { id: "cms-posts", label: "Blog & Stories", icon: "📰" },
    { id: "cms-team", label: "Team Members", icon: "🧑‍🤝‍🧑" },
    { id: "cms-partners", label: "Official Partners", icon: "🏢" },
    { id: "cms-statistics", label: "Impact Statistics", icon: "📈" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faf6", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Sidebar Desktop */}
      <aside
        style={{
          width: 280,
          background: "#142414",
          color: "white",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          borderRight: "1px solid rgba(141,198,63,0.1)",
        }}
        className="admin-desktop-sidebar"
      >
        {/* Sidebar Brand */}
        <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={ASSETS.logoGreen} alt="ABF Logo" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "white", lineHeight: 1.2 }}>Akhere Book</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8dc63f", lineHeight: 1.2 }}>Admin Dashboard</div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}>
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <div
                  key={idx}
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.08em",
                    padding: "1rem 0.75rem 0.375rem",
                  }}
                >
                  {item.section}
                </div>
              );
            }

            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id!);
                  setMobileNavOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.875rem",
                  borderRadius: 10,
                  border: "none",
                  background: active ? "rgba(141,198,63,0.18)" : "transparent",
                  color: active ? "#8dc63f" : "rgba(255,255,255,0.8)",
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  marginBottom: "0.2rem",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div style={{ padding: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)" }}>
          <div style={{ fontSize: "0.6875rem", color: "#8dc63f", fontWeight: 700, textTransform: "uppercase" }}>
            AUTHENTICATED ADMIN
          </div>
          <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "white", marginTop: "0.15rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.email}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.875rem" }}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                textAlign: "center",
                background: "rgba(255,255,255,0.08)",
                padding: "0.4rem",
                borderRadius: 6,
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.75rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Public Site ↗
            </a>
            <button
              onClick={signOut}
              style={{
                flex: 1,
                background: "#fef2f2",
                border: "none",
                padding: "0.4rem",
                borderRadius: 6,
                color: "#b91c1c",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Navbar */}
        <header
          style={{
            height: 64,
            background: "white",
            borderBottom: "1px solid #e8f0e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="mobile-admin-menu-btn"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              color: "#2d6a2d",
              cursor: "pointer",
              display: "none",
              padding: "0.25rem",
            }}
          >
            ☰
          </button>

          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d6a2d", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Akhere Book Foundation Admin
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.8125rem",
                color: "#2d6a2d",
                textDecoration: "none",
                fontWeight: 700,
                background: "#f0f7f0",
                padding: "0.35rem 0.75rem",
                borderRadius: 8,
                border: "1px solid #d4edd4",
              }}
            >
              🌐 Visit Public Site ↗
            </a>
            <button
              onClick={signOut}
              style={{
                background: "#fafaf7",
                border: "1px solid #e0e8e0",
                color: "#6a7a64",
                padding: "0.35rem 0.75rem",
                borderRadius: 8,
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: 1400, width: "100%", margin: "0 auto" }}>
          {activeTab === "overview" && <AdminOverview onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === "volunteers" && <VolunteersView />}
          {activeTab === "book-donations" && <BookDonationsView />}
          {activeTab === "money-donations" && <MoneyDonationsView />}
          {activeTab === "partnerships" && <PartnershipsView />}
          {activeTab === "cms-projects" && <ProjectsManager />}
          {activeTab === "cms-posts" && <PostsManager />}
          {activeTab === "cms-team" && <TeamManager />}
          {activeTab === "cms-partners" && <PartnersManager />}
          {activeTab === "cms-statistics" && <StatisticsManager />}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex" }}
          onClick={() => setMobileNavOpen(false)}
        >
          <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              width: 280,
              background: "#142414",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 0 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <img src={ASSETS.logoGreen} alt="ABF Logo" style={{ width: 32, height: 32, objectFit: "contain" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "white" }}>ABF Admin</span>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                style={{ background: "none", border: "none", color: "white", fontSize: "1.25rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}>
              {navItems.map((item, idx) => {
                if (item.section) {
                  return (
                    <div
                      key={idx}
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 800,
                        color: "rgba(255,255,255,0.4)",
                        letterSpacing: "0.08em",
                        padding: "1rem 0.75rem 0.375rem",
                      }}
                    >
                      {item.section}
                    </div>
                  );
                }
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id!);
                      setMobileNavOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 0.875rem",
                      borderRadius: 10,
                      border: "none",
                      background: active ? "rgba(141,198,63,0.18)" : "transparent",
                      color: active ? "#8dc63f" : "rgba(255,255,255,0.8)",
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      textAlign: "left",
                      marginBottom: "0.2rem",
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
