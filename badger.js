//IDs used by this script
const canvasID = "badge";
const inputFieldID = "inputField";
const nameFieldID = "nameField";
const templateImageID = "template";
const gradientImageID = "gradient";
const iconImageID = "iconLoader";

//Image layout
const height = 367;
const width = 455;

const iconX = 44;
const iconY = 8;
const iconW = 137;
const iconH = 108;

const numBars = 4;
const ratingBarStart = 141;
const ratingBarWidth = 174;
const ratingBarHeight = 40;
const ratingBars = [157, 207, 257, 307];

var canvas;
var inputField;
var nameField;
var templateImg;
var gradientImg;
var iconImg;

function loadBadger() {
	canvas = document.getElementById(canvasID).getContext("2d");
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
		canvas.drawImage(gradientImg, ratingBarStart, ratingBars[i], ratingBarWidth * ratings[i], ratingBarHeight);
	}
	canvas.drawImage(templateImg, 0, 0);
	canvas.drawImage(iconImg, iconX, iconY, iconW, iconH);

	canvas.font = "16px Arial";
	canvas.fillStyle = "#FFFFFF";
	canvas.fillText(getGameURL(gameID), 4, 363);
}

function LoadGame() {
	var gameID = ""+inputField.value;
	if (doesGameExist(gameID)) {
		nameField.value = getGameName(gameID);
		loadIcon(gameID);
	} else {
		nameField.value = "GAME NOT FOUND"
	}
}

function loadIcon(gameID) {
	iconImg.onload = ()=>loadIconCallback(gameID);
	iconImg.src = getImageURL(gameID);
}

function loadIconCallback(gameID) {
	makeBadge(gameID);
}
