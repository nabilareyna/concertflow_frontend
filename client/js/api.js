export const API_BASE = "http://192.168.56.2/concertflow/server/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(method, endpoint, data = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const json = await res.json();
    if (json.status !== "success") throw new Error(json.message);

    return json.data || json;
  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
}

export const apiGet = (endpoint) => request("GET", endpoint);
export const apiPost = (endpoint, data) => request("POST", endpoint, data);
export const apiPut = (endpoint, data) => request("PUT", endpoint, data);
export const apiDelete = (endpoint) => request("DELETE", endpoint);
