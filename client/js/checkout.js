// client/js/checkout.js
const API_BASE_TICKET = "http://192.168.56.2/concertflow/server/api/events";
const API_BASE = "http://192.168.56.2/concertflow/server/api";

const params = new URLSearchParams(window.location.search);
const ticketId = params.get('ticket_id');
const ticketInfoEl = document.getElementById('ticket-info');
const form = document.getElementById('checkout-form');
const result = document.getElementById('result');

let ticket = null;
let eventId = null;

async function fetchTicket() {
  try {
    // fetch ticket detail (simple query) - you might need endpoint server api to return single ticket
    const res = await fetch(`${API_BASE_TICKET}/tickets/show.php?id=${ticketId}`);
    const json = await res.json();
    if (json.status !== 'success') throw new Error(json.message || 'Ticket fetch failed');
    ticket = json.data;
    eventId = ticket.event_id;
    ticketInfoEl.innerHTML = `
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-semibold">${ticket.name}</h3>
        <p class="text-sm">Price: Rp ${parseFloat(ticket.price).toLocaleString('id-ID')}</p>
        <p class="text-xs text-gray-500">Remaining: ${ticket.stock - ticket.sold}</p>
      </div>
    `;
  } catch (err) {
    ticketInfoEl.innerHTML = `<div class="text-red-500">Error loading ticket: ${err.message}</div>`;
    throw err;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.innerHTML = '';
  if (!ticket) {
    result.innerHTML = `<div class="text-red-500">Ticket data missing</div>`;
    return;
  }

  const payload = {
    customer: {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
    },
    event_id: eventId,
    items: [{ ticket_id: parseInt(ticketId), qty: parseInt(document.getElementById('qty').value) }],
    payment: { method: 'bank_transfer' }
  };

  try {
    const res = await fetch(`${API_BASE}/orders/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.status === 'success') {
      result.innerHTML = `<div class="text-green-600">Order success — Code: ${json.data.order_code} — Total: Rp ${json.data.total.toLocaleString('id-ID')}</div>`;
    } else {
      result.innerHTML = `<div class="text-red-500">Error: ${json.message}</div>`;
    }
  } catch (err) {
    result.innerHTML = `<div class="text-red-500">Network error: ${err.message}</div>`;
  }
});

(async () => {
  try {
    await fetchTicket();
  } catch (e) {
    console.error(e);
  }
})();
