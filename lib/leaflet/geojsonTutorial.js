/* geojsonTutorial.js */

//GeoJSON feature data
// The GeoJSON object defines a geographic feature with properties and geometry.
var geojsonFeature = {
    "type": "Feature", //Specifies that this is a GeoJSON feature
    "properties": {
      "name": "London", //A property with a name for the feature
      "popupContent": "This is London!", //Custom content for the popup
    },
    "geometry": {
      "type": "Point", //geometry type
      "coordinates": [-0.09, 51.505], //Longitude, Latitude
    }
  };
  
  //Initialize the map and set its view
  var map = L.map('mapid').setView([51.505, -0.09], 13);
  
  //add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 19,
  }).addTo(map);
  
  //Add a GeoJSON layer to map
  //L.geoJSON() adds GeoJSON data to the map and allows for customization
  L.geoJSON(geojsonFeature, {
    //onEachFeature is a callback function for customizing each feature in the layer.
    onEachFeature: function (feature, layer) {
      //check if the feature has a popupContent property and bind a popup to the layer.
      if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
      }
    }
  }).addTo(map);
  