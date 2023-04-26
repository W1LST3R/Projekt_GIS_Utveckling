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
		zoom:11
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
	var filePath;
	for(i = 11; i < 23; i++) {
		if(i == 18) i = 19;
		filePath = "http://www.student.hig.se/~21siha02/projekt/data/data/Biking_walking_no_elevation/Etapp_"+ i + "_wgs84.json";
		var pointData = {url:filePath, handleAs:"json", content:{}, load:makeLine};
		dojo.xhrGet(pointData);
	};
    poiData = {url:"http://www.student.hig.se/~21siha02/projekt/data/data/Biking_walking_no_elevation/Etapp_Slinga_11_1_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
	
	poiData = {url:"http://www.student.hig.se/~21siha02/projekt/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_1_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
		
	poiData = {url:"http://www.student.hig.se/~21siha02/projekt/data/data/Biking_walking_no_elevation/Etapp_Slinga_12_2_inkl_kolkoja_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);	
	
	poiData = {url:"http://www.student.hig.se/~21siha02/projekt/data/data/Biking_walking_no_elevation/Etapp_Slinga_21_1_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
	
	poiData = {url:"http://www.student.hig.se/~21siha02/projekt/data/data/Biking_walking_no_elevation/test.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
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
	symbol.width = "3px"
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
