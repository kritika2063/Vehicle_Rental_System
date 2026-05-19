// src/component/VehicleForm.jsx
// SCRUM-88 fix: Admin can now replace a vehicle photo during edit
// Changes:
//   - Each existing image now has a "Replace" button (opens file picker for that slot)
//   - Replaced images are shown as preview immediately
//   - On submit, replaced slots send new File; kept slots send existing URL

import React, { useState, useEffect, useRef } from "react";

const VEHICLE_TYPES   = ["Car", "Bike", "Van", "Truck", "SUV", "Scooter"];
const FEATURE_OPTIONS = ["AC", "GPS", "Helmet", "Child Seat", "Bluetooth", "USB Charger", "Music System"];
const THIS_YEAR       = new Date().getFullYear();

const EMPTY = {
  name:               "",
  brand:              "",
  model:              "",
  year:               "",
  type:               "",
  price_per_day:      "",
  availability_start: "",
  availability_end:   "",
  features:           [],
  newImages:          [],   // File[] — brand new additions
  existingImages:     [],   // { url: string, replacement: File|null }[]
  //                           url = server path, replacement = null means keep, File means replace
};

function validate(f) {
  const e = {};
  if (!f.name.trim())        e.name          = "Vehicle name is required.";
  if (!f.brand.trim())       e.brand         = "Brand is required.";
  if (!f.model.trim())       e.model         = "Model is required.";
  if (!f.type)               e.type          = "Please select a type.";
  const yr = Number(f.year);
  if (!f.year || yr < 1990 || yr > THIS_YEAR + 1)
    e.year = `Enter a valid year (1990–${THIS_YEAR + 1}).`;
  if (!f.price_per_day || Number(f.price_per_day) <= 0)
    e.price_per_day = "Enter a price greater than 0.";
  if (!f.availability_start) e.availability_start = "Start date is required.";
  if (!f.availability_end)   e.availability_end   = "End date is required.";
  if (f.availability_start && f.availability_end &&
      f.availability_end < f.availability_start)
    e.availability_end = "End date must be after start date.";
  const totalImages = f.existingImages.length + f.newImages.length;
  if (totalImages === 0) e.images = "Upload at least one image.";
  return e;
}

function safeParse(val, fallback = []) {
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val) ?? fallback; }
  catch { return fallback; }
}

/**
 * VehicleForm
 * Props:
 *   initialData {object|null}  — null for Add, vehicle object for Edit
 *   onSubmit    {function}     — async (payload) => void
 *                                payload = { fields, existingImages, newImages }
 *   isLoading   {boolean}
 */
export default function VehicleForm({ initialData, onSubmit, isLoading }) {
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});

  // Refs: one global ref for adding new images, one per existing slot for replace
  const addFileRef     = useRef(null);
  const replaceRefs    = useRef([]); // array of refs, one per existing image slot

  // ── Pre-fill when editing ──────────────────────────────────────
  useEffect(() => {
    if (!initialData) { setForm(EMPTY); return; }

    const parsed = safeParse(initialData.images); // string[]
    setForm({
      name:               initialData.name               || "",
      brand:              initialData.brand              || "",
      model:              String(initialData.model       || ""),
      year:               String(initialData.year        || ""),
      type:               initialData.type               || "",
      price_per_day:      String(initialData.price_per_day || ""),
      availability_start: initialData.availability_start || "",
      availability_end:   initialData.availability_end   || "",
      features: Array.isArray(initialData.features)
        ? initialData.features : safeParse(initialData.features),
      newImages:      [],
      // Each existing image becomes an object so we can track replacements per slot
      existingImages: parsed.map((url) => ({ url, replacement: null, preview: null })),
    });
  }, [initialData]);

  // ── Cleanup object URLs on unmount ────────────────────────────
  useEffect(() => {
    return () => {
      form.existingImages.forEach((img) => { if (img.preview) URL.revokeObjectURL(img.preview); });
      form.newImages.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
    };
  }, []);

  // ── Generic field setter ──────────────────────────────────────
  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const toggleFeature = (feat) =>
    setForm((f) => ({
      ...f,
      features: f.features.includes(feat)
        ? f.features.filter((x) => x !== feat)
        : [...f.features, feat],
    }));

  // ── Add new images ────────────────────────────────────────────
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const withPreviews = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setForm((f) => ({ ...f, newImages: [...f.newImages, ...withPreviews] }));
    setErrors((er) => ({ ...er, images: undefined }));
    addFileRef.current.value = "";
  };

  const removeNewImage = (i) => {
    setForm((f) => {
      URL.revokeObjectURL(f.newImages[i].preview);
      return { ...f, newImages: f.newImages.filter((_, j) => j !== i) };
    });
  };

  // ── SCRUM-88 FIX: Replace an existing image ───────────────────
  const handleReplaceImage = (slotIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((f) => {
      const updated = [...f.existingImages];
      // Revoke old preview if there was one
      if (updated[slotIndex].preview) URL.revokeObjectURL(updated[slotIndex].preview);
      updated[slotIndex] = {
        ...updated[slotIndex],
        replacement: file,                        // the new File to upload
        preview:     URL.createObjectURL(file),   // shown immediately in UI
      };
      return { ...f, existingImages: updated };
    });

    // Reset the input so same file can be re-selected
    if (replaceRefs.current[slotIndex]) replaceRefs.current[slotIndex].value = "";
  };

  // ── Remove an existing image slot entirely ────────────────────
  const removeExistingImage = (i) => {
    setForm((f) => {
      const updated = [...f.existingImages];
      if (updated[i].preview) URL.revokeObjectURL(updated[i].preview);
      updated.splice(i, 1);
      return { ...f, existingImages: updated };
    });
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // Build FormData here so parent pages don't need to know the structure
    const fd = new FormData();
    fd.append("name",               form.name);
    fd.append("brand",              form.brand);
    fd.append("model",              form.model);
    fd.append("year",               form.year);
    fd.append("type",               form.type);
    fd.append("price_per_day",      form.price_per_day);
    fd.append("availability_start", form.availability_start);
    fd.append("availability_end",   form.availability_end);
    fd.append("features",           JSON.stringify(form.features));

    // Existing images: send kept URLs and replacements separately
    // kept_images[]  = URLs to keep as-is
    // replace_index[] + replace_file[] = which slot to replace and with what
    form.existingImages.forEach((img, idx) => {
      if (img.replacement) {
        // This slot is being replaced — send the new file + which index
        fd.append("replace_file[]",  img.replacement);
        fd.append("replace_index[]", String(idx));
      } else {
        // Keep the original server path
        fd.append("kept_images[]", img.url);
      }
    });

    // Brand new images (additions)
    form.newImages.forEach((n) => fd.append("images[]", n.file));

    await onSubmit(fd);
  };

  const imgBase = import.meta.env.VITE_API_BASE_URL || "http://localhost/Vehicle_Rental_System/backend";

  // ── Shared text input ─────────────────────────────────────────
  const Field = ({ label, name, type = "text", placeholder, min, max }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className={`form-control${errors[name] ? " is-invalid" : ""}`}
        type={type} value={form[name]} onChange={setField(name)}
        placeholder={placeholder} min={min} max={max} autoComplete="off"
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  // ── JSX ───────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Basic Info */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Basic Information</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><Field label="Vehicle Name *" name="name"  placeholder="e.g. Toyota Corolla" /></div>
            <div className="col-md-6"><Field label="Brand *"        name="brand" placeholder="e.g. Toyota" /></div>
            <div className="col-md-6"><Field label="Model *"        name="model" placeholder="e.g. Corolla" /></div>
            <div className="col-md-3"><Field label="Year *"         name="year"  type="number" placeholder={String(THIS_YEAR)} min="1990" max={String(THIS_YEAR + 1)} /></div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select
                  className={`form-control form-select${errors.type ? " is-invalid" : ""}`}
                  value={form.type} onChange={setField("type")}
                >
                  <option value="">Select type…</option>
                  {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                {errors.type && <div className="invalid-feedback">{errors.type}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Availability */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Pricing &amp; Availability</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4"><Field label="Price / Day (NPR) *" name="price_per_day" type="number" placeholder="e.g. 3500" min="1" /></div>
            <div className="col-md-4"><Field label="Available From *"    name="availability_start" type="date" /></div>
            <div className="col-md-4"><Field label="Available Until *"   name="availability_end"   type="date" /></div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">Features</div>
        <div className="card-body d-flex flex-wrap gap-2">
          {FEATURE_OPTIONS.map((feat) => (
            <button
              key={feat} type="button"
              className={`btn btn-sm ${form.features.includes(feat) ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => toggleFeature(feat)}
            >
              {feat}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className={`card mb-4${errors.images ? " border-danger" : ""}`}>
        <div className="card-header fw-semibold">Vehicle Images *</div>
        <div className="card-body">

          {/* ── Existing images with Replace button (SCRUM-88) ── */}
          {form.existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-muted small mb-2 fw-semibold">
                Current Images — click <strong>Replace</strong> to swap a photo
              </p>
              <div className="d-flex flex-wrap gap-3">
                {form.existingImages.map((img, i) => (
                  <div key={i} style={{ width: 110 }}>

                    {/* Image preview — shows replacement immediately if selected */}
                    <div style={{ position: "relative", width: 110, height: 90, marginBottom: 6 }}>
                      <img
                        src={img.preview || `${imgBase}/${img.url}`}
                        alt=""
                        className="rounded border"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {/* Replaced badge */}
                      {img.replacement && (
                        <span
                          style={{
                            position: "absolute", bottom: 4, left: 4,
                            background: "#16a34a", color: "#fff",
                            fontSize: 10, padding: "1px 6px", borderRadius: 4,
                          }}
                        >
                          ✓ Replaced
                        </span>
                      )}
                      {/* Remove button */}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm p-0 d-flex align-items-center justify-content-center"
                        style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", fontSize: 10 }}
                        onClick={() => removeExistingImage(i)}
                        title="Remove image"
                      >✕</button>
                    </div>

                    {/* Hidden file input per slot */}
                    <input
                      type="file"
                      accept="image/*"
                      className="d-none"
                      ref={(el) => (replaceRefs.current[i] = el)}
                      onChange={(e) => handleReplaceImage(i, e)}
                    />

                    {/* Replace button */}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm w-100"
                      style={{ fontSize: 11 }}
                      onClick={() => replaceRefs.current[i]?.click()}
                    >
                      🔄 Replace
                    </button>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Add new images ── */}
          <div
            className="border border-2 rounded-3 p-4 text-center mb-3"
            style={{ cursor: "pointer", borderStyle: "dashed" }}
            onClick={() => addFileRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
              if (!files.length) return;
              const withPreviews = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
              setForm((fo) => ({ ...fo, newImages: [...fo.newImages, ...withPreviews] }));
              setErrors((er) => ({ ...er, images: undefined }));
            }}
          >
            <div style={{ fontSize: 28 }}>📁</div>
            <p className="mb-1 fw-semibold">Click or drag &amp; drop to add more images</p>
            <p className="text-muted small mb-0">JPG, PNG, WEBP — max 5 MB each</p>
          </div>

          <input
            ref={addFileRef} type="file" accept="image/*"
            multiple className="d-none" onChange={handleAddImages}
          />

          {errors.images && <div className="text-danger small mb-2">{errors.images}</div>}

          {/* New image previews */}
          {form.newImages.length > 0 && (
            <div className="mt-3">
              <p className="text-muted small mb-2 fw-semibold">New Images to Add</p>
              <div className="d-flex flex-wrap gap-2">
                {form.newImages.map((n, i) => (
                  <div key={i} style={{ position: "relative", width: 90, height: 90 }}>
                    <img
                      src={n.preview} alt=""
                      className="rounded border"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm p-0 d-flex align-items-center justify-content-center"
                      style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", fontSize: 10 }}
                      onClick={() => removeNewImage(i)}
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Submit */}
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary px-4" disabled={isLoading}>
          {isLoading
            ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
            : initialData ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </div>

    </form>
  );
}