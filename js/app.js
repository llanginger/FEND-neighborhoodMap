// TODO:  Check out jquerymobile for mobile styling.
//        Look into localstorage so that options persist.
//        Style.

// Google Maps code:
var myLatLongArray = [[47.6792, -122.3860]];
var myLatLong = {lat: 47.6792, lng: -122.3860};
var map;
var marker;
var infoWindow;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLong,
    zoom: 15
  });

  infoWindow = new google.maps.InfoWindow();


}



$(function(){

  $(".nav-toggle").on("click", function(){
    $(".wrapper").toggleClass("open");
  });

  $("#display-random").on("click", function(){
    $(".wrapper").toggleClass("open");

  });


  var ViewModel = function(){
    var self = this;

    // this.googleMap = map;

    // 4-SQR SECTION:
    this.searchLocation = ko.observable("ballard");
    this.searchCategory = ko.observable("donuts");
    this.resultName = ko.observable();
    this.resultId = ko.observableArray([]);
    this.resultLimit = ko.observable(10);
    this.fourSquareResults = ko.observableArray([]);

    this.selectedItems = ko.observableArray([]);

    this.currentItem = ko.observable();

    var fourSqPhotoString;

    var fourSqSettings = {};


    this.removeSelected = function(){
      self.fourSquareResults.removeAll(self.selectedItems());
      self.selectedItems([]);
    }

    this.fourSquareApiCall = function(){
      self.fourSquareResults([]);

      fourSqSettings = {
        baseUrl: "https://api.foursquare.com/v2/venues/",
        search: "search?",
        clientID: "client_id=" + "WGMJMEF5PGBY0Z2VPGOTUV4IZWYTZS5V1E0TPIJHBSHRXNWS",
        clientSecret: "&client_secret=" + "MPIRWAHDMNBZVY2LSAVR1Y0WLQEP5SLDQHIXJZLVFILJHJDQ",
        loc: "near=" + self.searchLocation(),
        cat: "&query=" + self.searchCategory(),
        limit: "&limit=" + self.resultLimit()
      };

      var fourSqSearch_URL =
        fourSqSettings.baseUrl +
        fourSqSettings.search +
        fourSqSettings.loc + "&" +
        fourSqSettings.clientID +
        fourSqSettings.clientSecret + "&v=20130815" +
        fourSqSettings.cat +
        fourSqSettings.limit;

      console.log(fourSqSettings.loc)
      console.log(fourSqSearch_URL)
      // Empty results array:
      self.fourSquareResults([]);
      // Request info from Foursqaure:
      $.ajax(fourSqSearch_URL)
        .fail(function(data){
          console.log("Failed 4square request");
        })
        .done(function(data){
          console.log(data);
          var venues = data.response.venues;
          var resultObj;
          for (var venue in venues){
            // console.log(venues[venue].id);
            resultObj = {
              name: venues[venue].name,
              lat: venues[venue].location.lat,
              lng: venues[venue].location.lng,
              id: venues[venue].id
            };
            // call second foursquare api request, passing in the current resultObj
            fourSqPhotoCall(resultObj, fourSqSettings);
            console.log(resultObj);

          };

          console.log(self.fourSquareResults());

        })
      };
    // foursquare photo api request, loads array of photos into the resultObj from the first api
    var fourSqPhotoCall = function(obj, settings){
      $.ajax({
        url: settings.baseUrl + obj.id + "/photos?" + settings.clientID + settings.clientSecret + "&v=20130815"
        })
        .fail(function(photoData){
          console.log("Failed 4square photo request");
          console.log(self.resultId()[0]);
        })
        .done(function(photoData){
          console.log(photoData);
          var photos = photoData.response.photos.items;
          var photoArray = [];

          for (var photo in photos){
            photoArray.push([photos[photo].prefix + "300x200" + photos[photo].suffix]);
          }
          if (photoArray.length > 0){
            obj.photoString = photoArray;
          } else {
            obj.photoString = ["images/noPhoto.jpg"];
          }
        self.fourSquareResults.push(obj);

        console.log(self.fourSquareResults());

      })
    };

    var lastVenue;

    this.displayRandom = function(){

      // generate a unique random number for use in indexing
      var ranNum = Math.floor(Math.random() * self.fourSquareResults().length);

      // ensure the app can't return the same random venue twice in a row
      if (ranNum == lastVenue && self.fourSquareResults().length > 1){
        while (ranNum == lastVenue){
          ranNum = Math.floor(Math.random() * self.fourSquareResults().length);
        }
      }
      lastVenue = ranNum;

      // set the contents of currentItem to be the 4-SQR result at [ranNum]
      self.currentItem(self.fourSquareResults()[ranNum]);

      // set the lat/lng for use within the scope of this function
      var newLat = self.currentItem().lat;
      var newLng = self.currentItem().lng;

      self.resultName(self.currentItem().name);
      self.resultId(self.currentItem().id);
      // self.currentPhoto(self.currentItem().photoString);
      fourSqSettings.id = self.currentItem().id;

          // some console logs
          console.log(self.fourSquareResults());
          // console.log(self.resultName());
          console.log(self.currentItem());
          // console.log(self.resultId());
          // console.log(fourSqPhoto_URL);
          // console.log(fourSqSettings);
          console.log(self.currentItem().photoString.length);

      // set myLatLong to be an object with currentItem[ranNum].lat/lng as its properties
      myLatLong = {lat: newLat, lng: newLng};

      // pan map to myLatLong
      map.panTo(myLatLong);

      // create a new marker if there is none, otherwise move the existing one
      if (!marker) {
        marker = new google.maps.Marker({
            position: myLatLong,
            map: map,
            title: "Ohai, a marker!",
            animation: google.maps.Animation.DROP,
        });
      } else {
        marker.setPosition(myLatLong);
      };

      // if there's already an infowindow, close it before moving on
      if (infoWindow) {infoWindow.close()};

      // declare the content of the infowindow
      infoWindow = new google.maps.InfoWindow({
        content:
          "<div id='content'>" +
            "<div class='default-slider'>" +
              "<ul class='photo-slides'>" +
              "</ul>" +
            "</div>" +
            "<h1 id='firstHeading' class='firstHeading'>" + self.resultName() +
            "</h1>" +
          "</div>"
      });

      marker.setPosition(myLatLong);

      // open the new infowindow
      infoWindow.open(map, marker, this);
      if (self.currentItem().photoString.length > 0){
        var images = self.currentItem().photoString;
        for (photo = 0; photo < 15 && photo < images.length; photo++){
          $(".photo-slides").append("<li><img src='" + images[photo] + "' class='image-slide'  /></li>");
        }
      } else {
          $(".photo-slides").append("<li><img src='" + images + "' class='image-slide'  /></li>");
      }
      // $(".photo-slide").fadeIn("fast");
      $(".default-slider").unslider({
          autoplay: true,
          speed: 1000
        });

      // adjust the map's "center"
      mapRecenter(myLatLong, 0, -150);
    };

    var mapRecenter = function(latlng,offsetx,offsety) {
      var point1 = map.getProjection().fromLatLngToPoint(
          (latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
      );
      var point2 = new google.maps.Point(
          ( (offsetx) / Math.pow(2, map.getZoom()) ) || 0,
          ( (offsety) / Math.pow(2, map.getZoom()) ) || 0
      );
      map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(
          point1.x - point2.x,
          point1.y + point2.y
      )));
    }
  };

  ko.applyBindings(new ViewModel);
})
