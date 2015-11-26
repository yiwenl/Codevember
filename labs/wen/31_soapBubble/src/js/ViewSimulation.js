// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	bongiovi.View.call(this, null, glslify("../shaders/sim.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", window.globalTime);
	this.shader.uniform("bubbleSize", "uniform1f", params.bubbleSize);
	this.shader.uniform("release", "uniform1f", window.releaseOffset || 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewSimulation;