//SceneMain.js

var ViewBox = require('./ViewBox');
var ViewBoxFBO = require('./ViewBox_fbo');
var ViewSphere = require('./ViewSphere');
var Scene = require('./framework/Scene');
var Framebuffer = require('./framework/Framebuffer');
var Texture = require('./framework/Texture');
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

	gl = window.NS.GL.glContext;

	this._lastTimestamp = Date.now();
	this._duration = 4000;

	this._firstRun = true;

	var derivative = gl.getExtension('OES_standard_derivatives');
	
	// gl.disable(gl.DEPTH_TEST);

	// var cameraInteractor = new window.NS.GL.Framework.CameraInteractor();
	// cameraInteractor.init(this.camera, this.canvas);
	
	this._boxes = [];
	this._fboBoxes = [];
	this._vSphere = null;
	this._initTextures();
	this._initViews();

};

p._initTextures = function() {
	console.log( "Init Texture" );

	
	this.fboReflection = new Framebuffer();
	this.fboReflection.init(window.innerWidth, window.innerHeight, gl.NEAREST, gl.NEAREST, gl.UNSIGNED_BYTE);
	
	// this.testTexture = new Texture();
	// this.testTexture.init(window.moonTexture, false);
	
};

p._initViews = function() {
	console.log( "Init Views" );

	var currentX = - 3.25;
	var currentZ = - 4;

	var rows = 4;
	var cols = 4;


	for (var i=0;i<rows;i++){
		for (var q=0;q<cols;q++){

			var vBox = new ViewBox();
			vBox.init(glslify("../shaders/box.vert"), glslify("../shaders/box.frag"));
			vBox.transforms = this.transforms;
			vBox.setLocation([currentX, 0, currentZ]);
			vBox.rowIndex = i;
			vBox.colIndex = q;
			vBox.angleWeight = q == 1 || q == 2 ? .1 : .05;
			vBox.angleAxis = q <= 1 ? -1 : 1;
			vBox.reverseAngleAxis = q <= 1 ? 1 : -1;
			vBox.rotate = true;
			// vBox._duration = i * 1000;
			// vBox._offset = i * 3;
			// if (q == 1 && i == 2)
			// 	vBox.rotate = true;
			this._boxes.push(vBox);

			var fboBox = new ViewBoxFBO();
			fboBox.init(glslify("../shaders/box.vert"), glslify("../shaders/box_fbo.frag"));
			fboBox.transforms = this.transforms;
			fboBox.setLocation([currentX, 0, currentZ]);
			fboBox.rowIndex = i;
			fboBox.colIndex = q;
			fboBox.angleWeight = q == 1 || q == 2 ? .1 : .05;
			fboBox.angleAxis = q <= 1 ? -1 : 1;
			fboBox.reverseAngleAxis = q <= 1 ? 1 : -1;
			fboBox.rotate = true;
			// vBox._duration = i * 1000;
			// vBox._offset = i * 3;
			// if (q == 1 && i == 2)
			// 	vBox.rotate = true;
			this._fboBoxes.push(fboBox);

			currentX += 2;

		}

		currentX = -3.25;
		currentZ += 0.7;

	}

	this._vSphere = new ViewSphere();
	this._vSphere.init(glslify('../shaders/plain.vert'), glslify('../shaders/plain.frag'));
	this._vSphere.transforms = this.transforms;

	// this._vCopy = new ViewCopy();
	// this._vCopy.init("shaders/copy.vert", "shaders/copy.frag");
	// this._vCopy.transforms = this.transforms;

};

p.render = function() {

	gl.clearColor( 0, 0, 0, 1 );
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.viewport(0, 0, window.innerWidth, window.innerHeight);

	var now = Date.now();
	// var diff = now - this._lastTimestamp;
	// if (diff >= this._duration){
	// 	this._lastTimestamp = now;

	// 	diff = now - this._lastTimestamp;

	// 	// debugger;
		
		
	// }

	// var zVal = (diff / this._duration) * 5;

	// console.log((diff / this._duration) * 110);

	gl.viewport(0, 0, this.fboReflection.width, this.fboReflection.height);
	// gl.clearColor( 1, 1, 1, 1 );
	// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.transforms.updatePerspective(this.fboReflection.width, this.fboReflection.height);
	// this.transforms.resetPerspective();
	// this.transforms.setCamera(this.cameraOtho);

	
	// this.transforms.updatePerspective(this.canvas.width, this.canvas.height);
	this.transforms.setCamera(this.fboCamera);

	this.fboReflection.bind();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	for (var i=0;i<this._fboBoxes.length;i++){
		if (this._firstRun){
			var row = this._fboBoxes[i].rowIndex + 1;
			this._fboBoxes[i]._lastTimestamp = now - (row * ((6000 - 500) / 4));
			// console.log((row * ((6000-1500) / 4)));
		}
		// 	this._boxes[i].render(now+500*i);
		// else

		
		this._fboBoxes[i].render(now);

	}

	this.fboReflection.unbind();

	gl.viewport(0, 0, window.innerWidth, window.innerHeight);
	// gl.clearColor( 0, 0, 0, 1 );
	// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// this.transforms.resetPerspective();
	this.transforms.updatePerspective(this.canvas.width, this.canvas.height);
	this.transforms.setCamera(this.camera);

	// this._vCopy.render(this.fboReflection.getTexture());
	
	for (var i=0;i<this._boxes.length;i++){
		if (this._firstRun){
			var row = this._boxes[i].rowIndex + 1;
			this._boxes[i]._lastTimestamp = now - (row * ((6000 - 1000) / 4));
			// console.log((row * ((6000-1500) / 4)));
		}
		// 	this._boxes[i].render(now+500*i);
		// else

		
		this._boxes[i].render(now);

	}

	this._vSphere.render( this.fboReflection.getTexture() );

	this._firstRun = false;
	
};

	

module.exports = SceneMain;