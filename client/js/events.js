// client/js/events.js
import { apiGet } from "./api.js";

const container = document.getElementById("events");

async function loadEvents() {
  try {
    const data = await apiGet("/events/index.php");
    container.innerHTML = data
      .map(
        (e) => `
        <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 class="text-lg font-semibold text-indigo-600">${e.title}</h3>
          <p class="text-sm text-gray-600">${e.venue}</p>
          <p class="text-sm text-gray-500">${new Date(e.start_datetime).toLocaleString()}</p>
          <a href="detail.html?id=${e.id}" class="text-indigo-500 text-sm font-medium mt-2 inline-block">View Details →</a>
        </div>
      `
      )
      .join("");
  } catch (err) {
    container.innerHTML = `<div class="text-red-500">Error: ${err.message}</div>`;
  }
}

loadEvents();
