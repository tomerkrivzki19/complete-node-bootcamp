// this is a js fille that we are going to intregate into our html and then will run on the client side
console.log('hello from the client side :D');

// L => export as namespace L = > the package of the leaflet package 
//extract the data from the div , what we have done in the pug tamplate - we display all the data in the div classname 
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

var map = L.map('map', { zoomControl: false }); //to disable + - zoom
// var map = L.map('map', { zoomControl: false }).setView([31.111745, -118.113491], );

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  crossOrigin: '',
}).addTo(map);

//a distract of all the cordinates to the map package usinng foreach + settings for the display and output 
const points = [];
locations.forEach((loc) => {
  points.push([loc.coordinates[1], loc.coordinates[0]]);
  L.marker([loc.coordinates[1], loc.coordinates[0]])
    .addTo(map)
    .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
      autoClose: false,
    })
    .openPopup();
});
 
const bounds = L.latLngBounds(points).pad(0.5);
map.fitBounds(bounds);

map.scrollWheelZoom.disable(); //to disable zoom by mouse wheel

