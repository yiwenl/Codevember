// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere() {
	var fs = glslify('../shaders/sphere.frag')
	fs = fs.replace('{{NUM_PARTICLES}}', Math.floor(params.numParticles));
	
	bongiovi.View.call(this, glslify('../shaders/sphere.vert'), fs);
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = bongiovi.MeshUtils.createSphere(params.sphereSize, 36);
};

p.render = function(particles, texture) {
	var pos = [];
	var color = [];
	for(var i=0; i<particles.length; i++) {
		var p = particles[i];
		pos.push(p.position[0]);
		pos.push(p.position[1]);
		pos.push(p.position[2]);
		color.push(p.color[0]);
		color.push(p.color[1]);
		color.push(p.color[2]);
	}

	this.shader.bind();
	this.shader.uniform("eye", "uniform3fv", GL.camera.position);
	this.shader.uniform("colors", "uniform3fv", color);
	this.shader.uniform("particles", "uniform3fv", pos);
	this.shader.uniform("opacity", "uniform1f", 1);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;