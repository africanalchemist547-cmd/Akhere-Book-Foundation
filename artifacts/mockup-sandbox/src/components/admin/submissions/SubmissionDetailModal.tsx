import React, { useState } from "react";
import {
  SubmissionStatus,
  StatusBadge,
  openWhatsApp,
  openEmail,
  getCleanPhone,
  formatDate,
} from "../_adminShared";
import { supabase } from "../../../lib/supabase";

interface SubmissionDetailModalProps {
  type: "volunteer" | "book_donation" | "money_donation" | "partnership";
  data: any;
  onClose: () => void;
  onStatusUpdated: (id: string, newStatus: SubmissionStatus) => void;
}

export default function SubmissionDetailModal({
  type,
  data,
  onClose,
  onStatusUpdated,
}: SubmissionDetailModalProps) {
  const [status, setStatus] = useState<SubmissionStatus>(data.status || "new");
  const [updating, setUpdating] = useState(false);

  if (!data) return null;

  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    setUpdating(true);
    setStatus(newStatus);

    let table = "volunteer_submissions";
    if (type === "partnership") table = "partnership_inquiries";
    if (type === "book_donation" || type === "money_donation") table = "donation_inquiries";

    try {
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq("id", data.id);

      if (!error) {
        onStatusUpdated(data.id, newStatus);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Parse book metadata if applicable
  let bookMetadata: { categories?: string[]; quantity?: string; location?: string } = {};
  if (type === "book_donation" && data.question) {
    try {
      bookMetadata = JSON.parse(data.question);
    } catch {
      // not json, keep empty
    }
  }

  const name = data.full_name || data.name || "Anonymous";
  const email = data.email || "";
  const phone = data.phone || "";
  const cleanPhone = phone ? getCleanPhone(phone) : "";

  const titleMap = {
    volunteer: "Volunteer Application Details",
    book_donation: "Book Donation Inquiry Details",
    money_donation: "Monetary Donation Inquiry Details",
    partnership: "Partnership Proposal Details",
  };

  return (
    <div className="abf-modal-overlay" onClick={onClose} style={{ zIndex: 350 }}>
      <div
        className="abf-animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 24,
          width: "100%",
          maxWidth: 620,
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
              SUBMISSION INSPECTOR
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              {titleMap[type]}
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

        {/* Scrollable Body */}
        <div style={{ overflowY: "auto", padding: "1.5rem", flex: 1, WebkitOverflowScrolling: "touch" }}>
          {/* Status & Date Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f8faf8",
              padding: "1rem 1.25rem",
              borderRadius: 14,
              border: "1px solid #e8f0e8",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#4a5a44" }}>Workflow Status:</span>
              <StatusBadge status={status} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.8125rem", color: "#6a7a64", fontWeight: 500 }}>Update Status:</label>
              <select
                value={status}
                disabled={updating}
                onChange={(e) => handleStatusChange(e.target.value as SubmissionStatus)}
                style={{
                  padding: "0.35rem 0.6rem",
                  borderRadius: 8,
                  border: "1.5px solid #2d6a2d",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "#2d6a2d",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <option value="new">NEW</option>
                <option value="reviewed">REVIEWED</option>
                <option value="contacted">CONTACTED</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>
          </div>

          {/* Quick Outreach Actions */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1a2218", marginBottom: "0.625rem" }}>
              Direct Outreach Actions
            </div>
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
              {phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.5rem 1rem",
                    borderRadius: 9999,
                    background: "#f0f7f0",
                    color: "#2d6a2d",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    textDecoration: "none",
                    border: "1px solid #d4edd4",
                  }}
                >
                  📞 Call {phone}
                </a>
              )}
              {phone && (
                <button
                  onClick={() => openWhatsApp(phone, name, titleMap[type])}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.5rem 1rem",
                    borderRadius: 9999,
                    background: "#25D366",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  💬 WhatsApp
                </button>
              )}
              {email && (
                <button
                  onClick={() => openEmail(email, name, titleMap[type])}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.5rem 1rem",
                    borderRadius: 9999,
                    background: "#f8faf8",
                    color: "#4a5a44",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    border: "1px solid #e0e8e0",
                    cursor: "pointer",
                  }}
                >
                  ✉️ Email {email}
                </button>
              )}
            </div>
          </div>

          {/* Submission Details Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Primary Details */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Full Name</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#1a2218", marginTop: "0.25rem" }}>{name}</div>
              </div>
              <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Submitted At</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1a2218", marginTop: "0.25rem" }}>{formatDate(data.created_at)}</div>
              </div>
            </div>

            {/* Volunteer-Specific Details */}
            {type === "volunteer" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                    <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Age Range</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1a2218", marginTop: "0.25rem" }}>{data.age_range || "Not specified"}</div>
                  </div>
                  <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                    <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Location</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1a2218", marginTop: "0.25rem" }}>{data.location || "Not specified"}</div>
                  </div>
                </div>

                <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600, marginBottom: "0.375rem" }}>Contribution Areas</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {Array.isArray(data.contribution_areas) && data.contribution_areas.length > 0 ? (
                      data.contribution_areas.map((area: string, idx: number) => (
                        <span key={idx} style={{ background: "#e8f5e8", color: "#2d6a2d", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 9999 }}>
                          {area}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "0.875rem", color: "#8a9a84" }}>None selected</span>
                    )}
                  </div>
                </div>

                <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Availability</div>
                  <div style={{ fontSize: "0.875rem", color: "#1a2218", marginTop: "0.25rem" }}>{data.availability || "Not specified"}</div>
                </div>

                <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Why ABF / Motivation</div>
                  <p style={{ fontSize: "0.875rem", color: "#2c3424", lineHeight: 1.6, margin: "0.375rem 0 0" }}>{data.motivation}</p>
                </div>

                {data.skills && (
                  <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                    <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Relevant Skills / Background</div>
                    <p style={{ fontSize: "0.875rem", color: "#2c3424", lineHeight: 1.6, margin: "0.375rem 0 0" }}>{data.skills}</p>
                  </div>
                )}

                {data.additional_information && (
                  <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                    <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Additional Information</div>
                    <p style={{ fontSize: "0.875rem", color: "#2c3424", lineHeight: 1.6, margin: "0.375rem 0 0" }}>{data.additional_information}</p>
                  </div>
                )}
              </>
            )}

            {/* Book Donation Details */}
            {type === "book_donation" && (
              <>
                <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600, marginBottom: "0.375rem" }}>Book Categories</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {Array.isArray(bookMetadata.categories) && bookMetadata.categories.length > 0 ? (
                      bookMetadata.categories.map((cat: string, idx: number) => (
                        <span key={idx} style={{ background: "#f5fbeb", color: "#2d6a2d", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 9999 }}>
                          📚 {cat}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "0.875rem", color: "#8a9a84" }}>Not specified</span>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                    <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Approximate Quantity</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#2d6a2d", marginTop: "0.25rem" }}>
                      {bookMetadata.quantity || "Not specified"}
                    </div>
                  </div>
                  <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                    <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Location / Drop-off City</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1a2218", marginTop: "0.25rem" }}>
                      {bookMetadata.location || "Not specified"}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Money Donation Details */}
            {type === "money_donation" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Pledged Amount</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#2d6a2d", marginTop: "0.25rem" }}>
                    {data.amount ? `₦${Number(data.amount).toLocaleString()}` : "Not specified"}
                  </div>
                </div>
                <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Frequency</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1a2218", marginTop: "0.25rem", textTransform: "capitalize" }}>
                    {data.frequency || "one-time"}
                  </div>
                </div>
              </div>
            )}

            {/* Partnership Details */}
            {type === "partnership" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                    <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Partner Type</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1a2218", marginTop: "0.25rem", textTransform: "capitalize" }}>
                      {data.person_type}
                    </div>
                  </div>
                  <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                    <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Organisation / Institution</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1a2218", marginTop: "0.25rem" }}>
                      {data.organisation || "Individual / None"}
                    </div>
                  </div>
                </div>

                <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600, marginBottom: "0.375rem" }}>Partnership Areas</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {Array.isArray(data.partnership_areas) && data.partnership_areas.length > 0 ? (
                      data.partnership_areas.map((area: string, idx: number) => (
                        <span key={idx} style={{ background: "#f0f7f0", color: "#2d6a2d", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 9999 }}>
                          🤝 {area}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "0.875rem", color: "#8a9a84" }}>None selected</span>
                    )}
                  </div>
                </div>

                <div style={{ background: "#fafaf7", padding: "0.875rem", borderRadius: 12, border: "1px solid #f0f0ec" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8a9a84", fontWeight: 600 }}>Proposal Message</div>
                  <p style={{ fontSize: "0.875rem", color: "#2c3424", lineHeight: 1.6, margin: "0.375rem 0 0" }}>{data.message}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #eef3ee",
            background: "#fafaf7",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            className="abf-btn-primary"
            style={{ fontSize: "0.875rem", padding: "0.6rem 1.5rem" }}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
