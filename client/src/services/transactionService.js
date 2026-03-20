const STORAGE_KEY = "pos_porto_admin_session";

function getApiBaseUrl() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const legacyUrl = import.meta.env.VITE_API_URL;

  if (baseUrl) {
    return baseUrl.replace(/\/$/, "");
  }

  if (legacyUrl) {
    return legacyUrl.replace(/\/transaksi$/, "");
  }

  return "http://localhost:3000/api";
}

const API_BASE_URL = getApiBaseUrl();

function getStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getSession() {
  return getStoredSession();
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return {
    message: text || "Response tidak dikenali",
    data: null
  };
}

async function request(path, options = {}) {
  let response;
  const session = getStoredSession();
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    ...(options.headers || {})
  };

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch (_error) {
    throw new Error("Gagal terhubung ke server API");
  }

  if (options.expectBlob) {
    if (!response.ok) {
      const result = await parseResponse(response);
      throw new Error(result.message || "Gagal memproses file export");
    }

    return response.blob();
  }

  const result = await parseResponse(response);

  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan saat memanggil API");
  }

  return result.data;
}

export async function loginAdmin(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getProducts() {
  return request("/products");
}

export async function getTransactions() {
  return request("/transaksi");
}

export async function createTransaction(payload) {
  return request("/transaksi", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function deleteTransaction(id) {
  return request(`/transaksi/${id}`, {
    method: "DELETE"
  });
}

export async function getDashboardSummary() {
  return request("/dashboard/summary");
}

export async function exportTransactionsExcel() {
  return request("/transaksi/export/excel", {
    method: "GET",
    expectBlob: true,
    headers: {
      Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  });
}

export { API_BASE_URL };
