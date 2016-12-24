$(document).ready(function() {
	/*=============================================== JQUERY WIDGETS ===============================================*/
	$('#left_splitter').jqxSplitter({  width: '100%', height: '100%', orientation: 'vertical',theme:"office", panels: [{ size: '30%', collapsible: true }, { size: '70%'}] });
	$('#bottom_splitter').jqxSplitter({  width: '100%', height: '100%', orientation: 'horizontal',theme:"office", panels: [{ size: '70%', collapsible: false }, { size: '30%'}] });
	$('#right_splitter').jqxSplitter({ height: '100%',theme:"office", panels: [{ size: '15%' }, { size: '55%'}] });
	$("#tabswidgetTop").jqxTabs({  height: '100%', width: '100%' });
	$("#tabswidgetBot").jqxTabs({  height: '100%', width: '100%' });
	$('#docking').jqxDocking({ keyboardNavigation: true, orientation: 'horizontal', width: "100%", mode: 'default',theme: 'office' });
	$("#docking").jqxDocking('showAllCollapseButtons');
	$("#docking").jqxDocking('focus');
	$("#wms_filters_clear").jqxButton({ theme: "office" });
	$("#wms_filters_apply").jqxButton({ theme: "office" });
	$("#wms_layers_filters").jqxButton({ theme: "office" });
	$("#wms_layers_preview").jqxButton({ theme: "office" });
	$("#wfs_filters_clear").jqxButton({ theme: "office" });
	$("#wfs_filters_apply").jqxButton({ theme: "office" });
	$("#wfs_layers_filters").jqxButton({ theme: "office" });
	$("#wfs_layers_preview").jqxButton({ theme: "office" });
	$("#gws_add_server").jqxButton({ theme: "office" });
	$("#gws_formconvertbtn").jqxButton({ theme: "office" });
	$( "div[class='jqx-splitter-collapse-button-vertical jqx-splitter-collapse-button-vertical-office jqx-fill-state-pressed jqx-fill-state-pressed-office']:first-child" ).remove();

	$( "div[class='jqx-splitter-collapse-button-horizontal jqx-splitter-collapse-button-horizontal-office jqx-fill-state-pressed jqx-fill-state-pressed-office" ).remove();
	$('#get_info_form').jqxWindow({
                    showCollapseButton: true, maxHeight: 400, maxWidth: 700, minHeight: 200, minWidth: 200, height: 300, width: 500,
                    initContent: function () {
                        $('#get_info_form').jqxWindow('focus');
                    }
                });
});
