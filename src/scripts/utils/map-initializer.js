export function initMap(containerId, coordinates, popupText) {
  const map = L.map(containerId).setView(coordinates, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const marker = L.marker(coordinates).addTo(map);
  
  if (popupText) {
    marker.bindPopup(popupText).openPopup();
  }

  return map;
}

export function initMapForAddStory(containerId) {
  // Default ke lokasi Indonesia (Jakarta)
  const defaultLocation = [-6.200000, 106.816666];
  const map = L.map(containerId).setView(defaultLocation, 5);
  
  // Tambahkan beberapa layer peta untuk opsi yang lebih beragam
  const baseMaps = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "Satelit": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    "Terrain": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    })
  };
  
  // Tambahkan layer default
  baseMaps["OpenStreetMap"].addTo(map);
  
  // Tambahkan kontrol layer
  L.control.layers(baseMaps).addTo(map);
  
  // Tambahkan marker yang dapat dipindahkan
  const marker = L.marker(defaultLocation, {
    draggable: true
  }).addTo(map);
  
  const selectedLocationText = document.getElementById('selectedLocation');
  
  // Fungsi untuk memperbarui teks lokasi
  const updateLocation = (latlng) => {
    if (selectedLocationText) {
      selectedLocationText.textContent = `Lokasi dipilih: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
    }
  };
  
  // Event ketika marker dipindahkan
  marker.on('dragend', function(event) {
    updateLocation(marker.getLatLng());
  });
  
  // Event ketika peta diklik
  map.on('click', function(event) {
    marker.setLatLng(event.latlng);
    updateLocation(event.latlng);
  });
  
  return { map, marker, updateLocation };
}