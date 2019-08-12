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
	var result = [data.score / 5.0];
	var order = ["Design", "Originality", "Adherence to the Theme"];
	for (var name of order) {
		for (var criteria of data.criteria) {
			if (criteria.name == name) result.push(criteria.score / 5.0);
		}
	}
	return result;
}

function getImageURL(gameID) {
	return gameData.games[gameID].cover_url;
}

function getGameName(gameID) {
	return gameData.games[gameID].title;
}

loadData();
