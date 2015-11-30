// ViewBallon.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBalloon() {
	this.x = 10;
	this.y = -30;
	this.z = 10;
	this.count = 0.1;
	this.opacity = new bongiovi.EaseNumber(1, .4);
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

p.render = function(texture, pos, color) {
	if(!this.mesh) return;

	this.x = 10 + Math.sin(this.count) * 5.0;
	this.y = -30 + Math.sin(this.count*1.23847) * Math.cos(this.count*.8748563) * 10.0;
	this.z = 10 + Math.cos(this.count*1.328476) * 5.0;

	this.count +=.01;

	this.shader.bind();
	this.shader.uniform("scale", "uniform1f", .5);
	this.shader.uniform("opacity", "uniform1f", this.opacity.value);
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("position", "uniform3fv", pos || [this.x, this.y, this.z]);
	var g = .7;
	this.shader.uniform("color", "uniform3fv", color || [g, g, g]);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewBalloon;