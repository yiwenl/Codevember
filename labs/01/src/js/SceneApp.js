// SceneApp.js

var GL = bongiovi.GL, gl;
var glm = bongiovi.glm;
var ViewSphere = require("./ViewSphere");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	GL.enableAdditiveBlending();
	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);
	this.invert = glm.mat4.create();

	this.camera._rx.value = this.camera._ry.value = -.25;

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

	this._vSphere = new ViewSphere(128);
};

p.render = function() {
	GL.clear(0, 0, 0, 0);
	// this._vAxis.render();
	this._vDotPlane.render();


	glm.mat4.invert(this.invert, this.sceneRotation.matrix);

	this._vSphere.render(this.invert);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;