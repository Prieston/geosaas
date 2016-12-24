var WMSLayers = [];
function WMS(){
	for (var c = 0; c < Server.length; c++){
		var count = 0;
		(function request(c){
			
			var url = Server[c].linkYQL + 'service%3Dwms%26'+Request["getCapabilities"];
			var xhttp = [];
			xhttp[c] = new XMLHttpRequest();
			xhttp[c].open("GET", url, true);
			if(count<1){$("#messages").append("<span style = 'color:blue'>" +getFullTime() + '</span> Request data from: <a style = "color:grey;text-decoration: none;" href = "'+url+'" target="_blank">'+Server[c].link + Request["getCapabilities"]+"</a><br />")}

			xhttp[c].onreadystatechange = function(){
				if (xhttp[c].readyState == 4 && xhttp[c].status == 200) {
					$("#messages").append("<span style = 'color:blue'>" +getFullTime() + '</span> Response HTTP status <b>' + xhttp[c].status + " ["+xhttp[c].statusText +'] </b> from: <a style = "color:grey;text-decoration: none;" href = "'+url+'" target="_blank">'+Server[c].link + Request["getCapabilities"]+"</a><br />");
					myFunction( xhttp[c],Server[c] );
					if (c = Server.length-1){
						createTable();
					};
				};
			};
			xhttp[c].onerror = function(){ 
				count++
				if(count>1){c++;request(c); return};
				
				if(count<=1){$("#messages").append("<span style = 'color:blue'>" +getFullTime() + '</span> Response HTTP status <b>' + xhttp[c].status + " ["+xhttp[c].statusText +'] </b> from: <a style = "color:grey;text-decoration: none;" href = "'+url+'" target="_blank">'+Server[c].link + Request["getCapabilities"]+"</a> A new response message will appear if connection will establish. Retrying connection...<br />");
				request(c); }
			}
			xhttp[c].send(null);
		})(c);
	};
	function myFunction(xml,server){
		try {
			var xmlDoc = xml.responseXML;
			var layers_xml = $(xmlDoc).find("Capability Layer Layer");
		}
		catch(err) { console.log(err) };
		for (var i = 0; i < layers_xml.length; i++){
			var row={};
			row["version"]=$(xmlDoc).find("WMS_Capabilities").attr("version");
			row["server"]={
				"name": server.name,
				"link": server.link
			};
			row["name"] = $(layers_xml[i]).find("Name").html() || "&lt;no data&gt;";
			row["title"] = $(layers_xml[i]).find("Title").html() || "&lt;no data&gt;";
			row["abstract"] = $(layers_xml[i]).find("Abstract").html() || "&lt;no data&gt;";
			row["keywordlist"] = [];
			row["keywordlist"][0] = "&lt;no data&gt;";
			for (var j = 0 ; j < $(layers_xml[i]).find("KeywordList Keyword").length; j++){
				row["keywordlist"][j] = $(layers_xml[i]).find("KeywordList Keyword")[j].innerHTML||"&lt;no data&gt;";
			};
			row["style"] = [];
			for (var j = 0; j < $(layers_xml[i]).find("Style").length; j++){
				row["style"][j] = {
					"name": $(layers_xml[i]).find("Style Name").html() || "<no data>",
					"title": $(layers_xml[i]).find("Style Title").html() || "&lt;no data&gt;",
					"abstract": $(layers_xml[i]).find("Style Abstract").html() || "&lt;no data&gt;",
					"legendurlwidth": $(layers_xml[i]).find("Style LegendURL").attr("width") || "&lt;no data&gt;",
					"legendurlheight": $(layers_xml[i]).find("Style LegendURL").attr("height") || "&lt;no data&gt;",
					"legendurlformat": $(layers_xml[i]).find("Style LegendURL Format").html() || "&lt;no data&gt;",
					"legendurlonlineresource": $(layers_xml[i]).find("Style LegendURL OnlineResource").attr("xlink:href") || "&lt;no data&gt;",
					"stylesheeturlformat": $(layers_xml[i]).find("Style StyleSheetURL Format").html() || "&lt;no data&gt;",
					"stylesheeturlonlineresource": $(layers_xml[i]).find("Style StyleSheetURL OnlineResource").attr("xlink:href") || "&lt;no data&gt;"
				};
			};
			row["crs"] = [];
			row["crs"][0] = "&lt;no data&gt;";
			for (var j = 0; j < $(layers_xml[i]).find("CRS").length; j++){
				row["crs"][j] = $(layers_xml[i]).find("CRS")[j].innerHTML;
			};
			row["ex_geographicboundingbox"] = {
				"west": $(layers_xml[i]).find("EX_GeographicBoundingBox westBoundLongitude").html(),
				"east": $(layers_xml[i]).find("EX_GeographicBoundingBox eastBoundLongitude").html(),
				"south": $(layers_xml[i]).find("EX_GeographicBoundingBox southBoundLongitude").html(),
				"north": $(layers_xml[i]).find("EX_GeographicBoundingBox northBoundLongitude").html()
			};
			var j =0;
			row["boundingbox"] = [];
			do {
				row["boundingbox"][j] = {
					"crs": $(layers_xml[i]).find("BoundingBox")[j].getAttribute("CRS") || "<no data>",
					"minx": Number($(layers_xml[i]).find("BoundingBox")[j].getAttribute("minx")) || "<no data>",
					"miny": Number($(layers_xml[i]).find("BoundingBox")[j].getAttribute("miny")) || "<no data>",
					"maxx": Number($(layers_xml[i]).find("BoundingBox")[j].getAttribute("maxx")) || "<no data>",
					"maxy": Number($(layers_xml[i]).find("BoundingBox")[j].getAttribute("maxy")) || "<no data>"
				};
				j++;
			} while( j < $(layers_xml[i]).find("BoundingBox").length );
			row["attribution"] = {
				"title": $(layers_xml[i]).find("Attribution Title").html() || "&lt;no data&gt;",
				"onlineresource": $(layers_xml[i]).find("Attribution OnlineResource").attr("xlink:href") || "&lt;no data&gt;",
				"logourlwidth": $(layers_xml[i]).find("Attribution LogoURL").attr("width") || "&lt;no data&gt;",
				"logourlheight": $(layers_xml[i]).find("Attribution LogoURL").attr("height") || "&lt;no data&gt;",
				"logourlformat": $(layers_xml[i]).find("Attribution LogoURL Format").html() || "&lt;no data&gt;",
				"logourlonlineresource": $(layers_xml[i]).find("Attribution LogoURL OnlineResource").attr("xlink:href") || "&lt;no data&gt;"
			};
			row["minscaledenominator"] = $(layers_xml[i]).find("MinScaleDenominator").html() || "&lt;no data&gt;";
			row["maxscaledenominator"] = $(layers_xml[i]).find("MaxScaleDenominator").html() || "&lt;no data&gt;";
			row["Identifier"] = {
				"authority": $(layers_xml[i]).find("Identifier").attr("authority") || "&lt;no data&gt;",
				"inner": $(layers_xml[i]).find("Identifier").html() || "&lt;no data&gt;"
			};
			row["featurelisturl"] = {
				"format": $(layers_xml[i]).find("FeatureListURL Format").html() || "&lt;no data&gt;",
				"onlineresource": $(layers_xml[i]).find("FeatureListURL OnlineResource").attr("xlink:href") || "&lt;no data&gt;"
			};
			row["metadataurl"] = [];
			row["metadataurl"][0] = "&lt;no data&gt;";
			for (var j = 0; j < $(layers_xml[i]).find("MetadataURL").length; j++){
				row["metadataurl"][j] = {
					"type": $(layers_xml[i]).find("MetadataURL").attr("type") || "&lt;no data&gt;",
					"format": $(layers_xml[i]).find("MetadataURL Format").html() || "&lt;no data&gt;",
					"onlineresource": $(layers_xml[i]).find("MetadataURL OnlineResource").attr("xlink:href") || "&lt;no data&gt;"
				};
			};
			row["dimension"] = [];
			var j = 0;
			do {
				row["dimension"][j] = {
					"name": $(layers_xml[i]).find("Dimension").attr("name") || "<no data>",
					"units": $(layers_xml[i]).find("Dimension").attr("units") || "&lt;no data&gt;",
					"unitsymbol": $(layers_xml[i]).find("Dimension").attr("unitSymbol") || "&lt;no data&gt;",
					"default": $(layers_xml[i]).find("Dimension").attr("default")||"&lt;no data&gt;",
					"multiplevalues": $(layers_xml[i]).find("Dimension").attr("multipleValues") || "&lt;no data&gt;",
					"nearestvalue": $(layers_xml[i]).find("Dimension").attr("nearestValue") || "&lt;no data&gt;",
					"current": $(layers_xml[i]).find("Dimension").attr("current") || "&lt;no data&gt;",
					"extent": $(layers_xml[i]).find("Dimension").html() || "&lt;no data&gt;"
				};
				j++;
			} while( j < $(layers_xml[i]).find("Dimension").length );
			row["authorityurl"] ={
				"name": $(xmlDoc).find("Capability Layer Authority").attr("name") || "&lt;no data&gt;",
				"onlineresource": $(xmlDoc).find("Capability Layer Authority OnlineResource").attr("xlink:href") || "&lt;no data&gt;"
			};
			row["dataurl"] = {
				"format": $(layers_xml[i]).find("DataURL Format").html() || "&lt;no data&gt;",
				"onlineresource": $(layers_xml[i]).find("DataURL OnlineResource").attr("xlink:href") || "&lt;no data&gt;"
			};
			row["layerattributes"] = {
				"queryable": $(layers_xml[i]).attr("queryable") || "&lt;no data&gt;",
				"cascaded": $(layers_xml[i]).attr("cascaded") || "&lt;no data&gt;",
				"opaque": $(layers_xml[i]).attr("opaque") || "&lt;no data&gt;",
				"nosubsets": $(layers_xml[i]).attr("noSubsets") || "&lt;no data&gt;",
				"fixedwidth": $(layers_xml[i]).attr("fixedWidth") || "&lt;no data&gt;",
				"fixedheight": $(layers_xml[i]).attr("fixedHeight") || "&lt;no data&gt;"
			};
			row["exception"] = [];
			row["exception"][0] ="XML";
			var exception = $(xmlDoc).find("Capability Exception Format");
			for (var j = 0; j < exception.length; j++){
				row["exception"][j] = {
					"format": exception[j].innerHTML || "&lt;no data&gt;"
				};
			};
			row["getmap"] = [];
			var format = $(xmlDoc).find("Capability GetMap Format");
			for (var j = 0; j < format.length; j++){
				row["getmap"][j] = {
					"format": format[j].innerHTML || "&lt;no data&gt;"
				};
			};
			WMSLayers.push(row);
		};
	};
	function createTable(){
		var source = {
			datatype: "json",
			localdata: WMSLayers
		};
		var dataAdapter = new $.jqx.dataAdapter(source);
		// set rows details.
		$("#wms_layers").on('bindingcomplete', function (event){
			$("#wms_layers").jqxGrid('beginupdate');
			var datainformation = $("#wms_layers").jqxGrid('getdatainformation');
			for (i = 0; i < datainformation.rowscount; i++) {
				$("#wms_layers").jqxGrid('setrowdetails', i, "<div id='wms_layers_sub' class='subgrid' style='background-color:#f0f0f0'></div>", 155, true);
			};
			$("#wms_layers").jqxGrid('endupdate');
		});
		// create nested grid.
		var initlevel2 = function (index, parentElement){
			var details = $($(parentElement).children()[0]);
			details.css("overflow","auto");
			details.append(
				"<table style='border-style: ridge;border:1px solid #d2d2d2;width:100%;border-collapse: separate;border-spacing: 2px 2px;'>"+
				"<tr><th class = 'gws_details_name'>Style Name:</th>"+
				"<td class = 'gws_details_value' id = 'wms_style"+index+"'></td>"+
				"<th class = 'gws_details_name'>CRS:</th>"+
				"<td class = 'gws_details_value' id = 'wms_crs"+index+"'></td></tr>"+
				"<tr><th class = 'gws_details_name'>Transparent:</th>"+
				"<td class = 'gws_details_value' id = 'wms_transparent"+index+"'></td>"+
				"<th class = 'gws_details_name'>Exceptions:</th>"+
				"<td class = 'gws_details_value' id = 'wms_exception"+index+"'></td></tr>"+
				"<tr><th class = 'gws_details_name' >Background color:</th>"+
				"<td class = 'gws_details_value' id='dropDownButton"+index+"'><div id='colorPicker"+index+"'></div></td>"+
				"<th class = 'gws_details_name'>Format:</th>"+
				"<td class = 'gws_details_value' id='wms_format"+index+"'></td>"+
				"<tr><th class = 'gws_details_name' >Width/Height:</th>"+
				"<td class = 'gws_details_value' style='text-align:center' id = 'wms_widthheight'><input id =  'wms_width_value"+index+"' style='float:left;'></input>:<input style='float:right;' id='wms_height_value"+index+"'></input></td>"+
				"<th class = 'gws_details_name'  rowspan='2'>Dimensions:</th>"+
				"<td class = 'gws_details_value' id = 'wms_dimensions"+index+"'></td></tr>"+
				"<tr><th class = 'gws_details_name'>Server:</th>"+
				"<td class = 'gws_details_value' style='text-align:center' id = 'servername"+index+"'></td>"+
				"<td class = 'gws_details_value'><input id ='wms_otherdimension"+index+"'></input></td></tr>"+
				"</table>"
			);
			$("#servername"+index).append(
				"<a href=" + WMSLayers[index].server.link + ">" + WMSLayers[index].server.name + "</a>"
			)
			var select = document.createElement("select");
			select.setAttribute("id", "wms_crs_value"+index);
			for (var q = 0; q < WMSLayers[index].crs.length; q++){
				var option = document.createElement("option");
				var t = document.createTextNode(WMSLayers[index].crs[q]);
				option.appendChild(t);
				select.appendChild(option);
			};
			document.getElementById("wms_crs"+index).appendChild(select);
			var select = document.createElement("select");
			select.setAttribute("id", "wms_style_value"+index);
			var option = document.createElement("option");
			var t = document.createTextNode("<not set>");
			option.appendChild(t);
			select.appendChild(option);
			for (var q = 0; q < WMSLayers[index].style.length; q++){
				var option = document.createElement("option");
				var t = document.createTextNode(WMSLayers[index].style[q].name);
				option.appendChild(t);
				select.appendChild(option);
			};
			document.getElementById("wms_style"+index).appendChild(select);
			var select = document.createElement("select");
			for (var q = 0; q < WMSLayers[index].exception.length; q++){
				var option = document.createElement("option");
				var t = document.createTextNode(WMSLayers[index].exception[q].format);
				option.appendChild(t);
				select.appendChild(option);
			};
			document.getElementById("wms_exception"+index).appendChild(select);
			var select = document.createElement("select");
			for (var q = 0; q < WMSLayers[index].getmap.length; q++){
				var option = document.createElement("option");
				var t = document.createTextNode(WMSLayers[index].getmap[q].format);
				option.appendChild(t);
				select.appendChild(option);
			};
			document.getElementById("wms_format"+index).appendChild(select);
			var q = 0;
			if (WMSLayers[index].dimension[q].name = "<no data>"){
				$("#wms_elevation"+index).prop( "disabled", true );
				$("#wms_time"+index).prop( "disabled", true );
				$("#wms_otherdimension"+index).prop( "disabled", true );
				$("#wms_elevation"+index).val("<no data>");
				$("#wms_time"+index).val("<no data>");
				$("#wms_otherdimension"+index).val("<no data>");
			};
			var select = document.createElement("select");
			//width and height
			var e = document.getElementById("wms_crs_value"+index);
			var strUser = e.options[e.selectedIndex].value;
			do {
				if (WMSLayers[index].boundingbox[q].crs == strUser){
					var width = Math.sqrt(Math.pow(WMSLayers[index].boundingbox[q].maxx - WMSLayers[index].boundingbox[q].minx,2));
					var height = Math.sqrt(Math.pow(WMSLayers[index].boundingbox[q].maxy - WMSLayers[index].boundingbox[q].miny,2));
					ratio = width/height;
					$("#wms_width_value"+index).val(500);
					$("#wms_height_value"+index).val(Math.round(500*ratio));
					//change width and height
					$("#wms_width_value"+index).on("change",function(){
						var round = Math.round($("#wms_width_value"+index).val());
						$("#wms_width_value"+index).val(round);
						$("#wms_height_value"+index).val(Math.round($("#wms_width_value"+index).val()*ratio));
					});
					$("#wms_height_value"+index).on("change",function(){
						var round = Math.round($("#wms_height_value"+index).val());
						$("#wms_height_value"+index).val(round);
						$("#wms_width_value"+index).val(Math.round($("#wms_height_value"+index).val()/ratio));
					});
					$("#wms_widthheight"+index).on("click",function(){
						$("#wms_help_box"+index).html("<label style='font-weight:bold'>Selected layer Width and Height:</label><br/>The selected layer image ratio is WIDTH/HEIGHT: "+ratio.toFixed(2) +". This information produced from the bounding box data. The width and height are rounded for the pixels to be integer numbers")
					});
					break;
				};
				q++;
			} while(q < WMSLayers[index].boundingbox.length);
			//dimensions
			var q=0;
			do {
				var option = document.createElement("option");
				var t = document.createTextNode(WMSLayers[index].dimension[q].name);
				if ("elevation".toUpperCase() !== WMSLayers[index].dimension[q].name.toUpperCase() && "time".toUpperCase() !== WMSLayers[index].dimension[q].name.toUpperCase()){
					option.appendChild(t);
					select.appendChild(option);
					q++;
				};
			} while(q < WMSLayers[index].dimension.length);
			document.getElementById("wms_dimensions"+index).appendChild(select);
			var select = document.createElement("select");
			var option_true = document.createElement("option");
			var t = document.createTextNode("true");
			option_true.appendChild(t);
			select.appendChild(option_true);
			var option_false = document.createElement("option");
			var t = document.createTextNode("false");
			option_false.appendChild(t);
			select.appendChild(option_false);
			document.getElementById("wms_transparent"+index).appendChild(select);
			(function(){
				$("#colorPicker"+index).on('colorchange', function (event){
					$("#dropDownButton"+index).jqxDropDownButton('setContent', getTextElementByColor(event.args.color));
				});
				$("#colorPicker"+index).jqxColorPicker({ color: "ffaabb", colorMode: 'hue', width: 220, height: 220});
				$("#dropDownButton"+index).jqxDropDownButton();
				$("#dropDownButton"+index).jqxDropDownButton('setContent', getTextElementByColor(new $.jqx.color({ hex: "ffffff" })));
			})();
			function getTextElementByColor (color){
				if (color == 'transparent' || color.hex == "") {
					return $("<div style='text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;'>transparent</div>");
				};
				var element = $("<div id = 'wms_bgcolor" + index + "'style='text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;'>0x" + color.hex + "</div>");
				var nThreshold = 105;
				var bgDelta = (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114);
				var foreColor = (255 - bgDelta < nThreshold) ? 'Black' : 'White';
				element.css('color', foreColor);
				element.css('background', "#" + color.hex);
				element.addClass('jqx-rc-all');
				return element;
			};
			$('.gws_details_name').on('click',function(){
				var name = this.innerHTML;
				if(name=="Style Name:") $('#wms_help_box').html("<label style='font-weight:bold'>Style Name:</label><br/>The STYLES parameter lists the style in which each layer is to be rendered.");
				else if(name=="CRS:") $('#wms_help_box').html("<label style='font-weight:bold'>CRS:</label><br/>The Coordinate Reference System parameter states what Layer CRS applies to the BBOX  parameter.");
				else if(name=="Width/Height:") $('#wms_help_box').html("<label style='font-weight:bold'>Width/Height:</label><br/>The WIDTH and HEIGHT parameter specify the size in integer pixels of the map to be produced.");
				else if(name=="Exceptions:") $('#wms_help_box').html("<label style='font-weight:bold'>Exceptions:</label><br/>The EXCEPTIONS parameter states the format in which to report errors.");
				else if(name=="Format:") $('#wms_help_box').html("<label style='font-weight:bold'>Format:</label><br/>The FORMAT parameter specifies the output format of the response to an operation.");
				else if(name=="Transparent:") $('#wms_help_box').html("<label style='font-weight:bold'>Transparent:</label><br/>The TRANSPARENT parameter specifies whether the map background is to be made transparent or not. ");
				else if(name=="Background color:") $('#wms_help_box').html("<label style='font-weight:bold'>Background color:</label><br/>The BACKGROUND COLOR parameter is a string that specifies the colour to be used as the background (non-data) pixels of the map.");
				else if(name=="Dimensions:") $('#wms_help_box').html("<label style='font-weight:bold'>Dimensions: </label><br/>The TIME dimension is defined if a data object has one (for example, an hourly weather map).The ELEVATION dimension is defined if a data object has one (for example, elevation in meters in the North American Vertical Datum 1988).Sample dimension parameters allow the client to request a particular layer along one or more dimensional axes other than time or elevation.");
			});
			$("#wms_style_value"+index).on('click',function(){
				var strUser = this.options[this.selectedIndex].value;
				for(var q = 0; q < WMSLayers[index].style.length; q++){
					if(WMSLayers[index].style[q].name==strUser) break;
				};
				$("#wms_help_box").html("<label style='font-weight:bold'>Selected Style:</label><br/><label style='font-weight:bold'> Title:</label>" + WMSLayers[index].style[q].title + "<br><label style='font-weight:bold'> Abstract:</label>" + WMSLayers[index].style[q].abstract + "<br><label style='font-weight:bold'> Legend URL width/height:</label>" + WMSLayers[index].style[q].legendurlwidth + "/" + WMSLayers[index].style[q].legendurlheight + "<br><label style='font-weight:bold'> Legend URL format:</label>" + WMSLayers[index].style[q].legendurlformat + "<br><label style='font-weight:bold'> Legend URL online resource:</label>" + WMSLayers[index].style[q].legendurlonlineresource + "<br><label style='font-weight:bold'> StyleSheet format:</label>" + WMSLayers[index].style[q].stylesheeturlformat + "<br><label style='font-weight:bold'> StyleSheet online resource:</label>"+WMSLayers[index].style[q].stylesheeturlonlineresource);
			});
			$("#wms_crs_value"+index).on('click',function(){
				var strUser = this.options[this.selectedIndex].value;
				var q = 0;
				do {
					if (WMSLayers[index].boundingbox[q].crs == strUser){
						$("#wms_help_box").html("<label style='font-weight:bold'>Selected CRS :</label><br/><label style='font-weight:bold'> minx:</label>" + WMSLayers[index].boundingbox[q].minx + "<br><label style='font-weight:bold'> miny:</label>" + WMSLayers[index].boundingbox[q].miny + "<br><label style='font-weight:bold'> maxx:</label>" + WMSLayers[index].boundingbox[q].maxx + "<br><label style='font-weight:bold'> maxy:</label>" + WMSLayers[index].boundingbox[q].maxy);
						break;
					};
					q++;
				} while(q < WMSLayers[index].boundingbox.length);
			});
			var styles = {
				margin:"0px",
				height:"100%",
				width: "100%",
				border:"none"
			};
			var styleswh = {
				margin:"0px",
				height:"100%",
				width: "40%",
				border:"none",
				textAlign:"center",
				outline:"1px solid #d2d2d2"
			};
			details.find("input").css(styles);
			details.find("select").css(styles);
			details.find("div").css(styles);
			$("#wms_width_value"+index).css(styleswh);
			$("#wms_height_value"+index).css(styleswh);
		};
		$("#wms_layers").jqxGrid({
			width: "100%",
			height:"100%",
			pageable:true,
			theme:"office",
			source: dataAdapter,
			altrows: true,
			altstart: 0,
			rowdetails:true,
			rowdetailstemplate: {
				rowdetails: "<div></div>"
			},
			initrowdetails: initlevel2,
			columns: [
				{ text: 'Name', datafield: 'name', width: "50%"},
				{ text: 'Title', datafield: 'title', width: "50%"}
			]
		});
	};
	//row click events
	$('#wms_layers').on('rowclick', function (event){
		var args = event.args;
		// row's bound index.
		var boundIndex = args.rowindex;
		$("#wms_help_box").html("<label style='font-weight:bold'>Abstract:</label><br/>"+WMSLayers[boundIndex].abstract);
		// row's visible index.
		var visibleIndex = args.visibleindex;
		// right click.
		var rightclick = args.rightclick;
		var ev = args.originalEvent;
	});
	$(window).trigger('resize');
}