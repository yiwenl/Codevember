// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewBox = require("./ViewBox");
var ViewSphere = require("./ViewSphere");
var ViewTop = require("./ViewTop");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	this.lightPosition = [0, 0, 0];
	this.count = 0;

	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);
	this.camera.radius.value = 150;

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	var faces = [images.posx, images.negx, images.posy, images.negy, images.posz, images.negz];
	this.cubeTexture = new bongiovi.GLCubeTexture(faces);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	
	this._vCube     = new ViewBox();
	this._vSphere   = new ViewSphere();
	this._vTop      = new ViewTop();
};

p.render = function() {
	this._vAxis.render();
	this._vDotPlane.render();

	this._vCube.render(this.cubeTexture);
	// this._vSphere.render([0, 0, 0]);
	this._vTop.render();
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;