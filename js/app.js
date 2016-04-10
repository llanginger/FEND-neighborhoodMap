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


  }
    ko.applyBindings(new ViewModel);

})













  // var myModel = {
  //   menuBar: {
  //     coffeeShops: "shop list here",
  //     peopleCount: "people list here",
  //     contact: "contact info here",
  //   },
  //   newCoffeeShop: ko.observableArray()
  // }
  console.log("hello");

  // console.log(myModel.newCoffeeShop()[0]);

  // ko.applyBindings(myModel);

  // for (item in myModel.menuBar){
  //   $("#menu-bar").append("<button class='blue'>" + myModel.menuBar[item] + "</button>");
  // }

// })


























var myLatLongArray = [[47.6792, -122.3860]];


  function initMap() {
    var myLatLong = {lat: 47.6792, lng: -122.3860};

    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLong,
      zoom: 10
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
