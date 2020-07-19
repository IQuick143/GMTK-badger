function loadGameJamData(year, callback) {
	//Prevent someone being a dum dum and trying to load completely invalid data
	if (!/\d+/.exec(""+year)) {
		throw "Invalid GMTK Jam indentifier, provide year of the jam.";
	}
	loadJSON('results/'+year+'.json').then(function(raw) {
		var data = {};
		var names = [];
		var length = 0;
		for (var game of raw.results) {
			data[game.id] = game;
			names.push({"name": game.title, "id": game.id});
			length++;
		}
		callback({"games": data, "names":names, "length": length});
	});
}
