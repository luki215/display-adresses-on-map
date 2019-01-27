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
    this.clear = function() {
        errorList = [];
        renderErrors();
    }
}

var errorsHandler = new Errors();


/* Geocoding and map displaying helpers */

function displayCoordsOnMap(coords) {
    var marker = new SMap.Marker(coords);
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

function chunkArray(myArray, chunk_size){
    var results = [];
    
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    
    return results;
}


/* 
* On click on button get all adresses from textarea and display them on map 
*/

document.getElementById('showOnMap').addEventListener('click', function(e) {
    clusterer.clear();
    errorsHandler.clear();
    var addresses = getAdresses();

    chunkedAdresses = chunkArray(addresses, 20);

    var i = 0;
    chunkedAdresses.forEach(function(addressChunk) {
        window.setTimeout(function() {
            addressChunk.forEach(function(address) {
                new SMap.Geocoder(address, processGeocodeResponse);    
            });
        }, i * 500);
        i++;
    });
    
});

