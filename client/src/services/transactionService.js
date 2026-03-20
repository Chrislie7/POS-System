const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/transaksi";

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

async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });
  } catch (_error) {
    throw new Error("Gagal terhubung ke server API");
  }

  const result = await parseResponse(response);

  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan saat memanggil API");
  }

  return result.data;
}

export async function getTransactions() {
  return request(API_BASE_URL);
}

export async function createTransaction(payload) {
  return request(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function deleteTransaction(id) {
  return request(`${API_BASE_URL}/${id}`, {
    method: "DELETE"
  });
}
