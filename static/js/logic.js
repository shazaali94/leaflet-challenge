// Create map
let map = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    
  });
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  let legend = L.control({position:"bottomright"});  

  legend.onAdd = function(map)
  {let div = L.DomUtil.create("div","info legend")

let range = ["-10-10 km","10-30 km","30-50 km","50-70 km","70-90 km","90+ km"];
let colors = ["#7f0000","#bd0026","#fc4e2a","#fd8d3c","#feb24c","#fed976"];
for (let i = 0; i < colors.length; i++) {
  div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
    + range[i] + "<br>";
}
return div
  }
legend.addTo(map);

// Function to calculate the radius based on magnitude
function getRadius(magnitude) {
  
    if (magnitude === 0) {
        return 1; 
    }
  
    // Calculate the radius based on magnitude
    return Math.pow(magnitude, 2);
  }

  // Use D3 to load earthquake data from the URL
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
.then(function (data) {
    L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
            // Calculate the radius based on magnitude
            let radius = getRadius(feature.properties.mag);

 // Calculate the color based on depth
let depth = feature.geometry.coordinates[2];
let depthColors = ['#7f0000', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a'];

function getColor(depthValue) {
    if (depthValue < 90) return depthColors[4];
    else if (depthValue < 70) return depthColors[3];
    else if (depthValue < 50) return depthColors[2];
    else if (depthValue < 30) return depthColors[1];
    else if (depthValue < 10) return depthColors[0];
    else return depthColors[5];
};

return L.circleMarker(latlng, {
    radius: radius,
    fillColor: getColor(depth),
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
});
},


       
        onEachFeature: function (feature, layer) {
          // Add a popup with earthquake information
          layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km<br>Location: " + feature.properties.place);
      }
    }).addTo(map);
});
