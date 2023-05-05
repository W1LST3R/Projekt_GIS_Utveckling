function sortCoordinates(badData) {
	pointLayer = new esri.layers.GraphicsLayer();
	map.addLayer(pointLayer);
	var coordinates = new Array();
	var breakPoint = new Array();
	var newCoords = new Array();
	//Skapar en array med alla koordinater
	dojo.forEach(badData.posts, function(posts) {
		var lng = posts.longitude;
		var lat = posts.latitude;
		var point = new esri.geometry.Point(lng, lat);
		coordinates.push(point);
	});
	console.log(coordinates.length, "koordinat längd före")
	for(var i = 0; i < coordinates.length - 1; i++) {
		if (distance(coordinates[i], coordinates[i + 1]) > 0.01) {
			console.log(distance(coordinates[i], coordinates[i + 1]), "long boi", i + 1);
			breakPoint.push(i);
		}
	}
	if(breakPoint.length > 0) { //Kollar om det finns några dåliga koordinater
		if(breakPoint.length == 1) { //Sorterar koordinaterna om det är fel på 1 ställe
			for(var b = breakPoint[0] + 1; b < coordinates.length; b++) {
				newCoords.push(coordinates[b]);
			}
			for(var b = 0; b < breakPoint[0] + 1; b++) {
				newCoords.push(coordinates[b]);
			}
			console.log(newCoords.length, "koordinat längd efter");
			for(var b = 0; b < newCoords.length - 1; b++) {
				if(distance(newCoords[b], newCoords[b+1]) > 0.01) {
					console.log(b, "koordinaterna är fel sorterade!");
				}
			}
		} else { 
			var coordSlices = new Array();
			for(var i = 0; i < breakPoint.length; i++) {
				if(i == 0) {
					coordSlices.push(0);
					coordSlices.push(breakPoint[i]);
				} else {
					coordSlices.push(breakPoint[i - 1] + 1);
					coordSlices.push(breakPoint[i] + 1);
				}
			}
			var shortest = 100;
			var current = 0;
			var newCurrent = 0;
			var counter = 0;
			var coord;
			var check = false;
			while(counter < 20) {
				for(var i = 0; i < coordinates.length - 1; i++) {
					console.log("counter");
					if(distance(coordinates[current], coordinates[i]) < shortest) {
						shortest = distance(coordinates[current], coordinates[i]);
						coord = coordinates[i];
						newCurrent = i;
						if(distance(coordinates[current], coordinates[i]) < 0.01) {
							check = true;
						}
					}
				}
				shortest = 100;
				if(check) {
					newCoords.push(coord);
				} else {
					newCoords.unshift(coord);
				}
				coordinates.splice(current, 1);
				if(current < newCurrent) {
					current = newCurrent - 1;
				} else {
					current = newCurrent;
				}
				counter++;
			}
			//behöver använda unshift(), push(), splice() m.m. 
			//https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
			newCoords = [...coordinates];
		}
	} else {
	}
	
	newCoords = [...coordinates];
	makeLine(newCoords);
}

function distance(a, b) {
	//d = √[(x2 − x1)2 + (y2 − y1)2]
	return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2));
}
