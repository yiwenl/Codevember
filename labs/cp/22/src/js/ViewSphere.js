//ViewSphere.js

var View = require('./framework/View');
var Mesh = require('./framework/Mesh');

function ViewSphere(){};

var p = ViewSphere.prototype = new View();
var s = View.prototype;

var gl = null;

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	var positions = [];
	var coords = [];
	var indices = [];
	var normals = [];

	var latitudeBands = 30;
    var longitudeBands = 30;
    var radius = .3;

	for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            // normalData.push(x);
            // normalData.push(y);
            // normalData.push(z);

            normals.push([x,y,z]);

            coords.push([u-.2,v]);

            positions.push([radius * x, radius * y, radius * z]);

            // textureCoordData.push(u);
            // textureCoordData.push(v);
            // vertexPositionData.push(radius * x);
            // vertexPositionData.push(radius * y);
            // vertexPositionData.push(radius * z);
        }
    }

    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;

            indices.push(first, second, first+1, second, second + 1, first + 1);
            // indexData.push(first);
            // indexData.push(second);
            // indexData.push(first + 1);

            // indexData.push(second);
            // indexData.push(second + 1);
            // indexData.push(first + 1);
        }
    }

	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);

	// positions = [];
	// coords = [];
	// indices = [0, 1, 2, 0, 2, 3];

	// var size = .2;
	// positions.push([-size, -size, 0]);
	// positions.push([ size, -size, 0]);
	// positions.push([ size,  size, 0]);
	// positions.push([-size,  size, 0]);

	// coords.push([0, 0]);
	// coords.push([1, 0]);
	// coords.push([1, 1]);
	// coords.push([0, 1]);

	// this.mesh = new Mesh();
	// this.mesh.init(4, 6, gl.TRIANGLES);
	// this.mesh.bufferVertex(positions);
	// this.mesh.bufferTexCoords(coords);
	// this.mesh.bufferIndices(indices);

};

p.render = function(reflTexture) {

	this.transforms.calculateModelView();

	var mvMatrix = this.transforms.getMvMatrix();

	// mat4.rotate(mvMatrix, mvMatrix, .5*Math.PI, [0, 1, 0]);
    // mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
    mat4.translate(mvMatrix, mvMatrix, [.25, .2, 4]);
	// return;
	this.shader.bind();
	this.shader.uniform("reflTexture", "uniform1i", 0);
	
	reflTexture.bind(this.shader, 0);
	
	this.draw(this.mesh);
};

module.exports = ViewSphere;