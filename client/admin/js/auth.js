import { apiPost } from "../../js/api.js";

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const res = await apiPost("/admin/login.php", {
      email: form.email.value,
      password: form.password.value,
    });

    // pastiin token ada
    if (res.token) {
      localStorage.setItem("token", res.token);
      msg.textContent = "Login success!";
      msg.classList.replace("text-red-500", "text-green-600");
      // delay dikit biar token ke-save dulu sebelum redirect
      setTimeout(() => (window.location.href = "dashboard.html"), 700);
    } else {
      msg.textContent = "Token not received!";
    }
  } catch (err) {
    msg.textContent = err.message || "Login failed!";
  }
});
