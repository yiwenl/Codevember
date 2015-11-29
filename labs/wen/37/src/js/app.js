// app.js
window.bongiovi = require("./libs/bongiovi.js");
// window.bongiovi = require("../../../../dist/bongiovi.js");
// window.bongiovi = require("../../../../dist/bongiovi.js");
// var dat = require("dat-gui");
window.params = {
	focus:1.5,
	numIter:100,
	numBubble:5.0,
	metaK:7.0,
	zGap:2.0,
	maxDist:15.0
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var loader = new bongiovi.SimpleImageLoader();
		loader.load([
			"assets/grd.jpg",
			"assets/light.jpg",
			"assets/lightBlur.jpg"
			], this, this._onImageLoaded);
	}

	var p = App.prototype;

	p._onImageLoaded = function(img) {
		window.images = img;

		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	};

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		// this.gui = new dat.GUI({width:300});
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();