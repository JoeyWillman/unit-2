/* adaptedTutorial.js */

//Declare map variable in global scope
var map;

//Function to initialize Leaflet map
function createMap() {
    //Create the map, set center and zoom level
    map = L.map('mapid', {
        center: [20, 0], //Center
        zoom: 2          //zoom level
    });

    //Add OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //Call function to load and display GeoJSON data
    getData();
}

//Function to define popups for each feature
function onEachFeature(feature, layer) {
    //Create an HTML string to hold all properties of the feature
    var popupContent = "";
    if (feature.properties) {
        for (var property in feature.properties) {
            popupContent += `<p>${property}: ${feature.properties[property]}</p>`;
        }
        //Bind the generated popup content to the layer
        layer.bindPopup(popupContent);
    }
}

//function to load GeoJSON data and map it
function getData() {
    //Load the GeoJSON data using fetch
    fetch("data/MegaCities.geojson")
        .then(function (response) {
            return response.json(); //Convert the response to JSON
        })
        .then(function (json) {
            // Define marker options
            var geojsonMarkerOptions = {
                radius: 8,             //Radius of the circle marker
                fillColor: "#ff7800",  //Fill color
                color: "#000",         //Border color
                weight: 1,             //Border weight
                opacity: 1,            //Border opacity
                fillOpacity: 0.8       //Fill opacity
            };

            //Create a Leaflet GeoJSON layer with the data
            L.geoJson(json, {
                //Convert GeoJSON points to circle markers
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
                // dd popups to each feature
                onEachFeature: onEachFeature
            }).addTo(map);
        });
}

//Call the createMap function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', createMap);
