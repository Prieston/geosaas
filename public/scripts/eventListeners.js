$(document).ready(function(){
	$("#ServerAddImageBtn").click(function(){
		$("#ServerAddImage").show();
		$(window).trigger('resize');
	});
	$("#ServerAddImageBtn").one('click',function(){
		WMS();
		$("#wms_filters").hide();
		$("#wms_filters_apply").hide();
		$("#wms_filters_clear").hide();
		$("#wms_layers").show();
		$("#wms_layers_preview").show();
		$("#wms_layers_filters").show();
		$(window).trigger('resize');
	});
	$("#ServerAddFeatureBtn").click(function(){
		$("#ServerAddFeature").show();
		$(window).trigger('resize');
	});
	$("#ServerAddFeatureBtn").one('click',function(){
		WFS();
		$("#wfs_filters").hide();
		$("#wfs_filters_apply").hide();
		$("#wfs_filters_clear").hide();
		$("#wfs_layers").show();
		$("#wfs_layers_preview").show();
		$("#wfs_layers_filters").show();
		$(window).trigger('resize');
	});
	$("#UploadFromFileBtn").click(function(){
		$("#UploadFromFile").show();
		$(window).trigger('resize');
	});
	$("#ServerSettingsBtn").one("click",function(){
		for(var i = 0; i< Server.length; i++){
			$("#server_list").append("<tr><td style = 'width:50%'><center><a href='"+Server[i].link+"' target = '_blank' style = 'color:blue'>" + Server[i].name+"</a></center></td><td style = 'width:50%;text-align:center;color:grey'>"+Server[i].service+"</td></tr>");
		};
		$("#ServerSettings").show();
	});
	$("#ServerSettingsBtn").click(function(){
		$("#ServerSettings").show();
	});
	$("#wms_filters_apply").click(function(){
		$("#wms_filters").hide();
		$("#wms_filters_apply").hide();
		$("#wms_filters_clear").hide();
		$("#wms_layers").show();
		$("#wms_layers_preview").show();
		$("#wms_layers_filters").show();
	});
	$("#wms_layers_filters").click(function(){
		wmsFilters();
		$("#wms_layers").hide();
		$("#wms_layers_preview").hide();
		$("#wms_layers_filters").hide();
		$("#wms_filters").show();
		$("#wms_filters_clear").show();
		$("#wms_filters_apply").show();
	});
	$("#wfs_filters_apply").click(function(){
		$("#wfs_filters").hide();
		$("#wfs_filters_apply").hide();
		$("#wfs_filters_clear").hide();
		$("#wfs_layers").show();
		$("#wfs_layers_preview").show();
		$("#wfs_layers_filters").show();
	});
	$("#wfs_layers_filters").click(function(){
		wmsFilters();
		$("#wfs_layers").hide();
		$("#wfs_layers_preview").hide();
		$("#wfs_layers_filters").hide();
		$("#wfs_filters").show();
		$("#wfs_filters_clear").show();
		$("#wfs_filters_apply").show();
	});
	$("#wms_layers_preview").click(function(){
		service_requested="wms";
		//REMOVE ANY OTHER TEMPLATE LAYER IF EXISTS 
		var remove_temp = $("[id^='temp_").attr("id");
		$("[id^='temp_").remove();
		map.removeLayer(ollayers[remove_temp]);

		var rowindex = $('#wms_layers').jqxGrid('getselectedrowindex');
		$('#wms_layers').jqxGrid('showrowdetails', rowindex);
		try{
			var server = document.getElementById("servername" + rowindex).getElementsByTagName("a")[0].getAttribute('href')
		}
		catch(e){
			$("#messages").append("<span style = 'color:blue'>" +getFullTime() + "</span> Error: Open the layer details to perform a request.<br />");
		}
		/*=================== MANDATORY PARAMETERS ===================*/
		var version = WMSLayers[rowindex].version;
		var request = Request["getMap"];
		var layers = $('#wms_layers').jqxGrid('getcellvalue', rowindex, "name");
		var styles = (function(){
			if (document.getElementById("wms_style" + rowindex).getElementsByTagName("select")[0].value !== "<not set>"){
				return document.getElementById("wms_style" + rowindex).getElementsByTagName("select")[0].value;
			}
			else { return "" };
		})();
		var crs = document.getElementById("wms_crs" + rowindex).getElementsByTagName("select")[0].value;
		var bbox = (function(){
			for (var i = 0; i < WMSLayers[rowindex].boundingbox.length; i++){
				if (WMSLayers[rowindex].boundingbox[i].crs == crs){
					return {minx:WMSLayers[rowindex].boundingbox[i].minx,
							miny:WMSLayers[rowindex].boundingbox[i].miny,
							maxx:WMSLayers[rowindex].boundingbox[i].maxx,
							maxy:WMSLayers[rowindex].boundingbox[i].maxy};
				};
			};
		})();
		var width = document.getElementById("wms_width_value" + rowindex).value;
		var height = document.getElementById("wms_height_value" + rowindex).value;
		var format = document.getElementById("wms_format" + rowindex).getElementsByTagName("select")[0].value;
		/*=================== OPTIONAL PARAMETERS ===================*/
		var transparent =  document.getElementById("wms_transparent" + rowindex).getElementsByTagName("select")[0].value;
		var bgcolor = document.getElementById("wms_bgcolor" + rowindex).innerHTML;
		var exceptions =  document.getElementById("wms_exception" + rowindex).getElementsByTagName("select")[0].value;
		var dimentions = [];
		var requestlink = server + request + "&VERSION=" + version +"&LAYERS=" + layers + "&STYLES=" + styles + "&CRS=" + crs + "&BBOX="+ bbox.minx + "," + bbox.miny + "," + bbox.maxx + "," + bbox.maxy + "&WIDTH=" + width + "&HEIGHT=" + height + "&FORMAT=" + format + "&TRANPARENT=" + transparent + "&BGCOLOR=" + bgcolor + "&EXCEPTIONS=" + exceptions;
			document.getElementById('Preview').src = requestlink;
			document.getElementById("gws_current_layer").value = layers;
			document.getElementById("gws_current_layer").alt = rowindex;
			//add to temporary layer
			var name = "temp_"+WMSLayers[rowindex].name;
			$("#gws_contents").prepend("<div class = 'sortable-item' id = '"+name+"'><input type = 'radio' checked = 'true' name = 'contents' alt = '" + $("#Preview").attr("src") + "' onchange = 'change(this)' class = 'maplayer_radio'/><input type = 'checkbox' id = '" + name + "' class = 'maplayer_check' checked = 'true' onchange = 'layerVisibility(this)'/><label id = '"+name+"'class = 'layer'>" + name + "</label></div>");
			$('body').delegate('.layer', 'click', function() {
				$(this).attr("class","layer_selected");

			});

var active = $('#tabswidgetBot').jqxTabs('selectedItem'); 
		if(active=="0"){
			$("#preview_li").trigger("click");
		}
		else{
			$("#map_li").trigger("click")
		}

			var coords = [Number(WMSLayers[rowindex].boundingbox[0].minx),Number(WMSLayers[rowindex].boundingbox[0].miny),Number(WMSLayers[rowindex].boundingbox[0].maxx),Number(WMSLayers[rowindex].boundingbox[0].maxy)];

			var crs = WMSLayers[rowindex].boundingbox[0].crs;

			function transformCoords(){
				var newCoordmin = ol.proj.transform([coords[0],coords[1]],crs,'EPSG:3857');
				var newCoordmax = ol.proj.transform([coords[2],coords[3]],crs,'EPSG:3857');
				var newcoords = [newCoordmin[0],newCoordmin[1],newCoordmax[0],newCoordmax[1]];

				console.log(newcoords)
				return newcoords;
				
			}
			var transform = transformCoords();
			
			(function transformCheck(){
				for (var i = 0; i<4; i++){
					if (isNaN(transform[i])){
						$("#messages").append("<span style = 'color:blue'>" +getFullTime() + "</span> An error detected when zooming to layer " +name+ " extent.<br />");
						return;
					}
				}
			})();
			console.log(coords,transform)
		
			var lay = new ol.layer.Tile({
				source: new ol.source.TileWMS({
					url: WMSLayers[rowindex].server.link,
					params: {'LAYERS': WMSLayers[rowindex].name,'TILED': true},
					serverType: 'geoserver',
					wrapX:true
				})
			});
			ollayers[name] = lay;
			map.addLayer( ollayers[name] );

			//var extent = lay.getExtent();
			ollayers[name].extent=transform
			console.log(transform)
		map.getView().fit(transform, map.getSize()); 
		
			
});
var service_requested;

$("#wfs_layers_preview").click(function(){


		var remove_temp = $("[id^='temp_").attr("id");
		$("[id^='temp_").remove();
		map.removeLayer(ollayers[remove_temp])

	service_requested="wfs";
	var rowindex = $('#wfs_layers').jqxGrid('getselectedrowindex');
	var layers = $('#wfs_layers').jqxGrid('getcellvalue', rowindex, "name");
	
	    var url = 'http://demo.boundlessgeo.com/geoserver/wfs?request=GetFeature&typenames='+ layers;
	    document.getElementById('Preview').src = 'data:text/html;charset=utf-8,<html>To preview the xml/gml file visit <a href = "'+url+'" target = "_blank">'+layers+'</a></html>';
	   



	    //add to temporary layer
			var name = "temp_"+WFSLayers[rowindex].name;
			$("#gws_contents").prepend("<div class = 'sortable-item' id = '"+name+"'><input type = 'radio' checked = 'true' name = 'contents' alt = '" + $("#Preview").attr("src") + "' onchange = 'change(this)' class = 'maplayer_radio'/><input type = 'checkbox' id = '" + name + "' class = 'maplayer_check' checked = 'true' onchange = 'layerVisibility(this)'/><label id = '"+name+"'class = 'layer'>" + name + "</label></div>");
			$('body').delegate('.layer', 'click', function() {
				$(this).attr("class","layer_selected");

			});

var active = $('#tabswidgetBot').jqxTabs('selectedItem'); 
		if(active=="0"){
			$("#preview_li").trigger("click");
		}
		else{
			$("#map_li").trigger("click")
		}
		// format used to parse WFS GetFeature responses
	var geojsonFormat = new ol.format.GeoJSON();
	var rowindex = $('#wfs_layers').jqxGrid('getselectedrowindex');
	var layers = $('#wfs_layers').jqxGrid('getcellvalue', rowindex, "name");
	var vectorSource = new ol.source.Vector({
	  loader: function(extent, resolution, projection) {
	    var url = 'http://demo.boundlessgeo.com/geoserver/wfs?request=GetFeature&typenames='+ layers+'&outputFormat=text/javascript&format_options=callback:loadFeatures' +
	        '&srsname=EPSG:3857&bbox=' + extent.join(',');
	    // use jsonp: false to prevent jQuery from adding the "callback"
	    // parameter to the URL
	    $.ajax({url: url, dataType: 'jsonp', jsonp: false});
	  },
	  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
	    maxZoom: 19
	  }))
	});


	/**
	 * JSONP WFS callback function.
	 * @param {Object} response The response object.
	 */
	window.loadFeatures = function(response) {
	  vectorSource.addFeatures(geojsonFormat.readFeatures(response));
	};
		var vector = new ol.layer.Vector({
	  source: vectorSource,
	  style: new ol.style.Style({
	    stroke: new ol.style.Stroke({
	      color: 'rgba(0, 0, 255, 1.0)',
	      width: 2
	    })
	  })
	});
		ollayers[name] = vector;
	map.addLayer( ollayers[name] );
	var coords = []
			coords[0]=Number(WFSLayers[rowindex].wgs84boundingbox.minxy.substring(0,WFSLayers[rowindex].wgs84boundingbox.minxy.indexOf(" ")))
			coords[1]=Number(WFSLayers[rowindex].wgs84boundingbox.minxy.substring(WFSLayers[rowindex].wgs84boundingbox.minxy.indexOf(" ")+1,WFSLayers[rowindex].wgs84boundingbox.minxy.length))
			coords[2]=Number(WFSLayers[rowindex].wgs84boundingbox.maxxy.substring(0,WFSLayers[rowindex].wgs84boundingbox.minxy.indexOf(" ")))
			coords[3]=Number(WFSLayers[rowindex].wgs84boundingbox.maxxy.substring(WFSLayers[rowindex].wgs84boundingbox.minxy.indexOf(" ")+1,WFSLayers[rowindex].wgs84boundingbox.minxy.length))
			console.log(coords[0],coords[1])

			function transformCoords(){
				var newCoordmin = ol.proj.transform([coords[0],coords[1]],"EPSG:4326",'EPSG:3857');
				var newCoordmax = ol.proj.transform([coords[2],coords[3]],"EPSG:4326",'EPSG:3857');
				var newcoords = [newCoordmin[0],newCoordmin[1],newCoordmax[0],newCoordmax[1]];

				console.log(newcoords)
				return newcoords;
				
			}
			var transform = transformCoords();
			console.log(transform)

			console.log(WFSLayers[rowindex].wgs84boundingbox.minxy,WFSLayers[rowindex].wgs84boundingbox.maxxy)
		map.getView().fit(transform, map.getSize()); 
		ollayers[name].extent=transform

	
});
	var mousedown=false,mousemove=false;
	var pixel=0;
$("#gws_contents").jqxSortable({ 
       appendTo: document.getElementById("BottomLeftPanel")
 })
.mousedown(function () {
      mousedown = true;
      pixel=0;
})
.mousemove(function(){
		if(mousedown==true && pixel!=0){
			mousemove=true
		}
			pixel++
})
.on("mouseup",function(){

	if(mousemove==true){
      	
      	setTimeout(function(){
      		for(var q=document.getElementsByClassName("sortable-item").length-1; q>=0; q--){

      		var id = document.getElementsByClassName("sortable-item")[q].id;
      		console.log(id)
      		map.getLayers().insertAt(100-q, ollayers[id]);
     
	      			
	      	}
	      	console.log("i made the repositioning")
      	},500)
    
      }
      pixel = 0;
	mousedown = false;
	mousemove=false
      
})
document.getElementById("BottomLeftPanel").addEventListener('click', function() {
	$(".layer_selected").attr("class","layer");
}, true);
	$("#add_content").click(function(){

		if(service_requested=="wms"){
			console.log(service_requested)
		var rowindex,name;
		if ($("#Preview").attr("src") != undefined){
			rowindex = document.getElementById("gws_current_layer").alt;
			name = prompt("Layer name:",WMSLayers[rowindex].name);
		}if(name !==null){
			var remove_temp = $("[id^='temp_").attr("id");
		$("[id^='temp_").remove();
		map.removeLayer(ollayers[remove_temp])
		}
		if (name != ""){
			$("#gws_contents").prepend("<div class = 'sortable-item' id = '"+name+"'><input type = 'radio' checked = 'true' name = 'contents' alt = '" + $("#Preview").attr("src") + "' onchange = 'change(this)' class = 'maplayer_radio'/><input type = 'checkbox' id = '" + name + "' class = 'maplayer_check' checked = 'true' onchange = 'layerVisibility(this)'/><label id = '"+name+"'class = 'layer'>" + name + "</label></div>");
$('body').delegate('.layer', 'click', function() {
	$(this).attr("class","layer_selected");

});


var active = $('#tabswidgetBot').jqxTabs('selectedItem'); 
		if(active=="0"){
			$("#preview_li").trigger("click");
		}
		else{
			$("#map_li").trigger("click")
		}
			var coords = [Number(WMSLayers[rowindex].boundingbox[0].minx),Number(WMSLayers[rowindex].boundingbox[0].miny),Number(WMSLayers[rowindex].boundingbox[0].maxx),Number(WMSLayers[rowindex].boundingbox[0].maxy)];

			var crs = WMSLayers[rowindex].boundingbox[0].crs;

			function transformCoords(){
				var newCoordmin = ol.proj.transform([coords[0],coords[1]],crs,'EPSG:3857');
				var newCoordmax = ol.proj.transform([coords[2],coords[3]],crs,'EPSG:3857');
				var newcoords = [newCoordmin[0],newCoordmin[1],newCoordmax[0],newCoordmax[1]];

				console.log(newcoords)
				return newcoords;
				
			}
			var transform = transformCoords();
			
			var transformc=(function transformCheck(){
				for (var i = 0; i<4; i++){
					if (isNaN(transform[i])){
						
						$("#messages").append("<span style = 'color:blue'>" +getFullTime() + "</span> An error detected when zooming to layer " +name+ " extent.<br />");
						return;
					}
				}
			})();
			console.log(coords,transform)
		
			var lay = new ol.layer.Tile({
				source: new ol.source.TileWMS({
					url: WMSLayers[rowindex].server.link,
					params: {'LAYERS': WMSLayers[rowindex].name,'TILED': true},
					serverType: 'geoserver',
					wrapX:true
				})
			});
			ollayers[name] = lay;
			map.addLayer( ollayers[name] );

		map.getView().fit(transform, map.getSize())||transformc; 
			
		};
	}
	else if(service_requested=="wfs"){
		console.log(service_requested)
		// format used to parse WFS GetFeature responses
		var rowindex,name;
		if ($("#Preview").attr("src") != undefined){
			rowindex = $('#wfs_layers').jqxGrid('getselectedrowindex');
			name = prompt("Layer name:",WFSLayers[rowindex].name);
		}
		if(name !==null){
			var remove_temp = $("[id^='temp_").attr("id");
		$("[id^='temp_").remove();
		map.removeLayer(ollayers[remove_temp])
		}
		
			$("#gws_contents").prepend("<div class = 'sortable-item' id = '"+name+"'><input type = 'radio' checked = 'true' name = 'contents' alt = '" + $("#Preview").attr("src") + "' onchange = 'change(this)' class = 'maplayer_radio'/><input type = 'checkbox' id = '" + name + "' class = 'maplayer_check' checked = 'true' onchange = 'layerVisibility(this)'/><label id = '"+name+"'class = 'layer'>" + name + "</label></div>");
$('body').delegate('.layer', 'click', function() {
	$(this).attr("class","layer_selected");

});


var active = $('#tabswidgetBot').jqxTabs('selectedItem'); 
		if(active=="0"){
			$("#preview_li").trigger("click");
		}
		else{
			$("#map_li").trigger("click")
		}
	var geojsonFormat = new ol.format.GeoJSON();
	
	var layers = $('#wfs_layers').jqxGrid('getcellvalue', rowindex, "name");
	var vectorSource = new ol.source.Vector({
	  loader: function(extent, resolution, projection) {
	    var url = 'http://demo.boundlessgeo.com/geoserver/wfs?request=GetFeature&typenames='+ layers+'&outputFormat=text/javascript&format_options=callback:loadFeatures' +
	        '&srsname=EPSG:3857&bbox=' + extent.join(',');
	    // use jsonp: false to prevent jQuery from adding the "callback"
	    // parameter to the URL
	    $.ajax({url: url, dataType: 'jsonp', jsonp: false});
	  },
	  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
	    maxZoom: 19
	  }))
	});


	/**
	 * JSONP WFS callback function.
	 * @param {Object} response The response object.
	 */
	window.loadFeatures = function(response) {
	  vectorSource.addFeatures(geojsonFormat.readFeatures(response));
	};
		var vector = new ol.layer.Vector({
	  source: vectorSource,
	  style: new ol.style.Style({
	    stroke: new ol.style.Stroke({
	      color: 'rgba(0, 0, 255, 1.0)',
	      width: 2
	    })
	  })
	});
	ollayers[name] = vector;
			map.addLayer( ollayers[name] );

			var coords = []
			coords[0]=Number(WFSLayers[rowindex].wgs84boundingbox.minxy.substring(0,WFSLayers[rowindex].wgs84boundingbox.minxy.indexOf(" ")))
			coords[1]=Number(WFSLayers[rowindex].wgs84boundingbox.minxy.substring(WFSLayers[rowindex].wgs84boundingbox.minxy.indexOf(" ")+1,WFSLayers[rowindex].wgs84boundingbox.minxy.length))
			coords[2]=Number(WFSLayers[rowindex].wgs84boundingbox.maxxy.substring(0,WFSLayers[rowindex].wgs84boundingbox.minxy.indexOf(" ")))
			coords[3]=Number(WFSLayers[rowindex].wgs84boundingbox.maxxy.substring(WFSLayers[rowindex].wgs84boundingbox.minxy.indexOf(" ")+1,WFSLayers[rowindex].wgs84boundingbox.minxy.length))
			console.log(coords[0],coords[1])

			function transformCoords(){
				var newCoordmin = ol.proj.transform([coords[0],coords[1]],"EPSG:4326",'EPSG:3857');
				var newCoordmax = ol.proj.transform([coords[2],coords[3]],"EPSG:4326",'EPSG:3857');
				var newcoords = [newCoordmin[0],newCoordmin[1],newCoordmax[0],newCoordmax[1]];

				console.log(newcoords)
				return newcoords;
				
			}
			(function transformCheck(){
				for (var i = 0; i<4; i++){
					if (isNaN(transform[i])){
						
						$("#messages").append("<span style = 'color:blue'>" +getFullTime() + "</span> An error detected when zooming to layer " +name+ " extent.<br />");
						return;
					}
				}
			})();
			var transform = transformCoords();
			console.log(transform)

			console.log(WFSLayers[rowindex].wgs84boundingbox.minxy,WFSLayers[rowindex].wgs84boundingbox.maxxy)
		map.getView().fit(transform, map.getSize()); 
	}
	});
	$("#remove_content").click(function(){
		if($(".layer_selected").attr('id')!==undefined){
			var r = confirm("Do you want to remove the layer "+$(".layer_selected").attr('id')+"!");
		if(r==true){
			map.removeLayer(ollayers[$(".layer_selected").attr('id')])

			$("#"+$(".layer_selected").attr('id')+".sortable-item").remove();

		}
		}		
	});
	$("#left_splitter,#right_splitter").resize(function(){
		var rtime;
		var timeout = false;
		var delta = 10;
		map.updateSize();
		rtime = new Date();
		if (timeout === false) {
			timeout = true;
			setTimeout(resizeend, delta);
		};
		function resizeend(){
			if (new Date() - rtime < delta) {
				setTimeout(resizeend, delta);
			}
			else{
				timeout = false;
				
			}
		}
	});
	$("#preview_li").click(function(){
		$(".maplayer_check").css("display","none");
		$(".maplayer_radio").css("display","inline-block");
	});
	$("#map_li").click(function(){
		$(".maplayer_check").css("display","inline-block");
		$(".maplayer_radio").css("display","none");
	});
	$("#messages").bind("DOMNodeInserted DOMNodeRemoved", function(){
		this.scrollTop = this.scrollHeight;
	})
	$("#zoom_tomapextent").click(function(){
		var extent = [-20037508.34,-20037508.34,20037508.34,20037508.34]
		map.getView().fit(extent, map.getSize()); 
	});
	$("#zoom_tolayerextent").click(function(){
		var extent = ollayers[$(".layer_selected").attr('id')].extent;
		map.getView().fit(extent, map.getSize()); 
	});
	$("#get_info").click(function(){
		$("#get_info_form").show();
		
	})
	/*===================PROCESS===================*/
	$("#ConvertFileBtn").click(function(){
		$('#ConvertFile').show();
		(function(){
			$("#wps_slayer option").each(function() {
				$(this).remove();
			});
			$('.sortable-item').each(function(i){
				console.log('okok')
				$('#wps_slayer').innerHTML="";
				$('#wps_slayer').append('<option>'+this.id+'</option>')
			})
		})()
	});
	$("#ShowWPS").click(function(){
		document.querySelector('iframe').src = "/wps_proxy"
	})
	$('#gws_formconvertbtn').click(function(e){
		var obj = {
			"layer": document.getElementById("wps_slayer").value,
			"format": document.getElementById("wps_sformat").value
		}
		wpsrequest('wps',wfscallback,obj);
	})
});
function change(element){ 
	document.getElementById('Preview').src =element.alt;
};
function layerVisibility(element){
	if(element.checked){
		ollayers[element.id].setVisible(true);
	}
	else{
		ollayers[element.id].setVisible(false);
	};
};
