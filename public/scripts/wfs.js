var WFSLayers = [];
function WFS(){
	for (var c = 0; c < Server.length; c++){
		var count = 0;
		(function request(c){
			
			var url = Server[c].linkYQL + "service%3Dwfs%26" + Request["getCapabilities"];
			var xhttp = [];
			xhttp[c] = new XMLHttpRequest();
			xhttp[c].open("POST", url,true);
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
			var layers_xml = $(xmlDoc).find("FeatureTypeList FeatureType");
		}
		catch(err) { console.log(err) };
		for (var i = 0; i < layers_xml.length; i++){
			var row={};
			row["version"]=$(xmlDoc).find("WFS_Capabilities").attr("version");
			row["server"]={
				"name": server.name,
				"link": server.link
			};
			row["name"] = $(layers_xml[i]).find("Name").html() || "&lt;no data&gt;";
			row["title"] = $(layers_xml[i]).find("Title").html() || "&lt;no data&gt;";
			row["abstract"] = $(layers_xml[i]).find("Abstract").html() || "&lt;no data&gt;";
			row["keywords"] = (function(){
				var table = ["<no data>"];
				for (var q=0;q<$(layers_xml[i]).find("ows:Keywords ows:Keyword").length; q++){
					table[q] = $(layers_xml[i]).find("ows:Keywords ows:Keyword")[q].html()
				}

				return table;
			})();
			row["defaultcrs"] = $(layers_xml[i]).find("DefaultCRS").html() || "&lt;no data&gt;";
			row["othercrs"] = (function(){
				var table = ["<no data>"];
				for (var q=0;q<$(layers_xml[i]).find("OtherCRS").length; q++){
					table[q] = $(layers_xml[i]).find("OtherCRS")[q].html()
				}

				return table;
			})();
			
			row["nocrs"] = (function(){
				if($(layers_xml[i]).find("NoCRS").html()==""){
					return "true"
				}
				else{return "false"}
			})();
			row["outputformats"] = (function(){
				var table = ["application/gml+xml;version=3.2"];
				for (var q=0;q<$(layers_xml[i]).find("OutputFormats").length; q++){
					table[q] = $(layers_xml[i]).find("OutputFormats")[q].html()
				}

				return table;
			})();
			row["wgs84boundingbox"] ={
				"minxy": $(layers_xml[i]).find("LowerCorner").html() || "&lt;no data&gt;",
				"maxxy":$(layers_xml[i]).find("UpperCorner").html() || "&lt;no data&gt;"
			}
			row["metadataurl"] = $(layers_xml[i]).find("MetadataURL").html() || "&lt;no data&gt;";
			row["extendeddescription"] = $(layers_xml[i]).find("extendedDescription").html() || "&lt;no data&gt;";
			WFSLayers.push(row);
		};
	};
	function createTable(){
		var source = {
			datatype: "json",
			localdata: WFSLayers
		};
		var dataAdapter = new $.jqx.dataAdapter(source);
		// set rows details.
		$("#wfs_layers").on('bindingcomplete', function (event){
			$("#wfs_layers").jqxGrid('beginupdate');
			var datainformation = $("#wfs_layers").jqxGrid('getdatainformation');
			for (i = 0; i < datainformation.rowscount; i++) {
				$("#wfs_layers").jqxGrid('setrowdetails', i, "<div id='wfs_layers_sub' class='subgrid' style='background-color:#f0f0f0'></div>", 155, true);
			};
			$("#wfs_layers").jqxGrid('endupdate');
		});
		// create nested grid.
		var initlevel2 = function (index, parentElement){
			var details = $($(parentElement).children()[0]);
			details.css("overflow","auto");
			details.append(
				"<table style='border-style: ridge;border:1px solid #d2d2d2;width:100%;border-collapse: separate;border-spacing: 2px 2px;'>"+
				"<tr><th class = 'gws_details_name'>Default CRS:</th>"+
				"<td class = 'gws_details_value' id = 'wfs_defaultcrs"+index+"'></td>"+
				"<th class = 'gws_details_name'>Other CRS:</th>"+
				"<td class = 'gws_details_value' id = 'wfs_othercrs"+index+"'></td></tr>"+
				"<tr><th class = 'gws_details_name'>No CRS:</th>"+
				"<td class = 'gws_details_value' id = 'wfs_nocrs"+index+"'></td>"+
				"<th class = 'gws_details_name'>Output Formats:</th>"+
				"<td class = 'gws_details_value' id = 'wfs_outputformats"+index+"'></td></tr>"+
				"<tr><th class = 'gws_details_name' >Metadata URL:</th>"+
				"<td class = 'gws_details_value' id='wfs_metadataurl"+index+"'></td>"+
				"<th class = 'gws_details_name'>Extended Description:</th>"+
				"<td class = 'gws_details_value' id='wfs_extendeddescription"+index+"'></td>"+
				"</table>"
			);
			$("#servername"+index).append(
				"<a href=" + WFSLayers[index].server.link + ">" + WFSLayers[index].server.name + "</a>"
			)
			document.getElementById("wfs_defaultcrs"+index).innerHTML = WFSLayers[index].defaultcrs;

			var select = document.createElement("select");
			for (var q = 0; q < WFSLayers[index].othercrs.length; q++){
				var option = document.createElement("option");
				var t = document.createTextNode(WFSLayers[index].othercrs[q]);
				option.appendChild(t);
				select.appendChild(option);
			};
			document.getElementById("wfs_othercrs"+index).appendChild(select);

			document.getElementById("wfs_nocrs"+index).innerHTML = WFSLayers[index].nocrs;
			var select = document.createElement("select");
			for (var q = 0; q < WFSLayers[index].outputformats.length; q++){
				var option = document.createElement("option");
				var t = document.createTextNode(WFSLayers[index].outputformats[q]);
				option.appendChild(t);
				select.appendChild(option);
			};
			document.getElementById("wfs_outputformats"+index).appendChild(select);
			document.getElementById("wfs_metadataurl"+index).innerHTML = WFSLayers[index].metadataurl;
			
				if(WFSLayers[index].extendeddescription !== "&lt;no data&gt;"){
					document.getElementById("wfs_extendeddescription"+index).innerHTML = "<div style = 'cursor:pointer' onclick = 'extendeddescription()'>Show description</div>";
				}
				else{
					document.getElementById("wfs_extendeddescription"+index).innerHTML = WFSLayers[index].extendeddescription;
				}
				

			function extendeddescription(){
				$("#wfs_help_box").html(WFSLayers[index].extendeddescription)
			}

			var styles = {
				margin:"0px",
				height:"100%",
				width: "100%",
				border:"none"
			};
			
			
			details.find("select").css(styles);
		};
		$("#wfs_layers").jqxGrid({
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
	$('#wfs_layers').on('rowclick', function (event){
		var args = event.args;
		// row's bound index.
		var boundIndex = args.rowindex;
		$("#wfs_help_box").html("<label style='font-weight:bold'>Abstract:</label><br/>"+WFSLayers[boundIndex].abstract);
		// row's visible index.
		var visibleIndex = args.visibleindex;
		// right click.
		var rightclick = args.rightclick;
		var ev = args.originalEvent;
	});
	$(window).trigger('resize');
}