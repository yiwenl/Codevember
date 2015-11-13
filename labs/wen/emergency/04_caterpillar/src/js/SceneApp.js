// SceneApp.js

var GL        = bongiovi.GL, gl;
var ViewBall  = require("./ViewBall");
var ViewTrace = require("./ViewTrace");
var Ball      = require("./Ball");
var vec3      = bongiovi.glm.vec3;
var random    = function(min, max) { return min + Math.random() * (max - min);	}

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	this.resize();
	this._initBalls();
	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);
	this.camera._ry.value = -Math.PI/2;

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.light);
	this._textureGrd = new bongiovi.GLTexture(images.grd);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vBall     = new ViewBall();
	this._vTrace    = new ViewTrace();
};

p._initBalls = function() {
	var numBalls = params.numBubble;
	var range = 100;
	this._balls = [];
	for(var i=0; i<numBalls; i++) {
		var b = new Ball();
		b.size = random(40, 80);
		b.position = vec3.fromValues(random(-range, range), random(-range, range), random(-range, range));

		this._balls.push(b);
	}
};


p.render = function() {
	if(!this._balls) return;
	this._vAxis.render();
	this._vDotPlane.render
	// this.camera._ry.value -= .001;

	for(var i=0; i<this._balls.length; i++) {
		var b = this._balls[i];
		this._vBall.render(b.position, b.size);	
	}

	GL.clear(0, 0, 0, 0);

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	this._vTrace.render(this._balls, this._texture, this._textureGrd, -this.camera._ry.value);
	
};

p.resize = function() {
	var size = Math.min(window.innerWidth, window.innerHeight);
	size = Math.min(1000, size);
	GL.setSize(size, size);
	GL.canvas.style.marginLeft = -size/2 + "px";
	GL.canvas.style.marginTop = -size/2 + "px";
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;