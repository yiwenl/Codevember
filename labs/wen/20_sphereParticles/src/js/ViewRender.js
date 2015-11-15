// ViewRender.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRender() {
	this.time = Math.random() * 0xFFF;
	bongiovi.View.call(this, glslify("../shaders/render.vert"), glslify("../shaders/render.frag"));
}

var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;


p._init = function() {
	gl = GL.gl;
	var positions    = [];
	var coords       = [];
	var extra        = [];
	var uv       	 = [];
	var indices      = []; 
	var count        = 0;
	var numParticles = params.numParticles;
	var size = 5.0;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			positions.push([-size, -size, 0]);
			positions.push([ size, -size, 0]);
			positions.push([ size,  size, 0]);
			positions.push([-size,  size, 0]);

			ux = i/numParticles - .5/numParticles;
			uy = j/numParticles - .5/numParticles;
			coords.push([ux, uy]);
			coords.push([ux, uy]);
			coords.push([ux, uy]);
			coords.push([ux, uy]);

			
			uv.push([0, 0]);
			uv.push([1, 0]);
			uv.push([1, 1]);
			uv.push([0, 1]);

			var r0 = Math.random();
			var r1 = Math.random();
			var r2 = Math.random();

			extra.push([r0, r1, r2]);
			extra.push([r0, r1, r2]);
			extra.push([r0, r1, r2]);
			extra.push([r0, r1, r2]);
			
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
	this.mesh.bufferData(uv, "aUV", 2);
	this.mesh.bufferData(extra, "aExtra", 3);
};

p.render = function(texture, textureParticle) {
	this.time += .1;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureParticle", "uniform1i", 1);
	textureParticle.bind(1);
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("sound0", "uniform1f", params.sum);
	
	GL.draw(this.mesh);
};

module.exports = ViewRender;