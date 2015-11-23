// SceneApp.js

var GL = bongiovi.GL, gl;
var SoundCloudLoader = require("./SoundCloudLoader");
var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewRibbon = require("./ViewRibbon");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.setPerspective(60 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera._rx.value = -.3;
	this.camera._ry.value = -.1;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.gold);
	if(!gl) gl = GL.gl;

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	// this._fboCurrent 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	// this._fboTarget 	= new bongiovi.FrameBuffer(num*2, num*2, o);


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
	this._vSim.render(fboLast.getTexture() );
	fbo.unbind();
	this._fbos.push(fbo);


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	
};


p.render = function() {
	this.updateFbo();
	GL.setViewport(0, 0, GL.width, GL.height);
	
	// this._vAxis.render();
	// this._vDotPlane.render();
	var fboLast = this._fbos[this._fbos.length-1];
	this._vRibbon.render(this._fbos, this._texture);
	GL.enableAdditiveBlending();
	this._vRender.render(fboLast.getTexture(), this._texture);
	GL.enableAlphaBlending();

	// GL.setMatrices(this.cameraOtho);
	// GL.rotate(this.rotationFront);
	// GL.setViewport(0, 0, 256, 256);
	// this._vCopy.render(this._fboCurrent.getTexture());	

	// GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	// this._vCopy.render(this._fboCurrent.getTexture());
};


p.resize = function() {
	var scale = 1.5;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>