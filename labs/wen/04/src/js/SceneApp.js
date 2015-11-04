// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewSphere = require("./ViewSphere");
var ViewDot = require("./ViewDot");
var Particle = require("./Particle");
var random = function(min, max) { return min + Math.random() * (max - min);	}

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	this.camera._rx.value = -.2;
	this.camera._ry.value = .3;
	this.camera.radius.value = 1000.0;

	
	this.particles = [];
	for(var i=0; i<params.numParticles; i++) {
		var p = new Particle();
		p.reset();
		this.particles.push(p);
	}

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vSphere = new ViewSphere();
	this._vDot = new ViewDot();
};

p.render = function() {
	// this._vAxis.render();
	// this._vDotPlane.render();
	for(var i=0; i<this.particles.length; i++) {
		var p = this.particles[i];
		p.update();
		this._vDot.render(p);
	}
	this._vSphere.render(this.particles);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;