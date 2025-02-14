//sInitialize the map and set its initial view
var map = L.map('map').setView([39.8283, -98.5795], 5); // Centered on the United States

//Add a tile layer to the map (OpenStreetMap tiles)
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

  //Parse the detectionDate
  const detection = new Date(detectionDate); // Ensure it's in a valid date format
  const weekDifference = Math.floor((detection - startDate) / (7 * 24 * 60 * 60 * 1000)); //Weeks since startDate

  //Scale radius proportionally between min and max based on weekDifference
  const radius = minRadius + ((maxRadius - minRadius) * (totalWeeks - weekDifference) / totalWeeks);

  return Math.max(minRadius, Math.min(radius, maxRadius)); // Ensure radius stays within bounds
}

//Load the GeoJSON data
fetch('data/hpai_cases_2025.geojson') // Path to the GeoJSON file
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
        layer.bindPopup(popupContent); //Bind the popup with relevant properties
      },
      //Style the markers as proportional circle markers
      pointToLayer: function (feature, latlng) {
        const detectionDate = feature.properties["Date Detected"]; //Date Detected field in the dataset
        const radius = calcPropRadius(detectionDate); //Calculate radius based on detectionDate

        return L.circleMarker(latlng, {
          radius: radius,
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

//Add a legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  var weeks = [0, 1, 2, 3, 4, 5]; //Week intervals
  var minRadius = 5;
  var maxRadius = 20;

  // Create legend content
  div.innerHTML = '<h4>Detection Date</h4>';
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
