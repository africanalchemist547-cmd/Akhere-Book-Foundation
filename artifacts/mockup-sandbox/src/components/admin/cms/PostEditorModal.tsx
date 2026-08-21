import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { DbPost } from "../../../hooks/useCmsData";
import ImageUploadField from "../ImageUploadField";

interface PostEditorModalProps {
  post: DbPost | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function PostEditorModal({ post, onClose, onSaved }: PostEditorModalProps) {
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [showSlugControl, setShowSlugControl] = useState(false);

  const [category, setCategory] = useState<"projects" | "events" | "news_impact">(post?.category || "news_impact");
  const [author, setAuthor] = useState(post?.author || "Akhere Book Foundation");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.cover_image || "");
  const [youtubeUrl, setYoutubeUrl] = useState(post?.youtube_url || "");
  const [published, setPublished] = useState(post?.published ?? true);
  const [featured, setFeatured] = useState(post?.featured || false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSlugCustomized && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  }, [title, isSlugCustomized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Article title is required.");
      return;
    }
    if (!slug.trim()) {
      setError("Article URL slug is required.");
      return;
    }
    if (!coverImage.trim()) {
      setError("Cover image is required.");
      return;
    }

    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      author: author.trim() || "Akhere Book Foundation",
      excerpt: excerpt.trim(),
      content: content.trim(),
      cover_image: coverImage.trim(),
      youtube_url: youtubeUrl.trim() || null,
      published,
      featured,
      published_at: post?.published_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing && post?.id) {
        const { error: updateError } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", post.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("posts")
          .insert([payload]);

        if (insertError) throw insertError;
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || "Failed to save article.");
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
              BLOG & STORIES CMS
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              {isEditing ? `Edit: ${post.title}` : "Write New Story / Article"}
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
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. A Child, A Book, A New Possibility"
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
                      placeholder="a-child-a-book-a-new-possibility"
                      style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: 6, border: "1px solid #dde8dd", fontSize: "0.8125rem" }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Category & Author */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem", background: "white" }}
                >
                  <option value="news_impact">News & Impact</option>
                  <option value="projects">Projects</option>
                  <option value="events">Events & Community</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                  Author / Byline
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Akhere Book Foundation"
                  style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem" }}
                />
              </div>
            </div>

            {/* Direct Cover Image Upload */}
            <ImageUploadField
              label="Article Cover Image"
              value={coverImage}
              onChange={setCoverImage}
              folder="posts"
              slug={slug || "post"}
              required
              aspectRatio="cover"
              helperText="Upload the header image for this article."
            />

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

            {/* Excerpt */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Short Summary (Card preview)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a brief teaser summarizing what this article is about..."
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem", lineHeight: 1.5 }}
              />
            </div>

            {/* Full Story Content */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Full Article Content
              </label>
              <textarea
                rows={7}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full story or article here. Separate paragraphs with a blank line."
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem", lineHeight: 1.6 }}
              />
            </div>

            {/* Publishing Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", background: "#f8faf8", padding: "0.875rem 1.25rem", borderRadius: 12, border: "1px solid #e8f0e8" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 700, color: published ? "#2d6a2d" : "#92400e" }}>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                {published ? "✅ Published (Live on public website)" : "📝 Draft (Hidden from public)"}
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 700, color: "#2c3424" }}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                Featured Story
              </label>
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
              {saving ? "Saving to Database..." : isEditing ? "Save Post Changes" : "Publish / Save Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
