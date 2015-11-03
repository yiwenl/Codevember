// ViewIcoSphere.js

var GL = bongiovi.GL;
var glm = bongiovi.glm;
var vec3 = bongiovi.glm.vec3;
var gl;
var glslify = require("glslify");

var vertices = [[0,52.573111,85.065081],[0,-52.573111,85.065081],[85.065081,0,52.573111],[85.065081,0,-52.573111],[0,52.573111,-85.065081],[0,-52.573111,-85.065081],[-85.065081,0,-52.573111],[-85.065081,0,52.573111],[52.573111,85.065081,0],[-52.573111,85.065081,0],[-52.573111,-85.065081,0],[52.573111,-85.065081,0],[0,100,0],[30.901699,80.901699,50],[-30.901699,80.901699,50],[80.901699,50,30.901699],[50,30.901699,80.901699],[80.901699,50,-30.901699],[100,0,0],[30.901699,80.901699,-50],[50,30.901699,-80.901699],[-30.901699,80.901699,-50],[-80.901699,50,-30.901699],[-50,30.901699,-80.901699],[-80.901699,50,30.901699],[-100,0,0],[-50,30.901699,80.901699],[0,-100,0],[-30.901699,-80.901699,50],[30.901699,-80.901699,50],[80.901699,-50,30.901699],[50,-30.901699,80.901699],[80.901699,-50,-30.901699],[50,-30.901699,-80.901699],[30.901699,-80.901699,-50],[-30.901699,-80.901699,-50],[-50,-30.901699,-80.901699],[-80.901699,-50,-30.901699],[-80.901699,-50,30.901699],[-50,-30.901699,80.901699],[0,0,100],[0,0,-100]];
var faces = [[15,13,10],[14,9,13],[13,15,14],[1,14,15],[14,16,9],[17,3,16],[16,14,17],[1,17,14],[16,18,9],[19,4,18],[18,16,19],[3,19,16],[18,20,9],[21,5,20],[20,18,21],[4,21,18],[20,13,9],[22,10,13],[13,20,22],[5,22,20],[24,22,5],[23,10,22],[22,24,23],[7,23,24],[26,23,7],[25,10,23],[23,26,25],[8,25,26],[25,15,10],[27,1,15],[15,25,27],[8,27,25],[30,28,12],[29,11,28],[28,30,29],[2,29,30],[32,31,3],[30,12,31],[31,32,30],[2,30,32],[31,19,3],[33,4,19],[19,31,33],[12,33,31],[33,34,4],[35,6,34],[34,33,35],[12,35,33],[35,36,6],[28,11,36],[36,35,28],[12,28,35],[36,37,6],[38,7,37],[37,36,38],[11,38,36],[38,26,7],[39,8,26],[26,38,39],[11,39,38],[39,40,8],[29,2,40],[40,39,29],[11,29,39],[41,40,2],[27,8,40],[40,41,27],[1,27,41],[17,32,3],[41,2,32],[32,17,41],[1,41,17],[21,42,5],[34,6,42],[42,21,34],[4,34,21],[42,24,5],[37,7,24],[24,42,37],[6,37,42]];


function ViewIcoSphere() {
	this.time = 0;
	// bongiovi.View.call(this, glslify('../shaders/sphere.vert'), bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify('../shaders/sphere.vert'), glslify('../shaders/sphere.frag'));
}

var p = ViewIcoSphere.prototype = new bongiovi.View();
p.constructor = ViewIcoSphere;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var centers = [];
	var normals = [];
	var count = 0;


	function getNormal(p0, p1, p2) {
		var pp0 = vec3.clone(p0);
		var pp1 = vec3.clone(p1);
		var pp2 = vec3.clone(p2);
		var v0 = vec3.create();
		var v1 = vec3.create();
		var n = vec3.create();
		vec3.sub(v0, pp1, pp0);
		vec3.sub(v1, pp2, pp0);

		vec3.cross(n, v0, v1);
		vec3.normalize(n, n);

		return n;
	}

	function getCenter(p0, p1, p2) {
		var x = (p0[0] + p1[0] + p2[0])/3;
		var y = (p0[1] + p1[1] + p2[1])/3;
		var z = (p0[2] + p1[2] + p2[2])/3;

		return [x, y, z];
	}

	function addFace(p0, p1, p2, c) {
		// var c = getCenter(p0, p1, p2);
		var n = getNormal(p0, p1, p2);

		positions.push(p0);
		positions.push(p1);
		positions.push(p2);

		centers.push(c);
		centers.push(c);
		centers.push(c);

		normals.push(n);
		normals.push(n);
		normals.push(n);

		coords.push([0, 0]);
		coords.push([0, 0]);
		coords.push([0, 0]);

		indices.push(count*3);
		indices.push(count*3+1);
		indices.push(count*3+2);

		count ++;
	}


	function addPyramid(p0, p1, p2) {
		var c = getCenter(p0, p1, p2);

		addFace(p0, p1, p2, c);
		addFace([0, 0, 0], p1, p0, c);
		addFace([0, 0, 0], p2, p1, c);
		addFace([0, 0, 0], p0, p2, c);
	}

	for(var i=0; i<faces.length; i++) {
		var f = faces[i];
		var i0 = f[0]-1;
		var i1 = f[1]-1;
		var i2 = f[2]-1;

		var p0 = vertices[i0];
		var p1 = vertices[i1];
		var p2 = vertices[i2];

		addPyramid(p0, p1, p2);
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(centers, 'aCenter', 3);
	this.mesh.bufferData(normals, 'aNormal', 3);
};

p.render = function() {
	this.time += .01;
	this.shader.bind();

	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	this.shader.uniform("time", "uniform1f", this.time);
	GL.draw(this.mesh);
};

module.exports = ViewIcoSphere;