const chargingStationsApiKey = "78afe8af-c2c3-4f06-bede-9ccadfd685e8"; // Replace with OpenChargeMap API key

let map;

// Initialize the Leaflet map
function initMap() {
  map = L.map("map").setView([30.7333, 76.7794], 13); // Default: Chandigarh, India

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Fetch EV charging stations for Chandigarh
  fetchStations(30.7333, 76.7794);
}

// Fetch EV charging station data from OpenChargeMap API
function fetchStations(latitude, longitude) {
  const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${latitude}&longitude=${longitude}&distance=10&maxresults=10&key=${chargingStationsApiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((stations) => {
      displayStations(stations);
    })
    .catch((error) => console.error("Error fetching station data:", error));
}

// Display stations on the map and in the list
function displayStations(stations) {
  const list = document.getElementById("stations-list");
  list.innerHTML = ""; // Clear previous results

  if (stations.length === 0) {
    list.innerHTML = "<li>No stations found.</li>";
    return;
  }

  stations.forEach((station) => {
    const { Title, Latitude, Longitude, AddressLine1 } = station.AddressInfo;

    // Add marker to the map
    L.marker([Latitude, Longitude])
      .addTo(map)
      .bindPopup(`<b>${Title}</b><br>${AddressLine1}`);

    // Add station to the list with "Locate" and "Navigate" buttons
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <span>${Title} - ${AddressLine1}</span>
        <div class="button-group">
          <button class="locate-btn" onclick="locateOnMap(${Latitude}, ${Longitude})">Locate</button>
          <button class="navigate-btn" onclick="openGoogleMaps(${Latitude}, ${Longitude})">Navigate</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  });
}

// Locate the station on the map
function locateOnMap(lat, lng) {
  map.setView([lat, lng], 15);
}

// Open Google Maps for navigation
function openGoogleMaps(destLat, destLng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
  window.location.href = url; // Redirect in the same tab
}

// Fetch suggestions for city search using Nominatim API
function fetchSuggestions() {
  const query = document.getElementById("city-input").value.trim();

  if (!query) {
    document.getElementById("suggestions").innerHTML = "";
    return;
  }

  const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

  fetch(geocodeUrl)
    .then((response) => response.json())
    .then((data) => {
      const suggestions = document.getElementById("suggestions");
      suggestions.innerHTML = ""; // Clear previous suggestions

      data.slice(0, 5).forEach((result) => {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.className = "suggestion";
        suggestionDiv.textContent = result.display_name;
        suggestionDiv.onclick = () => selectCity(result.lat, result.lon, result.display_name);
        suggestions.appendChild(suggestionDiv);
      });
    })
    .catch((error) => console.error("Error fetching suggestions:", error));
}

// Select a city from suggestions
function selectCity(lat, lon, cityName) {
  document.getElementById("city-input").value = cityName; // Set selected city
  document.getElementById("suggestions").innerHTML = ""; // Clear suggestions
  map.setView([lat, lon], 13); // Center map on the selected city
  fetchStations(lat, lon); // Fetch stations for the selected city
}

// Initialize the map when the page loads
document.addEventListener("DOMContentLoaded", initMap);
// Sidebar toggle functionality
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggle-sidebar-btn");
  sidebar.classList.toggle("open");

  // Adjust toggle button position based on sidebar state
  if (sidebar.classList.contains("open")) {
    toggleBtn.style.left = "265px"; // Button moves right when sidebar is open
  } else {
    toggleBtn.style.left = "15px"; // Button returns to default position
  }
}
const icon = document.querySelector(".loading i");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");

icon.addEventListener("click", () => {
  container.classList.add("change");
});

closeBtn.addEventListener("click", () => {
  container.classList.remove("change");
});
