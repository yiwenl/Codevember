// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewBox = require("./ViewBox");
var ViewSphere = require("./ViewSphere");
var ViewTop = require("./ViewTop");
var ViewTotem = require("./ViewTotem");
var ViewTrace = require("./ViewTrace");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	this.lightPosition = [0, 0, 0];
	this.count = 0;

	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);
	this.camera.radius.value = 150;
	// this.camera._rx.value = -.7;
	// var r = 1.0;
	// this.camera._ry.limit(-r, r);
	// this.camera._rx.limit(-r/2, r/2);

	this.resize();

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.light);
	this._textureBlur = new bongiovi.GLTexture(images.lightBlur);
	this._textureGrd = new bongiovi.GLTexture(images.grd);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vTrace 	= new ViewTrace();
};

p.render = function() {
	this.count+= .01;
	// this.camera._ry.value -= .05;
	// this.camera._rx.value = Math.sin(this.count) * .4;
	GL.clear(0, 0, 0, 0);

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	this._vTrace.render(this._texture, this._textureBlur, [-this.camera._rx.value, -this.camera._ry.value - Math.PI/2], this._textureGrd);
};

p.resize = function() {
	var size = Math.min(window.innerWidth, window.innerHeight);
	size = Math.min(size, 600);
	GL.setSize(size, size);
	GL.canvas.style.marginLeft = -size/2 + "px";
	GL.canvas.style.marginTop = -size/2 + "px";
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;