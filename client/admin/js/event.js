import { apiGet, apiPost, apiPut, apiDelete } from "../../js/api.js";

const form = document.getElementById("eventForm");
const tableBody = document.querySelector("#eventTable tbody");
let editingId = null;

// Load all events
async function loadEvents() {
  try {
    const events = await apiGet("/events/");
    tableBody.innerHTML = "";

    events.forEach((ev, i) => {
      const row = `
        <tr>
          <td class="p-2">${i + 1}</td>
          <td class="p-2">${ev.title}</td>
          <td class="p-2">${ev.venue}</td>
          <td class="p-2">${ev.description}</td>
          <td class="p-2">${ev.start_datetime}</td>
          <td class="p-2">${ev.end_datetime}</td>
          <td class="p-2">${ev.capacity}</td>
          <td class="p-2 capitalize">${ev.status}</td>
          <td class="p-2">
            <button onclick="editEvent(${ev.id})" class="text-blue-500">Edit</button>
            <button onclick="deleteEvent(${ev.id})" class="text-red-500 ml-2">Delete</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Load events failed:", err.message);
  }
}

window.editEvent = async (id) => {
  try {
    const ev = await apiGet(`/events/show.php?id=${id}`);
    document.getElementById("eventId").value = ev.id;
    document.getElementById("title").value = ev.title;
    document.getElementById("venue").value = ev.venue;
    document.getElementById("description").value = ev.description;
    document.getElementById("start_datetime").value = ev.start_datetime.replace(" ", "T");
    document.getElementById("end_datetime").value = ev.end_datetime?.replace(" ", "T") || "";
    document.getElementById("capacity").value = ev.capacity;
    document.getElementById("status").value = ev.status;
    editingId = id;
  } catch (err) {
    alert("Failed to load event: " + err.message);
  }
};

window.deleteEvent = async (id) => {
  if (!confirm("Delete this event?")) return;
  try {
    await apiDelete(`/events/delete.php?id=${id}`);
    loadEvents();
  } catch (err) {
    alert("Delete failed: " + err.message);
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: form.title.value,
    venue: form.venue.value,
    description: form.description.value,
    start_datetime: form.start_datetime.value,
    end_datetime: form.end_datetime.value,
    capacity: form.capacity.value,
    status: form.status.value
  };

  try {
    if (editingId) {
      await apiPut(`/events/update.php?id=${editingId}`, data);
      editingId = null;
    } else {
      await apiPost("/events/create.php", data);
    }

    form.reset();
    loadEvents();
  } catch (err) {
    alert("Save failed: " + err.message);
  }
});

loadEvents();
