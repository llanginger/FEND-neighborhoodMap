// TODO:  Check out jquerymobile for mobile styling.
//        Look into localstorage so that options persist.
//        Learn how to get the google map working.
//        Style.

$(function(){

  $(".nav-toggle").on("click", function(){
    $(".wrapper").toggleClass("open");
  });

  // $("#search-now").on("click", function(){
  //   ViewModel.fourSquareApiCall();
  // })



  var CoffeeShop = function(data){
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.rating = ko.observable(data.rating);
  };


  // var fourSquareResults = [];


  var ViewModel = function(){
    var self = this;

    // 4-SQR SECTION:
    this.searchLocation = ko.observable("ballard, wa");
    this.searchCategory = ko.observable("coffee");
    this.resultName = ko.observable();
    this.resultLimit = ko.observable(10);
    this.fourSquareResults = ko.observableArray([]);

    this.selectedItems = ko.observableArray([]);

    this.currentItem = ko.observable();

    this.removeSelected = function(){
      self.fourSquareResults.removeAll(self.selectedItems());
      self.selectedItems([]);
      console.log(self.fourSquareResults()[0].name);
    }

    this.displayRandom = function(){
      var ranNum = Math.floor(Math.random() * self.fourSquareResults().length);
      self.currentItem(self.fourSquareResults()[ranNum]);
      var newLat = self.currentItem().lat;
      var newLng = self.currentItem().lng;
      self.resultName(self.currentItem().name);
      console.log(self.resultName());
      console.log(self.currentItem());
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
          content: '<div id="content">' + '<h1 id="firstHeading" class="firstHeading">' + self.resultName() + '</h1>' + '</div>'
      });
      infoWindow.open(map, marker, this);
    };

    this.fourSquareApiCall = function(){
      self.fourSquareResults([]);
      var fourSqSettings = {
        baseUrl: "https://api.foursquare.com/v2/venues/search?",
        clientID: "&client_id=" + "WGMJMEF5PGBY0Z2VPGOTUV4IZWYTZS5V1E0TPIJHBSHRXNWS",
        clientSecret: "&client_secret=" + "MPIRWAHDMNBZVY2LSAVR1Y0WLQEP5SLDQHIXJZLVFILJHJDQ",
        loc: "near=" + self.searchLocation(),
        cat: "&query=" + self.searchCategory(),
        limit: "&limit=" + self.resultLimit(),
      };

      var fourSq_URL =
        fourSqSettings.baseUrl + fourSqSettings.loc + fourSqSettings.clientID + fourSqSettings.clientSecret + "&v=20130815" + fourSqSettings.cat + fourSqSettings.limit;

      $.ajax(fourSq_URL)
        .fail(function(data){
          console.log("Failed 4square request");
        })
        .done(function(data){
          console.log(data);
          var venues = data.response.venues;
          for (var venue in venues){
            // console.log(venues[i].name);
            self.fourSquareResults.push({
              name: venues[venue].name,
              lat: venues[venue].location.lat,
              lng: venues[venue].location.lng
            });
            // console.log(self.fourSquareResults()[venue].name);
          };
        })
      };
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
