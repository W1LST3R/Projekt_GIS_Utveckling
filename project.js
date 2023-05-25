/*******************************************************
Globala Variabler
*******************************************************/
import * as permFun from "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/firebase.js";

document.querySelector("#sTP").addEventListener("click" , function(e){
	showTrailPopup();
});

document.querySelector("#hideShowAll").addEventListener("click" , function(e){
	toggleTrails(this);
});

document.querySelector("#bikingWalking").addEventListener("click" , function(e){
	showTrail(this);
});

document.querySelector("#walking").addEventListener("click" , function(e){
	showTrail(this);
});

document.querySelector("#biking").addEventListener("click" , function(e){
	showTrail(this);
});

document.querySelector("#permTraShow").addEventListener("click" , function(e){
	showTrail(this);
});

document.querySelector("#sFT").addEventListener("click" , function(e){
	showFilterTrail()
});

document.querySelector("#sP").addEventListener("click" , function(e){
	showPoi(this);
});

document.querySelector("#hideOrShow").addEventListener("click" , function(e){
	togglePois(this);
});

document.querySelector("#food").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#toilet").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#fireplace").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#information").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#restArea").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#parking").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#waterPost").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#windShelter").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#cabin").addEventListener("click" , function(e){
	hideShow(this);
}); 

document.querySelector("#square").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#diamond").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#circle").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#triangle").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#TempPoint").addEventListener("click" , function(e){
	hideShow(this);
});

document.querySelector("#poiBtn").addEventListener("click" , function(e){
	makePoi();
});

document.querySelector("#rMP").addEventListener("click" , function(e){
	removeMyPoi();
});

document.querySelector("#trailButton").addEventListener("click" , function(e){
	makeTrail();
});

document.querySelector("#mC").addEventListener("click" , function(e){
	makeCategory(this);
});

document.querySelector("#mTT").addEventListener("click" , function(e){
	makeThisTrail()
});

document.querySelector("#fP").addEventListener("click" , function(e){
	filterPoi(this);
});

document.querySelector("#f").addEventListener("click" , function(e){
	filtrate();
});
var map;
var count = 0;
var pointLayer;
var poiLayer;
let myTrailLayer;

//arrayer för att spara leder
var walkingAndBikingMarkers = new Array();
var walkingMarkers = new Array();
var bikingMarkers = new Array();
var permTrails = [];

//arrayer för att spara pois
var trianglePois = [];
var cirkelPois = [];
var diamantPois = [];
var fyrkantPois = [];
var restAreaPois = [];
var firePlacePois = [];
var foodPois = [];
var parkingPois = [];
var infoPois = [];
var wcPois = [];
var cabinPois = [];
var waterPois = [];
var windShelterPois = [];
var tempPoint = [];

//Global array för förbestämda POIs
var allPOIs = [wcPois,firePlacePois,foodPois,infoPois,restAreaPois,parkingPois,waterPois,
	windShelterPois,cabinPois,fyrkantPois,diamantPois,cirkelPois,trianglePois]; 
var poiCount = 0;

//Global array för förbestämda Trails
var markers = new Array();
markers = [walkingAndBikingMarkers, walkingMarkers, bikingMarkers, permTrails];

var makeCategoryPressed = false;
var categoryValue = 4;
var userCategories = new Array();

var poiBtnPressed = false;
let myPoiArr = new Array(); //Global array för användarsskapade pois
let currentLat;
let currentLon;

var myTrailPath = new Array();
var myTrailArr = new Array();
var filterButton = false;
//Variabel för att hålla reda på om användaren har klickat på "visning av leder"
var showTrailPopupPressed = false;

//Variabel för att hålla reda på om användaren har klickat på "filtrering av enskilda leder"
var showFilterTrailPressed = false;

var makeTrailPressed = false;

//ledMarker blir global
var ledMarker;

//för Firebase
var permPoiData = {};
var permTraData = {};
var permTra=[];
const pois = {"poi":permFun.getPermPoi()}
const trails = permFun.getPermTra();
const category = permFun.getPermCat();

var gsvc;
dojo.require("esri.map");
dojo.require("esri.tasks.geometry");


require(["esri/map", "esri/layers/GraphicsLayer", "esri/InfoTemplate", 
"esri/geometry/Point", "esri/symbols/PictureMarkerSymbol", "esri/graphic", 
"esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", 
"esri/geometry/Polyline", "esri/symbols/SimpleFillSymbol","dojo/on", 
"esri/geometry/Extent",
"dojo/domReady!"], 
function(Map, GraphicsLayer, InfoTemplate, Point, PictureMarkerSymbol, Graphic, Color, SimpleSymbol, SimpleLineSymbol, Polyline, SimpleFillSymbol, On, Extent) {
	map = new Map("mapDiv", {
		basemap:"streets",
		center: [17.484636326995133, 60.297470461771105], //17.512102147310593, 60.16792682157719
		zoom:9
	});

	//Set mouse style
	map.setMapCursor("grab");
	On(map, "mouse-drag", function() {
		map.setMapCursor("grabbing");
	});
	On(map, "mouse-drag-end", function() {
		map.setMapCursor("grab");
	});
		
	gsvc = new esri.tasks.GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
	
	// För att hitta koordinater på kartan.
	On(map, "click", function(evt) {
		var mapPoint = esri.geometry.webMercatorToGeographic(evt.mapPoint);
		console.log(mapPoint.x + ", " + mapPoint.y);
		currentLat = mapPoint.y;
		currentLon = mapPoint.x;
		//console.log(allPOIs);
		
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

			if(namn == "") namn = "En markör";
				
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

			Symbol.name = namn;
			Symbol.info = info;

			permPoiData = {
				"latitude" : currentLat,
				"longitude"	: currentLon,
				"logo" : shape,
				"color"	: color,
				"picture" : document.querySelector("#poiPic").value,
				"name" : namn,
				"description" : info,
			}

			var graphic = new esri.Graphic(new esri.geometry.Point(currentLon, currentLat), Symbol).setInfoTemplate(new esri.InfoTemplate(namn, info + pic));
			if(document.querySelector("#permPoi").checked){
				permFun.addPermPoi(permPoiData);
				makePOIs({"permPoi":permPoiData});
			}else{
				if(document.querySelector("#tempPoi").checked){
					poiLayer.add(graphic);
					myPoiArr.push(graphic);
					tempPoint.push(graphic);
					allPOIs.push(tempPoint);
				}
			}
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
			
			var pointInfo = {
				"latitude":currentLat,
				"longitude":currentLon
			}
			permTra.push(pointInfo);
			myTrailLayer.add(graphic);
			myTrailArr.push(myTrailLayer);
		}
		/* //Måste fixa denna, funkar endast så fort man själv skapar ett eget grafiskt objekt på kartan
		On("load", function(){
			map.graphics.enableMouseEvents();
			map.graphics.on("mouse-out", removeHighlight);
		});
		*/
	});
	
	pointLayer = new esri.layers.GraphicsLayer();
	map.addLayer(pointLayer);
	
	poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);
	
	getPointData();
	populateTrailFiltration();
	//Highlight on hover
	pointLayer.on("mouse-over", function(evt){
		var highlightSymbol = new esri.symbol.SimpleLineSymbol();
		highlightSymbol.style = "solid";
		highlightSymbol.width = evt.graphic.symbol.width;
		highlightSymbol.join = "round";
		
		let info;
		let name = evt.graphic.symbol.name;
		
		if(evt.graphic.symbol.info == undefined || evt.graphic.symbol.info == "Info för din led...") info = "";
		else info = "<br /><br />" + evt.graphic.symbol.info;
		
		if(name == undefined || name == "") name = "En led";
		
		let color = evt.graphic.symbol.color.substring(0, evt.graphic.symbol.color.lastIndexOf(",")) + ", 0.5)";

		highlightSymbol.color = color;
		var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol).setInfoTemplate(new esri.InfoTemplate(name, "Leden är " + evt.graphic.symbol.distance.toFixed(1) + " km lång" + info));
		map.graphics.add(highlightGraphic);
		
		map.infoWindow.setTitle(name);
        	map.infoWindow.setContent("Leden är " + evt.graphic.symbol.distance.toFixed(1) + " km lång" + info);
		map.infoWindow.show(evt.screenPoint,map.getInfoWindowAnchor(evt.screenPoint));
		
		enableMouseOut();
	});
	//End highlight on hover
	
	//Hover for markers
	poiLayer.on("mouse-over", function(evt){
		
		var highlightSymbol = new esri.symbol.SimpleMarkerSymbol();
		highlightSymbol.color = "rgba(0,0,0,0)";
		
		if(evt.graphic.symbol.style == undefined) highlightSymbol.style = "square";
		else highlightSymbol.style = evt.graphic.symbol.style;
		if(evt.graphic.symbol.width != undefined) highlightSymbol.size = 19.5;
		else highlightSymbol.size = evt.graphic.symbol.size+1;
		
		var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol);
		map.graphics.add(highlightGraphic);
		map.infoWindow.setTitle(evt.graphic.symbol.name);
        map.infoWindow.setContent(evt.graphic.symbol.info+'<img src='+evt.graphic.symbol.pic+'>');
		map.infoWindow.show(evt.screenPoint,map.getInfoWindowAnchor(evt.screenPoint));
		
		enableMouseOut();
	});
	
	function enableMouseOut() {
		if(map.graphics != null) {
			map.graphics.enableMouseEvents();
			map.graphics.on("mouse-out", removeHighlight);
		}else alert("map.graphics is null for some reason");
	}
});

//Funktion för att ta bort highlight av led
function removeHighlight() {
	map.graphics.clear();
	map.infoWindow.hide();
}

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
	filePath = "http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_151851.json";
	var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);

	makeLine(trails);

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

	makePOIs(pois);
	makeCategory(category);
}
/*
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
*/
//För linjer/leder
function makeLine(pointData) {
	if(pointData.perm==undefined){
		var path = new Array();
		var name = pointData.name;
		var etapp = pointData.etapp;
		generateOptions(name);
		var length = 0;
		var flag = false;
		var point1;
		var point2;	
	
		//TEMP
		if(pointData.etapp == undefined) etapp = "E no name specified in JSON file"
		
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
	}else{
		
		for(let i = 0; i < pointData.perm.length;i++){
			var path = new Array();
			var name = pointData.perm[i].name;
			var trailIndex = pointData.perm[i].trailIndex
			generateOptions(name);
			var length = 0;
			var flag = false;
			var point1;
			var point2;

			//Skapa symbolen för polylinen
			var symbol = new esri.symbol.SimpleLineSymbol();
			symbol.width = pointData.perm[i].width
			symbol.name = name
			symbol.distance = Number(length);
			symbol.color = pointData.perm[i].color
			symbol.style = pointData.perm[i].style
			symbol.info = pointData.perm[i].info

			//ForEach loop genom JSON data 
			dojo.forEach(pointData.perm[i].posts, function(posts) {
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
			
			//Skapa det grafiska objektet med polyline och symbolen
			var graphic = new esri.Graphic(poly, symbol);
			graphic.id = count++;

			if(trailIndex==0) {
				walkingAndBikingMarkers.push(graphic);
				walkingAndBikingMarkers[walkingAndBikingMarkers.length-1].hide();
				pointLayer.add(walkingAndBikingMarkers[walkingAndBikingMarkers.length-1]);
			}
			else if(trailIndex==1) {
				walkingMarkers.push(graphic);
				walkingMarkers[walkingMarkers.length-1].hide();
				pointLayer.add(walkingMarkers[walkingMarkers.length-1]);
			} else if(trailIndex==2){
				bikingMarkers.push(graphic);
				bikingMarkers[bikingMarkers.length-1].hide();
				pointLayer.add(bikingMarkers[bikingMarkers.length-1]);
			} else{
				permTrails.push(graphic);
				permTrails[permTrails.length-1].hide();
				pointLayer.add(permTrails[permTrails.length-1]);
			}
		}
	}

}
	
/*******************************************************
Funktioner för knappar och hantering av knapptryck
*******************************************************/

function toggleTrails(source) {
	
	var checkboxes = document.getElementsByName("trailCheck");
	
	for(let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = source.checked;
		showTrail(checkboxes[i])
	}
}

//Funktion för att visa verktygslådan för att visa leder
function showTrailPopup() {
	var popup = document.getElementById("trailPopup");
	popup.classList.toggle("show");
	
	if(!showTrailPopupPressed) showTrailPopupPressed = true;
	else showTrailPopupPressed = false;
	
	if(!showTrailPopupPressed && showFilterTrailPressed) {
		showFilterTrail();
	}
}

//Funktion för visning av trails
function showTrail(obj) {
	let checkbox = document.getElementsByName(obj.value);
	let index = 0;
	if(!obj.checked) {
		markers[obj.value].forEach((arrElem)=>{
			arrElem.hide();
			checkbox[index++].checked = false;
		});
	}
	else {
		markers[obj.value].forEach((arrElem)=>{
			arrElem.show();
			checkbox[index++].checked = true;
		});
	}
}

//Funktion för enskild visning av led
function showFilterTrail() {
	var popup = document.getElementById("filterTrails");
	popup.classList.toggle("show");
	if(!showFilterTrailPressed) showFilterTrailPressed = true;
	else showFilterTrailPressed = false;
}

//Funktion för att fylla listan med de olika enskilda lederna
function populateTrailFiltration() {
	
	//Tar bort innehåll så att nya leder som skapas även läggs till korrekt
	let element = document.getElementById("trailContent");
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
	
	for(let i = 0; i < markers.length; i++) {
		var index = 0;
        markers[i].forEach((graphic)=>{
            
            //const id = graphic.id; 

            const label = document.createElement('label');
            label.setAttribute("for", graphic.symbol.name);
           
            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = i;
            checkbox.value = index++;
            checkbox.id = graphic.symbol.name;
			checkbox.onclick = function() {
				if(!this.checked) markers[this.name][this.value].hide();
				else markers[this.name][this.value].show();
			};
			
			if(graphic.visible) checkbox.checked = true;
			
            label.appendChild(checkbox);
            
            label.appendChild(document.createTextNode(graphic.symbol.name));
			
            document.querySelector("#trailContent").appendChild(label);
        });
	}
}

//Funktion för att visa verktygslådan för att skapa egna POIs
function showPoi() {
	var popup = document.getElementById("poiPopup");
	popup.classList.toggle("show");
	
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
function makePoi() {
	let shape = document.querySelector("#shape");
	let color = document.querySelector("#colorPoi");
	let info = document.querySelector("#poiInfo");
	let namn = document.querySelector("#poiName");
	let pic = document.querySelector("#poiPic");
	
	let obj = document.getElementById("poiBtn");

	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
	
	if(!poiBtnPressed) {
		poiBtnPressed = true;
		obj.setAttribute("class", "mapButtonPressed");
		if(makeTrailPressed) makeTrail();
	}
	else {
		poiBtnPressed = false;
		obj.setAttribute("class", "mapButton");
		namn.value = "";
		info.value = "";
		shape.value = "Välj en symbol";
		color.value = "Välj en färg";
		pic.value = "";
	}
}

function makePOIs(pointData){
	var index = 0;
	var Symbol;
	let checkPic = /^http/i;

	if(pointData.permPoi==undefined){
		//ForEach loop genom JSON data 
		dojo.forEach(pointData.poi, function(poi) {
			var lng = poi.longitude;
			var lat = poi.latitude;
			var name = poi.name;
			var info = poi.description;
			var pic = poi.picture;
			var logo = poi.logo;
			var color = poi.color;
			var rights = poi.rights;
			var point = new esri.geometry.Point(lng,lat);
			
			if(rights == undefined){
				rights = "";
			}
			
			if(checkPic.test(pic)) pic = pic;
			else pic = "";

	
			if(logo.substring(0,1) == "h") {
				var PictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol();
				PictureMarkerSymbol.setUrl(logo);
				PictureMarkerSymbol.setHeight(20);
				PictureMarkerSymbol.setWidth(20);
				
				Symbol = PictureMarkerSymbol;
			} else {
				var SimpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
				SimpleMarkerSymbol.color = color;
				SimpleMarkerSymbol.style = logo;
				SimpleMarkerSymbol.size = 14;
				
				Symbol = SimpleMarkerSymbol;
			}
			Symbol.name = name;
			Symbol.info = info;
			Symbol.pic = pic;
			Symbol.logo = logo;
			var graphic = new esri.Graphic(point, Symbol).setInfoTemplate(new esri.InfoTemplate(name,info+"<img src="+pic+">"+rights));
			graphic.id = poiCount++;
			graphic.index = index++;
			if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/WC.jpg"){
				wcPois.push(graphic)
				poiLayer.add(wcPois[wcPois.length-1])
			}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Campfire.jpg"){
				firePlacePois.push(graphic)
					poiLayer.add(firePlacePois[firePlacePois.length-1])
				}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Food.jpg"){
					foodPois.push(graphic)
					poiLayer.add(foodPois[foodPois.length-1])
					}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Info.png"){
						infoPois.push(graphic)
						poiLayer.add(infoPois[infoPois.length-1])
						}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Bench.png"){
							restAreaPois.push(graphic)
							poiLayer.add(restAreaPois[restAreaPois.length-1])
							}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Parking.jpg"){
								parkingPois.push(graphic)
								poiLayer.add(parkingPois[parkingPois.length-1])
								}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Water.jpg"){
									waterPois.push(graphic)
									poiLayer.add(waterPois[waterPois.length-1])
									}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/WindShelter.jpg"){
										windShelterPois.push(graphic)
										poiLayer.add(windShelterPois[windShelterPois.length-1])
										}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Cabin.png"){
											cabinPois.push(graphic)
											poiLayer.add(cabinPois[cabinPois.length-1])
											}else if(logo=="square"){
												fyrkantPois.push(graphic)
												poiLayer.add(fyrkantPois[fyrkantPois.length-1])
												}else if(logo=="diamond"){
													diamantPois.push(graphic)
													poiLayer.add(diamantPois[diamantPois.length-1])
													}else if(logo=="circle"){
														cirkelPois.push(graphic)
														poiLayer.add(cirkelPois[cirkelPois.length-1])
														}else if(logo=="triangle"){
															trianglePois.push(graphic)
															poiLayer.add(trianglePois[trianglePois.length-1])
														}
		});
	}else{
			var lng = pointData.permPoi.longitude;
			var lat = pointData.permPoi.latitude;
			var name = pointData.permPoi.name;
			var info = pointData.permPoi.description;
			var pic = pointData.permPoi.picture;
			var logo = pointData.permPoi.logo;
			var color = pointData.permPoi.color;
			var rights = pointData.permPoi.rights;
			var point = new esri.geometry.Point(lng,lat);

			if(rights == undefined){
				rights = "";
			}
			if(checkPic.test(pic)) pic = pic;
			else pic = "";
	
			if(logo.substring(0,1) == "h") {
				var PictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol();
				PictureMarkerSymbol.setUrl(logo);
				PictureMarkerSymbol.setHeight(20);
				PictureMarkerSymbol.setWidth(20);
				
				Symbol = PictureMarkerSymbol;
			} else {
				var SimpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
				SimpleMarkerSymbol.color = color;
				SimpleMarkerSymbol.style = logo;
				SimpleMarkerSymbol.size = 14;
				
				Symbol = SimpleMarkerSymbol;
			}
			Symbol.name = name;
			Symbol.info = info;
			Symbol.pic = pic;
			Symbol.logo = logo;
			var graphic = new esri.Graphic(point, Symbol).setInfoTemplate(new esri.InfoTemplate(name,info+"<img src="+pic+">"+rights));
			graphic.id = poiCount++;
			graphic.index = index++;
			if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/WC.jpg"){
				wcPois.push(graphic)
				poiLayer.add(wcPois[wcPois.length-1])
			}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Campfire.jpg"){
				firePlacePois.push(graphic)
					poiLayer.add(firePlacePois[firePlacePois.length-1])
				}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Food.jpg"){
					foodPois.push(graphic)
					poiLayer.add(foodPois[foodPois.length-1])
					}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Info.png"){
						infoPois.push(graphic)
						poiLayer.add(infoPois[infoPois.length-1])
						}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Bench.png"){
							restAreaPois.push(graphic)
							poiLayer.add(restAreaPois[restAreaPois.length-1])
							}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Parking.jpg"){
								parkingPois.push(graphic)
								poiLayer.add(parkingPois[parkingPois.length-1])
								}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Water.jpg"){
									waterPois.push(graphic)
									poiLayer.add(waterPois[waterPois.length-1])
									}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/WindShelter.jpg"){
										windShelterPois.push(graphic)
										poiLayer.add(windShelterPois[windShelterPois.length-1])
										}else if(logo=="http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/Pics/Cabin.png"){
											cabinPois.push(graphic)
											poiLayer.add(cabinPois[cabinPois.length-1])
											}else if(logo=="square"){
												fyrkantPois.push(graphic)
												poiLayer.add(fyrkantPois[fyrkantPois.length-1])
												}else if(logo=="diamond"){
													diamantPois.push(graphic)
													poiLayer.add(diamantPois[diamantPois.length-1])
													}else if(logo=="circle"){
														cirkelPois.push(graphic)
														poiLayer.add(cirkelPois[cirkelPois.length-1])
														}else if(logo=="triangle"){
															trianglePois.push(graphic)
															poiLayer.add(trianglePois[trianglePois.length-1])
														}
	}									
}

//Funktion för att visa/gömma utsatta POIs på kartan (gäller inte användarsskapade pois)
function hideShow(obj) {
	if(!obj.checked) allPOIs[obj.value].forEach(poi => poi.hide());
	else allPOIs[obj.value].forEach(poi => poi.show());
}

//Funktion för att visa/gömma ALLA utsatta POIs (gäller inte användarsskapade pois)
function togglePois(source) {
	
	var checkboxes = document.getElementsByName("poiCheck");
	
	for(let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = source.checked;
		hideShow(checkboxes[i])
	}
}

/***********************************************
Gör en egen led
***********************************************/

//Funktion för att visa verktygslådan för användarsskapade leder
function makeTrail() {
	
	var popup = document.getElementById("myTrail");
	popup.classList.toggle("show");
	
	let obj = document.getElementById("trailButton");
	
	let setOption = document.getElementById("trails");
	let setName = document.getElementById("trailName");
	let setInfo = document.getElementById("trailInfo");
	
	if(!makeTrailPressed) {
		makeTrailPressed = true;
		obj.setAttribute("class", "mapButtonPressed");
		if(poiBtnPressed) makePoi();
	} else {
		makeTrailPressed = false;
		obj.setAttribute("class", "mapButton");
		setOption.value = "0";
		setName.value = "";
		setInfo.value = "";
	}
}

function makeCategory(obj) {
	
	var name;
	var color;
	var style;
	var width;
	
	if(obj.perm==undefined){

			if(!makeCategoryPressed) {
				makeCategoryPressed = true;
				obj.setAttribute("class", "mapButtonPressed");
			}
			else {
				makeCategoryPressed = false;
				obj.setAttribute("class", "mapButton");
			}
			
			const categorySettings = document.getElementById("myCategoryMenu");
			const trailMenu = document.getElementById("trailMenu");
			
			if(categorySettings.style.display === "none") {
				categorySettings.style.display = "block";
				trailMenu.style.display = "none";
			}
			else {
				categorySettings.style.display = "none";
				trailMenu.style.display = "block";
			}
		
			name = document.getElementById("categoryName").value;
			color = document.getElementById("categoryColor").value;
			style = document.getElementById("categoryStyle").value;
			width = document.getElementById("categoryWidth").value;

			if(document.querySelector("#permCat").checked){
				var permCatData = {
					"name":name,
					"color":color,
					"style":style,
					"width":width
				}
				console.log(permCatData)
				permFun.addPermCat(permCatData);
			}
		
		if(name != "" && !makeCategoryPressed) {
			
			//Skapa ett objekt med användarens inställningar och lägg till den i den globala arrayen userCategories
			let userStyle = {"color":color, "style":style, "width":width};
			userCategories.push(userStyle);
			
			//Skapa en <option> där man väljer kategori
			var option = document.createElement("option");
			option.value = categoryValue;
			option.textContent = name;
			
			//Skapa en array för kategorin och lägg till den i den globala arrayen markers
			let myArr = new Array();
			markers.push(myArr);

			//Lägg till våran <option> i <select> för kategorier
			var select = document.getElementById("trails");
			select.appendChild(option);
			
			//Skapa checkbox för leden
			const label = document.createElement('label');
			label.setAttribute("for", name);
			
			const checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.name = "trailCheck";
			checkbox.value = categoryValue++;
			checkbox.id = name;
			
			checkbox.onclick = function() {
				showTrail(this);
			};
				
			label.appendChild(checkbox);
				
			label.appendChild(document.createTextNode(name));
				
			document.querySelector("#myCategories").appendChild(label);
			
			let setName = document.getElementById("categoryName");
			let setColor = document.getElementById("categoryColor");
			let setStyle = document.getElementById("categoryStyle");
			let setWidth = document.getElementById("categoryWidth");
			setName.value = "";
			setColor.value = "rgba(255,255,255,0.8)";
			setStyle.value = "solid";
			setWidth.value = "7";
			
		} else {
			if(!makeCategoryPressed) {
				alert("Du måste ange ett namn på din kategori för att den ska sparas.");
			}
		}
	}else{
		for(let i = 0; i < obj.perm.length;i++){
			name = obj.perm[i].name;
			color = obj.perm[i].color;
			style = obj.perm[i].style;
			width = obj.perm[i].width;

				
			//Skapa ett objekt med användarens inställningar och lägg till den i den globala arrayen userCategories
			let userStyle = {"color":color, "style":style, "width":width};
			userCategories.push(userStyle);
				
			//Skapa en <option> där man väljer kategori
			var option = document.createElement("option");
			option.value = categoryValue;
			option.textContent = name;
				
			//Skapa en array för kategorin och lägg till den i den globala arrayen markers
			let myArr = new Array();
			markers.push(myArr);

			//Lägg till våran <option> i <select> för kategorier
			var select = document.getElementById("trails");
			select.appendChild(option);
				
			//Skapa checkbox för leden
			const label = document.createElement('label');
			label.setAttribute("for", name);
				
			const checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.name = "trailCheck";
			checkbox.value = categoryValue++;
			checkbox.id = name;
				
			checkbox.onclick = function() {
				showTrail(this);
			};
					
			label.appendChild(checkbox);
					
			label.appendChild(document.createTextNode(name));
					
			document.querySelector("#myCategories").appendChild(label);
				
			let setName = document.getElementById("categoryName");
			let setColor = document.getElementById("categoryColor");
			let setStyle = document.getElementById("categoryStyle");
			let setWidth = document.getElementById("categoryWidth");
			setName.value = "";
			setColor.value = "rgba(255,255,255,0.8)";
			setStyle.value = "solid";
			setWidth.value = "7";	
		} 
	}
}

//Funktion för att generera den användarsskapade leden på kartan
function makeThisTrail() {
	let typeOfTrail = document.querySelector("#trails");
	let index = Number(typeOfTrail.value);
	let name = document.querySelector("#trailName").value;
	let info = document.querySelector("#trailInfo").value;
	let color, style, width;
	if(index <= 2) {
		color = markers[index][0].symbol.color;
		style = markers[index][0].symbol.style;
		width = markers[index][0].symbol.width;
	} else {
		color = userCategories[index-3].color;
		style = userCategories[index-3].style;
		width = userCategories[index-3].width;
	}
	
	if(name == "") name = "Min led";

	//Lägg till den nya leden i filtrering av poi baserat på avstånd
	generateOptions(name);
	
	var poly = new esri.geometry.Polyline();
	poly.addPath(myTrailPath);

	var symbol = new esri.symbol.SimpleLineSymbol();
	symbol.width = width;
	symbol.color = color;
	symbol.style = style;
	symbol.name = name;
	symbol.info = info;

	permTraData={
		"posts":permTra,
		"trailIndex":index,
		"width" : width,
		"color" : color,
		"style" : style,
		"name" : name,
		"info" : info
		}

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

	if(document.querySelector("#permTra").checked){
		permFun.addPermTra(permTraData)
		permTra=[];
		permTraData={};

	}else{
		if(document.querySelector("#tempTra").checked){
			permTraData={};
		}
	}
	markers[index].push(graphic);
	pointLayer.add(markers[index][markers[index].length-1]);

	for(let i = 0; i < myTrailArr.length; i++) {
		myTrailArr[i].hide();
	}
	myTrailArr = [];
	myTrailPath = [];

	makeTrail();
	populateTrailFiltration();
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
        obj.setAttribute("class", "mapButtonPressed");
    } else {
        filterButton = false;
        obj.setAttribute("class", "mapButton");
        led.value = "Välj en led";
        distance.value = "";
    }

    poiLayer = new esri.layers.GraphicsLayer();
    map.addLayer(poiLayer);
}

function filtrate(){
	var distance = document.getElementById("distance").value;
	var led = document.getElementById("led").value;
	ledMarker = null;
	
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
	
	doBuffer(distance);
}

function doBuffer(distance) {

    map.graphics.clear();
	
    var params = new esri.tasks.BufferParameters();
	params.geometries = [];
	params.distances = [distance];
	
	for(let i = 0; i < allPOIs.length; i++) {
		for(let j = 0; j < allPOIs[i].length; j++) {
			params.geometries.push(allPOIs[i][j].geometry);
		}
	}

    //buffer in linear units such as meters, km, miles etc.
    params.unit = esri.tasks.GeometryService.UNIT_KILOMETER;
    params.outSpatialReference = map.spatialReference;
	
    gsvc.buffer(params, showBuffer);
}

function showBuffer(geometries) {
	console.log(ledMarker);
    var symbol = new esri.symbol.SimpleFillSymbol(
    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new dojo.Color([0,0,255,0.65]), 2
        ),
      new dojo.Color([0,0,255,0.35])
    );
	let i = 0;
	let index = 0;
	
    dojo.forEach(geometries, function(geometry) {

		var extent = geometry.getExtent();
		
		if(i == allPOIs[index].length || allPOIs[index].length == 0) {
			index++;
			i = 0;
		}
		
		if(extent.intersects(ledMarker.geometry)) {
			allPOIs[index][i++].show();
			//var graphic = new esri.Graphic(geometry,symbol);
			//map.graphics.add(graphic);
		}
		else allPOIs[index][i++].hide();
    });
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


