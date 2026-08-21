import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { DbPartner } from "../../../hooks/useCmsData";
import ImageUploadField from "../ImageUploadField";

interface PartnerEditorModalProps {
  partner: DbPartner | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function PartnerEditorModal({ partner, onClose, onSaved }: PartnerEditorModalProps) {
  const isEditing = !!partner;

  const [name, setName] = useState(partner?.name || "");
  const [logoUrl, setLogoUrl] = useState(partner?.logo_url || "");
  const [websiteUrl, setWebsiteUrl] = useState(partner?.website_url || "");
  const [displayOrder, setDisplayOrder] = useState(partner?.display_order || 0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Partner organization name is required.");
      return;
    }

    setSaving(true);

    const payload = {
      name: name.trim(),
      logo_url: logoUrl.trim() || "",
      website_url: websiteUrl.trim() || null,
      display_order: Number(displayOrder) || 0,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing && partner?.id) {
        const { error: updateError } = await supabase
          .from("partners")
          .update(payload)
          .eq("id", partner.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("partners")
          .insert([payload]);

        if (insertError) throw insertError;
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || "Failed to save partner.");
    } finally {
      setSaving(false);
    }
  };

  const partnerSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "partner";

  return (
    <div className="abf-modal-overlay" onClick={onClose} style={{ zIndex: 360 }}>
      <div
        className="abf-animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 24,
          width: "100%",
          maxWidth: 600,
          maxHeight: "min(90vh, calc(100dvh - 2rem))",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          position: "relative",
          margin: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #eef3ee",
            background: "white",
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8dc63f", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              PARTNER CMS
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              {isEditing ? `Edit: ${partner.name}` : "Add Partner Organization"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
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
              color: "#555",
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div style={{ overflowY: "auto", padding: "1.5rem", flex: 1, WebkitOverflowScrolling: "touch", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "0.875rem 1rem", borderRadius: 10, color: "#b91c1c", fontSize: "0.8125rem" }}>
                ⚠️ {error}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Partner Organization Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Azu-Ogbunike Library Project"
                required
                style={{ width: "100%", padding: "0.75rem 0.875rem", borderRadius: 10, border: "1.5px solid #dde8dd", fontSize: "0.9375rem" }}
              />
            </div>

            {/* Direct Logo Upload */}
            <ImageUploadField
              label="Partner Logo (Optional)"
              value={logoUrl}
              onChange={setLogoUrl}
              folder="partners"
              slug={partnerSlug}
              aspectRatio="logo"
              helperText="Upload the organization's logo (PNG with transparent background recommended)."
            />

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Website Link (Optional)
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://..."
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Sort Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                style={{ width: 100, padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem" }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #eef3ee",
              background: "#fafaf7",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{ background: "none", border: "none", color: "#6a7a64", fontSize: "0.875rem", cursor: "pointer", fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="abf-btn-primary"
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.75rem" }}
            >
              {saving ? "Saving to Database..." : isEditing ? "Save Partner Changes" : "Add Partner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
