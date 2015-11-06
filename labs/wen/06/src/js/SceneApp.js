// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewTrace = require("./ViewTrace");
var Bubble = require("./Bubble");
var random = function(min, max) { return min + Math.random() * (max - min);	}

function SceneApp() {
	this.count = 0;
	gl = GL.gl;
	bongiovi.Scene.call(this);
	this.resize();

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
};

p._initViews = function() {
	console.log('Init Views');
	// this._vTrace = new ViewTrace();
	this.reset();
};


p.reset = function() {
	this._bubbles = [];
	var range = 0.25;

	for(var i=0; i<params.numBubble; i++) {
		var pos = [random(-range, range), random(-range, range), random(-range, range)];
		var size = random(1.5, 1.55);
		var b = new Bubble(pos, size);
		this._bubbles.push(b);
	}

	this._vTrace = new ViewTrace();	
};

p.render = function() {
	// this._vAxis.render();
	// this._vDotPlane.render();

	GL.clear(0, 0, 0, 0);

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	this._vTrace.render(this._bubbles);
};

p.resize = function() {
	var size = Math.min(window.innerWidth, window.innerHeight);
	size = Math.min(size, 1024);
	GL.canvas.style.marginLeft = -size/2 + 'px';
	GL.canvas.style.marginTop = -size/2 + 'px';
	GL.setSize(size, size);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;