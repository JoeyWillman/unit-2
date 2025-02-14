//Initialize the map and set its initial view
var map = L.map('map').setView([39.8283, -98.5795], 5); // Centered on the United States

//Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  maxZoom: 19
}).addTo(map);

//Function to calculate proportional symbol radius based on weeks
function calcPropRadius(detectionDate) {
  const minRadius = 5; //Minimum size for the symbols
  const maxRadius = 20; //Maximum size for the symbols
  const startDate = new Date('2025-01-01'); //Start of the 6-week period
  const endDate = new Date('2025-02-12'); //End of the 6-week period
  const totalWeeks = 6;

  // Parse the detectionDate
  const detection = new Date(detectionDate); //Ensure it's in a valid date format
  const weekDifference = Math.floor((detection - startDate) / (7 * 24 * 60 * 60 * 1000)); //Weeks since startDate

  //Scale radius proportionally between min and max based on weekDifference
  const radius = minRadius + ((maxRadius - minRadius) * (totalWeeks - weekDifference) / totalWeeks);

  return Math.max(minRadius, Math.min(radius, maxRadius)); //Ensure radius stays within bounds
}

//Function to create circle markers with proportional symbols and popups
function pointToLayer(feature, latlng) {
  // Marker options
  var options = {
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  //Calculate the radius based on the detection date
  const detectionDate = feature.properties["Date Detected"];
  options.radius = calcPropRadius(detectionDate);

  //Create the circle marker layer
  const layer = L.circleMarker(latlng, options);

  //Build popup content
  let popupContent = "<p><strong>State:</strong> " + feature.properties.State + "</p>";
  popupContent += "<p><strong>County:</strong> " + feature.properties.County + "</p>";
  popupContent += "<p><strong>Collection Date:</strong> " + feature.properties["Collection Date"] + "</p>";
  popupContent += "<p><strong>Date Detected:</strong> " + detectionDate + "</p>";
  popupContent += "<p><strong>HPAI Strain:</strong> " + feature.properties["HPAI Strain"] + "</p>";
  popupContent += "<p><strong>Bird Species:</strong> " + feature.properties["Bird Species"] + "</p>";

  //Bind popup with offset to avoid overlapping the symbol
  layer.bindPopup(popupContent, {
    offset: new L.Point(0, -options.radius)
  });

  return layer;
}

//Function to create proportional symbols and add them to the map
function createPropSymbols(data, map) {
  L.geoJson(data, {
    pointToLayer: pointToLayer
  }).addTo(map);
}

//Load the GeoJSON data and add to the map
fetch('data/hpai_cases_2025.geojson')
  .then(response => response.json())
  .then(data => {
    createPropSymbols(data, map);
  })
  .catch(err => console.error("Error loading GeoJSON data: ", err));

//Add a legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  var weeks = [0, 1, 2, 3, 4, 5]; //Week intervals
  var minRadius = 5;
  var maxRadius = 20;

  //Create legend content
  div.innerHTML = '<h4>Weekly Detections</h4>';
  for (var i = 0; i < weeks.length; i++) {
    var radius = minRadius + ((maxRadius - minRadius) * (weeks.length - i - 1) / weeks.length);
    div.innerHTML +=
      `<div style="display: flex; align-items: center; margin-bottom: 5px;">
        <svg width="30" height="30">
          <circle cx="15" cy="15" r="${radius}" fill="#ff7800" stroke="#000" stroke-width="1"></circle>
        </svg>
        <span style="margin-left: 5px;">Week ${i + 1}</span>
      </div>`;
  }
  return div;
};

legend.addTo(map);
