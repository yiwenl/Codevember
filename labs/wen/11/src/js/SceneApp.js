// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewTrace = require("./ViewTrace");
var ViewButterfly = require("./ViewButterfly");
var random = function(min, max) { return min + Math.random() * (max - min);	}

function SceneApp() {
	this.count = 0;
	gl = GL.gl;
	// gl.disable(gl.CULL_FACE);
	bongiovi.Scene.call(this);
	this.resize();
	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);
	this.camera._ry.value = 2.2;
	this.camera._rx.value = -.1;

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.light);
	this._textureWing = new bongiovi.GLTexture(images.b);
};

p._initViews = function() {
	console.log('Init Views');
	this._vDotPlane = new bongiovi.ViewDotPlane();
	// this._vTrace = new ViewTrace();
	this.reset();
};


p.reset = function() {
	this._bubbles = [];
	var range = 1.25;
	this._vTrace = new ViewTrace();	
	this._vButterfly = new ViewButterfly();
};

p.render = function() {
	// this._vAxis.render();
	GL.clear(0, 0, 0, 0);
	// this._vDotPlane.render();

	
	this._vButterfly.render(this._textureWing);

	// GL.setMatrices(this.cameraOrtho);
	// GL.rotate(this.rotationFront);

	// this._vTrace.render(this._textureWing);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;