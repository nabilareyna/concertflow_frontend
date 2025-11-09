import { apiGet, apiPost } from "../../js/api.js";

async function loadProfile() {
  try {
    const data = await apiGet("/admin/profile.php");
    document.getElementById("adminName").textContent = data.name;
    localStorage.setItem("adminRole", data.role);
  } catch (err) {
    window.location.href = "login.html";
  }
}

loadProfile();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await apiPost("/admin/logout.php", {});
  localStorage.clear();
  window.location.href = "login.html";
});
