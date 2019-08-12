var ready = false;

//The data of games
var gameData = undefined;

function loadData() {
	gameData = loadGameJamData();
	ready = true;
}

//TODO: an assistant system that allows searching by name
function getSearchSuggestions(querry) {
	throw "NOT IMPLEMENTED";
}

function doesGameExist(gameID) {
	return gameData.games[gameID] !== undefined;
}

function getRatings(gameID) {
	var data = gameData.games[gameID];
    var total = gameData.length;
    var percentile = (data.rank/total) * 100;
	var result = [{"scoreNorm": data.score / 5.0, "position":(data.rank+"/"+total), "score":""+(Math.round(data.score * 100) / 100), "percentile":"Top " +percentile.toFixed(2)+"%"}];
	var order = ["Design", "Originality", "Adherence to the Theme"];
	for (var name of order) {
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

loadData();
