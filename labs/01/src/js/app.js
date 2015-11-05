// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");
window.params = {
	zGap:5,
	radius:50,
	movingSpeed:.2,
	noise:.0075,
	noiseScale:.15
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	}

	var p = App.prototype;

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		this.gui = new dat.GUI({width:300});
		this.gui.add(params, 'radius', 10, 500);
		this.gui.add(params, 'zGap', 5, 50);
		this.gui.add(params, 'noise', 0.0, 0.05);
		this.gui.add(params, 'noiseScale', .0, .5);
		this.gui.add(params, 'movingSpeed', .0, 2.0);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();