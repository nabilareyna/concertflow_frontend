// client/js/lineup.js
import { apiGet } from "./api.js";

export async function loadLineup(eventId) {
  const lineupContainer = document.getElementById("lineup-container");
  if (!lineupContainer) return;

  lineupContainer.innerHTML = `<p class="text-gray-500">Loading lineup...</p>`;

  try {
    const lineup = await apiGet(`/events/lineup.php?event_id=${eventId}`);

    if (!lineup.length) {
      lineupContainer.innerHTML = `<p class="text-gray-500 italic">Lineup belum tersedia.</p>`;
      return;
    }

    const html = lineup
      .map(
        (item) => `
        <div class="flex justify-between items-center bg-white border border-gray-100 p-3 rounded mb-2 shadow-sm">
          <div>
            <p class="font-semibold text-gray-800">${item.artist_name}</p>
            <p class="text-sm text-gray-500">${item.genre ?? ""}</p>
          </div>
          <div class="text-right">
            <p class="text-indigo-600 font-medium">
              ${item.performance_time ? item.performance_time.slice(0,5) : "-"}
            </p>
            <p class="text-xs text-gray-400">${item.stage ?? "TBD"}</p>
          </div>
        </div>
      `
      )
      .join("");

    lineupContainer.innerHTML = html;
  } catch (err) {
    console.error("Failed to load lineup:", err);
    lineupContainer.innerHTML = `<p class="text-red-500">Gagal memuat lineup.</p>`;
  }
}
