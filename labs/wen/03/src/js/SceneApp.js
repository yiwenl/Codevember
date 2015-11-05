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
	this._texGradient = new bongiovi.GLTexture(images.gradient);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vNoise = new ViewNoise();
};

p.render = function() {
	// this._vAxis.render();
	// this._vDotPlane.render();


	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.sceneRotation.matrix);

	this._vNoise.render(this._texGradient);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;