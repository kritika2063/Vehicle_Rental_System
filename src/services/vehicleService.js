// src/services/vehicleService.js
// SCRUM-88 update: update() now accepts FormData directly from VehicleForm
// (VehicleForm builds the FormData itself including replace_file[]/replace_index[])

import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost/Vehicle_Rental_System/backend";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) window.location.href = "/login";
    return Promise.reject(err);
  }
);

// GET all vehicles
export async function getAll() {
  const { data } = await api.get("/vehicles/get_vehicles.php");
  return data.vehicles ?? data;
}

// GET single vehicle by id
export async function getById(id) {
  const { data } = await api.get(`/admin/vehicles.php?id=${id}`);
  return data.vehicle ?? data;
}

// POST — create new vehicle
// formData is a plain object; we build FormData here
export async function create(formData) {
  // If VehicleForm passes a FormData directly, send it as-is
  if (formData instanceof FormData) {
    const { data } = await api.post("/admin/vehicles.php", formData);
    return data;
  }
  // Legacy plain-object path
  const fd = buildFormData(formData);
  const { data } = await api.post("/admin/vehicles.php", fd);
  return data;
}

// POST + _method=PUT — update existing vehicle
// VehicleForm now passes a FormData directly (includes replace_file/replace_index)
export async function update(id, formData) {
  // formData is already a FormData built by VehicleForm
  formData.append("_method", "PUT");
  formData.append("id", id);
  const { data } = await api.post("/admin/vehicles.php", formData);
  return data;
}

// DELETE vehicle
export async function remove(id) {
  const { data } = await api.delete(`/admin/vehicles.php?id=${id}`);
  return data;
}

// ── Helper for legacy plain-object calls ──────────────────────
function buildFormData(obj) {
  const fd = new FormData();
  Object.entries(obj).forEach(([key, val]) => {
    if (key === "images") {
      (val || []).forEach((file) => fd.append("images[]", file));
    } else if (key === "features" || key === "existing_images") {
      fd.append(key, JSON.stringify(val || []));
    } else if (val !== null && val !== undefined) {
      fd.append(key, val);
    }
  });
  return fd;
}