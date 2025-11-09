const API_BASE = "http://192.168.56.2/concertflow/server/api";

export async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.message);
  return json.data;
}

export async function apiPost(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.message);
  return json.data || json;
}

export async function apiPut(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.message);
  return json.data || json;
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    credentials: "include"
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.message);
  return json.data || json;
}