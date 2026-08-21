import React, { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import { DonationInquiry, SubmissionStatus, StatusBadge, formatDate } from "../_adminShared";
import SubmissionDetailModal from "./SubmissionDetailModal";

export default function BookDonationsView() {
  const [inquiries, setInquiries] = useState<DonationInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<DonationInquiry | null>(null);

  const fetchBookDonations = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setLoading(false);
      setInquiries([]);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from("donation_inquiries")
        .select("*")
        .eq("donation_type", "books")
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setInquiries(data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load book donation inquiries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookDonations();
  }, [fetchBookDonations]);

  const handleStatusUpdated = (id: string, newStatus: SubmissionStatus) => {
    setInquiries((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
    );
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filtered = inquiries.filter((item) => {
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter.toLowerCase();
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.phone?.toLowerCase().includes(query) ||
      item.question?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Header & Stats Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
            Book Donation Inquiries
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.25rem" }}>
            Manage and follow up on offers of physical books, quantities, and collection locations
          </p>
        </div>
        <button
          onClick={fetchBookDonations}
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
      </div>

      {/* Filter & Search Controls */}
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
        {/* Search */}
        <div style={{ flex: "1 1 260px", maxWidth: 400 }}>
          <input
            type="text"
            placeholder="🔍 Search donor, email, phone, location..."
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

        {/* Status Filters */}
        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
          {["ALL", "NEW", "REVIEWED", "CONTACTED", "ARCHIVED"].map((tab) => {
            const active = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
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
                {tab}
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
            Loading book donation inquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📚</div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              No book donation inquiries found
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.375rem" }}>
              {search || statusFilter !== "ALL"
                ? "Try adjusting your search query or status filter."
                : "Book donation inquiries submitted on the public website will appear here."}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "#f8faf8", borderBottom: "1px solid #e8f0e8" }}>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Donor</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Quantity & Location</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Categories</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Status</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44" }}>Submitted</th>
                  <th style={{ padding: "0.875rem 1.25rem", fontWeight: 700, color: "#4a5a44", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  let meta: { categories?: string[]; quantity?: string; location?: string } = {};
                  try {
                    if (item.question) meta = JSON.parse(item.question);
                  } catch {
                    // ignore
                  }

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedInquiry(item)}
                      style={{
                        borderBottom: "1px solid #f0f4f0",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fbfdfb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ fontWeight: 800, color: "#1a2218" }}>{item.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6a7a64", marginTop: "0.15rem" }}>{item.email}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6a7a64" }}>{item.phone}</div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ fontWeight: 800, color: "#2d6a2d" }}>{meta.quantity || "Quantity unstated"}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6a7a64" }}>📍 {meta.location || "Location not stated"}</div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", maxWidth: 220 }}>
                          {meta.categories?.slice(0, 2).map((cat, i) => (
                            <span key={i} style={{ background: "#f5fbeb", color: "#2d6a2d", fontSize: "0.6875rem", fontWeight: 700, padding: "0.15rem 0.4rem", borderRadius: 4 }}>
                              {cat}
                            </span>
                          ))}
                          {meta.categories && meta.categories.length > 2 && (
                            <span style={{ fontSize: "0.6875rem", color: "#8a9a84" }}>+{meta.categories.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ padding: "1rem 1.25rem", color: "#6a7a64", fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                        {formatDate(item.created_at)}
                      </td>
                      <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInquiry(item);
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedInquiry && (
        <SubmissionDetailModal
          type="book_donation"
          data={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}
