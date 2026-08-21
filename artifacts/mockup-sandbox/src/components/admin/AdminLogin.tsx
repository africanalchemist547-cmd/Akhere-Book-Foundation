import React, { useState } from "react";
import { useAdminAuth } from "./AdminAuthContext";
import { ASSETS } from "../mockups/_shared";

export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const { signIn, error, clearError, loading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);

    if (res.success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.location.pathname = "/admin";
      }
    }
  };

  const displayError = localError || error;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #132413 0%, #1a381a 50%, #101e10 100%)",
        padding: "1.5rem",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "white",
          borderRadius: 24,
          padding: "2.5rem 2rem",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src={ASSETS.logoGreen}
            alt="Akhere Book Foundation"
            style={{ width: 64, height: 64, objectFit: "contain", margin: "0 auto 1rem" }}
          />
          <div style={{ display: "inline-block", background: "#f0f7f0", padding: "0.25rem 0.75rem", borderRadius: 9999, marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2d6a2d", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              ABF ADMIN PORTAL
            </span>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2218", margin: 0 }}>
            Sign In to Dashboard
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6a7a64", marginTop: "0.375rem" }}>
            Authorized personnel and team members only
          </p>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 12,
              padding: "0.875rem 1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.625rem",
            }}
          >
            <span style={{ fontSize: "1rem" }}>⚠️</span>
            <p style={{ fontSize: "0.8125rem", color: "#b91c1c", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              {displayError}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@akherebookfoundation.org"
              required
              disabled={submitting}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 10,
                border: "1.5px solid #d4e0d4",
                fontSize: "0.9375rem",
                outline: "none",
                transition: "border-color 0.15s",
                background: "white",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2d6a2d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d4e0d4")}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={submitting}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 10,
                border: "1.5px solid #d4e0d4",
                fontSize: "0.9375rem",
                outline: "none",
                transition: "border-color 0.15s",
                background: "white",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2d6a2d")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d4e0d4")}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="abf-btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "0.875rem",
              fontSize: "1rem",
              borderRadius: 12,
              marginTop: "0.5rem",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.75 : 1,
            }}
          >
            {submitting ? "Verifying Credentials..." : "Sign In to Dashboard →"}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ textAlign: "center", marginTop: "1.75rem", borderTop: "1px solid #f0f4f0", paddingTop: "1.25rem" }}>
          <a
            href="/"
            style={{
              fontSize: "0.8125rem",
              color: "#6a7a64",
              textDecoration: "none",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
