// SceneApp.js

var GL               = bongiovi.GL, gl;
var ViewSave         = require("./ViewSave");
var ViewRender       = require("./ViewRender");
var ViewSimulation   = require("./ViewSimulation");
var ViewDot          = require("./ViewDot");
var ViewRibbon 		 = require("./ViewRibbon");
var Dot              = require("./Dot");

function SceneApp() {
	gl = GL.gl;
	this._initDots();
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.lockRotation(false);
	console.log(this.camera.near, this.camera.far);
	this.sceneRotation.lock(true);

	// this.camera._rx.value = -.3;
	// this.camera._ry.value = Math.PI/2;
	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initDots = function() {
	this._dots = [];
	for(var i=0; i<params.numDots; i++) {
		var d = new Dot();
		this._dots.push(d);
	}
};

p._initTextures = function() {
	console.log('Init Textures');
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
		fbo.id = "FBO" + i;
		this._fbos.push(fbo);
	}
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vSave     = new ViewSave();
	this._vCopy     = new bongiovi.ViewCopy();
	this._vRender   = new ViewRender();
	this._vSim      = new ViewSimulation();
	this._vDot      = new ViewDot();
	this._vRibbon   = new ViewRibbon();


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	// this._fboCurrent.bind();
	// GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	// this._vSave.render();
	// this._fboCurrent.unbind();

	var lastFbo = this._fbos[this._fbos.length-1];
	GL.setViewport(0, 0, lastFbo.width, lastFbo.height);
	lastFbo.bind();
	GL.clear(0, 0, 0, 0);
	this._vSave.render();
	lastFbo.unbind();
};


p.updateFbo = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	// this._fboTarget.bind();
	// GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	// GL.clear(0, 0, 0, 0);
	// this._vSim.render(this._fboCurrent.getTexture(), this._dots );
	// this._fboTarget.unbind();

	var fbo = this._fbos.shift();
	var fboLast = this._fbos[this._fbos.length-1];
	// console.log(fbo.id, ":", fboLast.id);

	fbo.bind();
	GL.setViewport(0, 0, fbo.width, fbo.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(fboLast.getTexture(), this._dots );
	fbo.unbind();
	this._fbos.push(fbo);


	// var fbo = this._fbos.shift();
	// fbo.bind();
	// this._vCopy.render(this._fboTarget.getTexture());
	// fbo.unbind();
	

	// var tmp = this._fboTarget;
	// this._fboTarget = this._fboCurrent;
	// this._fboCurrent = tmp;


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};


p.render = function() {
	// this.camera._ry.value += .02;
	this.updateFbo();
	// GL.setViewport(0, 0, GL.width, GL.height);
	GL.clear(0, 0, 0, 0);

	for(var i=0; i<this._dots.length; i++) {
		this._dots[i].update();
	}

	var fboLast = this._fbos[this._fbos.length-1];
	// this._vAxis.render();
	// this._vDotPlane.render();
	// this._vRender.render(this._fboCurrent.getTexture());
	// this._vRender.render(fboLast.getTexture());

	gl.disable(gl.CULL_FACE);
	this._vRibbon.render(this._fbos);
	gl.enable(gl.CULL_FACE);

/*
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	gl.disable(gl.DEPTH_TEST);
	GL.setViewport(0, 0, fboLast.width, fboLast.height);
	this._vCopy.render(fboLast.getTexture());
	gl.enable(gl.DEPTH_TEST);
*/
};


p.resize = function() {
	var scale = 1.0;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>