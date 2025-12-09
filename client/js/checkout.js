const API_BASE_TICKET = "http://192.168.56.2/concertflow/server/api/events";
const API_BASE = "http://192.168.56.2/concertflow/server/api";

const params = new URLSearchParams(window.location.search);
const ticketId = params.get("ticket_id");
const ticketInfoEl = document.getElementById("ticket-info");
const form = document.getElementById("checkout-form");
const result = document.getElementById("result");

let ticket = null;
let eventId = null;

async function fetchTicket() {
  try {
    const res = await fetch(`${API_BASE_TICKET}/tickets/show.php?id=${ticketId}`);
    const json = await res.json();
    if (json.status !== "success") throw new Error(json.message || "Ticket fetch failed");
    ticket = json.data;
    eventId = ticket.event_id;

    ticketInfoEl.innerHTML = `
      <div class="space-y-4">
        <div class="pb-4 border-b border-gray-100">
          <p class="text-sm text-gray-600 mb-1">Ticket Type</p>
          <h3 class="text-xl font-bold text-gray-900">${ticket.name}</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Price</span>
            <span class="font-bold text-indigo-600 text-lg">Rp ${Number.parseFloat(ticket.price).toLocaleString("id-ID")}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Available</span>
            <span class="text-gray-900 font-semibold">${ticket.stock - ticket.sold}</span>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    ticketInfoEl.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">Error loading ticket: ${err.message}</div>`;
    throw err;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  result.innerHTML = "";
  
  if (!ticket) {
    result.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">Ticket data missing</div>`;
    return;
  }

  // Validasi kuantitas
  const qty = Number.parseInt(document.getElementById("qty").value);
  const availableStock = ticket.stock - ticket.sold;
  
  if (qty < 1) {
    result.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">Quantity must be at least 1</div>`;
    return;
  }
  
  if (qty > availableStock) {
    result.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">Only ${availableStock} tickets available</div>`;
    return;
  }

  // Validasi form customer
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  
  if (!name || !email || !phone) {
    result.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">Please fill all customer details</div>`;
    return;
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    result.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">Please enter a valid email</div>`;
    return;
  }

  const payload = {
    customer: {
      name: name,
      email: email,
      phone: phone
    },
    event_id: eventId,
    items: [{ 
      ticket_id: Number.parseInt(ticketId), 
      qty: qty 
    }]
    // payment_method tidak perlu dikirim karena sudah default 'bank_transfer' di back-end
  };

  try {
    const res = await fetch(`${API_BASE}/orders/create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const json = await res.json();
    
    if (json.status === "success") {
      result.innerHTML = `
        <div class="bg-green-50 border border-green-200 rounded-xl p-6">
          <p class="text-green-900 font-semibold mb-2">Order Completed Successfully</p>
          <p class="text-green-700 text-sm mb-3">Order Code: <span class="font-bold">${json.data.order_code}</span></p>
          <p class="text-green-700 text-sm mb-3">Order ID: <span class="font-bold">${json.data.order_id}</span></p>
          <p class="text-green-700 text-sm">Total: <span class="font-bold">Rp ${Number.parseFloat(json.data.total_amount).toLocaleString("id-ID")}</span></p>
          <div class="mt-4 pt-4 border-t border-green-200">
            <p class="text-green-700 text-sm">Payment Method: <span class="font-bold">Bank Transfer</span></p>
            <p class="text-green-700 text-sm mt-1">Status: <span class="font-bold">Pending</span></p>
          </div>
          <div class="mt-4">
            <a href="../tickets/my-tickets.html" class="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
              View My Tickets
            </a>
          </div>
        </div>
      `;
      
      // Reset form setelah sukses
      form.reset();
    } else {
      result.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">Error: ${json.message}</div>`;
    }
  } catch (err) {
    result.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">Network error: ${err.message}</div>`;
  }
});

(async () => {
  try {
    await fetchTicket();
  } catch (e) {
    console.error(e);
  }
})();