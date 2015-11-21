// SceneApp.js

var GL         = bongiovi.GL, gl;
var ViewSphere = require("./ViewSphere");
var ViewDot    = require("./ViewDot");
var ViewRibbon = require("./ViewRibbon");
var ViewPost   = require("./ViewPost");
var glm        = bongiovi.glm;
var vec3       = glm.vec3;
var quat       = glm.quat;
var Utils      = require("./Utils");
var random = function(min, max) { return min + Math.random() * (max - min);	}

function SceneApp() {
	gl = GL.gl;

	this.count = .01;
	this.points = [];
	this.lines = [];
	
	this.point = vec3.fromValues(params.sphereSize+10, 0, 0);
	this.orgPoint = vec3.clone(this.point);
	this.axis  = vec3.fromValues(random(-1, 1), random(-1, 1), random(-1, 1));
	
	vec3.normalize(this.axis, this.axis);
	console.log(this.axis);
	var angle  = Math.random() * .5 + .5;
	this.angle = angle;
	this.quat = quat.create();
	quat.setAxisAngle(this.quat, this.axis, this.angle);

	bongiovi.Scene.call(this);
	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this.fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
	this.texture = new bongiovi.GLTexture(images.grd);
};

p._initViews = function() {
	this._vSphere = new ViewSphere();
	this._vDot = new ViewDot();
	this._vRibbon = new ViewRibbon();
	this._vCopy = new bongiovi.ViewCopy();
	this._vPost = new ViewPost();
};

p.render = function() {
	this.count += .01;
	this.angle += .02;
	this.axis[0] += Math.sin(this.count) * .1;
	this.axis[1] -= Math.cos(this.count*2) * .1;
	this.axis[2] += -Math.sin(this.count) * .1;
	vec3.normalize(this.axis, this.axis);
	quat.setAxisAngle(this.quat, this.axis, this.angle);
	vec3.transformQuat(this.point, this.orgPoint, this.quat);

	this.points.push(vec3.clone(this.point));
	if(this.points.length > params.ribbonLength) {
		this.points.shift();
	}

	if(this.points.length < 3) return;


	var l2 = Utils.getLinePoints(this.points, 10);
	var l1 = Utils.getLinePoints(this.points, 5);
	var l = Utils.getLinePoints(this.points);
	this.lines[0] = Utils.getLinePoints(l2.left);
	this.lines[1] = Utils.getLinePoints(l1.left);
	this.lines[2] = l;
	this.lines[3] = Utils.getLinePoints(l1.right);
	this.lines[4] = Utils.getLinePoints(l2.right);



	// this._vAxis.render();
	// this._vDotPlane.render();
	this.fboRender.bind();
	GL.clear(0, 0, 0, 0);
	this._vSphere.render(vec3.clone(this.point));
	// this._vDot.render(vec3.clone(this.point));
	gl.disable(gl.CULL_FACE);
	for(var i=0; i<this.lines.length; i++) {
		var line = this.lines[i];
		this._vRibbon.render(line);	
	}
	this.fboRender.unbind();


	gl.enable(gl.CULL_FACE);
	GL.clear(0, 0, 0, 0);
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	// this._vCopy.render(this.fboRender.getTexture());
	this._vPost.render(this.fboRender.getTexture(), this.texture);
};

p.resize = function() {
	this.fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;