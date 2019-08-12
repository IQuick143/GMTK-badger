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

//Image layout
const height = 367;
const width = 455;

const iconX = 44;
const iconY = 8;
const iconW = 137;
const iconH = 108;

const gameNameX = iconX + iconW / 2;
const gameNameY = iconY + iconH + 16;

const numBars = 4;
const ratingBarStart = 141;
const ratingBarWidth = 174;
const ratingBarHeight = 40;
const ratingBars = [157, 207, 257, 307];

const dataX = 323;
const scoreYoff = 13;
const positionYoff = 25;
const percentileYoff = 35;

var canvas;
var inputField;
var nameField;
var templateImg;
var gradientImg;
var iconImg;
var statCheckbox;
var linkCheckbox;
var nameCheckbox;

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

	clearCanvas();
}

function clearCanvas() {
	canvas.fillStyle = "#000318";
	canvas.fillRect(0, 0, width, height);
}

function makeBadge(gameID) {
	var ratings = getRatings(gameID);
	for (var i = 0; i < numBars; i++) {
		canvas.drawImage(gradientImg, ratingBarStart, ratingBars[i], ratingBarWidth * ratings[i].scoreNorm, ratingBarHeight);
	}
	canvas.drawImage(templateImg, 0, 0);
	canvas.drawImage(iconImg, iconX, iconY, iconW, iconH);
	
	if (nameCheckbox.checked) {
		var originalAlign = canvas.textAlign;
		canvas.font = "17px Arial";
		canvas.fillStyle = "#000000";
		canvas.textAlign = "center";
		canvas.fillText(getGameName(gameID), gameNameX, gameNameY);
		canvas.textAlign = originalAlign;
	}

	if (linkCheckbox.checked) {
		canvas.font = "13px Arial";
		canvas.fillStyle = "#FFFFFF";
		canvas.fillText(getGameURL(gameID), 4, 363);
	}
	if (statCheckbox.checked) {
		canvas.fillStyle = "#FFFFFF";
		for (var i = 0; i < numBars; i++) {
			canvas.font = "22px Helvetica, sans";
			canvas.fillText(ratings[i].score, dataX, ratingBars[i] + scoreYoff);
			canvas.font = "14px Helvetica, sans";
			canvas.fillText(ratings[i].position, dataX, ratingBars[i] + positionYoff);
			canvas.font = "11px Helvetica, sans";
			canvas.fillText(ratings[i].percentile, dataX, ratingBars[i] + percentileYoff);
		}
	}
}

function LoadGame() {
	var gameID = /\d{6}/.exec(inputField.value)[0];
	if (gameID != undefined) inputField.value = gameID;
	if (doesGameExist(gameID)) {
		nameField.value = getGameName(gameID);
		loadIcon(gameID);
	} else {
		nameField.value = "GAME NOT FOUND"
	}
}

function loadIcon(gameID) {
	clearCanvas();
	iconImg.onload = ()=>loadIconCallback(gameID);
	iconImg.src = getImageURL(gameID);
}

function loadIconCallback(gameID) {
	makeBadge(gameID);
}
