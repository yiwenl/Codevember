// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

window.params = {
	focus:1.0,
	numIter:100,
	numBubble:7.0,
	metaK:7.0,
	zGap:2.0,
	maxDist:7.0
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		var l = new bongiovi.SimpleImageLoader();
		var a = [ "assets/b.png", "assets/light.jpg" ];

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
		// this.gui.add(params,'focus', .1, 5.0);
		// this.gui.add(params,'metaK', .1, 9.0);
		// this.gui.add(params,'zGap', 0.1, 10.0);
		// this.gui.add(params,'maxDist', 5.0, 30.0);
		// this.gui.add(params,'numBubble', 2, 20).step(1).listen().onFinishChange(this._onParamsChanged.bind(this));
		// this.gui.add(params,'numIter', 10, 200).step(1).listen().onFinishChange(this._onParamsChanged.bind(this));
	};

	p._onParamsChanged = function() {
		params.numIter = Math.floor(params.numIter);
		params.numBubble = Math.floor(params.numBubble);
		this._scene.reset();
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();