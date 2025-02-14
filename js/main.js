//Initialize the map and set its initial view
var map = L.map('map', { zoomControl: false, dragging: true }).setView([39.8283, -98.5795], 5); // Centered on the United States

//Disable zoom functionality
map.scrollWheelZoom.disable();
map.doubleClickZoom.disable();
map.boxZoom.disable();
map.touchZoom.disable();
map.dragging.disable();

//Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  maxZoom: 5, // Lock the zoom level
  minZoom: 5
}).addTo(map);

//Function to calculate proportional symbol radius based on weeks
function calcPropRadius(detectionDate) {
  const minRadius = 5; //Minimum size for the symbols
  const maxRadius = 20; //Maximum size for the symbols
  const startDate = new Date('2025-01-01'); //Start of the 6-week period
  const totalWeeks = 6;

  // Parse the detectionDate
  const detection = new Date(detectionDate);
  const weekDifference = Math.floor((detection - startDate) / (7 * 24 * 60 * 60 * 1000)); //Weeks since startDate

  //Scale radius proportionally between min and max based on weekDifference
  const radius = minRadius + ((maxRadius - minRadius) * (totalWeeks - weekDifference) / totalWeeks);

  return Math.max(minRadius, Math.min(radius, maxRadius)); //Ensure radius stays within bounds
}

//Function to create circle markers with proportional symbols and popups
function pointToLayer(feature, latlng, currentWeek, showAll) {
  var options = {
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  //Filter points based on the selected week unless "showAll" is true
  const detectionDate = feature.properties["Date Detected"];
  const startDate = new Date('2025-01-01');
  const weekDifference = Math.floor((new Date(detectionDate) - startDate) / (7 * 24 * 60 * 60 * 1000));

  if (!showAll && weekDifference !== currentWeek) {
    return null; // Skip features not in the current week if showAll is false
  }

  //Calculate the radius based on the detection date
  options.radius = calcPropRadius(detectionDate);

  const layer = L.circleMarker(latlng, options);

  //Build popup content
  let popupContent = "<p><strong>State:</strong> " + feature.properties.State + "</p>";
  popupContent += "<p><strong>County:</strong> " + feature.properties.County + "</p>";
  popupContent += "<p><strong>Collection Date:</strong> " + feature.properties["Collection Date"] + "</p>";
  popupContent += "<p><strong>Date Detected:</strong> " + detectionDate + "</p>";
  popupContent += "<p><strong>HPAI Strain:</strong> " + feature.properties["HPAI Strain"] + "</p>";
  popupContent += "<p><strong>Bird Species:</strong> " + feature.properties["Bird Species"] + "</p>";

  layer.bindPopup(popupContent, {
    offset: new L.Point(0, -options.radius)
  });

  return layer;
}

//Function to create proportional symbols and add them to the map
function createPropSymbols(data, currentWeek, showAll = false) {
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return pointToLayer(feature, latlng, currentWeek, showAll);
    }
  }).addTo(map);
}

// Slider and Buttons for Weekly Interactions
function createSequenceControls(data) {
  var panel = L.control({ position: 'topright' });

  panel.onAdd = function () {
    var div = L.DomUtil.create('div', 'sequence-controls');

    div.innerHTML = `
      <button class="step" id="reverse">Reverse</button>
      <input class="range-slider" type="range" min="0" max="6" value="0" step="1">
      <button class="step" id="forward">Forward</button>
      <button id="show-all">Show All</button>
      <div class="slider-labels">
        ${Array.from({ length: 6 }, (_, i) => `<span>Week ${i + 1}</span>`).join('')}
        <span>All Data</span>
      </div>
    `;
    return div;
  };

  panel.addTo(map);

  const slider = document.querySelector('.range-slider');
  const buttons = document.querySelectorAll('.step');
  const showAllButton = document.querySelector('#show-all');
  let currentWeek = 0;

  function updateMap(showAll = false) {
    map.eachLayer(function (layer) {
      if (layer.feature) {
        map.removeLayer(layer);
      }
    });
    createPropSymbols(data, currentWeek, showAll);
  }

  slider.addEventListener('input', function () {
    currentWeek = parseInt(this.value);
    updateMap();
  });

  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      if (this.id === 'forward') {
        currentWeek = (currentWeek + 1) % 6;
      } else {
        currentWeek = (currentWeek - 1 + 6) % 6;
      }
      slider.value = currentWeek;
      updateMap();
    });
  });

  showAllButton.addEventListener('click', function () {
    updateMap(true); // Show all data
    slider.value = 6; // Set slider to "All Data" position
  });
}

//Load the GeoJSON data and initialize the map
fetch('data/hpai_cases_2025.geojson')
  .then((response) => response.json())
  .then((data) => {
    createPropSymbols(data, 0);
    createSequenceControls(data);
  })
  .catch((err) => console.error("Error loading GeoJSON data: ", err));

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
  div.innerHTML += `<div style="margin-top: 10px;"><strong>All Data:</strong> Includes all weekly detections</div>`;
  return div;
};

legend.addTo(map);

