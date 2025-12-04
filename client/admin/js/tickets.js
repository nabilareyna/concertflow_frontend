import { apiGet, apiPost, apiPut, apiDelete } from "../../js/api.js";

const eventSelect = document.getElementById("eventSelect");
const tableBody = document.getElementById("ticketTable");

// Load Events
async function loadEvents() {
  try {
    const events = await apiGet("/events/");

    eventSelect.innerHTML = events
      .map(e => `<option value="${e.id}">${e.title}</option>`)
      .join("");

    loadTickets();
  } catch (err) {
    console.error("Load events failed:", err);
  }
}

// Load Ticket Table
async function loadTickets() {
  const id = eventSelect.value;

  try {
    const tickets = await apiGet(`/events/tickets/?event_id=${id}`);

    tableBody.innerHTML = tickets
      .map(t => `
        <tr class="border">
          <td class="p-2">${t.name}</td>
          <td class="p-2">${t.price}</td>
          <td class="p-2">${t.stock}</td>
          <td class="p-2 text-gray-500">${t.sold}</td>
          <td class="p-2">${t.sku}</td>
          <td class="p-2">${t.status}</td>
          <td class="p-2 space-x-2">
            <button onclick="editTicket(${t.id})" class="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
            <button onclick="deleteTicket(${t.id})" class="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
          </td>
        </tr>
      `)
      .join("");

  } catch (err) {
    console.error("Load tickets failed:", err);
  }
}

// Edit Ticket
window.editTicket = async (id) => {
  const name = prompt("New ticket name:");
  const price = prompt("New price:");
  const stock = prompt("New stock:");
  const sku = prompt("New SKU:");
  const status = prompt("New status (active/inactive):");

  if (!name || !price || !stock || !sku || !status) return;

  try {
    await apiPut(`/events/tickets/update.php?id=${id}`, {
      name,
      price,
      stock,
      sku,
      status
    });

    loadTickets();
  } catch (err) {
    alert("Failed to update ticket");
  }
};


// Delete Ticket
window.deleteTicket = async (id) => {
  if (!confirm("Delete this ticket?")) return;

  await apiDelete(`/events/tickets/delete.php?id=${id}`);
  loadTickets();
};

// Add Ticket
document.getElementById("btnAdd").onclick = async () => {
  try {
    await apiPost("/events/tickets/create.php", {
      event_id: eventSelect.value,
      name: document.getElementById("tName").value,
      price: document.getElementById("tPrice").value,
      stock: document.getElementById("tStock").value,
      sku: document.getElementById("tSku").value,
      status: document.getElementById("tStatus").value,
    });

    loadTickets();
  } catch (err) {
    console.error(err);
  }
};

eventSelect.onchange = loadTickets;
loadEvents();
