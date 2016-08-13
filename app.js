 //$("#testModal").modal({show:false}); 
    // Need to get an access token of our own.  
    var leafletAccessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
    // The ID names the map source and type.  
    var mapID = 'mapbox.light';
    

    // Create two base layers, and put them into a group, which we will pass the the L.control.layers() function.
    // Since we are creating two layers to toggle between, don't set a base layer on instantiation.  (id: attribute) 
    // The layer selection control also defaults to the topright position, so we make sure our other control is out of the way.  
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + leafletAccessToken;
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmHotUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
    var esriUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';

    var theAttrib = 'University of Michigan';

    var grayscale = L.tileLayer( mbUrl, {id: 'mapbox.light', attribution: theAttrib}),
        streets   = L.tileLayer( mbUrl, {id: 'mapbox.streets', attribution: theAttrib});
    var osmStreets = L.tileLayer( osmUrl, { type: 'xyz', attribution: theAttrib}),
        osmHot     = L.tileLayer( osmHotUrl, { type: 'xyz', attribution: theAttrib}),
        esriStreets = L.tileLayer( esriUrl, { type: 'xyz', attribution: theAttrib}); 

    // Markers for staff stories
    var poolHall = L.marker([42.275149,-83.741515])
          .bindPopup('Michigan Union, Pool Hall:'+'<a href="#" data-toggle="modal" data-target="#poolHallMod"><br>Reflections on George Thomas O’Neal</a>'),
        inglisHouse = L.marker([42.277837,-83.717012]).bindPopup('Inglis House:' + '<a href="#" data-toggle="modal" data-target="#inglisMod"><br>Activist Anarchist Archivist</a>'),
        adminBuilding = L.marker([42.276248,-83.741242]).bindPopup('LS&A Building:'+ '<a href="#" data-toggle="modal" data-target="#LSAMod"><br>A Loving Legacy of Stewardship</a>'),
        kelseyMuseum = L.marker([42.276722,-83.741392]).bindPopup('Kelsey Museum of Archaeology:' + '<a href="#" data-toggle="modal" data-target="#KelseyMod"><br>Poet, Teacher, Adventurer and Photographer</a>'),
        bentleyLib = L.marker([42.289588,-83.712220]).bindPopup('University of Michigan Libraries and Bentley Historical Library:'+'<a href="#" data-toggle="modal" data-target="#BookBindMod"><br>Father and Son Bookbinders</a>'),
        exhibitMuseum = L.marker([42.278184,-83.734389]).bindPopup('Exhibit Museum:'+'<a href="#" data-toggle="modal" data-target="#AuntRuthMod"><br>Becoming Aunt Ruth</a>'),
        powerPlant = L.marker([42.280941,-83.734526]).bindPopup('Power Plant:'+'<a href="#" data-toggle="modal" data-target="#PowerPlantMod"><br>Power to the People</a>'),
        oldMain = L.marker([42.282845,-83.730983]).bindPopup('Old Main Hospital:'+'<a href="#" data-toggle="modal" data-target="#OldMainMod"><br>Bringing Down Old Main</a>'),
        railroad = L.marker([42.287207,-83.741678]).bindPopup('University of Michigan Railroad:'+'<a href="#" data-toggle="modal" data-target="#railroadMod"><br>The Last Engineer</a>'),
        medSchool = L.marker([42.283214,-83.733599]).bindPopup('Anatomy Labs:'+'<a href="#" data-toggle="modal" data-target="#hospitalMod"><br>Anatomist and Janitor</a>'); 

    var theMap = L.map( 'mymap', {
      center: [42.27816, -83.73822],
      zoom: 16,
      layers: [grayscale]
    });

    // Add a control that shows state info on hover.  The position of a Control is set by a Leaflet property: position:
    //  bottomleft, bottomright, topright and topleft??  What about the default +/- buttons there for zoom?  
    // The size of the control is dynamically determined, and adjusts as needed to hold content inserted.  
    
    var info = L.control( {position: 'bottomleft'} );

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    info.update = function (props) {
      this._div.innerHTML = '<h4>B&amp;F Bicentennial</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.description 
        : 'Tap the event venue for description.');
    };

    info.addTo(theMap);

    
    function getColor(d) {
        return d == 7   ? '#800026' :
         d == 6   ? '#BD0026' :
         d == 5   ? '#E31A1C' :
         d == 4   ? '#FC4E2A' :
         d == 3   ? '#FD8D3C' :
         d == 2   ? '#FEB24C' :
         d == 1   ? '#FED976' :
              '#00EDA0';
    }

    function myStyle(feature) {
        return {
      fillColor: getColor(feature.properties.colorId),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }

      info.update(layer.feature.properties);
    }

    var geojson;

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
      info.update();
    }

    function zoomToFeature(e) {
      theMap.fitBounds(e.target.getBounds());
    }



    function mySetFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: highlightFeature
        //click: zoomToFeature
      });
    }

    var editorPopup = L.popup();
    var currentLocation;
    function onMapClick(e) {
      currentLocation = e.latlng;
      editorPopup.setLatLng(e.latlng)
      .setContent('<a href="#" data-toggle="modal" data-target="#contentEditor">New Story Here?</a>')
      .openOn( theMap );
    }

    theMap.on('click', onMapClick);

    $(document).ready(function(){
      $.ajax({                                      
        url: 'getstories.php',                         
        data: "",                        
        dataType: 'json',                
        success: function(data)          
        {
          for (var i = 0; i < data.length; i++) {
            var currentObject = data[i];
            if (currentObject.lat != null){
              var marker=L.marker([currentObject.lat,currentObject.lng]).addTo(theMap);
              marker.bindPopup('<a class="dialog" href=#>'+ currentObject.title + '</a>' + ": " + currentObject.abstract);
              $(document).on("click", ".dialog", function(e) {
                bootbox.dialog({
                  message: currentObject.story_text + '<br><br>' + currentObject.url,
                  title: currentObject.title,
                  buttons: {
                    main: {
                      label: "Close Story",
                      className: "btn-primary",
                      callback: function(){
                        bootbox.hideAll();
                      }
                    }
                  }
                });
              }); //click function
            } // if
          }// for
       } // success function 
      }); // ajax
      $("#submit-story").click(function() {
        var storytitle = document.getElementById("story_t").value;
        var abstract = document.getElementById("story_abstr").value;
        var url = document.getElementById("story_link").value;
        var text = document.getElementById("story_txt").value;
        var lat = currentLocation.lat;
        var lng = currentLocation.lng;
        var dataString = ("story_title=" + storytitle + "&abstract=" + abstract + "&url=" + url + "&text=" + text + "&lat=" + lat + "&lng=" + lng);
        console.log(dataString);
        if (storytitle == '' || abstract == '' || text == '') {
          alert("Please give the story at title");
        }
        else if (abstract == ''){
          alert("Please enter a short description of the story");
        }
        else if (text == ''){
          alert("Please enter your story in the text box");
        }
        else {
              $.ajax({
                type: "POST",
                url: "submit.php/",
                data: dataString,
                cache: false,
                success: function(data) {
                  //console.log(dataString);
                  $("#contentEditor").modal("hide");
                  alert(data);
                  //alert("Form successfully submitted");
                }
              });
          }
          return false;
            
      });
    });

    var stories = L.layerGroup([
      poolHall,
      inglisHouse,
      adminBuilding,
      kelseyMuseum,
      bentleyLib,
      exhibitMuseum,
      powerPlant,
      oldMain,
      railroad,
      medSchool
    ]);//.addTo( theMap );

    geojson = L.geoJson(venueData, {
      style: myStyle,
      onEachFeature: mySetFeature,
      // Can be used to filter out (hide) some objects dynamically.  
      filter: function(feature, layer ) { return true; }
    }).addTo( theMap );

    
    
    var baseLayers = {
      "Grayscale": grayscale,
      "Streets": streets,
      "Open Streets" : osmStreets,
      "OSM Hot" : osmHot,
      "Esri" : esriStreets
    };


    // The geoJson object is derived from layerGoup, so we just add it directly to the overlay.  
    var overlays = { "Venues": geojson, "Staff Stories": stories };
    var theControl = L.control.layers( baseLayers, overlays ).addTo(theMap);

    geojson.eachLayer(function (layer) {
      layer.bindPopup(layer.feature.properties.name + ': ' + layer.feature.properties.description);
    });

    // Enable functionality to track coordinates of drawn items on the map
    //trackDraw( theMap,theControl,null );
    
    $(document).ready(function(){
      $('#contentEditor').on('hidden.bs.modal', function () {
        $('#story-title').html('<label for "story-title">Enter story title:</label><input id="story_t" type="text" class="form-control">');
        $("#story-abstract").html('<label for="abstract">Enter short description:</label><input id="story_abstr" type="text" class="form-control" name="abstract">');
        $("#story-url").html('<label for "link">Enter URL:</label><input id="story_link" type="text" class="form-control">');
        $("#story-text").html('<label for="text">Enter story:</label><textarea id="story_txt" type="textarea" rows="7" class="form-control" name="text"></textarea>');
        // var quill = new Quill('#editor-container', {
        //   modules: {
        //     toolbar: '#toolbar-container'
        //   },
        //   placeholder: 'Enter story text',
        //   theme: 'snow'
        // });
      });
      $("#poolHallMod").on('shown.bs.modal', function (){
        $('.slick-slider').resize();
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      });
      $("#inglisMod").on('shown.bs.modal', function (){
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      });  
      $("#LSAMod").on('shown.bs.modal', function (){
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      }); 
      $("#KelseyMod").on('shown.bs.modal', function (){
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      }); 
      $("#BookBindMod").on('shown.bs.modal', function (){
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      }); 
      $("#AuntRuthMod").on('shown.bs.modal', function (){
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      }); 
      $("#PowerPlantMod").on('shown.bs.modal', function (){
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      });
      $("#OldMainMod").on('shown.bs.modal', function (){
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      });  
      $("#railroadMod").on('shown.bs.modal', function (){
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      }); 
      $("#hospitalMod").on('shown.bs.modal', function (){
        setTimeout(function(){
          $(".story").slick("setPosition",0);
        }, 5);
      }); 
      // -- Slick --
      $('.story').slick({
         arrows: false,
         dots: true,
         cssEase: 'linear',
         mobileFirst: true,
         respondTo: 'min'
      });
      $('#input-form').slick({
        arrows: false,
        infinite: false
      })
    });
 