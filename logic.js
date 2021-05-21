//earthquake URL (Used 1 month data)
var eqdataurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

//Adjust Size of markers
function markSize(data){
  return data * 7;
}

//Adjust colors of markers based on magnitude
function markColor(data){
  if(data > 5){
    return 'red'
  }
  else if(data > 3){
    return 'yellow'
  }
  else if(data > 1){
    return 'green'
  }
  else {
    return 'black'
  }
}

// Get request for data 
d3.json(eqdataurl, function(data) {
  createFeatures(data.features);

});
function createFeatures(eqdata) {

  //Popup function with Earthquake data
  function popUp(feature, layer){
    layer.bindPopup("<h3>Place: " + feature.properties.place + "</h3><h3>Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  //Marker function to add size and color
  function marker(feature, location){
    var earthMark = {
      stroke: false,
      radius: markSize(feature.properties.mag),
      color: markColor(feature.properties.mag)
    }

    return L.circleMarker(location, earthMark);

  }

  //geojson layer
  var earthquakes = L.geoJSON(eqdata, {
    onEachFeature: popUp,
    pointToLayer: marker
  });

  //create map function
  createmap(earthquakes);
}

function createmap(earthquakes) {
  //Darkmap Layer
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  // Streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  // light map layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Define a basemaps and an key option to change between them
  var basemaps = {
    "Dark Map": darkmap,
    "Street Map": streetmap,
    "Light Map": lightmap
  };
  var overlaymaps = {
    Earthquakes: earthquakes
  };
  // Create a map object and define the center 
  var finalmap = L.map("mapid", {
    center: [
      40, -97
    ],
    zoom: 4.5,
    layers: [darkmap, earthquakes]
  });

  // Make legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"), 
      magnitudeGrades = [0, 1, 3, 5],
      labels = [];

    
    
    for (var i = 0; i < magnitudeGrades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markColor(magnitudeGrades[i] + 1) + '"></i> ' +
            magnitudeGrades[i] + (magnitudeGrades[i + 1] ? '&ndash;' + magnitudeGrades[i + 1] + '<br>' : '+');
    }
    return div;
  };
// Display legend
  legend.addTo(finalmap);
  // Add the layer control to the map
  L.control.layers(basemaps, overlaymaps, {
    collapsed: false
  }).addTo(finalmap);
}
