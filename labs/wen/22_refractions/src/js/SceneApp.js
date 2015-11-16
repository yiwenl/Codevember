// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewBg = require("./ViewBg");
var ViewBalls = require("./ViewBalls");
var ViewCubes = require("./ViewCubes");
var ViewPost = require("./ViewPost");


function SceneApp() {
	gl = GL.gl;
	this.count = 0;
	this.sum = 0;
	this.max = 0;
	this.easeSum = new bongiovi.EaseNumber(0, .25);
	bongiovi.Scene.call(this);
	this._initSound();

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/Oscillate.mp3'],
	    volume: .1,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(256);
	    	sound.play();
	    }
	});
};

p._initTextures = function() {
	this.textureLight = new bongiovi.GLTexture(images.light);
	console.log('Init Textures');

	this._fboBg        = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboLight     = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboNormal    = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboOrgNormal = new bongiovi.FrameBuffer(GL.width/2, GL.height/2);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vCopy     = new bongiovi.ViewCopy();
	this._vBg       = new ViewBg();
	this._vBalls    = new ViewBalls();
	this._vCubes    = new ViewCubes();
	this._vPost     = new ViewPost();
};

p.render = function() {
	this.count += .01;
	this._getSoundData();
	// console.log(params.currSum);
	this.camera._ry.value += -params.sum*.1 - .01;
	this.camera._rx.value = Math.sin(this.count) * .2;
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	this._fboLight.bind();
	GL.clear(0, 0, 0, 0);
	this._vBalls.render(this.textureLight, this.frequencies, 0.0);
	this._vCubes.render(this.textureLight, this.frequencies, 0.0);
	this._fboLight.unbind();

	this._fboNormal.bind();
	GL.clear(0, 0, 0, 0);
	this._vBalls.render(this.textureLight, this.frequencies, .5);
	this._vCubes.render(this.textureLight, this.frequencies, .5);
	this._fboNormal.unbind();

	GL.setViewport(0, 0, this._fboOrgNormal.width, this._fboOrgNormal.height);
	this._fboOrgNormal.bind();
	GL.clear(0, 0, 0, 0);
	this._vBalls.render(this.textureLight, this.frequencies, 1.0);
	this._vCubes.render(this.textureLight, this.frequencies, 1.0);
	this._fboOrgNormal.unbind();


	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);
	this._fboBg.bind();
	GL.clear(0, 0, 0, 0);
	this._vBg.render();
	this._fboBg.unbind();


	GL.clear(0, 0, 0, 0);
	gl.disable(gl.DEPTH_TEST);
	this._vCopy.render(this._fboBg.getTexture());
	this._vPost.render(this._fboLight.getTexture(), this._fboNormal.getTexture(), this._fboBg.getTexture(), this._fboOrgNormal.getTexture());

	// GL.setViewport(0, 0, 256, 256/GL.aspectRatio);
	// this._vCopy.render(this._fboOrgNormal.getTexture());
	// this._vCopy.render(this._fboNormal.getTexture());
	gl.enable(gl.DEPTH_TEST);
};

p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	} else {
		return;
	}

	var f = this.frequencies;
	var sum = 0;
	var max = 150;

	for(var i=0; i<f.length; i++) {
		var index = i * 4;
		sum += f[i];
	}

	sum /= f.length;
	var threshold = 10;
	var maxSpeed = 2.0;

	params.currSum = Math.min(max, sum) / max;

	if(sum > threshold) {
		this.sum += sum * 1.5;
		this.easeSum.value = Math.min(this.sum, maxSpeed) * .1;
	} else {
		this.easeSum.value = 0;
	}


	// this.sum -= this.sum * .15;
	this.sum += -this.sum * .05;
	// this.sum -= 2.0;
	if(this.sum < 0) this.sum = 0;
	
	// console.log(this.sum);
	if(this.sum > this.max) {
		this.max = this.sum;
	}

	
	params.sum = Math.min(this.sum, max)/max;
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);

	this._fboBg        = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboLight     = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboNormal    = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboOrgNormal = new bongiovi.FrameBuffer(GL.width/2, GL.height/2);
};

module.exports = SceneApp;