//HARDCODED IT IN BECAUSE OF STUPID XSS PROTECTIONS
function loadGameJamData(callback) {
	var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
	xobj.open('GET', 'results/2019.json', true);
	xobj.onreadystatechange = function() {
		if (xobj.readyState == 4 && xobj.status == "200") {
			var raw = JSON.parse(xobj.responseText);
			var data = {};
			var names = [];
			var length = 0;
			for (var game of raw.results) {
				data[game.id] = game;
				names.push({"name": game.title, "id": game.id});
				length++;
			}
			return callback({"games": data, "names":names, "length": length});
		}
	};
	xobj.send(null);
}