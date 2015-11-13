// ViewBezier.js

var GL = bongiovi.GL;
var glm = bongiovi.glm;
var vec3 = bongiovi.glm.vec3;
var gl;
var glslify = require("glslify");

function ViewBezier() {

	bongiovi.View.call(this, glslify('../shaders/bezier.vert'), glslify('../shaders/bezier.frag'));
}

var p = ViewBezier.prototype = new bongiovi.View();
p.constructor = ViewBezier;


var grad3 = [[0,1,1],[0,1,-1],[0,-1,1],[0,-1,-1],
               [1,0,1],[1,0,-1],[-1,0,1],[-1,0,-1],
               [1,1,0],[1,-1,0],[-1,1,0],[-1,-1,0], // 12 cube edges
               [1,0,-1],[-1,0,-1],[0,-1,1],[0,1,1]]; // 4 more to make 16

var perm = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

var simplex4 = [
  [0,64,128,192],[0,64,192,128],[0,0,0,0],[0,128,192,64],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[64,128,192,0],
  [0,128,64,192],[0,0,0,0],[0,192,64,128],[0,192,128,64],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[64,192,128,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [64,128,0,192],[0,0,0,0],[64,192,0,128],[0,0,0,0],
  [0,0,0,0],[0,0,0,0],[128,192,0,64],[128,192,64,0],
  [64,0,128,192],[64,0,192,128],[0,0,0,0],[0,0,0,0],
  [0,0,0,0],[128,0,192,64],[0,0,0,0],[128,64,192,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [128,0,64,192],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [192,0,64,128],[192,0,128,64],[0,0,0,0],[192,64,128,0],
  [128,64,0,192],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [192,64,0,128],[0,0,0,0],[192,128,0,64],[192,128,64,0]
];


p._init = function() {
	gl = GL.gl;
	
	

	this._controlValsTexture = this.createControlValsTexture();
	this.createNoiseTexture();

	this._angle = 0;

	var positions = [];
	var coords = [];
	var indices = [];


	var detail = window.NS.params.detail;

	var totalDetail = detail * detail;

	for (var i=0;i<totalDetail;i++){
		positions.push([0,0,0]);
		// indices.push(i);

		var tx = i % detail;
		var ty = Math.floor(i/detail);
		var ux = (tx / detail);
		var uy = (ty / detail);

		coords.push([ux, uy]);

		// console.log('ux : ',ux , ' uy : ',uy);
	}

	var rowLength = detail - 1;
	var colLength = detail - 1;

	var gridDetail = rowLength * colLength * 2 / 2;

	var pointsInRow = 1 * rowLength;

	var rowCount = 1;
	var colCount = 0;

	for (var i=0;i<gridDetail;i++){

		if (i > 0){
			if (i % pointsInRow == 0){

				// debugger;
				rowCount++;
				colCount = 0;

				
			}
		}
		
		// var isEqual = i % 2 == 0 ? true : false;

		var innerIdx = 0;
		
		var rowAdd = detail * (rowCount - 1);

		var leftTopVal = innerIdx + colCount + rowAdd;
		var leftBottomVal = leftTopVal + detail;
		var rightTopVal = leftTopVal + 1;
		var rightBottomVal = leftBottomVal + 1;

		indices.push(leftTopVal, leftBottomVal, rightTopVal);

		indices.push(leftBottomVal, rightBottomVal, rightTopVal);

		colCount++;

	}


	positions = [];
	coords = [];
	indices = [0, 1, 2, 0, 2, 3];

	var size = .2;
	positions.push([-size, -size, 0]);
	positions.push([ size, -size, 0]);
	positions.push([ size,  size, 0]);
	positions.push([-size,  size, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);


	this.mesh = new bongiovi.Mesh(positions.length, indices.length, gl.TRIANGLES);
	// this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);

};

p.createNoiseTexture = function(){

	// PERM TEXTURE
	var pixels = new Uint8Array(256 * 256 * 4);
	
	var permTexture = gl.createTexture(); // Generate a unique texture ID
	gl.bindTexture(gl.TEXTURE_2D, permTexture); // Bind the texture to texture unit 0

	// pixels = (char*)malloc( 256*256*4 );
	for(var i = 0; i<256; i++){
		for(var j = 0; j<256; j++) {
		  var offset = (i*256+j)*4;
		  var value = perm[(j+perm[i]) & 0xFF];
		  pixels[offset] = grad3[value & 0x0F][0] * 64 + 64;   // Gradient x
		  pixels[offset+1] = grad3[value & 0x0F][1] * 64 + 64; // Gradient y
		  pixels[offset+2] = grad3[value & 0x0F][2] * 64 + 64; // Gradient z
		  pixels[offset+3] = value;                     // Permuted index
		}
	}
	
	// GLFW texture loading functions won't work here - we need GL_NEAREST lookup.
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

	this._permTexture = new bongiovi.GLTexture(permTexture, true);
	


	var test = new Uint8Array(64 * 1 * 4);
	// debugger;

	var index = 0;
	for (var i=0;i<simplex4.length;i++){
		for (var j=0;j<simplex4[i].length;j++){

			test[index] = simplex4[i][j];

			index++;
		}
	}


	// SIMPLEX TEXTURE
	// gl.activeTexture(gl.TEXTURE1); // Activate a different texture unit (unit 1)

	var simplexTexture = gl.createTexture(); // Generate a unique texture ID
	gl.bindTexture(gl.TEXTURE_2D, simplexTexture); // Bind the texture to texture unit 1

	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 64, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, test );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

	this._simplexTexture = new bongiovi.GLTexture(simplexTexture, true);
};

p.createControlValsTexture = function(){

	var detail = window.NS.params.detail;

	var change = 1.0 / detail;

	var colors = [];

	var a = 1.0;
	var c = 1.0;
	for (var i=0;i<detail;i++){


		for (var j=0;j<detail;j++){

			c -= change;

			colors.push([Math.floor(a * 255), Math.floor(c * 255), 0.0, 1.0]);
			
		}

		a -= change;
		c = 1.0;
	}

	var controlValsHolder = new Uint8Array(detail * detail * 4);
	// debugger;

	var index = 0;
	for (var i=0;i<colors.length;i++){
		for (var j=0;j<colors[i].length;j++){

			controlValsHolder[index] = colors[i][j];

			index++;
		}
	}


	texture = gl.createTexture(); // Generate a unique texture ID
	gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture to texture unit 1

	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, detail, detail, 0, gl.RGBA, gl.UNSIGNED_BYTE, controlValsHolder );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

	var textureObj = new bongiovi.GLTexture(texture, true); 
	
	return textureObj;
};

p.render = function() {

	
	
	this.shader.bind();

	// debugger;

	var nMatrix = mat4.create();
	var currentMvMatrix = GL.camera.getMatrix();

	var mvMatrix = mat4.create();
	// mat4.invert(mvMatrix, currentMvMatrix);

	// var test = mat4.create();
	// var mvMatrix = this.transforms.getMvMatrix();
	// debugger;
	// mat4.rotate(mvMatrix, mvMatrix, .9 * Math.PI, [0, 0, 1]);
	
	
	// mat4.rotate(mvMatrix, mvMatrix, .5 * Math.PI, [1,0,0]);
	// mat4.rotate(mvMatrix, mvMatrix, -.1 * Math.PI, [0,1,0]);

	// mat4.translate(mvMatrix, mvMatrix, [0,.5, -9]);

	// mat4.rotate(mvMatrix, mvMatrix, .53 * Math.PI, [1,0,0]);
	// mat4.rotate(mvMatrix, mvMatrix, .15 * Math.PI, [0,0,1]);



	// debugger;
	
	mat4.copy(nMatrix, mvMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);

    this.shader.uniform("uNMatrix", "uniformMatrix4fv", nMatrix);


	this.shader.uniform("controlValsTexture", "uniform1i", 0);
	this.shader.uniform("simplexTexture", "uniform1i", 1);
	this.shader.uniform("permTexture", "uniform1i", 2);


	this.shader.uniform("angle", "uniform1f", this._angle+=0.01);
	this.shader.uniform("time", "uniform1f", Date.now());

	// debugger;
	
	// this._controlValsTexture.bind(this.shader, 0);
	// this._simplexTexture.bind(this.shader, 1);
	// this._permTexture.bind(this.shader, 2);

				

	this._controlValsTexture.bind(0);
	this._simplexTexture.bind(1);
	this._permTexture.bind(2);

	// GL.matrix = mvMatrix;
	GL.draw(this.mesh);
};

module.exports = ViewBezier;