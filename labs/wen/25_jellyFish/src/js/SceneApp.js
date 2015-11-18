// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewJelly = require("./ViewJelly");
var ViewDot = require("./ViewDot");
var Dot = require("./Dot");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	// gl.disable(gl.CULL_FACE);

	this._dots = [];
	for(var i=0; i<params.numDots; i++) {
		var d = new Dot();
		this._dots.push(d);
	}

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._textureMap = new bongiovi.GLTexture(images.map);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vJelly = new ViewJelly();
	this._vDot = new ViewDot();
};

p.render = function() {
	GL.clear(0, 0, 0, 0);
	// this._vAxis.render();
	// this._vDotPlane.render();

	// gl.disable(gl.DEPTH_TEST);
	for(var i=0; i<this._dots.length; i++) {
		var dot = this._dots[i];
		dot.update();
		// this._vDot.render(dot.update());
	}
	// gl.enable(gl.DEPTH_TEST);

	this._vJelly.render(this._dots, this._textureMap);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;