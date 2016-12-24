function wpsrequest(module,next,data){
	data = data || null;
	var url = "wps"; // the script where you handle the form input.

	$.ajax({
		type: "POST",
		dataType:'json',
		data:data,
		url: url,
		success: function (data) {
			next(data)
		},
		error:function (data) {
			next(data)
		}

	});
	e.preventDefault();
}
var wfscallback = function(data){
	console.log(data)
	document.getElementById("messages").innerHTML += "<a href='convertResponse'>download</a>"
}