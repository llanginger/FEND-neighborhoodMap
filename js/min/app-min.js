function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:myLatLong,zoom:15}),infoWindow=new google.maps.InfoWindow}var myLatLongArray=[[47.6792,-122.386]],myLatLong={lat:47.6792,lng:-122.386},map,marker,infoWindow;$(function(){$(".nav-toggle").on("click",function(){$(".wrapper").toggleClass("open")}),$("#display-random").on("click",function(){$(".wrapper").toggleClass("open")});var e=function(){var e=this;this.searchLocation=ko.observable("ballard"),this.searchCategory=ko.observable("donuts"),this.resultName=ko.observable(),this.resultId=ko.observableArray([]),this.resultLimit=ko.observable(10),this.fourSquareResults=ko.observableArray([]),this.selectedItems=ko.observableArray([]),this.currentItem=ko.observable();var o,t={};this.removeSelected=function(){e.fourSquareResults.removeAll(e.selectedItems()),e.selectedItems([])},this.fourSquareApiCall=function(){e.fourSquareResults([]),t={baseUrl:"https://api.foursquare.com/v2/venues/",search:"search?",clientID:"client_id=WGMJMEF5PGBY0Z2VPGOTUV4IZWYTZS5V1E0TPIJHBSHRXNWS",clientSecret:"&client_secret=MPIRWAHDMNBZVY2LSAVR1Y0WLQEP5SLDQHIXJZLVFILJHJDQ",loc:"near="+e.searchLocation(),cat:"&query="+e.searchCategory(),limit:"&limit="+e.resultLimit()};var o=t.baseUrl+t.search+t.loc+"&"+t.clientID+t.clientSecret+"&v=20130815"+t.cat+t.limit;console.log(t.loc),console.log(o),e.fourSquareResults([]),$.ajax(o).fail(function(e){console.log("Failed 4square request")}).done(function(o){console.log(o);var a=o.response.venues,r;for(var s in a)r={name:a[s].name,lat:a[s].location.lat,lng:a[s].location.lng,id:a[s].id},n(r,t),console.log(r);console.log(e.fourSquareResults())})};var n=function(o,t){$.ajax({url:t.baseUrl+o.id+"/photos?"+t.clientID+t.clientSecret+"&v=20130815"}).fail(function(o){console.log("Failed 4square photo request"),console.log(e.resultId()[0])}).done(function(t){console.log(t);var n=t.response.photos.items,a=[];for(var r in n)a.push([n[r].prefix+"300x200"+n[r].suffix]);a.length>0?o.photoString=a:o.photoString=["images/noPhoto.jpg"],e.fourSquareResults.push(o),console.log(e.fourSquareResults())})},a;this.displayRandom=function(){var o=Math.floor(Math.random()*e.fourSquareResults().length);if(o==a)for(;o==a;)o=Math.floor(Math.random()*e.fourSquareResults().length);a=o,e.currentItem(e.fourSquareResults()[o]);var n=e.currentItem().lat,s=e.currentItem().lng;if(e.resultName(e.currentItem().name),e.resultId(e.currentItem().id),t.id=e.currentItem().id,console.log(e.fourSquareResults()),console.log(e.currentItem()),console.log(e.currentItem().photoString.length),myLatLong={lat:n,lng:s},map.panTo(myLatLong),marker?marker.setPosition(myLatLong):marker=new google.maps.Marker({position:myLatLong,map:map,title:"Ohai, a marker!",animation:google.maps.Animation.DROP}),infoWindow&&infoWindow.close(),infoWindow=new google.maps.InfoWindow({content:"<div id='content'><div class='default-slider'><ul class='photo-slides'></ul></div><h1 id='firstHeading' class='firstHeading'>"+e.resultName()+"</h1></div>"}),marker.setPosition(myLatLong),infoWindow.open(map,marker,this),e.currentItem().photoString.length>0){var l=e.currentItem().photoString;for(photo=0;photo<15&&photo<l.length;photo++)$(".photo-slides").append("<li><img src='"+l[photo]+"' class='image-slide'  /></li>")}else $(".photo-slides").append("<li><img src='"+l+"' class='image-slide'  /></li>");$(".default-slider").unslider({autoplay:!0,speed:1e3}),r(myLatLong,0,-150)};var r=function(e,o,t){var n=map.getProjection().fromLatLngToPoint(e instanceof google.maps.LatLng?e:map.getCenter()),a=new google.maps.Point(o/Math.pow(2,map.getZoom())||0,t/Math.pow(2,map.getZoom())||0);map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(n.x-a.x,n.y+a.y)))}};ko.applyBindings(new e)});