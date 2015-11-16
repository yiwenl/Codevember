// ViewCubes.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var Dot = require("./Dot");

function ViewCubes() {
	bongiovi.View.call(this, glslify("../shaders/cubes.vert"), glslify("../shaders/balls.frag"));
}

var p = ViewCubes.prototype = new bongiovi.View();
p.constructor = ViewCubes;


p._init = function() {
	gl = GL.gl;
	this._dots = [];
	for(var i=0; i<params.numBalls; i++) {
		var d = new Dot();
		this._dots.push(d);
	}

	this.mesh = bongiovi.MeshUtils.createCube(50, 50, 50, true);
};

p.render = function(texture, frequencies, exportNormal) {
	exportNormal = exportNormal === undefined ? false : exportNormal;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("exportNormal", "uniform1f", exportNormal ? 1 : 0);
	texture.bind(0);

	for(var i=0; i<this._dots.length; i++) {
		var d = this._dots[i];
		this.shader.uniform("position", "uniform3fv", d.finalPos);
		this.shader.uniform("axis", "uniform3fv", d.axis);
		this.shader.uniform("angle", "uniform1f", d.angle);
		this.shader.uniform("scale", "uniform1f", d.radius);
		this.shader.uniform("frequency", "uniform1f", frequencies ? frequencies[i*5+params.numBalls]/255 : 0);
		this.shader.uniform("normalMatrix", "uniformMatrix3fv", GL.normalMatrix)
		GL.draw(this.mesh);
	}
	
};

module.exports = ViewCubes;