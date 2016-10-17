//Initialise google maps
document.addEventListener('DOMContentLoaded', function () {
	if (document.querySelectorAll('#map').length>0) {
		if (document.querySelector('html').lang)
			lang = document.querySelector('html').lang;
		else
			lang = 'en';

		var js_file = document.createElement('script');
		js_file.type = 'text/javascript';
		js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=false&key=AIzaSyBAbaVnGNkLP6T9y0ujBg-3ucg3cQellwE&language=' + lang;
		document.getElementsByTagName('head')[0].appendChild(js_file);
	}
});

//Set AJAX to synchronous
$.ajaxSetup({
	async: true
});

//loading a GeoJSON file
function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'suburbs.json', true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
};

//parsing JSON
var actual_JSON = null;
(function init() {
	loadJSON(function (response) {
		// Parse JSON string into object
		return actual_JSON = JSON.parse(response);
	});
})();

//Generates a range
function range(start, finish) {
	var array_output = [];
	for (i = start; i<finish; i++) {
		array_output.push(i);
	}
	return array_output;
};

function color_range(start, finish) {
	var array_output = [];
	for (i = start; i<finish; i++) {
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);
		array_output.push(i);

	}
	return array_output;
};

var values = color_range(25, 80);
// console.log(JSON.stringify(values));
var color_values = [23, 23, 24, 24, 25, 25, 25, 25, 26, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 31, 32, 32, 32, 32, 33, 33, 33, 33, 34, 34, 34, 34, 35, 35, 35, 35, 36, 36, 36, 36, 37, 37, 37, 37, 38, 38, 38, 38, 39, 39, 39, 39, 40, 40, 40, 40, 41, 41, 41, 41, 42, 42, 42, 42, 43, 43, 43, 43, 44, 44, 44, 44, 45, 45, 45, 45, 46, 46, 46, 46, 47, 47, 47, 47, 48, 48, 48, 48, 48, 48, 49, 49, 49, 49, 50, 50, 50, 50, 51, 51, 51, 51, 52, 52, 52, 52, 53, 53, 53, 53, 54, 54, 54, 54, 55, 55, 55, 55, 55, 55, 56, 56, 56, 56, 57, 57, 57, 57, 58, 58, 58, 58, 59, 59, 59, 59, 60, 60, 60, 60, 61, 61, 61, 61, 62, 62, 62, 62, 62, 62, 63, 63, 63, 63, 64, 64, 64, 64, 65, 65, 65, 65, 66, 66, 66, 66, 67, 67, 67, 67, 68, 68, 68, 68, 69, 69, 69, 69, 70, 70, 70, 70, 70, 70, 71, 71, 71, 71, 72, 72, 72, 72, 73, 73, 73, 73, 74, 74, 74, 74, 75, 75, 75, 75, 76, 76, 76, 76, 77, 77, 77, 77, 78, 78, 78, 78, 78, 78, 79, 79, 79, 79, 80, 80, 81, 81];
color_values = color_values.reverse();
var price_values = range(142, 380);

var map;
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		maxZoom: 13,
		minZoom: 11,
		disableDefaultUI: true,
		center: {lat: -36.8629404, lng: 174.7250425},
		styles: [{
			"featureType": "landscape",
			"stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]
		}, {
			"featureType": "poi",
			"stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]
		}, {
			"featureType": "road.highway",
			"stylers": [{"saturation": -100}, {"visibility": "simplified"}]
		}, {
			"featureType": "road.arterial",
			"stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]
		}, {
			"featureType": "road.local",
			"stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]
		}, {
			"featureType": "transit",
			"stylers": [{"saturation": -100}, {"visibility": "simplified"}]
		}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {
			"featureType": "water",
			"elementType": "labels",
			"stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]
		}, {
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]
		}]
	});

	// Pushing GeoJSON to maps
	var json = map.data.addGeoJson(actual_JSON);

	map.data.setStyle(function (feature) {
		var index_of_price = price_values.indexOf(parseInt(feature.getProperty('price'), 10));

		var color = index_of_price !== -1 ? 'hsla(14, 100%, ' + color_values[index_of_price] + '%, 1)' : 'blue';
		return {
			fillColor: color,
			fillOpacity: 1.0,
			strokeOpacity: 1,
			strokeColor: '#FF8A65',
			strokeWeight: 1
		}
	});

	//Tooltip init and code for it popping up in the center of each suburb on mouse over


	if (window.matchMedia("(min-width: 890px)").matches) {
		var infoBubble = new InfoBubble({
			map: map,
			content: null,
			position: new google.maps.LatLng(-35, 151),
			shadowStyle: 0,
			padding: 0,
			backgroundColor: '#4A148C',
			borderRadius: 6,
			arrowSize: 10,
			borderWidth: 0,
			borderColor: '#2c2c2c',
			disableAutoPan: true,
			hideCloseButton: true,
			arrowPosition: 50,
			backgroundClassName: 'phoney',
			arrowStyle: 0
		});
		map.data.addListener('mouseover', function (event) {
			var parsed_maps_obj = JSON.parse(JSON.stringify(event.feature.getProperty('bounds')));
			var tooltip_center = {
				'lat': (parsed_maps_obj.north + parsed_maps_obj.south) / 2,
				'lng': (parsed_maps_obj.west + parsed_maps_obj.east) / 2
			};
			infoBubble.content = '<div class="tooltip"><p>' + event.feature.getProperty("suburb_name") + '</p><br><p id="colouredPrice">$' + event.feature.getProperty("price") + '</p></div>';
			infoBubble.position = new google.maps.LatLng(tooltip_center);
			infoBubble.open();
		});

		map.data.addListener('mouseout', function (event) {
			infoBubble.close();
		});
	} else {
	}

	// Get the modal
	var modal = document.getElementById('myModal');

// Get the button that opens the modal
	var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};

	//Modal popup
	var tradeMeRent = 'http://www.trademe.co.nz/Browse/CategoryAttributeSearchResults.aspx?search=1&cid=5748&sidebar=1&132=FLAT&selected135=5&selected136=77&134=1&135=5&136=';
	var tradeMeFlatmates = 'http://www.trademe.co.nz/Browse/CategoryAttributeSearchResults.aspx?search=1&cid=2975&sidebar=1&76=2975&134=1&135=7&136=';
	map.data.addListener('click', function (event) {
		$(".stats").fadeIn(120)
		var rentLink = document.getElementById("rentLink");
		var flatmatesLink = document.getElementById("flatmatesLink");
		var suburbName = document.getElementById('suburbName');

		var rentCount = document.getElementById("rentCount");
		var flatmatesCount = document.getElementById("flatmatesCount");

		var mbiePrice = document.getElementById("mbiePrice");

		var suburb = event.feature;

		var propertyID = suburb.getProperty('tmid');
		var propertyPrice = suburb.getProperty('price');
		var tradeMeTotalRentals, tradeMeTotalFlatmates;

		//Make TradeMe API call rentals
		$.getJSON('https://api.trademe.co.nz/v1/Search/Property/Rental.json?oauth_consumer_key=D17F85682EC9E85C5331A5EC8A37EF6C&oauth_signature_method=PLAINTEXT&oauth_signature=E2C3B1648930003B5A57AEA51486DDF0%26&suburb=' + propertyID, function (data) {
			tradeMeTotalRentals = data;
			rentCount.innerHTML = tradeMeTotalRentals.TotalCount;
		});

		$.getJSON('https://api.trademe.co.nz/v1/Search/Flatmates.json?oauth_consumer_key=D17F85682EC9E85C5331A5EC8A37EF6C&oauth_signature_method=PLAINTEXT&oauth_signature=E2C3B1648930003B5A57AEA51486DDF0%26&suburb=' + propertyID, function (data) {
			tradeMeTotalFlatmates = data;
			flatmatesCount.innerHTML = tradeMeTotalFlatmates.TotalCount;
		});

		rentLink.href = tradeMeRent + propertyID;
		flatmatesLink.href = tradeMeFlatmates + propertyID;
		suburbName.innerHTML = suburb.getProperty('suburb_name');

		mbiePrice.innerHTML = "$" + propertyPrice;

		console.log(suburb.getProperty('suburb_name'));
	});

	//Calculates boundaries of each suburb
	map.data.forEach(function (e) {

		//check for a polygon
		if (e.getGeometry().getType() === 'Polygon') {

			//initialize the bounds
			var bounds = new google.maps.LatLngBounds();

			//iterate over the paths
			e.getGeometry().getArray().forEach(function (path) {

				//iterate over the points in the path
				path.getArray().forEach(function (latLng) {

					//extend the bounds
					bounds.extend(latLng);
				});

			});

			//now use the bounds
			var some = e.setProperty('bounds', bounds);

			// new google.maps.Rectangle({map:map,bounds:bounds,clickable:false})
		}
	});
}