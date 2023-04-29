var map;
//var poly;
//var symbol;
var count = 0;
var name = " ";
var pointLayer;
var markers = new Array();


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

	/*symbol = {
		type: "simple-line",  // autocasts as new SimpleLineSymbol()
		color: "lightblue",
		width: "2px",
		style: "short-dash"
	};*/

	initButtons();

	//polyline test
	/*var testPoly = new Polyline();
	testPoly.addPath([[17.138002653843884, 60.657146144331314], [17.122896452672002, 60.66723896375573], [17.09268405032824, 60.65580019606267]]);
	var testSymbol = new SimpleLineSymbol();
	testSymbol.color = "red";
	testSymbol.width = 5;

	var testLayer = new GraphicsLayer();
	map.addLayer(testLayer);

	var graphicTest = new Graphic(testPoly, testSymbol);
	testLayer.add(graphicTest);*/

});

function getPointData() {
	//Ändra denna för att ta aktuell fil för visning
	var filePath;
	for(i = 11; i < 23; i++) {
		if(i == 18) i = 19;
		filePath = "http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_"+ i + "_wgs84.json";
		var pointData = {url:filePath, handleAs:"json", content:{}, load:makeLine};
		dojo.xhrGet(pointData);
		saveName("Etapp " + i);
	};
    pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_11_1_wgs84.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_1_wgs84.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
		
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_2_inkl_kolkoja_wgs84.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(pointData);	
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_21_1_wgs84.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/test.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(pointData);
	
	//var pointData = {url:bengt, handleAs:"json", content:{}, load:makeLine};
	//dojo.xhrGet(pointData);
}

function getPointElevationData(){
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Biking_elevation161008.json", handleAs:"json", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_123547.json", handleAs:"json", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
	pointData = {url:"http://www.student.hig.se/~22wipe02/udgis/Projekt_GIS_Utveckling-main/project/data/data/biking_walking_with_elevation/Walk_elevation_151851.json", handleAs:"json", content:{}, load:makeElevationLine};
	dojo.xhrGet(pointData);
}


function saveName(nameToSave) {
	//console.log(nameToSave);
	name = nameToSave;
}

function getName() {
	return name;
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
	symbol.width = 3;
	symbol.color = randomColor();

	console.log(poly);
	
	count++;
	var graphic = new esri.Graphic(poly, symbol).setInfoTemplate(new esri.InfoTemplate(count, getName()));
	markers.push(pointLayer);
	pointLayer.add(graphic);
	

	/*for(x = 0; x < path.length; x++) {
		poly.addPoint(path[x]);
	};
	var symbol = new esri.symbol.PictureMarkerSymbol();
    symbol.setUrl("http://www.student.hig.se/~22wipe02/udgis/lab6/bussbild.png");
    symbol.setWidth(7);
    symbol.setHeight(7);*/

	
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
		path.push(point);
		elevation.push(ele);
		
	});
	
	var poly = new esri.geometry.Polyline();
	poly.addPath(path)
	var symbol = new esri.symbol.SimpleLineSymbol();
	symbol.style = "dash";
	symbol.width = 3;
	symbol.color = randomColor();

	console.log(poly);
	console.log(elevation);
	
	count++;
	var graphic = new esri.Graphic(poly, symbol).setInfoTemplate(new esri.InfoTemplate(count));
	markers.push(pointLayer);
	pointLayer.add(graphic);
	
}

	
	/*
	var poly = new esri.geometry.Polyline([test]);
	//poly.addPath(test);
	console.log(poly);
	//poly.addPath(path)
	var symbol = new esri.symbol.SimpleLineSymbol();
	symbol.style = "dash";
	symbol.color = "red";
	symbol.width = 3;

	var layer = new esri.layers.GraphicsLayer();
	map.addLayer(layer);

	var graphic = new esri.Graphic(poly, symbol);
	layer.add(graphic);
	//console.log(getName());*/
	
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

function showTrail(buttonIndex){
	//visar de olika trailsen
	if(buttonIndex == 1 || buttonIndex == 2){
		//anropar rätt trail
		trail(buttonIndex);
		//för att hamna på rätt plats i arrayen
		var posts =  buttonIndex-1 ;
		alert(markers.length);
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
		getPointData();
		count = 0;	
	} 
	else {
		//visar posts med elevation data
		if(buttonIndex == 2){
			getPointElevationData();
			count = 0;
		}
	}	
}

