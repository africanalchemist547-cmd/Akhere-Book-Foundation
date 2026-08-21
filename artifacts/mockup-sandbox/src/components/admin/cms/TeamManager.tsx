import React, { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import { DbTeamMember } from "../../../hooks/useCmsData";
import TeamMemberEditorModal from "./TeamMemberEditorModal";

export default function TeamManager() {
  const [team, setTeam] = useState<DbTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingMember, setEditingMember] = useState<DbTeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setLoading(false);
      setTeam([]);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setTeam(data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load team members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove team member "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error: delError } = await supabase.from("team_members").delete().eq("id", id);
      if (delError) {
        alert(`Failed to delete team member: ${delError.message}`);
      } else {
        setTeam((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err: any) {
      alert(`Error deleting member: ${err.message}`);
    }
  };

  const filtered = team.filter((m) => {
    const q = search.toLowerCase().trim();
    return !q || m.name?.toLowerCase().includes(q) || m.role?.toLowerCase().includes(q);
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
            Team Members Manager (CMS)
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.25rem" }}>
            Add, update, and manage foundation leaders, coordinators, and bio profiles
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={fetchTeam}
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
            🔄 Refresh
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="abf-btn-primary"
            style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem" }}
          >
            + Add Team Member
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "1rem 1.25rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          border: "1px solid #e8f0e8",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search name, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "0.6rem 0.875rem",
            borderRadius: 8,
            border: "1.5px solid #dde8dd",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "1rem", borderRadius: 12, marginBottom: "1.5rem", color: "#b91c1c", fontSize: "0.875rem" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Table Container */}
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
          <div style={{ padding: "4rem", textAlign: "center", color: "#6a7a64", fontSize: "0.9375rem" }}>
            Loading team members...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🧑‍🤝‍🧑</div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              No team members found in database
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.375rem" }}>
              Click "+ Add Team Member" above to publish your first team profile.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8faf8", borderBottom: "1px solid #e8f0e8" }}>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Member</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Role</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Featured</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Order</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f0f4f0" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt=""
                            style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e8f5e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
                            👤
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 800, color: "#1a2218" }}>{item.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#8a9a84" }}>/{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontWeight: 600, color: "#1a2218" }}>
                      {item.role}
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {item.featured ? (
                        <span style={{ color: "#2d6a2d", fontWeight: 800, fontSize: "0.8125rem" }}>⭐ Featured</span>
                      ) : (
                        <span style={{ color: "#aab8a4", fontSize: "0.8125rem" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#6a7a64", fontWeight: 600 }}>
                      {item.display_order}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => setEditingMember(item)}
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
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#b91c1c",
                            padding: "0.35rem 0.75rem",
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: "0.75rem",
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

      {/* Editor Modal */}
      {(isCreating || editingMember) && (
        <TeamMemberEditorModal
          member={editingMember}
          onClose={() => {
            setIsCreating(false);
            setEditingMember(null);
          }}
          onSaved={() => {
            setIsCreating(false);
            setEditingMember(null);
            fetchTeam();
          }}
        />
      )}
    </div>
  );
}
