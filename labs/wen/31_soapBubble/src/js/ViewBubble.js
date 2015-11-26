// ViewBubble.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBubble() {
	this.opacity = new bongiovi.EaseNumber(1, .05);
	bongiovi.View.call(this, glslify('../shaders/bubble.vert'), glslify('../shaders/bubble.frag'));
}

var p = ViewBubble.prototype = new bongiovi.View();
p.constructor = ViewBubble;


p._init = function() {
	var numSeg = params.numSeg;
	var positions = [];
	var coords = [];
	var indices = [];
	var index = 0;
	var size = this.size;

	for(var i=0; i<numSeg; i++) {
		for (var j=0; j < numSeg; j++) {

			function getPosition(i, j) {
				p = [i ,j, params.bubbleSize];
				
				return p;
			}	

			positions.push(getPosition(i, j+1));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i, j));

			coords.push([0, 0]);
			coords.push([0, 0]);
			coords.push([0, 0]);
			coords.push([0, 0]);

			indices.push(index*4+0);
			indices.push(index*4+1);
			indices.push(index*4+2);
			indices.push(index*4+0);
			indices.push(index*4+2);
			indices.push(index*4+3);

			index ++;
		};
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture, textureSurface) {
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", window.globalTime);
	this.shader.uniform("numSeg", "uniform1f", params.numSeg);
	this.shader.uniform("scale", "uniform1f", this.opacity.value);
	this.shader.uniform("release", "uniform1f", window.releaseOffset);
	this.shader.uniform("noiseOffset", "uniform1f", params.noiseOffset);
	this.shader.uniform("noiseStrength", "uniform1f", params.noiseStrength.value);
	this.shader.uniform("opacity", "uniform1f", this.opacity.value);
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("textureSurface", "uniform1i", 1);
	this.shader.uniform("normalMatrix", "uniformMatrix3fv", GL.normalMatrix);

	// console.log(params.noiseOffset, params.noiseStrength);
	texture.bind(0);
	textureSurface.bind(1);
	GL.draw(this.mesh);
};

module.exports = ViewBubble;