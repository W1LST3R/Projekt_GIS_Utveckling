var map;
//var poly;
//var symbol;
var count = 0;
var name = " ";

require(["esri/map", "esri/layers/GraphicsLayer", "esri/InfoTemplate", 
"esri/geometry/Point", "esri/symbols/PictureMarkerSymbol", "esri/graphic", 
"esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", 
"esri/geometry/Polyline", "esri/symbols/SimpleFillSymbol","dojo/on", "esri/geometry/Multipoint", "dojo/domReady!"], 
function(Map, GraphicsLayer, InfoTemplate, Point, PictureMarkerSymbol, Graphic, Color, SimpleSymbol, SimpleLineSymbol, Polyline, SimpleFillSymbol, On, Multipoint) {
	map = new Map("mapDiv", {
		basemap:"streets",
		center: [17.512102147310593, 60.16792682157719],
		zoom:10
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

	getPointData();

	//polyline test
	var testPoly = new Polyline();
	testPoly.addPath([[17.138002653843884, 60.657146144331314], [17.122896452672002, 60.66723896375573], [17.09268405032824, 60.65580019606267]]);
	var testSymbol = new SimpleLineSymbol();
	testSymbol.color = "red";
	testSymbol.width = 5;

	var testLayer = new GraphicsLayer();
	map.addLayer(testLayer);

	var graphicTest = new Graphic(testPoly, testSymbol);
	testLayer.add(graphicTest);

});

function getPointData() {
	//Ändra denna för att ta aktuell fil för visning
	var filePath;
	for(i = 11; i < 23; i++) {
		if(i == 18) i = 19;
		filePath = "http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_"+ i + "_wgs84.json";
		var pointData = {url:filePath, handleAs:"json", content:{}, load:makeLine};
		dojo.xhrGet(pointData);
		saveName("Etapp " + i);
	};
    poiData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_11_1_wgs84.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(poiData);
	
	poiData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_1_wgs84.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(poiData);
		
	poiData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_2_inkl_kolkoja_wgs84.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(poiData);	
	
	poiData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/Etapp_Slinga_21_1_wgs84.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(poiData);
	
	poiData = {url:"http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/project/data/data/Biking_walking_no_elevation/test.json", handleAs:"json", content:{}, load:makeLine};
	dojo.xhrGet(poiData);
	
	//var pointData = {url:bengt, handleAs:"json", content:{}, load:makeLine};
	//dojo.xhrGet(pointData);
}

function saveName(nameToSave) {
	//console.log(nameToSave);
	name = nameToSave;
}

function getName() {
	return name;
}

function makeLine(pointData) {
	var pointLayer = new esri.layers.GraphicsLayer();
	map.addLayer(pointLayer);
		
	var path = new Array();

	//ForEach loop genom JSON data 
	dojo.forEach(pointData.posts, function(posts) {
		var lng = posts.longitude;
		var lat = posts.latitude;
		var point = new esri.geometry.Point(lng, lat);
		path.push(point);
	});

	var poly = new esri.geometry.Multipoint();
	/*var symbol = new esri.symbol.SimpleLineSymbol();
	symbol.style = "dash";
	symbol.width = 3;
	symbol.color = randomColor();*/
	for(x = 0; x < path.length; x++) {
		poly.addPoint(path[x]);
	};
	console.log(poly);
	var symbol = new esri.symbol.PictureMarkerSymbol();
    symbol.setUrl("http://www.student.hig.se/~21siha02/udgis/lab5/data/bilder/bussbild.png");
    symbol.setWidth(7);
    symbol.setHeight(7);

	count++;
	var graphic = new esri.Graphic(poly, symbol).setInfoTemplate(new esri.InfoTemplate(count, getName()));
	pointLayer.add(graphic);
	
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
