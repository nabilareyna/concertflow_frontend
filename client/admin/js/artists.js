import { apiGet, apiPost, apiPut, apiDelete } from "../../js/api.js";

const form = document.getElementById("artistForm");
const tableBody = document.querySelector("#artistTable tbody");
let editingId = null;

// Load artist list
async function loadArtists() {
  try {
    const artists = await apiGet("/artists/");
    tableBody.innerHTML = "";

    artists.forEach((a, i) => {
      const row = `
        <tr>
          <td class="p-2">${i + 1}</td>
          <td class="p-2">${a.name}</td>
          <td class="p-2">${a.genre || "-"}</td>
          <td class="p-2">${a.contact || "-"}</td>
          <td class="p-2">
            <button onclick="editArtist(${a.id})" class="text-blue-500">Edit</button>
            <button onclick="deleteArtist(${a.id})" class="text-red-500 ml-2">Delete</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Load artists failed:", err.message);
  }
}

window.editArtist = async (id) => {
  try {
    const a = await apiGet(`/artists/show.php?id=${id}`);
    document.getElementById("artistId").value = a.id;
    document.getElementById("name").value = a.name;
    document.getElementById("bio").value = a.bio || "";
    document.getElementById("genre").value = a.genre || "";
    document.getElementById("contact").value = a.contact || "";
    editingId = id;
  } catch (err) {
    alert("Failed to load artist: " + err.message);
  }
};

window.deleteArtist = async (id) => {
  if (!confirm("Delete this artist?")) return;
  try {
    await apiDelete(`/artists/delete.php?id=${id}`);
    loadArtists();
  } catch (err) {
    alert("Delete failed: " + err.message);
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    bio: form.bio.value,
    genre: form.genre.value,
    contact: form.contact.value,
  };

  try {
    if (editingId) {
      await apiPut(`/artists/update.php?id=${editingId}`, data);
      editingId = null;
    } else {
      await apiPost("/artists/create.php", data);
    }

    form.reset();
    loadArtists();
  } catch (err) {
    alert("Save failed: " + err.message);
  }
});

loadArtists();
