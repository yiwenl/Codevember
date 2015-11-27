// app.js
window.bongiovi = require("./libs/bongiovi.js");
// window.bongiovi = require("../../../../dist/bongiovi.js");
// window.bongiovi = require("../../../../dist/bongiovi.js");
var dat = require("dat-gui");


window.params = {
	sphereSize:100,
	offset:new bongiovi.EaseNumber(0.0, .1)
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var loader = new bongiovi.SimpleImageLoader();
		loader.load([
			"assets/earth.jpg",
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

		window.addEventListener('keydown', this._onKey.bind(this));
	};


	p._onKey = function(e) {
		// console.log(e.keyCode);

		if(e.keyCode == 32) {
			if(params.offset.value < 0.5) {
				params.offset.value = 1;
			} else {
				params.offset.value = 0;
			}
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
		// this.gui.add(params, 'offset', 0, 1);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();