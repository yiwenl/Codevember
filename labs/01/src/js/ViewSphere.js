// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere(numSeg) {
	this._numSeg     = numSeg === undefined ? 40 : numSeg;
	this.time        = Math.random() * 0xFFF;
	this.depthOffset = 0;
	bongiovi.View.call(this, glslify("../shaders/sphere.vert"), glslify("../shaders/sphere.frag"));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl            = GL.gl;
	var positions = [];
	var coords    = [];
	var indices   = []; 
	var count     = 0;
	var num       = this._numSeg;

	for(var j=0; j<num; j++) {
		for(var i=0; i<num; i++) {
			positions.push([i, j, 0]);
			positions.push([i+1, j, 0]);
			positions.push([i+1, j+1, 0]);
			positions.push([i, j+1, 0]);


			coords.push([i/num, j/num]);
			coords.push([(i+1)/num, j/num]);
			coords.push([(i+1)/num, (j+1)/num]);
			coords.push([i/num, (j+1)/num]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;
		}
	}


	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(invert) {
	this.time += .007;
	this.depthOffset += params.movingSpeed;
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("radius", "uniform1f", params.radius);
	this.shader.uniform("numSeg", "uniform1f", this._numSeg);
	this.shader.uniform("zGap", "uniform1f", params.zGap);
	this.shader.uniform("noise", "uniform1f", params.noise);
	this.shader.uniform("depthOffset", "uniform1f", this.depthOffset);
	this.shader.uniform("noiseScale", "uniform1f", params.noiseScale);
	this.shader.uniform("normalMatrix", "uniformMatrix4fv", invert);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;