import { apiGet } from "./api.js"
import { loadLineup } from "./lineup.js"

const params = new URLSearchParams(window.location.search)
const eventId = params.get("id")
const container = document.getElementById("event-detail")

async function loadDetail() {
  try {
    const eventData = await apiGet(`/events/show.php?id=${eventId}`)
    const tickets = await apiGet(`/events/tickets/index.php?event_id=${eventId}`)

    container.innerHTML = `
      <div class="mb-12">
        <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-10 border border-indigo-100 shadow-sm">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">${eventData.title}</h1>
          <div class="space-y-3">
            <div class="flex items-center gap-3 text-lg text-gray-700">
              <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 107.953 2 4.5 4.5 0 1-.758 4.97A4.5 4.5 0 1113.5 13z"></path></svg>
              <span>${eventData.venue}</span>
            </div>
            <div class="flex items-center gap-3 text-lg text-gray-700">
              <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v2h16V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a2 2 0 002 2h8a2 2 0 002-2H6z" clip-rule="evenodd"></path></svg>
              <span>${new Date(eventData.start_datetime).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div class="flex items-center gap-3 text-lg text-gray-700">
              <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"></path></svg>
              <span>${new Date(eventData.start_datetime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Available Tickets</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${tickets
            .map(
              (t) => `
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-1">${t.name}</h3>
                  <p class="text-sm text-gray-600">Category</p>
                </div>
              </div>
              <div class="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div class="flex justify-between">
                  <span class="text-gray-600">Price per ticket</span>
                  <span class="font-bold text-indigo-600 text-lg">Rp ${Number.parseInt(t.price).toLocaleString("id-ID")}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Available</span>
                  <span class="font-semibold text-gray-900">${t.stock - t.sold} tickets</span>
                </div>
              </div>
              <a href="checkout.html?ticket_id=${t.id}" class="block w-full text-center bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold">Buy Ticket</a>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `
    await loadLineup(eventId)
  } catch (err) {
    console.error(err)
    container.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg font-medium">Error loading event details: ${err.message}</div>`
  }
}

loadDetail()
