// SceneApp.js

var GL = bongiovi.GL, gl;

var ViewSphere = require("./ViewSphere");
var ViewPost = require("./ViewPost");
var ViewDot = require("./ViewDot");

function SceneApp() {
	gl = GL.gl;
	this._initSound();
	bongiovi.Scene.call(this);
	this.sceneRotation.setCameraPos([0.4946438670158386, 0.357036292552948, 0.7923714518547058, 0]);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initSound = function() {
	console.log('init sound');
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/03.mp3'],
	    volume: 0.00,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(64);
	    	sound.play();
	    }
	});
};

p._initTextures = function() {
	console.log('Init textures');
	this._textureSky    = new bongiovi.GLTexture(images.sky);
	this._textureLight = new bongiovi.GLTexture(images.light);
	this.fboNormal     = new bongiovi.FrameBuffer(GL.width, GL.height);
	this.fboLight      = new bongiovi.FrameBuffer(GL.width, GL.height);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vCopy = new bongiovi.ViewCopy();
	this._vSphere = new ViewSphere();
	this._vPost = new ViewPost();
	this._vDot = new ViewDot();
};

p.render = function() {
	this._getSoundData();
	gl.enable(gl.DEPTH_TEST);

	this.fboNormal.bind();
	GL.clear(0, 0, 0, 0);
	this._vSphere.render(this._textureLight, true);
	this.fboNormal.unbind();

	this.fboLight.bind();
	GL.clear(0, 0, 0, 0);
	this._vSphere.render(this._textureLight, false);
	this.fboLight.unbind();


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	gl.disable(gl.DEPTH_TEST);
	this._vCopy.render(this._textureSky);
	this._vPost.render(this._textureSky, this.fboNormal.getTexture(), this.fboLight.getTexture());
};


p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	}

	var soundOffset = 0;
	if(this.analyser) {
		var f = this.analyser.getFrequencies();
		for(var i=0; i<f.length; i++) {
			soundOffset += f[i];	
		}
		soundOffset /= ( f.length * 100);
	}

	var beatThreshold = .45;
	if(soundOffset - this.preSoundOffset > beatThreshold) {
		this.preSoundOffset = soundOffset;
		this.soundOffset = soundOffset;
		console.debug("Trigger !");
		if(this._vSphere) this._vSphere.addWave(soundOffset);
	}
	this.soundOffset += ( 0 - this.soundOffset ) * .01;
	this.preSoundOffset -= .03;
	if(this.preSoundOffset < 0 ) this.preSoundOffset = 0;
};


p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);

	this.fboNormal = new bongiovi.FrameBuffer(GL.width, GL.height);
	this.fboLight = new bongiovi.FrameBuffer(GL.width, GL.height);
};

module.exports = SceneApp;