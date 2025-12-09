import { apiGet } from "./api.js"

const container = document.getElementById("eventsContainer")
const searchInput = document.getElementById("searchInput")
let allEvents = []

async function loadEvents() {
  try {
    const data = await apiGet("/events/index.php")
    allEvents = data

    renderEvents(allEvents)
  } catch (err) {
    container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">Error loading events: ${err.message}</div>`
  }
}

function renderEvents(events) {
  container.innerHTML = events
    .map(
      (e) => `
      <div class="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        
        <!-- Card header with gradient background -->
        <div class="h-32 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 relative overflow-hidden p-6 flex items-end">
          <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
          <div class="relative text-white text-4xl">♪</div>
        </div>

        <!-- Card body with event information -->
        <div class="p-6 space-y-4">
          <h3 class="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition">
            ${e.title}
          </h3>

          <div class="space-y-3 border-t border-gray-100 pt-4">
            <div class="flex items-start gap-3">
              <span class="text-gray-400 flex-shrink-0">📍</span>
              <span class="text-sm text-gray-600">${e.venue}</span>
            </div>

            <div class="flex items-start gap-3">
              <span class="text-gray-400 flex-shrink-0">📅</span>
              <span class="text-sm text-gray-600">${new Date(e.start_datetime).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>

          <a href="detail.html?id=${e.id}" class="inline-block w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-center">
            View Details
          </a>
        </div>
      </div>
    `,
    )
    .join("")
}

function filterEvents(query) {
  const filtered = allEvents.filter(
    (e) => e.title.toLowerCase().includes(query.toLowerCase()) || e.venue.toLowerCase().includes(query.toLowerCase()),
  )
  renderEvents(filtered)
}

searchInput.addEventListener("input", (e) => {
  filterEvents(e.target.value)
})

loadEvents()
