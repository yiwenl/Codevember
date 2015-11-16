// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewBg = require("./ViewBg");
var ViewBalls = require("./ViewBalls");
var ViewPost = require("./ViewPost");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	this.textureLight = new bongiovi.GLTexture(images.light);
	console.log('Init Textures');

	this._fboBg = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboLight = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboNormal = new bongiovi.FrameBuffer(GL.width, GL.height);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vCopy = new bongiovi.ViewCopy();
	this._vBg = new ViewBg();
	this._vBalls = new ViewBalls();
	this._vPost = new ViewPost();
};

p.render = function() {
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	this._fboLight.bind();
	GL.clear(0, 0, 0, 0);
	this._vBalls.render(this.textureLight);
	this._fboLight.unbind();

	this._fboNormal.bind();
	GL.clear(0, 0, 0, 0);
	this._vBalls.render(this.textureLight, true);
	this._fboNormal.unbind();



	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);
	this._fboBg.bind();
	GL.clear(0, 0, 0, 0);
	this._vBg.render();
	this._fboBg.unbind();


	GL.clear(0, 0, 0, 0);
	gl.disable(gl.DEPTH_TEST);
	this._vCopy.render(this._fboBg.getTexture());
	// this._vCopy.render(this._fboLight.getTexture());
	
	this._vPost.render(this._fboLight.getTexture(), this._fboNormal.getTexture(), this._fboBg.getTexture());

	GL.setViewport(0, 0, 256, 256/GL.aspectRatio);
	this._vCopy.render(this._fboNormal.getTexture());
	gl.enable(gl.DEPTH_TEST);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;