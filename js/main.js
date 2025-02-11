//Initialize the map and set its initial view
var map = L.map('map').setView([39.8283, -98.5795], 5); // Centered on the United States

//Add a tile layer to the map (OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  maxZoom: 19
}).addTo(map);

//Load the GeoJSON
fetch('data/hpai_cases_2025.geojson') //Path to the GeoJSON
  .then(response => response.json())
  .then(data => {
    //Add the GeoJSON layer to the map
    L.geoJson(data, {
      //Define what happens for each feature
      onEachFeature: function (feature, layer) {
        let popupContent = "<h3>Avian Influenza Report</h3>";
        for (let property in feature.properties) {
          popupContent += `<p><strong>${property}:</strong> ${feature.properties[property]}</p>`;
        }
        layer.bindPopup(popupContent); // Bind the popup with relevant properties
      },
      //Style the markers as circle markers
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    }).addTo(map);
  })
  .catch(err => console.error("Error loading GeoJSON data: ", err));
