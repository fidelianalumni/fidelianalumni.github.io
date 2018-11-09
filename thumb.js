var page = require('webpage').create(),
	address, output, size;

//capture and captureSelector functions adapted from CasperJS - https://github.com/n1k0/casperjs
capture = function (targetFile, clipRect) {
	var previousClipRect;
	if (typeof (clipRect) === "undefined")
		var clipRect = {
			top: 0,
			left: 0,
			width: 40,
			height: 40
		};
	if (clipRect) {
		if (!typeof (clipRect) == "object") {
			throw new Error("clipRect must be an Object instance.");
		}
		previousClipRect = page.clipRect;
		page.clipRect = clipRect;
		console.log('Capturing page to ' + targetFile + ' with clipRect' + JSON.stringify(clipRect), "debug");
	} else {
		console.log('Capturing page to ' + targetFile, "debug");
	}
	try {
		page.render(targetFile);
	} catch (e) {
		console.log('Failed to capture screenshot as ' + targetFile + ': ' + e, "error");
	}
	if (previousClipRect) {
		page.clipRect = previousClipRect;
	}
	return this;
}

captureSelector = function (targetFile, selector) {

	return capture(targetFile, page.evaluate(function (selector) {
		try {
			var clipRect = document.querySelector(selector).getBoundingClientRect();
			console.log(clipRect);

			return {
				top: clipRect.top,
				left: clipRect.left,
				width: clipRect.width,
				height: clipRect.height
			};
		} catch (e) {
			console.log("Unable to fetch bounds for element " + selector, "warning");
		}
	}, selector));
}
address = "https://www.fidelianalumni.com/";
pixelRatio = 1.5;
width = (1920 * pixelRatio);
height = (1080 * pixelRatio);
page.viewportSize = {
	width: width,
	height: height
};
page.paperSize = {
	width: width,
	height: height,
	border: '0px'
}
page.open(address, function (status) {
	if (status !== 'success') {
		console.log('Unable to load the address!');
	} else {
		page.evaluate(function(r,width,height){
			console.log('Setting window.devicePixelRatio to ' + r);
			window.devicePixelRatio = r;
			window.onload = false;
			window.innerWidth = (width / r);
			window.innerHeight = (height / r);
			document.documentElement.offsetWidth = (document.documentElement.offsetWidth / r);
			document.documentElement.offsetHeight = (document.documentElement.offsetHeight / r);
			document.documentElement.clientWidth = (document.documentElement.clientWidth / r);
			document.documentElement.clientHeight = (document.documentElement.clientHeight / r);
			screen.width = width;
			screen.height = height;
			document.body.style.webkitTransform = "scale(" + r + ")";
			document.body.style.webkitTransformOrigin = "0% 0%";
			document.body.style.width = (100 / r) + "%";
		},pixelRatio,width,height);
		var len = page.evaluate(function (selectr) {
			try {
				return parseInt($(selectr).parent().children(":last").text());
			} catch (e) {
				console.log("Unable to fetch bounds for element " + selectr, " warning ");
			}
		}, '.paginate_button.current');
		console.log(len);
		for (var x = 0; x < len; x++) {
			captureSelector("table" + ("000" + x).substr(-3,3) + ".png", "#members table");
			page.evaluate(function (selectr) {
				try {
					return $(selectr).next().click();
				} catch (e) {
					console.log("Unable to fetch bounds for element " + selectr, " warning ");
				}
			}, '.paginate_button.current');
		}
		phantom.exit();
	}
});
