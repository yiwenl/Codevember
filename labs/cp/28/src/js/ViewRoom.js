//ViewRoom.js

var View = require('./framework/View');
var Mesh = require('./framework/Mesh');
var Texture = require('./framework/Texture');
// var webglUtils = require('../libs/webgl-utils');

function ViewRoom(){};

var p = ViewRoom.prototype = new View();
var s = View.prototype;

var gl = null;

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

var calculateNormals = function(vs, ind){
    var x=0; 
    var y=1;
    var z=2;
    
    var ns = [];
    for(var i=0;i<vs.length;i++){ //for each vertex, initialize normal x, normal y, normal z
        ns[i]=0.0;
    }
    
    for(var i=0;i<ind.length;i=i+3){ //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
        var v1 = [];
        var v2 = [];
        var normal = [];
        //p1 - p0
         v1[x] = vs[3*ind[i+1]+x] - vs[3*ind[i]+x];
         v1[y] = vs[3*ind[i+1]+y] - vs[3*ind[i]+y];
         v1[z] = vs[3*ind[i+1]+z] - vs[3*ind[i]+z];
       // p0 - p1
         v2[x] = vs[3*ind[i+2]+x] - vs[3*ind[i+1]+x];
         v2[y] = vs[3*ind[i+2]+y] - vs[3*ind[i+1]+y];
         v2[z] = vs[3*ind[i+2]+z] - vs[3*ind[i+1]+z];            
        //p2 - p1
        // v1[x] = vs[3*ind[i+2]+x] - vs[3*ind[i+1]+x];
        // v1[y] = vs[3*ind[i+2]+y] - vs[3*ind[i+1]+y];
        // v1[z] = vs[3*ind[i+2]+z] - vs[3*ind[i+1]+z];
       // p0 - p1
        // v2[x] = vs[3*ind[i]+x] - vs[3*ind[i+1]+x];
        // v2[y] = vs[3*ind[i]+y] - vs[3*ind[i+1]+y];
        // v2[z] = vs[3*ind[i]+z] - vs[3*ind[i+1]+z];
        //cross product by Sarrus Rule
        normal[x] = v1[y]*v2[z] - v1[z]*v2[y];
        normal[y] = v1[z]*v2[x] - v1[x]*v2[z];
        normal[z] = v1[x]*v2[y] - v1[y]*v2[x];
        
        // ns[3*ind[i]+x] += normal[x];
        // ns[3*ind[i]+y] += normal[y];
        // ns[3*ind[i]+z] += normal[z];
         for(var j=0;j<3;j++){ //update the normals of that triangle: sum of vectors
            ns[3*ind[i+j]+x] =  ns[3*ind[i+j]+x] + normal[x];
             ns[3*ind[i+j]+y] =  ns[3*ind[i+j]+y] + normal[y];
             ns[3*ind[i+j]+z] =  ns[3*ind[i+j]+z] + normal[z];
         }
    }
    //normalize the result
    for(var i=0;i<vs.length;i=i+3){ //the increment here is because each vertex occurs with an offset of 3 in the array (due to x, y, z contiguous values)
    
        var nn=[];
        nn[x] = ns[i+x];
        nn[y] = ns[i+y];
        nn[z] = ns[i+z];
        
        var len = Math.sqrt((nn[x]*nn[x])+(nn[y]*nn[y])+(nn[z]*nn[z]));
        if (len == 0) len = 0.00001;
        
        nn[x] = nn[x]/len;
        nn[y] = nn[y]/len;
        nn[z] = nn[z]/len;
        
        ns[i+x] = nn[x];
        ns[i+y] = nn[y];
        ns[i+z] = nn[z];
    }
    
    return ns;
}

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	var positions = [];
	var coords = [];
	var indices = [];
	var colors = [];

	var width = 30;
	var height = 13;
	var depth = 30;

	var detail = 10;

	var fragment = width / detail;

	this._angle = 0;
	var counter = 0;

	var currentX = - (width/2);

	// for (var i=0;i<detail;i++){
	// 	//FRONTWALL

	// 	// console.log(currentX);
		
	// 	positions.push([currentX, -height, 0]);
	// 	positions.push([currentX, height, 0]);
	// 	positions.push([currentX+fragment, height, 0]);

	// 	positions.push([currentX+fragment, -height, 0]);
	// 	positions.push([currentX+fragment, height, 0]);
	// 	positions.push([currentX, -height, 0]);

	// 	currentX += fragment;

	positions.push([-width, -height, depth]);
	positions.push([-width, height, depth]);
	positions.push([width, height, depth]);

	positions.push([width, -height, depth]);
	positions.push([width, height, depth]);
	positions.push([-width, -height, depth]);

	for (var i=0;i<6;i++){
		colors.push([0.1, 0.5, 0.5]);
	}

	// debugger;


	indices.push(0, 1, 2, 3, 4, 5);

		// counter += 6;
	// }		
	

	//LEFT SIDEWALL
	positions.push([-width, -height, depth]);
	positions.push([-width, height, depth]);
	positions.push([-width, height, -depth]);

	positions.push([-width, -height, -depth]);
	positions.push([-width, height, -depth]);
	positions.push([-width, -height, depth]);

	for (var i=0;i<6;i++){
		colors.push([0.9, 0.5, 0.5]);
	}

	indices.push(6, 7, 8, 9, 10, 11);

	//RIGHT SIDEWALL
	positions.push([width, -height, depth]);
	positions.push([width, height, depth]);
	positions.push([width, height, -depth]);

	positions.push([width, -height, -depth]);
	positions.push([width, height, -depth]);
	positions.push([width, -height, depth]);

	for (var i=0;i<6;i++){
		colors.push([0.5, 0.9, 0.5]);
	}

	indices.push(12, 13, 14, 15, 16, 17);

	//BACKWALL
	positions.push([-width, -height, -depth]);
	positions.push([-width, height, -depth]);
	positions.push([width, height, -depth]);

	positions.push([width, -height, -depth]);
	positions.push([width, height, -depth]);
	positions.push([-width, -height, -depth]);

	for (var i=0;i<6;i++){
		colors.push([0.5, 0.5, 0.9]);
	}

	indices.push(18, 19, 20, 21, 22, 23);

	var vertices = [];
	for(var i=0; i<positions.length; i++) {
		for(var j=0; j<positions[i].length; j++) vertices.push(positions[i][j]);
	}

	var normals = calculateNormals(vertices, indices);

	// debugger;

	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	// this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(colors, "aVertexColor", 3, false);
	this.mesh.bufferData(normals, "aVertexNormal", 3, true);

	this.createNoiseTexture();

};

p.createNoiseTexture = function(){

	// PERM TEXTURE
	var pixels = new Uint8Array(256 * 256 * 4);
	
	permTexture = gl.createTexture(); // Generate a unique texture ID
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

	this._permTexture = new Texture();
	this._permTexture.init(permTexture, true);



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

	simplexTexture = gl.createTexture(); // Generate a unique texture ID
	gl.bindTexture(gl.TEXTURE_2D, simplexTexture); // Bind the texture to texture unit 1

	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 64, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, test );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

	this._simplexTexture = new Texture();
	this._simplexTexture.init(simplexTexture, true);
};



p.render = function() {

	this.transforms.calculateModelView();

	var mvMatrix = this.transforms.getMvMatrix();

	var nMatrix = mat3.create();
	mat3.fromMat4(nMatrix, mvMatrix);
	mat3.invert(nMatrix, nMatrix);
	mat3.transpose(nMatrix, nMatrix);

	// var nMatrix = mat4.clone(mvMatrix);
	
	// mat4.invert(nMatrix, nMatrix);
//       mat4.transpose(nMatrix, nMatrix);

	this.transforms.push();

	// mat4.rotate(mvMatrix, -.4*Math.PI, [1, 0, 0]);
    // mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
    // mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
	// return;
	this.shader.bind();


	this.shader.uniform("simplexTexture", "uniform1i", 0);
	this.shader.uniform("permTexture", "uniform1i", 1);

	this.shader.uniform("uNMatrix", "uniformMatrix3fv", nMatrix);

	this.shader.uniform("angle", "uniform1f", this._angle += .001);
	
	this.shader.uniform("uAmbientColor", "uniform3fv", new Float32Array([0.8, 0.8, 0.8]));
	this.shader.uniform("uPointLightingLocation", "uniform3fv", new Float32Array([0, 10000000, 0.0]));
	this.shader.uniform("uPointLightingColor", "uniform3fv", new Float32Array([0.2, 0.2, 0.2]));
	// this.shader.uniform("uUseLighting", "");
	// this.shader.uniform("uPosition", "uniform4fv",new Float32Array([-20, -2000.0, 1000000000, 1]));
	// this.shader.uniform("uIntensities", "uniform3fv", new Float32Array([1,1,1]));
	// this.shader.uniform("uAttenuation", "uniform1f", 0.1);
	// this.shader.uniform("uAmbientCoefficient", "uniform1f", 0.6);
	// this.shader.uniform("uConeAngle", "uniform1f", 40.0);
	// this.shader.uniform("uConeDirection", "uniform3fv", new Float32Array([0,0,-1]));

	// this.shader.uniform("uCameraPosition", "uniform3fv", new Float32Array(this.transforms._camera.getPosition()));

	// this.shader.uniform("materialShininess", "uniform1f", 10.0);
	// this.shader.uniform("materialSpecularColor", "uniform3fv", new Float32Array([1,1,1]));
	// this.shader.uniform("texture", "uniform1i", 0);
	// this.shader.uniform("textureParticle", "uniform1i", 1);
	// texturePos.bind(this.shader, 0);
	// texture.bind(1);

	this._simplexTexture.bind(this.shader, 0);
	this._permTexture.bind(this.shader, 1);

	this.draw(this.mesh);

	
	this.transforms.pop();
};

module.exports = ViewRoom;