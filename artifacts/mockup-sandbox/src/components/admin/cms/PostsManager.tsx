import React, { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import { DbPost } from "../../../hooks/useCmsData";
import { formatDate } from "../_adminShared";
import PostEditorModal from "./PostEditorModal";

export default function PostsManager() {
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [editingPost, setEditingPost] = useState<DbPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setLoading(false);
      setPosts([]);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setPosts(data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleTogglePublish = async (post: DbPost) => {
    const newStatus = !post.published;
    try {
      const { error: updateError } = await supabase
        .from("posts")
        .update({ published: newStatus, updated_at: new Date().toISOString() })
        .eq("id", post.id);

      if (updateError) {
        alert(`Failed to update post status: ${updateError.message}`);
      } else {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, published: newStatus } : p))
        );
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete post "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error: delError } = await supabase.from("posts").delete().eq("id", id);
      if (delError) {
        alert(`Failed to delete post: ${delError.message}`);
      } else {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err: any) {
      alert(`Error deleting post: ${err.message}`);
    }
  };

  const filtered = posts.filter((p) => {
    const matchesCat = categoryFilter === "ALL" || p.category === categoryFilter.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || p.title?.toLowerCase().includes(q) || p.author?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
            Blog & Stories Manager (CMS)
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.25rem" }}>
            Write articles, manage public impact stories, and toggle live/draft publishing
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={fetchPosts}
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
            + Write New Post
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "1rem 1.25rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          border: "1px solid #e8f0e8",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ flex: "1 1 260px", maxWidth: 400 }}>
          <input
            type="text"
            placeholder="🔍 Search title, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.875rem",
              borderRadius: 8,
              border: "1.5px solid #dde8dd",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
          {["ALL", "NEWS_IMPACT", "PROJECTS", "EVENTS"].map((tab) => {
            const active = categoryFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setCategoryFilter(tab)}
                style={{
                  padding: "0.4rem 0.875rem",
                  borderRadius: 9999,
                  border: active ? "1.5px solid #2d6a2d" : "1px solid #e0e8e0",
                  background: active ? "#2d6a2d" : "white",
                  color: active ? "white" : "#4a5a44",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {tab.replace("_", " & ")}
              </button>
            );
          })}
        </div>
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
            Loading posts...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📰</div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              No posts found in database
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.375rem" }}>
              Click "+ Write New Post" above to publish your first story.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8faf8", borderBottom: "1px solid #e8f0e8" }}>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Article</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Category</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Status</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Published Date</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f0f4f0" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        {item.cover_image && (
                          <img
                            src={item.cover_image}
                            alt=""
                            style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 800, color: "#1a2218" }}>{item.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "#8a9a84" }}>By {item.author || "ABF"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.2rem 0.6rem",
                          borderRadius: 9999,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          background: item.category === "projects" ? "#dcfce7" : item.category === "events" ? "#fef3c7" : "#e0f2fe",
                          color: item.category === "projects" ? "#15803d" : item.category === "events" ? "#92400e" : "#0369a1",
                        }}
                      >
                        {item.category.replace("_", " & ")}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <button
                        onClick={() => handleTogglePublish(item)}
                        title="Click to toggle publish status"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          padding: "0.25rem 0.625rem",
                          borderRadius: 9999,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          border: item.published ? "1px solid #bbf7d0" : "1px solid #fde68a",
                          background: item.published ? "#dcfce7" : "#fef3c7",
                          color: item.published ? "#15803d" : "#92400e",
                          cursor: "pointer",
                        }}
                      >
                        {item.published ? "🟢 Live on Site" : "🟡 Draft"}
                      </button>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", color: "#6a7a64", fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                      {formatDate(item.published_at)}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => setEditingPost(item)}
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
                          onClick={() => handleDelete(item.id, item.title)}
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
      {(isCreating || editingPost) && (
        <PostEditorModal
          post={editingPost}
          onClose={() => {
            setIsCreating(false);
            setEditingPost(null);
          }}
          onSaved={() => {
            setIsCreating(false);
            setEditingPost(null);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}
