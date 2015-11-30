// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewBallon = require("./ViewBallon");
var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewRibbon = require("./ViewRibbon");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	this._isAnimating = false;

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	window.addEventListener("resize", this.resize.bind(this));
	window.addEventListener('keydown', this._onKeyDown.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();


p._onKeyDown = function(e) {
	console.log(e.keyCode);

	if(e.keyCode == 32) {
		this._isAnimating = true;
	}
};

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.light);
	this._textureLight = new bongiovi.GLTexture(images.light);

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}

	this._fbos = [];
	for(var i=0; i<params.ribbonLength; i++) {
		var fbo = new bongiovi.FrameBuffer(num*2, num*2, o);
		this._fbos.push(fbo);
	}
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vBallon   = new ViewBallon();
	this._vSave     = new ViewSave();
	this._vCopy 	= new bongiovi.ViewCopy();
	this._vRender 	= new ViewRender();
	this._vSim 		= new ViewSimulation();
	this._vRibbon 	= new ViewRibbon();

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	var lastFbo = this._fbos[this._fbos.length-1];

	lastFbo.bind();
	GL.setViewport(0, 0, lastFbo.width, lastFbo.height);
	this._vSave.render();
	lastFbo.unbind();
};

p.updateFbo = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	var fbo = this._fbos.shift();
	var fboLast = this._fbos[this._fbos.length-1];

	fbo.bind();
	GL.setViewport(0, 0, fbo.width, fbo.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(fboLast.getTexture(),this._isAnimating );
	fbo.unbind();
	this._fbos.push(fbo);


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	
};

p.render = function() {
	GL.clear(0, 0, 0, 0);
	this.updateFbo();
	GL.setViewport(0, 0, GL.width, GL.height);

	this._vAxis.render();
	this._vDotPlane.render();

	this._vBallon.render(this._textureLight);

	var fboLast = this._fbos[this._fbos.length-1];
	this._vRibbon.render(this._fbos, this._texture);
	this._vRender.render(fboLast.getTexture(), this._texture);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;