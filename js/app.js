$(function(){

  $(".nav-toggle").on("click", function(){
    $(".wrapper").toggleClass("open");
  });

  var coffeeShops = [
    {
      name: "Ballard Coffee Works",
      address: "address here",
      rating: 4
    },
    {
      name: "Cafe Fiore",
      address: "address here",
      rating: 3
    },
    {
      name: "Might O's",
      address: "address here",
      rating: 2
    },
  ];
  // console.log(coffeeShops[0].name);

  var CoffeeShop = function(data){
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.rating = ko.observable(data.rating);
  };

  var ViewModel = function(){
    var self = this;
    this.coffeeShopList = ko.observableArray([]);


    coffeeShops.forEach(function(coffeeShop){
      self.coffeeShopList.push(new CoffeeShop(coffeeShop))
    });

    this.currentCoffeeShop = ko.observable(this.coffeeShopList()[0]);

    // // Map section:
    // self.mapOne = ko.observable({
    //   lat: ko.observable( 47.6792 ),
    //   lng: ko.observable( -122.3860 )
    // });

  };

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

  ko.applyBindings(new ViewModel);

  var searchLocation = "ballard, wa";
  var searchCategory = "coffee";
  var fourSquareResults = [];

  var fourSquareApiCall = function(){

    var fourSqSettings = {
      baseUrl: "https://api.foursquare.com/v2/venues/search?",
      clientID: "WGMJMEF5PGBY0Z2VPGOTUV4IZWYTZS5V1E0TPIJHBSHRXNWS",
      clientSecret: "MPIRWAHDMNBZVY2LSAVR1Y0WLQEP5SLDQHIXJZLVFILJHJDQ",
      loc: "near=" + searchLocation,
      cat: "&query=" + searchCategory,
      limit: "&limit=" + 5
    };

    var fourSq_URL =
      fourSqSettings.baseUrl + fourSqSettings.loc + "&client_id="+ fourSqSettings.clientID + "&client_secret=" + fourSqSettings.clientSecret + "&v=20130815" + fourSqSettings.cat + fourSqSettings.limit;

    $.ajax(fourSq_URL)
      .fail(function(data){
        console.log("Failed 4square request");
      })
      .done(function(data){
        console.log(data);
        var venues = data.response.venues;
        for (venue in venues){
          // console.log(venues[i].name);
          fourSquareResults[venue] = {
            name: venues[venue].name,
            lat: venues[venue].location.lat,
            lng: venues[venue].location.lng
          };

        };
        console.log(fourSquareResults[0].lat);
      })

    console.log(fourSq_URL);
  };
  fourSquareApiCall();

})




// Google Maps code:
var myLatLongArray = [[47.6792, -122.3860]];


  function initMap() {
    var myLatLong = {lat: 47.6792, lng: -122.3860};

    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLong,
      zoom: 14
    });
    for (var loc = 0; loc < myLatLongArray.length; loc++){
      console.log(myLatLongArray[loc][0]);
      var location = myLatLongArray[loc];
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(location[0], location[1]),
        map: map,
        title: "Ohai, a marker!",
        animation: google.maps.Animation.DROP,
      });
    }
  // marker.addListener('click', function(){
  //   infoWindow.open(map, marker);
  // });

  marker.addListener('click', toggleBounce);

  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';
  var infoWindow = new google.maps.InfoWindow({
    content: contentString
  })
}





// var infoWindow = new google.maps.InfoWindow({
//   position: myLatLong,
//   map: map,
//   title: "my Info Window"
// })
