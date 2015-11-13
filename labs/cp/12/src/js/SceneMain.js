//SceneMain.js

var ViewBezier = require('./ViewBezier');
var Scene = require('./framework/Scene');
var CameraInteractor = require('./framework/CameraInteractor');
var glslify = require("glslify");

mat4.multiplyVec4=function(a,b,c){
			c||(c=b);
			var d=b[0],e=b[1],g=b[2],b=b[3];
			c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;
			c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;
			c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;
			c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;
			return c
		};

var random = function(min, max) { return min + Math.random() * (max - min); }

function SceneMain(){};

var p = SceneMain.prototype = new Scene();
var s = Scene.prototype;

var gl = null;

p.init = function(){

	s.init.call(this);

	gl = window.NS.GL.glContext;

	var derivative = gl.getExtension('OES_standard_derivatives');
	
	// gl.disable(gl.DEPTH_TEST);

	var cameraInteractor = new CameraInteractor();
	cameraInteractor.init(this.camera, this.canvas);
	
	// this._initTextures();
	this._initViews();

};

p._initTextures = function() {
	console.log( "Init Texture" );


	
};

p._initViews = function() {
	console.log( "Init Views" );

	this._vBezier = new ViewBezier();
	this._vBezier.init(glslify('../shaders/bezier.vert'), glslify('../shaders/bezier.frag'));
	this._vBezier.transforms = this.transforms;	

};


p.render = function() {

	gl.clearColor( 0, 0, 0, 1 );
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



	gl.viewport(0, 0, window.innerWidth, window.innerHeight);
	

	this.transforms.updatePerspective(this.canvas.width, this.canvas.height);
	this.transforms.setCamera(this.camera);

	

	this._vBezier.render();

	
	

	

	
};

module.exports = SceneMain;