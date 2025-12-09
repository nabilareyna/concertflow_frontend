import { apiGet } from "./api.js"

export async function loadLineup(eventId) {
  const lineupContainer = document.getElementById("lineup-container")
  if (!lineupContainer) return

  lineupContainer.innerHTML = `<p class="text-gray-500">Loading lineup...</p>`

  try {
    const lineup = await apiGet(`/events/lineup.php?event_id=${eventId}`)

    if (!lineup.length) {
      lineupContainer.innerHTML = `<p class="text-gray-500 italic">Lineup belum tersedia.</p>`
      return
    }

    const colors = [
      { bg: "bg-pink-50", border: "border-pink-200", accent: "text-pink-600", badge: "bg-pink-100" },
      { bg: "bg-yellow-50", border: "border-yellow-200", accent: "text-yellow-600", badge: "bg-yellow-100" },
      { bg: "bg-blue-50", border: "border-blue-200", accent: "text-blue-600", badge: "bg-blue-100" },
      { bg: "bg-purple-50", border: "border-purple-200", accent: "text-purple-600", badge: "bg-purple-100" },
    ]

    const html = lineup
      .map((item, index) => {
        const color = colors[index % colors.length]
        return `
        <div class="${color.bg} border ${color.border} rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">${item.artist_name}</h3>
              <p class="text-sm text-gray-600 mb-3">${item.genre ?? "Genre tidak tersedia"}</p>
              <div class="flex gap-2">
                ${item.stage ? `<span class="inline-block px-3 py-1 ${color.badge} ${color.accent} text-xs font-medium rounded-full">${item.stage}</span>` : ""}
              </div>
            </div>
            <div class="text-right">
              <p class="${color.accent} text-xl font-bold">
                ${item.performance_time ? item.performance_time.slice(0, 5) : "-"}
              </p>
              <p class="text-xs text-gray-500 mt-1">Performance time</p>
            </div>
          </div>
        </div>
      `
      })
      .join("")

    lineupContainer.innerHTML = html
  } catch (err) {
    console.error("Failed to load lineup:", err)
    lineupContainer.innerHTML = `<p class="text-red-500">Gagal memuat lineup.</p>`
  }
}
