// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewSphere = require("./ViewSphere");
var ViewBall = require("./ViewBall");

function SceneApp() {
	this.time = Math.random() * Math.PI*2.0;
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this.texture = new bongiovi.GLTexture(images.light);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vSphere = new ViewSphere();
	this._vBall = new ViewBall();
};

p.render = function() {
	this.time += .01;
	var r = 125 + Math.sin(this.time) * 20.0;
	var x = Math.cos(this.time) * r;
	var z = Math.sin(this.time) * r + 100.0;
	var y = Math.cos(this.time)*Math.sin(this.time) * 50.0;

	// this._vAxis.render();
	this._vDotPlane.render();

	this._vSphere.render([x, y, z], this.texture);
	this._vBall.render([x, y, z], .5);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;