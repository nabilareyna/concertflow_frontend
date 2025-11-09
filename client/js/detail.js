import { apiGet } from "./api.js";
import { loadLineup } from "./lineup.js";

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
const container = document.getElementById("event-detail");

async function loadDetail() {
  try {
    const eventData = await apiGet(`/events/show.php?id=${eventId}`);
    const tickets = await apiGet(`/events/tickets/index.php?event_id=${eventId}`);

    container.innerHTML = `
      <h2 class="text-2xl font-bold text-indigo-700">${eventData.title}</h2>
      <p class="text-gray-600 mb-3">${eventData.venue}</p>
      <p class="text-sm text-gray-500 mb-5">${new Date(eventData.start_datetime).toLocaleString()}</p>
      <h3 class="text-lg font-semibold mb-2">Available Tickets:</h3>
      ${tickets.map(t => `
        <div class="flex justify-between items-center border p-3 rounded mb-2 bg-white">
          <div>
            <p class="font-medium">${t.name}</p>
            <p class="text-sm text-gray-500">Rp ${parseInt(t.price).toLocaleString('id-ID')}</p>
            <p class="text-xs text-gray-400">Remaining: ${t.stock - t.sold}</p>
          </div>
          <a href="checkout.html?ticket_id=${t.id}" class="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">Buy</a>
        </div>
      `).join("")}
    `;
    await loadLineup(eventId);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="text-red-500">Error: ${err.message}</div>`;
  }
}

loadDetail();
