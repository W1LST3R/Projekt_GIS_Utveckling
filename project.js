require(["esri/map","esri/layers/Graphic","esri/InfoTemplate","esri/geometry/Point",
"esri/symbols/PictureMarkerSymbol","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleFillSymbol","esri/graphic","esri/Color","dojo/domReady!"],
	function(Map, GraphicsLayer){
		map = new Map("mapDiv",{
      			basemap: "streets",
      			center: [60.208251508,17.923597762],
      			zoom: 14
    	});	
	var graphics = new GraphicsLayer();
	map.addLayer(graphics);
	getBikingWalkingNoElevation();
});

function getbiking_walking_with_elevation(){
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
}
