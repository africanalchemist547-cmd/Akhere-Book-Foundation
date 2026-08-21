import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { DbStatistic } from "../../../hooks/useCmsData";

interface StatisticEditorModalProps {
  statistic: DbStatistic | null;
  onClose: () => void;
  onSaved: () => void;
}

const STATISTIC_PRESETS = [
  {
    label: "Books Made Available",
    metric_key: "books_available",
    desc: "figures to be confirmed",
    order: 1,
    icon: "📚",
  },
  {
    label: "Schools / Communities Reached",
    metric_key: "schools_reached",
    desc: "figures to be confirmed",
    order: 2,
    icon: "🏫",
  },
  {
    label: "Children & Community Members Reached",
    metric_key: "people_reached",
    desc: "figures to be confirmed",
    order: 3,
    icon: "👥",
  },
  {
    label: "Library Users",
    metric_key: "library_users",
    desc: "figures to be confirmed",
    order: 4,
    icon: "📖",
  },
  {
    label: "Monthly Usage Hours",
    metric_key: "monthly_hours",
    desc: "figures to be confirmed",
    order: 5,
    icon: "⏱️",
  },
];

export default function StatisticEditorModal({ statistic, onClose, onSaved }: StatisticEditorModalProps) {
  const isEditing = !!statistic;

  const [label, setLabel] = useState(statistic?.label || "");
  const [value, setValue] = useState(statistic?.value || "");
  const [description, setDescription] = useState(statistic?.description || "");
  const [metricKey, setMetricKey] = useState(statistic?.metric_key || "");
  const [displayOrder, setDisplayOrder] = useState(statistic?.display_order || 0);

  const [isKeyCustomized, setIsKeyCustomized] = useState(false);
  const [showKeyControl, setShowKeyControl] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate key when label changes unless customized
  useEffect(() => {
    if (!isEditing && !isKeyCustomized && label) {
      // Check if it matches a preset
      const matchedPreset = STATISTIC_PRESETS.find(
        (p) => p.label.toLowerCase() === label.trim().toLowerCase()
      );
      if (matchedPreset) {
        setMetricKey(matchedPreset.metric_key);
      } else {
        const generated = label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/(^_|_$)+/g, "");
        setMetricKey(generated);
      }
    }
  }, [label, isEditing, isKeyCustomized]);

  const handleApplyPreset = (preset: typeof STATISTIC_PRESETS[0]) => {
    setLabel(preset.label);
    setMetricKey(preset.metric_key);
    setDescription(preset.desc);
    setDisplayOrder(preset.order);
    setIsKeyCustomized(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!label.trim()) {
      setError("Statistic label is required.");
      return;
    }
    if (!value.trim()) {
      setError("Value is required (e.g. 200, 3,500+, or [XX+]).");
      return;
    }
    if (!metricKey.trim()) {
      setError("Metric identifier key is required.");
      return;
    }

    setSaving(true);

    const payload = {
      label: label.trim(),
      value: value.trim(),
      description: description.trim() || null,
      metric_key: metricKey.trim(),
      display_order: Number(displayOrder) || 0,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEditing && statistic?.id) {
        const { error: updateError } = await supabase
          .from("library_statistics")
          .update(payload)
          .eq("id", statistic.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("library_statistics")
          .insert([payload]);

        if (insertError) throw insertError;
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || "Failed to save statistic.");
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
          maxWidth: 580,
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
              IMPACT STATISTICS CMS
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a2218", margin: 0 }}>
              {isEditing ? `Edit: ${statistic.label}` : "Add Impact Statistic"}
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

            {/* Quick Presets (when creating new) */}
            {!isEditing && (
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#6a7a64", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Quick Fill Preset Metrics
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {STATISTIC_PRESETS.map((preset) => (
                    <button
                      key={preset.metric_key}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      style={{
                        background: metricKey === preset.metric_key ? "#e8f5e8" : "#f8faf6",
                        border: metricKey === preset.metric_key ? "1.5px solid #2d6a2d" : "1px solid #dde8dd",
                        color: metricKey === preset.metric_key ? "#2d6a2d" : "#4a5a44",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        padding: "0.35rem 0.65rem",
                        borderRadius: 8,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <span>{preset.icon}</span> {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Label */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Metric Title / Label *
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Books Made Available"
                required
                style={{ width: "100%", padding: "0.75rem 0.875rem", borderRadius: 10, border: "1.5px solid #dde8dd", fontSize: "0.9375rem" }}
              />
            </div>

            {/* Value */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Displayed Value / Figure *
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 200, 3,500+, or [XX+]"
                required
                style={{ width: "100%", padding: "0.75rem 0.875rem", borderRadius: 10, border: "1.5px solid #dde8dd", fontSize: "0.9375rem", fontWeight: 700, color: "#2d6a2d" }}
              />
              <span style={{ fontSize: "0.75rem", color: "#6a7a64", marginTop: "0.25rem", display: "block" }}>
                Enter real figures (e.g. 200 or 5,000+) or enter [XX+] if awaiting field audit confirmation.
              </span>
            </div>

            {/* Description / Subtext */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424", marginBottom: "0.375rem" }}>
                Description / Subtext (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. (figures to be confirmed) or Audited by ABF field team"
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 8, border: "1.5px solid #dde8dd", fontSize: "0.875rem" }}
              />
            </div>

            {/* Sort Order & Advanced Key */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8faf8", padding: "0.875rem 1.25rem", borderRadius: 12, border: "1px solid #e8f0e8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#4a5a44" }}>Display Order:</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  style={{ width: 70, padding: "0.35rem 0.5rem", borderRadius: 6, border: "1px solid #dde8dd", fontSize: "0.8125rem" }}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowKeyControl(!showKeyControl)}
                style={{ background: "none", border: "none", color: "#6a7a64", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600, padding: 0 }}
              >
                ⚙️ {showKeyControl ? "Hide Identifier" : "Key: " + (metricKey || "auto")}
              </button>
            </div>

            {showKeyControl && (
              <div style={{ background: "#f8faf6", padding: "0.75rem", borderRadius: 8, border: "1px solid #e0e8e0" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#4a5a44", marginBottom: "0.25rem" }}>
                  Internal Metric Key (e.g. books_available, schools_reached)
                </label>
                <input
                  type="text"
                  value={metricKey}
                  onChange={(e) => {
                    setMetricKey(e.target.value);
                    setIsKeyCustomized(true);
                  }}
                  placeholder="books_available"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: 6, border: "1px solid #dde8dd", fontSize: "0.8125rem" }}
                />
              </div>
            )}
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
              {saving ? "Saving to Database..." : isEditing ? "Save Changes" : "Create Statistic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
