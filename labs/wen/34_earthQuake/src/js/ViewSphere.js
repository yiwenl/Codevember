var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere() {
	bongiovi.View.call(this, glslify("../shaders/sphere.vert"));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var num = 50;
	var half = num/2;
	var count = 0;

	for(var j=0; j<half; j++) {
		for(var i=0; i<num; i++) {
			positions.push([i, j, num]);
			positions.push([i+1, j, num]);
			positions.push([i+1, j+1, num]);
			positions.push([i, j+1, num]);

			coords.push([i/num, j/half]);
			coords.push([(i+1)/num, j/half]);
			coords.push([(i+1)/num, (j+1)/half]);
			coords.push([i/num, (j+1)/half]);

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

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("offset", "uniform1f", params.offset.value);
	this.shader.uniform("size", "uniform1f", params.sphereSize);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;