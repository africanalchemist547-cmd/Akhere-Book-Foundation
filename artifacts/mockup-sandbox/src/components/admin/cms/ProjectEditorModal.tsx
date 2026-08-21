import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { DbProject, DbProjectImage } from "../../../hooks/useCmsData";
import ImageUploadField from "../ImageUploadField";

interface ProjectEditorModalProps {
  project: DbProject | null; // null for creating new
  onClose: () => void;
  onSaved: () => void;
}

export default function ProjectEditorModal({ project, onClose, onSaved }: ProjectEditorModalProps) {
  const isEditing = !!project;

  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [showSlugControl, setShowSlugControl] = useState(false);

  const [status, setStatus] = useState<"pending" | "in_progress" | "finished">(project?.status || "finished");
  const [location, setLocation] = useState(project?.location || "");
  const [shortDescription, setShortDescription] = useState(project?.short_description || "");
  const [fullDescription, setFullDescription] = useState(project?.full_description || "");
  const [coverImage, setCoverImage] = useState(project?.cover_image || "");
  const [youtubeUrl, setYoutubeUrl] = useState(project?.youtube_url || "");
  const [featured, setFeatured] = useState(project?.featured || false);
  const [displayOrder, setDisplayOrder] = useState(project?.display_order || 0);

  // Gallery state (up to 6 images)
  const [galleryImages, setGalleryImages] = useState<Array<{ id?: string; image_url: string; caption?: string }>>(
    project?.project_images?.map((img) => ({ id: img.id, image_url: img.image_url, caption: img.caption || "" })) || []
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title unless manually customized
  useEffect(() => {
    if (!isSlugCustomized && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  }, [title, isSlugCustomized]);

  const handleAddGalleryImage = (url: string) => {
    if (!url) return;
    if (galleryImages.length >= 6) {
      setError("Maximum 6 gallery photos permitted per project.");
      return;
    }
    setGalleryImages([...galleryImages, { image_url: url, caption: "" }]);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }
    if (!slug.trim()) {
      setError("Project URL slug is required.");
      return;
    }
    if (!location.trim()) {
      setError("Location is required.");
      return;
    }
    if (!coverImage.trim()) {
      setError("Project cover image is required.");
      return;
    }

    setSaving(true);

    const projectPayload = {
      title: title.trim(),
      slug: slug.trim(),
      status,
      location: location.trim(),
      short_description: shortDescription.trim(),
      full_description: fullDescription.trim(),
      cover_image: coverImage.trim(),
      youtube_url: youtubeUrl.trim() || null,
      featured,
      display_order: Number(displayOrder) || 0,
      updated_at: new Date().toISOString(),
    };

    try {
      let savedProjectId = project?.id;

      if (isEditing && project?.id) {
        const { error: updateError } = await supabase
          .from("projects")
          .update(projectPayload)
          .eq("id", project.id);

        if (updateError) throw updateError;
      } else {
        const { data: newProject, error: insertError } = await supabase
          .from("projects")
          .insert([projectPayload])
          .select("id")
          .single();

        if (insertError) throw insertError;
        savedProjectId = newProject?.id;
      }

      // Save gallery images if project ID is available
      if (savedProjectId) {
        try {
          // Delete old gallery images and re-insert updated list
          await supabase.from("project_images").delete().eq("project_id", savedProjectId);

          if (galleryImages.length > 0) {
            const galleryPayload = galleryImages.map((img, idx) => ({
              project_id: savedProjectId,
              image_url: img.image_url,
              caption: img.caption || null,
              display_order: idx + 1,
            }));

            await supabase.from("project_images").insert(galleryPayload);
          }
        } catch {
          // Ignore if project_images table not yet created
        }
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
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
          maxWidth: 720,
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
              PROJECT MANAGER
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              {isEditing ? `Edit: ${project.title}` : "Create New ABF Project"}
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

            {/* Title & Slug */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Azu-Ogbunike Community Library"
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
                      placeholder="azu-ogbunike-community-library"
                      style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: 6, border: "1px solid #dde8dd", fontSize: "0.8125rem" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Status & Location */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                  Project Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem", background: "white" }}
                >
                  <option value="finished">Finished / Commissioned</option>
                  <option value="in_progress">In Progress / Active Build</option>
                  <option value="pending">Pending / In Planning</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Ogbunike, Anambra State"
                  required
                  style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem" }}
                />
              </div>
            </div>

            {/* Direct Cover Image Upload */}
            <ImageUploadField
              label="Primary Cover Image"
              value={coverImage}
              onChange={setCoverImage}
              folder="projects"
              slug={slug || "project"}
              required
              aspectRatio="cover"
              helperText="Upload the main hero photo that will appear on the project card and header."
            />

            {/* Project Multi-Image Gallery */}
            <div style={{ background: "#f8faf8", padding: "1rem 1.25rem", borderRadius: 12, border: "1px solid #e8f0e8" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", display: "block" }}>
                    Project Photo Gallery ({galleryImages.length}/6 photos)
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "#6a7a64" }}>
                    Additional photos of the reading room, bookshelves, and community events.
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnails List */}
              {galleryImages.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem", marginBottom: "1rem", marginTop: "0.5rem" }}>
                  {galleryImages.map((img, idx) => (
                    <div key={idx} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1.5px solid #dde8dd", height: 80, background: "#1a2218" }}>
                      <img src={img.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          background: "rgba(0,0,0,0.7)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: 22,
                          height: 22,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {galleryImages.length < 6 && (
                <div style={{ marginTop: "0.5rem" }}>
                  <ImageUploadField
                    label="Add a Gallery Photo"
                    value=""
                    onChange={handleAddGalleryImage}
                    folder="projects"
                    slug={`${slug || "project"}-gallery-${galleryImages.length + 1}`}
                    aspectRatio="cover"
                  />
                </div>
              )}
            </div>

            {/* Video Link */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                YouTube Video Link (Optional)
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem" }}
              />
            </div>

            {/* Short Summary */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Short Summary (Card preview)
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Write a brief overview of what this project accomplished..."
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem", lineHeight: 1.5 }}
              />
            </div>

            {/* Full Project Description */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Full Project Story & Details
              </label>
              <textarea
                rows={6}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Describe the project, community background, activities, and achievements here. Separate paragraphs with a blank line."
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem", lineHeight: 1.6 }}
              />
            </div>

            {/* Featured & Display Order */}
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", background: "#f8faf8", padding: "0.875rem 1.25rem", borderRadius: 12, border: "1px solid #e8f0e8" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 700, color: "#2d6a2d" }}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                Pin to Homepage Featured Teaser
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
              {saving ? "Saving to Database..." : isEditing ? "Save Project Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
