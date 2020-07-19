function loadImage(elementHandle, imagePath) {
	return new Promise(function(resolve, reject) {
		if (elementHandle.src == imagePath && elementHandle.complete) {
			resolve();
		} else {
			elementHandle.onload = resolve;
			elementHandle.onerror = reject;
			elementHandle.src = imagePath;
		}
	});
}

function loadJSON(path) {
	return new Promise(function(resolve, reject) {
		var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
		xobj.open('GET', path, true);
		xobj.onreadystatechange = function() {
			if (xobj.readyState == 4) {
				if (xobj.readyState == 4 && xobj.status == "200") {
					resolve(JSON.parse(xobj.responseText));
				} else {
					reject(xobj.statusText);
				}
			}
		};
		xobj.send(null);
	});
}
