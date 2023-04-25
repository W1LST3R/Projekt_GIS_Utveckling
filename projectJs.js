require(["esri/map","esri/layers/Graphic", "esri/InfoTemp","esri/geometry/Point",
"esri/symbols/PictureMarkerSymbol","esri/graphic","esri/Color","dojo/domReady!"],
	function(Map, GraphicsLayer){
		map = new Map("mapDiv",{
      			basemap: "streets",
      			center: [60.208251508,17.923597762],
      			zoom: 14
    		});	
	var graphics = new GraphicsLayer();
	map.addLayer(graphics);
});

function getbiking_walking_with_elevation(){
}
	
function getBikingWalkingNoElevation(){
	var poiData;
	var nameForjson;
	var firstHalfOfName = "Etapp_";
	var seccondHalfOfName = "_wgs84.json";
	for(i=11;i<23;i++){
		nameForjson = firstHalfOfName+i+seccondHalfOfName;
		poiData = {url:nameForjson, handleAs:"json", content:{}, load:showStops};
		dojo.xhrGet(poiData);
	}
	poiData = {url:"Etapp_Slinga_11_1_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
	
	poiData = {url:"Etapp_Slinga_12_1_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
		
	poiData = {url:"Etapp_Slinga_12_2_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);	
	
	poiData = {url:"Etapp_Slinga_21_1_wgs84.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
	
	poiData = {url:"test.json", handleAs:"json", content:{}, load:showStops};
	dojo.xhrGet(poiData);
}

function showStops(poiData) {
    var poiLayer = new esri.layers.GraphicsLayer();
    map.addLayer(poiLayer);
    var symbol = new esri.symbol.PictureMarkerSymbol('xx.png', 6, 6);
	
    dojo.forEach(poiData.posts, function(posts){
        var lng = longitude;
        var lat = latitude;
		var point = new esri.geometry.Point(Number(lng), Number(lat))
        var Graphic = new esri.Graphic(point, symbol).setInfoTemplate(new esri.InfoTemplate("Busshållplats", name));
        poiLayer.add(Graphic);
    });
}

function makePoi() {
	var poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);
}
