/* geojsonTutorial.js */

// GeoJSON data
var geojsonFeature = {
    "type": "Feature",
    "properties": {
      "name": "London",
      "popupContent": "This is London!"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [-0.09, 51.505]
    }
  };
  
  // Initialize the map and set its view
  var map = L.map('mapid').setView([51.505, -0.09], 13);
  
  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 19,
  }).addTo(map);
  
  // Add GeoJSON layer
  L.geoJSON(geojsonFeature, {
    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
      }
    }
  }).addTo(map);
  