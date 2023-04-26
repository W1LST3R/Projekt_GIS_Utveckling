/*require([
    "esri/map",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "dojo/domReady!"
], function(Map, GraphicsLayer, Point, PictureMarkerSymbol, SimpleMarkerSymbol, SimpleFillSymbol, Color) {
    var map = new Map("mapDiv", {
        basemap: "streets",
        center: [60.208251508, 17.923597762],
        zoom: 10
    });
    var graphics = new GraphicsLayer();
    map.addLayer(graphics);
});*/

//Start på simons js kod
var map;
//var poly;
//var symbol;


require(["esri/map", "esri/layers/GraphicsLayer", "esri/InfoTemplate", 
"esri/geometry/Point", "esri/symbols/PictureMarkerSymbol", "esri/graphic", 
"esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/geometry/Polyline", "esri/symbols/SimpleFillSymbol", "dojo/domReady!"], 
function(Map, GraphicsLayer, InfoTemplate, Point, PictureMarkerSymbol, Graphic, Color, SimpleSymbol, SimpleLineSymbol, Polyline, SimpleFillSymbol) {
	map = new Map("mapDiv", {
		basemap:"streets",
		center: [17.4319525, 60.6328659],
		zoom:7
	});
	

	/*symbol = {
		type: "simple-line",  // autocasts as new SimpleLineSymbol()
		color: "lightblue",
		width: "2px",
		style: "short-dash"
	};*/

	getPointData();
});

function getPointData() {
	//Ändra denna för att ta aktuell fil för visning
	var bengt;
	for(i = 11; i < 23; i++) {
		if(i == 18) i = 19;
		bengt = "http://www.student.hig.se/~21siha02/projekt/data/data/Biking_walking_no_elevation/Etapp_"+ i + "_wgs84.json";
		var pointData = {url:bengt, handleAs:"json", content:{}, load:makeLine};
		dojo.xhrGet(pointData);
	};
	//var pointData = {url:bengt, handleAs:"json", content:{}, load:makeLine};
	//dojo.xhrGet(pointData);
}

function makeLine(pointData) {
	var pointLayer = new esri.layers.GraphicsLayer();
	map.addLayer(pointLayer);
		
	var ring = new Array();
	
	//ForEach loop genom JSON data 
	dojo.forEach(pointData.posts, function(posts) {
		var lng = posts.longitude;
		var lat = posts.latitude;
		ring.push([lng, lat]);
		//var point = new esri.geometry.Point(lng, lat);
	});
	console.log(ring);
	var poly = new esri.geometry.Polyline();
	var symbol = new esri.symbol.SimpleLineSymbol();
	symbol.style = "dash";
	symbol.color = randomColor();

	poly.addPath(ring);
	
	var graphic = new esri.Graphic(poly, symbol).setInfoTemplate(new esri.InfoTemplate("Point"));
	pointLayer.add(graphic);
}

//bara för att se skillnad på de olika lederna
function randomColor() {
	let randomColor = "rgb("+random()+","+random()+","+random()+")";
	console.log(randomColor);
	return randomColor;
}

function random() {
	return Math.floor(Math.random() * 256);
}
//Slut på simons js kod

/*function getbiking_walking_with_elevation(){
}
	
function getBikingWalkingNoElevation(){
	var poiData;
	var nameForjson;
	var firstHalfOfName = "https://github.com/W1LST3R/Projekt_GIS_Utveckling/blob/main/Projekt%2C%20v16-v22/data/data/Biking_walking_no_elevation/Etapp_";
	var seccondHalfOfName = "_wgs84.json";
	for(i=11;i<23;i++){
		nameForjson = firstHalfOfName+i+seccondHalfOfName;
		poiData = {src:nameForjson, handleAs:"json", content:{}, load:showStops};
		dojo.xhrGet(poiData);
	}
	poiData = {src:"https://github.com/W1LST3R/Projekt_GIS_Utveckling/blob/main/Projekt%2C%20v16-v22/data/data/Biking_walking_no_elevation/Etapp_Slinga_11_1_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
	
	poiData = {src:"https://github.com/W1LST3R/Projekt_GIS_Utveckling/blob/main/Projekt%2C%20v16-v22/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_1_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
		
	poiData = {src:"https://github.com/W1LST3R/Projekt_GIS_Utveckling/blob/main/Projekt%2C%20v16-v22/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_2_inkl_kolkoja_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);	
	
	poiData = {src:"https://github.com/W1LST3R/Projekt_GIS_Utveckling/blob/main/Projekt%2C%20v16-v22/data/data/Biking_walking_no_elevation/Etapp_Slinga_21_1_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
	
	poiData = {src:"https://github.com/W1LST3R/Projekt_GIS_Utveckling/blob/main/Projekt%2C%20v16-v22/data/data/Biking_walking_no_elevation/test.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
}

function showStops(poiData) {
    var poiLayer = new esri.layers.GraphicsLayer();
    map.addLayer(poiLayer);
    var symbol = new esri.symbol.SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CIRCLE).setSize(16).setColor(new Color([255,255,0,0.5]));
	
    dojo.forEach(poiData.posts, function(posts){
        var lng = longitude;
        var lat = latitude;
	var point = new esri.geometry.Point(Number(lng), Number(lat))
        var Graphic = new esri.Graphic(point, symbol).setInfoTemplate(new esri.InfoTemplate("POI"));
        poiLayer.add(Graphic);
    });
}

function makePoi() {
	var poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);
}*/
