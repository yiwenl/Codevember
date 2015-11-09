// ViewTunnel.js

var GL = bongiovi.GL;
var glm = bongiovi.glm;
var vec3 = bongiovi.glm.vec3;
var gl;
var glslify = require("glslify");

function ViewTunnel() {

	bongiovi.View.call(this, glslify('../shaders/tunnel.vert'), glslify('../shaders/tunnel.frag'));
}

var p = ViewTunnel.prototype = new bongiovi.View();
p.constructor = ViewTunnel;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = [];

	var data = this.generateGeometry();

	this.angle = 0;

	this.mesh = new bongiovi.Mesh(data.v.length, data.i.length, gl.TRIANGLES);
	// this.mesh.init(data.v.length, data.i.length, gl.TRIANGLES);
	this.mesh.bufferVertex(data.v);
	this.mesh.bufferTexCoords(data.u);
	this.mesh.bufferIndices(data.i);
	// this.mesh.bufferData(normals, "aVertexNormal", 3);

};

p.generateGeometry = function(){

	var vertices = [];
	var indices = [];
	var uvs = [];
	var colors = [];
	var tempVertex = [];


	
	var radius = 9;
	var currentRadius = radius;
	var segments = 40;
	var spacing = 3;
	var numRings = 40;
	var index = 0;
	
	for(var ring=0; ring<numRings; ring++)
	{
		for(var segment=0; segment<segments; segment++)
		{
			var degrees = (360/segments) * segment;
			var radians = (Math.PI/180) * degrees;
			var x = Math.cos(radians) * currentRadius;
			var y = Math.sin(radians) * currentRadius;
			// var z = (ring * -spacing );
			var z = (((numRings-1) * spacing) - (ring * spacing)) * -1;

			vertices.push([x, y, z]);
			tempVertex.push(x,y,z);
			if(segment < (segments-1)/ 2)
				uvs.push([(1.0/(segments))*segment*2, (1.0/4)*ring]);
			else
				uvs.push([2.0-((1.0/(segments))*segment*2), (1.0/4)*ring]);
				
			var color = 1.0-((1.0/(numRings-1))*ring);
			colors.push([color, color, color, 1.0]);

			if(ring<numRings-1) {
				if(segment < segments-1) {
					indices.push(index, index + segments + 1, index + segments);
					indices.push(index, index+1, index + segments + 1);
				} else {
					indices.push(index, index + 1, index + segments);
					indices.push(index, index - segments + 1, index + 1);
				}
			}

			index++;
		}
		// currentRadius -= ;
	}


	return {'v':vertices, 'i':indices, 'u':uvs, 't':tempVertex};
};

p.render = function(permTexture, simplexTexture, zVal, angle) {
	
	this.shader.bind();

	// debugger;

	var nMatrix = mat4.create();
	var currentMvMatrix = GL.camera.getMatrix();

	var mvMatrix = mat4.create();
	mat4.invert(mvMatrix, currentMvMatrix);

	// var test = mat4.create();
	// var mvMatrix = this.transforms.getMvMatrix();
	// mat4.rotate(mvMatrix, window.NS.params.audioData[3]*Math.PI, [0, 0, 1]);
	mat4.translate(mvMatrix, mvMatrix, [0, 0, zVal]);

	// debugger;
	
	mat4.copy(nMatrix, mvMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);

	this.shader.uniform("uNMatrix", "uniformMatrix4fv", nMatrix);

	this.shader.uniform("time", "uniform1f", Date.now());
	this.shader.uniform("permTexture", "uniform1i", 0);
	this.shader.uniform("simplexTexture", "uniform1i", 1);
	
	this.shader.uniform("angle","uniform1f", angle);
	// this.shader.uniform("testTexture", "uniform1i", 2);

	// this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	// this.shader.uniform("opacity", "uniform1f", 1);
	// this.shader.uniform("time", "uniform1f", this.time);
	// this.shader.uniform("eye", "uniform3fv", GL.camera.position);

	permTexture.bind(0);
		
	simplexTexture.bind(1);

	GL.matrix = mvMatrix;
	GL.draw(this.mesh);
};

module.exports = ViewTunnel;