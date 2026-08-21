import React, { useState, useRef } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "projects" | "posts" | "team" | "partners";
  slug?: string;
  required?: boolean;
  aspectRatio?: "cover" | "portrait" | "logo" | "square";
  helperText?: string;
}

/**
 * Compresses an image client-side before upload to optimize loading times and storage.
 */
async function compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    // If it's already small (< 400KB), return as is
    if (file.size < 400 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          file.type === "image/png" ? "image/png" : "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  slug = "asset",
  required = false,
  aspectRatio = "cover",
  helperText,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const cleanSlug = (slug || "asset")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "item";

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, WebP, or SVG).");
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image file is too large (maximum 10MB).");
      return;
    }

    setUploading(true);

    try {
      if (!isSupabaseConfigured()) {
        // If Supabase not configured in this environment, use object URL for local preview
        const localPreviewUrl = URL.createObjectURL(file);
        onChange(localPreviewUrl);
        setUploading(false);
        return;
      }

      // Compress large images
      const compressedBlob = await compressImage(file);
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const timestamp = Date.now();
      const filePath = `${folder}/${cleanSlug}-${timestamp}.${ext}`;

      // Upload to abf-assets bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("abf-assets")
        .upload(filePath, compressedBlob, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Retrieve public URL
      const { data: publicUrlData } = supabase.storage
        .from("abf-assets")
        .getPublicUrl(uploadData?.path || filePath);

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl);
      } else {
        throw new Error("Could not retrieve public URL for the uploaded image.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image. You can paste an image URL instead.");
      setShowUrlInput(true);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Preview container heights based on aspect ratio
  const previewHeight =
    aspectRatio === "portrait"
      ? 180
      : aspectRatio === "logo"
      ? 90
      : aspectRatio === "square"
      ? 140
      : 150;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
        <label style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#2c3424" }}>
          {label} {required && <span style={{ color: "#b91c1c" }}>*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{
            background: "none",
            border: "none",
            color: "#6a7a64",
            fontSize: "0.75rem",
            cursor: "pointer",
            fontWeight: 600,
            textDecoration: "underline",
            padding: 0,
          }}
        >
          {showUrlInput ? "Hide URL input" : "Or paste image link"}
        </button>
      </div>

      {helperText && (
        <p style={{ fontSize: "0.75rem", color: "#6a7a64", margin: "0 0 0.5rem", lineHeight: 1.4 }}>
          {helperText}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Image Present / Preview Box */}
      {value ? (
        <div
          style={{
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            border: "1.5px solid #d4e0d4",
            background: "#f8faf6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0.5rem",
          }}
        >
          <div
            style={{
              width: "100%",
              height: previewHeight,
              borderRadius: 8,
              overflow: "hidden",
              background: "#1a2218",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={value}
              alt="Selected preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: aspectRatio === "logo" ? "contain" : "cover",
              }}
              onError={() => {
                // Keep image placeholder if URL fails to render
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: "0.5rem",
              padding: "0 0.25rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#6a7a64", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
              {value.startsWith("blob:") ? "Local preview ready" : value.split("/").pop()}
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  background: "#f0f7f0",
                  border: "1px solid #d4edd4",
                  borderRadius: 6,
                  padding: "0.3rem 0.6rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#2d6a2d",
                  cursor: "pointer",
                }}
              >
                {uploading ? "Uploading..." : "Replace Image"}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 6,
                  padding: "0.3rem 0.6rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#b91c1c",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#2d6a2d" : "#d4e0d4"}`,
            background: dragOver ? "#f0f7f0" : "#fafcf9",
            borderRadius: 12,
            padding: "1.5rem 1rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#e8f5e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              color: "#2d6a2d",
            }}
          >
            {uploading ? "⏳" : "📷"}
          </div>

          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1a2218" }}>
              {uploading ? "Uploading image..." : "Choose an image to upload"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6a7a64", marginTop: "0.15rem" }}>
              Drag and drop or click to browse (JPEG, PNG, WebP)
            </div>
          </div>

          <button
            type="button"
            disabled={uploading}
            style={{
              background: "#2d6a2d",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "0.4rem 0.875rem",
              fontSize: "0.8125rem",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: "0.25rem",
            }}
          >
            {uploading ? "Processing..." : "Select File"}
          </button>
        </div>
      )}

      {/* Optional Manual URL Fallback Input */}
      {showUrlInput && (
        <div style={{ marginTop: "0.625rem" }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              width: "100%",
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              border: "1.5px solid #dde8dd",
              fontSize: "0.8125rem",
              background: "white",
            }}
          />
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#b91c1c",
            background: "#fef2f2",
            padding: "0.4rem 0.6rem",
            borderRadius: 6,
            marginTop: "0.5rem",
            border: "1px solid #fecaca",
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
