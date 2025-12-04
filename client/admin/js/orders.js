import { apiGet, apiPost, apiPut, apiDelete } from "../../js/api.js";

async function loadOrders() {
  try {
    const res = await apiGet("/orders/");
    const orders = res.data;

    const table = document.getElementById("ordersTable");
    table.innerHTML = "";

    orders.forEach(o => {
      table.innerHTML += `
        <tr>
          <td class="border p-2">${o.id}</td>
          <td class="border p-2">${o.customer_name}</td>
          <td class="border p-2">${o.event_title}</td>
          <td class="border p-2">Rp ${o.total.toLocaleString()}</td>
          <td class="border p-2">
            <span class="px-2 py-1 rounded text-white 
              ${o.status === 'paid' ? 'bg-green-600' :
                o.status === 'pending' ? 'bg-yellow-500' : 'bg-red-600'}">
              ${o.status}
            </span>
          </td>
          <td class="border p-2">
            <a href="detail.html?id=${o.id}" 
               class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              View
            </a>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load orders");
  }
}

loadOrders();
