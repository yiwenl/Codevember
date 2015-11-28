//SceneMain.js

var ViewRoom = require('./ViewRoom');
var ViewSphere = require('./ViewSphere');
var Scene = require('./framework/Scene');
var Framebuffer = require('./framework/Framebuffer');
var Texture = require('./framework/Texture');
var SceneTransforms = require('./framework/SceneTransforms');
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

function SceneMain(){};

var p = SceneMain.prototype = new Scene();
var s = Scene.prototype;

var gl = null;

p.init = function(){

	s.init.call(this);

	this.camera.setPosition(new Array(0.0, 0.0, 0.0));
    this.camera.setLookAtPoint(vec3.fromValues(0.0, 0.0, -1.0));

    // this.keyboardInteractor = new KeyboardInteractor();
    // this.keyboardInteractor.init(this.camera, this.canvas);
    // this.keyboardInteractor.setup();

	gl = window.NS.GL.glContext;

	var derivative = gl.getExtension('OES_standard_derivatives');
	
	// gl.disable(gl.DEPTH_TEST);

	this.transforms = new SceneTransforms();
	this.transforms.init(this.canvas);
	
	this._initTextures();
	this._initViews();

};

p._initTextures = function() {
	console.log( "Init Texture" );

	this._postFBO = new Framebuffer();
	this._postFBO.init(window.innerWidth, window.innerHeight, gl.NEAREST, gl.NEAREST, gl.UNSIGNED_BYTE);

};

p._initViews = function() {
	console.log( "Init Views" );

	this._vRoom = new ViewRoom();
	this._vRoom.init(glslify("../shaders/room.vert"), glslify("../shaders/room.frag"));
	this._vRoom.transforms = this.transforms;

	this._vSphere = new ViewSphere();
	this._vSphere.init(glslify("../shaders/sphere.vert"), glslify("../shaders/sphere.frag"));
	this._vSphere.transforms = this.transforms;

};

p.render = function() {

	gl.clearColor( 0, 0, 0, 1 );
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



	gl.viewport(0, 0, window.innerWidth, window.innerHeight);
	


	this.transforms.push();
	// this.transforms.updatePerspective(this.canvas.width, this.canvas.height);
	this.transforms.setCamera(this.camera);

	this.camera.apply(gl.viewportWidth / gl.viewportHeight);
    // mat4.multiply(mvMatrix,mvMatrix,cam.viewMatrix);
	
	this._postFBO.bind();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	this._vRoom.render();

	

	this._postFBO.unbind();



	// this.orthoTransforms.setCamera(this.orthoCamera);


	// // start blur first pass
	// this._blurPassFBO.bind();

	// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// this._verticalGaussianPost.render(this._postFBO.getTexture());

	// this._blurPassFBO.unbind();


	// start blur second pass
	// this._horizontalBlurPassFBO.bind();

	// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// this._horizontalGaussianPost.render(this._blurPassFBO.getTexture());

	// this._horizontalBlurPassFBO.unbind();


	// start dust post
	// this._dustFBO.bind();

	// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// this._dustPost.render(this._postFBO.getTexture());

	// this._dustFBO.unbind();

	this._vRoom.render();
	
	this._vSphere.render(this._postFBO.getTexture());

	// this._finalView.render(this._dustFBO.getTexture());

	this.transforms.pop();
	
};

	

module.exports = SceneMain;