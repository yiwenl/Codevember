// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");



(function() {
	// var SceneApp = require("./SceneApp");

	

	var SceneMain = require("./SceneMain");

	

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
		this.canvas.id = 'gl';
		document.body.appendChild(this.canvas);
		// bongiovi.GL.init(this.canvas);

		window.NS = {};
		window.NS.GL = {};
		// window.NS.params = {};
		// window.NS.params.detail = 32;

		// this._scene = new SceneApp();
		// bongiovi.Scheduler.addEF(this, this._loop);

		// this.gui = new dat.GUI({width:300});

		this._sceneMain = new SceneMain();
		this._sceneMain.init();

		var self = this;
		setTimeout(function(){

			bongiovi.Scheduler.addEF(self, self._loop);
		},200);
	};

	p._loop = function() {
		this._sceneMain.loop();
	};

})();


new App();