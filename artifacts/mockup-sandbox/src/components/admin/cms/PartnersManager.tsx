import React, { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import { DbPartner } from "../../../hooks/useCmsData";
import PartnerEditorModal from "./PartnerEditorModal";

export default function PartnersManager() {
  const [partners, setPartners] = useState<DbPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingPartner, setEditingPartner] = useState<DbPartner | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setLoading(false);
      setPartners([]);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from("partners")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setPartners(data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load partners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove partner "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error: delError } = await supabase.from("partners").delete().eq("id", id);
      if (delError) {
        alert(`Failed to delete partner: ${delError.message}`);
      } else {
        setPartners((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err: any) {
      alert(`Error deleting partner: ${err.message}`);
    }
  };

  const filtered = partners.filter((p) => {
    const q = search.toLowerCase().trim();
    return !q || p.name?.toLowerCase().includes(q);
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
            Partners Manager (CMS)
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.25rem" }}>
            Add, update, and manage official foundation partners and collaborating organizations
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={fetchPartners}
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
            + Add Partner Organization
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
          placeholder="🔍 Search partner name..."
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
            Loading partners...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🏢</div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              No partner organizations found in database
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.375rem" }}>
              Click "+ Add Partner Organization" above to publish your first partner to the website.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8faf8", borderBottom: "1px solid #e8f0e8" }}>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Partner Name</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Website Link</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Sort Order</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f0f4f0" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        {item.logo_url ? (
                          <img
                            src={item.logo_url}
                            alt=""
                            style={{ width: 40, height: 40, borderRadius: 8, objectFit: "contain", flexShrink: 0, border: "1px solid #e8f0e8", padding: 2 }}
                          />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: "#f0f7f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.125rem", color: "#2d6a2d", fontWeight: 800 }}>
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div style={{ fontWeight: 800, color: "#1a2218" }}>{item.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#6a7a64" }}>
                      {item.website_url ? (
                        <a
                          href={item.website_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#2d6a2d", textDecoration: "none", fontWeight: 600, fontSize: "0.8125rem" }}
                        >
                          🌐 Visit Website ↗
                        </a>
                      ) : (
                        <span style={{ color: "#aab8a4", fontSize: "0.8125rem" }}>No website linked</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#6a7a64", fontWeight: 600 }}>
                      {item.display_order}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => setEditingPartner(item)}
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
      {(isCreating || editingPartner) && (
        <PartnerEditorModal
          partner={editingPartner}
          onClose={() => {
            setIsCreating(false);
            setEditingPartner(null);
          }}
          onSaved={() => {
            setIsCreating(false);
            setEditingPartner(null);
            fetchPartners();
          }}
        />
      )}
    </div>
  );
}
