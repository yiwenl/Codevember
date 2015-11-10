// SceneApp.js

var GL        = bongiovi.GL, gl;
var ViewTrace = require("./ViewTrace");
var ViewBox   = require("./ViewBox");
var ViewBg    = require("./ViewBg");
var ViewPost  = require("./ViewPost");
var Bubble    = require("./Bubble");
var random    = function(min, max) { return min + Math.random() * (max - min);	}

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
	this._textureMap = new bongiovi.GLTexture(images.light);

	var noiseSize = 1024;
	this._fboNoise = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboLight = new bongiovi.FrameBuffer(GL.width, GL.height);

};

p._initViews = function() {
	console.log('Init Views');
	this._vBox = new ViewBox();
	this._vBg = new ViewBg();
	this._vCopy = new bongiovi.ViewCopy();
	this._vPost = new ViewPost();
	this.reset();
};


p.reset = function() {
	this._bubbles = [];
	var range = 1.5;

	for(var i=0; i<params.numBubble; i++) {
		var pos = [random(-range, range), random(-range, range), random(-range, range)];
		var size = random(0.55, 1.5);
		var b = new Bubble(pos, size);
		this._bubbles.push(b);
	}

	this._vTrace = new ViewTrace();	
};

p.render = function() {
	// this.camera._rx.value += .01;
	// this.camera._ry.value += .01;

	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	GL.setViewport(0, 0, GL.width, GL.height);
	this._fboRender.bind();
	GL.clear(0, 0, 0, 0);
	this._vBox.render(this._textureMap, true);
	this._fboRender.unbind();

	this._fboLight.bind();
	GL.clear(0, 0, 0, 0);
	this._vBox.render(this._textureMap, false);
	this._fboLight.unbind();

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, this._fboNoise.width, this._fboNoise.height);
	this._fboNoise.bind();
	GL.clear(0, 0, 0, 0);
	this._vBg.render();
	this._fboNoise.unbind();


	//	FINAL RENDER
	GL.clear(0, 0, 0, 0);
	GL.setViewport(0, 0, GL.width, GL.height);
	this._vPost.render(this._fboRender.getTexture(), this._fboNoise.getTexture());


	gl.disable(gl.DEPTH_TEST);
	GL.setViewport(0, 0, 512, 512);
	this._vCopy.render(this._fboLight.getTexture());
	gl.enable(gl.DEPTH_TEST);
};

p.resize = function() {
	var noiseSize = 1024;
	this._fboNoise = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);

	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;