/* quickstartTutorial.js */

// Initialize the map and set its view
var map = L.map('mapid').setView([51.505, -0.09], 13);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  maxZoom: 19,
}).addTo(map);

// Add a marker
var marker = L.marker([51.5, -0.09]).addTo(map);
marker.bindPopup("<b>Hello world!</b><br>I am a marker.").openPopup();

// Add a circle
var circle = L.circle([51.508, -0.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500
}).addTo(map);
circle.bindPopup("I am a circle.");

// Add a polygon
var polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047]
]).addTo(map);
polygon.bindPopup("I am a polygon.");

// Add a click event
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on('click', onMapClick);
