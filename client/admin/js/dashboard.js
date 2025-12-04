import { apiGet } from "../../js/api.js";

async function loadProfile() {
  try {
    const data = await apiGet("/admin/profile.php");

    // amanin biar gak error meski data kosong
    document.getElementById("adminName").textContent = data?.name || "Admin";
  } catch (err) {
    console.warn("Auth error:", err.message);
    localStorage.clear();
    window.location.href = "login.html";
  }
}

loadProfile();

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});
