import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import { DbStatistic, STATIC_SEED_STATISTICS } from "../../../hooks/useCmsData";
import StatisticEditorModal from "./StatisticEditorModal";

export default function StatisticsManager() {
  const [stats, setStats] = useState<DbStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingStat, setEditingStat] = useState<DbStatistic | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setStats(STATIC_SEED_STATISTICS);
      setLoading(false);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from("library_statistics")
        .select("*")
        .order("display_order", { ascending: true });

      if (queryError) {
        setStats(STATIC_SEED_STATISTICS);
        setError(queryError.message);
      } else {
        setStats(data || []);
      }
    } catch (err: any) {
      setStats(STATIC_SEED_STATISTICS);
      setError(err.message || "Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async (stat: DbStatistic) => {
    if (!window.confirm(`Are you sure you want to delete the statistic "${stat.label}"?`)) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("library_statistics")
        .delete()
        .eq("id", stat.id);

      if (deleteError) throw deleteError;
      setStats(stats.filter((s) => s.id !== stat.id));
    } catch (err: any) {
      alert(err.message || "Failed to delete statistic.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
            Impact Statistics Manager
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.25rem", margin: 0 }}>
            Authoritative figures displayed across the Homepage and About Us impact sections.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={fetchStats}
            style={{
              background: "white",
              border: "1px solid #dde8dd",
              borderRadius: 10,
              padding: "0.6rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#2c3424",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => {
              setEditingStat(null);
              setIsEditorOpen(true);
            }}
            className="abf-btn-primary"
            style={{ fontSize: "0.875rem", padding: "0.6rem 1.25rem" }}
          >
            + Add Statistic
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "0.875rem 1rem", borderRadius: 12, color: "#b91c1c", fontSize: "0.875rem" }}>
          ⚠️ Notice: {error} (Displaying offline fallback values)
        </div>
      )}

      {/* Table Card */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e8f0e8", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#6a7a64" }}>
            Loading impact statistics...
          </div>
        ) : stats.length === 0 ? (
          <div style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📊</div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", margin: "0 0 0.5rem" }}>
              No Statistics Added Yet
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6a7a64", maxWidth: 420, margin: "0 auto 1.5rem" }}>
              Create your first impact metric to display verified figures on the public website.
            </p>
            <button
              onClick={() => {
                setEditingStat(null);
                setIsEditorOpen(true);
              }}
              className="abf-btn-primary"
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.25rem" }}
            >
              + Create Statistic
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8faf8", borderBottom: "1px solid #e8f0e8" }}>
                  <th style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "#4a5a44" }}>Order</th>
                  <th style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "#4a5a44" }}>Metric Title</th>
                  <th style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "#4a5a44" }}>Value</th>
                  <th style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "#4a5a44" }}>Subtext</th>
                  <th style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "#4a5a44" }}>Internal Key</th>
                  <th style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "#4a5a44", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat, idx) => (
                  <tr
                    key={stat.id}
                    style={{
                      borderBottom: idx === stats.length - 1 ? "none" : "1px solid #f0f4f0",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ padding: "1rem", color: "#6a7a64", fontWeight: 600 }}>
                      #{stat.display_order}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1a2218" }}>
                      {stat.label}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.6rem",
                          borderRadius: 8,
                          background: stat.value.includes("[") ? "#fef3c7" : "#e8f5e8",
                          color: stat.value.includes("[") ? "#92400e" : "#2d6a2d",
                          fontWeight: 800,
                          fontSize: "0.875rem",
                        }}
                      >
                        {stat.value}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", color: "#6a7a64", fontSize: "0.8125rem", fontStyle: "italic" }}>
                      {stat.description || "—"}
                    </td>
                    <td style={{ padding: "1rem", color: "#8a9a84", fontFamily: "monospace", fontSize: "0.75rem" }}>
                      {stat.metric_key}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => {
                            setEditingStat(stat);
                            setIsEditorOpen(true);
                          }}
                          style={{
                            background: "#f0f7f0",
                            border: "1px solid #d4edd4",
                            color: "#2d6a2d",
                            borderRadius: 6,
                            padding: "0.35rem 0.75rem",
                            fontSize: "0.8125rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stat)}
                          style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#b91c1c",
                            borderRadius: 6,
                            padding: "0.35rem 0.6rem",
                            fontSize: "0.8125rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isEditorOpen && (
        <StatisticEditorModal
          statistic={editingStat}
          onClose={() => setIsEditorOpen(false)}
          onSaved={() => {
            setIsEditorOpen(false);
            fetchStats();
          }}
        />
      )}
    </div>
  );
}
