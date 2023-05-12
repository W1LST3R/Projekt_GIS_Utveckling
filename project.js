/*******************************************************
Globala Variabler
*******************************************************/
var map;
var count = 0;
var pointLayer;
var poiLayer;
let myTrailLayer;
var walkingAndBikingMarkers = new Array();
var walkingMarkers = new Array();
var bikingMarkers = new Array();
var poiBtnPressed = false;
let myPoiArr = new Array(); //Global array för användarsskapade pois
let currentLat;
let currentLon;
var markers = new Array();
markers = [walkingAndBikingMarkers, walkingMarkers, bikingMarkers];
var myTrailPath = new Array();
var myTrailArr = new Array();
var filterButton = false;

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
			let color = document.querySelector("#colorPoi").value;
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
				
				Symbol = SimpleMarkerSymbol;
			}
			
			var graphic = new esri.Graphic(new esri.geometry.Point(currentLon, currentLat), Symbol).setInfoTemplate(new esri.InfoTemplate(namn, info + pic));

			poiLayer.add(graphic);
			myPoiArr.push(graphic);
		}
		
		if(makeTrailPressed) {
			
			myTrailLayer = new esri.layers.GraphicsLayer();
			map.addLayer(myTrailLayer);
			
			var point = new esri.geometry.Point(currentLon, currentLat);
			myTrailPath.push(point);
			var SimpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
				SimpleMarkerSymbol.color = "rgba(255, 255, 255, 0.8)";
				SimpleMarkerSymbol.style = "solid";
				SimpleMarkerSymbol.size = 10;
				
				Symbol = SimpleMarkerSymbol;
			
			var graphic = new esri.Graphic(new esri.geometry.Point(currentLon, currentLat), Symbol).setInfoTemplate(new esri.InfoTemplate("En markör"));
			
			myTrailLayer.add(graphic);
			myTrailArr.push(myTrailLayer);
		}
	});
	
	pointLayer = new esri.layers.GraphicsLayer();
	map.addLayer(pointLayer);
	
	getPointData();
});

/*******************************************************
Funktioner för hämtning  och bearbetning av JSON data
*******************************************************/

function getPointData() {
	
	//!!!OBS!!! SIMON ÄNDRADE ALLA DOJO.XHRGET TILL SYNC:"TRUE", DETTA FÖR ATT I VISSA FALL SÅ KOPPLADES INTE RÄTT DATA TILL RÄTT OBJEKT OSV.. FINNS KANSKE ANNAN LÖSNING

	var filePath;
	for(var i = 1; i < 23; i++) {
		filePath = "http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Strecka"+ i + ".json";
		var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
		dojo.xhrGet(pointData);
	};
	filePath = "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/test.json";
	var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	filePath = "http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Biking_elevation161008.json";
	var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	filePath = "http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_123547.json";
	var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	filePath = "http://www.student.hig.se/~22jono3/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_151851.json";
	var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);

	//för att ladda in poi array
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/poisForMap/poiToilet/poiToilet.json", handleAs:"json", sync:"true", content:{}, load:makePOIs};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/poisForMap/poiFirePlace/poiFirePlace.json", handleAs:"json", sync:"true", content:{}, load:makePOIs};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/poisForMap/poiFood/poiFood.json", handleAs:"json", sync:"true", content:{}, load:makePOIs};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/poisForMap/poiInformation/poiInformation.json", handleAs:"json", sync:"true", content:{}, load:makePOIs};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/poisForMap/poiRestArea/poiRestArea.json", handleAs:"json", sync:"true", content:{}, load:makePOIs};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/poisForMap/poiParking/poiParking.json", handleAs:"json", sync:"true", content:{}, load:makePOIs};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/poisForMap/poiWaterPost/poiWaterPost.json", handleAs:"json", sync:"true", content:{}, load:makePOIs};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/poisForMap/poiWindShelter/poiWindShelter.json", handleAs:"json", sync:"true", content:{}, load:makePOIs};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/poisForMap/poiCabin/poiCabin.json", handleAs:"json", sync:"true", content:{}, load:makePOIs};
	dojo.xhrGet(pointData);
}

//För punkter
function makePoint(pointData) {
	poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);
	
	let testCount = 1;
	let color = colorArr.pop();

	dojo.forEach(pointData.posts, function(poi) {
		var lng = poi.lon;
		var lat = poi.lat;
		var name = poi.name;
		
		var point = new esri.geometry.Point(lng, lat);
		var SimpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
		SimpleMarkerSymbol.color = randomColor();
		SimpleMarkerSymbol.style = "triangle";
		SimpleMarkerSymbol.size = 14;
		
		var graphic = new esri.Graphic(point, SimpleMarkerSymbol).setInfoTemplate(new esri.InfoTemplate(testCount, lng + ", " +lat));
		poiLayer.add(graphic);
		testCount++;
	});
}

//För linjer/leder
function makeLine(pointData) {
		
	var path = new Array();
	var name = pointData.name;
	var etapp = pointData.etapp;
	generateOptions(name);
	
	//TEMP
	if(pointData.etapp === undefined) etapp = "E no name specified in JSON file"
	
	var length = 0;
	var flag = false;
	var point1;
	var point2;
	
	//ForEach loop genom JSON data 
	dojo.forEach(pointData.posts, function(posts) {
		var lng = posts.longitude;
		var lat = posts.latitude;
		var point = new esri.geometry.Point(lng, lat);
		path.push(point);
		if(flag) {
            point1 = path.pop();
            point2 = path.pop();
            length += calculateDistance(point1.y, point1.x, point2.y, point2.x);
            path.push(point2);
            path.push(point1);
        } else {
            flag = true;
        }
	});
	
	//Skapa polyline
	var poly = new esri.geometry.Polyline();
	poly.addPath(path);
	
	//Skapa symbolen för polylinen
	var symbol = new esri.symbol.SimpleLineSymbol();
	symbol.width = 5;
	symbol.name = name;
	symbol.distance = Number(length);
	
	//Style for biking and walking trails
	if(etapp.charAt(0) == "E" || etapp.charAt(0) == "t") {
		symbol.color = "rgba(78,123,212,0.8)";
		symbol.style = "dash";
	}
	//Style for walking trails
	else if(etapp.charAt(0) == "W") {
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
		var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol).setInfoTemplate(new esri.InfoTemplate(evt.graphic.symbol.name, "Leden är " + evt.graphic.symbol.distance.toFixed(1) + " km lång"));
		map.graphics.add(highlightGraphic);
		
		map.infoWindow.setTitle(evt.graphic.symbol.name);
        map.infoWindow.setContent("Leden är " + evt.graphic.symbol.distance.toFixed(1) + " km lång");
		map.infoWindow.show(evt.screenPoint,map.getInfoWindowAnchor(evt.screenPoint));
	});
	//End highlight on hover
	
	//Skapa det grafiska objektet med polyline och symbolen
	var graphic = new esri.Graphic(poly, symbol);
	graphic.id = count++;
	
	//Sparar aktuell led i sin globala Array, gömmer den, och lägger sedan till den på kartlagret
	if(etapp.charAt(0) == "E" || etapp.charAt(0) == "t") {
		walkingAndBikingMarkers.push(graphic);
		walkingAndBikingMarkers[walkingAndBikingMarkers.length-1].hide();
		pointLayer.add(walkingAndBikingMarkers[walkingAndBikingMarkers.length-1]);
	}
	else if(etapp.charAt(0) == "W") {
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
	map.infoWindow.hide();
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

function toggleTrails(source) {
	
	checkboxes = document.getElementsByName("trailCheck");
	
	for(let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = source.checked;
		showTrail(checkboxes[i])
	}
}

//Funktion för att visa verktygslådan för att visa leder
function showTrailPopup() {
	var popup = document.getElementById("trailPopup");
	popup.classList.toggle("show");
}

//Funktion för visning av trails
function showTrail(obj) {
	if(!obj.checked) markers[obj.value].forEach(arrElem => arrElem.hide());
	else markers[obj.value].forEach(arrElem => arrElem.show());
}


//Funktion för att visa verktygslådan för att skapa egna POIs
function showPoi(obj) {
	var popup = document.getElementById("poiPopup");
	popup.classList.toggle("show");
	
}

//Funktion för att visa/gömma utsatta POIs på kartan (gäller inte användarsskapade pois)
function hideShow(obj) {
	if(!obj.checked) allPOIs[obj.value].hide();
	else allPOIs[obj.value].show();
}

//Funktion för att visa/gömma ALLA utsatta POIs (gäller inte användarsskapade pois)
function togglePois(source) {
	
	checkboxes = document.getElementsByName("poiCheck");
	
	for(let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = source.checked;
		hideShow(checkboxes[i])
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
	let color = document.querySelector("#colorPoi");
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
var poiCount = 0;

function makePOIs(pointData){
	poiLayer = new esri.layers.GraphicsLayer();
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
		Symbol.name = name;
		Symbol.info = info;
		Symbol.pic = pic;
		Symbol.logo = logo;
		var graphic = new esri.Graphic(point, Symbol).setInfoTemplate(new esri.InfoTemplate(name,info+'<img src='+pic+'>'));
		graphic.id = poiCount++;
		poiLayer.add(graphic);
	});
	
	allPOIs.push(poiLayer);
}

/***********************************************
Gör en egen led
***********************************************/

var makeTrailPressed = false;

//Funktion för att visa verktygslådan för användarsskapade leder
function makeTrail() {
	
	var popup = document.getElementById("myTrail");
	popup.classList.toggle("show");
	
	let obj = document.getElementById("trailButton");
	
	if(!makeTrailPressed) {
		makeTrailPressed = true;
		obj.style.backgroundColor = "lightgreen";
	} else {
		makeTrailPressed = false;
		obj.style.backgroundColor = "#e7e7e7";
	}
}

//Funktion för att generera den användarsskapade leden på kartan
function makeThisTrail() {
	
	let typeOfTrail = document.querySelector("#trails");
	let index = Number(typeOfTrail.value);
	let color = markers[index][0].symbol.color;
	let style = markers[index][0].symbol.style;
	let width = markers[index][0].symbol.width;
	let name = document.querySelector("#trailName").value;
	
	if(name == "" || name == "Namn för din led...") name = "Min led";
	
	var poly = new esri.geometry.Polyline();
	poly.addPath(myTrailPath);

	var symbol = new esri.symbol.SimpleLineSymbol();
	symbol.width = width;
	symbol.color = color;
	symbol.style = style;
	symbol.name = name;
	
	var length = 0;
	var flag = false;
	var point1;
	var point2;
	
	for(let i = 0; i < myTrailPath.length; i++) {
		if(flag) {
            point1 = myTrailPath[i-1];
            point2 = myTrailPath[i];
            length += calculateDistance(point1.y, point1.x, point2.y, point2.x);
        } else {
            flag = true;
        }
	}
	
	symbol.distance = Number(length);
	
	let graphic = new esri.Graphic(poly, symbol);
	
	markers[index].push(graphic);
	pointLayer.add(graphic);

	for(let i = 0; i < myTrailArr.length; i++) {
		myTrailArr[i].hide();
	}
	myTrailArr = [];
	myTrailPath = [];
	makeTrail();
}



//Funktionen kalkyerar längden mellan två punkter i WGS84 med hjälp av Haversine formulan
function calculateDistance(lat1, lon1, lat2, lon2) { 
	const earthRadius = 6371; //Jordens radie i km
	//Konverterar grader till radianer
	const degToRad = (degrees) => (degrees * Math.PI) / 180;
	//Konverterar latitude och longitude till radianer
	const latRad1 = degToRad(lat1);
	const lonRad1 = degToRad(lon1);
	const latRad2 = degToRad(lat2);
	const lonRad2 = degToRad(lon2);
	//Kalkylerar skillnaderna mellan latituderna och longituderna
	const latDiff = latRad2 - latRad1;
	const lonDiff = lonRad2 - lonRad1;
	//Använder Haversine formula
	const a =
	  Math.sin(latDiff / 2) ** 2 +
	  Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(lonDiff / 2) ** 2;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	//Kalkylerar längden
	const distance = earthRadius * c;
  	//Längden i km
	return distance; 
}

function filterPoi(obj) {
    var led = document.querySelector("#led");
    var distance = document.querySelector("#distance");
	

    var popup = document.getElementById("myFilter");
    popup.classList.toggle("show");

    if (!filterButton) {
        filterButton = true;
        obj.style.backgroundColor = "lightgreen";
    } else {
        filterButton = false;
        obj.style.backgroundColor = "#e7e7e7";
        led.value = "Välj en led";
        distance.value = "";
    }

    poiLayer = new esri.layers.GraphicsLayer();
    map.addLayer(poiLayer);
}


function filtrate(){
	distance = document.getElementById("distance").value;
	led = document.getElementById("led").value;
	ledMarker = null;
	
	
//console.log(markers[0][0]);
	for(var i = 0; i < markers.length; i++){
	for(var j = 0; j < markers[i].length; j++){
	if (markers[i][j].symbol.name == led){
		ledMarker = markers[i][j];
		break;
	}
	}
	if(ledMarker != null)
		break;
	}
	
	console.log(ledMarker);
}

function generateOptions(pointData){


if (pointData==undefined){
	pointData = "test.json";
}	
var option = document.createElement("option");

// Sätt attributet "value"
option.value = pointData;

// Sätt innehållet (texten) på <option>
option.textContent = pointData;

// Lägg till <option> i en <select>
var select = document.getElementById("led");
select.appendChild(option);

	
}


