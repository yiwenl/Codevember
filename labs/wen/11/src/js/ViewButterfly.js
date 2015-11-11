// ViewButterfly.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewButterfly() {
	this.time = Math.random() * 0xFFF;
	bongiovi.View.call(this, glslify("../shaders/butterfly.vert"), glslify("../shaders/butterfly.frag"));
}

var p = ViewButterfly.prototype = new bongiovi.View();
p.constructor = ViewButterfly;


p._init = function() {
	gl              = GL.gl;
	var positions   = [];
	var coords      = [];
	var indices     = [];
	var normals     = [];
	
	var numSegments = 80;
	var size        = 125;
	var width       = height = size;
	var gapX        = width/numSegments;
	var gapY        = height/numSegments;
	var gapUV       = 1/numSegments;
	var index       = 0;
	var sx          = -width * 0.5;
	var sy          = -height * 0.5;

	for(var i=0; i<numSegments; i++) {
		for (var j=0; j<numSegments; j++) {
			var tx = gapX * i + sx;
			var ty = gapY * j + sy;

			positions.push([tx, 		0, 	ty+gapY	]);
			positions.push([tx+gapX, 	0, 	ty+gapY	]);
			positions.push([tx+gapX, 	0, 	ty	]);
			positions.push([tx, 		0, 	ty	]);	

			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);

			var u = i/numSegments;
			var v = j/numSegments;
			coords.push([u, v+gapUV]);
			coords.push([u+gapUV, v+gapUV]);
			coords.push([u+gapUV, v]);
			coords.push([u, v]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
			//*/
			positions.push([tx, 		0, 	ty+gapY	]);
			positions.push([tx+gapX, 	0, 	ty+gapY	]);
			positions.push([tx+gapX, 	0, 	ty	]);
			positions.push([tx, 		0, 	ty	]);	

			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);

			coords.push([u, v+gapUV]);
			coords.push([u+gapUV, v+gapUV]);
			coords.push([u+gapUV, v]);
			coords.push([u, v]);

			indices.push(index*4 + 3);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 1);
			indices.push(index*4 + 0);

			index++;
			//*/
		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(normals, "aNormal", 3);
};

p.render = function(texture) {
	this.time += .1;
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("camera", "uniform3fv", GL.camera.position);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewButterfly;