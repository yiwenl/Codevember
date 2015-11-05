// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

window.params = {
	sphereSize:100,
	numParticles:200,
	bounceForce:15.0
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var loader = new bongiovi.SimpleImageLoader();
		var assets = ["assets/gradient.jpg"];
		loader.load(assets, this, this._onImageLoaded);
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
		// this.gui.add(params, 'bounceForce', 5.0, 50.0);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();