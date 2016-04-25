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
    $("#hamburger").toggleClass("red");
  });

  $("#display-random").on("click", function(){
    $(".wrapper").toggleClass("open");
    $("#hamburger").removeClass("red");

  });

  $("#main-button").on("click", function(){
    if ($(".wrapper").hasClass("open")){
      $(".wrapper").toggleClass("open");
      $("#hamburger").removeClass("red");
      // $("#hamburger").addClass('red');
    }
  });



  var locValue;

  $("#location").on("focus", function(){
    locValue = $(this).val();
    $(this).val("");
  });

  $("#location").on("blur", function(){
    if ($(this).val() == ""){
      $(this).val(locValue);
    };
  });

  var catValue;

  $("#category").on("focus", function(){
    catValue = $(this).val();
    $(this).val("");
  });

  $("#category").on("blur", function(){
    if ($(this).val() == ""){
      $(this).val(catValue);
    };
  });


  var ViewModel = function(){
    var self = this;

    // this.googleMap = map;

    // 4-SQR SECTION:
    this.searchLocation = ko.observable("Where are you?");
    this.searchCategory = ko.observable("What do you want?");
    this.resultName = ko.observable();
    this.resultId = ko.observableArray([]);
    this.resultLimit = ko.observable(15);
    this.fourSqResults = ko.observableArray([]);

    this.selectedItems = ko.observableArray([]);

    this.currentItem = ko.observable();

    var fourSqSettings = {};


    this.removeSelected = function(){
      self.fourSqResults.removeAll(self.selectedItems());
      self.selectedItems([]);
    }

    this.fourSquareApiCall = function(){
      self.fourSqResults([]);

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

      // Empty results array:
      self.fourSqResults([]);
      // Request info from Foursqaure:
      $.ajax(fourSqSearch_URL)
        .fail(function(data){
          console.log("Failed 4square request");
        })
        .done(function(data){
          // console.log(data);
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
            fourSqReviewCall(resultObj, fourSqSettings);
          };
          // console.log(self.fourSqResults());
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
          // console.log(photoData);
          var photos = photoData.response.photos.items;
          var photoArray = [];

          for (var photo in photos){
            photoArray.push([photos[photo].prefix + "300x200" + photos[photo].suffix]);
          }
          if (photoArray.length > 0){
            obj.photoSrc = photoArray;
          } else {
            obj.photoSrc = ["images/noPhoto.jpg"];
          }
      })
    };

    var fourSqReviewCall = function(obj, settings){
      $.ajax({
        url: settings.baseUrl + obj.id + "/tips?" + settings.clientID + settings.clientSecret + "&v=20130815"
        })
        .fail(function(reviewData){
          console.log("Failed 4square review request");
          console.log(self.resultId()[0]);
        })
        .done(function(reviewData){
          console.log(reviewData);
          var reviewArray = [];
          var reviews = reviewData.response.tips.items;

          for (var review in reviews){
            reviewArray.push(reviews[review].text);
          };
          if (reviewArray.length > 0){
            obj.reviews = reviewArray;
          };
        self.fourSqResults.push(obj);
        console.log(self.fourSqResults());

        })
    };

    var lastVenue;

    this.displayRandom = function(){

      // generate a unique random number for use in indexing
      var ranNum = Math.floor(Math.random() * self.fourSqResults().length);

      // ensure the app can't return the same random venue twice in a row
      if (ranNum == lastVenue && self.fourSqResults().length > 1){
        while (ranNum == lastVenue){
          ranNum = Math.floor(Math.random() * self.fourSqResults().length);
        }
      }
      lastVenue = ranNum;

      // set the contents of currentItem to be the 4-SQR result at [ranNum]
      self.currentItem(self.fourSqResults()[ranNum]);

      // set the lat/lng for use within the scope of this function
      var newLat = self.currentItem().lat;
      var newLng = self.currentItem().lng;

      self.resultName(self.currentItem().name);
      self.resultId(self.currentItem().id);
      // self.currentPhoto(self.currentItem().photoSrc);
      fourSqSettings.id = self.currentItem().id;

          // some console logs
          console.log(self.fourSqResults());
          // console.log(self.resultName());
          console.log(self.currentItem());
          // console.log(self.resultId());
          // console.log(fourSqPhoto_URL);
          // console.log(fourSqSettings);
          console.log(self.currentItem().photoSrc.length);

      // set myLatLong to be an object with currentItem[ranNum].lat/lng as its properties
      myLatLong = {lat: newLat, lng: newLng};

      // pan map to myLatLong
      map.setCenter(myLatLong);
      map.panBy(0, -280);


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
            "<div class='photo-slider'>" +
              "<ul class='photo-slides'>" +
              "</ul>" +
            "</div>" +
            "<h1 id='first-heading'>" + self.resultName() +
            "</h1>" +
            "<div class='review-slider'>" +
              "<ul class='review-slides'>" +
              "</ul>" +
            "</div>" +
          "</div>"
      });

      marker.setPosition(myLatLong);

      // open the new infowindow
      infoWindow.open(map, marker, this);
      if (self.currentItem().photoSrc.length > 0){
        var images = self.currentItem().photoSrc;
        for (photo = 0; photo < 15 && photo < images.length; photo++){
          $(".photo-slides").append("<li><img src='" + images[photo] + "' class='photo-slide'  /></li>");
        }
      } else {
          $(".photo-slides").append("<li><img src='" + images + "' class='photo-slide'  /></li>");
      }

      if (self.currentItem().reviews){
        var text = self.currentItem().reviews;
        for (item = 0; item < 5 && item < text.length; item ++){
          $(".review-slides").append("<li><p class='review-slide'>" + text[item] + "</p></li>");
        }
      } else {
          $(".review-slides").append("<li><p>Looks like there are no reviews!</p></li>");
      }

      if ($(".photo-slide").length > 1){
        $(".photo-slider").unslider({
          autoplay: true,
          speed: 750,
          infinite: true
        })
      } else {
        $(".photo-slider").unslider({
          autoplay: false,
          nav: false
        })
        $("#content").css("height", "380");
      }

      if ($(".review-slide").length > 1){
        $(".review-slider").unslider({
          autoplay: true,
          speed: 1300,
          delay: 4000,
          infinite: true
        })
      } else {
        $(".review-slider").unslider({
          autoplay: false,
          nav: false
        })
        $("#content").css("height", "380");
      }
      // $(".gm-style-iw").parent().addClass('pink')
    };
  };

  ko.applyBindings(new ViewModel);
})
