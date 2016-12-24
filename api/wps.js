var exports;
var http = require('http');
var fs = require('fs');
var exec = require ('child_process').exec;
var Promise = require('promise');
console.log("so far")
format={};
format["Esri Shapefile"]='.shp';
format["MapInfo File"]='.tab';
format["TIGER"]='.ft';
format["S57"]='.000';
format["DGN"]='.dgn';
format["Memory"]='';
format["BNA"]='.bna';
format["CSV"]='.csv';
format["GML"]='.gml';
format["GPX"]='.gpx';
format["LIBKML"]='.libkmkl';
format["KML"]='.kml';
format["GeoJSON"]='.geojson';
format["DXF"]='.dxf';
format["GeoRSS"]='.georss';
format["GMT"]='.gmt';
format["XLSX"]='.xlsx';
format["PDF"]='.pdf';

exports.respond = function(body){
	console.log(body)
	return new Promise(function (resolve,reject){
		var response = {};
		body.port = body.port || "80"
		//Options to be used by request
		var options = {
			host:body.host,
			port:body.port,
			path:body.path
		};
		console.log(options)
		console.log("so far 1")
		var callback = function(response){
			var b = "";
			response.on("data",function(data){
				b+=data;
			});
			response.on("end", function(){
				console.log('so far 2')
				//Data recieved compvarely
				fs.writeFile(__dirname + '/../public/_temp/async.xml',b,function (err){
					if(err) throw err;
					console.log('It\'s saved!');
					exec('rm -rf '+ __dirname + '/../public/_temp/res;mkdir '+ __dirname + '/../public/_temp/res;rm '+ __dirname + '/../public/_temp/res.zip',
					 function (err, stdout, stderr){
					 	console.log('res file created')
					 	exec('ogr2ogr -f "'+body.format+'" '+__dirname +'/../public/_temp/res/new'+format[body.format] + ' '+__dirname +'/../public/_temp/async.xml',
					 			 function (err, stdout, stderr){
					 				console.log("first execute");
					 				exec('zip -r ' + __dirname +'/../public/_temp/res ' + __dirname +'/../public/_temp/res',
					 				 function (err, stdout, stderr){
					 					console.log("second execute")
					 					response.status = 'success!';
										console.log(response.status);
										resolve(response);
							 		})
					 			})
					})
				})

			})

		};
		//Make the request
		var req1 = http.request(options,callback).end();
		
	});
}