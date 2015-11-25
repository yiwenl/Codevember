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
	this.camera._rx.value = -Math.PI/10;
	this.camera._ry.value = Math.PI/3;
	// this.camera._rx.limit(-.4, -.2);
	// this.camera._ry.limit(0, .2);

	this.resize();

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.light);
	this._textureBlur = new bongiovi.GLTexture(images.lightBlur);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vTrace 	= new ViewTrace();
};

p.render = function() {
	GL.clear(0, 0, 0, 0);

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	this._vTrace.render(this._texture, this._textureBlur, [-this.camera._rx.value, -this.camera._ry.value- Math.PI * .5]);
};

p.resize = function() {
	var size = Math.min(window.innerWidth, window.innerHeight);
	// size = Math.min(size, 600);
	GL.setSize(size, size);
	GL.canvas.style.marginLeft = -size/2 + "px";
	GL.canvas.style.marginTop = -size/2 + "px";
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;