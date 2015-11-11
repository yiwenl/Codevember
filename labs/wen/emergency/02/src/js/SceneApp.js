// SceneApp.js

var GL        = bongiovi.GL, gl;
var ViewTrace = require("./ViewTrace");
var ViewBg    = require("./ViewBg");
var vec3      = bongiovi.glm.vec3;
var random    = function(min, max) { return min + Math.random() * (max - min);	}

function SceneApp() {
	gl = GL.gl;
	gl.disable(gl.DEPTH_TEST);
	bongiovi.Scene.call(this);
	this.resize();
	this._initBalls();

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.light);
	var noiseSize = 256;
	this._fboBg = new bongiovi.FrameBuffer(noiseSize, noiseSize);
};

p._initViews = function() {
	console.log('Init Views');
	this._vTrace    = new ViewTrace();
	this._vBg 		= new ViewBg();
	this._vCopy 	= new bongiovi.ViewCopy();
}

p._initBalls = function() {
	var numBalls = params.numBubble;
	var range = 100;
	this._balls = [];
};


p.render = function() {
	if(!this._balls) return;

	

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);


	GL.setViewport(0, 0, this._fboBg.width, this._fboBg.height);
	this._fboBg.bind();
	GL.clear(0, 0, 0, 0);
	this._vBg.render();
	this._fboBg.unbind();

	GL.setViewport(0, 0, GL.width, GL.height);
	GL.clear(0, 0, 0, 0);
	// this._vCopy.render(this._fboBg.getTexture());
	this._vTrace.render(this._balls, this._texture, this._fboBg.getTexture());
	
	GL.setViewport(0, 0, 50, 50);
	this._vCopy.render(this._fboBg.getTexture());
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;