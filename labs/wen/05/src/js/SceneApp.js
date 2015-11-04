// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewNoise = require("./ViewNoise");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');

	var noiseSize = 256;
	this.fboNoise = new bongiovi.FrameBuffer(noiseSize, noiseSize);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vNoise    = new ViewNoise();
	this._vCopy     = new bongiovi.ViewCopy();
};

p.render = function() {
	GL.clear(0, 0, 0, 0);

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	GL.setViewport(0, 0, this.fboNoise.width, this.fboNoise.height);
	this.fboNoise.bind();
	GL.clear(0, 0, 0, 0);
	this._vNoise.render();
	this.fboNoise.unbind();
	GL.setViewport(0, 0, 256, 256);
	this._vCopy.render(this.fboNoise.getTexture());

	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	this._vAxis.render();
	this._vDotPlane.render();
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;