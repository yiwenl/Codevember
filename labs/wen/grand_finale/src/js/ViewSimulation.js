// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	this._count = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify("../shaders/sim.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, isAnimating) {
	isAnimating = isAnimating == undefined ? false : isAnimating;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("floorY", "uniform1f", params.floorY);
	this.shader.uniform("isAnimating", "uniform1f", isAnimating ? 1.0 : 0.0);
	texture.bind(0);
	GL.draw(this.mesh);

	this._count += .01;
};

module.exports = ViewSimulation;