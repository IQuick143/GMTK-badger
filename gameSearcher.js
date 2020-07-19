var ready = false;

//The data of games
var gameData = undefined;

function loadData() {
	ready = false;
	loadGameJamData(2019, function(result) {
		gameData = result;
		ready = true;
	});
}

//TODO: an assistant system that allows searching by name
function getSearchSuggestions(querry) {
	throw "NOT IMPLEMENTED";
}

function doesGameExist(gameID) {
	return gameData.games[gameID] !== undefined;
}

function getRatings(gameID, criteriaID) {
	var data = gameData.games[gameID];
    var total = gameData.length;
    var percentile = (data.rank/total) * 100;
	var result = [{"scoreNorm": data.score / 5.0, "position":(data.rank+"/"+total), "score":""+(Math.round(data.score * 100) / 100), "percentile":"Top " +percentile.toFixed(2)+"%"}];
	for (var name of criteriaID) {
		for (var criteria of data.criteria) {
            percentile = (criteria.rank/total) * 100;
			if (criteria.name == name) result.push({"scoreNorm": criteria.score / 5.0, "position":(criteria.rank+"/"+total), "score":""+(Math.round(criteria.score * 100) / 100), "percentile":"Top " +percentile.toFixed(2)+"%"});
		}
	}
	return result;
}

function getImageURL(gameID) {
	return gameData.games[gameID].cover_url;
}

function getGameURL(gameID) {
	return gameData.games[gameID].url;
}

function getGameName(gameID) {
	return gameData.games[gameID].title;
}

var loadedYear = NaN;
var data = undefined;

function loadGameJamData(year, callback) {
	//Prevent someone being a dum dum and trying to load completely invalid data
	if (!/\d+/.exec(""+year)) {
		throw "Invalid GMTK Jam indentifier, provide year of the jam.";
	}
	if (year == loadedYear && data != undefined) callback(data);
	loadJSON('./results/'+year+'.json').then(function(raw) {
		var gameData = {};
		var names = [];
		var length = 0;
		for (var game of raw.results) {
			gameData[game.id] = game;
			names.push({"name": game.title, "id": game.id});
			length++;
		}
		data = {"games": gameData, "names":names, "length": length};
		loadedYear = year
		callback(data);
	});
}

loadData();
