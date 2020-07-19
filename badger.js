//IDs used by this script
const canvasID = "badge";
const yearFieldID = "yearField";
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
var yearField;
var inputField;
var nameField;
var templateImg;
var gradientImg;
var iconImg;
var statCheckbox;
var linkCheckbox;
var nameCheckbox;
var loadMsg;

var yearOfJam = 2019;

function loadBadger() {
	canvas = document.getElementById(canvasID).getContext("2d");
	statCheckbox= document.getElementById(statCheckboxID);
	linkCheckbox= document.getElementById(linkCheckboxID);
	nameCheckbox= document.getElementById(nameCheckboxID);
	templateImg = document.getElementById(templateImageID);
	gradientImg = document.getElementById(gradientImageID);
	inputField  = document.getElementById(inputFieldID);
	nameField   = document.getElementById(nameFieldID);
	yearField   = document.getElementById(yearFieldID);
	iconImg     = document.getElementById(iconImageID);
	loadMsg     = document.getElementById(LoadingNotice2);
	
	updateYear();
}

function updateYear() {
	yearOfJam = yearField.value;
	loadMsg.classList.remove("hidden");
	loadYearlyData(yearOfJam).then(function() {
		loadMsg.classList.add("hidden");
		clearCanvas();
	});
	updateHTMLYear(yearOfJam);
}

function loadYearlyData(year) {
	promises = [];
	//Load design if needed
	if (design === undefined || design.year != year) promises.push(loadJSON("./assets/"+year+"/layout.json").then(function(response) {
		design = response;
		return response;
	}));
	//Update assets
	if (!gradientImg.src.includes(year)) promises.push(loadImage(gradientImg, "./assets/"+year+"/gradient.png"));
	if (!templateImg.src.includes(year)) promises.push(loadImage(templateImg, "./assets/"+year+"/template.png"));
	
	return Promise.all(promises);
}

//Update the visuals on the HTML
function updateHTMLYear(year) {
	document.body.style.backgroundImage = "url('./assets/"+year+"/back.png')";
}

//Prepares the canvas to be used
function clearCanvas() {
	canvas.canvas.width  = design.width;
	canvas.canvas.height = design.height;
	canvas.fillStyle = design.backgroundColour || "#000000";
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
		Promise.all([
			loadYearlyData(yearOfJam),
			loadImage(iconImg, getImageURL(gameID))
		]).then(()=>makeBadge(gameID)).catch((reason)=>alert("An error occured during processing your badge:\n"+reason+"\nPlease try again."));
	} else {
		nameField.value = "GAME NOT FOUND"
	}
	return false;
}
