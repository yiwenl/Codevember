// ViewInitials.js

var GL = bongiovi.GL;
var glm = bongiovi.glm;
var vec3 = bongiovi.glm.vec3;
var gl;
var glslify = require("glslify");

function ViewInitials() {

	bongiovi.View.call(this, glslify('../shaders/initials.vert'), glslify('../shaders/initials.frag'));
}

var p = ViewInitials.prototype = new bongiovi.View();
p.constructor = ViewInitials;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = [];

	

	var data = this.createStraws();
	
	

	

	this.angle = 0;

	this.mesh = new bongiovi.Mesh(data.p.length, data.i.length, gl.TRIANGLES);
	// this.mesh.init(data.v.length, data.i.length, gl.TRIANGLES);
	this.mesh.bufferVertex(data.p);
	this.mesh.bufferTexCoords(data.u);
	this.mesh.bufferIndices(data.i);
	this.mesh.bufferData(data.e, "aInfluence", 3);
	this.mesh.bufferData(data.c, "aColor", 3);
	// this.mesh.bufferData(normals, "aVertexNormal", 3);

};


p.createStraws = function(){

	var size = .1;
	var nrCols = 22;
	var nrRows = 1;
	var currentZ = .4;
	// var currentY = 0;
	var currentX = - (nrCols / 2) * size;
	var detail = 10;

	var positions = [];
	var indices = [];
	var extra = [];
	var colors = [];
	var uvs = [];
	
	// var y = -1;
	var index = 0;

	var meshIndex = [];

	var indiceMult = 0;

	var currentRadius = 1;
	var radians = .5;

	var faces = 4;
	for (var i=0;i<nrRows;i++){
		for (var j=0;j<nrCols;j++){

			var leftX = currentX;
			var rightX = leftX + size;

			// radians += .1;
			var degrees = (260/nrCols) * (j);
			
			var radians = (Math.PI/180) * degrees;
			leftX = Math.cos(radians) * currentRadius;
			rightX = leftX + size;
			currentZ = Math.sin(radians) * currentRadius;

			console.log('leftx: ', leftX,' degrees: ',degrees);

			meshIndex[0] = currentX;
			meshIndex[1] = currentZ * 1.0;

			// debugger;
			
			var frontFace = this.createFrontFace(detail, indiceMult, leftX, rightX, currentZ, [1.0, 1.0 ,1.0]);
	
			for (var q=0;q<frontFace.p.length;q++){
				positions.push(frontFace.p[q].slice());
				uvs.push([0,0]);
				// positions.concat(frontFace.p[i]);
				extra.push([meshIndex[0], meshIndex[1], meshIndex[1]]);
				indiceMult++;
			}
			for (var q=0;q<frontFace.i.length;q++){
				// indices = frontFace.i[i].concat(indices);
				indices.push(frontFace.i[q]);
			}
			for (var q=0;q<frontFace.c.length;q++){
				colors.push(frontFace.c[q].slice());
			}

			var leftFace = this.createLeftFace(detail, indiceMult, leftX, currentZ, currentZ-size, [199/255, 230/255 ,197/255]);

			for (var q=0;q<leftFace.p.length;q++){
				positions.push(leftFace.p[q].slice());
				uvs.push([0,0]);
				// positions.concat(frontFace.p[i]);
				extra.push([meshIndex[0], meshIndex[1], meshIndex[1]]);
				indiceMult++;
			}
			for (var q=0;q<leftFace.i.length;q++){
				// indices = frontFace.i[i].concat(indices);
				indices.push(leftFace.i[q]);
			}
			for (var q=0;q<leftFace.c.length;q++){
				colors.push(leftFace.c[q].slice());
			}

			var face = this.createFrontFace(detail, indiceMult, rightX, leftX, currentZ-size, [1.0, 1.0 ,1.0]);

			for (var q=0;q<face.p.length;q++){
				positions.push(face.p[q].slice());
				uvs.push([0,0]);
				// positions.concat(frontFace.p[i]);
				extra.push([meshIndex[0], meshIndex[1], meshIndex[1]]);
				indiceMult++;
			}
			for (var q=0;q<face.i.length;q++){
				// indices = frontFace.i[i].concat(indices);
				indices.push(face.i[q]);
			}
			for (var q=0;q<face.c.length;q++){
				colors.push(face.c[q].slice());
			}

			var face = this.createLeftFace(detail, indiceMult, rightX, currentZ-size, currentZ, [199/255, 230/255 ,197/255]);

			for (var q=0;q<face.p.length;q++){
				positions.push(face.p[q].slice());
				uvs.push([0,0]);
				// positions.concat(frontFace.p[i]);
				extra.push([meshIndex[0], meshIndex[1], meshIndex[1]]);
				indiceMult++;
			}
			for (var q=0;q<face.i.length;q++){
				// indices = frontFace.i[i].concat(indices);
				indices.push(face.i[q]);
			}
			for (var q=0;q<face.c.length;q++){
				colors.push(face.c[q].slice());
			}

			//TOPFACE
			var y = (detail-1) * size;
			positions.push([leftX, y, currentZ]);
			positions.push([rightX, y, currentZ]);
			positions.push([leftX, y, currentZ-size]);
			positions.push([rightX, y, currentZ-size]);
			uvs.push([0,0]);
			uvs.push([0,0]);
			uvs.push([0,0]);
			uvs.push([0,0]);

			indices.push(indiceMult, indiceMult + 1, indiceMult+2, indiceMult+2, indiceMult+3, indiceMult+1);

			indiceMult += 4;

			colors.push([1.0, 1.0 ,1.0]);
			colors.push([1.0, 1.0 ,1.0]);
			colors.push([1.0, 1.0 ,1.0]);
			colors.push([1.0, 1.0 ,1.0]);

			extra.push([meshIndex[0], meshIndex[1], meshIndex[1]]);
			extra.push([meshIndex[0], meshIndex[1], meshIndex[1]]);
			extra.push([meshIndex[0], meshIndex[1], meshIndex[1]]);
			extra.push([meshIndex[0], meshIndex[1], meshIndex[1]]);
	

			

			
			currentX += size;
			index += detail * 4;
			// meshIndex = leftX;
		}

		currentX = -(nrCols /2 ) * size; 

		currentZ -= size;

	}

	return {p: positions, i: indices, e: extra, c: colors, u:uvs};
};

p.createFrontFace = function(detail, indiceMult, xLeft, xRight, zBase, colorFace){

	var pos = [];
	var color = [];
	var indices = [];
	var size = 0.1;
	for (var i=0;i<detail;i++){

		var y = i * size;

		pos.push([xLeft, y, zBase]);
		pos.push([xRight, y, zBase]);

		var row = i * 2;

		if (i < (detail - 1))
			indices.push(row + indiceMult, row + 1 + indiceMult, row + 2 + indiceMult,  row + 3 + indiceMult, row + 2 + indiceMult, row + 1 + indiceMult);
		
		color.push(colorFace);
		color.push(colorFace);


	}

	return {p: pos, c: color, i: indices};
};

p.createLeftFace = function(detail, indiceMult, xLeft, frontZ, behindZ, colorFace){

	var pos = [];
	var color = [];
	var indices = [];
	var size = 0.1;
	for (var i=0;i<detail;i++){

		var y = i * size;

		pos.push([xLeft, y, behindZ]);
		pos.push([xLeft, y, frontZ]);

		var row = i * 2;

		if (i < (detail - 1))
			indices.push(row + indiceMult, row + 1 + indiceMult, row + 2 + indiceMult,  row + 3 + indiceMult, row + 2 + indiceMult, row + 1 + indiceMult);
		
		color.push(colorFace);
		color.push(colorFace);


	}

	return {p: pos, c: color, i: indices};
};

p.render = function(permTexture, simplexTexture) {
	
	this.shader.bind();

	// debugger;

	var nMatrix = mat4.create();
	var currentMvMatrix = GL.camera.getMatrix();

	var mvMatrix = mat4.create();
	mat4.invert(mvMatrix, currentMvMatrix);

	// var test = mat4.create();
	// var mvMatrix = this.transforms.getMvMatrix();
	// debugger;
	mat4.rotate(mvMatrix, mvMatrix, .9 * Math.PI, [0, 0, 1]);
	
	mat4.translate(mvMatrix, mvMatrix, [0, 0, -9]);
	mat4.rotate(mvMatrix, mvMatrix, .5 * Math.PI, [1,0,0]);
	mat4.rotate(mvMatrix, mvMatrix, -.1 * Math.PI, [0,1,0]);

	// debugger;
	
	mat4.copy(nMatrix, mvMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);

	this.shader.uniform("uNMatrix", "uniformMatrix4fv", nMatrix);

	this.shader.uniform("permTexture", "uniform1i", 0);
	this.shader.uniform("simplexTexture", "uniform1i", 1);

	this.shader.uniform("time", "uniform1f", this.angle += 0.002 );


	permTexture.bind(0);
		
	simplexTexture.bind(1);

	GL.matrix = mvMatrix;
	GL.draw(this.mesh);
};

module.exports = ViewInitials;