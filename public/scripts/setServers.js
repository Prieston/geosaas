var Server = [];
var Request = {};
var request;
Server[0] = {
	"name": "ArcgisonlineServer1",
	"link": "http://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer?",
	"linkYQL": "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fsampleserver1.arcgisonline.com%2FArcGIS%2Fservices%2FSpecialty%2FESRI_StatesCitiesRivers_USA%2FMapServer%2FWMSServer%3F",
	"service":"wms"
};
Server[1] ={
	"name": "BoundlessgeoServer",
	"link": "http://demo.boundlessgeo.com/geoserver/wms?",
	"linkYQL": "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fdemo.boundlessgeo.com%2Fgeoserver%2Fwms%3F",
	"service":"wms/wfs"
};
/*Server[2] ={
	"name": "BoundlessgeoServer",
	"link": "http://demo.bousssndlessgeo.com/geoserver/wms?",
	"linkYQL": "http://google.com/iam"
};*/
//http://openlayers.org/en/master/examples/data/ogcsample.xml
Request["getCapabilities"] ="request%3DGetCapabilities'";
Request["getMap"] ="request=GetMap";

