/* quickstartTutorial.js */

//Create the map and set its initial view
//L.map() initializes the map and binds it to the div with the ID "mapid".
//.setView(` sets the map's center and zoom level.
var map = L.map('mapid').setView([51.505, -0.09], 13);

//Add a tile layer to the map
//L.tileLayer() adds a tileset to the map using URL template and options object.
//.addTo() adds the tile layer to the map instance.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  maxZoom: 19, //Sets maximum zoom level for the tiles
}).addTo(map);

//Add a marker to the map
//L.marker() creates a marker at the coordinates and adds it to the map.
var marker = L.marker([51.5, -0.09]).addTo(map);
//.bindPopup() attaches a popup to the marker with custom content.
//.openPopup()displays the popup upon loading.
marker.bindPopup("<b>Hello world!</b><br>I am a marker.").openPopup();

//Add a circle to the map
//L.circle() creates a circle with specified coordinates, radius, and style options.
var circle = L.circle([51.508, -0.11], {
  color: 'red',         //Border color of circle
  fillColor: '#f03',    //Fill color of circle
  fillOpacity: 0.5,     //Transparency level of fill color
  radius: 500,          //Radius of circle in meters
}).addTo(map);
//Attach a popup to circle.
circle.bindPopup("I am a circle.");

//Add a polygon to the map
//L.polygon() creates a polygon with an array of coordinates.
var polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047],
]).addTo(map);
//Attach a popup to polygon.
polygon.bindPopup("I am a polygon.");

//Add a popup to display information when clicking map
//L.popup() creates a standalone popup without attaching it to specific layer.
var popup = L.popup();

//Define an event handler for clicks on the map
//.on() binds an event listener to map that listens for 'click' events.
function onMapClick(e) {
  popup
    .setLatLng(e.latlng) //Sets the popup's position to the clicked coordinates.
    .setContent("You clicked the map at " + e.latlng.toString()) //Sets the popup's content.
    .openOn(map); //Opens the popup on the map.
}

//Attach the click event listener to map.
map.on('click', onMapClick);
