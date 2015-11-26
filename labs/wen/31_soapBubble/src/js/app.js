// app.js
window.bongiovi = require("./libs/bongiovi.js");
window.Sono     = require("./libs/sono.min.js");
var dat         = require("dat-gui");

window.params = {
	numSeg:100,
	noiseOffset:0.015,
	noiseStrength:new bongiovi.EaseNumber(1, .01),
	numParticles:256*2,
	showNoise:false,
	bubbleSize:75
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		this.count = 0;
		this.noiseLevel = 0;
		var l = new bongiovi.SimpleImageLoader();
		var a = ["assets/hdr.jpg", "assets/gradientMap.jpg"];
		l.load(a, this, this._onImageLoaded);
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

		window.addEventListener('click', this._onTouched.bind(this));
		window.addEventListener('touchstart', this._onTouched.bind(this));
	};

	p._loop = function() {
		this.count += .01;
		params.noiseOffset = 0.015 + (Math.sin(this.count) * 0.5 + 0.5) * 0.01;
		params.noiseStrength.value = 5 + (Math.sin(this.count*1.234566) * 0.5 + 0.5)*2;
		this._scene.loop();
	};


	p._onTouched = function() {
		this._scene.breakBubble();
	};
})();


new App();