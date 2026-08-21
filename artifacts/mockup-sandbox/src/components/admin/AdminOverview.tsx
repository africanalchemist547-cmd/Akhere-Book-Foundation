import React, { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { StatusBadge, formatDate } from "./_adminShared";
import SubmissionDetailModal from "./submissions/SubmissionDetailModal";

interface CountsState {
  volunteersTotal: number;
  volunteersNew: number;
  bookDonationsTotal: number;
  bookDonationsNew: number;
  moneyDonationsTotal: number;
  moneyDonationsNew: number;
  moneyTotalPledged: number;
  partnershipsTotal: number;
  partnershipsNew: number;
  projectsTotal: number;
  postsTotal: number;
  teamTotal: number;
  partnersTotal: number;
  statsTotal: number;
}

export default function AdminOverview({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [counts, setCounts] = useState<CountsState>({
    volunteersTotal: 0,
    volunteersNew: 0,
    bookDonationsTotal: 0,
    bookDonationsNew: 0,
    moneyDonationsTotal: 0,
    moneyDonationsNew: 0,
    moneyTotalPledged: 0,
    partnershipsTotal: 0,
    partnershipsNew: 0,
    projectsTotal: 0,
    postsTotal: 0,
    teamTotal: 0,
    partnersTotal: 0,
    statsTotal: 0,
  });

  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{ type: any; data: any } | null>(null);

  const fetchOverviewData = useCallback(async () => {
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      const [
        { data: volData },
        { data: donData },
        { data: partData },
        { data: projData, count: projCount },
        { data: postData, count: postCount },
        { data: teamData, count: teamCount },
        { data: partnerData, count: partnerCount },
        { data: statData, count: statCount },
      ] = await Promise.all([
        supabase.from("volunteer_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("donation_inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("partnership_inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("projects").select("id", { count: "exact" }),
        supabase.from("posts").select("id", { count: "exact" }),
        supabase.from("team_members").select("id", { count: "exact" }),
        supabase.from("partners").select("id", { count: "exact" }),
        supabase.from("library_statistics").select("id", { count: "exact" }),
      ]);

      const volunteers = volData || [];
      const donations = donData || [];
      const partnerships = partData || [];

      const bookDonations = donations.filter((d) => d.donation_type === "books");
      const moneyDonations = donations.filter((d) => d.donation_type === "money");

      const moneyPledged = moneyDonations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

      setCounts({
        volunteersTotal: volunteers.length,
        volunteersNew: volunteers.filter((v) => v.status === "new").length,
        bookDonationsTotal: bookDonations.length,
        bookDonationsNew: bookDonations.filter((b) => b.status === "new").length,
        moneyDonationsTotal: moneyDonations.length,
        moneyDonationsNew: moneyDonations.filter((m) => m.status === "new").length,
        moneyTotalPledged: moneyPledged,
        partnershipsTotal: partnerships.length,
        partnershipsNew: partnerships.filter((p) => p.status === "new").length,
        projectsTotal: projCount ?? projData?.length ?? 0,
        postsTotal: postCount ?? postData?.length ?? 0,
        teamTotal: teamCount ?? teamData?.length ?? 0,
        partnersTotal: partnerCount ?? partnerData?.length ?? 0,
        statsTotal: statCount ?? statData?.length ?? 0,
      });

      // Combine and sort recent 10 submissions
      const combined = [
        ...volunteers.map((v) => ({ ...v, _type: "volunteer", _label: "Volunteer Application" })),
        ...bookDonations.map((b) => ({ ...b, _type: "book_donation", _label: "Book Donation" })),
        ...moneyDonations.map((m) => ({ ...m, _type: "money_donation", _label: "Money Donation" })),
        ...partnerships.map((p) => ({ ...p, _type: "partnership", _label: "Partnership Proposal" })),
      ];

      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentSubmissions(combined.slice(0, 10));
    } catch (err) {
      console.error("Failed to load overview data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  const handleNav = (tab: string) => {
    if (onNavigate) onNavigate(tab);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8dc63f", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            ADMIN COMMAND CENTER
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218", margin: "0.25rem 0 0" }}>
            Foundation Dashboard
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.25rem" }}>
            Real-time overview of visitor engagement, donation pledges, and live CMS content
          </p>
        </div>
        <button
          onClick={fetchOverviewData}
          style={{
            background: "#f0f7f0",
            border: "1px solid #d4edd4",
            borderRadius: 8,
            padding: "0.5rem 1rem",
            fontSize: "0.8125rem",
            fontWeight: 700,
            color: "#2d6a2d",
            cursor: "pointer",
          }}
        >
          🔄 Refresh Metrics
        </button>
      </div>

      {/* Primary Inquiries & Submissions KPI Cards */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", marginBottom: "1rem" }}>
          📬 Visitor Submissions & Inquiries
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {/* Volunteers */}
          <div
            onClick={() => handleNav("volunteers")}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: 18,
              border: "1px solid #e8f0e8",
              boxShadow: "0 2px 12px rgba(45,106,45,0.04)",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>👥</span>
              {counts.volunteersNew > 0 && (
                <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.75rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: 9999 }}>
                  {counts.volunteersNew} NEW
                </span>
              )}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218" }}>
              {counts.volunteersTotal}
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d6a2d", marginTop: "0.25rem" }}>
              Volunteer Applications
            </div>
            <div style={{ fontSize: "0.75rem", color: "#8a9a84", marginTop: "0.25rem" }}>
              Click to view all applicants →
            </div>
          </div>

          {/* Book Donations */}
          <div
            onClick={() => handleNav("book-donations")}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: 18,
              border: "1px solid #e8f0e8",
              boxShadow: "0 2px 12px rgba(45,106,45,0.04)",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>📚</span>
              {counts.bookDonationsNew > 0 && (
                <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.75rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: 9999 }}>
                  {counts.bookDonationsNew} NEW
                </span>
              )}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218" }}>
              {counts.bookDonationsTotal}
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d6a2d", marginTop: "0.25rem" }}>
              Book Donation Offers
            </div>
            <div style={{ fontSize: "0.75rem", color: "#8a9a84", marginTop: "0.25rem" }}>
              Click to view categories & cities →
            </div>
          </div>

          {/* Money Donations */}
          <div
            onClick={() => handleNav("money-donations")}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: 18,
              border: "1px solid #e8f0e8",
              boxShadow: "0 2px 12px rgba(45,106,45,0.04)",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>💚</span>
              <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.75rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: 9999 }}>
                ₦{counts.moneyTotalPledged.toLocaleString()}
              </span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218" }}>
              {counts.moneyDonationsTotal}
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d6a2d", marginTop: "0.25rem" }}>
              Financial Donation Pledges
            </div>
            <div style={{ fontSize: "0.75rem", color: "#8a9a84", marginTop: "0.25rem" }}>
              Click to view contributors →
            </div>
          </div>

          {/* Partnerships */}
          <div
            onClick={() => handleNav("partnerships")}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: 18,
              border: "1px solid #e8f0e8",
              boxShadow: "0 2px 12px rgba(45,106,45,0.04)",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🤝</span>
              {counts.partnershipsNew > 0 && (
                <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.75rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: 9999 }}>
                  {counts.partnershipsNew} NEW
                </span>
              )}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1a2218" }}>
              {counts.partnershipsTotal}
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d6a2d", marginTop: "0.25rem" }}>
              Partnership Proposals
            </div>
            <div style={{ fontSize: "0.75rem", color: "#8a9a84", marginTop: "0.25rem" }}>
              Click to view proposals →
            </div>
          </div>
        </div>
      </div>

      {/* CMS Content Inventory Bar */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", marginBottom: "1rem" }}>
          📝 Live Website Content (CMS)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          <div
            onClick={() => handleNav("cms-projects")}
            style={{ background: "#fdfdfa", border: "1px solid #eef3ee", padding: "1.25rem", borderRadius: 14, cursor: "pointer" }}
          >
            <div style={{ fontSize: "1.25rem", marginBottom: "0.375rem" }}>🏗️</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2218" }}>{counts.projectsTotal}</div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#4a5a44" }}>Projects Published</div>
          </div>

          <div
            onClick={() => handleNav("cms-posts")}
            style={{ background: "#fdfdfa", border: "1px solid #eef3ee", padding: "1.25rem", borderRadius: 14, cursor: "pointer" }}
          >
            <div style={{ fontSize: "1.25rem", marginBottom: "0.375rem" }}>📰</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2218" }}>{counts.postsTotal}</div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#4a5a44" }}>Stories & Posts</div>
          </div>

          <div
            onClick={() => handleNav("cms-team")}
            style={{ background: "#fdfdfa", border: "1px solid #eef3ee", padding: "1.25rem", borderRadius: 14, cursor: "pointer" }}
          >
            <div style={{ fontSize: "1.25rem", marginBottom: "0.375rem" }}>🧑‍🤝‍🧑</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2218" }}>{counts.teamTotal}</div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#4a5a44" }}>Team Profiles</div>
          </div>

          <div
            onClick={() => handleNav("cms-partners")}
            style={{ background: "#fdfdfa", border: "1px solid #eef3ee", padding: "1.25rem", borderRadius: 14, cursor: "pointer" }}
          >
            <div style={{ fontSize: "1.25rem", marginBottom: "0.375rem" }}>🏢</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2218" }}>{counts.partnersTotal}</div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#4a5a44" }}>Official Partners</div>
          </div>

          <div
            onClick={() => handleNav("cms-statistics")}
            style={{ background: "#fdfdfa", border: "1px solid #eef3ee", padding: "1.25rem", borderRadius: 14, cursor: "pointer" }}
          >
            <div style={{ fontSize: "1.25rem", marginBottom: "0.375rem" }}>📈</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2218" }}>{counts.statsTotal}</div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#4a5a44" }}>Impact Statistics</div>
          </div>
        </div>
      </div>

      {/* Recent Submissions Feed */}
      <div>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", marginBottom: "1rem" }}>
          ⚡ Recent Submissions Activity Feed
        </h2>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
            border: "1px solid #e8f0e8",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6a7a64" }}>Loading activity stream...</div>
          ) : recentSubmissions.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#6a7a64" }}>No submissions recorded yet.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "#f8faf8", borderBottom: "1px solid #e8f0e8" }}>
                    <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Submission Type</th>
                    <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Contact</th>
                    <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Status</th>
                    <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Submitted</th>
                    <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      onClick={() => setSelectedItem({ type: item._type, data: item })}
                      style={{ borderBottom: "1px solid #f0f4f0", cursor: "pointer" }}
                    >
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span style={{ fontWeight: 700, color: "#2d6a2d", background: "#f0f7f0", padding: "0.25rem 0.6rem", borderRadius: 6, fontSize: "0.75rem" }}>
                          {item._label}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <div style={{ fontWeight: 800, color: "#1a2218" }}>{item.full_name || item.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6a7a64" }}>{item.email}</div>
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem", color: "#6a7a64", fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                        {formatDate(item.created_at)}
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem", textAlign: "right" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem({ type: item._type, data: item });
                          }}
                          style={{
                            background: "#f0f7f0",
                            border: "1px solid #cce8cc",
                            color: "#2d6a2d",
                            padding: "0.35rem 0.75rem",
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            cursor: "pointer",
                          }}
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <SubmissionDetailModal
          type={selectedItem.type}
          data={selectedItem.data}
          onClose={() => setSelectedItem(null)}
          onStatusUpdated={() => {
            fetchOverviewData();
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
