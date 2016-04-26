function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:myLatLong,zoom:15}),infoWindow=new google.maps.InfoWindow}var myLatLongArray=[[47.6792,-122.386]],myLatLong={lat:47.6792,lng:-122.386},map,marker,infoWindow,Store=window.Locally.Store,store=new Store;$(function(){store.get("arrow")||$(".wrapper").prepend('<img id="first-time-arrow" src="images/arrow.png" />'),store.get("dBox")||$(".wrapper").prepend("<div id='first-time-dbox' class='closed'><ol><li><p>First, enter where you'd like to look.</p></li><li><p>Then enter what you're looking for. This could be anything from coffee to bike shops! When you're done, hit \"Search Now\".</p></li><li><p>You can remove any places you've already been from the list below by selecting them and hitting the \"Remove\" button.</p></li><li><p>When you're ready, hit \"Take me there!\" to be shown a random result from the list. If you don't like the first option, just hit \"Show me another\" until you do!</p></li></ol><button id='dismiss-dialogue'>Ok, got it!</button></div>"),$(".nav-toggle").on("click",function(){store.set("arrow",!0),$(".wrapper").toggleClass("open"),$("#hamburger").toggleClass("red"),$("#first-time-arrow").addClass("closed"),$("#first-time-dbox").toggleClass("closed")}),$("#dismiss-dialogue").on("click",function(){$("#first-time-dbox").addClass("closed"),store.set("dBox",!0),$("#first-time-dbox").remove()}),$("#display-random").on("click",function(){$(".wrapper").toggleClass("open"),$("#hamburger").removeClass("red"),$("#first-time-dbox").addClass("closed"),$("#main-button").removeClass("closed")}),$("#main-button").on("click",function(){$(".wrapper").hasClass("open")&&($(".wrapper").toggleClass("open"),$("#hamburger").removeClass("red"),$("#first-time-dbox").addClass("closed"))}),$("#reset-tutorial").on("click",function(){store.clear(),location.reload()});var e;$("#location").on("focus",function(){e=$(this).val(),$(this).val("")}),$("#location").on("blur",function(){""==$(this).val()&&$(this).val(e)});var o;$("#category").on("focus",function(){o=$(this).val(),$(this).val("")}),$("#category").on("blur",function(){""==$(this).val()&&$(this).val(o)});var t=function(){var e=this;this.searchLocation=ko.observable("Where are you?"),this.searchCategory=ko.observable("What do you want?"),this.resultName=ko.observable(),this.resultId=ko.observableArray([]),this.resultLimit=ko.observable(15),this.fourSqResults=ko.observableArray([]),this.selectedItems=ko.observableArray([]),this.currentItem=ko.observable();var o={};this.removeSelected=function(){e.fourSqResults.removeAll(e.selectedItems()),e.selectedItems([])},this.fourSquareApiCall=function(){e.fourSqResults([]),o={baseUrl:"https://api.foursquare.com/v2/venues/",search:"explore?",clientID:"client_id=WGMJMEF5PGBY0Z2VPGOTUV4IZWYTZS5V1E0TPIJHBSHRXNWS",clientSecret:"&client_secret=MPIRWAHDMNBZVY2LSAVR1Y0WLQEP5SLDQHIXJZLVFILJHJDQ",loc:"near="+e.searchLocation(),cat:"&query="+e.searchCategory(),limit:"&limit="+e.resultLimit()};var i=o.baseUrl+o.search+o.loc+"&"+o.clientID+o.clientSecret+"&v=20130815"+o.cat+o.limit;e.fourSqResults([]),$.ajax(i).fail(function(e){console.log("Failed 4square request")}).done(function(e){console.log(e);var i=e.response.groups[0].items;console.log(i);var s;for(var l in i)s={name:i[l].venue.name,lat:i[l].venue.location.lat,lng:i[l].venue.location.lng,id:i[l].venue.id},t(s,o),r(s,o)})};var t=function(o,t){$.ajax({url:t.baseUrl+o.id+"/photos?"+t.clientID+t.clientSecret+"&v=20130815"}).fail(function(o){console.log("Failed 4square photo request"),console.log(e.resultId()[0])}).done(function(e){var t=e.response.photos.items,r=[];for(var i in t)r.push([t[i].prefix+"300x200"+t[i].suffix]);r.length>0?o.photoSrc=r:o.photoSrc=["images/noPhoto.jpg"]})},r=function(o,t){$.ajax({url:t.baseUrl+o.id+"/tips?"+t.clientID+t.clientSecret+"&v=20130815"}).fail(function(o){console.log("Failed 4square review request"),console.log(e.resultId()[0])}).done(function(t){console.log(t);var r=[],i=t.response.tips.items;for(var s in i)r.push(i[s].text);r.length>0&&(o.reviews=r),e.fourSqResults.push(o),console.log(e.fourSqResults())})},i;this.displayRandom=function(){var t=Math.floor(Math.random()*e.fourSqResults().length);if(t==i&&e.fourSqResults().length>1)for(;t==i;)t=Math.floor(Math.random()*e.fourSqResults().length);i=t,e.currentItem(e.fourSqResults()[t]);var r=e.currentItem().lat,s=e.currentItem().lng;if(e.resultName(e.currentItem().name),e.resultId(e.currentItem().id),o.id=e.currentItem().id,console.log(e.fourSqResults()),console.log(e.currentItem()),console.log(e.currentItem().photoSrc.length),myLatLong={lat:r,lng:s},map.setCenter(myLatLong),map.panBy(0,-280),marker?marker.setPosition(myLatLong):marker=new google.maps.Marker({position:myLatLong,map:map,title:"Ohai, a marker!",animation:google.maps.Animation.DROP}),infoWindow&&infoWindow.close(),infoWindow=new google.maps.InfoWindow({content:"<div id='content'><div class='photo-slider'><ul class='photo-slides'></ul></div><h1 id='first-heading'>"+e.resultName()+"</h1><div class='review-slider'><ul class='review-slides'></ul></div></div>"}),marker.setPosition(myLatLong),infoWindow.open(map,marker,this),e.currentItem().photoSrc.length>0){var l=e.currentItem().photoSrc;for(photo=0;photo<15&&photo<l.length;photo++)$(".photo-slides").append("<li><img src='"+l[photo]+"' class='photo-slide'  /></li>")}else $(".photo-slides").append("<li><img src='"+l+"' class='photo-slide'  /></li>");if(e.currentItem().reviews){var n=e.currentItem().reviews;for(item=0;item<5&&item<n.length;item++)$(".review-slides").append("<li><p class='review-slide'>"+n[item]+"</p></li>")}else $(".review-slides").append("<li><p>Looks like there are no reviews!</p></li>");$(".photo-slide").length>1?$(".photo-slider").unslider({autoplay:!0,speed:750,infinite:!0}):($(".photo-slider").unslider({autoplay:!1,nav:!1}),$("#content").css("height","380")),$(".review-slide").length>1?$(".review-slider").unslider({autoplay:!0,speed:1300,delay:6e3,infinite:!0}):($(".review-slider").unslider({autoplay:!1,nav:!1}),$("#content").css("height","380"))}};ko.applyBindings(new t)});