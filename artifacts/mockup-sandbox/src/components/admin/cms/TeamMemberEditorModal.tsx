import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { DbTeamMember } from "../../../hooks/useCmsData";
import ImageUploadField from "../ImageUploadField";

interface TeamMemberEditorModalProps {
  member: DbTeamMember | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function TeamMemberEditorModal({ member, onClose, onSaved }: TeamMemberEditorModalProps) {
  const isEditing = !!member;

  const [name, setName] = useState(member?.name || "");
  const [slug, setSlug] = useState(member?.slug || "");
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [showSlugControl, setShowSlugControl] = useState(false);

  const [role, setRole] = useState(member?.role || "ABF Team Member");
  const [shortBio, setShortBio] = useState(member?.short_bio || "");
  const [fullStory, setFullStory] = useState(member?.full_story || "");
  const [imageUrl, setImageUrl] = useState(member?.image_url || "");
  const [featured, setFeatured] = useState(member?.featured || false);
  const [displayOrder, setDisplayOrder] = useState(member?.display_order || 0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSlugCustomized && name) {
      const generated = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  }, [name, isSlugCustomized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Team member name is required.");
      return;
    }
    if (!slug.trim()) {
      setError("URL slug is required.");
      return;
    }
    if (!role.trim()) {
      setError("Role is required.");
      return;
    }
    if (!imageUrl.trim()) {
      setError("Profile photo is required.");
      return;
    }

    setSaving(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      role: role.trim(),
      short_bio: shortBio.trim(),
      full_story: fullStory.trim() || shortBio.trim(),
      image_url: imageUrl.trim(),
      featured,
      display_order: Number(displayOrder) || 0,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing && member?.id) {
        const { error: updateError } = await supabase
          .from("team_members")
          .update(payload)
          .eq("id", member.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("team_members")
          .insert([payload]);

        if (insertError) throw insertError;
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || "Failed to save team member.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="abf-modal-overlay" onClick={onClose} style={{ zIndex: 360 }}>
      <div
        className="abf-animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 24,
          width: "100%",
          maxWidth: 680,
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
              TEAM MANAGER
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              {isEditing ? `Edit: ${member.name}` : "Add New Team Member"}
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

            {/* Name & Slug */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Oluwatosin Aina"
                required
                style={{ width: "100%", padding: "0.75rem 0.875rem", borderRadius: 10, border: "1.5px solid #dde8dd", fontSize: "0.9375rem" }}
              />

              {/* Collapsible Slug Control */}
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowSlugControl(!showSlugControl)}
                  style={{ background: "none", border: "none", color: "#6a7a64", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600, padding: 0 }}
                >
                  ⚙️ {showSlugControl ? "Hide URL Slug" : "Customize URL Slug"} (Current: <code style={{ color: "#2d6a2d" }}>/{slug || "auto-generated"}</code>)
                </button>

                {showSlugControl && (
                  <div style={{ marginTop: "0.375rem", background: "#f8faf6", padding: "0.75rem", borderRadius: 8, border: "1px solid #e0e8e0" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#4a5a44", marginBottom: "0.25rem" }}>
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setIsSlugCustomized(true);
                      }}
                      placeholder="oluwatosin-aina"
                      style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: 6, border: "1px solid #dde8dd", fontSize: "0.8125rem" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Role / Title *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. ABF Team Member / Program Coordinator"
                required
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem" }}
              />
            </div>

            {/* Direct Photo Upload */}
            <ImageUploadField
              label="Profile Photo"
              value={imageUrl}
              onChange={setImageUrl}
              folder="team"
              slug={slug || "team"}
              required
              aspectRatio="portrait"
              helperText="Upload a portrait photo of the team member."
            />

            {/* Short Bio */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Short Bio (Card preview)
              </label>
              <textarea
                rows={2}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                placeholder="Write a concise overview of their role and contribution..."
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem", lineHeight: 1.5 }}
              />
            </div>

            {/* Full Story Biography */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Full Biography (Modal view)
              </label>
              <textarea
                rows={4}
                value={fullStory}
                onChange={(e) => setFullStory(e.target.value)}
                placeholder="Write their full background, connection to ABF, and vision for the mission..."
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem", lineHeight: 1.6 }}
              />
            </div>

            {/* Featured & Order */}
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", background: "#f8faf8", padding: "0.875rem 1.25rem", borderRadius: 12, border: "1px solid #e8f0e8" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 700, color: "#2d6a2d" }}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                Pin to Homepage Team Preview
              </label>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#4a5a44" }}>Sort Order:</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  style={{ width: 70, padding: "0.35rem 0.5rem", borderRadius: 6, border: "1px solid #dde8dd", fontSize: "0.8125rem" }}
                />
              </div>
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
              {saving ? "Saving to Database..." : isEditing ? "Save Member Changes" : "Add Team Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
