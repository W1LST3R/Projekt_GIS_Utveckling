require(["esri/map","esri/layers/Graphic", "esri/InfoTemp","esri/geometry/Point",
"esri/symbols/PictureMarkerSymbol","esri/graphic","esri/Color","dojo/domReady!"],
  function(Map, GraphicsLayer){
    map = new Map("mapDiv",{
      basemap: "streets",
      center: [60.208251508,17.923597762],
      zoom: 14
    });

  
  
  
  function makePoi() {
	var poiLayer = new esri.layers.GraphicsLayer();
	map.addLayer(poiLayer);

}
