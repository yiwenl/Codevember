// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewBox = require("./ViewBox");
var ViewSphere = require("./ViewSphere");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	this.lightPosition = [0, 0, 0];
	this.count = 0;

	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);
	console.log(this.camera.radius.value);

	this.camera._rx.value = this.camera._ry.value = -.4;
	this.resize();

	window.addEventListener("resize", this.resize.bind(this));
	window.addEventListener('keydown', this._onKey.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.light);
	this._textureBlur = new bongiovi.GLTexture(images.lightBlur);
	this._textureGrd = new bongiovi.GLTexture(images.grd);
	this._textureEarth = new bongiovi.GLTexture(images.earth);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vSphere   = new ViewSphere();
};

p._onKey = function(e) {
	if(e.keyCode == 32) {	//	spacebar
		if(params.offset.value < 0.5) {
			params.offset.value = 1;
			this.camera.radius.value = 250;
			this.camera._rx.value = this.camera._ry.value = 0;
		} else {
			params.offset.value = 0;
			this.camera.radius.value = 500;
			this.camera._rx.value = this.camera._ry.value = -.4;
		}
	}
};

p.render = function() {
	this._vAxis.render();
	this._vDotPlane.render();

	this._vSphere.render(this._textureEarth);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;