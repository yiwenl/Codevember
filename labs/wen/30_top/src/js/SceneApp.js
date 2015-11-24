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
	this.camera._rx.value = -.3;
	this.camera._ry.value = .1;

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	var faces = [images.posx, images.negx, images.posy, images.negy, images.posz, images.negz];
	this.cubeTexture = new bongiovi.GLCubeTexture(faces);
	this._texture = new bongiovi.GLTexture(images.light);
	this._textureGrd = new bongiovi.GLTexture(images.grd);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	
	this._vCube     = new ViewBox();
	this._vSphere   = new ViewSphere();
	this._vTop      = new ViewTop();
	this._vTotem 	= new ViewTotem();

	this._vTrace 	= new ViewTrace();
};

p.render = function() {
	// this._vAxis.render();
	// this._vDotPlane.render();

	// this._vCube.render(this.cubeTexture);
	// this._vSphere.render([0, 0, 0]);
	// this._vTop.render();

	// this._vTotem.render(this.cubeTexture);

	GL.clear(0, 0, 0, 0);

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	this._vTrace.render(this._texture, this._textureGrd, -this.camera._ry.value);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;