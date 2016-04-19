// TODO:  Check out jquerymobile for mobile styling.
//        Look into localstorage so that options persist.
//        Learn how to get the google map working.
//        Style.

$(function(){

  $(".nav-toggle").on("click", function(){
    $(".wrapper").toggleClass("open");
  });

  $("#display-random").on("click", function(){
    $(".wrapper").toggleClass("open");
  });




  // var fourSquareResults = [];


  var ViewModel = function(){
    var self = this;

    // 4-SQR SECTION:
    this.searchLocation = ko.observable("ballard, wa");
    this.searchCategory = ko.observable("coffee");
    this.resultName = ko.observable();
    this.resultId = ko.observable();
    this.resultLimit = ko.observable(10);
    this.fourSquareResults = ko.observableArray([]);
    this.fourSqPhotos = ko.observableArray([]);

    this.selectedItems = ko.observableArray([]);

    this.currentItem = ko.observable({});

    this.fourSqSettings = ko.observable({
      baseUrl: "https://api.foursquare.com/v2/venues/",
      search: "search?",
      clientID: "client_id=" + "WGMJMEF5PGBY0Z2VPGOTUV4IZWYTZS5V1E0TPIJHBSHRXNWS",
      clientSecret: "&client_secret=" + "MPIRWAHDMNBZVY2LSAVR1Y0WLQEP5SLDQHIXJZLVFILJHJDQ",
      loc: "near=" + self.searchLocation(),
      cat: "&query=" + self.searchCategory(),
      limit: "&limit=" + self.resultLimit()
    });
    var fourSqSearch_URL =
      self.fourSqSettings().baseUrl + self.fourSqSettings().search + self.fourSqSettings().loc + "&" +  self.fourSqSettings().clientID + self.fourSqSettings().clientSecret + "&v=20130815" + self.fourSqSettings().cat + self.fourSqSettings().limit;

    var fourSqPhoto_URL = self.fourSqSettings().baseUrl + "40b3de00f964a52026001fe3" + "/photos?" + self.fourSqSettings().clientID + self.fourSqSettings().clientSecret + "&v=20130815";


    this.removeSelected = function(){
      self.fourSquareResults.removeAll(self.selectedItems());
      self.selectedItems([]);
    }

    this.displayRandom = function(){
      var ranNum = Math.floor(Math.random() * self.fourSquareResults().length);

      // Placeholder image code. TODO: replace this
      var photoSrc = "https://irs0.4sqi.net/img/general/300x200/2341723_vt1Kr-SfmRmdge-M7b4KNgX2_PHElyVbYL65pMnxEQw.jpg/"

      self.currentItem(self.fourSquareResults()[ranNum]);

      var newLat = self.currentItem().lat;
      var newLng = self.currentItem().lng;

      self.resultName(self.currentItem().name);
      self.resultId(self.currentItem().id);
      self.fourSqSettings().id = self.currentItem().id;


          console.log(self.resultName());
          console.log(self.currentItem());
          console.log(self.resultId());
          console.log(fourSqPhoto_URL);
          console.log(self.fourSqSettings());

      myLatLong = {lat: newLat, lng: newLng};
          // console.log(myLatLong);


      map.panTo(myLatLong);
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
      marker.addListener('click', toggleBounce);
      if (infoWindow) {infoWindow.close()};
      infoWindow = new google.maps.InfoWindow({
          content: '<div id="content">' + "<img src='http://placehold.it/400x250'/>" + '<h1 id="firstHeading" class="firstHeading">' + self.resultName() + '</h1>' + '</div>'
      });
      infoWindow.open(map, marker, this);
      mapRecenter(myLatLong, 0, -100);
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

    this.fourSquareApiCall = function(){
      // Empty results array:
      self.fourSquareResults([]);
      // Request info from Foursqaure:
      $.ajax(fourSqSearch_URL)
        .fail(function(data){
          console.log("Failed 4square request");
        })
        .done(function(data){
          // console.log(data);
          var venues = data.response.venues;
          for (var venue in venues){
            self.fourSquareResults.push({
              name: venues[venue].name,
              lat: venues[venue].location.lat,
              lng: venues[venue].location.lng,
              id: venues[venue].id
            });
          };
        })
      };
      // this.fourSquarePhotoCall = function(){
      //
      //
      //   // self.currentItem().id = "";
      //   $.ajax(fourSqPhoto_URL)
      //     .fail(function(data){
      //       console.log("Failed 4square photo request");
      //     })
      //     .done(function(data){
      //       var photos = data.response.photos.items;
      //       for (var photo in photos){
      //         self.fourSqPhotos.push({
      //           photoId: photos[photo].id
      //         });
      //       }
      //     })
      //     console.log(self.fourSqPhotos());
      //     self.fourSqPhotos([]);
      // }
  };

  ko.applyBindings(new ViewModel);







})


// ko.bindingHandlers.map = {
//   init: function(element, valueAccessor, allBindingsAccessor, ViewModel) {
//     var mapObj = ko.utils.unwrapObservable(valueAccessor());
//     var latLng = new google.maps.latLng(
//       ko.utils.unwrapObservable(mapObj.lat),
//       ko.utils.unwrapObservable(mapObj.lng));
//     var mapOptions = {
//       center: latLng(),
//       zoom: 14
//     };
//     mapObj.googleMap = new google.maps.Map(element, mapOptions);
//     mapObj.marker = new google.maps.Marker({
//       map: mapObj.googleMap,
//       position: latLng,
//       title: "New Marker!",
//       draggable: true
//     });
//     mapObj.onChangedCoord = function(newValue) {
//       var latLng = new google.maps.LatLng(
//           ko.utils.unwrapObservable(mapObj.lat),
//           ko.utils.unwrapObservable(mapObj.lng));
//           mapObj.googleMap.setCenter(latLng);
//       };
//
//     mapObj.onMarkerMoved = function(dragEnd) {
//       var latLng = mapObj.marker.getPosition();
//       mapObj.lat(latLng.lat());
//       mapObj.lng(latLng.lng());
//     };
//
//     mapObj.lat.subscribe(mapObj.onChangedCoord);
//     mapObj.lng.subscribe(mapObj.onChangedCoord);
//
//     google.maps.event.addListener(mapObj.marker, 'dragend', mapObj.onMarkerMoved);
//
//     $("#" + element.getAttribute("id")).data("mapObj",mapObj);
//   }
// }



// Google Maps code:
var myLatLongArray = [[47.6792, -122.3860]];
var myLatLong = {lat: 47.6792, lng: -122.3860};
var map;
var marker;
var infoWindow;
// var contentString =
//     '<div id="content">' +
//     '<div id="siteNotice">' +
//     '</div>' +
//     '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
//     '<div id="bodyContent">' +
//     '</div>' +
//     '</div>';



function toggleBounce() {
  if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
  } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

  function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLong,
      zoom: 15
    });

    // marker.addListener('click', function(){
    //   infoWindow.open(map, marker);
    // });

    // marker.addListener('click', toggleBounce);




}



// var infoWindow = new google.maps.InfoWindow({
//   position: myLatLong,
//   map: map,
//   title: "my Info Window"
// })
