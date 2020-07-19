//IDs used by this script
const canvasID = "badge";
const inputFieldID = "inputField";
const nameFieldID = "nameField";
const templateImageID = "template";
const gradientImageID = "gradient";
const iconImageID = "iconLoader";
const statCheckboxID = "includeStat";
const linkCheckboxID = "includeLink";
const nameCheckboxID = "includeName";
const LoadingNotice2 = "LoadingNotice2";

//Image layout
//*
var design = {};
/*/
var design = {
	height: 367,
	width: 455,

	iconX: 44,
	iconY: 8,
	iconW: 137,
	iconH: 108,

	gameNameX: 44 + 137 / 2,
	gameNameY: 8 + 108 + 16,

	numBars: 4,
	ratingBarStart: 141,
	ratingBarWidth: 174,
	ratingBarHeight: 40,
	ratingBars: [157, 207, 257, 307],

	dataX: 323,
	scoreYoff: 13,
	positionYoff: 25,
	percentileYoff: 35
};
//*/

var canvas;
var inputField;
var nameField;
var templateImg;
var gradientImg;
var iconImg;
var statCheckbox;
var linkCheckbox;
var nameCheckbox;
var loadMsg;

function loadBadger() {
	canvas = document.getElementById(canvasID).getContext("2d");
	statCheckbox= document.getElementById(statCheckboxID);
	linkCheckbox= document.getElementById(linkCheckboxID);
	nameCheckbox= document.getElementById(nameCheckboxID);
	templateImg = document.getElementById(templateImageID);
	gradientImg = document.getElementById(gradientImageID);
	inputField  = document.getElementById(inputFieldID);
	nameField   = document.getElementById(nameFieldID);
	iconImg     = document.getElementById(iconImageID);
	loadMsg     = document.getElementById(LoadingNotice2);

	loadYearlyData(2019);
}

function loadYearlyData(year) {
	loadMsg.classList.remove("hidden");
	promises = [];
	//Load design
	promises.push(loadJSON("assets/"+year+"/layout.json"));
	//Update assets
	promises.push(loadImage(gradientImg, "assets/"+year+"/gradient.png"));
	promises.push(loadImage(templateImg, "assets/"+year+"/template.png"));
	
	Promise.all(promises).then(function(responses) {
		design = responses[0];
		loadMsg.classList.add("hidden");
		clearCanvas();
	});
}

function clearCanvas() {
	canvas.fillStyle = "#000318";
	canvas.fillRect(0, 0, design.width, design.height);
}

function makeBadge(gameID) {
	clearCanvas();
	var ratings = getRatings(gameID, ["Design", "Originality", "Adherence to the Theme"]);
	for (var i = 0; i < design.ratingBars.length; i++) {
		canvas.drawImage(gradientImg, design.ratingBarStart, design.ratingBars[i], design.ratingBarWidth * ratings[i].scoreNorm, design.ratingBarHeight);
	}
	canvas.drawImage(templateImg, 0, 0);
	canvas.drawImage(iconImg, design.iconX, design.iconY, design.iconW, design.iconH);
	
	if (nameCheckbox.checked) {
		var originalAlign = canvas.textAlign;
		canvas.font = "17px Arial";
		canvas.fillStyle = "#000000";
		canvas.textAlign = "center";
		var gameName = getGameName(gameID);
		var textwidth = canvas.measureText(gameName).width;
		var xpos = Math.max(textwidth/2 + 5, design.gameNameX);
		canvas.fillText(gameName, xpos, design.gameNameY);
		canvas.textAlign = originalAlign;
	}

	if (linkCheckbox.checked) {
		canvas.font = "13px Arial";
		canvas.fillStyle = "#FFFFFF";
		canvas.fillText(getGameURL(gameID), 4, 363);
	}
	if (statCheckbox.checked) {
		canvas.fillStyle = "#FFFFFF";
		for (var i = 0; i < design.ratingBars.length; i++) {
			canvas.font = "22px Helvetica, sans";
			canvas.fillText(ratings[i].score, design.dataX, design.ratingBars[i] + design.scoreYoff);
			canvas.font = "14px Helvetica, sans";
			canvas.fillText(ratings[i].position, design.dataX, design.ratingBars[i] + design.positionYoff);
			canvas.font = "11px Helvetica, sans";
			canvas.fillText(ratings[i].percentile, design.dataX, design.ratingBars[i] + design.percentileYoff);
		}
	}
}

function LoadGame() {
	try {
		var gameID = /\d{6}/.exec(inputField.value)[0];
	} catch(e) {
		var gameID = undefined;
	}
	if (gameID != undefined) inputField.value = gameID;
	if (doesGameExist(gameID)) {
		nameField.value = getGameName(gameID);
		loadImage(iconImg, getImageURL(gameID)).then(()=>makeBadge(gameID));
	} else {
		nameField.value = "GAME NOT FOUND"
	}
	return false;
}
