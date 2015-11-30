// ViewBallon.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBalloon() {
	this.x = 10;
	this.y = -30;
	this.z =  10;
	bongiovi.View.call(this, glslify('../shaders/ballon.vert'), glslify('../shaders/ballon.frag'));
}

var p = ViewBalloon.prototype = new bongiovi.View();
p.constructor = ViewBalloon;


p._init = function() {
	gl = GL.gl;

	this.loader = new bongiovi.ObjLoader();
	this.loader.load('assets/ballon1.obj', this._onObjLoaded.bind(this), null, true);
};


p._onObjLoaded = function(mesh, o) {
	this.mesh = mesh;
};

p.render = function(texture) {
	if(!this.mesh) return;
	this.shader.bind();
	this.shader.uniform("scale", "uniform1f", .5);
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("position", "uniform3fv", [this.x, this.y, this.z]);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewBalloon;