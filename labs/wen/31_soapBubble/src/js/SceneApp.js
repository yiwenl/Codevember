// SceneApp.js

var GL             = bongiovi.GL, gl;
var ViewNoise      = require("./ViewNoise");
var ViewBubble     = require("./ViewBubble");
var ViewSave       = require("./ViewSave");
var ViewRender     = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	window.releaseOffset = 0;
	this.isReleasing = false;


	window.globalTime = Math.random() * 0xFF;

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._textureHDR = new bongiovi.GLTexture(images.hdr);
	this._textureMap = new bongiovi.GLTexture(images.gradientMap);
	
	var noiseSize    = 512;
	this._fboNoise   = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboLight   = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboNormal  = new bongiovi.FrameBuffer(GL.width, GL.height);

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	this._fboCurrent 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget 	= new bongiovi.FrameBuffer(num*2, num*2, o);

	window.addEventListener('keydown', this._onKey.bind(this));
};


p._onKey = function(e) {
	// console.log(e.keyCode );

	if(e.keyCode === 32) {
		// SPACE
		this.breakBubble();
	} else if(e.keyCode === 82) {
		// R
		this.reset();
	} else if(e.keyCode === 72) {
		params.showNoise = !params.showNoise;
	}
};


p.breakBubble = function() {
	this.isReleasing = true;

	bongiovi.Scheduler.delay(this, this.reset, null, 5000);
};


p.reset = function() {
	this.isReleasing = 0;
	window.releaseOffset = 0.0;
	this._vBubble.opacity.setTo(0);
	this._vBubble.opacity.value = 1;
};


p._initViews = function() {
	console.log('Init Views');
	this._vNoise    = new ViewNoise();
	this._vCopy     = new bongiovi.ViewCopy();
	this._vBubble   = new ViewBubble();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vSave     = new ViewSave();
	this._vRender   = new ViewRender();
	this._vSim      = new ViewSimulation();

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();
};


p.updateFbo = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture() );
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};


p.render = function() {
	if(this.isReleasing) {
		window.releaseOffset += .015;
	}
	window.globalTime += .01;
	this.updateFbo();


	GL.clear(0, 0, 0, 0);
	this._vBubble.render(this._textureHDR, this._fboNoise.getTexture());
	this._vRender.render(this._fboCurrent.getTexture(), this._textureHDR, this._fboNoise.getTexture());

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, this._fboNoise.width, this._fboNoise.height);
	this._fboNoise.bind();
	GL.clear(0, 0, 0, 0);
	this._vNoise.render(this._textureMap);
	this._fboNoise.unbind();

	if(params.showNoise) {
		GL.setViewport(0, 0, 256, 256);
		this._vCopy.render(this._fboNoise.getTexture());
	}
	
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;