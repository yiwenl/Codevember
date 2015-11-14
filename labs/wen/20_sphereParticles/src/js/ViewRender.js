// ViewRender.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRender() {
	bongiovi.View.call(this, glslify("../shaders/render.vert"), glslify("../shaders/render.frag"));
}

var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;


p._init = function() {
	gl = GL.gl;
	var positions    = [];
	var coords       = [];
	var indices      = []; 
	var count        = 0;
	var numParticles = params.numParticles;
	var size = 2.0;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			positions.push([-size, -size, params.sphereSize*0]);
			positions.push([ size, -size, params.sphereSize*0]);
			positions.push([ size,  size, params.sphereSize*0]);
			positions.push([-size,  size, params.sphereSize*0]);

			ux = i/numParticles - .5/numParticles;
			uy = j/numParticles - .5/numParticles;
			coords.push([ux, uy]);
			coords.push([ux, uy]);
			coords.push([ux, uy]);
			coords.push([ux, uy]);
			
			indices.push(count*4+0);
			indices.push(count*4+1);
			indices.push(count*4+2);
			indices.push(count*4+0);
			indices.push(count*4+2);
			indices.push(count*4+3);

			count ++;

		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture) {

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewRender;