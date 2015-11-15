// SceneApp.js

var GL = bongiovi.GL, gl;
var SoundCloudLoader = require("./SoundCloudLoader");
var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewLightSphere = require("./ViewLight");
var ViewDot = require("./ViewDot");
var Dot = require("./Dot");

function SceneApp() {
	gl = GL.gl;
	this.sum = 0;
	this.max = 0;
	this.easeSum = new bongiovi.EaseNumber(0, .25);
	this._initSound();
	this._initDots();
	bongiovi.Scene.call(this);
	gl.disable(gl.DEPTH_TEST);
	GL.enableAdditiveBlending();

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera._rx.value = -.3;
	this.camera._ry.value = -.1;

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

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/Oscillate.mp3'],
	    volume: 1.0,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(256);
	    	sound.play();
	    }
	});
};

p._initTextures = function() {
	console.log('Init Textures');
	if(!gl) gl = GL.gl;

	this.textureParticle = new bongiovi.GLTexture(images.particle);

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	this._fboCurrent 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget 	= new bongiovi.FrameBuffer(num*2, num*2, o);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vSave     = new ViewSave();
	this._vCopy 	= new bongiovi.ViewCopy();
	this._vRender 	= new ViewRender();
	this._vSim 		= new ViewSimulation();
	this._vLight    = new ViewLightSphere();
	this._vDot 		= new ViewDot();


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
	this._vSim.render(this._fboCurrent.getTexture(), this._dots );
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};


p.render = function() {
	// GL.clear(0, 0, 0, 1);
	this.updateFbo();
	GL.setViewport(0, 0, GL.width, GL.height);
	this._getSoundData();
	
	// this._vAxis.render();
	// this._vDotPlane.render();
	
	this._vLight.render();
	for(var i=0; i<this._dots.length; i++) {
		this._vDot.render(this._dots[i].update(), this.textureParticle);
	}
	this._vRender.render(this._fboCurrent.getTexture(), this.textureParticle);

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, 256, 256);
	// this._vCopy.render(this._fboCurrent.getTexture());
	// this._vCopy.render(this.textureParticle);
};



p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	} else {
		return;
	}

	var f = this.analyser.getFrequencies();

	var sum = 0;

	for(var i=0; i<f.length; i++) {
		var index = i * 4;
		sum += f[i];
	}

	sum /= f.length;
	var threshold = 10;
	var maxSpeed = 2.0;

	if(sum > threshold) {
		this.sum += sum * 1.5;
		this.easeSum.value = Math.min(this.sum, maxSpeed) * .1;
	} else {
		this.easeSum.value = 0;
	}


	// this.sum -= this.sum * .15;
	this.sum += -this.sum * .25;
	if(this.sum < 0) this.sum = 0;
	
	// console.log(this.sum);
	if(this.sum > this.max) {
		this.max = this.sum;
	}

	var max = 150;
	params.sum = Math.min(this.sum, max)/max;
};

p.resize = function() {
	var scale = 1.0;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>