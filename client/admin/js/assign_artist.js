import { apiGet, apiPost, apiDelete } from "../../js/api.js";

const eventSelect = document.getElementById("eventSelect");
const artistSelect = document.getElementById("artistSelect");
const tableBody = document.getElementById("lineupTable");
const form = document.getElementById("assignForm");

// Load event list
async function loadEvents() {
    try {
        const events = await apiGet("/events/");
        eventSelect.innerHTML = events
        .map(e => `<option value="${e.id}">${e.title}</option>`)
        .join("");
        loadLineup();
    } catch (err) {
        console.error("Load events failed:", err.message);
    }
}

// Load artist list for dropdown
async function loadArtists() {
  try {
    const artists = await apiGet("/artists/");
    artistSelect.innerHTML = artists
    .map(a => `<option value="${a.id}">${a.name}</option>`)
    .join("");
  } catch (err) {
    console.error("Load Artist failed:", err.message);
  }
}

// Load lineup based on selected event
async function loadLineup() {
  const eventId = eventSelect.value;
  const lineup = await apiGet(`/events/lineup.php?event_id=${eventId}`);
  tableBody.innerHTML = "";

  lineup.forEach((l, index) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `
        <tr class="border-b">
          <td class="p-2">${index + 1}</td>
          <td class="p-2">${l.artist_name}</td>
          <td class="p-2">${l.stage || "-"}</td>
          <td class="p-2">${l.performance_time || "-"}</td>
          <td class="p-2">${l.lineup_order}</td>
          <td class="p-2">
            <button class="text-red-600 hover:underline" onclick="removeLineup(${l.id})">
              Remove
            </button>
          </td>
        </tr>
      `
    );
  });
}

// Remove artist from lineup
window.removeLineup = async function (pivotId) {
  if (!confirm("Remove artist from this event?")) return;

  await apiDelete(`/events/delete_lineup.php?pivot_id=${pivotId}`);
  loadLineup();
};

// Assign artist
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    event_id: eventSelect.value,
    artist_id: artistSelect.value,
    performance_time: performance_time.value,
    stage: stage.value,
    lineup_order: Number(lineup_order.value),
  };

  await apiPost("/events/assign_artist.php", data);
  form.reset();
  loadLineup();
});

// INIT
eventSelect.addEventListener("change", loadLineup);
loadEvents();
loadArtists();
