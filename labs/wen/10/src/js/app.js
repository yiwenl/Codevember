// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");
window.params = {
	focus:1.5,
	numIter:100,
	numBubble:15.0,
	metaK:7.0,
	zGap:2.0,
	maxDist:7.0
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		var l = new bongiovi.SimpleImageLoader();
		var a = [ "assets/light.jpg" ];

		l.load(a, this, this._onLoaded);
	}

	var p = App.prototype;

	p._onLoaded = function(img) {
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