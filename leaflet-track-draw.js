trackDraw = (function(map,overlayControl,drawControl){
  var drawCount = 0;
  var objArray = [];
  var trackEnable = 1;
  var outstream = '';
  var textFile = null;
  var data = null;

  //--------------------------------------------------------------------------
  // Initialise the FeatureGroup to store editable layers
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  // Make editable layers 
  var newOverlayControl;
  var overlay = {"Drawn Items" : drawnItems};

  // Add drawn items overlay to layer control if it exists, otherwise add control to map
  if (overlayControl === undefined || drawControl === undefined) {
    console.log("trackDraw() takes three arguments")
    return;
  }
  if (overlayControl === null) {
    L.control.layers( null, overlay ).addTo(map);
  }
  else {
    newOverlayControl = overlayControl;
    newOverlayControl.addOverlay(drawnItems,"Drawn Items");
    overlayControl.removeFrom(map);
    newOverlayControl.addTo(map);
  }

  // Add Leaflet.draw control if it has not already been added
  if (drawControl === null){
    // Initialise the draw control and pass it the FeatureGroup of editable layers
    drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        }
    });
    
    map.addControl(drawControl);
  }


// --------------------------------------------------------------------------
// Print button; appears as button marked "P" under Leaflet.draw controller:
var jsonLayer;
  var button = L.easyButton('<strong>P</strong>', function(btn, map){
    if (Boolean(trackEnable)){
      outstream = '';
      for (i = 0; i < objArray.length; i++){
        var layer = objArray[i];
        if (layer !== null) {
          jsonLayer = layer.toGeoJSON();
          outstream += JSON.stringify(jsonLayer);
        }
        // if (layer instanceof L.Marker){
        // outstream += ' Object ' + i + ': ' 
        //   + 'Type: Marker ' 
        //   + layer.getLatLng().toString();
        // }
        // else if (layer instanceof L.Circle){
        //   outstream += ' Object ' + i + ': '
        //     + 'Type: Circle, '
        //     + 'Center: ' + layer.getLatLng().toString()
        //     + ', Radius: ' + layer.getRadius().toString();
        // }
        // else if (layer instanceof L.Rectangle){
        //   outstream += " Object " + i + ': '
        //     + 'Type: Rectangle, '
        //     + layer.getLatLngs().toString();
        // }
        // else if (layer instanceof L.Polygon){
        //   outstream += ' Object ' + i + ': '
        //     + 'Type: Polygon, '
        //     + 'Latlngs: ' + layer.getLatLngs().toString();
        // }
        // else if (layer instanceof L.Polyline){
        //   outstream += ' Object ' + i + ': '
        //     + 'Type: Polyline, '
        //     + layer.getLatLngs().toString();
        // }
      }
    }
  

  // Set HTML elements: coordinates.txt will automatically download when "P" button is clicked
  var link = document.createElement('a');
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outstream));
  link.setAttribute('download', 'coordinates.txt');

  link.style.display = 'block';
  document.body.appendChild(link);
  link.click();

  });
  
  button.addTo(map);

// When "Drawn Items" overlay is enabled:
// set trackEnable flag,
// add Leaflet.draw control,
// add "P" button to map
  map.on('overlayadd', function (a){
    //console.log(a.layer[0]);
    if (a.name === "Drawn Items"){
      trackEnable = 1;
      drawControl.addTo(map);
      button.addTo(map);
    }
  });

  // When "Drawn Items" overlay is disabled, remove controls and set flag
  map.on('overlayremove', function (a){
    if (a.name === "Drawn Items") {
      trackEnable = 0;
      drawControl.removeFrom(map);
      button.removeFrom(map);
    }
  });

  // Add drawn item to map
  //
  map.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;

        drawnItems.addLayer(layer);

        // Set popup to contain drawing's label, set in order of creation
        layer.bindPopup(drawCount.toString(), {minWidth:10});

        // Set popup to open on mouseover
        layer.on('mouseover', function (e) {
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.closePopup();
        });
        
        // Add object to array
        objArray.push(layer);
        ++drawCount;
  });

  map.on('draw:edited', function (e){
    var layers = e.layers;
    var latLng;
    layers.eachLayer(function(layer) {
      this.update();
    });
  });

  map.on('draw:deleted', function (e){
    var layers = e.layers;
    layers.eachLayer(function(layer){
      //var idx = objArray.indexOf(layer);
      //delete objArray[idx];
      objArray[parseInt(layer._popup.getContent())] = null;
    });
  });
  return map;
});




