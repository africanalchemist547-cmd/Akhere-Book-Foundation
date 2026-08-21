import React from "react";

// ─── TYPES ───────────────────────────────────────────────────

export type SubmissionStatus = "new" | "reviewed" | "contacted" | "archived";

export interface VolunteerSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  age_range: string;
  location: string;
  motivation: string;
  contribution_areas: string[];
  skills?: string | null;
  availability: string;
  additional_information?: string | null;
  consent: boolean;
  status: SubmissionStatus;
  created_at: string;
}

export interface DonationInquiry {
  id: string;
  donation_type: "money" | "books";
  amount?: number | null;
  frequency?: "one-time" | "weekly" | "bi-weekly" | "monthly" | null;
  name: string;
  email: string;
  phone: string;
  question?: string | null; // Stores JSON metadata for books: { categories: string[], quantity: string, location: string }
  status: SubmissionStatus;
  created_at: string;
}

export interface PartnershipInquiry {
  id: string;
  person_type: "individual" | "business" | "other";
  name: string;
  organisation?: string | null;
  email: string;
  phone: string;
  partnership_areas: string[];
  message: string;
  consent: boolean;
  status: SubmissionStatus;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

// ─── STATUS BADGE COMPONENT ──────────────────────────────────
export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const configs: Record<SubmissionStatus, { label: string; bg: string; text: string; border: string }> = {
    new: { label: "NEW", bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
    reviewed: { label: "REVIEWED", bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
    contacted: { label: "CONTACTED", bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
    archived: { label: "ARCHIVED", bg: "#f3f4f6", text: "#4b5563", border: "#e5e7eb" },
  };

  const config = configs[status] || configs.new;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.2rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  );
}

// ─── OUTREACH HELPERS ────────────────────────────────────────
export function getCleanPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("0") && !cleaned.startsWith("+")) {
    cleaned = "+234" + cleaned.slice(1);
  }
  return cleaned;
}

export function openWhatsApp(phone: string, name: string, context: string) {
  const cleanPhone = getCleanPhone(phone).replace("+", "");
  const text = encodeURIComponent(
    `Hello ${name},\n\nThank you for reaching out to the Akhere Book Foundation regarding ${context}. We received your information through our website and would love to connect with you.`
  );
  window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
}

export function openEmail(email: string, name: string, context: string) {
  const subject = encodeURIComponent(`Akhere Book Foundation — Regarding your ${context}`);
  const body = encodeURIComponent(
    `Hello ${name},\n\nThank you for your interest in the Akhere Book Foundation. We received your submission regarding ${context} and would like to follow up with you.`
  );
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

export function formatDate(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}
