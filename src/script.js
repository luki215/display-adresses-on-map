/* 
* Map init 
*/

var m = new SMap(JAK.gel("map"));
m.addControl(new SMap.Control.Sync());
m.addDefaultLayer(SMap.DEF_BASE).enable();
m.addDefaultControls(); 

var layer = new SMap.Layer.Marker();
var clusterer = new SMap.Marker.Clusterer(m);
layer.setClusterer(clusterer);
m.addLayer(layer).enable();


/* Errors handler */ 
var Errors = function() { 
    var errorList = [];

    var renderErrors = function() {
        var content = errorList.map(function(err) { return "<p>" + err + "</p>"});
        document.getElementById("errors").innerHTML = content.join("");
    }

    
    this.addError = function(err) {
        errorList.push(err);
        renderErrors();
    }
}

var errorsHandler = new Errors();


/* Geocoding and map displaying helpers */

//var markers = [];
function displayCoordsOnMap(coords) {
    var marker = new SMap.Marker(coords);
  //  markers.push(marker);
    layer.addMarker(marker);
}


function processGeocodeResponse(geocoder) { 
    var results = geocoder.getResults()[0].results;

    if (!results.length) {
        errorsHandler.addError("Unknown adress: " + geocoder._query);
        return;
    }

    var addrCoords = results[0].coords;
    
    displayCoordsOnMap(addrCoords);

}

function getAdresses() {
    var textAreaContent = document.getElementById('addressList').value;
    return textAreaContent.split('\n');
}


/* 
* On click on button get all adresses from textarea and display them on map 
*/

document.getElementById('showOnMap').addEventListener('click', function(e) {
    clusterer.clear();
    var addresses = getAdresses();
    addresses.forEach(function(address) {
        new SMap.Geocoder(address, processGeocodeResponse);    
    });
});

