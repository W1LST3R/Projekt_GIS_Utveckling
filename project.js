//Globala variabler
var map;
var count = 0;
var nameArr = new Array();
var pointLayer;
var markers = new Array();
var walkingMarkers = new Array();
var bikingMarkers = new Array();

require(["esri/map", "esri/layers/GraphicsLayer", "esri/InfoTemplate", 
"esri/geometry/Point", "esri/symbols/PictureMarkerSymbol", "esri/graphic", 
"esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", 
"esri/geometry/Polyline", "esri/symbols/SimpleFillSymbol","dojo/on", "esri/geometry/Multipoint", "dojo/domReady!"], 
function(Map, GraphicsLayer, InfoTemplate, Point, PictureMarkerSymbol, Graphic, Color, SimpleSymbol, SimpleLineSymbol, Polyline, SimpleFillSymbol, On, Multipoint) {
	map = new Map("mapDiv", {
		basemap:"streets",
		center: [17.512102147310593, 60.16792682157719],
		zoom:8
	});
	// För att hitta koordinater på kartan.
	On(map, "click", function(evt) {
		var mapPoint = esri.geometry.webMercatorToGeographic(evt.mapPoint);
		console.log(mapPoint.x + ", " + mapPoint.y);
	});

	initButtons();
	getPointData();
	//getPointElevationData();

});

function getPointData() {
	//Ändra denna för att ta aktuell fil för visning
	
	//!!!OBS!!! SIMON ÄNDRADE ALLA DOJO.XHRGET TILL SYNC:"TRUE", DETTA FÖR ATT I VISSA FALL SÅ KOPPLADES INTE RÄTT DATA TILL RÄTT OBJEKT OSV.. FINNS KANSKE ANNAN LÖSNING
	
	var filePath;
	for(i = 11; i < 23; i++) {
		if(i == 18) i = 19;
		filePath = "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_"+ i + "_wgs84.json";
		saveName(filePath.substring(filePath.lastIndexOf("/")+1));
		var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
		dojo.xhrGet(pointData);
	};
	saveName("Etapp_Slinga_11_1_wgs84.json");
    pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_11_1_wgs84.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	saveName("Etapp_Slinga_12_1_wgs84.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_1_wgs84.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	saveName("Etapp_Slinga_12_2_inkl_kolkoja_wgs84.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_2_inkl_kolkoja_wgs84.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);	
	
	saveName("Etapp_Slinga_21_1_wgs84.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_21_1_wgs84.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	saveName("test.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/test.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	saveName("Biking_elevation161008.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Biking_elevation161008.json", handleAs:"json", sync:"true", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	saveName("Walk_elevation_123547.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_123547.json", handleAs:"json", sync:"true", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	saveName("Walk_elevation_151851.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_151851.json", handleAs:"json", sync:"true", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	
}

/*
function getPointElevationData(){
	//saveName("Biking_elevation161008.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Biking_elevation161008.json", handleAs:"json", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	//saveName("Walk_elevation_123547.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_123547.json", handleAs:"json", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	//saveName("Walk_elevation_151851.json");
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_151851.json", handleAs:"json", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
}
*/

function saveName(nameToSave) {
	//console.log(nameToSave);
	nameArr.push(nameToSave);
}

function getName() {
	return nameArr[count-1];
	//return nameArr.pop(0);
}
	
function makeLine(pointData) {
	pointLayer = new esri.layers.GraphicsLayer();
	map.addLayer(pointLayer);
		
	var path = new Array();

	//ForEach loop genom JSON data 
	dojo.forEach(pointData.posts, function(posts) {
		var lng = posts.longitude;
		var lat = posts.latitude;
		var point = new esri.geometry.Point(lng, lat);
		path.push(point);
	});
	
	var poly = new esri.geometry.Polyline();
	poly.addPath(path);
	var symbol = new esri.symbol.SimpleLineSymbol();
	symbol.style = "dash";
	symbol.width = 4;
	symbol.color = randomColor();
	
	count++;
	var graphic = new esri.Graphic(poly, symbol).setInfoTemplate(new esri.InfoTemplate(getName(), count));
	
	//Sparar aktuell led i den globala Arrayen markers, gömmer den, och lägger sedan till den på kartlagret
	markers.push(graphic);
	markers[markers.length-1].hide();
	pointLayer.add(markers[markers.length-1]);	
}

function makeElevationLine(pointData) {
	pointLayer = new esri.layers.GraphicsLayer();
	map.addLayer(pointLayer);
		
	var path = new Array();
	var elevation = new Array();
	
	//ForEach loop genom JSON data 
	dojo.forEach(pointData.posts, function(posts) {
		var lng = posts.longitude;
		var lat = posts.latitude;
		var ele = posts.elevation;
		var point = new esri.geometry.Point(lng, lat);
		point.hasZ = true;
		point.z = ele;
		//console.log(point.hasZ);
		//console.log(point)
		path.push(point);
		elevation.push(ele);
	});
	
	var poly = new esri.geometry.Polyline();
	poly.hasZ = true;
	poly.addPath(path)
	//console.log(poly);
	var symbol = new esri.symbol.SimpleLineSymbol();
	symbol.style = "dot";
	symbol.width = 5;
	symbol.color = randomColor();
	
	/*var highlightSymbol = new esri.symbol.SimpleLineSymbol();
	symbol.style = "solid";
	symbol.width = 5.5;
	symbol.color = "red";
	
	pointLayer.on("mouse-over", function(evt){
		var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol);
		map.graphics.add(highlightGraphic);
	});*/	
	
	count++;
	
	//string för att se elevation data
	var eleStr = "";
	
	for(var i = 0; i < elevation.length-1; i++) {
		eleStr += elevation[i] + ", ";
	}
	eleStr += elevation[elevation.length-1];
	//slut på string
	
	var graphic = new esri.Graphic(poly, symbol).setInfoTemplate(new esri.InfoTemplate(getName(), count + ": " + eleStr));
	
	//Sparar aktuell led i den globala Arrayen markers, gömmer den, och lägger sedan till den på kartlagret
	if(getName().charAt(0) == "W") {
		walkingMarkers.push(graphic);
	} else {
		bikingMarkers.push(graphic);
	}
	markers.push(graphic);
	markers[markers.length-1].hide();
	pointLayer.add(markers[markers.length-1]);
}
	
//bara för att se skillnad på de olika lederna
function randomColor() {
	let randomColor = "rgb("+random()+","+random()+","+random()+")";
	//console.log(randomColor);
	return randomColor;
}

function random() {
	return Math.floor(Math.random() * 255);
}

function initButtons(){
	require(["dojo/on"], function(on){
		dojo.query(".mapButton").forEach(function(entry, i){ 
			entry.addEventListener("click", function() {				
				showTrail(entry.id);
			}); 
		}); 
	}); 
} 

var pressedNoEle = false; //variabel för att hålla reda på om man har klickat på visning av trails utan elevation data
var pressedEle = false; //variabel för att hålla reda på om man har klickat på visning av trails med elevation data

function showTrail(buttonIndex) {
	
	//markers[0-15] == noElevation, markers[16-18] == elevation <-- verkar iallafall gälla vid sync:"true"
	if(buttonIndex != 3) {
		if(buttonIndex == 1 && !pressedNoEle) {
			for(let i = 0; i < 16; i++) {
				markers[i].show();
			}
			pressedNoEle = true;
		} else if(buttonIndex == 1 && pressedNoEle){
			for(let i = 0; i < 16; i++) {
				markers[i].hide();
			}
			pressedNoEle = false;
		} 
		
		if(buttonIndex == 2 && !pressedEle) {
			for(let i = 0; i < walkingMarkers.length; i++) {
				walkingMarkers[i].show();
			}
			for(let i = 0; i < bikingMarkers.length; i++) {
				bikingMarkers[i].show();
			}
			pressedEle = true;
		} else if(buttonIndex == 2 && pressedEle){
			for(let i = 0; i < walkingMarkers.length; i++) {
				walkingMarkers[i].hide();
			}
			for(let i = 0; i < bikingMarkers.length; i++) {
				bikingMarkers[i].hide();
			}
			pressedEle = false;
		}
	} else {
		alert("Click on one of the buttons to show a trail");
	}
} 

function hideShow(obj) {
	if(pressedEle) {
		if(obj.id == "walk") {
			if(obj.checked == false) {
				for(let i = 0; i < walkingMarkers.length; i++) {
					walkingMarkers[i].hide();
				}
				//obj.checked = false;
			} else {
				for(let i = 0; i < walkingMarkers.length; i++) {
					walkingMarkers[i].show();
				}
				//obj.checked = true;
			}
		} else {
			if(obj.checked == false) {
				for(let i = 0; i < bikingMarkers.length; i++) {
					bikingMarkers[i].hide();
				}
				//obj.checked = false;
			} else {
				for(let i = 0; i < bikingMarkers.length; i++) {
					bikingMarkers[i].show();
				}
				//obj.checked = true;
			}
		}
	} else {
		obj.checked = false;
	}
}

function active() {
	let bike = document.querySelector("#bike");
	let walk = document.querySelector("#walk");
	
	if(!pressedEle) {
		bike.checked = true;
		walk.checked = true;
	} else {
		bike.checked = false;
		walk.checked = false;
	}
}

/*
function showTrail(buttonIndex){
	//visar de olika trailsen
	if(buttonIndex == 1 || buttonIndex == 2){
		//anropar rätt trail
		trail(buttonIndex);
		//för att hamna på rätt plats i arrayen
		var posts =  buttonIndex-1 ;
		alert(markers.length);
		console.log(markers);
		//loopar igenom och gömmer den trail man visade innan
		for (i = 0; i < markers.length+1; i++){
			markers[i].hide();
		}
		//visar rätt trail
		markers[posts].show();
	} 
	else{
		//visar infon på info knappen
		if(buttonIndex==3){
				alert("Click on one of the buttons to show a trail")
		}
	} 
} 

function trail(buttonIndex){
	//visar posts utan elevation data
	if(buttonIndex == 1){
		count = 0;
		getPointData();	
	} 
	else {
		//visar posts med elevation data
		if(buttonIndex == 2){
			count = 0;
			getPointElevationData();
		}
	}	
}
*/
