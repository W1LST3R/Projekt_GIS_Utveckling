/*******************************************************
Globala Variabler
*******************************************************/
var map;
var count = 0;
var nameArr = new Array();
var pointLayer;
var poiLayer;
var walkingAndBikingMarkers = new Array();
var walkingMarkers = new Array();
var bikingMarkers = new Array();
var poiBtnPressed = false;
let myPoiArr = new Array(); //Global array för användarsskapade pois
let currentLat;
let currentLon;

require(["esri/map", "esri/layers/GraphicsLayer", "esri/InfoTemplate", 
"esri/geometry/Point", "esri/symbols/PictureMarkerSymbol", "esri/graphic", 
"esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", 
"esri/geometry/Polyline", "esri/symbols/SimpleFillSymbol","dojo/on", 
"esri/geometry/Multipoint", "dojo/domReady!"], 
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
		currentLat = mapPoint.y;
		currentLon = mapPoint.x;
		
		//Funktion för att placera ut en poi
		if(poiBtnPressed) {
			
			let shape = document.querySelector("#shape").value;
			let color = document.querySelector("#color").value;
			let info = document.querySelector("#poiInfo").value;
			let namn = document.querySelector("#poiName").value;
			let pic = document.querySelector("#poiPic").value;
						
			let checkPic = /^http/i;

			if(checkPic.test(pic)) pic = "<img src="+pic+">";
			else pic = "";

			if(namn == "Namn för din markör..." || namn == "") namn = "En markör";
				
			if(info == "Info för din markör...") info = "";
			
			info = "Longitude: " + currentLon + "<br />Latitude: " + currentLat + "<br /><br />" + info;
			
			let Symbol;
			
			if(shape.substring(0,1) == "h") {
				var PictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol();
				PictureMarkerSymbol.setUrl(shape);
				PictureMarkerSymbol.setHeight(20);
				PictureMarkerSymbol.setWidth(20);
				
				Symbol = PictureMarkerSymbol;
			} else {
				var SimpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
				SimpleMarkerSymbol.color = color;
				SimpleMarkerSymbol.style = shape;
				SimpleMarkerSymbol.size = 14;
				
				Symbol = SimpleMarkerSymbol
			}
			
			var graphic = new esri.Graphic(new esri.geometry.Point(currentLon, currentLat), Symbol).setInfoTemplate(new esri.InfoTemplate(namn, info + pic));

			poiLayer.add(graphic);
			myPoiArr.push(graphic);
		}
	});
	initButtons();
	getPointData();
});

/*******************************************************
Funktioner för hämtning  och bearbetning av JSON data
*******************************************************/

function getPointData() {
	
	//!!!OBS!!! SIMON ÄNDRADE ALLA DOJO.XHRGET TILL SYNC:"TRUE", DETTA FÖR ATT I VISSA FALL SÅ KOPPLADES INTE RÄTT DATA TILL RÄTT OBJEKT OSV.. FINNS KANSKE ANNAN LÖSNING

	var filePath;
	for(i = 1; i < 23; i++) {
		filePath = "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Strecka"+ i + ".json";
		var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
		dojo.xhrGet(pointData);
	};
	filePath = "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/test.json";
	var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	filePath = "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Biking_elevation161008.json";
	var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	filePath = "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_123547.json";
	var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	filePath = "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_151851.json";
	var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
}

//test
let colorArr = new Array();
function makeColor() {
	for(var i = 0; i < 20; i++) {
		colorArr[i] = randomColor();
	}
};

//För punkter
function makePoint(pointData) {
	poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);
	
	let testCount = 1;
	let color = colorArr.pop();

	dojo.forEach(pointData.posts, function(poi) {
		/*var lng = poi.lon;
		var lat = poi.lat;
		var name = poi.name;*/
		
		//För test
		var lng = poi.longitude;
		var lat = poi.latitude;
		//end
		
		var point = new esri.geometry.Point(lng, lat);
		var SimpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
		SimpleMarkerSymbol.color = color;
		SimpleMarkerSymbol.style = "triangle";
		SimpleMarkerSymbol.size = 14;
		//console.log(testCount)
		var graphic = new esri.Graphic(point, SimpleMarkerSymbol).setInfoTemplate(new esri.InfoTemplate(testCount, lng + ", " +lat));
		poiLayer.add(graphic);
		testCount++;
		});
}

function makeLine(pointData) {
	count++;
	pointLayer = new esri.layers.GraphicsLayer();
	map.addLayer(pointLayer);
		
	var path = new Array();
	var name = pointData.name;
	
	//TEMP
	if(pointData.name === undefined) name = "E no name specified in JSON file"

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
	symbol.width = 4;
	symbol.name = name;
	
	//Style for biking and walking trails
	if(name.charAt(0) == "E" || name.charAt(0) == "t") {
		symbol.color = "rgba(78,123,212,0.8)";
		symbol.style = "dash";
	}
	//Style for walking trails
	else if(name.charAt(0) == "W") {
		symbol.color = "rgba(252,140,35,0.8)";
		symbol.style = "dot";
	} 
	//Style for biking trails
	else {
		symbol.color = "rgba(145,74,7,0.8)";
		symbol.style = "solid";
	}
	
	//Highlight on hover
	map.on("load", function(){
        map.graphics.enableMouseEvents();
        map.graphics.on("mouse-out", removeHighlight);

    });

	pointLayer.on("mouse-over", function(evt){
		var highlightSymbol = new esri.symbol.SimpleLineSymbol();
		highlightSymbol.style = "solid";
		highlightSymbol.width = 5.5;
		highlightSymbol.join = "round";
		
		let color = evt.graphic.symbol.color.substring(0, evt.graphic.symbol.color.lastIndexOf(",")) + ", 0.5)";

		highlightSymbol.color = color;
		var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol).setInfoTemplate(new esri.InfoTemplate(evt.graphic.symbol.name));
		map.graphics.add(highlightGraphic);
	});
	//End highlight on hover
	
	var graphic = new esri.Graphic(poly, symbol);
	graphic.id = count;
	
	//Sparar aktuell led i sin globala Array, gömmer den, och lägger sedan till den på kartlagret
	if(name.charAt(0) == "E" || name.charAt(0) == "t") {
		walkingAndBikingMarkers.push(graphic);
		walkingAndBikingMarkers[walkingAndBikingMarkers.length-1].hide();
		pointLayer.add(walkingAndBikingMarkers[walkingAndBikingMarkers.length-1]);
	}
	else if(name.charAt(0) == "W") {
		walkingMarkers.push(graphic);
		walkingMarkers[walkingMarkers.length-1].hide();
		pointLayer.add(walkingMarkers[walkingMarkers.length-1]);
	} else {
		bikingMarkers.push(graphic);
		bikingMarkers[bikingMarkers.length-1].hide();
		pointLayer.add(bikingMarkers[bikingMarkers.length-1]);
	}
}

//Funktion för att ta bort highlight av led
function removeHighlight() {
    map.graphics.clear();
}
	
//Funktion för att generera ett slumpmässigt rgba värde
function randomColor() {
	let randomColor = "rgba("+random()+","+random()+","+random()+",0.8)";
	return randomColor;
}

function random() {
	return Math.floor(Math.random() * 255);
}

/*******************************************************
Funktioner för knappar och hantering av knapptryck
*******************************************************/

//Initiering av knappar och event listeners
function initButtons(){
	require(["dojo/on"], function(on){
		dojo.query(".mapButton").forEach(function(entry, i){ 
			entry.addEventListener("click", function() {				
				showTrail(entry);
			}); 
		}); 
	}); 
}

var pressedBikeTrails = false; //variabel för att hålla reda på om man har klickat på visning av cykel leder
var pressedWalkTrails = false; //variabel för att hålla reda på om man har klickat på visning av vandrings leder
var pressedWalkingAndBikingTrails = false; //variabel för att hålla reda på om man har klickat på visning av cykel och vandrings leder

//Funktion för visning av trails
function showTrail(buttonIndex) {

	if(buttonIndex.id != 5) {
		
		//För cykel leder
		if(buttonIndex.id == 1 && !pressedBikeTrails) {
			for(let i = 0; i < bikingMarkers.length; i++) {
				bikingMarkers[i].show();
			}
			pressedBikeTrails = true;
			buttonIndex.style.backgroundColor = "lightgreen";
		} else if(buttonIndex.id == 1 && pressedBikeTrails){
			for(let i = 0; i < bikingMarkers.length; i++) {
				bikingMarkers[i].hide();
			}
			pressedBikeTrails = false;
			buttonIndex.style.backgroundColor = "#e7e7e7";
		} 
		//End

		//För vandrings leder
		if(buttonIndex.id == 2 && !pressedWalkTrails) {
			for(let i = 0; i < walkingMarkers.length; i++) {
				walkingMarkers[i].show();
			}
			pressedWalkTrails = true;
			buttonIndex.style.backgroundColor = "lightgreen";
		} else if(buttonIndex.id == 2 && pressedWalkTrails){
			for(let i = 0; i < walkingMarkers.length; i++) {
				walkingMarkers[i].hide();
			}
			pressedWalkTrails = false;
			buttonIndex.style.backgroundColor = "#e7e7e7";
		}
		//End
		
		//För cykel och vandrings leder
		if(buttonIndex.id == 3 && !pressedWalkingAndBikingTrails) {
			for(let i = 0; i < walkingAndBikingMarkers.length; i++) {
				walkingAndBikingMarkers[i].show();
			}
			pressedWalkingAndBikingTrails = true;
			buttonIndex.style.backgroundColor = "lightgreen";
		} else if(buttonIndex.id == 3 && pressedWalkingAndBikingTrails){
			for(let i = 0; i < walkingAndBikingMarkers.length; i++) {
				walkingAndBikingMarkers[i].hide();
			}
			pressedWalkingAndBikingTrails = false;
			buttonIndex.style.backgroundColor = "#e7e7e7";
		}
		//End
		
	} else {
		alert("Klicka på en knapp för att visa leder");
	}
}

/*******************************************************
Funktioner för POI
*******************************************************/

//Funktion för att ta bort användarsskapade POIs
function removeMyPoi() {
	if(myPoiArr.length != 0) {
		myPoiArr[myPoiArr.length-1].hide();
		myPoiArr.pop();
	}
}

//Funktion för användare att skapa egna POIs
function makePoi(obj) {
	
	let shape = document.querySelector("#shape");
	let color = document.querySelector("#color");
	let info = document.querySelector("#poiInfo");
	let namn = document.querySelector("#poiName");
	let pic = document.querySelector("#poiPic");
	
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
	
	if(!poiBtnPressed) {
		poiBtnPressed = true;
		obj.style.backgroundColor = "lightgreen";
	}
	else {
		poiBtnPressed = false;
		obj.style.backgroundColor = "#e7e7e7";
		namn.value = "Namn för din markör...";
		info.value = "Info för din markör..."
		shape.value = "Välj en symbol";
		color.value = "Välj en färg";
		pic.value = "Länk för bild...";
	}
	
	poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);
}

var allPOIs = new Array(); //Global array för POIs

function makePOIs(pointData){
	let poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);

	//ForEach loop genom JSON data 
	dojo.forEach(pointData.poi, function(poi) {
		var lng = poi.longitude;
		var lat = poi.latitude;
		var name = poi.name;
		var info = poi.description;
		var pic = poi.picture;
		var logo = poi.logo;
		var point = new esri.geometry.Point(lng,lat);
		
		var PictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol();
		PictureMarkerSymbol.setUrl(logo);
		PictureMarkerSymbol.setHeight(20);
		PictureMarkerSymbol.setWidth(20);
				
		var Symbol = PictureMarkerSymbol;
		var graphic = new esri.Graphic(point, Symbol).setInfoTemplate(new esri.InfoTemplate(name,info+'<img src='+pic+'>'));
		poiLayer.add(graphic);
	});
	allPOIs.push(poiLayer);
}

var showPoiPressed = false;

function showPoi(obj) {
	var popup = document.getElementById("poiPopup");
	popup.classList.toggle("show");
	
	/*
	if(!showPoiPressed) {
		showPoiPressed = true;
		obj.style.backgroundColor = "lightgreen";
	} else {
		showPoiPressed = false;
		obj.style.backgroundColor = "#e7e7e7";
	}
	*/
}

function hideShow(obj) {
	if(!obj.checked) allPOIs[obj.value].hide();
	else allPOIs[obj.value].show();
}
/*
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
*/
