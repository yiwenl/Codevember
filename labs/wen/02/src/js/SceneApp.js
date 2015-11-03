// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewIcoSphere = require("./ViewIcoSphere");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	this.camera._rx.value = -.2;

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

	this._vSphere = new ViewIcoSphere();
};

p.render = function() {
	GL.clear(0, 0, 0, 0);
	this.camera._ry.value += .01;
	// this._vAxis.render();
	this._vDotPlane.render();

	this._vSphere.render();
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;