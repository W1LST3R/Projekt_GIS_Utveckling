//Globala variabler
var map;
var count = 0;
var nameArr = new Array();
var pointLayer;
var poiLayer;
var markers = new Array();
var walkingMarkers = new Array();
var bikingMarkers = new Array();
var poiBtnPressed = false;

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
	});

	initButtons();
	getPointData();
	//getPointElevationData();
});

function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

function makePoi(obj) {
	
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
	
	if(!poiBtnPressed) {
		poiBtnPressed = true;
		obj.style.backgroundColor = "lightgreen";
	}
	else {
		poiBtnPressed = false;
		obj.style.backgroundColor = "#e7e7e7";
	}
	
	poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);
	
	map.on("click", function(evt) {
		if(poiBtnPressed) {
			
			var mapPoint = esri.geometry.webMercatorToGeographic(evt.mapPoint);
			
			let shape = document.querySelector("#shape").value;
			let color = document.querySelector("#color").value;
			let info = document.querySelector("#poiInfo").value;
			let namn = document.querySelector("#poiName").value;
			
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
			
			var graphic = new esri.Graphic(new esri.geometry.Point(mapPoint.x, mapPoint.y), Symbol).setInfoTemplate(new esri.InfoTemplate(namn, info));
			poiLayer.add(graphic);
		}
	});
}

function getPointData() {
	//Ändra denna för att ta aktuell fil för visning
	
	//!!!OBS!!! SIMON ÄNDRADE ALLA DOJO.XHRGET TILL SYNC:"TRUE", DETTA FÖR ATT I VISSA FALL SÅ KOPPLADES INTE RÄTT DATA TILL RÄTT OBJEKT OSV.. FINNS KANSKE ANNAN LÖSNING
	
	var filePath;
	for(i = 11; i < 23; i++) {
		if(i == 18) i = 19; //~22jono03
		filePath = "http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_"+ i + "_wgs84.json";
		saveName(filePath.substring(filePath.lastIndexOf("/")+1));
		var pointData = {url:filePath, handleAs:"json", sync:"true", content:{}, load:makeLine};
		dojo.xhrGet(pointData);
	};
	saveName("Etapp_Slinga_11_1_wgs84.json");
    pointData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_11_1_wgs84.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	saveName("Etapp_Slinga_12_1_wgs84.json");
	pointData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_1_wgs84.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	saveName("Etapp_Slinga_12_2_inkl_kolkoja_wgs84.json");
	pointData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_2_inkl_kolkoja_wgs84.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);	
	
	saveName("Etapp_Slinga_21_1_wgs84.json");
	pointData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_21_1_wgs84.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	saveName("test.json");
	pointData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/test.json", handleAs:"json", sync:"true", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	saveName("Biking_elevation161008.json");
	pointData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Biking_elevation161008.json", handleAs:"json", sync:"true", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	saveName("Walk_elevation_123547.json");
	pointData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_123547.json", handleAs:"json", sync:"true", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	saveName("Walk_elevation_151851.json");
	pointData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_151851.json", handleAs:"json", sync:"true", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	
	
	//test
	pointData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_12_wgs84.json", handleAs:"json", sync:"true", content:{}, load:makePoint};
	dojo.xhrGet(pointData);
	
	
	/*
	//POI
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/POIJSON/Canoe_Farnebofjarden_POI.json", handleAs:"json", sync:"true", content:{}, load:makePoint};
	dojo.xhrGet(pointData);
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/POIJSON/Canoe_Gysinge_POI.json", handleAs:"json", sync:"true", content:{}, load:makePoint};
	dojo.xhrGet(pointData);
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/POIJSON/Canoe_Hedesundafjarden_POI.json", handleAs:"json", sync:"true", content:{}, load:makePoint};
	dojo.xhrGet(pointData);
	*/
	
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

//För punkter
function makePoint(pointData) {
	poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);
	
	let testCount = 0;

	dojo.forEach(pointData.posts, function(POI) {
		/*var lng = POI.lon;
		var lat = POI.lat;
		var name = POI.name;*/
		
		//För test
		var lng = POI.longitude;
		var lat = POI.latitude;
		//end
		
		var point = new esri.geometry.Point(lng, lat);
		var SimpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
		SimpleMarkerSymbol.color = randomColor();
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
	symbol.name = getName();
	symbol.join = "round";
	
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
	
	//Sparar aktuell led i den globala Arrayen markers, gömmer den, och lägger sedan till den på kartlagret
	markers.push(graphic);
	markers[markers.length-1].hide();
	pointLayer.add(markers[markers.length-1]);	
}

function makeElevationLine(pointData) {
	count++;
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
	symbol.name = getName();
	
	//Highlight on hover
	map.on("load", function(){
        map.graphics.enableMouseEvents();
        map.graphics.on("mouse-out", removeHighlight);
    });
	
	pointLayer.on("mouse-over", function(evt){
		var highlightSymbol = new esri.symbol.SimpleLineSymbol();
		highlightSymbol.style = "solid";
		highlightSymbol.width = 5.5;
		
		let color = evt.graphic.symbol.color.substring(0, evt.graphic.symbol.color.lastIndexOf(",")) + ", 0.5)";
		
		highlightSymbol.color = color;
		var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol).setInfoTemplate(new esri.InfoTemplate(evt.graphic.symbol.name));
		map.graphics.add(highlightGraphic);
	});
	//End highlight on hover
	
	//string för att se elevation data
	var eleStr = "";
	
	for(var i = 0; i < elevation.length-1; i++) {
		eleStr += elevation[i] + ", ";
	}
	eleStr += elevation[elevation.length-1];
	//slut på string
	
	var graphic = new esri.Graphic(poly, symbol);
	
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

function removeHighlight() {
    map.graphics.clear();
}
	
//bara för att se skillnad på de olika lederna
function randomColor() {
	let randomColor = "rgba("+random()+","+random()+","+random()+",0.8)";
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
				showTrail(entry);
			}); 
		}); 
	}); 
} 

var pressedNoEle = false; //variabel för att hålla reda på om man har klickat på visning av trails utan elevation data
var pressedEle = false; //variabel för att hålla reda på om man har klickat på visning av trails med elevation data

function showTrail(buttonIndex) {
	
	//markers[0-15] == noElevation, markers[16-18] == elevation <-- verkar iallafall gälla vid sync:"true"
	if(buttonIndex.id != 3) {
		if(buttonIndex.id == 1 && !pressedNoEle) {
			for(let i = 0; i < 16; i++) {
				markers[i].show();
			}
			pressedNoEle = true;
			buttonIndex.style.backgroundColor = "lightgreen";
		} else if(buttonIndex.id == 1 && pressedNoEle){
			for(let i = 0; i < 16; i++) {
				markers[i].hide();
			}
			pressedNoEle = false;
			buttonIndex.style.backgroundColor = "#e7e7e7";
		} 
		
		if(buttonIndex.id == 2 && !pressedEle) {
			for(let i = 0; i < walkingMarkers.length; i++) {
				walkingMarkers[i].show();
			}
			for(let i = 0; i < bikingMarkers.length; i++) {
				bikingMarkers[i].show();
			}
			pressedEle = true;
			buttonIndex.style.backgroundColor = "lightgreen";
		} else if(buttonIndex.id == 2 && pressedEle){
			for(let i = 0; i < walkingMarkers.length; i++) {
				walkingMarkers[i].hide();
			}
			for(let i = 0; i < bikingMarkers.length; i++) {
				bikingMarkers[i].hide();
			}
			pressedEle = false;
			buttonIndex.style.backgroundColor = "#e7e7e7";
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

function hidePOI(distance){
  
 // skapa en buffer kring leden, med hjälp av distansen vi som stoppas in i funktionen.
  var buffer = geometryEngine.buffer(polyline, distance, "meters");

  // kör for loop, se om varje punkt finns innanför buffern.
  var isWithin = geometryEngine.within(point, buffer);

  if (isWithin) {
    console.log("innanför");
  } else {
    console.log("utanför");
  }

	
}
