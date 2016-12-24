var express = require('express');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var fs = require('fs');
var path = require("path");
var url = require("url");
var request = require("request")


var app = express();
app.use(express.static(__dirname + '/' + 'public'));
app.use(bodyParser.xml());
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var clientData =[]

app.post("*/wps:module",function (req,res){
	var module = req.params.module;

	console.log("from post",req.body['wps:Execute']['wps:DataInputs'][0]['wps:Input'][0]['wps:Data'][0]['wps:ComplexData'][0]["_"])
	
	var clientUrl = decodeURIComponent(req.body['wps:Execute']['wps:DataInputs'][0]['wps:Input'][0]['wps:Data'][0]['wps:ComplexData'][0]["_"]);


	var wps = require(__dirname + '/api/wps.js');
	var l = url.parse(clientUrl)
	l.format = 'Esri Shapefile'
		wps.respond(l)
		.then( function (results) {
			res.sendfile(__dirname + '/' + 'public/xml/ExecuteResponse_succeeded.xml');
		})
		.catch(function (e) {
					res.status(500).send(e);
					console.log(e.message);
				});
})

app.get('/:module',function (req,res){

	var module = req.params.module;
	console.log(module)
	switch (module){

		case 'convertResponse':
			res.sendfile(__dirname + '/' + 'public/_temp/res.zip');
		break;

		case 'wps_proxy':
		res.sendfile(__dirname + '/' + 'public/wps_proxy/wps-js/target/wps-js-0.1.2-SNAPSHOT/example.html');
		break;

		case "wps":
			if (typeof req.query.request === "undefined") {
			res.sendfile(__dirname + '/' + 'public/xml/ExecuteResponse_accepted.xml');
			}

			else if (req.query.request.toLowerCase()=="getcapabilities") {
			res.sendfile(__dirname + '/' + 'public/xml/GetCapabilities.xml');
			}
			else if (req.query.request.toLowerCase()=="describeprocess") {
				res.sendfile(__dirname + '/' + 'public/xml/DescribeProcess.xml');
			}
		break;

		case 'wps/RetrieveResultServlet':
		res.sendfile(__dirname + '/' + 'public/xml/ExecuteResponse_started.xml');
		break;
		default:
			var response = {};
			response.message = 'Invalid module';
			res.status(500).send(JSON.stringify(response))
			console.log(response.message);
		break;
	};
});

app.post('/:module', urlencodedParser, function (req,res) {
	var module = req.params.module;
		switch (module){
		case 'wps':
		var wps = require(__dirname + '/api/wps.js');
		wps.respond(req.body)
		.then( function (results) {
			res.end("success");
		})
		.catch(function (e) {
					res.status(500).send(e);
					console.log(e.message);
				});
		break;
		default:
		var response = {};
		response.message = 'Invalid module';
		res.status(500).send(response.message);
		console.log(response.message);
	};
})

app.get('/wps_proxy/wps_proxy',function (req,res){

	 var queryData = url.parse(req.url, true).query;
    if (queryData.url) {
        request({
            url: queryData.url
        }).on('error', function(e) {
            res.end(e);
        }).pipe(res);
    }
    else {
        res.end("no url found");
    }
})

app.post('/wps_proxy/wps_proxy',function (req,res){

		 var queryData = url.parse(req.url, true).query;
    if (queryData.url) {
        request({
            url: queryData.url
        }).on('error', function(e) {
            res.end(e);
        }).pipe(res);
    }
    else {
        res.end("no url found");
    }
})


var ipaddress = process.env.OPENSHIFT_NODEJS_IP||'127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.set('port', port);

app.listen(app.get('port'),ipaddress, function() {
	console.log( 'Server started on port ' + app.get('port'))
})
//asdfsd