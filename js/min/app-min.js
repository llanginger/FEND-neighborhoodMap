function initMap(){function e(){null!==n.getAnimation()?n.setAnimation(null):n.setAnimation(google.maps.Animation.BOUNCE)}for(var a={lat:47.6792,lng:-122.386},t=new google.maps.Map(document.getElementById("map"),{center:a,zoom:14}),o=0;o<myLatLongArray.length;o++){console.log(myLatLongArray[o][0]);var i=myLatLongArray[o],n=new google.maps.Marker({position:new google.maps.LatLng(i[0],i[1]),map:t,title:"Ohai, a marker!",animation:google.maps.Animation.DROP})}n.addListener("click",e);var r='<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">Uluru</h1><div id="bodyContent"><p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large sandstone rock formation in the southern part of the Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) south west of the nearest large town, Alice Springs; 450&#160;km (280&#160;mi) by road. Kata Tjuta and Uluru are the two major features of the Uluru - Kata Tjuta National Park. Uluru is sacred to the Pitjantjatjara and Yankunytjatjara, the Aboriginal people of the area. It has many springs, waterholes, rock caves and ancient paintings. Uluru is listed as a World Heritage Site.</p><p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">https://en.wikipedia.org/w/index.php?title=Uluru</a> (last visited June 22, 2009).</p></div></div>',l=new google.maps.InfoWindow({content:r})}$(function(){$(".nav-toggle").on("click",function(){$(".wrapper").toggleClass("open")});var e=function(e){this.name=ko.observable(e.name),this.address=ko.observable(e.address),this.rating=ko.observable(e.rating)},a=function(){var e=this;this.searchLocation=ko.observable("ballard, wa"),this.searchCategory=ko.observable("coffee"),this.resultLimit=ko.observable(5),this.fourSquareResults=ko.observableArray([]),this.fourSquareApiCall=function(){var a={baseUrl:"https://api.foursquare.com/v2/venues/search?",clientID:"&client_id=WGMJMEF5PGBY0Z2VPGOTUV4IZWYTZS5V1E0TPIJHBSHRXNWS",clientSecret:"&client_secret=MPIRWAHDMNBZVY2LSAVR1Y0WLQEP5SLDQHIXJZLVFILJHJDQ",loc:"near="+e.searchLocation(),cat:"&query="+e.searchCategory(),limit:"&limit="+e.resultLimit()},t=a.baseUrl+a.loc+a.clientID+a.clientSecret+"&v=20130815"+a.cat+a.limit;$.ajax(t).fail(function(e){console.log("Failed 4square request")}).done(function(a){console.log(a);var t=a.response.venues;for(var o in t)e.fourSquareResults[o]={name:t[o].name,lat:t[o].location.lat,lng:t[o].location.lng};console.log(e.fourSquareResults[0].lat)}),console.log(t)}};ko.applyBindings(new a)});var myLatLongArray=[[47.6792,-122.386]];