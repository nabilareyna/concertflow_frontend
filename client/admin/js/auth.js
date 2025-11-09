import { apiPost } from "../../js/api.js";

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const data = await apiPost("/admin/login.php", {
      email: form.email.value,
      password: form.password.value
    });

    msg.textContent = "Login success!";
    msg.classList.replace("text-red-500", "text-green-600");
    localStorage.setItem("adminRole", data.admin.role);
    setTimeout(() => (window.location.href = "dashboard.html"), 1000);
  } catch (err) {
    msg.textContent = err.message;
  }
});
