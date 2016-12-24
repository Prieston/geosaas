var http = require('http');
var fs = require('fs');
var shelljs = require('shelljs/global');

//Options to be used by request
var options = {
	host:"demo.boundlessgeo.com",
	port:"80",
	path:"/geoserver/wfs?request=GetFeature&typenames=osm:placenames_medium"
};
var callback = function(response){
	var body = "";
	response.on("data",function(data){
		body+=data;
	});
	response.on("end", function(){
		//Data recieved compvarely
		fs.writeFile(__dirname+'/_temp/async.xml',body,function (err){
			if(err) throw err;
				console.log('It\'s saved!');
 				exec('ogr2og2 ')
 		})
	})
	
};
//Make the request
var req = http.request(options,callback);
req.end()