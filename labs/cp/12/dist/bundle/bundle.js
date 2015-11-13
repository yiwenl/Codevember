(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//SceneMain.js

var ViewBezier = require('./ViewBezier');
var Scene = require('./framework/Scene');
var CameraInteractor = require('./framework/CameraInteractor');


mat4.multiplyVec4=function(a,b,c){
			c||(c=b);
			var d=b[0],e=b[1],g=b[2],b=b[3];
			c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;
			c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;
			c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;
			c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;
			return c
		};

var random = function(min, max) { return min + Math.random() * (max - min); }

function SceneMain(){};

var p = SceneMain.prototype = new Scene();
var s = Scene.prototype;

var gl = null;

p.init = function(){

	s.init.call(this);

	gl = window.NS.GL.glContext;

	var derivative = gl.getExtension('OES_standard_derivatives');
	
	// gl.disable(gl.DEPTH_TEST);

	var cameraInteractor = new CameraInteractor();
	cameraInteractor.init(this.camera, this.canvas);
	
	// this._initTextures();
	this._initViews();

};

p._initTextures = function() {
	console.log( "Init Texture" );


	
};

p._initViews = function() {
	console.log( "Init Views" );

	this._vBezier = new ViewBezier();
	this._vBezier.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nuniform sampler2D controlValsTexture;\nuniform sampler2D simplexTexture;\nuniform sampler2D permTexture;\nuniform float angle;\nuniform float time;\n\n//control points\nvec3 pointA = vec3( 0.0, 1.5, 0.5 );\nvec3 pointB = vec3( 0.33, 1.5, 0.5 );\nvec3 pointC = vec3( 0.66, 1.5, 0.5 );\nvec3 pointD = vec3( 1.5, 1.5, 0.5 );\n\nvec3 pointE = vec3( 0.0, 0.66, 0.5 );\nvec3 pointF = vec3( 0.33, 0.66, 0.5 );\nvec3 pointG = vec3( 0.66, 0.66, 0.5 );\nvec3 pointH = vec3( 1.5, 0.66, 0.5 );\n\nvec3 pointI = vec3( 0.0, 0.33, 0.5 );\nvec3 pointJ = vec3( 0.33, 0.33, 0.5 );\nvec3 pointK = vec3( 0.66, 0.33, 0.5 );\nvec3 pointL = vec3( 1.5, 0.33, 0.5 );\n\nvec3 pointM = vec3( 0.0, 0.0, 0.5 );\nvec3 pointN = vec3( 0.33, 0.0, 0.5 );\nvec3 pointO = vec3( 0.66, 0.0, 0.5 );\nvec3 pointP = vec3( 1.5, 0.0, 0.5 );\n\n\n// #define  PI  3.14;\n\nvarying vec3 vViewPosition;\n\n\nvarying vec2 vTextureCoord;\n\n\nfloat calcPointX(float a, float c){\n\n  float n = 3.0;\n  float b = 1.0 - a;\n  float d = 1.0 - c;\n\n\n\n  float aVal = pointA[0] * pow(a, n) * pow(c, n);\n  \n  float bVal = pointB[0] * n * pow(a, n) * pow(c, n-1.0) * d;\n\n  float cVal = pointC[0] * n * pow(a, n) * c * pow(d, n-1.0);\n\n  float dVal = pointD[0] * pow(a, n) * pow(d, n);\n\n  \n  float eVal = pointE[0] * n * pow(a, n-1.0) * b * pow(c, n);\n\n  float fVal = pointF[0] * 9.0 * pow(a, n-1.0) * b * pow(c, n-1.0) * d;\n\n  float gVal = pointG[0] * 9.0 * pow(a, n-1.0) * b * c * pow(d, n-1.0);\n\n  float hVal = pointH[0] * n * pow(a, n-1.0) * b * pow(d, n);\n\n  \n  float iVal = pointI[0] * n * a * pow(b, n-1.0) * pow(c, n);\n\n  float jVal = pointJ[0] * 9.0 * a * pow(b, n-1.0) * pow(c, n-1.0) * d;\n\n  float kVal = pointK[0] * 9.0 * a * pow(b, n-1.0) * c * pow(d, n-1.0);\n\n  float lVal = pointL[0] * n * a * pow(b, n-1.0) * pow(d, n);\n\n  \n  float mVal = pointM[0] * pow(b, n) * pow(c, n);\n\n  float nVal = pointN[0] * n * pow(b, n) * pow(c, n-1.0) * d;\n\n  float oVal = pointO[0] * n * pow(b, n) * c * pow(d, n-1.0);\n\n  float pVal = pointP[0] * pow(b, n) * pow(d, n);\n\n  return aVal + bVal + cVal + dVal + eVal + fVal + gVal + hVal + iVal + jVal + kVal + lVal + mVal + nVal + oVal + pVal;\n\n}\n\nfloat calcPointY(float a, float c){\n\n  float n = 3.0;\n  float b = 1.0 - a;\n  float d = 1.0 - c;\n\n\n\n  float aVal = pointA[1] * pow(a, n) * pow(c, n);\n  \n  float bVal = pointB[1] * n * pow(a, n) * pow(c, n-1.0) * d;\n\n  float cVal = pointC[1] * n * pow(a, n) * c * pow(d, n-1.0);\n\n  float dVal = pointD[1] * pow(a, n) * pow(d, n);\n\n  \n  float eVal = pointE[1] * n * pow(a, n-1.0) * b * pow(c, n);\n\n  float fVal = pointF[1] * 9.0 * pow(a, n-1.0) * b * pow(c, n-1.0) * d;\n\n  float gVal = pointG[1] * 9.0 * pow(a, n-1.0) * b * c * pow(d, n-1.0);\n\n  float hVal = pointH[1] * n * pow(a, n-1.0) * b * pow(d, n);\n\n  \n  float iVal = pointI[1] * n * a * pow(b, n-1.0) * pow(c, n);\n\n  float jVal = pointJ[1] * 9.0 * a * pow(b, n-1.0) * pow(c, n-1.0) * d;\n\n  float kVal = pointK[1] * 9.0 * a * pow(b, n-1.0) * c * pow(d, n-1.0);\n\n  float lVal = pointL[1] * n * a * pow(b, n-1.0) * pow(d, n);\n\n  \n  float mVal = pointM[1] * pow(b, n) * pow(c, n);\n\n  float nVal = pointN[1] * n * pow(b, n) * pow(c, n-1.0) * d;\n\n  float oVal = pointO[1] * n * pow(b, n) * c * pow(d, n-1.0);\n\n  float pVal = pointP[1] * pow(b, n) * pow(d, n);\n\n  return aVal + bVal + cVal + dVal + eVal + fVal + gVal + hVal + iVal + jVal + kVal + lVal + mVal + nVal + oVal + pVal;\n\n}\n\nfloat calcPointZ(float a, float c){\n\n  float n = 3.0;\n  float b = 1.0 - a;\n  float d = 1.0 - c;\n\n\n\n  float aVal = pointA[2] * pow(a, n) * pow(c, n);\n  \n  float bVal = pointB[2] * n * pow(a, n) * pow(c, n-1.0) * d;\n\n  float cVal = pointC[2] * n * pow(a, n) * c * pow(d, n-1.0);\n\n  float dVal = pointD[2] * pow(a, n) * pow(d, n);\n\n  \n  float eVal = pointE[2] * n * pow(a, n-1.0) * b * pow(c, n);\n\n  float fVal = pointF[2] * 9.0 * pow(a, n-1.0) * b * pow(c, n-1.0) * d;\n\n  float gVal = pointG[2] * 9.0 * pow(a, n-1.0) * b * c * pow(d, n-1.0);\n\n  float hVal = pointH[2] * n * pow(a, n-1.0) * b * pow(d, n);\n\n  \n  float iVal = pointI[2] * n * a * pow(b, n-1.0) * pow(c, n);\n\n  float jVal = pointJ[2] * 9.0 * a * pow(b, n-1.0) * pow(c, n-1.0) * d;\n\n  float kVal = pointK[2] * 9.0 * a * pow(b, n-1.0) * c * pow(d, n-1.0);\n\n  float lVal = pointL[2] * n * a * pow(b, n-1.0) * pow(d, n);\n\n  \n  float mVal = pointM[2] * pow(b, n) * pow(c, n);\n\n  float nVal = pointN[2] * n * pow(b, n) * pow(c, n-1.0) * d;\n\n  float oVal = pointO[2] * n * pow(b, n) * c * pow(d, n-1.0);\n\n  float pVal = pointP[2] * pow(b, n) * pow(d, n);\n\n  return aVal + bVal + cVal + dVal + eVal + fVal + gVal + hVal + iVal + jVal + kVal + lVal + mVal + nVal + oVal + pVal;\n\n}\n\n#define ONE 0.00390625\n#define ONEHALF 0.001953125\n\n/*\n * 3D simplex noise. Comparable in speed to classic noise, better looking.\n */\nfloat snoise(vec3 P){\n\n  // The skewing and unskewing factors are much simpler for the 3D case\n  #define F3 0.333333333333\n  #define G3 0.166666666667\n\n  // Skew the (x,y,z) space to determine which cell of 6 simplices we're in\n  float s = (P.x + P.y + P.z) * F3; // Factor for 3D skewing\n  vec3 Pi = floor(P + s);\n  float t = (Pi.x + Pi.y + Pi.z) * G3;\n  vec3 P0 = Pi - t; // Unskew the cell origin back to (x,y,z) space\n  Pi = Pi * ONE + ONEHALF; // Integer part, scaled and offset for texture lookup\n\n  vec3 Pf0 = P - P0;  // The x,y distances from the cell origin\n\n  // // For the 3D case, the simplex shape is a slightly irregular tetrahedron.\n  // // To find out which of the six possible tetrahedra we're in, we need to\n  // // determine the magnitude ordering of x, y and z components of Pf0.\n  // // The method below is explained briefly in the C code. It uses a small\n  // // 1D texture as a lookup table. The table is designed to work for both\n  // // 3D and 4D noise, so only 8 (only 6, actually) of the 64 indices are\n  // // used here.\n  float c1 = (Pf0.x > Pf0.y) ? 0.5078125 : 0.0078125; // 1/2 + 1/128\n  float c2 = (Pf0.x > Pf0.z) ? 0.25 : 0.0;\n  float c3 = (Pf0.y > Pf0.z) ? 0.125 : 0.0;\n  float sindex = c1 + c2 + c3;\n  vec3 offsets = texture2D(simplexTexture, vec2(sindex, 0)).rgb;\n  vec3 o1 = step(0.375, offsets);\n  vec3 o2 = step(0.125, offsets);\n\n  // Noise contribution from simplex origin\n  float perm0 = texture2D(permTexture, Pi.xy).a;\n  vec3  grad0 = texture2D(permTexture, vec2(perm0, Pi.z)).rgb * 4.0 - 1.0;\n  float t0 = 0.6 - dot(Pf0, Pf0);\n  float n0;\n  if (t0 < 0.0) n0 = 0.0;\n  else {\n    t0 *= t0;\n    n0 = t0 * t0 * dot(grad0, Pf0);\n  }\n\n  // Noise contribution from second corner\n  vec3 Pf1 = Pf0 - o1 + G3;\n  float perm1 = texture2D(permTexture, Pi.xy + o1.xy*ONE).a;\n  vec3  grad1 = texture2D(permTexture, vec2(perm1, Pi.z + o1.z*ONE)).rgb * 4.0 - 1.0;\n  float t1 = 0.6 - dot(Pf1, Pf1);\n  float n1;\n  if (t1 < 0.0) n1 = 0.0;\n  else {\n    t1 *= t1;\n    n1 = t1 * t1 * dot(grad1, Pf1);\n  }\n  \n  // Noise contribution from third corner\n  vec3 Pf2 = Pf0 - o2 + 2.0 * G3;\n  float perm2 = texture2D(permTexture, Pi.xy + o2.xy*ONE).a;\n  vec3  grad2 = texture2D(permTexture, vec2(perm2, Pi.z + o2.z*ONE)).rgb * 4.0 - 1.0;\n  float t2 = 0.6 - dot(Pf2, Pf2);\n  float n2;\n  if (t2 < 0.0) n2 = 0.0;\n  else {\n    t2 *= t2;\n    n2 = t2 * t2 * dot(grad2, Pf2);\n  }\n  \n  // Noise contribution from last corner\n  vec3 Pf3 = Pf0 - vec3(1.0-3.0*G3);\n  float perm3 = texture2D(permTexture, Pi.xy + vec2(ONE, ONE)).a;\n  vec3  grad3 = texture2D(permTexture, vec2(perm3, Pi.z + ONE)).rgb * 4.0 - 1.0;\n  float t3 = 0.6 - dot(Pf3, Pf3);\n  float n3;\n  if(t3 < 0.0) n3 = 0.0;\n  else {\n    t3 *= t3;\n    n3 = t3 * t3 * dot(grad3, Pf3);\n  }\n\n  // Sum up and scale the result to cover the range [-1,1]\n  return 32.0 * (n0 + n1 + n2 + n3);\n}\n\n\nvoid main(void) {\n\n  gl_PointSize = 1.0;\n\n  vec3 newPosition = aVertexPosition;\n\n  vec2 controlVals = texture2D(controlValsTexture, aTextureCoord).rg;\n\n  float a = controlVals.r;\n  float c = controlVals.g;\n\n\n  pointA.z += sin(angle) * 0.7;\n  pointP.z += sin(angle) * 0.7;\n  \n  pointM.z += sin(angle) * 0.2;\n\n  pointL.z += cos(angle) * 0.2;\n  pointB.z += cos(angle) * 0.2;\n\n  pointH.z += cos(angle) * 0.1;\n  pointC.z += cos(angle) * 0.1;\n\n  pointN.z += cos(angle) * 0.6;\n  pointE.z += cos(angle) * 0.6;\n  pointD.z += sin(angle) * 0.3;\n  pointI.z += sin(angle) * 0.5;\n\n\n  float vertical = sin(angle) * 0.3;\n  pointA.x += vertical;\n  pointB.x += vertical;\n  pointC.x += vertical;\n  pointD.x += vertical;\n\n  pointE.x += vertical;\n  pointF.x += vertical;\n  pointG.x += vertical;\n  pointH.x += vertical;\n\n  pointI.x += vertical;\n  pointJ.x += vertical;\n  pointK.x += vertical;\n  pointL.x += vertical;\n\n  pointM.x += vertical;\n  pointN.x += vertical;\n  pointO.x += vertical;\n  pointP.x += vertical;\n\n  // float horizontal = sin(angle) * 0.3;\n  pointA.y += vertical;\n  pointB.y += vertical;\n  pointC.y += vertical;\n  pointD.y += vertical;\n\n  pointE.y += vertical;\n  pointF.y += vertical;\n  pointG.y += vertical;\n  pointH.y += vertical;\n\n  pointI.y += vertical;\n  pointJ.y += vertical;\n  pointK.y += vertical;\n  pointL.y += vertical;\n\n  pointM.y += vertical;\n  pointN.y += vertical;\n  pointO.y += vertical;\n  pointP.y += vertical;\n\n  pointD.z += cos(angle) * 0.011;\n\n  pointK.z += sin(angle) * 0.5;\n\n  float x = calcPointX(a, c);\n  float y = calcPointY(a, c);\n  float z = calcPointZ(a, c);\n\n  float range = 2.0;\n\n  newPosition.x = x * range - 1.0;\n  newPosition.y = y * range - 1.0;\n  newPosition.z = z * range - 1.0;\n\n  float n = snoise(vec3(0.5 * newPosition.xyz * (2.0 + sin(0.5 * time))));\n\n  newPosition.z *= n/1.5;\n\n  vec4 mvPosition = uMVMatrix * vec4( newPosition, 1.0 );\n  vViewPosition = -mvPosition.xyz;\n\n  gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);\n  vTextureCoord = aTextureCoord;\n}", "precision highp float;\nuniform mat4 uNMatrix;\nvarying vec2 vTextureCoord;\n\nvarying vec3 vViewPosition;\n\nvoid main(void) {\n\n    #extension GL_OES_standard_derivatives : enable\n#define GLSLIFY 1\n\n\n    vec3 normal  = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));\n\n    // directional light\n\n   // directional light\n\n    const vec3 lightCol1 = vec3( 0.0, 0.0, 0.0 );\n    const vec3 lightDir1 = vec3( -1.0, 0.0, 0.0 );\n    const float intensity1 = 1.0;\n\n    vec4 lDirection1 = uNMatrix * vec4( lightDir1, 0.0 );\n    vec3 lightVec1 = normalize( lDirection1.xyz );\n\n    // point light\n\n    const vec3 lightPos2 = vec3( 0.0, 0.0, 80.0 );\n    const vec3 lightCol2 = vec3( 1.0, 0.5, 0.2 );\n    const float maxDistance2 = 200.0;\n    const float intensity2 = 1.0;\n\n    vec4 lPosition = uNMatrix * vec4( lightPos2, 1.0 );\n    vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n    vec3 lightVec2 = normalize( lVector );\n    float lDistance2 = 1.0 - min( ( length( lVector ) / maxDistance2 ), 1.0 );\n\n    // point light\n\n    const vec3 lightPos3 = vec3( 0.0, 0.0, -20.0 );\n    const vec3 lightCol3 = vec3(0.0, 1.0, 1.0 );\n    float maxDistance3 = 400.0;\n    // float maxDistance3 = audioEnergy * 40.0;\n    const float intensity3 = 1.0;\n\n    vec4 lPosition3 = uNMatrix * vec4( lightPos3, 1.0 );\n    vec3 lVector3 = lPosition3.xyz + vViewPosition.xyz;\n\n    vec3 lightVec3 = normalize( lVector3 );\n    float lDistance3 = 1.0 - min( ( length( lVector3 ) / maxDistance3 ), 1.0 );\n\n    //\n\n    float diffuse1 = intensity1 * max( dot( normal, lightVec1 ), 0.0 );\n    float diffuse2 = intensity2 * max( dot( normal, lightVec2 ), 0.0 ) * lDistance2;\n    float diffuse3 = intensity2 * max( dot( normal, lightVec3 ), 0.0 ) * lDistance3;\n\n    // vec3 color = texture2D(testTexture, vec2(vTextureCoord.s, vTextureCoord.t )).rgb;\n\n    gl_FragColor = vec4(diffuse2 * vec3(1.0, 0.5, 0.6) + diffuse3 * vec3(0.2, 1.0, .7), 1.0 );\n    // gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));\n    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}");
	this._vBezier.transforms = this.transforms;	

};


p.render = function() {

	gl.clearColor( 0, 0, 0, 1 );
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



	gl.viewport(0, 0, window.innerWidth, window.innerHeight);
	

	this.transforms.updatePerspective(this.canvas.width, this.canvas.height);
	this.transforms.setCamera(this.camera);

	

	this._vBezier.render();

	
	

	

	
};

module.exports = SceneMain;
},{"./ViewBezier":2,"./framework/CameraInteractor":5,"./framework/Scene":7}],2:[function(require,module,exports){
//ViewBezier.js

var View = require('./framework/View');
var Mesh = require('./framework/Mesh');
var Texture = require('./framework/Texture');

function ViewBezier(){};

var p = ViewBezier.prototype = new View();
var s = View.prototype;

var gl = null;

var random = function(min, max) { return min + Math.random() * (max - min); }

var permTexture = null;
var simplexTexture = null;

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

p.init = function(vertStr, fragStr){

	
	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertStr, fragStr);

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

	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);

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

	var textureObj = new Texture();
	textureObj.init(texture, true);

	return textureObj;
};


p.render = function() {

	this.transforms.calculateModelView();

	var mvMatrix = this.transforms.getMvMatrix();

	
	mat4.rotate(mvMatrix, mvMatrix, .53 * Math.PI, [1,0,0]);
	mat4.rotate(mvMatrix, mvMatrix, .15 * Math.PI, [0,0,1]);

	var nMatrix = mat4.create();

	mat4.copy(nMatrix, mvMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);

	
	this.shader.bind();
	this.shader.uniform("uNMatrix", "uniformMatrix4fv", nMatrix);

	this.shader.uniform("controlValsTexture", "uniform1i", 0);
	this.shader.uniform("simplexTexture", "uniform1i", 1);
	this.shader.uniform("permTexture", "uniform1i", 2);


	this.shader.uniform("angle", "uniform1f", this._angle+=0.01);
	this.shader.uniform("time", "uniform1f", Date.now());
	
	this._controlValsTexture.bind(this.shader, 0);
	this._simplexTexture.bind(this.shader, 1);
	this._permTexture.bind(this.shader, 2);
	

	this.draw(this.mesh);
};



module.exports = ViewBezier;
},{"./framework/Mesh":6,"./framework/Texture":10,"./framework/View":11}],3:[function(require,module,exports){
// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");



(function() {
	// var SceneApp = require("./SceneApp");

	

	var SceneMain = require("./SceneMain");

	

	App = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	}

	var p = App.prototype;

	p._init = function() {

		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		this.canvas.id = 'gl';
		document.body.appendChild(this.canvas);
		// bongiovi.GL.init(this.canvas);

		window.NS = {};
		window.NS.GL = {};
		window.NS.params = {};
		window.NS.params.detail = 32;

		// this._scene = new SceneApp();
		// bongiovi.Scheduler.addEF(this, this._loop);

		// this.gui = new dat.GUI({width:300});

		this._sceneMain = new SceneMain();
		this._sceneMain.init();

		var self = this;
		setTimeout(function(){

			bongiovi.Scheduler.addEF(self, self._loop);
		},200);
	};

	p._loop = function() {
		this._sceneMain.loop();
	};

})();


new App();
},{"./SceneMain":1,"./libs/bongiovi.js":12,"dat-gui":13}],4:[function(require,module,exports){
//Camera.js

function Camera(){};

var p = Camera.prototype;

Camera.ORBITING_TYPE = 'cameraOrbitingType';
Camera.TRACKING_TYPE = 'cameraTrackingType';

p.init = function(opt){

	if (opt)
		this.opt = opt;

	this._matrix 	 = mat4.create();
	this._cameraType = Camera.ORBITING_TYPE;
	this._up         = vec3.create();
	this._right      = vec3.create();
	this._normal     = vec3.create();
	this._position   = vec3.create();
	this._focus      = vec3.create();
	this._azimuth    = 0.0;
	this._elevation  = 0.0;
	this._steps      = 0;
	
	this._home		 = vec3.create();

	this.renderer = null;

	if (this.opt)
		this.setIdentity();


};

p.setIdentity = function(){

	mat4.identity(this._matrix);
};

p.goHome = function(h){

	if (h != null){
		this._home = h;
	}
	
	this.setPosition(this._home);
	this.setAzimuth(0);
	this.setElevation(0);
	this._steps = 0;
};

p.getPosition = function(){

	return this._position;	
};

p.setPosition = function(p){

	vec3.set(this._position, p[0], p[1], p[2]);
	this.update();


};

p.setFocus = function(f){


	vec3.set(this._focus, f[0], f[1], f[2]);
	this.update();


};

p.setAzimuth = function(az){

	this.changeAzimuth(az - this._azimuth);


};

p.changeAzimuth = function(az){

	this._azimuth += az;

	if (this._azimuth > 360 || this._azimuth < -360){
		this._azimuth = this._azimuth % 360;
	}

	// console.log('azimuth: ',this._azimuth);

	this.update();
};

p.setElevation = function(el){

	this.changeElevation(el - this._elevation);

};

p.changeElevation = function(el){

	this._elevation += el;

	if (this._elevation > 360 || this._elevation < -360){
		this._elevation = this._elevation % 360;
	}

	// console.log('elevation: ',this._elevation);

	this.update();
};


p.calculateOrientation = function(){

	var m = this._matrix;

	mat4.multiplyVec4(m, [1, 0, 0, 0], this._right);
	mat4.multiplyVec4(m, [0, 1, 0, 0], this._up);
	mat4.multiplyVec4(m, [0, 0, 1, 0], this._normal);



};

p.update = function(){

	mat4.identity(this._matrix);

	// debugger;

	this.calculateOrientation();

	// mat4.translate(translationMatrix, matrix, vec3.fromValues(0,0,0));

	if (this._cameraType == Camera.TRACKING_TYPE){

		// mat4.translate(this._matrix, this._position);
		mat4.translate(this._matrix, this._matrix, this._position);
		mat4.rotateY(this._matrix, this._matrix, this._azimuth * Math.PI/180);
		mat4.rotateX(this._matrix, this._matrix, this._elevation * Math.PI/180);


	}else{
		// var trxLook = mat4.create();
		mat4.rotateY(this._matrix, this._matrix, this._azimuth * Math.PI/180);
		mat4.rotateX(this._matrix, this._matrix, this._elevation * Math.PI/180);
		mat4.translate(this._matrix, this._matrix, this._position);
		//mat4.lookAt(this.position, this.focus, this.up, trxLook);
		//mat4.invert(trxLook);
		//mat4.multiply(this.matrix,trxLook);

	}

	this.calculateOrientation();

	if (this._cameraType == Camera.TRACKING_TYPE){
		mat4.multiplyVec4(this._matrix, [0, 0, 0, 1], this._position);
	}

	if (this.renderer)
		this.renderer();

};

p.getViewTransform = function(){

	if (this.opt)
		return this._matrix;
	
	var m = mat4.create();
	mat4.invert(m, this._matrix);


	return m;

};

module.exports = Camera;
},{}],5:[function(require,module,exports){
// CameraInteractor.js

function CameraInteractor(){};

var p = CameraInteractor.prototype;

p.init = function(camera, canvas, mouseDownCallback, mouseMoveCallback, mouseUpCallback, scope){

	this.camera = camera;
	this.canvas = canvas;

	this._onMouseDownCallback = mouseDownCallback;
	this._onMouseMoveCallback = mouseMoveCallback;
	this._onMouseUpCallback = mouseUpCallback;
	this._callbackScope = scope;

	this.dragging = false;
	this.x = 0;
	this.y = 0;
	this.lastX = 0;
	this.lastY = 0;
	this.button = 0;
	this.ctrl = false;
	this.key = 0;
	
	this.MOTION_FACTOR = 10.0;
	this.dloc = 0;
	this.dstep = 0;

	this.altKeyIsDown = false;

	

	this._onMouseDownBound = this._onMouseDown.bind(this);
	this._onMouseUpBound = this._onMouseUp.bind(this);
	this._onMouseMoveBound = this._onMouseMove.bind(this);

	this.activateMouseEvents();
	
	window.addEventListener('keydown', this._onKeyDown.bind(this) );
	window.addEventListener('keyup', this._onKeyUp.bind(this) );

};


p.activateMouseEvents = function(){

	console.log('activate mouse events');

	this.canvas.addEventListener('mousedown', this._onMouseDownBound);
	this.canvas.addEventListener('mouseup', this._onMouseUpBound);
	

};


p.disableMouseEvents = function(){

	console.log('disable mouse events');

	this.canvas.removeEventListener('mousedown', this._onMouseDownBound);
	this.canvas.removeEventListener('mouseup', this._onMouseUpBound);
	

};

p._onKeyDown = function(e){

	if (e.altKey)
		this.altKeyIsDown = true;

};

p._onKeyUp = function(e){

	this.altKeyIsDown = false;
};

p._onMouseUp = function(e){

	this.canvas.removeEventListener('mousemove', this._onMouseMoveBound);
	
	// this._onMouseUpCallback.call(this._callbackScope, e);

	this.dragging = false;


};

p._onMouseDown = function(e){

	// debugger;

	console.log('canvas mouse down');

	
	
	// this._onMouseDownCallback.call(this._callbackScope, e);

	this.dragging = true;
    this.x = e.clientX;
	this.y = e.clientY;
	this.button = e.button;
	var position = this.camera.getPosition();
	this.dstep = Math.max(position[0],position[1],position[2])/100;

	if (!this.altKeyIsDown)
		this.canvas.addEventListener('mousemove', this._onMouseMoveBound);

};

p._onMouseMove = function(e){

	console.log('mouse move');

	this.lastX = this.x;
	this.lastY = this.y;
	this.x = e.clientX;
    this.y = e.clientY;
	
	if (!this.dragging) return;
	this.ctrl = e.ctrlKey;
	this.alt = e.altKey;
	var dx = this.x - this.lastX;
	var dy = this.y - this.lastY;

	// if (window.NS.params.currentControlPoint)
	// 	this._onMouseMoveCallback.call(this._callbackScope, e, dx, dy);
	// else
		this.rotate(dx, dy);
	
	// if (this.button == 0) { 
	// 	if(this.alt){
	// 		this.dolly(dy);
	// 	}
	// 	else{ 
	// 		this.rotate(dx,dy);
	// 	}
	// }	
};


p.rotate = function(dx, dy){

	var camera = this.camera;
	var canvas = this.canvas;
	
	var delta_elevation = -20.0 / canvas.height;
	var delta_azimuth   = -20.0 / canvas.width;
				
	var nAzimuth = dx * delta_azimuth * this.MOTION_FACTOR;
	var nElevation = dy * delta_elevation * this.MOTION_FACTOR;
	
	camera.changeAzimuth(nAzimuth);
	camera.changeElevation(nElevation);	
};

module.exports = CameraInteractor;
},{}],6:[function(require,module,exports){
//Mesh.js

function Mesh(){};

var p = Mesh.prototype;

var gl = null;

p.init = function(vertexSize, indexSize, drawType){

	gl = window.NS.GL.glContext;

	this.vertexSize = vertexSize;
	this.indexSize = indexSize;
	this.drawType = drawType;
	this.extraAttributes = [];

	this.textureUsed = false;

	this._floatArrayVertex = undefined;
};

p.bufferVertex = function(aryVertices) {
	var vertices = [];

	for(var i=0; i<aryVertices.length; i++) {
		for(var j=0; j<aryVertices[i].length; j++) vertices.push(aryVertices[i][j]);
	}

	if(this.vBufferPos == undefined ) this.vBufferPos = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);

	if(this._floatArrayVertex == undefined) this._floatArrayVertex = new Float32Array(vertices);
	else {
		if(aryVertices.length != this._floatArrayVertex.length) this._floatArrayVertex = new Float32Array(vertices);
		else {
			for(var i=0;i<aryVertices.length; i++) {
				this._floatArrayVertex[i] = aryVertices[i];
			}
		}
	}

	gl.bufferData(gl.ARRAY_BUFFER, this._floatArrayVertex, gl.STATIC_DRAW);
	this.vBufferPos.itemSize = 3;
};


p.bufferTexCoords = function(aryTexCoords) {
	var coords = [];

	this.textureUsed = true;

	for(var i=0; i<aryTexCoords.length; i++) {
		for(var j=0; j<aryTexCoords[i].length; j++) coords.push(aryTexCoords[i][j]);
	}

	this.vBufferUV = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferUV);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
	this.vBufferUV.itemSize = 2;
};


p.bufferData = function(data, name, itemSize) {
	var index = -1
	for(var i=0; i<this.extraAttributes.length; i++) {
		if(this.extraAttributes[i].name == name) {
			this.extraAttributes[i].data = data;
			index = i;
			break;
		}
	}

	var bufferData = [];
	for(var i=0; i<data.length; i++) {
		for(var j=0; j<data[i].length; j++) bufferData.push(data[i][j]);
	}

	if(index == -1) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		var floatArray = new Float32Array(bufferData);
		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
		this.extraAttributes.push({name:name, data:data, itemSize:itemSize, buffer:buffer, floatArray:floatArray});
	} else {
		var buffer = this.extraAttributes[index].buffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		var floatArray = this.extraAttributes[index].floatArray;
		for(var i=0;i<bufferData.length; i++) {
			floatArray[i] = bufferData[i];
		}
		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
	}
	
};


p.bufferIndices = function(aryIndices) {
	this.iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryIndices), gl.STATIC_DRAW);
	this.iBuffer.itemSize = 1;
	this.iBuffer.numItems = aryIndices.length;
};

// var vertexBufferObject = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
	  


// if (object.perVertexColor){
// 	colorBufferObject = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);
// 	object.cbo = colorBufferObject;
// }

// var indexBufferObject = gl.createBuffer();
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW);

// object.vbo = vertexBufferObject;
// object.ibo = indexBufferObject;
// object.nbo = normalBufferObject;

// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
// gl.bindBuffer(gl.ARRAY_BUFFER,null);

// p.bufferVertex = function(aryVertices) {
// 	var vertices = [];

// 	// this.vBufferPos = gl.createBuffer();
// 	// gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);
// 	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryVertices), gl.STATIC_DRAW);

// 	// for(var i=0; i<aryVertices.length; i++) {
// 	// 	for(var j=0; j<aryVertices[i].length; j++) vertices.push(aryVertices[i][j]);
// 	// }

// 	// if(this.vBufferPos == undefined ) this.vBufferPos = gl.createBuffer();
// 	// gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);

// 	// if(this._floatArrayVertex == undefined) this._floatArrayVertex = new Float32Array(vertices);
// 	// else {
// 	// 	if(aryVertices.length != this._floatArrayVertex.length) this._floatArrayVertex = new Float32Array(vertices);
// 	// 	else {
// 	// 		for(var i=0;i<aryVertices.length; i++) {
// 	// 			this._floatArrayVertex[i] = aryVertices[i];
// 	// 		}
// 	// 	}
// 	// }

// 	// gl.bufferData(gl.ARRAY_BUFFER, this._floatArrayVertex, gl.STATIC_DRAW);
// 	this.vBufferPos.itemSize = 3;
// };


// p.bufferTexCoords = function(aryTexCoords) {
// 	var coords = [];

// 	// for(var i=0; i<aryTexCoords.length; i++) {
// 	// 	for(var j=0; j<aryTexCoords[i].length; j++) coords.push(aryTexCoords[i][j]);
// 	// }

// 	this.vBufferUV = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferUV);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryTexCoords), gl.STATIC_DRAW);
// 	this.vBufferUV.itemSize = 2;
// };


// p.bufferData = function(data, name, itemSize) {
// 	var index = -1
// 	for(var i=0; i<this.extraAttributes.length; i++) {
// 		if(this.extraAttributes[i].name == name) {
// 			this.extraAttributes[i].data = data;
// 			index = i;
// 			break;
// 		}
// 	}

// 	var bufferData = [];
// 	for(var i=0; i<data.length; i++) {
// 		for(var j=0; j<data[i].length; j++) bufferData.push(data[i][j]);
// 	}

// 	if(index == -1) {
// 		var buffer = gl.createBuffer();
// 		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 		var floatArray = new Float32Array(bufferData);
// 		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
// 		this.extraAttributes.push({name:name, data:data, itemSize:itemSize, buffer:buffer, floatArray:floatArray});
// 	} else {
// 		var buffer = this.extraAttributes[index].buffer;
// 		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 		var floatArray = this.extraAttributes[index].floatArray;
// 		for(var i=0;i<bufferData.length; i++) {
// 			floatArray[i] = bufferData[i];
// 		}
// 		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
// 	}
	
// };


// p.bufferIndices = function(aryIndices) {
// 	this.iBuffer = gl.createBuffer();
// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
// 	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryIndices), gl.STATIC_DRAW);
// 	this.iBuffer.itemSize = 1;
// 	this.iBuffer.numItems = aryIndices.length;

// };


// // var vertexBufferObject = gl.createBuffer();
// // 	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
// // 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
	  
	

// // 	var indexBufferObject = gl.createBuffer();
// // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
// // 	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW);


module.exports = Mesh;
},{}],7:[function(require,module,exports){
// Scene.js

var SceneTransforms = require('./SceneTransforms');
var Camera = require('./Camera');

function Scene(){

	this.test = 0;
};

var p = Scene.prototype;

p.init = function(){

	this.objects = [];

	this.canvas = document.getElementById('gl');
	gl = this.canvas.getContext("webgl");

	window.NS.GL.glContext = gl;

	this.transforms = new SceneTransforms();
	this.transforms.init(this.canvas);


	this.onResize();

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
	gl.enable(gl.BLEND);
	gl.clearColor( 0, 0, 0, 1 );
	gl.clearDepth( 1 );
	this.depthTextureExt 	= gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
	// this.floatTextureExt 	= gl.getExtension("OES_texture_float") // Or browser-appropriate prefix
	

	this._setCamera();

	

	

	
};

p._setCamera = function(){

	this.camera = new Camera();
	this.camera.init();

	this.cameraOtho = new Camera();
	this.cameraOtho.init('front');

	this.camera.goHome([0,0,4]);
};

p.getObject = function(alias){

	for(var i=0; i<this.objects.length; i++){
		if (alias == this.objects[i].alias) return this.objects[i];
	}
	return null;
};

p.loadObject = function(filename,alias,attributes){

	var request = new XMLHttpRequest();
	console.info('Requesting ' + filename);
	request.open("GET",filename);

	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if(request.status == 404) {
				console.info(filename + ' does not exist');
			}
			else {
				var o = JSON.parse(request.responseText);
				o.alias = (alias==null)?'none':alias;
				o.remote = true;
				this.addObject(o,attributes);
			}
		}
	}
	request.send();
};

p.loadObjectByParts = function(path, alias, parts){

	for(var i = 1; i <= parts; i++){
		var partFilename =  path+''+i+'.json';
		var partAlias = alias+''+i;
		this.loadObject(partFilename,partAlias);
	}

};

p.addObject = function(object, attributes){

	 //initialize with defaults
	if (object.perVertexColor   === undefined)    {   object.perVertexColor   = false;            }
    if (object.wireframe        === undefined)    {   object.wireframe        = false;            }
    if (object.diffuse          === undefined)    {   object.diffuse          = [1.0,1.0,1.0,1.0];}
    if (object.ambient          === undefined)    {   object.ambient          = [0.1,0.1,0.1,1.0];}
    if (object.specular         === undefined)    {   object.specular         = [1.0,1.0,1.0,1.0];}
	
	//set attributes
   for(var key in attributes){
		if(object.hasOwnProperty(key)) {object[key] = attributes[key];}
	}   


	var vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
	  
	var normalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(calculateNormals(object.vertices, object.indices)), gl.STATIC_DRAW);

	var colorBufferObject;

	if (object.perVertexColor){
		colorBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);
		object.cbo = colorBufferObject;
	}

	var indexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW);
	
	object.vbo = vertexBufferObject;
	object.ibo = indexBufferObject;
	object.nbo = normalBufferObject;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);

	this.objects.push(object);
	
	if (object.remote){
		console.info(object.alias + ' has been added to the scene [Remote]');
	}
	else {
		console.info(object.alias + ' has been added to the scene [Local]');
	}
};

p.loop = function() {
	this.update();
	this.render();
};


p.update = function() {

	// gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// this.transforms.updatePerspective();
	

	// gl.uniformMatrix4fv(renderProgram.uMVMatrix, false, transforms.getMvMatrix());
	// gl.uniformMatrix4fv(renderProgram.uPMatrix, false, transforms.getProjectionMatrix());
	

	// this.sceneRotation.update();
	// GL.setMatrices(this.camera);
	// GL.rotate(this.sceneRotation.matrix);
};


p.render = function() {
	//OVERWRITE
};


p.onResize = function(){

	var w = window.innerWidth;
	var h = window.innerHeight;

	

	this.canvas.width = w;
	this.canvas.height = h;

	this.canvas.style.height = h + 'px';
	this.canvas.style.width = w + 'px';

	

	this.transforms.updatePerspective();

};

module.exports = Scene;
},{"./Camera":4,"./SceneTransforms":8}],8:[function(require,module,exports){
//SceneTransforms.js

var SceneTransforms = function(){};



var p = SceneTransforms.prototype;

SceneTransforms.FIELD_OF_VIEW = 45 * Math.PI/180;

p.init = function(canvas){

	this._stack = [];
	// this._camera = c;
	this._canvas = canvas;
	this._mvMatrix    = mat4.create();    // The Model-View matrix
	this._pMatrix     = mat4.create();    // The projection matrix
	this._nMatrix     = mat4.create();    // The normal matrix
	// this.cMatrix     = mat4.create();    // The camera matrix

	mat4.identity(this._pMatrix);
};

p.setCamera = function(c){

	this._camera = c;
};

p.calculateModelView = function(){

	this._mvMatrix = this._camera.getViewTransform();
	
};

p.calculateNormal = function(){

	mat4.identity(this._nMatrix);
	mat4.copy(this._nMatrix, this._mvMatrix);
	mat4.invert(this._nMatrix, this._nMatrix);
	mat4.transpose(this._nMatrix, this._nMatrix);


};

p.calculatePerspective = function(){

	mat4.identity(this._pMatrix);
	mat4.perspective(SceneTransforms.FIELD_OF_VIEW, this._canvas.width / this._canvas.height, 0.1, 1000, this._pMatrix);
};

p.updatePerspective = function(w, h){

	mat4.perspective(this._pMatrix, SceneTransforms.FIELD_OF_VIEW, w / h, 0.1, 1000);	
};

p.resetPerspective = function(){

	mat4.identity(this._pMatrix);
};


p.setMatrixUniforms = function(){

	this.calculateNormal();
		
};

p.getMvMatrix = function(){

	return this._mvMatrix;	
};

p.getProjectionMatrix = function(){

	return this._pMatrix;	
};

p.getNormalMatrix = function(){

	return this._nMatrix;	
};

p.pop = function(){

	if(this._stack.length == 0) return;
	this._mvMatrix = this._stack.pop();

};

p.push = function(){

	var memento = mat4.create();
	mat4.copy(memento, this._mvMatrix);
	this._stack.push(memento);

};

module.exports = SceneTransforms;
},{}],9:[function(require,module,exports){
//ShaderProgram.js

function ShaderProgram(){};

var p = ShaderProgram.prototype;

var gl = null;

p.init = function(vertexShader, fragmentShader){

	gl = window.NS.GL.glContext;

	this.idVertex   = 'vertex';
	this.idFragment = 'fragment';
	// this.getShader(this.idVertex, true);
	// this.getShader(this.idFragment, false);
	this.createShaderProgram(vertexShader, true);
	this.createShaderProgram(fragmentShader, false);
	this.parameters = [];
	// this._isReady = truee;

	

};

p.onShadersLoaded = function(){

	this.prg = gl.createProgram();
	gl.attachShader(this.prg, this.vertexShader);
	gl.attachShader(this.prg, this.fragmentShader);
	gl.linkProgram(this.prg);
	this._isReady = true;	
};

p.getShader = function(id, isVertexShader) {
	var req = new XMLHttpRequest();
	req.hasCompleted = false;
	var self = this;
	req.onreadystatechange = function(e) {
		if(e.target.readyState == 4) self.createShaderProgram(e.target.responseText, isVertexShader)
	};
	req.open("GET", id, true);
	req.send(null);
}


p.createShaderProgram = function(str, isVertexShader) {
	var shader = isVertexShader ? gl.createShader(gl.VERTEX_SHADER) : gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }


    if(isVertexShader) this.vertexShader = shader;
    else this.fragmentShader = shader;

    if(this.vertexShader!=undefined && this.fragmentShader!=undefined) this.onShadersLoaded();
};


p.bind = function() {
	gl.useProgram(this.prg);

	if (!this.prg) debugger;

	if(this.prg.pMatrixUniform == undefined) this.prg.pMatrixUniform = gl.getUniformLocation(this.prg, "uPMatrix");
	if(this.prg.mvMatrixUniform == undefined) this.prg.mvMatrixUniform = gl.getUniformLocation(this.prg, "uMVMatrix");

	// Global.
	// GL.shader 			= this;
	// GL.shader 	= this;

	this.uniformTextures = [];
};


p.uniform = function(name, type, value) {
	if(type == "texture") type = "uniform1i";
	
	var hasUniform = false;
	var oUniform;
	for(var i=0; i<this.parameters.length; i++) {
		oUniform = this.parameters[i];
		if(oUniform.name == name) {
			oUniform.value = value;
			hasUniform = true;
			break;
		}
	}

	if(!hasUniform) {
		this.prg[name] = gl.getUniformLocation(this.prg, name);
		this.parameters.push( {name:name, type:type, value:value, uniformLoc:this.prg[name]} );
	} else {
		this.prg[name] = oUniform.uniformLoc;
	}


	if(type.indexOf("Matrix") == -1) {
		gl[type](this.prg[name], value);
	} else {
		gl[type](this.prg[name], false, value);
	}

	if(type == "uniform1i") {	//	TEXTURE
		this.uniformTextures[value] = this.prg[name];
		// if(name == "textureForce") console.log( "Texture Force : ",  this.uniformTextures[value], value );
	}
}



p.unbind = function() {
	
};

p.isReady = function() {	return this._isReady;	};

module.exports = ShaderProgram;
},{}],10:[function(require,module,exports){
//Texture.js

function Texture(){};

var gl;

var p = Texture.prototype;

p.init = function(source, isTexture){

	gl = window.NS.GL.glContext;

	if (isTexture == undefined)
		isTexture = isTexture == undefined ? false : true;
	// gl = GL.gl;
	if(isTexture) {
		this.texture = source;
	} else {
		this.texture = gl.createTexture();
		this._isVideo = (source.tagName == "VIDEO");


		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

		if(!this._isVideo) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
	}

};

p.updateTexture = function(source) {


	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

	if(!this._isVideo) {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
};


p.bind = function(shader, index, toDebug) {
	if(index == undefined) index = 0;

	gl.activeTexture(gl.TEXTURE0 + index);
	// console.log( gl.TEXTURE0 + i, this._textures[i].texture );
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	// gl.uniform1i(shaderProgram["samplerUniform"+i], i);
	// if(toDebug) console.log( GL.shader.uniformTextures[index], this );
	gl.uniform1i(shader.uniformTextures[index], index);
	this._bindIndex = index;
};


p.unbind = function() {
	gl.bindTexture(gl.TEXTURE_2D, null);
};

	
module.exports = Texture;
},{}],11:[function(require,module,exports){
//View.js

var ShaderProgram = require('./ShaderProgram');

function View(){};

var p = View.prototype;

var gl = null;

p.init = function(strVert, strFrag){

	gl = window.NS.GL.glContext;

	if(strVert == undefined) return;
	this.shader = new ShaderProgram();
	this.shader.init(strVert, strFrag);

	this.transforms = null;

	this._enabledVertexAttrib = [];
};

p.draw = function(mesh){

	// this.transforms.calculateModelView();

	gl.uniformMatrix4fv(this.shader.prg.pMatrixUniform, false, this.transforms.getProjectionMatrix());
	gl.uniformMatrix4fv(this.shader.prg.mvMatrixUniform, false, this.transforms.getMvMatrix());
	

	// 	VERTEX POSITIONS
	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vBufferPos);
	var vertexPositionAttribute = getAttribLoc(gl, this.shader.prg, "aVertexPosition");
	gl.vertexAttribPointer(vertexPositionAttribute, mesh.vBufferPos.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
	if(this._enabledVertexAttrib.indexOf(vertexPositionAttribute) == -1) {
		gl.enableVertexAttribArray(vertexPositionAttribute);
		this._enabledVertexAttrib.push(vertexPositionAttribute);
	}

	

	if (mesh.textureUsed){
		//		TEXTURE COORDS
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vBufferUV);
		var textureCoordAttribute = getAttribLoc(gl, this.shader.prg, "aTextureCoord");
		gl.vertexAttribPointer(textureCoordAttribute, mesh.vBufferUV.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
		// gl.enableVertexAttribArray(textureCoordAttribute);
		if(this._enabledVertexAttrib.indexOf(textureCoordAttribute) == -1) {
			gl.enableVertexAttribArray(textureCoordAttribute);
			this._enabledVertexAttrib.push(textureCoordAttribute);
		}
	}
	

	//	INDICES
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.iBuffer);

	//	EXTRA ATTRIBUTES
	for(var i=0; i<mesh.extraAttributes.length; i++) {
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.extraAttributes[i].buffer);
		var attrPosition = getAttribLoc(gl, this.shader.prg, mesh.extraAttributes[i].name);
		gl.vertexAttribPointer(attrPosition, mesh.extraAttributes[i].itemSize, gl.FLOAT, gl.FALSE, 0, 0);
		gl.enableVertexAttribArray(attrPosition);		

		if(this._enabledVertexAttrib.indexOf(attrPosition) == -1) {
			gl.enableVertexAttribArray(attrPosition);
			this._enabledVertexAttrib.push(attrPosition);
		}
	}

	//	DRAWING
	// gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	if(mesh.drawType == gl.POINTS ) {
		gl.drawArrays(mesh.drawType, 0, mesh.vertexSize);	
	} else{
		gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	} 


	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	

	function getAttribLoc(gl, shaderProgram, name) {
		if(shaderProgram.cacheAttribLoc  == undefined) shaderProgram.cacheAttribLoc = {};
		if(shaderProgram.cacheAttribLoc[name] == undefined) {
			shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
		}

		return shaderProgram.cacheAttribLoc[name];
	}
};

module.exports = View;
},{"./ShaderProgram":9}],12:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bongiovi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

var GLTools = _dereq_("./bongiovi/GLTools");

var bongiovi = {
	GL:GLTools,
	GLTools:GLTools,
	Scheduler:_dereq_("./bongiovi/Scheduler"),
	SimpleImageLoader:_dereq_("./bongiovi/SimpleImageLoader"),
	EaseNumber:_dereq_("./bongiovi/EaseNumber"),
	QuatRotation:_dereq_("./bongiovi/QuatRotation"),
	Scene:_dereq_("./bongiovi/Scene"),
	Camera:_dereq_("./bongiovi/Camera"),
	SimpleCamera:_dereq_("./bongiovi/SimpleCamera"),
	CameraOrtho:_dereq_("./bongiovi/CameraOrtho"),
	CameraPerspective:_dereq_("./bongiovi/CameraPerspective"),
	Mesh:_dereq_("./bongiovi/Mesh"),
	Face:_dereq_("./bongiovi/Face"),
	GLShader:_dereq_("./bongiovi/GLShader"),
	GLTexture:_dereq_("./bongiovi/GLTexture"),
	ShaderLibs:_dereq_("./bongiovi/ShaderLibs"),
	View:_dereq_("./bongiovi/View"),
	ViewCopy:_dereq_("./bongiovi/ViewCopy"),
	ViewAxis:_dereq_("./bongiovi/ViewAxis"),
	ViewDotPlane:_dereq_("./bongiovi/ViewDotPlanes"),
	MeshUtils:_dereq_("./bongiovi/MeshUtils"),
	FrameBuffer:_dereq_("./bongiovi/FrameBuffer"),
	EventDispatcher:_dereq_("./bongiovi/EventDispatcher"),
	ObjLoader:_dereq_("./bongiovi/ObjLoader"),
	glm:_dereq_("gl-matrix")
};

module.exports = bongiovi;
},{"./bongiovi/Camera":3,"./bongiovi/CameraOrtho":4,"./bongiovi/CameraPerspective":5,"./bongiovi/EaseNumber":6,"./bongiovi/EventDispatcher":7,"./bongiovi/Face":8,"./bongiovi/FrameBuffer":9,"./bongiovi/GLShader":10,"./bongiovi/GLTexture":11,"./bongiovi/GLTools":12,"./bongiovi/Mesh":13,"./bongiovi/MeshUtils":14,"./bongiovi/ObjLoader":15,"./bongiovi/QuatRotation":16,"./bongiovi/Scene":17,"./bongiovi/Scheduler":18,"./bongiovi/ShaderLibs":19,"./bongiovi/SimpleCamera":20,"./bongiovi/SimpleImageLoader":21,"./bongiovi/View":22,"./bongiovi/ViewAxis":23,"./bongiovi/ViewCopy":24,"./bongiovi/ViewDotPlanes":25,"gl-matrix":2}],2:[function(_dereq_,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.1
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matricies
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/*
* Rotate a 3D vector around the x-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/*
* Rotate a 3D vector around the y-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/*
* Rotate a 3D vector around the z-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bongiovi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

var GLTools = _dereq_("./bongiovi/GLTools");

var bongiovi = {
	GL:GLTools,
	GLTools:GLTools,
	Scheduler:_dereq_("./bongiovi/Scheduler"),
	SimpleImageLoader:_dereq_("./bongiovi/SimpleImageLoader"),
	EaseNumber:_dereq_("./bongiovi/EaseNumber"),
	QuatRotation:_dereq_("./bongiovi/QuatRotation"),
	Scene:_dereq_("./bongiovi/Scene"),
	Camera:_dereq_("./bongiovi/Camera"),
	SimpleCamera:_dereq_("./bongiovi/SimpleCamera"),
	CameraOrtho:_dereq_("./bongiovi/CameraOrtho"),
	CameraPerspective:_dereq_("./bongiovi/CameraPerspective"),
	Mesh:_dereq_("./bongiovi/Mesh"),
	Face:_dereq_("./bongiovi/Face"),
	GLShader:_dereq_("./bongiovi/GLShader"),
	GLTexture:_dereq_("./bongiovi/GLTexture"),
	ShaderLibs:_dereq_("./bongiovi/ShaderLibs"),
	View:_dereq_("./bongiovi/View"),
	ViewCopy:_dereq_("./bongiovi/ViewCopy"),
	ViewAxis:_dereq_("./bongiovi/ViewAxis"),
	ViewDotPlane:_dereq_("./bongiovi/ViewDotPlanes"),
	MeshUtils:_dereq_("./bongiovi/MeshUtils"),
	FrameBuffer:_dereq_("./bongiovi/FrameBuffer"),
	EventDispatcher:_dereq_("./bongiovi/EventDispatcher"),
	ObjLoader:_dereq_("./bongiovi/ObjLoader"),
	glm:_dereq_("gl-matrix")
};

module.exports = bongiovi;
},{"./bongiovi/Camera":3,"./bongiovi/CameraOrtho":4,"./bongiovi/CameraPerspective":5,"./bongiovi/EaseNumber":6,"./bongiovi/EventDispatcher":7,"./bongiovi/Face":8,"./bongiovi/FrameBuffer":9,"./bongiovi/GLShader":10,"./bongiovi/GLTexture":11,"./bongiovi/GLTools":12,"./bongiovi/Mesh":13,"./bongiovi/MeshUtils":14,"./bongiovi/ObjLoader":15,"./bongiovi/QuatRotation":16,"./bongiovi/Scene":17,"./bongiovi/Scheduler":18,"./bongiovi/ShaderLibs":19,"./bongiovi/SimpleCamera":20,"./bongiovi/SimpleImageLoader":21,"./bongiovi/View":22,"./bongiovi/ViewAxis":23,"./bongiovi/ViewCopy":24,"./bongiovi/ViewDotPlanes":25,"gl-matrix":2}],2:[function(_dereq_,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.1
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matricies
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/*
* Rotate a 3D vector around the x-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/*
* Rotate a 3D vector around the y-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/*
* Rotate a 3D vector around the z-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[7]-m[5])*fRoot;
        out[1] = (m[2]-m[6])*fRoot;
        out[2] = (m[3]-m[1])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[k*3+j] - m[j*3+k]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})(this);

},{}],3:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

var Camera = function() {
	this.matrix = glm.mat4.create();
	glm.mat4.identity(this.matrix);

	this.position = glm.vec3.create();
};

var p = Camera.prototype;

p.lookAt = function(aEye, aCenter, aUp) {
	glm.vec3.copy(this.position, aEye);
	glm.mat4.identity(this.matrix);
	glm.mat4.lookAt(this.matrix, aEye, aCenter, aUp);
};

p.getMatrix = function() {
	return this.matrix;
};

module.exports = Camera;
},{"gl-matrix":2}],4:[function(_dereq_,module,exports){
// CameraOrtho.js

"use strict";

var Camera = _dereq_("./Camera");
var glm = _dereq_("gl-matrix");


var CameraOrtho = function() {
	Camera.call(this);

	var eye            = glm.vec3.clone([0, 0, 500]  );
	var center         = glm.vec3.create( );
	var up             = glm.vec3.clone( [0,-1,0] );
	this.lookAt(eye, center, up);

	this.projection = glm.mat4.create();
};

var p = CameraOrtho.prototype = new Camera();


p.setBoundary = function(left, right, top, bottom) {
	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;
	glm.mat4.ortho(this.projection, left, right, top, bottom, 0, 10000);
};


p.ortho = p.setBoundary;

p.getMatrix = function() {
	return this.matrix;
};


p.resize = function() {
	glm.mat4.ortho(this.projection, this.left, this.right, this.top, this.bottom, 0, 10000);
};


module.exports = CameraOrtho;
},{"./Camera":3,"gl-matrix":2}],5:[function(_dereq_,module,exports){
// CameraPerspective.js
"use strict";

var Camera = _dereq_("./Camera");
var glm = _dereq_("gl-matrix");

var CameraPerspective = function() {
	Camera.call(this);

	this.projection = glm.mat4.create();
	this.mtxFinal = glm.mat4.create();
};

var p = CameraPerspective.prototype = new Camera();

p.setPerspective = function(aFov, aAspectRatio, aNear, aFar) {
	this._fov = aFov;
	this._near = aNear;
	this._far = aFar;
	this._aspect = aAspectRatio;
	glm.mat4.perspective(this.projection, aFov, aAspectRatio, aNear, aFar);
};

p.getMatrix = function() {
	// mat4.multiply(this.mtxFinal, this.projection, this.matrix);
	return this.matrix;
};

p.resize = function(aAspectRatio) {
	this._aspect = aAspectRatio;
	glm.mat4.perspective(this.projection, this._fov, aAspectRatio, this._near, this._far);
};

p.__defineGetter__("near", function() {
	return this._near;
});

p.__defineGetter__("far", function() {
	return this._far;
});

module.exports = CameraPerspective;
},{"./Camera":3,"gl-matrix":2}],6:[function(_dereq_,module,exports){
// EaseNumber.js

"use strict";

var Scheduler = _dereq_("./Scheduler");

function EaseNumber(mValue, mEasing) {
	this._easing = mEasing || 0.1;
	this._value = mValue;
	this._targetValue = mValue;

	Scheduler.addEF(this, this._update);
}

var p = EaseNumber.prototype;


p._update = function() {
	this._checkLimit();
	this._value += (this._targetValue - this._value) * this._easing;	
};


p.setTo = function(mValue) {
	this._targetValue = this._value = mValue;
};


p.add = function(mAdd) {
	this._targetValue += mAdd;
};

p.limit = function(mMin, mMax) {
	this._min = mMin;
	this._max = mMax;

	this._checkLimit();
};

p.setEasing = function(mValue) {
	this._easing = mValue;
};

p._checkLimit = function() {
	if(this._min !== undefined && this._targetValue < this._min) {
		this._targetValue = this._min;
	} 

	if(this._max !== undefined && this._targetValue > this._max) {
		this._targetValue = this._max;
	} 
};


p.__defineGetter__("value", function() {
	return this._value;
});


p.__defineGetter__("targetValue", function() {
	return this._targetValue;
});


p.__defineSetter__("value", function(mValue) {
	this._targetValue = mValue;
});


module.exports = EaseNumber;
},{"./Scheduler":18}],7:[function(_dereq_,module,exports){
// EventDispatcher.js

"use strict";

var supportsCustomEvents = true;
try {
	var newTestCustomEvent = document.createEvent("CustomEvent");
	newTestCustomEvent = null;
} catch(e){
	supportsCustomEvents = false;
}

function EventDispatcher() {
	this._eventListeners = null;
}


var p = EventDispatcher.prototype;


p.addEventListener = function(aEventType, aFunction) {

	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	if(!this._eventListeners[aEventType]){
		this._eventListeners[aEventType] = [];
	}
	this._eventListeners[aEventType].push(aFunction);
	
	return this;
};

p.removeEventListener = function(aEventType, aFunction) {
	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	var currentArray = this._eventListeners[aEventType];
	
	if (typeof(currentArray) === "undefined") {
		// console.warn("EventDispatcher :: removeEventListener :: Tried to remove an event handler (for " + aEventType +") that doesn't exist");
		return this;
	}
	
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++){
		if(currentArray[i] === aFunction){
			currentArray.splice(i, 1);
			i--;
			currentArrayLength--;
		}
	}
	return this;
};

p.dispatchEvent = function(aEvent) {
	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	var eventType = aEvent.type;
	
	try {
		if(aEvent.target === null) {
			aEvent.target = this;
		}
		aEvent.currentTarget = this;
	}
	catch(theError) {
		// console.error("Couldn't set targets for current event. " + aEvent.message);
		//MENOTE: sometimes Firefox can't set the target
		var newEvent = {"type" : eventType, "detail" : aEvent.detail, "dispatcher" : this };
		return this.dispatchEvent(newEvent);
	}
	
	//console.log(eventType, this._eventListeners[eventType], this._eventListeners[eventType].length);
	var currentEventListeners = this._eventListeners[eventType];
	if(currentEventListeners !== null && currentEventListeners !== undefined) {
		var currentArray = this._copyArray(currentEventListeners);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++){
			var currentFunction = currentArray[i];
			//console.log(currentFunction);
			//console.log(eventType, i, currentArray.length);
			currentFunction.call(this, aEvent);
		}
	}
	return this;
};

p.dispatchCustomEvent = function(aEventType, aDetail) {
	var newEvent;
	if (supportsCustomEvents){
		newEvent = document.createEvent("CustomEvent");
		newEvent.dispatcher = this;
		newEvent.initCustomEvent(aEventType, false, false, aDetail);
	}
	else {
		newEvent = {"type" : aEventType, "detail" : aDetail, "dispatcher" : this };
	}
	return this.dispatchEvent(newEvent);
};

p._destroy = function() {
	if(this._eventListeners !== null) {
		for(var objectName in this._eventListeners) {
			var currentArray = this._eventListeners[objectName];
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				currentArray[i] = null;
			}
			delete this._eventListeners[objectName];
		}
		this._eventListeners = null;
	}
};

p._copyArray = function(aArray) {
	var currentArray = new Array(aArray.length);
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++) {
		currentArray[i] = aArray[i];
	}
	return currentArray;
};

module.exports = EventDispatcher;
},{}],8:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

var Face = function(mA, mB, mC) {
	this._vertexA = mA;
	this._vertexB = mB;
	this._vertexC = mC;

	this._init();
};

var p = Face.prototype;


p._init = function() {
	var BA = glm.vec3.create();
	var CA = glm.vec3.create();
	glm.vec3.sub(BA, this._vertexB, this._vertexA);
	glm.vec3.sub(CA, this._vertexC, this._vertexA);

	this._faceNormal = glm.vec3.create();
	glm.vec3.cross(this._faceNormal, BA, CA);
	glm.vec3.normalize(this._faceNormal, this._faceNormal);
};


p.contains = function(mVertex) {
	return ( equal(mVertex, this._vertexA) || equal(mVertex, this._vertexB) || equal(mVertex, this._vertexC) );
};


p.__defineGetter__("faceNormal", function() {
	return this._faceNormal;
});

var equal = function(mV0, mV1) {
	return ( (mV0[0] === mV1[0]) && (mV0[1] === mV1[1]) && (mV0[2] === mV1[2]) );
};

module.exports = Face;
},{"gl-matrix":2}],9:[function(_dereq_,module,exports){
"use strict";

var gl, GL = _dereq_("./GLTools");
var GLTexture = _dereq_("./GLTexture");
var isPowerOfTwo = function(x) {	return !(x === 0) && !(x & (x - 1));	};

var FrameBuffer = function(width, height, options) {
	gl = GL.gl;
	options        = options || {};
	this.width     = width;
	this.height    = height;
	this.magFilter = options.magFilter || gl.LINEAR;
	this.minFilter = options.minFilter || gl.LINEAR;
	this.wrapS     = options.wrapS || gl.MIRRORED_REPEAT;
	this.wrapT     = options.wrapT || gl.MIRRORED_REPEAT;

	if(!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
		this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;

		if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
			this.minFilter = gl.LINEAR;
		}
	} 

	this._init();
};

var p = FrameBuffer.prototype;

p._init = function() {
	this.texture            = gl.createTexture();
	
	this.glTexture			= new GLTexture(this.texture, true);
	
	this.frameBuffer        = gl.createFramebuffer();		
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
	this.frameBuffer.width  = this.width;
	this.frameBuffer.height = this.height;

	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	if(GL.depthTextureExt) {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	} else {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	}
	
	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	// if(this.magFilter == gl.NEAREST && this.minFilter == gl.NEAREST) {
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	// 	console.debug("Both Nearest", this.floatTextureExt);
	// } else {
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	// }

	if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	if(GL.depthTextureExt === null) {
		var renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.frameBuffer.width, this.frameBuffer.height);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
		// gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);	
		// if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
	 //      throw new Error('Rendering to this texture is not supported (incomplete framebuffer)');
	 //    }

	 	// gl.renderbufferStorage( gl.RENDERBUFFER, gl.RGBA4, this.frameBuffer.width, this.frameBuffer.height );
	} else {
		this.depthTexture       = gl.createTexture();
		this.glDepthTexture		= new GLTexture(this.depthTexture, true);

		gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};


p.bind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
};


p.unbind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
};


p.getTexture = function() {
	return this.glTexture;
};


p.getDepthTexture = function() {
	return this.glDepthTexture;
};


p.destroy = function() {
	gl.deleteFramebuffer(this.frameBuffer);

	this.glTexture.destroy();
	if(this.glDepthTexture) {
		this.glDepthTexture.destroy();
	}
};

module.exports = FrameBuffer;
},{"./GLTexture":11,"./GLTools":12}],10:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var gl;
var ShaderLibs = _dereq_("./ShaderLibs");

var addLineNumbers = function ( string ) {
	var lines = string.split( '\n' );
	for ( var i = 0; i < lines.length; i ++ ) {
		lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];
	}
	return lines.join( '\n' );
};

var GLShader = function(aVertexShaderId, aFragmentShaderId) {
	gl              	 = GL.gl;
	this.idVertex        = aVertexShaderId;
	this.idFragment      = aFragmentShaderId;
	this.parameters      = [];
	this.uniformValues   = {};
	
	this.uniformTextures = [];
	
	this.vertexShader    = undefined;
	this.fragmentShader  = undefined;
	this._isReady        = false;
	this._loadedCount    = 0;

	if(aVertexShaderId === undefined || aVertexShaderId === null ) {
		this.createVertexShaderProgram(ShaderLibs.getShader("copyVert"));
	}

	if(aFragmentShaderId === undefined || aVertexShaderId === null ) {
		this.createFragmentShaderProgram(ShaderLibs.getShader("copyFrag"));
	}

	this.init();
};


var p = GLShader.prototype;

p.init = function() {
	if(this.idVertex && this.idVertex.indexOf("main(void)") > -1) {
		this.createVertexShaderProgram(this.idVertex);
	} else {
		this.getShader(this.idVertex, true);	
	}
	
	if(this.idFragment && this.idFragment.indexOf("main(void)") > -1) {
		this.createFragmentShaderProgram(this.idFragment);
	} else {
		this.getShader(this.idFragment, false);	
	}
};

p.getShader = function(aId, aIsVertexShader) {
	if(!aId) {return;}
	var req = new XMLHttpRequest();
	req.hasCompleted = false;
	var that = this;
	req.onreadystatechange = function(e) {
		if(e.target.readyState === 4) {
			if(aIsVertexShader) {
				that.createVertexShaderProgram(e.target.responseText);
			} else {
				that.createFragmentShaderProgram(e.target.responseText);
			}
		}
	};
	req.open("GET", aId, true);
	req.send(null);
};

p.createVertexShaderProgram = function(aStr) {
	if(!gl) {	return;	}
	var shader = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(shader, aStr);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.warn("Error in Vertex Shader : ", this.idVertex, ":", gl.getShaderInfoLog(shader));
		console.log(addLineNumbers(aStr));
		return null;
	}

	this.vertexShader = shader;
	
	if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
		this.attachShaderProgram();
	}

	this._loadedCount++;
};


p.createFragmentShaderProgram = function(aStr) {
	if(!gl) {	return;	}
	var shader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(shader, aStr);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.warn("Error in Fragment Shader: ", this.idFragment, ":" , gl.getShaderInfoLog(shader));
		console.log(addLineNumbers(aStr));
		return null;
	}

	this.fragmentShader = shader;

	if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
		this.attachShaderProgram();
	}

	this._loadedCount++;
};

p.attachShaderProgram = function() {
	this._isReady = true;
	this.shaderProgram = gl.createProgram();
	gl.attachShader(this.shaderProgram, this.vertexShader);
	gl.attachShader(this.shaderProgram, this.fragmentShader);
	gl.linkProgram(this.shaderProgram);
};

p.bind = function() {
	if(!this._isReady) {return;}
	gl.useProgram(this.shaderProgram);

	if(this.shaderProgram.pMatrixUniform === undefined) {	this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");}
	if(this.shaderProgram.mvMatrixUniform === undefined) {	this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");}

	GL.setShader(this);
	GL.setShaderProgram(this.shaderProgram);

	this.uniformTextures = [];
};

p.isReady = function() {	return this._isReady;	};


p.clearUniforms = function() {
	this.parameters    = [];
	this.uniformValues = {};
};

p.uniform = function(aName, aType, aValue) {
	if(!this._isReady) {return;}

	if(aType === "texture") {aType = "uniform1i";}

	var hasUniform = false;
	var oUniform;
	for(var i=0; i<this.parameters.length; i++) {
		oUniform = this.parameters[i];
		if(oUniform.name === aName) {
			oUniform.value = aValue;
			hasUniform = true;
			break;
		}
	}

	if(!hasUniform) {
		this.shaderProgram[aName] = gl.getUniformLocation(this.shaderProgram, aName);
		this.parameters.push({name : aName, type: aType, value: aValue, uniformLoc: this.shaderProgram[aName]});
	} else {
		this.shaderProgram[aName] = oUniform.uniformLoc;
	}


	if(aType.indexOf("Matrix") === -1) {
		if(!hasUniform) {
			var isArray = Array.isArray(aValue);
			if(isArray) {
				this.uniformValues[aName] = aValue.concat();
			} else {
				this.uniformValues[aName] = aValue;	
			}
			gl[aType](this.shaderProgram[aName], aValue);
		} else {
			// if(aName == 'position') console.log('Has uniform', this.checkUniform(aName, aType, aValue));
			if(this.checkUniform(aName, aType, aValue)) {
				gl[aType](this.shaderProgram[aName], aValue);
				// console.debug('Set uniform', aName, aType, aValue);
			}
		}
	} else {
		gl[aType](this.shaderProgram[aName], false, aValue);
		if(!hasUniform) {
			gl[aType](this.shaderProgram[aName], false, aValue);
			this.uniformValues[aName] = aValue;
			// console.debug('Set uniform', aName, aType, aValue);
		}
	}

	if(aType === "uniform1i") {
		// Texture
		this.uniformTextures[aValue] = this.shaderProgram[aName];
	}
};

p.checkUniform = function(aName, aType, aValue) {
	var isArray = Array.isArray(aValue);

	if(!this.uniformValues[aName]) {
		this.uniformValues[aName] = aValue;
		return true;
	}

	if(aType === "uniform1i") {
		this.uniformValues[aName] = aValue;
		return true;
	}

	var uniformValue = this.uniformValues[aName];
	var hasChanged = false;

	if(isArray) {
		for(var i=0; i<uniformValue.length; i++) {
			if(uniformValue[i] !== aValue[i]) {
				hasChanged = true;
				break;
			}
		}	
	} else {
		hasChanged = uniformValue !== aValue;
	}
	
	
	if(hasChanged) {
		if(isArray) {
			this.uniformValues[aName] = aValue.concat();
		} else {
			this.uniformValues[aName] = aValue;	
		}
		
	}

	return hasChanged;
};


p.unbind = function() {

};


p.destroy = function() {
	gl.detachShader(this.shaderProgram, this.vertexShader);
	gl.detachShader(this.shaderProgram, this.fragmentShader);
	gl.deleteShader(this.vertexShader);
	gl.deleteShader(this.fragmentShader);
	gl.deleteProgram(this.shaderProgram);
};

module.exports = GLShader;
},{"./GLTools":12,"./ShaderLibs":19}],11:[function(_dereq_,module,exports){
// GLTexture.js
"use strict";

var gl;
var GL = _dereq_("./GLTools");
var _isPowerOfTwo = function(x) {	
	var check = !(x === 0) && (!(x & (x - 1)));
	return check;
};
var isPowerOfTwo = function(obj) {	
	var w = obj.width || obj.videoWidth;
	var h = obj.height || obj.videoHeight;

	if(!w || !h) {return false;}

	return _isPowerOfTwo(w) && _isPowerOfTwo(h);
};

var GLTexture = function(source, isTexture, options) {
	isTexture = isTexture || false;
	options = options || {};
	gl = GL.gl;
	if(isTexture) {
		this.texture = source;
	} else {
		this._source   = source;
		this.texture   = gl.createTexture();
		this._isVideo  = (source.tagName === "VIDEO");
		this.magFilter = options.magFilter || gl.LINEAR;
		this.minFilter = options.minFilter || gl.LINEAR_MIPMAP_NEAREST;
		
		this.wrapS     = options.wrapS || gl.MIRRORED_REPEAT;
		this.wrapT     = options.wrapT || gl.MIRRORED_REPEAT;
		var width      = source.width || source.videoWidth;

		if(width) {
			if(!isPowerOfTwo(source)) {
				this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
				if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
					this.minFilter = gl.LINEAR;
				}
			} 	
		} else {
			this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
			if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
				this.minFilter = gl.LINEAR;
			}
		}

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
		
		if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
	}
};

var p = GLTexture.prototype;


p.updateTexture = function(source) {
	if(source){ this._source = source; }
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._source);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
};


p.bind = function(index) {
	if(index === undefined) {index = 0;}
	if(!GL.shader) {return;}

	gl.activeTexture(gl.TEXTURE0 + index);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(GL.shader.uniformTextures[index], index);
	this._bindIndex = index;
};


p.unbind = function() {
	gl.bindTexture(gl.TEXTURE_2D, null);
};

p.destroy = function() {
	gl.deleteTexture(this.texture);
};

module.exports = GLTexture;
},{"./GLTools":12}],12:[function(_dereq_,module,exports){
// GLTools.js
"use strict";

var glm = _dereq_("gl-matrix");

function GLTools() {
	this.aspectRatio   = 1;
	this.fieldOfView   = 45;
	this.zNear         = 1;
	this.zFar          = 1000;

	this.canvas        = null;
	this.gl            = null;

	this.shader        = null;
	this.shaderProgram = null;
}

var p = GLTools.prototype;

p.init = function(mCanvas, mWidth, mHeight, parameters) {
	if(this.canvas === null) {
		this.canvas      = mCanvas || document.createElement("canvas");
	}
	var params       = parameters || {};
	params.antialias = true;

	this.gl          = this.canvas.getContext("webgl", params) || this.canvas.getContext("experimental-webgl", params);
	console.log('GL TOOLS : ', this.gl);
	
	
	if(mWidth !== undefined && mHeight !== undefined) {
		this.setSize(mWidth, mHeight);
	} else {
		this.setSize(window.innerWidth, window.innerHeight);	
	}

	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.enable(this.gl.BLEND);
	this.gl.clearColor( 0, 0, 0, 1 );
	this.gl.clearDepth( 1 );

	this.matrix                 = glm.mat4.create();
	glm.mat4.identity(this.matrix);
	this.normalMatrix           = glm.mat3.create();
	this.depthTextureExt        = this.gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
	this.floatTextureExt        = this.gl.getExtension("OES_texture_float"); // Or browser-appropriate prefix
	this.floatTextureLinearExt  = this.gl.getExtension("OES_texture_float_linear"); // Or browser-appropriate prefix
	this.standardDerivativesExt = this.gl.getExtension("OES_standard_derivatives"); // Or browser-appropriate prefix

	this.enabledVertexAttribute = [];
	this.enableAlphaBlending();
	this._viewport = [0, 0, this.width, this.height];
};


p.getGL = function() {	return this.gl;	};

p.setShader = function(aShader) {
	this.shader = aShader;
};

p.setShaderProgram = function(aShaderProgram) {
	this.shaderProgram = aShaderProgram;
};

p.setViewport = function(aX, aY, aW, aH) {
	var hasChanged = false;
	if(aX!==this._viewport[0]) {hasChanged = true;}
	if(aY!==this._viewport[1]) {hasChanged = true;}
	if(aW!==this._viewport[2]) {hasChanged = true;}
	if(aH!==this._viewport[3]) {hasChanged = true;}

	if(hasChanged) {
		this.gl.viewport(aX, aY, aW, aH);
		this._viewport = [aX, aY, aW, aH];
	}
};

p.setMatrices = function(aCamera) {
	this.camera = aCamera;	
};

p.rotate = function(aRotation) {
	glm.mat4.copy(this.matrix, aRotation);

	glm.mat4.multiply(this.matrix, this.camera.getMatrix(), this.matrix);
	glm.mat3.fromMat4(this.normalMatrix, this.matrix);
	glm.mat3.invert(this.normalMatrix, this.normalMatrix);
	glm.mat3.transpose(this.normalMatrix, this.normalMatrix);
};


//	BLEND MODES
p.enableAlphaBlending = function() {
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);	
};

p.enableAdditiveBlending = function() {
	this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
};

//	CLEAR CANVAS
p.clear = function(r, g, b, a) {
	this.gl.clearColor( r, g, b, a );
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

//	DRAWING ELEMENTS
p.draw = function(aMesh) {
	if(!this.shaderProgram) {
		console.warn("Shader program not ready yet");
		return;
	}

	if(!this.shaderProgram.pMatrixValue) {
		this.shaderProgram.pMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.camera.projection || this.camera.getMatrix() );
		glm.mat4.copy(this.shaderProgram.pMatrixValue, this.camera.projection || this.camera.getMatrix());
	} else {
		var pMatrix = this.camera.projection || this.camera.getMatrix();
		if(glm.mat4.str(this.shaderProgram.pMatrixValue) !== glm.mat4.str(pMatrix)) {
			this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.camera.projection || this.camera.getMatrix() );
			glm.mat4.copy(this.shaderProgram.pMatrixValue, pMatrix);
		}
	}

	if(!this.shaderProgram.mvMatrixValue) {
		this.shaderProgram.mvMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.matrix );
		glm.mat4.copy(this.shaderProgram.mvMatrixValue, this.matrix);
	} else {
		if(glm.mat4.str(this.shaderProgram.mvMatrixValue) !== glm.mat4.str(this.matrix)) {
			this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.matrix );
			glm.mat4.copy(this.shaderProgram.mvMatrixValue, this.matrix);
		}
	}


	// 	VERTEX POSITIONS
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.vBufferPos);
	var vertexPositionAttribute = getAttribLoc(this.gl, this.shaderProgram, "aVertexPosition");
	this.gl.vertexAttribPointer(vertexPositionAttribute, aMesh.vBufferPos.itemSize, this.gl.FLOAT, false, 0, 0);
	if(this.enabledVertexAttribute.indexOf(vertexPositionAttribute) === -1) {
		this.gl.enableVertexAttribArray(vertexPositionAttribute);	
		this.enabledVertexAttribute.push(vertexPositionAttribute);
	}
	

	//	TEXTURE COORDS
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.vBufferUV);
	var textureCoordAttribute = getAttribLoc(this.gl, this.shaderProgram, "aTextureCoord");
	this.gl.vertexAttribPointer(textureCoordAttribute, aMesh.vBufferUV.itemSize, this.gl.FLOAT, false, 0, 0);
	
	if(this.enabledVertexAttribute.indexOf(textureCoordAttribute) === -1) {
		this.gl.enableVertexAttribArray(textureCoordAttribute);
		this.enabledVertexAttribute.push(textureCoordAttribute);
	}

	//	INDICES
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, aMesh.iBuffer);

	//	EXTRA ATTRIBUTES
	for(var i=0; i<aMesh.extraAttributes.length; i++) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.extraAttributes[i].buffer);
		var attrPosition = getAttribLoc(this.gl, this.shaderProgram, aMesh.extraAttributes[i].name);
		this.gl.vertexAttribPointer(attrPosition, aMesh.extraAttributes[i].itemSize, this.gl.FLOAT, false, 0, 0);
		// this.gl.enableVertexAttribArray(attrPosition);	
		if(this.enabledVertexAttribute.indexOf(attrPosition) === -1) {
			this.gl.enableVertexAttribArray(attrPosition);
			this.enabledVertexAttribute.push(attrPosition);
		}	
	}

	//	DRAWING
	if(aMesh.drawType === this.gl.POINTS ) {
		this.gl.drawArrays(aMesh.drawType, 0, aMesh.vertexSize);	
	} else {
		this.gl.drawElements(aMesh.drawType, aMesh.iBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);	
	}


	function getAttribLoc(gl, shaderProgram, name) {
		if(shaderProgram.cacheAttribLoc === undefined) {	shaderProgram.cacheAttribLoc = {};	}
		if(shaderProgram.cacheAttribLoc[name] === undefined) {
			shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
		}

		return shaderProgram.cacheAttribLoc[name];
	}

};

//	CANVAS RESIZING
p.setSize = function(mWidth, mHeight) {
	this._width = mWidth;
	this._height = mHeight;

	this.canvas.width      = this._width;
	this.canvas.height     = this._height;
	this.gl.viewportWidth  = this._width;
	this.gl.viewportHeight = this._height;

	this.gl.viewport(0, 0, this._width, this._height);
	this.aspectRatio       = this._width / this._height;
};


p.__defineGetter__("width", function() {
	return this._width;
});

p.__defineGetter__("height", function() {
	return this._height;
});

p.__defineGetter__("viewport", function() {
	return this._viewport;
});

var instance = null;

GLTools.getInstance = function() {
	if(instance === null) {
		instance = new GLTools();
	}
	return instance;
};


module.exports = GLTools.getInstance();
},{"gl-matrix":2}],13:[function(_dereq_,module,exports){
"use strict";

var Face = _dereq_("./Face");
var GL = _dereq_("./GLTools");
var glm = _dereq_("gl-matrix");

var Mesh = function(aVertexSize, aIndexSize, aDrawType) {

	this.gl = GL.gl;
	this.vertexSize = aVertexSize;
	this.indexSize = aIndexSize;
	this.drawType = aDrawType;
	this.extraAttributes = [];
	
	this.vBufferPos = undefined;
	this._floatArrayVertex = undefined;

	this._init();
};

var p = Mesh.prototype;

p._init = function() {

};

p.bufferVertex = function(aArrayVertices, isDynamic) {
	var vertices = [];
	var drawType = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
	this._vertices = [];

	for(var i=0; i<aArrayVertices.length; i++) {
		for(var j=0; j<aArrayVertices[i].length; j++) {
			vertices.push(aArrayVertices[i][j]);
		}
		this._vertices.push(glm.vec3.clone(aArrayVertices[i]));
	}

	if(this.vBufferPos === undefined) {
		this.vBufferPos = this.gl.createBuffer();
	}
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferPos);

	if(this._floatArrayVertex === undefined) {
		this._floatArrayVertex = new Float32Array(vertices);
	} else {
		if(aArrayVertices.length !== this._floatArrayVertex.length) {
			this._floatArrayVertex = new Float32Array(vertices);
		} else {
			for(var k=0; k<aArrayVertices.length; k++) {
				this._floatArrayVertex[k] = aArrayVertices[k];
			}
		}
	}

	this.gl.bufferData(this.gl.ARRAY_BUFFER, this._floatArrayVertex, drawType);
	this.vBufferPos.itemSize = 3;
};

p.bufferTexCoords = function(aArrayTexCoords) {
	var coords = [];

	for(var i=0; i<aArrayTexCoords.length; i++) {
		for(var j=0; j<aArrayTexCoords[i].length; j++) {
			coords.push(aArrayTexCoords[i][j]);
		}
	}

	this.vBufferUV = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferUV);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coords), this.gl.STATIC_DRAW);
	this.vBufferUV.itemSize = 2;
};

p.bufferData = function(aData, aName, aItemSize, isDynamic) {
	var index = -1;
	var drawType = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
	var i=0;

	for(i=0; i<this.extraAttributes.length; i++) {
		if(this.extraAttributes[i].name === aName) {
			this.extraAttributes[i].data = aData;
			index = i;
			break;
		}
	}

	var bufferData = [];
	for(i=0; i<aData.length; i++) {
		for(var j=0; j<aData[i].length; j++) {
			bufferData.push(aData[i][j]);
		}
	}

	var buffer, floatArray;
	if(index === -1) {
		buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		floatArray = new Float32Array(bufferData);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, drawType);
		this.extraAttributes.push({name:aName, data:aData, itemSize: aItemSize, buffer:buffer, floatArray:floatArray});
	} else {
		buffer = this.extraAttributes[index].buffer;
		// console.debug("Buffer exist", buffer);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		floatArray = this.extraAttributes[index].floatArray;
		for(i=0; i<bufferData.length; i++) {
			floatArray[i] = bufferData[i];
		}
		this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, drawType);
	}

};

p.bufferIndices = function(aArrayIndices) {
	this._indices = aArrayIndices;
	this.iBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aArrayIndices), this.gl.STATIC_DRAW);
	this.iBuffer.itemSize = 1;
	this.iBuffer.numItems = aArrayIndices.length;
};


p.computeNormals = function() {
	if(this.drawType !== this.gl.TRIANGLES) {return;}

	if(this._faces === undefined) {	this._generateFaces();	}
	console.log("Start computing");

	var time = new Date().getTime();
	var j=0;

	this._normals = [];
	for(var i=0; i<this._vertices.length; i++) {
		var normal = glm.vec3.create();
		var faceCount = 0;
		for(j=0; j<this._faces.length; j++) {
			if(this._faces[j].contains(this._vertices[i])) {
				glm.vec3.add(normal, normal, this._faces[j].faceNormal);
				faceCount ++;
			}
		}

		glm.vec3.normalize(normal, normal);
		this._normals.push(normal);
	}

	this.bufferData(this._normals, "aNormal", 3);

	var totalTime = new Date().getTime() - time;
	console.log("Total Time : ", totalTime);
};


p.computeTangent = function() {
	
};


p._generateFaces = function() {
	this._faces = [];

	for(var i=0; i<this._indices.length; i+=3) {
		var p0 = this._vertices[this._indices[i+0]];
		var p1 = this._vertices[this._indices[i+1]];
		var p2 = this._vertices[this._indices[i+2]];

		this._faces.push(new Face(p0, p1, p2));
	}
};

module.exports = Mesh;
},{"./Face":8,"./GLTools":12,"gl-matrix":2}],14:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var Mesh = _dereq_("./Mesh");
var MeshUtils = {};

MeshUtils.createPlane = function(width, height, numSegments) {
	var positions = [];
	var coords = [];
	var indices = [];

	var gapX = width/numSegments;
	var gapY = height/numSegments;
	var gapUV = 1/numSegments;
	var index = 0;
	var sx = -width * 0.5;
	var sy = -height * 0.5;

	for(var i=0; i<numSegments; i++) {
		for (var j=0; j<numSegments; j++) {
			var tx = gapX * i + sx;
			var ty = gapY * j + sy;
			positions.push([tx, 		ty, 	0]);
			positions.push([tx+gapX, 	ty, 	0]);
			positions.push([tx+gapX, 	ty+gapY, 	0]);
			positions.push([tx, 		ty+gapY, 	0]);

			var u = i/numSegments;
			var v = j/numSegments;
			coords.push([u, v]);
			coords.push([u+gapUV, v]);
			coords.push([u+gapUV, v+gapUV]);
			coords.push([u, v+gapUV]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
		}
	}

	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);

	return mesh;
};

MeshUtils.createSphere = function(size, numSegments) {
	var positions = [];
	var coords = [];
	var indices = [];
	var index = 0;
	var gapUV = 1/numSegments;

	var getPosition = function(i, j) {	//	rx : -90 ~ 90 , ry : 0 ~ 360
		var rx = i/numSegments * Math.PI - Math.PI * 0.5;
		var ry = j/numSegments * Math.PI * 2;
		var r = size;
		var pos = [];
		pos[1] = Math.sin(rx) * r;
		var t = Math.cos(rx) * r;
		pos[0] = Math.cos(ry) * t;
		pos[2] = Math.sin(ry) * t;

		var precision = 10000;
		pos[0] = Math.floor(pos[0] * precision) / precision;
		pos[1] = Math.floor(pos[1] * precision) / precision;
		pos[2] = Math.floor(pos[2] * precision) / precision;

		return pos;
	};

	
	for(var i=0; i<numSegments; i++) {
		for(var j=0; j<numSegments; j++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i, j+1));

			var u = j/numSegments;
			var v = i/numSegments;
			
			
			coords.push([1.0 - u, v]);
			coords.push([1.0 - u, v+gapUV]);
			coords.push([1.0 - u - gapUV, v+gapUV]);
			coords.push([1.0 - u - gapUV, v]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
		}
	}


	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);

	return mesh;
};


MeshUtils.createCube = function(w,h,d) {
	h = h || w;
	d = d || w;

	var x = w/2;
	var y = h/2;
	var z = d/2;


	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;


	// BACK
	positions.push([-x,  y, -z]);
	positions.push([ x,  y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([-x, -y, -z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// RIGHT
	positions.push([ x,  y, -z]);
	positions.push([ x,  y,  z]);
	positions.push([ x, -y,  z]);
	positions.push([ x, -y, -z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// FRONT
	positions.push([ x,  y,  z]);
	positions.push([-x,  y,  z]);
	positions.push([-x, -y,  z]);
	positions.push([ x, -y,  z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	// LEFT
	positions.push([-x,  y,  z]);
	positions.push([-x,  y, -z]);
	positions.push([-x, -y, -z]);
	positions.push([-x, -y,  z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// TOP
	positions.push([-x,  y,  z]);
	positions.push([ x,  y,  z]);
	positions.push([ x,  y, -z]);
	positions.push([-x,  y, -z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// BOTTOM
	positions.push([-x, -y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([ x, -y,  z]);
	positions.push([-x, -y,  z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);

	return mesh;
};

module.exports = MeshUtils;
},{"./GLTools":12,"./Mesh":13}],15:[function(_dereq_,module,exports){
// ObjLoader.js

"use strict";

var GL = _dereq_("./GLTools");
var Mesh = _dereq_("./Mesh");
var gl;


function ObjLoader() {
	this._clearAll();
}


var p = ObjLoader.prototype;

p._clearAll = function() {
	this._callback      = null;
	this._callbackError = null;
	this._mesh          = [];	
};

p.load = function(url, callback, callbackError, ignoreNormals) {
	this._clearAll();
	this._ignoreNormals = ignoreNormals === undefined ? true : ignoreNormals;

	this._callback = callback;
	this._callbackError = callbackError;

	var request = new XMLHttpRequest();
	request.onreadystatechange = this._onXHTPState.bind(this);
	request.open("GET", url, true);
	request.send();
};

p._onXHTPState = function(e) {
	if(e.target.readyState === 4) {
		this._parseObj(e.target.response);
	}
};


p.parse = function(objStr, callback, callbackError, ignoreNormals) {
	this._clearAll();
	this._ignoreNormals = ignoreNormals === undefined ? true : ignoreNormals;

	this._parseObj(objStr);
};


p._parseObj = function(objStr) {
	var lines = objStr.split('\n');

	var positions    = [];
	var coords       = [];
	var finalNormals = [];
	var vertices     = [];
	var normals      = [];
	var uvs          = [];
	var indices      = [];
	var count        = 0;
	var result;

	// v float float float
	var vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// vn float float float
	var normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// vt float float
	var uv_pattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// f vertex vertex vertex ...
	var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

	// f vertex/uv vertex/uv vertex/uv ...
	var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

	// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
	var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

	// f vertex//normal vertex//normal vertex//normal ... 
	var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;


	function parseVertexIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;
	}

	function parseNormalIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;
	}

	function parseUVIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;
	}


	function addVertex(a, b ,c) {
		positions.push([vertices[a], vertices[a+1], vertices[a+2]]);
		positions.push([vertices[b], vertices[b+1], vertices[b+2]]);
		positions.push([vertices[c], vertices[c+1], vertices[c+2]]);

		indices.push(count * 3 + 0);
		indices.push(count * 3 + 1);
		indices.push(count * 3 + 2);

		count ++;
	}


	function addUV(a, b, c) {
		coords.push([uvs[a], uvs[a+1]]);
		coords.push([uvs[b], uvs[b+1]]);
		coords.push([uvs[c], uvs[c+1]]);
	}


	function addNormal(a, b, c) {
		finalNormals.push([normals[a], normals[a+1], normals[a+2]]);
		finalNormals.push([normals[b], normals[b+1], normals[b+2]]);
		finalNormals.push([normals[c], normals[c+1], normals[c+2]]);
	}

	function addFace( a, b, c, d,  ua, ub, uc, ud,  na, nb, nc, nd ) {
		var ia = parseVertexIndex( a );
		var ib = parseVertexIndex( b );
		var ic = parseVertexIndex( c );
		var id;

		if ( d === undefined ) {

			addVertex( ia, ib, ic );

		} else {

			id = parseVertexIndex( d );

			addVertex( ia, ib, id );
			addVertex( ib, ic, id );

		}


		if ( ua !== undefined ) {

			ia = parseUVIndex( ua );
			ib = parseUVIndex( ub );
			ic = parseUVIndex( uc );

			if ( d === undefined ) {

				addUV( ia, ib, ic );

			} else {

				id = parseUVIndex( ud );

				addUV( ia, ib, id );
				addUV( ib, ic, id );

			}

		}

		if ( na !== undefined ) {

			ia = parseNormalIndex( na );
			ib = parseNormalIndex( nb );
			ic = parseNormalIndex( nc );

			if ( d === undefined ) {

				addNormal( ia, ib, ic );

			} else {

				id = parseNormalIndex( nd );

				addNormal( ia, ib, id );
				addNormal( ib, ic, id );

			}

		}
	}


	for ( var i = 0; i < lines.length; i ++ ) {
		var line = lines[ i ];
		line = line.trim();

		if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

			continue;

		} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

			vertices.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			);

		} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

			normals.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			);

		} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

			uvs.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] )
			);

		} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

			addFace(
				result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
			);

		} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

			addFace(
				result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
				result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
			);

		} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {
			addFace(
				result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],
				result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],
				result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]
			);

		} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {
			addFace(
				result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
				undefined, undefined, undefined, undefined,
				result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
			);

		} 
	}

	this._generateMeshes({	
		positions:positions,
		coords:coords,
		normals:finalNormals,
		indices:indices
	});
	
};


p._generateMeshes = function(o) {
	gl = GL.gl;

	var mesh = new Mesh(o.positions.length, o.indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(o.positions);
	mesh.bufferTexCoords(o.coords);
	mesh.bufferIndices(o.indices);
	if(!this._ignoreNormals) {
		mesh.bufferData(o.normals, "aNormal", 3);
	}

	if(this._callback) {
		this._callback(mesh, o);
	}
};

var loader = new ObjLoader();

module.exports = loader;
},{"./GLTools":12,"./Mesh":13}],16:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

function QuatRotation(mListenerTarget) {
	if(mListenerTarget === undefined) {	mListenerTarget = document;	}
	this._isRotateZ     = 0;
	this.matrix         = glm.mat4.create();
	this.m              = glm.mat4.create();
	this._vZaxis        = glm.vec3.clone([0, 0, 0]);
	this._zAxis         = glm.vec3.clone([0, 0, -1]);
	this.preMouse       = {x:0, y:0};
	this.mouse          = {x:0, y:0};
	this._isMouseDown   = false;
	this._rotation      = glm.quat.clone([0, 0, 1, 0]);
	this.tempRotation   = glm.quat.clone([0, 0, 0, 0]);
	this._rotateZMargin = 0;
	this.diffX          = 0;
	this.diffY          = 0;
	this._currDiffX     = 0;
	this._currDiffY     = 0;
	this._offset        = 0.004;
	this._easing        = 0.1;
	this._slerp			= -1;
	this._isLocked 		= false;

	var that = this;
	mListenerTarget.addEventListener("mousedown", function(aEvent) { that._onMouseDown(aEvent); });
	mListenerTarget.addEventListener("touchstart", function(aEvent) {	that._onMouseDown(aEvent); });
	mListenerTarget.addEventListener("mouseup", function(aEvent) { that._onMouseUp(aEvent); });
	mListenerTarget.addEventListener("touchend", function(aEvent) { that._onMouseUp(aEvent); });
	mListenerTarget.addEventListener("mousemove", function(aEvent) { that._onMouseMove(aEvent); });
	mListenerTarget.addEventListener("touchmove", function(aEvent) { that._onMouseMove(aEvent); });
}


var p = QuatRotation.prototype;

p.inverseControl = function(value) {
	if(value === undefined) {	
		this._isInvert = true;	
	} else {
		this._isInvert = value;
	}
};

p.lock = function(value) {
	if(value === undefined) {	
		this._isLocked = true;	
	} else {	
		this._isLocked = value;	
	}
};

p.getMousePos = function(aEvent) {
	var mouseX, mouseY;

	if(aEvent.changedTouches !== undefined) {
		mouseX = aEvent.changedTouches[0].pageX;
		mouseY = aEvent.changedTouches[0].pageY;
	} else {
		mouseX = aEvent.clientX;
		mouseY = aEvent.clientY;
	}
	
	return {x:mouseX, y:mouseY};
};

p._onMouseDown = function(aEvent) {
	if(this._isLocked) {return;}
	if(this._isMouseDown) {return;}

	var mouse = this.getMousePos(aEvent);
	var tempRotation = glm.quat.clone(this._rotation);
	this._updateRotation(tempRotation);
	this._rotation = tempRotation;

	this._isMouseDown = true;
	this._isRotateZ = 0;
	this.preMouse = {x:mouse.x, y:mouse.y};

	if(mouse.y < this._rotateZMargin || mouse.y > (window.innerHeight - this._rotateZMargin) ) {	this._isRotateZ = 1;	}
	else if(mouse.x < this._rotateZMargin || mouse.x > (window.innerWidth - this._rotateZMargin) ) {	this._isRotateZ = 2;	}

	this._currDiffX = this.diffX = 0;
	this._currDiffY = this.diffY = 0;
};

p._onMouseMove = function(aEvent) {
	if(this._isLocked) {return;}
	if(aEvent.touches) {aEvent.preventDefault();}
	this.mouse = this.getMousePos(aEvent);
};

p._onMouseUp = function() {
	if(this._isLocked) {return;}
	if(!this._isMouseDown) {return;}
	this._isMouseDown = false;
};

p.setCameraPos = function(mQuat, speed) {
	speed             = speed || this._easing;
	this._easing      = speed;
	if(this._slerp > 0) {return;}
	
	var tempRotation  = glm.quat.clone(this._rotation);
	this._updateRotation(tempRotation);
	this._rotation    = glm.quat.clone(tempRotation);
	this._currDiffX   = this.diffX = 0;
	this._currDiffY   = this.diffY = 0;
	
	this._isMouseDown = false;
	this._isRotateZ   = 0;
	
	this._targetQuat  = glm.quat.clone(mQuat);
	this._slerp       = 1;
};

p.resetQuat = function() {
	this._rotation    = glm.quat.clone([0, 0, 1, 0]);
	this.tempRotation = glm.quat.clone([0, 0, 0, 0]);
	this._targetQuat  = undefined;
	this._slerp       = -1;
};

p.update = function() {
	glm.mat4.identity(this.m);

	if(this._targetQuat === undefined) { 
		glm.quat.set(this.tempRotation, this._rotation[0], this._rotation[1], this._rotation[2], this._rotation[3]);
		this._updateRotation(this.tempRotation);
	} else {
		this._slerp += (0 - this._slerp) * 0.1;

		if(this._slerp < 0.001) {
			// quat.set(this._targetQuat, this._rotation);
			glm.quat.set(this._rotation, this._targetQuat[0], this._targetQuat[1], this._targetQuat[2], this._targetQuat[3]);
			this._targetQuat = undefined;
			this._slerp = -1;
		} else {
			glm.quat.set(this.tempRotation, 0, 0, 0, 0);
			glm.quat.slerp(this.tempRotation, this._targetQuat, this._rotation, this._slerp);
		}
	}

	glm.vec3.transformQuat(this._vZaxis, this._vZaxis, this.tempRotation);

	glm.mat4.fromQuat(this.matrix, this.tempRotation);
};

p._updateRotation = function(aTempRotation) {
	if(this._isMouseDown && !this._isLocked) {
		this.diffX = -(this.mouse.x - this.preMouse.x);
		this.diffY = (this.mouse.y - this.preMouse.y);

		if(this._isInvert) {
			this.diffX = -this.diffX;
			this.diffY = -this.diffY;
		}
	}
	
	this._currDiffX += (this.diffX - this._currDiffX) * this._easing;
	this._currDiffY += (this.diffY - this._currDiffY) * this._easing;

	var angle, _quat;

	if(this._isRotateZ > 0) {
		if(this._isRotateZ === 1) {
			angle = -this._currDiffX * this._offset; 
			angle *= (this.preMouse.y < this._rotateZMargin) ? -1 : 1;
			_quat = glm.quat.clone( [0, 0, Math.sin(angle), Math.cos(angle) ] );
			glm.quat.multiply(_quat, aTempRotation, _quat);
		} else {
			angle = -this._currDiffY * this._offset; 
			angle *= (this.preMouse.x < this._rotateZMargin) ? 1 : -1;
			_quat = glm.quat.clone( [0, 0, Math.sin(angle), Math.cos(angle) ] );
			glm.quat.multiply(_quat, aTempRotation, _quat);
		}
	} else {
		var v = glm.vec3.clone([this._currDiffX, this._currDiffY, 0]);
		var axis = glm.vec3.create();
		glm.vec3.cross(axis, v, this._zAxis);
		glm.vec3.normalize(axis, axis);
		angle = glm.vec3.length(v) * this._offset;
		_quat = glm.quat.clone( [Math.sin(angle) * axis[0], Math.sin(angle) * axis[1], Math.sin(angle) * axis[2], Math.cos(angle) ] );
		glm.quat.multiply(aTempRotation, _quat, aTempRotation);
	}

};


module.exports = QuatRotation;
},{"gl-matrix":2}],17:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var QuatRotation = _dereq_("./QuatRotation");
var CameraOrtho = _dereq_("./CameraOrtho");
var SimpleCamera = _dereq_("./SimpleCamera");
var glm = _dereq_("gl-matrix");

var Scene = function() {
	if(GL.canvas === null) {return;}
	this.gl = GL.gl;
	this._children = [];
	this._init();
};

var p = Scene.prototype;

p._init = function() {
    this.camera = new SimpleCamera(GL.canvas);
	this.camera.setPerspective(45*Math.PI/180, GL.aspectRatio, .1, 1000);
	this.camera.lockRotation();

	var eye                = glm.vec3.clone([0, 0, 500]  );
	var center             = glm.vec3.create( );
	var up                 = glm.vec3.clone( [0,-1,0] );
	this.camera.lookAt(eye, center, up);
	
	this.sceneRotation     = new QuatRotation(GL.canvas);
	this.rotationFront     = glm.mat4.create();
	glm.mat4.identity(this.rotationFront);
	
	this.cameraOrtho       = new CameraOrtho();
	this.cameraOrthoScreen = new CameraOrtho();
	this.cameraOtho        = this.cameraOrtho;

	this.cameraOrtho.lookAt(eye, center, up);
	this.cameraOrtho.ortho( 1, -1, 1, -1);

	this.cameraOrthoScreen.lookAt(eye, center, up);
	this.cameraOrthoScreen.ortho( 0, GL.width, GL.height, 0);

	// In SuperClass should call following functions.
	this._initTextures();
	this._initViews();

	window.addEventListener("resize", this._onResize.bind(this));
};

p._initTextures = function() {
	// console.log("Should be overwritten by SuperClass");
};

p._initViews = function() {
	// console.log("Should be overwritten by SuperClass");
};

p.loop = function() {
	this.update();
	this.render();
};

p.update = function() {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.sceneRotation.update();
	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.camera );
	GL.rotate(this.sceneRotation.matrix);

};

p.resize = function() {
	// if(this.camera.resize) {
	// 	this.camera.resize(GL.aspectRatio);
	// }
};

p.render = function() {

};

p._onResize = function() {
	this.cameraOrthoScreen.ortho( 0, GL.width, GL.height, 0);
};

module.exports = Scene;
},{"./CameraOrtho":4,"./GLTools":12,"./QuatRotation":16,"./SimpleCamera":20,"gl-matrix":2}],18:[function(_dereq_,module,exports){
// Scheduler.js

"use strict";

if(window.requestAnimFrame === undefined) {
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
		window.setTimeout(callback, 1000 / 60);
		};
	})();
}

function Scheduler() {
	this.FRAMERATE = 60;
	this._delayTasks = [];
	this._nextTasks = [];
	this._deferTasks = [];
	this._highTasks = [];
	this._usurpTask = [];
	this._enterframeTasks = [];
	this._idTable = 0;

	window.requestAnimFrame( this._loop.bind(this) );
}

var p = Scheduler.prototype;

p._loop = function() {
	window.requestAnimFrame( this._loop.bind(this) );
	this._process();
};


p._process = function() {
	var i = 0,
		task, interval, current;
	for ( i=0; i<this._enterframeTasks.length; i++) {
		task = this._enterframeTasks[i];
		if(task !== null && task !== undefined) {
			task.func.apply(task.scope, task.params);
		}
	}
	
	while ( this._highTasks.length > 0) {
		task = this._highTasks.pop();
		task.func.apply(task.scope, task.params);
	}
	

	var startTime = new Date().getTime();

	for ( i=0; i<this._delayTasks.length; i++) {
		task = this._delayTasks[i];
		if(startTime-task.time > task.delay) {
			task.func.apply(task.scope, task.params);
			this._delayTasks.splice(i, 1);
		}
	}

	startTime = new Date().getTime();
	interval = 1000 / this.FRAMERATE;
	while(this._deferTasks.length > 0) {
		task = this._deferTasks.shift();
		current = new Date().getTime();
		if(current - startTime < interval ) {
			task.func.apply(task.scope, task.params);
		} else {
			this._deferTasks.unshift(task);
			break;
		}
	}


	startTime = new Date().getTime();
	interval = 1000 / this.FRAMERATE;
	while(this._usurpTask.length > 0) {
		task = this._usurpTask.shift();
		current = new Date().getTime();
		if(current - startTime < interval ) {
			task.func.apply(task.scope, task.params);
		} else {
			// this._usurpTask.unshift(task);
			break;
		}
	}



	this._highTasks = this._highTasks.concat(this._nextTasks);
	this._nextTasks = [];
	this._usurpTask = [];
};


p.addEF = function(scope, func, params) {
	params = params || [];
	var id = this._idTable;
	this._enterframeTasks[id] = {scope:scope, func:func, params:params};
	this._idTable ++;
	return id;
};


p.removeEF = function(id) {
	if(this._enterframeTasks[id] !== undefined) {
		this._enterframeTasks[id] = null;
	}
	return -1;
};


p.delay = function(scope, func, params, delay) {
	var time = new Date().getTime();
	var t = {scope:scope, func:func, params:params, delay:delay, time:time};
	this._delayTasks.push(t);
};


p.defer = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._deferTasks.push(t);
};


p.next = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._nextTasks.push(t);
};


p.usurp = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._usurpTask.push(t);
};


var instance = null;

Scheduler.getInstance = function() {
	if(instance === null) {
		instance = new Scheduler();
	}
	return instance;
};

module.exports = Scheduler.getInstance();
},{}],19:[function(_dereq_,module,exports){
"use strict";


var ShaderLibs = function() { };

ShaderLibs.shaders = {};

ShaderLibs.shaders.copyVert = "#define GLSLIFY 1\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

ShaderLibs.shaders.generalVert = "#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    vec3 pos = aVertexPosition;\n    pos *= scale;\n    pos += position;\n    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

ShaderLibs.shaders.copyFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n}";

ShaderLibs.shaders.alphaFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME TEXTURE_WITH_ALPHA\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n    gl_FragColor.a *= opacity;\n}";

ShaderLibs.shaders.simpleColorFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_COLOR_FRAGMENT\n\nprecision highp float;\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = vec4(color, opacity);\n}";

ShaderLibs.shaders.depthFrag = "#define GLSLIFY 1\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float n;\nuniform float f;\n\nfloat getDepth(float z) {\n\treturn (6.0 * n) / (f + n - z*(f-n));\n}\n\nvoid main(void) {\n    float r = texture2D(texture, vTextureCoord).r;\n    float grey = getDepth(r);\n    gl_FragColor = vec4(grey, grey, grey, 1.0);\n}";


ShaderLibs.getShader = function(mId) {
	return this.shaders[mId];
};

ShaderLibs.get = ShaderLibs.getShader;
module.exports = ShaderLibs;
},{}],20:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");
var CameraPerspective = _dereq_("./CameraPerspective");
var EaseNumber = _dereq_("./EaseNumber");

var SimpleCamera = function(mListenerTarget) {
	this._listenerTarget = mListenerTarget || window;
	CameraPerspective.call(this);
	// this._isLocked = false;
	this._init();
};

var p = SimpleCamera.prototype = new CameraPerspective();
var s = CameraPerspective.prototype;

p._init = function() {
	this.radius          = new EaseNumber(5);
	this.position[2]     = this.radius.value;
	this.center          = glm.vec3.create( );
	this.up              = glm.vec3.clone( [0,0,0] );
	this.lookAt(this.position, this.center, this.up);
	this._mouse          = {};
	this._preMouse       = {};
	this._isMouseDown    = false;
	
	this._rx             = new EaseNumber(0);
	this._rx.limit(-Math.PI/2, Math.PI/2);
	this._ry             = new EaseNumber(0);
	this._preRX          = 0;
	this._preRY          = 0;
	// this._isLocked       = false;
	this._isLockZoom 	 = false;
	this._isLockRotation = false;
	this._isInvert       = false;

	this._listenerTarget.addEventListener("mousewheel", this._onWheel.bind(this));
	this._listenerTarget.addEventListener("DOMMouseScroll", this._onWheel.bind(this));

	this._listenerTarget.addEventListener("mousedown", this._onMouseDown.bind(this));
	this._listenerTarget.addEventListener("touchstart", this._onMouseDown.bind(this));
	this._listenerTarget.addEventListener("mousemove", this._onMouseMove.bind(this));
	this._listenerTarget.addEventListener("touchmove", this._onMouseMove.bind(this));
	window.addEventListener("mouseup", this._onMouseUp.bind(this));
	window.addEventListener("touchend", this._onMouseUp.bind(this));
};

p.inverseControl = function(value) {
	if(value === undefined) {
		this._isInvert = true;
	} else {
		this._isInvert = value;
	}
};

p.lock = function(value) {
	if(value === undefined) {
		// this._isLocked = true;
		this._isLockZoom = true;
		this._isLockRotation = true;
	} else {
		this._isLockZoom = value;
		this._isLockRotation = value;
	}
};

p.lockRotation = function(value) {
	if(value === undefined) {
		this._isLockRotation = true;
	} else {
		this._isLockRotation = value;
	}
};

p.lockZoom = function(value) {
	this._isLockZoom = value === undefined ? true : value;
};

p._onMouseDown = function(mEvent) {
	if(this._isLockRotation) {return;}
	this._isMouseDown = true;
	getMouse(mEvent, this._mouse);
	getMouse(mEvent, this._preMouse);
	this._preRX = this._rx.targetValue;
	this._preRY = this._ry.targetValue;
};


p._onMouseMove = function(mEvent) {
	if(this._isLockRotation) {return;}
	getMouse(mEvent, this._mouse);
	if(mEvent.touches) {mEvent.preventDefault();}
	if(this._isMouseDown) {
		var diffX = this._mouse.x - this._preMouse.x;
		if(this._isInvert) {diffX *= -1;}
		this._ry.value = this._preRY - diffX * 0.01;

		var diffY = this._mouse.y - this._preMouse.y;
		if(this._isInvert) {diffY *= -1;}
		this._rx.value = this._preRX - diffY * 0.01;

		// if(this._rx.targetValue > Math.PI * 0.5) {this._rx.targetValue = Math;	}
	}
};


p._onMouseUp = function() {
	if(this._isLockRotation) {return;}
	this._isMouseDown = false;
	// getMouse(mEvent, this._mouse);
};


p._onWheel = function(aEvent) {
	if(this._isLockZoom) {	return;	}
	var w = aEvent.wheelDelta;
	var d = aEvent.detail;
	var value = 0;
	if (d){
		if (w) {
			value = w/d/40*d>0?1:-1; // Opera
		} else {
			value = -d/3;              // Firefox;         TODO: do not /3 for OS X
		}
	} else {
		value = w/120; 
	}

	// this._targetRadius -= value * 5;
	this.radius.add( -value * 5);
	
};


p.getMatrix = function() {
	this._updateCameraPosition();
	this.lookAt(this.position, this.center, this.up);
	return s.getMatrix.call(this);
};


p._updateCameraPosition = function() {
  	this.position[2] 	= this.radius.value;

	this.position[1] = Math.sin(this._rx.value) * this.radius.value;
	var tr = Math.cos(this._rx.value) * this.radius.value;
	this.position[0] = Math.cos(this._ry.value + Math.PI*0.5) * tr;
	this.position[2] = Math.sin(this._ry.value + Math.PI*0.5) * tr;
};


var getMouse = function(mEvent, mTarget) {
	var o = mTarget || {};
	if(mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};


p.__defineGetter__("rx", function() {
	return this._rx.targetValue;
});
 
p.__defineSetter__("rx", function(mValue) {
	this._rx.value = mValue;
});

p.__defineGetter__("ry", function() {
	return this._ry.targetValue;
});
 
p.__defineSetter__("ry", function(mValue) {
	this._ry.value = mValue;
});

module.exports = SimpleCamera;
},{"./CameraPerspective":5,"./EaseNumber":6,"gl-matrix":2}],21:[function(_dereq_,module,exports){
"use strict";

var SimpleImageLoader = function() {
	this._imgs             = {};
	this._loadedCount      = 0;
	this._toLoadCount      = 0;
	this._scope            = undefined;
	this._callback         = undefined;
	this._callbackProgress = undefined;
};

var p = SimpleImageLoader.prototype;


p.load = function(imgs, scope, callback, progressCallback) {
	this._imgs = {};
	this._loadedCount = 0;
	this._toLoadCount = imgs.length;
	this._scope = scope;
	this._callback = callback;
	this._callbackProgress = progressCallback;

	this._imgLoadedBind = this._onImageLoaded.bind(this);

	for ( var i=0; i<imgs.length ; i++) {
		var img         = new Image();
		img.onload      = this._imgLoadedBind;
		var path        = imgs[i];
		var tmp         = path.split("/");
		var ref         = tmp[tmp.length-1].split(".")[0];
		this._imgs[ref] = img;
		img.src         = path;
	}
};


p._onImageLoaded = function() {
	this._loadedCount++;

	if(this._loadedCount === this._toLoadCount) {
		this._callback.call(this._scope, this._imgs);
	} else {
		var p = this._loadedCount / this._toLoadCount;
		if(this._callbackProgress) {
			this._callbackProgress.call(this._scope, p);
		}
	}
};

module.exports = SimpleImageLoader;
},{}],22:[function(_dereq_,module,exports){
// View.js
"use strict";

var GLShader = _dereq_("./GLShader");

var View = function(aPathVert, aPathFrag) {
	this.shader = new GLShader(aPathVert, aPathFrag);
	this._init();
};

var p = View.prototype;

p._init = function() {
	// console.log("Should be overwritten by SuperClass");
};

p.render = function() {
	// console.log("Should be overwritten by SuperClass");
};

module.exports = View;


},{"./GLShader":10}],23:[function(_dereq_,module,exports){
// ViewAxis.js

"use strict";
var GL = _dereq_("./GLTools");
var View = _dereq_("./View");
var Mesh = _dereq_("./Mesh");

var vertShader = "precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}";
var fragShader = "precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}";

var ViewAxis = function(lineWidth, mFragShader) {
	this.lineWidth = lineWidth === undefined ? 2.0 : lineWidth;
	var fs = mFragShader === undefined ? fragShader : mFragShader;
	View.call(this, vertShader, fs);
};

var p = ViewAxis.prototype = new View();

p._init = function() {
	// this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);

	var positions = [];
	var colors = [];
	var coords = [];
	var indices = [0, 1, 2, 3, 4, 5];
	var r = 9999;

	positions.push([-r,  0,  0]);
	positions.push([ r,  0,  0]);
	positions.push([ 0, -r,  0]);
	positions.push([ 0,  r,  0]);
	positions.push([ 0,  0, -r]);
	positions.push([ 0,  0,  r]);


	colors.push([1, 0, 0]);
	colors.push([1, 0, 0]);
	colors.push([0, 1, 0]);
	colors.push([0, 1, 0]);
	colors.push([0, 0, 1]);
	colors.push([0, 0, 1]);


	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);


	this.mesh = new Mesh(positions.length, indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(colors, "aColor", 3, false);
};

p.render = function() {
	if(!this.shader.isReady()) {return;}

	this.shader.bind();
	GL.gl.lineWidth(this.lineWidth);
	GL.draw(this.mesh);
	GL.gl.lineWidth(1.0);
};

module.exports = ViewAxis;

},{"./GLTools":12,"./Mesh":13,"./View":22}],24:[function(_dereq_,module,exports){
"use strict";

var View = _dereq_("./View");
var GL = _dereq_("./GLTools");
var MeshUtils = _dereq_("./MeshUtils");

var ViewCopy = function(aPathVert, aPathFrag) {
	View.call(this, aPathVert, aPathFrag);
};

var p = ViewCopy.prototype = new View();

p._init = function() {
	if(!GL.gl) { return;	}
	this.mesh = MeshUtils.createPlane(2, 2, 1);
};

p.render = function(aTexture) {
	if(!this.shader.isReady()) {return;}
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	// console.log('Render', aTexture);
	aTexture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewCopy;

},{"./GLTools":12,"./MeshUtils":14,"./View":22}],25:[function(_dereq_,module,exports){
// ViewDotPlanes.js

"use strict";

var GL = _dereq_("./GLTools");
var View = _dereq_("./View");
var ShaderLibs = _dereq_("./ShaderLibs");
var Mesh = _dereq_("./Mesh");

// var vertShader = "precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}";
// var fragShader = "precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}";

var ViewDotPlanes = function(color, fragShader) {
	var grey = 0.75;
	this.color = color === undefined ? [grey, grey, grey] : color;
	var fs = fragShader === undefined ? ShaderLibs.get("simpleColorFrag") : fragShader;
	View.call(this, null, fs);
};

var p = ViewDotPlanes.prototype = new View();

p._init = function() {
	var positions = [];
	var coords = [];
	var indices = [];
	var index = 0;


	var numDots = 100;
	var size = 3000;
	var gap = size / numDots;
	var i, j;


	for(i=-size/2; i<size; i+=gap) {
		for(j=-size/2; j<size; j+=gap) {
			positions.push([i, j, 0]);
			coords.push([0, 0]);
			indices.push(index);
			index++;

			positions.push([i, 0, j]);
			coords.push([0, 0]);
			indices.push(index);
			index++;
		}
	}

	this.mesh = new Mesh(positions.length, indices.length, GL.gl.DOTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewDotPlanes;

},{"./GLTools":12,"./Mesh":13,"./ShaderLibs":19,"./View":22}]},{},[1])(1)
});

;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[7]-m[5])*fRoot;
        out[1] = (m[2]-m[6])*fRoot;
        out[2] = (m[3]-m[1])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[k*3+j] - m[j*3+k]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})(this);

},{}],3:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

var Camera = function() {
	this.matrix = glm.mat4.create();
	glm.mat4.identity(this.matrix);

	this.position = glm.vec3.create();
};

var p = Camera.prototype;

p.lookAt = function(aEye, aCenter, aUp) {
	glm.vec3.copy(this.position, aEye);
	glm.mat4.identity(this.matrix);
	glm.mat4.lookAt(this.matrix, aEye, aCenter, aUp);
};

p.getMatrix = function() {
	return this.matrix;
};

module.exports = Camera;
},{"gl-matrix":2}],4:[function(_dereq_,module,exports){
// CameraOrtho.js

"use strict";

var Camera = _dereq_("./Camera");
var glm = _dereq_("gl-matrix");


var CameraOrtho = function() {
	Camera.call(this);

	var eye            = glm.vec3.clone([0, 0, 500]  );
	var center         = glm.vec3.create( );
	var up             = glm.vec3.clone( [0,-1,0] );
	this.lookAt(eye, center, up);

	this.projection = glm.mat4.create();
};

var p = CameraOrtho.prototype = new Camera();


p.setBoundary = function(left, right, top, bottom) {
	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;
	glm.mat4.ortho(this.projection, left, right, top, bottom, 0, 10000);
};


p.ortho = p.setBoundary;

p.getMatrix = function() {
	return this.matrix;
};


p.resize = function() {
	glm.mat4.ortho(this.projection, this.left, this.right, this.top, this.bottom, 0, 10000);
};


module.exports = CameraOrtho;
},{"./Camera":3,"gl-matrix":2}],5:[function(_dereq_,module,exports){
// CameraPerspective.js
"use strict";

var Camera = _dereq_("./Camera");
var glm = _dereq_("gl-matrix");

var CameraPerspective = function() {
	Camera.call(this);

	this.projection = glm.mat4.create();
	this.mtxFinal = glm.mat4.create();
};

var p = CameraPerspective.prototype = new Camera();

p.setPerspective = function(aFov, aAspectRatio, aNear, aFar) {
	this._fov = aFov;
	this._near = aNear;
	this._far = aFar;
	this._aspect = aAspectRatio;
	glm.mat4.perspective(this.projection, aFov, aAspectRatio, aNear, aFar);
};

p.getMatrix = function() {
	// mat4.multiply(this.mtxFinal, this.projection, this.matrix);
	return this.matrix;
};

p.resize = function(aAspectRatio) {
	this._aspect = aAspectRatio;
	glm.mat4.perspective(this.projection, this._fov, aAspectRatio, this._near, this._far);
};

p.__defineGetter__("near", function() {
	return this._near;
});

p.__defineGetter__("far", function() {
	return this._far;
});

module.exports = CameraPerspective;
},{"./Camera":3,"gl-matrix":2}],6:[function(_dereq_,module,exports){
// EaseNumber.js

"use strict";

var Scheduler = _dereq_("./Scheduler");

function EaseNumber(mValue, mEasing) {
	this._easing = mEasing || 0.1;
	this._value = mValue;
	this._targetValue = mValue;

	Scheduler.addEF(this, this._update);
}

var p = EaseNumber.prototype;


p._update = function() {
	this._checkLimit();
	this._value += (this._targetValue - this._value) * this._easing;	
};


p.setTo = function(mValue) {
	this._targetValue = this._value = mValue;
};


p.add = function(mAdd) {
	this._targetValue += mAdd;
};

p.limit = function(mMin, mMax) {
	this._min = mMin;
	this._max = mMax;

	this._checkLimit();
};

p.setEasing = function(mValue) {
	this._easing = mValue;
};

p._checkLimit = function() {
	if(this._min !== undefined && this._targetValue < this._min) {
		this._targetValue = this._min;
	} 

	if(this._max !== undefined && this._targetValue > this._max) {
		this._targetValue = this._max;
	} 
};


p.__defineGetter__("value", function() {
	return this._value;
});


p.__defineGetter__("targetValue", function() {
	return this._targetValue;
});


p.__defineSetter__("value", function(mValue) {
	this._targetValue = mValue;
});


module.exports = EaseNumber;
},{"./Scheduler":18}],7:[function(_dereq_,module,exports){
// EventDispatcher.js

"use strict";

var supportsCustomEvents = true;
try {
	var newTestCustomEvent = document.createEvent("CustomEvent");
	newTestCustomEvent = null;
} catch(e){
	supportsCustomEvents = false;
}

function EventDispatcher() {
	this._eventListeners = null;
}


var p = EventDispatcher.prototype;


p.addEventListener = function(aEventType, aFunction) {

	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	if(!this._eventListeners[aEventType]){
		this._eventListeners[aEventType] = [];
	}
	this._eventListeners[aEventType].push(aFunction);
	
	return this;
};

p.removeEventListener = function(aEventType, aFunction) {
	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	var currentArray = this._eventListeners[aEventType];
	
	if (typeof(currentArray) === "undefined") {
		// console.warn("EventDispatcher :: removeEventListener :: Tried to remove an event handler (for " + aEventType +") that doesn't exist");
		return this;
	}
	
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++){
		if(currentArray[i] === aFunction){
			currentArray.splice(i, 1);
			i--;
			currentArrayLength--;
		}
	}
	return this;
};

p.dispatchEvent = function(aEvent) {
	if(this._eventListeners === null) {
		this._eventListeners = {};
	}
	var eventType = aEvent.type;
	
	try {
		if(aEvent.target === null) {
			aEvent.target = this;
		}
		aEvent.currentTarget = this;
	}
	catch(theError) {
		// console.error("Couldn't set targets for current event. " + aEvent.message);
		//MENOTE: sometimes Firefox can't set the target
		var newEvent = {"type" : eventType, "detail" : aEvent.detail, "dispatcher" : this };
		return this.dispatchEvent(newEvent);
	}
	
	//console.log(eventType, this._eventListeners[eventType], this._eventListeners[eventType].length);
	var currentEventListeners = this._eventListeners[eventType];
	if(currentEventListeners !== null && currentEventListeners !== undefined) {
		var currentArray = this._copyArray(currentEventListeners);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++){
			var currentFunction = currentArray[i];
			//console.log(currentFunction);
			//console.log(eventType, i, currentArray.length);
			currentFunction.call(this, aEvent);
		}
	}
	return this;
};

p.dispatchCustomEvent = function(aEventType, aDetail) {
	var newEvent;
	if (supportsCustomEvents){
		newEvent = document.createEvent("CustomEvent");
		newEvent.dispatcher = this;
		newEvent.initCustomEvent(aEventType, false, false, aDetail);
	}
	else {
		newEvent = {"type" : aEventType, "detail" : aDetail, "dispatcher" : this };
	}
	return this.dispatchEvent(newEvent);
};

p._destroy = function() {
	if(this._eventListeners !== null) {
		for(var objectName in this._eventListeners) {
			var currentArray = this._eventListeners[objectName];
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				currentArray[i] = null;
			}
			delete this._eventListeners[objectName];
		}
		this._eventListeners = null;
	}
};

p._copyArray = function(aArray) {
	var currentArray = new Array(aArray.length);
	var currentArrayLength = currentArray.length;
	for(var i = 0; i < currentArrayLength; i++) {
		currentArray[i] = aArray[i];
	}
	return currentArray;
};

module.exports = EventDispatcher;
},{}],8:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

var Face = function(mA, mB, mC) {
	this._vertexA = mA;
	this._vertexB = mB;
	this._vertexC = mC;

	this._init();
};

var p = Face.prototype;


p._init = function() {
	var BA = glm.vec3.create();
	var CA = glm.vec3.create();
	glm.vec3.sub(BA, this._vertexB, this._vertexA);
	glm.vec3.sub(CA, this._vertexC, this._vertexA);

	this._faceNormal = glm.vec3.create();
	glm.vec3.cross(this._faceNormal, BA, CA);
	glm.vec3.normalize(this._faceNormal, this._faceNormal);
};


p.contains = function(mVertex) {
	return ( equal(mVertex, this._vertexA) || equal(mVertex, this._vertexB) || equal(mVertex, this._vertexC) );
};


p.__defineGetter__("faceNormal", function() {
	return this._faceNormal;
});

var equal = function(mV0, mV1) {
	return ( (mV0[0] === mV1[0]) && (mV0[1] === mV1[1]) && (mV0[2] === mV1[2]) );
};

module.exports = Face;
},{"gl-matrix":2}],9:[function(_dereq_,module,exports){
"use strict";

var gl, GL = _dereq_("./GLTools");
var GLTexture = _dereq_("./GLTexture");
var isPowerOfTwo = function(x) {	return !(x === 0) && !(x & (x - 1));	};

var FrameBuffer = function(width, height, options) {
	gl = GL.gl;
	options        = options || {};
	this.width     = width;
	this.height    = height;
	this.magFilter = options.magFilter || gl.LINEAR;
	this.minFilter = options.minFilter || gl.LINEAR;
	this.wrapS     = options.wrapS || gl.MIRRORED_REPEAT;
	this.wrapT     = options.wrapT || gl.MIRRORED_REPEAT;

	if(!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
		this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;

		if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
			this.minFilter = gl.LINEAR;
		}
	} 

	this._init();
};

var p = FrameBuffer.prototype;

p._init = function() {
	this.texture            = gl.createTexture();
	
	this.glTexture			= new GLTexture(this.texture, true);
	
	this.frameBuffer        = gl.createFramebuffer();		
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
	this.frameBuffer.width  = this.width;
	this.frameBuffer.height = this.height;

	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	if(GL.depthTextureExt) {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	} else {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	}
	
	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	// if(this.magFilter == gl.NEAREST && this.minFilter == gl.NEAREST) {
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	// 	console.debug("Both Nearest", this.floatTextureExt);
	// } else {
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	// }

	if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	if(GL.depthTextureExt === null) {
		var renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.frameBuffer.width, this.frameBuffer.height);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
		// gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);	
		// if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
	 //      throw new Error('Rendering to this texture is not supported (incomplete framebuffer)');
	 //    }

	 	// gl.renderbufferStorage( gl.RENDERBUFFER, gl.RGBA4, this.frameBuffer.width, this.frameBuffer.height );
	} else {
		this.depthTexture       = gl.createTexture();
		this.glDepthTexture		= new GLTexture(this.depthTexture, true);

		gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};


p.bind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
};


p.unbind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
};


p.getTexture = function() {
	return this.glTexture;
};


p.getDepthTexture = function() {
	return this.glDepthTexture;
};


p.destroy = function() {
	gl.deleteFramebuffer(this.frameBuffer);

	this.glTexture.destroy();
	if(this.glDepthTexture) {
		this.glDepthTexture.destroy();
	}
};

module.exports = FrameBuffer;
},{"./GLTexture":11,"./GLTools":12}],10:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var gl;
var ShaderLibs = _dereq_("./ShaderLibs");

var addLineNumbers = function ( string ) {
	var lines = string.split( '\n' );
	for ( var i = 0; i < lines.length; i ++ ) {
		lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];
	}
	return lines.join( '\n' );
};

var GLShader = function(aVertexShaderId, aFragmentShaderId) {
	gl              	 = GL.gl;
	this.idVertex        = aVertexShaderId;
	this.idFragment      = aFragmentShaderId;
	this.parameters      = [];
	this.uniformValues   = {};
	
	this.uniformTextures = [];
	
	this.vertexShader    = undefined;
	this.fragmentShader  = undefined;
	this._isReady        = false;
	this._loadedCount    = 0;

	if(aVertexShaderId === undefined || aVertexShaderId === null ) {
		this.createVertexShaderProgram(ShaderLibs.getShader("copyVert"));
	}

	if(aFragmentShaderId === undefined || aVertexShaderId === null ) {
		this.createFragmentShaderProgram(ShaderLibs.getShader("copyFrag"));
	}

	this.init();
};


var p = GLShader.prototype;

p.init = function() {
	if(this.idVertex && this.idVertex.indexOf("main(void)") > -1) {
		this.createVertexShaderProgram(this.idVertex);
	} else {
		this.getShader(this.idVertex, true);	
	}
	
	if(this.idFragment && this.idFragment.indexOf("main(void)") > -1) {
		this.createFragmentShaderProgram(this.idFragment);
	} else {
		this.getShader(this.idFragment, false);	
	}
};

p.getShader = function(aId, aIsVertexShader) {
	if(!aId) {return;}
	var req = new XMLHttpRequest();
	req.hasCompleted = false;
	var that = this;
	req.onreadystatechange = function(e) {
		if(e.target.readyState === 4) {
			if(aIsVertexShader) {
				that.createVertexShaderProgram(e.target.responseText);
			} else {
				that.createFragmentShaderProgram(e.target.responseText);
			}
		}
	};
	req.open("GET", aId, true);
	req.send(null);
};

p.createVertexShaderProgram = function(aStr) {
	if(!gl) {	return;	}
	var shader = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(shader, aStr);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.warn("Error in Vertex Shader : ", this.idVertex, ":", gl.getShaderInfoLog(shader));
		console.log(addLineNumbers(aStr));
		return null;
	}

	this.vertexShader = shader;
	
	if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
		this.attachShaderProgram();
	}

	this._loadedCount++;
};


p.createFragmentShaderProgram = function(aStr) {
	if(!gl) {	return;	}
	var shader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(shader, aStr);
	gl.compileShader(shader);

	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.warn("Error in Fragment Shader: ", this.idFragment, ":" , gl.getShaderInfoLog(shader));
		console.log(addLineNumbers(aStr));
		return null;
	}

	this.fragmentShader = shader;

	if(this.vertexShader !== undefined && this.fragmentShader !== undefined) {
		this.attachShaderProgram();
	}

	this._loadedCount++;
};

p.attachShaderProgram = function() {
	this._isReady = true;
	this.shaderProgram = gl.createProgram();
	gl.attachShader(this.shaderProgram, this.vertexShader);
	gl.attachShader(this.shaderProgram, this.fragmentShader);
	gl.linkProgram(this.shaderProgram);
};

p.bind = function() {
	if(!this._isReady) {return;}
	gl.useProgram(this.shaderProgram);

	if(this.shaderProgram.pMatrixUniform === undefined) {	this.shaderProgram.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");}
	if(this.shaderProgram.mvMatrixUniform === undefined) {	this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");}

	GL.setShader(this);
	GL.setShaderProgram(this.shaderProgram);

	this.uniformTextures = [];
};

p.isReady = function() {	return this._isReady;	};


p.clearUniforms = function() {
	this.parameters    = [];
	this.uniformValues = {};
};

p.uniform = function(aName, aType, aValue) {
	if(!this._isReady) {return;}

	if(aType === "texture") {aType = "uniform1i";}

	var hasUniform = false;
	var oUniform;
	for(var i=0; i<this.parameters.length; i++) {
		oUniform = this.parameters[i];
		if(oUniform.name === aName) {
			oUniform.value = aValue;
			hasUniform = true;
			break;
		}
	}

	if(!hasUniform) {
		this.shaderProgram[aName] = gl.getUniformLocation(this.shaderProgram, aName);
		this.parameters.push({name : aName, type: aType, value: aValue, uniformLoc: this.shaderProgram[aName]});
	} else {
		this.shaderProgram[aName] = oUniform.uniformLoc;
	}


	if(aType.indexOf("Matrix") === -1) {
		if(!hasUniform) {
			var isArray = Array.isArray(aValue);
			if(isArray) {
				this.uniformValues[aName] = aValue.concat();
			} else {
				this.uniformValues[aName] = aValue;	
			}
			gl[aType](this.shaderProgram[aName], aValue);
		} else {
			// if(aName == 'position') console.log('Has uniform', this.checkUniform(aName, aType, aValue));
			if(this.checkUniform(aName, aType, aValue)) {
				gl[aType](this.shaderProgram[aName], aValue);
				// console.debug('Set uniform', aName, aType, aValue);
			}
		}
	} else {
		gl[aType](this.shaderProgram[aName], false, aValue);
		if(!hasUniform) {
			gl[aType](this.shaderProgram[aName], false, aValue);
			this.uniformValues[aName] = aValue;
			// console.debug('Set uniform', aName, aType, aValue);
		}
	}

	if(aType === "uniform1i") {
		// Texture
		this.uniformTextures[aValue] = this.shaderProgram[aName];
	}
};

p.checkUniform = function(aName, aType, aValue) {
	var isArray = Array.isArray(aValue);

	if(!this.uniformValues[aName]) {
		this.uniformValues[aName] = aValue;
		return true;
	}

	if(aType === "uniform1i") {
		this.uniformValues[aName] = aValue;
		return true;
	}

	var uniformValue = this.uniformValues[aName];
	var hasChanged = false;

	if(isArray) {
		for(var i=0; i<uniformValue.length; i++) {
			if(uniformValue[i] !== aValue[i]) {
				hasChanged = true;
				break;
			}
		}	
	} else {
		hasChanged = uniformValue !== aValue;
	}
	
	
	if(hasChanged) {
		if(isArray) {
			this.uniformValues[aName] = aValue.concat();
		} else {
			this.uniformValues[aName] = aValue;	
		}
		
	}

	return hasChanged;
};


p.unbind = function() {

};


p.destroy = function() {
	gl.detachShader(this.shaderProgram, this.vertexShader);
	gl.detachShader(this.shaderProgram, this.fragmentShader);
	gl.deleteShader(this.vertexShader);
	gl.deleteShader(this.fragmentShader);
	gl.deleteProgram(this.shaderProgram);
};

module.exports = GLShader;
},{"./GLTools":12,"./ShaderLibs":19}],11:[function(_dereq_,module,exports){
// GLTexture.js
"use strict";

var gl;
var GL = _dereq_("./GLTools");
var _isPowerOfTwo = function(x) {	
	var check = !(x === 0) && (!(x & (x - 1)));
	return check;
};
var isPowerOfTwo = function(obj) {	
	var w = obj.width || obj.videoWidth;
	var h = obj.height || obj.videoHeight;

	if(!w || !h) {return false;}

	return _isPowerOfTwo(w) && _isPowerOfTwo(h);
};

var GLTexture = function(source, isTexture, options) {
	isTexture = isTexture || false;
	options = options || {};
	gl = GL.gl;
	if(isTexture) {
		this.texture = source;
	} else {
		this._source   = source;
		this.texture   = gl.createTexture();
		this._isVideo  = (source.tagName === "VIDEO");
		this.magFilter = options.magFilter || gl.LINEAR;
		this.minFilter = options.minFilter || gl.LINEAR_MIPMAP_NEAREST;
		
		this.wrapS     = options.wrapS || gl.MIRRORED_REPEAT;
		this.wrapT     = options.wrapT || gl.MIRRORED_REPEAT;
		var width      = source.width || source.videoWidth;

		if(width) {
			if(!isPowerOfTwo(source)) {
				this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
				if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
					this.minFilter = gl.LINEAR;
				}
			} 	
		} else {
			this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;
			if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
				this.minFilter = gl.LINEAR;
			}
		}

		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
		
		if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
	}
};

var p = GLTexture.prototype;


p.updateTexture = function(source) {
	if(source){ this._source = source; }
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._source);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	if(this.minFilter === gl.LINEAR_MIPMAP_NEAREST)	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
};


p.bind = function(index) {
	if(index === undefined) {index = 0;}
	if(!GL.shader) {return;}

	gl.activeTexture(gl.TEXTURE0 + index);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(GL.shader.uniformTextures[index], index);
	this._bindIndex = index;
};


p.unbind = function() {
	gl.bindTexture(gl.TEXTURE_2D, null);
};

p.destroy = function() {
	gl.deleteTexture(this.texture);
};

module.exports = GLTexture;
},{"./GLTools":12}],12:[function(_dereq_,module,exports){
// GLTools.js
"use strict";

var glm = _dereq_("gl-matrix");

function GLTools() {
	this.aspectRatio   = 1;
	this.fieldOfView   = 45;
	this.zNear         = 5;
	this.zFar          = 3000;

	this.canvas        = null;
	this.gl            = null;

	this.shader        = null;
	this.shaderProgram = null;
}

var p = GLTools.prototype;

p.init = function(mCanvas, mWidth, mHeight, parameters) {
	if(this.canvas === null) {
		this.canvas      = mCanvas || document.createElement("canvas");
	}
	var params       = parameters || {};
	params.antialias = true;

	this.gl          = this.canvas.getContext("webgl", params) || this.canvas.getContext("experimental-webgl", params);
	console.log('GL TOOLS : ', this.gl);
	
	
	if(mWidth !== undefined && mHeight !== undefined) {
		this.setSize(mWidth, mHeight);
	} else {
		this.setSize(window.innerWidth, window.innerHeight);	
	}

	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.enable(this.gl.BLEND);
	this.gl.clearColor( 0, 0, 0, 1 );
	this.gl.clearDepth( 1 );

	this.matrix                 = glm.mat4.create();
	glm.mat4.identity(this.matrix);
	this.normalMatrix           = glm.mat3.create();
	this.depthTextureExt        = this.gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
	this.floatTextureExt        = this.gl.getExtension("OES_texture_float"); // Or browser-appropriate prefix
	this.floatTextureLinearExt  = this.gl.getExtension("OES_texture_float_linear"); // Or browser-appropriate prefix
	this.standardDerivativesExt = this.gl.getExtension("OES_standard_derivatives"); // Or browser-appropriate prefix

	this.enabledVertexAttribute = [];
	this.enableAlphaBlending();
	this._viewport = [0, 0, this.width, this.height];
};


p.getGL = function() {	return this.gl;	};

p.setShader = function(aShader) {
	this.shader = aShader;
};

p.setShaderProgram = function(aShaderProgram) {
	this.shaderProgram = aShaderProgram;
};

p.setViewport = function(aX, aY, aW, aH) {
	var hasChanged = false;
	if(aX!==this._viewport[0]) {hasChanged = true;}
	if(aY!==this._viewport[1]) {hasChanged = true;}
	if(aW!==this._viewport[2]) {hasChanged = true;}
	if(aH!==this._viewport[3]) {hasChanged = true;}

	if(hasChanged) {
		this.gl.viewport(aX, aY, aW, aH);
		this._viewport = [aX, aY, aW, aH];
	}
};

p.setMatrices = function(aCamera) {
	this.camera = aCamera;	
};

p.rotate = function(aRotation) {
	glm.mat4.copy(this.matrix, aRotation);

	glm.mat4.multiply(this.matrix, this.camera.getMatrix(), this.matrix);
	glm.mat3.fromMat4(this.normalMatrix, this.matrix);
	glm.mat3.invert(this.normalMatrix, this.normalMatrix);
	glm.mat3.transpose(this.normalMatrix, this.normalMatrix);
};


//	BLEND MODES
p.enableAlphaBlending = function() {
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);	
};

p.enableAdditiveBlending = function() {
	this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
};

//	CLEAR CANVAS
p.clear = function(r, g, b, a) {
	this.gl.clearColor( r, g, b, a );
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

//	DRAWING ELEMENTS
p.draw = function(aMesh) {
	if(!this.shaderProgram) {
		console.warn("Shader program not ready yet");
		return;
	}

	if(!this.shaderProgram.pMatrixValue) {
		this.shaderProgram.pMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.camera.projection || this.camera.getMatrix() );
		glm.mat4.copy(this.shaderProgram.pMatrixValue, this.camera.projection || this.camera.getMatrix());
	} else {
		var pMatrix = this.camera.projection || this.camera.getMatrix();
		if(glm.mat4.str(this.shaderProgram.pMatrixValue) !== glm.mat4.str(pMatrix)) {
			this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.camera.projection || this.camera.getMatrix() );
			glm.mat4.copy(this.shaderProgram.pMatrixValue, pMatrix);
		}
	}

	if(!this.shaderProgram.mvMatrixValue) {
		this.shaderProgram.mvMatrixValue = glm.mat4.create();
		this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.matrix );
		glm.mat4.copy(this.shaderProgram.mvMatrixValue, this.matrix);
	} else {
		if(glm.mat4.str(this.shaderProgram.mvMatrixValue) !== glm.mat4.str(this.matrix)) {
			this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.matrix );
			glm.mat4.copy(this.shaderProgram.mvMatrixValue, this.matrix);
		}
	}


	// 	VERTEX POSITIONS
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.vBufferPos);
	var vertexPositionAttribute = getAttribLoc(this.gl, this.shaderProgram, "aVertexPosition");
	this.gl.vertexAttribPointer(vertexPositionAttribute, aMesh.vBufferPos.itemSize, this.gl.FLOAT, false, 0, 0);
	if(this.enabledVertexAttribute.indexOf(vertexPositionAttribute) === -1) {
		this.gl.enableVertexAttribArray(vertexPositionAttribute);	
		this.enabledVertexAttribute.push(vertexPositionAttribute);
	}
	

	//	TEXTURE COORDS
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.vBufferUV);
	var textureCoordAttribute = getAttribLoc(this.gl, this.shaderProgram, "aTextureCoord");
	this.gl.vertexAttribPointer(textureCoordAttribute, aMesh.vBufferUV.itemSize, this.gl.FLOAT, false, 0, 0);
	
	if(this.enabledVertexAttribute.indexOf(textureCoordAttribute) === -1) {
		this.gl.enableVertexAttribArray(textureCoordAttribute);
		this.enabledVertexAttribute.push(textureCoordAttribute);
	}

	//	INDICES
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, aMesh.iBuffer);

	//	EXTRA ATTRIBUTES
	for(var i=0; i<aMesh.extraAttributes.length; i++) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, aMesh.extraAttributes[i].buffer);
		var attrPosition = getAttribLoc(this.gl, this.shaderProgram, aMesh.extraAttributes[i].name);
		this.gl.vertexAttribPointer(attrPosition, aMesh.extraAttributes[i].itemSize, this.gl.FLOAT, false, 0, 0);
		// this.gl.enableVertexAttribArray(attrPosition);	
		if(this.enabledVertexAttribute.indexOf(attrPosition) === -1) {
			this.gl.enableVertexAttribArray(attrPosition);
			this.enabledVertexAttribute.push(attrPosition);
		}	
	}

	//	DRAWING
	if(aMesh.drawType === this.gl.POINTS ) {
		this.gl.drawArrays(aMesh.drawType, 0, aMesh.vertexSize);	
	} else {
		this.gl.drawElements(aMesh.drawType, aMesh.iBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);	
	}


	function getAttribLoc(gl, shaderProgram, name) {
		if(shaderProgram.cacheAttribLoc === undefined) {	shaderProgram.cacheAttribLoc = {};	}
		if(shaderProgram.cacheAttribLoc[name] === undefined) {
			shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
		}

		return shaderProgram.cacheAttribLoc[name];
	}

};

//	CANVAS RESIZING
p.setSize = function(mWidth, mHeight) {
	this._width = mWidth;
	this._height = mHeight;

	this.canvas.width      = this._width;
	this.canvas.height     = this._height;
	this.gl.viewportWidth  = this._width;
	this.gl.viewportHeight = this._height;

	this.gl.viewport(0, 0, this._width, this._height);
	this.aspectRatio       = this._width / this._height;
};


p.__defineGetter__("width", function() {
	return this._width;
});

p.__defineGetter__("height", function() {
	return this._height;
});

p.__defineGetter__("viewport", function() {
	return this._viewport;
});

var instance = null;

GLTools.getInstance = function() {
	if(instance === null) {
		instance = new GLTools();
	}
	return instance;
};


module.exports = GLTools.getInstance();
},{"gl-matrix":2}],13:[function(_dereq_,module,exports){
"use strict";

var Face = _dereq_("./Face");
var GL = _dereq_("./GLTools");
var glm = _dereq_("gl-matrix");

var Mesh = function(aVertexSize, aIndexSize, aDrawType) {

	this.gl = GL.gl;
	this.vertexSize = aVertexSize;
	this.indexSize = aIndexSize;
	this.drawType = aDrawType;
	this.extraAttributes = [];
	
	this.vBufferPos = undefined;
	this._floatArrayVertex = undefined;

	this._init();
};

var p = Mesh.prototype;

p._init = function() {

};

p.bufferVertex = function(aArrayVertices, isDynamic) {
	var vertices = [];
	var drawType = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
	this._vertices = [];

	for(var i=0; i<aArrayVertices.length; i++) {
		for(var j=0; j<aArrayVertices[i].length; j++) {
			vertices.push(aArrayVertices[i][j]);
		}
		this._vertices.push(glm.vec3.clone(aArrayVertices[i]));
	}

	if(this.vBufferPos === undefined) {
		this.vBufferPos = this.gl.createBuffer();
	}
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferPos);

	if(this._floatArrayVertex === undefined) {
		this._floatArrayVertex = new Float32Array(vertices);
	} else {
		if(aArrayVertices.length !== this._floatArrayVertex.length) {
			this._floatArrayVertex = new Float32Array(vertices);
		} else {
			for(var k=0; k<aArrayVertices.length; k++) {
				this._floatArrayVertex[k] = aArrayVertices[k];
			}
		}
	}

	this.gl.bufferData(this.gl.ARRAY_BUFFER, this._floatArrayVertex, drawType);
	this.vBufferPos.itemSize = 3;
};

p.bufferTexCoords = function(aArrayTexCoords) {
	var coords = [];

	for(var i=0; i<aArrayTexCoords.length; i++) {
		for(var j=0; j<aArrayTexCoords[i].length; j++) {
			coords.push(aArrayTexCoords[i][j]);
		}
	}

	this.vBufferUV = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferUV);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coords), this.gl.STATIC_DRAW);
	this.vBufferUV.itemSize = 2;
};

p.bufferData = function(aData, aName, aItemSize, isDynamic) {
	var index = -1;
	var drawType = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;
	var i=0;

	for(i=0; i<this.extraAttributes.length; i++) {
		if(this.extraAttributes[i].name === aName) {
			this.extraAttributes[i].data = aData;
			index = i;
			break;
		}
	}

	var bufferData = [];
	for(i=0; i<aData.length; i++) {
		for(var j=0; j<aData[i].length; j++) {
			bufferData.push(aData[i][j]);
		}
	}

	var buffer, floatArray;
	if(index === -1) {
		buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		floatArray = new Float32Array(bufferData);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, drawType);
		this.extraAttributes.push({name:aName, data:aData, itemSize: aItemSize, buffer:buffer, floatArray:floatArray});
	} else {
		buffer = this.extraAttributes[index].buffer;
		// console.debug("Buffer exist", buffer);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		floatArray = this.extraAttributes[index].floatArray;
		for(i=0; i<bufferData.length; i++) {
			floatArray[i] = bufferData[i];
		}
		this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, drawType);
	}

};

p.bufferIndices = function(aArrayIndices) {
	this._indices = aArrayIndices;
	this.iBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aArrayIndices), this.gl.STATIC_DRAW);
	this.iBuffer.itemSize = 1;
	this.iBuffer.numItems = aArrayIndices.length;
};


p.computeNormals = function() {
	if(this.drawType !== this.gl.TRIANGLES) {return;}

	if(this._faces === undefined) {	this._generateFaces();	}
	console.log("Start computing");

	var time = new Date().getTime();
	var j=0;

	this._normals = [];
	for(var i=0; i<this._vertices.length; i++) {
		var normal = glm.vec3.create();
		var faceCount = 0;
		for(j=0; j<this._faces.length; j++) {
			if(this._faces[j].contains(this._vertices[i])) {
				glm.vec3.add(normal, normal, this._faces[j].faceNormal);
				faceCount ++;
			}
		}

		glm.vec3.normalize(normal, normal);
		this._normals.push(normal);
	}

	this.bufferData(this._normals, "aNormal", 3);

	var totalTime = new Date().getTime() - time;
	console.log("Total Time : ", totalTime);
};


p.computeTangent = function() {
	
};


p._generateFaces = function() {
	this._faces = [];

	for(var i=0; i<this._indices.length; i+=3) {
		var p0 = this._vertices[this._indices[i+0]];
		var p1 = this._vertices[this._indices[i+1]];
		var p2 = this._vertices[this._indices[i+2]];

		this._faces.push(new Face(p0, p1, p2));
	}
};

module.exports = Mesh;
},{"./Face":8,"./GLTools":12,"gl-matrix":2}],14:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var Mesh = _dereq_("./Mesh");
var MeshUtils = {};

MeshUtils.createPlane = function(width, height, numSegments) {
	var positions = [];
	var coords = [];
	var indices = [];

	var gapX = width/numSegments;
	var gapY = height/numSegments;
	var gapUV = 1/numSegments;
	var index = 0;
	var sx = -width * 0.5;
	var sy = -height * 0.5;

	for(var i=0; i<numSegments; i++) {
		for (var j=0; j<numSegments; j++) {
			var tx = gapX * i + sx;
			var ty = gapY * j + sy;
			positions.push([tx, 		ty, 	0]);
			positions.push([tx+gapX, 	ty, 	0]);
			positions.push([tx+gapX, 	ty+gapY, 	0]);
			positions.push([tx, 		ty+gapY, 	0]);

			var u = i/numSegments;
			var v = j/numSegments;
			coords.push([u, v]);
			coords.push([u+gapUV, v]);
			coords.push([u+gapUV, v+gapUV]);
			coords.push([u, v+gapUV]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
		}
	}

	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);

	return mesh;
};

MeshUtils.createSphere = function(size, numSegments) {
	var positions = [];
	var coords = [];
	var indices = [];
	var index = 0;
	var gapUV = 1/numSegments;

	var getPosition = function(i, j) {	//	rx : -90 ~ 90 , ry : 0 ~ 360
		var rx = i/numSegments * Math.PI - Math.PI * 0.5;
		var ry = j/numSegments * Math.PI * 2;
		var r = size;
		var pos = [];
		pos[1] = Math.sin(rx) * r;
		var t = Math.cos(rx) * r;
		pos[0] = Math.cos(ry) * t;
		pos[2] = Math.sin(ry) * t;

		var precision = 10000;
		pos[0] = Math.floor(pos[0] * precision) / precision;
		pos[1] = Math.floor(pos[1] * precision) / precision;
		pos[2] = Math.floor(pos[2] * precision) / precision;

		return pos;
	};

	
	for(var i=0; i<numSegments; i++) {
		for(var j=0; j<numSegments; j++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i, j+1));

			var u = j/numSegments;
			var v = i/numSegments;
			
			
			coords.push([1.0 - u, v]);
			coords.push([1.0 - u, v+gapUV]);
			coords.push([1.0 - u - gapUV, v+gapUV]);
			coords.push([1.0 - u - gapUV, v]);

			indices.push(index*4 + 0);
			indices.push(index*4 + 1);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 3);

			index++;
		}
	}


	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);

	return mesh;
};


MeshUtils.createCube = function(w,h,d) {
	h = h || w;
	d = d || w;

	var x = w/2;
	var y = h/2;
	var z = d/2;


	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;


	// BACK
	positions.push([-x,  y, -z]);
	positions.push([ x,  y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([-x, -y, -z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// RIGHT
	positions.push([ x,  y, -z]);
	positions.push([ x,  y,  z]);
	positions.push([ x, -y,  z]);
	positions.push([ x, -y, -z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// FRONT
	positions.push([ x,  y,  z]);
	positions.push([-x,  y,  z]);
	positions.push([-x, -y,  z]);
	positions.push([ x, -y,  z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	// LEFT
	positions.push([-x,  y,  z]);
	positions.push([-x,  y, -z]);
	positions.push([-x, -y, -z]);
	positions.push([-x, -y,  z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// TOP
	positions.push([-x,  y,  z]);
	positions.push([ x,  y,  z]);
	positions.push([ x,  y, -z]);
	positions.push([-x,  y, -z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// BOTTOM
	positions.push([-x, -y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([ x, -y,  z]);
	positions.push([-x, -y,  z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	var mesh = new Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);

	return mesh;
};

module.exports = MeshUtils;
},{"./GLTools":12,"./Mesh":13}],15:[function(_dereq_,module,exports){
// ObjLoader.js

"use strict";

var GL = _dereq_("./GLTools");
var Mesh = _dereq_("./Mesh");
var gl;


function ObjLoader() {
	this._clearAll();
}


var p = ObjLoader.prototype;

p._clearAll = function() {
	this._callback      = null;
	this._callbackError = null;
	this._mesh          = [];	
};

p.load = function(url, callback, callbackError, ignoreNormals) {
	this._clearAll();
	this._ignoreNormals = ignoreNormals === undefined ? true : ignoreNormals;

	this._callback = callback;
	this._callbackError = callbackError;

	var request = new XMLHttpRequest();
	request.onreadystatechange = this._onXHTPState.bind(this);
	request.open("GET", url, true);
	request.send();
};

p._onXHTPState = function(e) {
	if(e.target.readyState === 4) {
		this._parseObj(e.target.response);
	}
};


p.parse = function(objStr, callback, callbackError, ignoreNormals) {
	this._clearAll();
	this._ignoreNormals = ignoreNormals === undefined ? true : ignoreNormals;

	this._parseObj(objStr);
};


p._parseObj = function(objStr) {
	var lines = objStr.split('\n');

	var positions    = [];
	var coords       = [];
	var finalNormals = [];
	var vertices     = [];
	var normals      = [];
	var uvs          = [];
	var indices      = [];
	var count        = 0;
	var result;

	// v float float float
	var vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// vn float float float
	var normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// vt float float
	var uv_pattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

	// f vertex vertex vertex ...
	var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

	// f vertex/uv vertex/uv vertex/uv ...
	var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

	// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
	var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

	// f vertex//normal vertex//normal vertex//normal ... 
	var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;


	function parseVertexIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;
	}

	function parseNormalIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;
	}

	function parseUVIndex( value ) {
		var index = parseInt( value );
		return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;
	}


	function addVertex(a, b ,c) {
		positions.push([vertices[a], vertices[a+1], vertices[a+2]]);
		positions.push([vertices[b], vertices[b+1], vertices[b+2]]);
		positions.push([vertices[c], vertices[c+1], vertices[c+2]]);

		indices.push(count * 3 + 0);
		indices.push(count * 3 + 1);
		indices.push(count * 3 + 2);

		count ++;
	}


	function addUV(a, b, c) {
		coords.push([uvs[a], uvs[a+1]]);
		coords.push([uvs[b], uvs[b+1]]);
		coords.push([uvs[c], uvs[c+1]]);
	}


	function addNormal(a, b, c) {
		finalNormals.push([normals[a], normals[a+1], normals[a+2]]);
		finalNormals.push([normals[b], normals[b+1], normals[b+2]]);
		finalNormals.push([normals[c], normals[c+1], normals[c+2]]);
	}

	function addFace( a, b, c, d,  ua, ub, uc, ud,  na, nb, nc, nd ) {
		var ia = parseVertexIndex( a );
		var ib = parseVertexIndex( b );
		var ic = parseVertexIndex( c );
		var id;

		if ( d === undefined ) {

			addVertex( ia, ib, ic );

		} else {

			id = parseVertexIndex( d );

			addVertex( ia, ib, id );
			addVertex( ib, ic, id );

		}


		if ( ua !== undefined ) {

			ia = parseUVIndex( ua );
			ib = parseUVIndex( ub );
			ic = parseUVIndex( uc );

			if ( d === undefined ) {

				addUV( ia, ib, ic );

			} else {

				id = parseUVIndex( ud );

				addUV( ia, ib, id );
				addUV( ib, ic, id );

			}

		}

		if ( na !== undefined ) {

			ia = parseNormalIndex( na );
			ib = parseNormalIndex( nb );
			ic = parseNormalIndex( nc );

			if ( d === undefined ) {

				addNormal( ia, ib, ic );

			} else {

				id = parseNormalIndex( nd );

				addNormal( ia, ib, id );
				addNormal( ib, ic, id );

			}

		}
	}


	for ( var i = 0; i < lines.length; i ++ ) {
		var line = lines[ i ];
		line = line.trim();

		if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

			continue;

		} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

			vertices.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			);

		} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

			normals.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			);

		} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

			uvs.push(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] )
			);

		} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

			addFace(
				result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
			);

		} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

			addFace(
				result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
				result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
			);

		} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {
			addFace(
				result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],
				result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],
				result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]
			);

		} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {
			addFace(
				result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
				undefined, undefined, undefined, undefined,
				result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
			);

		} 
	}

	this._generateMeshes({	
		positions:positions,
		coords:coords,
		normals:finalNormals,
		indices:indices
	});
	
};


p._generateMeshes = function(o) {
	gl = GL.gl;

	var mesh = new Mesh(o.positions.length, o.indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(o.positions);
	mesh.bufferTexCoords(o.coords);
	mesh.bufferIndices(o.indices);
	if(!this._ignoreNormals) {
		mesh.bufferData(o.normals, "aNormal", 3);
	}

	if(this._callback) {
		this._callback(mesh, o);
	}
};

var loader = new ObjLoader();

module.exports = loader;
},{"./GLTools":12,"./Mesh":13}],16:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");

function QuatRotation(mListenerTarget) {
	if(mListenerTarget === undefined) {	mListenerTarget = document;	}
	this._isRotateZ     = 0;
	this.matrix         = glm.mat4.create();
	this.m              = glm.mat4.create();
	this._vZaxis        = glm.vec3.clone([0, 0, 0]);
	this._zAxis         = glm.vec3.clone([0, 0, -1]);
	this.preMouse       = {x:0, y:0};
	this.mouse          = {x:0, y:0};
	this._isMouseDown   = false;
	this._rotation      = glm.quat.clone([0, 0, 1, 0]);
	this.tempRotation   = glm.quat.clone([0, 0, 0, 0]);
	this._rotateZMargin = 0;
	this.diffX          = 0;
	this.diffY          = 0;
	this._currDiffX     = 0;
	this._currDiffY     = 0;
	this._offset        = 0.004;
	this._easing        = 0.1;
	this._slerp			= -1;
	this._isLocked 		= false;

	var that = this;
	mListenerTarget.addEventListener("mousedown", function(aEvent) { that._onMouseDown(aEvent); });
	mListenerTarget.addEventListener("touchstart", function(aEvent) {	that._onMouseDown(aEvent); });
	mListenerTarget.addEventListener("mouseup", function(aEvent) { that._onMouseUp(aEvent); });
	mListenerTarget.addEventListener("touchend", function(aEvent) { that._onMouseUp(aEvent); });
	mListenerTarget.addEventListener("mousemove", function(aEvent) { that._onMouseMove(aEvent); });
	mListenerTarget.addEventListener("touchmove", function(aEvent) { that._onMouseMove(aEvent); });
}


var p = QuatRotation.prototype;

p.inverseControl = function(value) {
	if(value === undefined) {	
		this._isInvert = true;	
	} else {
		this._isInvert = value;
	}
};

p.lock = function(value) {
	if(value === undefined) {	
		this._isLocked = true;	
	} else {	
		this._isLocked = value;	
	}
};

p.getMousePos = function(aEvent) {
	var mouseX, mouseY;

	if(aEvent.changedTouches !== undefined) {
		mouseX = aEvent.changedTouches[0].pageX;
		mouseY = aEvent.changedTouches[0].pageY;
	} else {
		mouseX = aEvent.clientX;
		mouseY = aEvent.clientY;
	}
	
	return {x:mouseX, y:mouseY};
};

p._onMouseDown = function(aEvent) {
	if(this._isLocked) {return;}
	if(this._isMouseDown) {return;}

	var mouse = this.getMousePos(aEvent);
	var tempRotation = glm.quat.clone(this._rotation);
	this._updateRotation(tempRotation);
	this._rotation = tempRotation;

	this._isMouseDown = true;
	this._isRotateZ = 0;
	this.preMouse = {x:mouse.x, y:mouse.y};

	if(mouse.y < this._rotateZMargin || mouse.y > (window.innerHeight - this._rotateZMargin) ) {	this._isRotateZ = 1;	}
	else if(mouse.x < this._rotateZMargin || mouse.x > (window.innerWidth - this._rotateZMargin) ) {	this._isRotateZ = 2;	}

	this._currDiffX = this.diffX = 0;
	this._currDiffY = this.diffY = 0;
};

p._onMouseMove = function(aEvent) {
	if(this._isLocked) {return;}
	if(aEvent.touches) {aEvent.preventDefault();}
	this.mouse = this.getMousePos(aEvent);
};

p._onMouseUp = function() {
	if(this._isLocked) {return;}
	if(!this._isMouseDown) {return;}
	this._isMouseDown = false;
};

p.setCameraPos = function(mQuat, speed) {
	speed             = speed || this._easing;
	this._easing      = speed;
	if(this._slerp > 0) {return;}
	
	var tempRotation  = glm.quat.clone(this._rotation);
	this._updateRotation(tempRotation);
	this._rotation    = glm.quat.clone(tempRotation);
	this._currDiffX   = this.diffX = 0;
	this._currDiffY   = this.diffY = 0;
	
	this._isMouseDown = false;
	this._isRotateZ   = 0;
	
	this._targetQuat  = glm.quat.clone(mQuat);
	this._slerp       = 1;
};

p.resetQuat = function() {
	this._rotation    = glm.quat.clone([0, 0, 1, 0]);
	this.tempRotation = glm.quat.clone([0, 0, 0, 0]);
	this._targetQuat  = undefined;
	this._slerp       = -1;
};

p.update = function() {
	glm.mat4.identity(this.m);

	if(this._targetQuat === undefined) { 
		glm.quat.set(this.tempRotation, this._rotation[0], this._rotation[1], this._rotation[2], this._rotation[3]);
		this._updateRotation(this.tempRotation);
	} else {
		this._slerp += (0 - this._slerp) * 0.1;

		if(this._slerp < 0.001) {
			// quat.set(this._targetQuat, this._rotation);
			glm.quat.set(this._rotation, this._targetQuat[0], this._targetQuat[1], this._targetQuat[2], this._targetQuat[3]);
			this._targetQuat = undefined;
			this._slerp = -1;
		} else {
			glm.quat.set(this.tempRotation, 0, 0, 0, 0);
			glm.quat.slerp(this.tempRotation, this._targetQuat, this._rotation, this._slerp);
		}
	}

	glm.vec3.transformQuat(this._vZaxis, this._vZaxis, this.tempRotation);

	glm.mat4.fromQuat(this.matrix, this.tempRotation);
};

p._updateRotation = function(aTempRotation) {
	if(this._isMouseDown && !this._isLocked) {
		this.diffX = -(this.mouse.x - this.preMouse.x);
		this.diffY = (this.mouse.y - this.preMouse.y);

		if(this._isInvert) {
			this.diffX = -this.diffX;
			this.diffY = -this.diffY;
		}
	}
	
	this._currDiffX += (this.diffX - this._currDiffX) * this._easing;
	this._currDiffY += (this.diffY - this._currDiffY) * this._easing;

	var angle, _quat;

	if(this._isRotateZ > 0) {
		if(this._isRotateZ === 1) {
			angle = -this._currDiffX * this._offset; 
			angle *= (this.preMouse.y < this._rotateZMargin) ? -1 : 1;
			_quat = glm.quat.clone( [0, 0, Math.sin(angle), Math.cos(angle) ] );
			glm.quat.multiply(_quat, aTempRotation, _quat);
		} else {
			angle = -this._currDiffY * this._offset; 
			angle *= (this.preMouse.x < this._rotateZMargin) ? 1 : -1;
			_quat = glm.quat.clone( [0, 0, Math.sin(angle), Math.cos(angle) ] );
			glm.quat.multiply(_quat, aTempRotation, _quat);
		}
	} else {
		var v = glm.vec3.clone([this._currDiffX, this._currDiffY, 0]);
		var axis = glm.vec3.create();
		glm.vec3.cross(axis, v, this._zAxis);
		glm.vec3.normalize(axis, axis);
		angle = glm.vec3.length(v) * this._offset;
		_quat = glm.quat.clone( [Math.sin(angle) * axis[0], Math.sin(angle) * axis[1], Math.sin(angle) * axis[2], Math.cos(angle) ] );
		glm.quat.multiply(aTempRotation, _quat, aTempRotation);
	}

};


module.exports = QuatRotation;
},{"gl-matrix":2}],17:[function(_dereq_,module,exports){
"use strict";

var GL = _dereq_("./GLTools");
var QuatRotation = _dereq_("./QuatRotation");
var CameraOrtho = _dereq_("./CameraOrtho");
var SimpleCamera = _dereq_("./SimpleCamera");
var glm = _dereq_("gl-matrix");

var Scene = function() {
	if(GL.canvas === null) {return;}
	this.gl = GL.gl;
	this._children = [];
	this._init();
};

var p = Scene.prototype;

p._init = function() {
    this.camera = new SimpleCamera(GL.canvas);
	this.camera.setPerspective(45*Math.PI/180, GL.aspectRatio, .1, 1000);
	this.camera.lockRotation();

	var eye                = glm.vec3.clone( [0, 0, 0] );
	var center             = glm.vec3.create( );
	var up                 = glm.vec3.clone( [0,0,0] );
  	this.camera.lookAt(eye, center, up);
	
	this.sceneRotation     = new QuatRotation(GL.canvas);
	this.rotationFront     = glm.mat4.create();
	glm.mat4.identity(this.rotationFront);
	
	this.cameraOrtho       = new CameraOrtho();
	this.cameraOrthoScreen = new CameraOrtho();
	this.cameraOtho        = this.cameraOrtho;

	this.cameraOrtho.lookAt(eye, center, up);
	this.cameraOrtho.ortho( 1, -1, 1, -1);

	this.cameraOrthoScreen.lookAt(eye, center, up);
	this.cameraOrthoScreen.ortho( 0, GL.width, GL.height, 0);

	// In SuperClass should call following functions.
	this._initTextures();
	this._initViews();

	window.addEventListener("resize", this._onResize.bind(this));
};

p._initTextures = function() {
	// console.log("Should be overwritten by SuperClass");
};

p._initViews = function() {
	// console.log("Should be overwritten by SuperClass");
};

p.loop = function() {
	this.update();
	this.render();
};

p.update = function() {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.sceneRotation.update();
	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.camera );
	GL.rotate(this.sceneRotation.matrix);

};

p.resize = function() {
	// if(this.camera.resize) {
	// 	this.camera.resize(GL.aspectRatio);
	// }
};

p.render = function() {

};

p._onResize = function() {
	this.cameraOrthoScreen.ortho( 0, GL.width, GL.height, 0);
};

module.exports = Scene;
},{"./CameraOrtho":4,"./GLTools":12,"./QuatRotation":16,"./SimpleCamera":20,"gl-matrix":2}],18:[function(_dereq_,module,exports){
// Scheduler.js

"use strict";

if(window.requestAnimFrame === undefined) {
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
		window.setTimeout(callback, 1000 / 60);
		};
	})();
}

function Scheduler() {
	this.FRAMERATE = 60;
	this._delayTasks = [];
	this._nextTasks = [];
	this._deferTasks = [];
	this._highTasks = [];
	this._usurpTask = [];
	this._enterframeTasks = [];
	this._idTable = 0;

	window.requestAnimFrame( this._loop.bind(this) );
}

var p = Scheduler.prototype;

p._loop = function() {
	window.requestAnimFrame( this._loop.bind(this) );
	this._process();
};


p._process = function() {
	var i = 0,
		task, interval, current;
	for ( i=0; i<this._enterframeTasks.length; i++) {
		task = this._enterframeTasks[i];
		if(task !== null && task !== undefined) {
			task.func.apply(task.scope, task.params);
		}
	}
	
	while ( this._highTasks.length > 0) {
		task = this._highTasks.pop();
		task.func.apply(task.scope, task.params);
	}
	

	var startTime = new Date().getTime();

	for ( i=0; i<this._delayTasks.length; i++) {
		task = this._delayTasks[i];
		if(startTime-task.time > task.delay) {
			task.func.apply(task.scope, task.params);
			this._delayTasks.splice(i, 1);
		}
	}

	startTime = new Date().getTime();
	interval = 1000 / this.FRAMERATE;
	while(this._deferTasks.length > 0) {
		task = this._deferTasks.shift();
		current = new Date().getTime();
		if(current - startTime < interval ) {
			task.func.apply(task.scope, task.params);
		} else {
			this._deferTasks.unshift(task);
			break;
		}
	}


	startTime = new Date().getTime();
	interval = 1000 / this.FRAMERATE;
	while(this._usurpTask.length > 0) {
		task = this._usurpTask.shift();
		current = new Date().getTime();
		if(current - startTime < interval ) {
			task.func.apply(task.scope, task.params);
		} else {
			// this._usurpTask.unshift(task);
			break;
		}
	}



	this._highTasks = this._highTasks.concat(this._nextTasks);
	this._nextTasks = [];
	this._usurpTask = [];
};


p.addEF = function(scope, func, params) {
	params = params || [];
	var id = this._idTable;
	this._enterframeTasks[id] = {scope:scope, func:func, params:params};
	this._idTable ++;
	return id;
};


p.removeEF = function(id) {
	if(this._enterframeTasks[id] !== undefined) {
		this._enterframeTasks[id] = null;
	}
	return -1;
};


p.delay = function(scope, func, params, delay) {
	var time = new Date().getTime();
	var t = {scope:scope, func:func, params:params, delay:delay, time:time};
	this._delayTasks.push(t);
};


p.defer = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._deferTasks.push(t);
};


p.next = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._nextTasks.push(t);
};


p.usurp = function(scope, func, params) {
	var t = {scope:scope, func:func, params:params};
	this._usurpTask.push(t);
};


var instance = null;

Scheduler.getInstance = function() {
	if(instance === null) {
		instance = new Scheduler();
	}
	return instance;
};

module.exports = Scheduler.getInstance();
},{}],19:[function(_dereq_,module,exports){
"use strict";


var ShaderLibs = function() { };

ShaderLibs.shaders = {};

ShaderLibs.shaders.copyVert = "#define GLSLIFY 1\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

ShaderLibs.shaders.generalVert = "#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    vec3 pos = aVertexPosition;\n    pos *= scale;\n    pos += position;\n    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

ShaderLibs.shaders.copyFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n}";

ShaderLibs.shaders.alphaFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME TEXTURE_WITH_ALPHA\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n    gl_FragColor.a *= opacity;\n}";

ShaderLibs.shaders.simpleColorFrag = "#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_COLOR_FRAGMENT\n\nprecision highp float;\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = vec4(color, opacity);\n}";

ShaderLibs.shaders.depthFrag = "#define GLSLIFY 1\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float n;\nuniform float f;\n\nfloat getDepth(float z) {\n\treturn (6.0 * n) / (f + n - z*(f-n));\n}\n\nvoid main(void) {\n    float r = texture2D(texture, vTextureCoord).r;\n    float grey = getDepth(r);\n    gl_FragColor = vec4(grey, grey, grey, 1.0);\n}";


ShaderLibs.getShader = function(mId) {
	return this.shaders[mId];
};

ShaderLibs.get = ShaderLibs.getShader;
module.exports = ShaderLibs;
},{}],20:[function(_dereq_,module,exports){
"use strict";

var glm = _dereq_("gl-matrix");
var CameraPerspective = _dereq_("./CameraPerspective");
var EaseNumber = _dereq_("./EaseNumber");

var SimpleCamera = function(mListenerTarget) {
	this._listenerTarget = mListenerTarget || window;
	CameraPerspective.call(this);
	// this._isLocked = false;
	this._init();
};

var p = SimpleCamera.prototype = new CameraPerspective();
var s = CameraPerspective.prototype;

p._init = function() {
	this.radius          = new EaseNumber(1);
	this.position[2]     = this.radius.value;
	this.center          = glm.vec3.create( );
	this.up              = glm.vec3.clone( [0,-1,0] );
	this.lookAt(this.position, this.center, this.up);
	this._mouse          = {};
	this._preMouse       = {};
	this._isMouseDown    = false;
	
	this._rx             = new EaseNumber(0);
	this._rx.limit(-Math.PI/2, Math.PI/2);
	this._ry             = new EaseNumber(0);
	this._preRX          = 0;
	this._preRY          = 0;
	// this._isLocked       = false;
	this._isLockZoom 	 = false;
	this._isLockRotation = false;
	this._isInvert       = false;

	this._listenerTarget.addEventListener("mousewheel", this._onWheel.bind(this));
	this._listenerTarget.addEventListener("DOMMouseScroll", this._onWheel.bind(this));

	this._listenerTarget.addEventListener("mousedown", this._onMouseDown.bind(this));
	this._listenerTarget.addEventListener("touchstart", this._onMouseDown.bind(this));
	this._listenerTarget.addEventListener("mousemove", this._onMouseMove.bind(this));
	this._listenerTarget.addEventListener("touchmove", this._onMouseMove.bind(this));
	window.addEventListener("mouseup", this._onMouseUp.bind(this));
	window.addEventListener("touchend", this._onMouseUp.bind(this));
};

p.inverseControl = function(value) {
	if(value === undefined) {
		this._isInvert = true;
	} else {
		this._isInvert = value;
	}
};

p.lock = function(value) {
	if(value === undefined) {
		// this._isLocked = true;
		this._isLockZoom = true;
		this._isLockRotation = true;
	} else {
		this._isLockZoom = value;
		this._isLockRotation = value;
	}
};

p.lockRotation = function(value) {
	if(value === undefined) {
		this._isLockRotation = true;
	} else {
		this._isLockRotation = value;
	}
};

p.lockZoom = function(value) {
	this._isLockZoom = value === undefined ? true : value;
};

p._onMouseDown = function(mEvent) {
	if(this._isLockRotation) {return;}
	this._isMouseDown = true;
	getMouse(mEvent, this._mouse);
	getMouse(mEvent, this._preMouse);
	this._preRX = this._rx.targetValue;
	this._preRY = this._ry.targetValue;
};


p._onMouseMove = function(mEvent) {
	if(this._isLockRotation) {return;}
	getMouse(mEvent, this._mouse);
	if(mEvent.touches) {mEvent.preventDefault();}
	if(this._isMouseDown) {
		var diffX = this._mouse.x - this._preMouse.x;
		if(this._isInvert) {diffX *= -1;}
		this._ry.value = this._preRY - diffX * 0.01;

		var diffY = this._mouse.y - this._preMouse.y;
		if(this._isInvert) {diffY *= -1;}
		this._rx.value = this._preRX - diffY * 0.01;

		// if(this._rx.targetValue > Math.PI * 0.5) {this._rx.targetValue = Math;	}
	}
};


p._onMouseUp = function() {
	if(this._isLockRotation) {return;}
	this._isMouseDown = false;
	// getMouse(mEvent, this._mouse);
};


p._onWheel = function(aEvent) {
	if(this._isLockZoom) {	return;	}
	var w = aEvent.wheelDelta;
	var d = aEvent.detail;
	var value = 0;
	if (d){
		if (w) {
			value = w/d/40*d>0?1:-1; // Opera
		} else {
			value = -d/3;              // Firefox;         TODO: do not /3 for OS X
		}
	} else {
		value = w/120; 
	}

	// this._targetRadius -= value * 5;
	this.radius.add( -value * 5);
	
};


p.getMatrix = function() {
	this._updateCameraPosition();
	this.lookAt(this.position, this.center, this.up);
	return s.getMatrix.call(this);
};


p._updateCameraPosition = function() {
	this.position[2] 	= this.radius.value;

	this.position[1] = Math.sin(this._rx.value) * this.radius.value;
	var tr = Math.cos(this._rx.value) * this.radius.value;
	this.position[0] = Math.cos(this._ry.value + Math.PI*0.5) * tr;
	this.position[2] = Math.sin(this._ry.value + Math.PI*0.5) * tr;
};


var getMouse = function(mEvent, mTarget) {
	var o = mTarget || {};
	if(mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};


p.__defineGetter__("rx", function() {
	return this._rx.targetValue;
});
 
p.__defineSetter__("rx", function(mValue) {
	this._rx.value = mValue;
});

p.__defineGetter__("ry", function() {
	return this._ry.targetValue;
});
 
p.__defineSetter__("ry", function(mValue) {
	this._ry.value = mValue;
});

module.exports = SimpleCamera;
},{"./CameraPerspective":5,"./EaseNumber":6,"gl-matrix":2}],21:[function(_dereq_,module,exports){
"use strict";

var SimpleImageLoader = function() {
	this._imgs             = {};
	this._loadedCount      = 0;
	this._toLoadCount      = 0;
	this._scope            = undefined;
	this._callback         = undefined;
	this._callbackProgress = undefined;
};

var p = SimpleImageLoader.prototype;


p.load = function(imgs, scope, callback, progressCallback) {
	this._imgs = {};
	this._loadedCount = 0;
	this._toLoadCount = imgs.length;
	this._scope = scope;
	this._callback = callback;
	this._callbackProgress = progressCallback;

	this._imgLoadedBind = this._onImageLoaded.bind(this);

	for ( var i=0; i<imgs.length ; i++) {
		var img         = new Image();
		img.onload      = this._imgLoadedBind;
		var path        = imgs[i];
		var tmp         = path.split("/");
		var ref         = tmp[tmp.length-1].split(".")[0];
		this._imgs[ref] = img;
		img.src         = path;
	}
};


p._onImageLoaded = function() {
	this._loadedCount++;

	if(this._loadedCount === this._toLoadCount) {
		this._callback.call(this._scope, this._imgs);
	} else {
		var p = this._loadedCount / this._toLoadCount;
		if(this._callbackProgress) {
			this._callbackProgress.call(this._scope, p);
		}
	}
};

module.exports = SimpleImageLoader;
},{}],22:[function(_dereq_,module,exports){
// View.js
"use strict";

var GLShader = _dereq_("./GLShader");

var View = function(aPathVert, aPathFrag) {
	this.shader = new GLShader(aPathVert, aPathFrag);
	this._init();
};

var p = View.prototype;

p._init = function() {
	// console.log("Should be overwritten by SuperClass");
};

p.render = function() {
	// console.log("Should be overwritten by SuperClass");
};

module.exports = View;


},{"./GLShader":10}],23:[function(_dereq_,module,exports){
// ViewAxis.js

"use strict";
var GL = _dereq_("./GLTools");
var View = _dereq_("./View");
var Mesh = _dereq_("./Mesh");

var vertShader = "precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}";
var fragShader = "precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}";

var ViewAxis = function(lineWidth, mFragShader) {
	this.lineWidth = lineWidth === undefined ? 2.0 : lineWidth;
	var fs = mFragShader === undefined ? fragShader : mFragShader;
	View.call(this, vertShader, fs);
};

var p = ViewAxis.prototype = new View();

p._init = function() {
	// this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);

	var positions = [];
	var colors = [];
	var coords = [];
	var indices = [0, 1, 2, 3, 4, 5];
	var r = 9999;

	positions.push([-r,  0,  0]);
	positions.push([ r,  0,  0]);
	positions.push([ 0, -r,  0]);
	positions.push([ 0,  r,  0]);
	positions.push([ 0,  0, -r]);
	positions.push([ 0,  0,  r]);


	colors.push([1, 0, 0]);
	colors.push([1, 0, 0]);
	colors.push([0, 1, 0]);
	colors.push([0, 1, 0]);
	colors.push([0, 0, 1]);
	colors.push([0, 0, 1]);


	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);
	coords.push([0, 0]);


	this.mesh = new Mesh(positions.length, indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(colors, "aColor", 3, false);
};

p.render = function() {
	if(!this.shader.isReady()) {return;}

	this.shader.bind();
	GL.gl.lineWidth(this.lineWidth);
	GL.draw(this.mesh);
	GL.gl.lineWidth(1.0);
};

module.exports = ViewAxis;

},{"./GLTools":12,"./Mesh":13,"./View":22}],24:[function(_dereq_,module,exports){
"use strict";

var View = _dereq_("./View");
var GL = _dereq_("./GLTools");
var MeshUtils = _dereq_("./MeshUtils");

var ViewCopy = function(aPathVert, aPathFrag) {
	View.call(this, aPathVert, aPathFrag);
};

var p = ViewCopy.prototype = new View();

p._init = function() {
	if(!GL.gl) { return;	}
	this.mesh = MeshUtils.createPlane(2, 2, 1);
};

p.render = function(aTexture) {
	if(!this.shader.isReady()) {return;}
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	// console.log('Render', aTexture);
	aTexture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewCopy;

},{"./GLTools":12,"./MeshUtils":14,"./View":22}],25:[function(_dereq_,module,exports){
// ViewDotPlanes.js

"use strict";

var GL = _dereq_("./GLTools");
var View = _dereq_("./View");
var ShaderLibs = _dereq_("./ShaderLibs");
var Mesh = _dereq_("./Mesh");

// var vertShader = "precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}";
// var fragShader = "precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}";

var ViewDotPlanes = function(color, fragShader) {
	var grey = 0.75;
	this.color = color === undefined ? [grey, grey, grey] : color;
	var fs = fragShader === undefined ? ShaderLibs.get("simpleColorFrag") : fragShader;
	View.call(this, null, fs);
};

var p = ViewDotPlanes.prototype = new View();

p._init = function() {
	var positions = [];
	var coords = [];
	var indices = [];
	var index = 0;


	var numDots = 100;
	var size = 3000;
	var gap = size / numDots;
	var i, j;


	for(i=-size/2; i<size; i+=gap) {
		for(j=-size/2; j<size; j+=gap) {
			positions.push([i, j, 0]);
			coords.push([0, 0]);
			indices.push(index);
			index++;

			positions.push([i, 0, j]);
			coords.push([0, 0]);
			indices.push(index);
			index++;
		}
	}

	this.mesh = new Mesh(positions.length, indices.length, GL.gl.DOTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", this.color);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewDotPlanes;

},{"./GLTools":12,"./Mesh":13,"./ShaderLibs":19,"./View":22}]},{},[1])(1)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
module.exports = require('./vendor/dat.gui')
module.exports.color = require('./vendor/dat.color')
},{"./vendor/dat.color":14,"./vendor/dat.gui":15}],14:[function(require,module,exports){
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.color = dat.color || {};

/** @namespace */
dat.utils = dat.utils || {};

dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.Color = dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common),
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common);
},{}],15:[function(require,module,exports){
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.gui = dat.gui || {};

/** @namespace */
dat.utils = dat.utils || {};

/** @namespace */
dat.controllers = dat.controllers || {};

/** @namespace */
dat.dom = dat.dom || {};

/** @namespace */
dat.color = dat.color || {};

dat.utils.css = (function () {
  return {
    load: function (url, doc) {
      doc = doc || document;
      var link = doc.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      doc.getElementsByTagName('head')[0].appendChild(link);
    },
    inject: function(css, doc) {
      doc = doc || document;
      var injected = document.createElement('style');
      injected.type = 'text/css';
      injected.innerHTML = css;
      doc.getElementsByTagName('head')[0].appendChild(injected);
    }
  }
})();


dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.controllers.Controller = (function (common) {

  /**
   * @class An "abstract" class that represents a given property of an object.
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var Controller = function(object, property) {

    this.initialValue = object[property];

    /**
     * Those who extend this class will put their DOM elements in here.
     * @type {DOMElement}
     */
    this.domElement = document.createElement('div');

    /**
     * The object to manipulate
     * @type {Object}
     */
    this.object = object;

    /**
     * The name of the property to manipulate
     * @type {String}
     */
    this.property = property;

    /**
     * The function to be called on change.
     * @type {Function}
     * @ignore
     */
    this.__onChange = undefined;

    /**
     * The function to be called on finishing change.
     * @type {Function}
     * @ignore
     */
    this.__onFinishChange = undefined;

  };

  common.extend(

      Controller.prototype,

      /** @lends dat.controllers.Controller.prototype */
      {

        /**
         * Specify that a function fire every time someone changes the value with
         * this Controller.
         *
         * @param {Function} fnc This function will be called whenever the value
         * is modified via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onChange: function(fnc) {
          this.__onChange = fnc;
          return this;
        },

        /**
         * Specify that a function fire every time someone "finishes" changing
         * the value wih this Controller. Useful for values that change
         * incrementally like numbers or strings.
         *
         * @param {Function} fnc This function will be called whenever
         * someone "finishes" changing the value via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onFinishChange: function(fnc) {
          this.__onFinishChange = fnc;
          return this;
        },

        /**
         * Change the value of <code>object[property]</code>
         *
         * @param {Object} newValue The new value of <code>object[property]</code>
         */
        setValue: function(newValue) {
          this.object[this.property] = newValue;
          if (this.__onChange) {
            this.__onChange.call(this, newValue);
          }
          this.updateDisplay();
          return this;
        },

        /**
         * Gets the value of <code>object[property]</code>
         *
         * @returns {Object} The current value of <code>object[property]</code>
         */
        getValue: function() {
          return this.object[this.property];
        },

        /**
         * Refreshes the visual display of a Controller in order to keep sync
         * with the object's current value.
         * @returns {dat.controllers.Controller} this
         */
        updateDisplay: function() {
          return this;
        },

        /**
         * @returns {Boolean} true if the value has deviated from initialValue
         */
        isModified: function() {
          return this.initialValue !== this.getValue()
        }

      }

  );

  return Controller;


})(dat.utils.common);


dat.dom.dom = (function (common) {

  var EVENT_MAP = {
    'HTMLEvents': ['change'],
    'MouseEvents': ['click','mousemove','mousedown','mouseup', 'mouseover'],
    'KeyboardEvents': ['keydown']
  };

  var EVENT_MAP_INV = {};
  common.each(EVENT_MAP, function(v, k) {
    common.each(v, function(e) {
      EVENT_MAP_INV[e] = k;
    });
  });

  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

  function cssValueToPixels(val) {

    if (val === '0' || common.isUndefined(val)) return 0;

    var match = val.match(CSS_VALUE_PIXELS);

    if (!common.isNull(match)) {
      return parseFloat(match[1]);
    }

    // TODO ...ems? %?

    return 0;

  }

  /**
   * @namespace
   * @member dat.dom
   */
  var dom = {

    /**
     * 
     * @param elem
     * @param selectable
     */
    makeSelectable: function(elem, selectable) {

      if (elem === undefined || elem.style === undefined) return;

      elem.onselectstart = selectable ? function() {
        return false;
      } : function() {
      };

      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
      elem.unselectable = selectable ? 'on' : 'off';

    },

    /**
     *
     * @param elem
     * @param horizontal
     * @param vertical
     */
    makeFullscreen: function(elem, horizontal, vertical) {

      if (common.isUndefined(horizontal)) horizontal = true;
      if (common.isUndefined(vertical)) vertical = true;

      elem.style.position = 'absolute';

      if (horizontal) {
        elem.style.left = 0;
        elem.style.right = 0;
      }
      if (vertical) {
        elem.style.top = 0;
        elem.style.bottom = 0;
      }

    },

    /**
     *
     * @param elem
     * @param eventType
     * @param params
     */
    fakeEvent: function(elem, eventType, params, aux) {
      params = params || {};
      var className = EVENT_MAP_INV[eventType];
      if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
      }
      var evt = document.createEvent(className);
      switch (className) {
        case 'MouseEvents':
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false,
              params.cancelable || true, window, params.clickCount || 1,
              0, //screen X
              0, //screen Y
              clientX, //client X
              clientY, //client Y
              false, false, false, false, 0, null);
          break;
        case 'KeyboardEvents':
          var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
          common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false,
              params.cancelable, window,
              params.ctrlKey, params.altKey,
              params.shiftKey, params.metaKey,
              params.keyCode, params.charCode);
          break;
        default:
          evt.initEvent(eventType, params.bubbles || false,
              params.cancelable || true);
          break;
      }
      common.defaults(evt, aux);
      elem.dispatchEvent(evt);
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    bind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.addEventListener)
        elem.addEventListener(event, func, bool);
      else if (elem.attachEvent)
        elem.attachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    unbind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.removeEventListener)
        elem.removeEventListener(event, func, bool);
      else if (elem.detachEvent)
        elem.detachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    addClass: function(elem, className) {
      if (elem.className === undefined) {
        elem.className = className;
      } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);
        if (classes.indexOf(className) == -1) {
          classes.push(className);
          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    removeClass: function(elem, className) {
      if (className) {
        if (elem.className === undefined) {
          // elem.className = className;
        } else if (elem.className === className) {
          elem.removeAttribute('class');
        } else {
          var classes = elem.className.split(/ +/);
          var index = classes.indexOf(className);
          if (index != -1) {
            classes.splice(index, 1);
            elem.className = classes.join(' ');
          }
        }
      } else {
        elem.className = undefined;
      }
      return dom;
    },

    hasClass: function(elem, className) {
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
    },

    /**
     *
     * @param elem
     */
    getWidth: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-left-width']) +
          cssValueToPixels(style['border-right-width']) +
          cssValueToPixels(style['padding-left']) +
          cssValueToPixels(style['padding-right']) +
          cssValueToPixels(style['width']);
    },

    /**
     *
     * @param elem
     */
    getHeight: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-top-width']) +
          cssValueToPixels(style['border-bottom-width']) +
          cssValueToPixels(style['padding-top']) +
          cssValueToPixels(style['padding-bottom']) +
          cssValueToPixels(style['height']);
    },

    /**
     *
     * @param elem
     */
    getOffset: function(elem) {
      var offset = {left: 0, top:0};
      if (elem.offsetParent) {
        do {
          offset.left += elem.offsetLeft;
          offset.top += elem.offsetTop;
        } while (elem = elem.offsetParent);
      }
      return offset;
    },

    // http://stackoverflow.com/posts/2684561/revisions
    /**
     * 
     * @param elem
     */
    isActive: function(elem) {
      return elem === document.activeElement && ( elem.type || elem.href );
    }

  };

  return dom;

})(dat.utils.common);


dat.controllers.OptionController = (function (Controller, dom, common) {

  /**
   * @class Provides a select input to alter the property of an object, using a
   * list of accepted values.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object|string[]} options A map of labels to acceptable values, or
   * a list of acceptable string values.
   *
   * @member dat.controllers
   */
  var OptionController = function(object, property, options) {

    OptionController.superclass.call(this, object, property);

    var _this = this;

    /**
     * The drop down menu
     * @ignore
     */
    this.__select = document.createElement('select');

    if (common.isArray(options)) {
      var map = {};
      common.each(options, function(element) {
        map[element] = element;
      });
      options = map;
    }

    common.each(options, function(value, key) {

      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);

    });

    // Acknowledge original value
    this.updateDisplay();

    dom.bind(this.__select, 'change', function() {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });

    this.domElement.appendChild(this.__select);

  };

  OptionController.superclass = Controller;

  common.extend(

      OptionController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = OptionController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          return toReturn;
        },

        updateDisplay: function() {
          this.__select.value = this.getValue();
          return OptionController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return OptionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberController = (function (Controller, common) {

  /**
   * @class Represents a given property of an object that is a number.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberController = function(object, property, params) {

    NumberController.superclass.call(this, object, property);

    params = params || {};

    this.__min = params.min;
    this.__max = params.max;
    this.__step = params.step;

    if (common.isUndefined(this.__step)) {

      if (this.initialValue == 0) {
        this.__impliedStep = 1; // What are we, psychics?
      } else {
        // Hey Doug, check this out.
        this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue)/Math.LN10))/10;
      }

    } else {

      this.__impliedStep = this.__step;

    }

    this.__precision = numDecimals(this.__impliedStep);


  };

  NumberController.superclass = Controller;

  common.extend(

      NumberController.prototype,
      Controller.prototype,

      /** @lends dat.controllers.NumberController.prototype */
      {

        setValue: function(v) {

          if (this.__min !== undefined && v < this.__min) {
            v = this.__min;
          } else if (this.__max !== undefined && v > this.__max) {
            v = this.__max;
          }

          if (this.__step !== undefined && v % this.__step != 0) {
            v = Math.round(v / this.__step) * this.__step;
          }

          return NumberController.superclass.prototype.setValue.call(this, v);

        },

        /**
         * Specify a minimum value for <code>object[property]</code>.
         *
         * @param {Number} minValue The minimum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        min: function(v) {
          this.__min = v;
          return this;
        },

        /**
         * Specify a maximum value for <code>object[property]</code>.
         *
         * @param {Number} maxValue The maximum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        max: function(v) {
          this.__max = v;
          return this;
        },

        /**
         * Specify a step value that dat.controllers.NumberController
         * increments by.
         *
         * @param {Number} stepValue The step value for
         * dat.controllers.NumberController
         * @default if minimum and maximum specified increment is 1% of the
         * difference otherwise stepValue is 1
         * @returns {dat.controllers.NumberController} this
         */
        step: function(v) {
          this.__step = v;
          return this;
        }

      }

  );

  function numDecimals(x) {
    x = x.toString();
    if (x.indexOf('.') > -1) {
      return x.length - x.indexOf('.') - 1;
    } else {
      return 0;
    }
  }

  return NumberController;

})(dat.controllers.Controller,
dat.utils.common);


dat.controllers.NumberControllerBox = (function (NumberController, dom, common) {

  /**
   * @class Represents a given property of an object that is a number and
   * provides an input element with which to manipulate it.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerBox = function(object, property, params) {

    this.__truncationSuspended = false;

    NumberControllerBox.superclass.call(this, object, property, params);

    var _this = this;

    /**
     * {Number} Previous mouse y position
     * @ignore
     */
    var prev_y;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    // Makes it so manually specified values are not truncated.

    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'mousedown', onMouseDown);
    dom.bind(this.__input, 'keydown', function(e) {

      // When pressing entire, you can be as precise as you want.
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
      }

    });

    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!common.isNaN(attempted)) _this.setValue(attempted);
    }

    function onBlur() {
      onChange();
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prev_y = e.clientY;
    }

    function onMouseDrag(e) {

      var diff = prev_y - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prev_y = e.clientY;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  NumberControllerBox.superclass = NumberController;

  common.extend(

      NumberControllerBox.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {

          this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
          return NumberControllerBox.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  function roundToDecimal(value, decimals) {
    var tenTo = Math.pow(10, decimals);
    return Math.round(value * tenTo) / tenTo;
  }

  return NumberControllerBox;

})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberControllerSlider = (function (NumberController, dom, css, common, styleSheet) {

  /**
   * @class Represents a given property of an object that is a number, contains
   * a minimum and maximum, and provides a slider element with which to
   * manipulate it. It should be noted that the slider element is made up of
   * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
   * <code>&lt;slider&gt;</code> element.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   * 
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Number} minValue Minimum allowed value
   * @param {Number} maxValue Maximum allowed value
   * @param {Number} stepValue Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerSlider = function(object, property, min, max, step) {

    NumberControllerSlider.superclass.call(this, object, property, { min: min, max: max, step: step });

    var _this = this;

    this.__background = document.createElement('div');
    this.__foreground = document.createElement('div');
    


    dom.bind(this.__background, 'mousedown', onMouseDown);
    
    dom.addClass(this.__background, 'slider');
    dom.addClass(this.__foreground, 'slider-fg');

    function onMouseDown(e) {

      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);

      onMouseDrag(e);
    }

    function onMouseDrag(e) {

      e.preventDefault();

      var offset = dom.getOffset(_this.__background);
      var width = dom.getWidth(_this.__background);
      
      _this.setValue(
        map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max)
      );

      return false;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__background);

  };

  NumberControllerSlider.superclass = NumberController;

  /**
   * Injects default stylesheet for slider elements.
   */
  NumberControllerSlider.useDefaultStyles = function() {
    css.inject(styleSheet);
  };

  common.extend(

      NumberControllerSlider.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {
          var pct = (this.getValue() - this.__min)/(this.__max - this.__min);
          this.__foreground.style.width = pct*100+'%';
          return NumberControllerSlider.superclass.prototype.updateDisplay.call(this);
        }

      }



  );

  function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  }

  return NumberControllerSlider;
  
})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.css,
dat.utils.common,
".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");


dat.controllers.FunctionController = (function (Controller, dom, common) {

  /**
   * @class Provides a GUI interface to fire a specified method, a property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var FunctionController = function(object, property, text) {

    FunctionController.superclass.call(this, object, property);

    var _this = this;

    this.__button = document.createElement('div');
    this.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(this.__button, 'click', function(e) {
      e.preventDefault();
      _this.fire();
      return false;
    });

    dom.addClass(this.__button, 'button');

    this.domElement.appendChild(this.__button);


  };

  FunctionController.superclass = Controller;

  common.extend(

      FunctionController.prototype,
      Controller.prototype,
      {
        
        fire: function() {
          if (this.__onChange) {
            this.__onChange.call(this);
          }
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.getValue().call(this.object);
        }
      }

  );

  return FunctionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.BooleanController = (function (Controller, dom, common) {

  /**
   * @class Provides a checkbox input to alter the boolean property of an object.
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var BooleanController = function(object, property) {

    BooleanController.superclass.call(this, object, property);

    var _this = this;
    this.__prev = this.getValue();

    this.__checkbox = document.createElement('input');
    this.__checkbox.setAttribute('type', 'checkbox');


    dom.bind(this.__checkbox, 'change', onChange, false);

    this.domElement.appendChild(this.__checkbox);

    // Match original value
    this.updateDisplay();

    function onChange() {
      _this.setValue(!_this.__prev);
    }

  };

  BooleanController.superclass = Controller;

  common.extend(

      BooleanController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = BooleanController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.__prev = this.getValue();
          return toReturn;
        },

        updateDisplay: function() {
          
          if (this.getValue() === true) {
            this.__checkbox.setAttribute('checked', 'checked');
            this.__checkbox.checked = true;    
          } else {
              this.__checkbox.checked = false;
          }

          return BooleanController.superclass.prototype.updateDisplay.call(this);

        }


      }

  );

  return BooleanController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common);


dat.GUI = dat.gui.GUI = (function (css, saveDialogueContents, styleSheet, controllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, OptionController, ColorController, requestAnimationFrame, CenteredDiv, dom, common) {

  css.inject(styleSheet);

  /** Outer-most className for GUI's */
  var CSS_NAMESPACE = 'dg';

  var HIDE_KEY_CODE = 72;

  /** The only value shared between the JS and SCSS. Use caution. */
  var CLOSE_BUTTON_HEIGHT = 20;

  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

  var SUPPORTS_LOCAL_STORAGE = (function() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  })();

  var SAVE_DIALOGUE;

  /** Have we yet to create an autoPlace GUI? */
  var auto_place_virgin = true;

  /** Fixed position div that auto place GUI's go inside */
  var auto_place_container;

  /** Are we hiding the GUI's ? */
  var hide = false;

  /** GUI's which should be hidden */
  var hideable_guis = [];

  /**
   * A lightweight controller library for JavaScript. It allows you to easily
   * manipulate variables and fire functions on the fly.
   * @class
   *
   * @member dat.gui
   *
   * @param {Object} [params]
   * @param {String} [params.name] The name of this GUI.
   * @param {Object} [params.load] JSON object representing the saved state of
   * this GUI.
   * @param {Boolean} [params.auto=true]
   * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
   * @param {Boolean} [params.closed] If true, starts closed
   */
  var GUI = function(params) {

    var _this = this;

    /**
     * Outermost DOM Element
     * @type DOMElement
     */
    this.domElement = document.createElement('div');
    this.__ul = document.createElement('ul');
    this.domElement.appendChild(this.__ul);

    dom.addClass(this.domElement, CSS_NAMESPACE);

    /**
     * Nested GUI's by name
     * @ignore
     */
    this.__folders = {};

    this.__controllers = [];

    /**
     * List of objects I'm remembering for save, only used in top level GUI
     * @ignore
     */
    this.__rememberedObjects = [];

    /**
     * Maps the index of remembered objects to a map of controllers, only used
     * in top level GUI.
     *
     * @private
     * @ignore
     *
     * @example
     * [
     *  {
     *    propertyName: Controller,
     *    anotherPropertyName: Controller
     *  },
     *  {
     *    propertyName: Controller
     *  }
     * ]
     */
    this.__rememberedObjectIndecesToControllers = [];

    this.__listening = [];

    params = params || {};

    // Default parameters
    params = common.defaults(params, {
      autoPlace: true,
      width: GUI.DEFAULT_WIDTH
    });

    params = common.defaults(params, {
      resizable: params.autoPlace,
      hideable: params.autoPlace
    });


    if (!common.isUndefined(params.load)) {

      // Explicit preset
      if (params.preset) params.load.preset = params.preset;

    } else {

      params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };

    }

    if (common.isUndefined(params.parent) && params.hideable) {
      hideable_guis.push(this);
    }

    // Only root level GUI's are resizable.
    params.resizable = common.isUndefined(params.parent) && params.resizable;


    if (params.autoPlace && common.isUndefined(params.scrollable)) {
      params.scrollable = true;
    }
//    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;

    // Not part of params because I don't want people passing this in via
    // constructor. Should be a 'remembered' value.
    var use_local_storage =
        SUPPORTS_LOCAL_STORAGE &&
            localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';

    Object.defineProperties(this,

        /** @lends dat.gui.GUI.prototype */
        {

          /**
           * The parent <code>GUI</code>
           * @type dat.gui.GUI
           */
          parent: {
            get: function() {
              return params.parent;
            }
          },

          scrollable: {
            get: function() {
              return params.scrollable;
            }
          },

          /**
           * Handles <code>GUI</code>'s element placement for you
           * @type Boolean
           */
          autoPlace: {
            get: function() {
              return params.autoPlace;
            }
          },

          /**
           * The identifier for a set of saved values
           * @type String
           */
          preset: {

            get: function() {
              if (_this.parent) {
                return _this.getRoot().preset;
              } else {
                return params.load.preset;
              }
            },

            set: function(v) {
              if (_this.parent) {
                _this.getRoot().preset = v;
              } else {
                params.load.preset = v;
              }
              setPresetSelectIndex(this);
              _this.revert();
            }

          },

          /**
           * The width of <code>GUI</code> element
           * @type Number
           */
          width: {
            get: function() {
              return params.width;
            },
            set: function(v) {
              params.width = v;
              setWidth(_this, v);
            }
          },

          /**
           * The name of <code>GUI</code>. Used for folders. i.e
           * a folder's name
           * @type String
           */
          name: {
            get: function() {
              return params.name;
            },
            set: function(v) {
              // TODO Check for collisions among sibling folders
              params.name = v;
              if (title_row_name) {
                title_row_name.innerHTML = params.name;
              }
            }
          },

          /**
           * Whether the <code>GUI</code> is collapsed or not
           * @type Boolean
           */
          closed: {
            get: function() {
              return params.closed;
            },
            set: function(v) {
              params.closed = v;
              if (params.closed) {
                dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
              } else {
                dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
              }
              // For browsers that aren't going to respect the CSS transition,
              // Lets just check our height against the window height right off
              // the bat.
              this.onResize();

              if (_this.__closeButton) {
                _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
              }
            }
          },

          /**
           * Contains all presets
           * @type Object
           */
          load: {
            get: function() {
              return params.load;
            }
          },

          /**
           * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
           * <code>remember</code>ing
           * @type Boolean
           */
          useLocalStorage: {

            get: function() {
              return use_local_storage;
            },
            set: function(bool) {
              if (SUPPORTS_LOCAL_STORAGE) {
                use_local_storage = bool;
                if (bool) {
                  dom.bind(window, 'unload', saveToLocalStorage);
                } else {
                  dom.unbind(window, 'unload', saveToLocalStorage);
                }
                localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
              }
            }

          }

        });

    // Are we a root level GUI?
    if (common.isUndefined(params.parent)) {

      params.closed = false;

      dom.addClass(this.domElement, GUI.CLASS_MAIN);
      dom.makeSelectable(this.domElement, false);

      // Are we supposed to be loading locally?
      if (SUPPORTS_LOCAL_STORAGE) {

        if (use_local_storage) {

          _this.useLocalStorage = true;

          var saved_gui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

          if (saved_gui) {
            params.load = JSON.parse(saved_gui);
          }

        }

      }

      this.__closeButton = document.createElement('div');
      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
      this.domElement.appendChild(this.__closeButton);

      dom.bind(this.__closeButton, 'click', function() {

        _this.closed = !_this.closed;


      });


      // Oh, you're a nested GUI!
    } else {

      if (params.closed === undefined) {
        params.closed = true;
      }

      var title_row_name = document.createTextNode(params.name);
      dom.addClass(title_row_name, 'controller-name');

      var title_row = addRow(_this, title_row_name);

      var on_click_title = function(e) {
        e.preventDefault();
        _this.closed = !_this.closed;
        return false;
      };

      dom.addClass(this.__ul, GUI.CLASS_CLOSED);

      dom.addClass(title_row, 'title');
      dom.bind(title_row, 'click', on_click_title);

      if (!params.closed) {
        this.closed = false;
      }

    }

    if (params.autoPlace) {

      if (common.isUndefined(params.parent)) {

        if (auto_place_virgin) {
          auto_place_container = document.createElement('div');
          dom.addClass(auto_place_container, CSS_NAMESPACE);
          dom.addClass(auto_place_container, GUI.CLASS_AUTO_PLACE_CONTAINER);
          document.body.appendChild(auto_place_container);
          auto_place_virgin = false;
        }

        // Put it in the dom for you.
        auto_place_container.appendChild(this.domElement);

        // Apply the auto styles
        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);

      }


      // Make it not elastic.
      if (!this.parent) setWidth(_this, params.width);

    }

    dom.bind(window, 'resize', function() { _this.onResize() });
    dom.bind(this.__ul, 'webkitTransitionEnd', function() { _this.onResize(); });
    dom.bind(this.__ul, 'transitionend', function() { _this.onResize() });
    dom.bind(this.__ul, 'oTransitionEnd', function() { _this.onResize() });
    this.onResize();


    if (params.resizable) {
      addResizeHandle(this);
    }

    function saveToLocalStorage() {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }

    var root = _this.getRoot();
    function resetWidth() {
        var root = _this.getRoot();
        root.width += 1;
        common.defer(function() {
          root.width -= 1;
        });
      }

      if (!params.parent) {
        resetWidth();
      }

  };

  GUI.toggleHide = function() {

    hide = !hide;
    common.each(hideable_guis, function(gui) {
      gui.domElement.style.zIndex = hide ? -999 : 999;
      gui.domElement.style.opacity = hide ? 0 : 1;
    });
  };

  GUI.CLASS_AUTO_PLACE = 'a';
  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
  GUI.CLASS_MAIN = 'main';
  GUI.CLASS_CONTROLLER_ROW = 'cr';
  GUI.CLASS_TOO_TALL = 'taller-than-window';
  GUI.CLASS_CLOSED = 'closed';
  GUI.CLASS_CLOSE_BUTTON = 'close-button';
  GUI.CLASS_DRAG = 'drag';

  GUI.DEFAULT_WIDTH = 245;
  GUI.TEXT_CLOSED = 'Close Controls';
  GUI.TEXT_OPEN = 'Open Controls';

  dom.bind(window, 'keydown', function(e) {

    if (document.activeElement.type !== 'text' &&
        (e.which === HIDE_KEY_CODE || e.keyCode == HIDE_KEY_CODE)) {
      GUI.toggleHide();
    }

  }, false);

  common.extend(

      GUI.prototype,

      /** @lends dat.gui.GUI */
      {

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.Controller} The new controller that was added.
         * @instance
         */
        add: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                factoryArgs: Array.prototype.slice.call(arguments, 2)
              }
          );

        },

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.ColorController} The new controller that was added.
         * @instance
         */
        addColor: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                color: true
              }
          );

        },

        /**
         * @param controller
         * @instance
         */
        remove: function(controller) {

          // TODO listening?
          this.__ul.removeChild(controller.__li);
          this.__controllers.slice(this.__controllers.indexOf(controller), 1);
          var _this = this;
          common.defer(function() {
            _this.onResize();
          });

        },

        destroy: function() {

          if (this.autoPlace) {
            auto_place_container.removeChild(this.domElement);
          }

        },

        /**
         * @param name
         * @returns {dat.gui.GUI} The new folder.
         * @throws {Error} if this GUI already has a folder by the specified
         * name
         * @instance
         */
        addFolder: function(name) {

          // We have to prevent collisions on names in order to have a key
          // by which to remember saved values
          if (this.__folders[name] !== undefined) {
            throw new Error('You already have a folder in this GUI by the' +
                ' name "' + name + '"');
          }

          var new_gui_params = { name: name, parent: this };

          // We need to pass down the autoPlace trait so that we can
          // attach event listeners to open/close folder actions to
          // ensure that a scrollbar appears if the window is too short.
          new_gui_params.autoPlace = this.autoPlace;

          // Do we have saved appearance data for this folder?

          if (this.load && // Anything loaded?
              this.load.folders && // Was my parent a dead-end?
              this.load.folders[name]) { // Did daddy remember me?

            // Start me closed if I was closed
            new_gui_params.closed = this.load.folders[name].closed;

            // Pass down the loaded data
            new_gui_params.load = this.load.folders[name];

          }

          var gui = new GUI(new_gui_params);
          this.__folders[name] = gui;

          var li = addRow(this, gui.domElement);
          dom.addClass(li, 'folder');
          return gui;

        },

        open: function() {
          this.closed = false;
        },

        close: function() {
          this.closed = true;
        },

        onResize: function() {

          var root = this.getRoot();

          if (root.scrollable) {

            var top = dom.getOffset(root.__ul).top;
            var h = 0;

            common.each(root.__ul.childNodes, function(node) {
              if (! (root.autoPlace && node === root.__save_row))
                h += dom.getHeight(node);
            });

            if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
              dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
            } else {
              dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = 'auto';
            }

          }

          if (root.__resize_handle) {
            common.defer(function() {
              root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
            });
          }

          if (root.__closeButton) {
            root.__closeButton.style.width = root.width + 'px';
          }

        },

        /**
         * Mark objects for saving. The order of these objects cannot change as
         * the GUI grows. When remembering new objects, append them to the end
         * of the list.
         *
         * @param {Object...} objects
         * @throws {Error} if not called on a top level GUI.
         * @instance
         */
        remember: function() {

          if (common.isUndefined(SAVE_DIALOGUE)) {
            SAVE_DIALOGUE = new CenteredDiv();
            SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
          }

          if (this.parent) {
            throw new Error("You can only call remember on a top level GUI.");
          }

          var _this = this;

          common.each(Array.prototype.slice.call(arguments), function(object) {
            if (_this.__rememberedObjects.length == 0) {
              addSaveMenu(_this);
            }
            if (_this.__rememberedObjects.indexOf(object) == -1) {
              _this.__rememberedObjects.push(object);
            }
          });

          if (this.autoPlace) {
            // Set save row width
            setWidth(this, this.width);
          }

        },

        /**
         * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
         * @instance
         */
        getRoot: function() {
          var gui = this;
          while (gui.parent) {
            gui = gui.parent;
          }
          return gui;
        },

        /**
         * @returns {Object} a JSON object representing the current state of
         * this GUI as well as its remembered properties.
         * @instance
         */
        getSaveObject: function() {

          var toReturn = this.load;

          toReturn.closed = this.closed;

          // Am I remembering any values?
          if (this.__rememberedObjects.length > 0) {

            toReturn.preset = this.preset;

            if (!toReturn.remembered) {
              toReturn.remembered = {};
            }

            toReturn.remembered[this.preset] = getCurrentPreset(this);

          }

          toReturn.folders = {};
          common.each(this.__folders, function(element, key) {
            toReturn.folders[key] = element.getSaveObject();
          });

          return toReturn;

        },

        save: function() {

          if (!this.load.remembered) {
            this.load.remembered = {};
          }

          this.load.remembered[this.preset] = getCurrentPreset(this);
          markPresetModified(this, false);

        },

        saveAs: function(presetName) {

          if (!this.load.remembered) {

            // Retain default values upon first save
            this.load.remembered = {};
            this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);

          }

          this.load.remembered[presetName] = getCurrentPreset(this);
          this.preset = presetName;
          addPresetOption(this, presetName, true);

        },

        revert: function(gui) {

          common.each(this.__controllers, function(controller) {
            // Make revert work on Default.
            if (!this.getRoot().load.remembered) {
              controller.setValue(controller.initialValue);
            } else {
              recallSavedValue(gui || this.getRoot(), controller);
            }
          }, this);

          common.each(this.__folders, function(folder) {
            folder.revert(folder);
          });

          if (!gui) {
            markPresetModified(this.getRoot(), false);
          }


        },

        listen: function(controller) {

          var init = this.__listening.length == 0;
          this.__listening.push(controller);
          if (init) updateDisplays(this.__listening);

        }

      }

  );

  function add(gui, object, property, params) {

    if (object[property] === undefined) {
      throw new Error("Object " + object + " has no property \"" + property + "\"");
    }

    var controller;

    if (params.color) {

      controller = new ColorController(object, property);

    } else {

      var factoryArgs = [object,property].concat(params.factoryArgs);
      controller = controllerFactory.apply(gui, factoryArgs);

    }

    if (params.before instanceof Controller) {
      params.before = params.before.__li;
    }

    recallSavedValue(gui, controller);

    dom.addClass(controller.domElement, 'c');

    var name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;

    var container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);

    var li = addRow(gui, container, params.before);

    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
    dom.addClass(li, typeof controller.getValue());

    augmentController(gui, li, controller);

    gui.__controllers.push(controller);

    return controller;

  }

  /**
   * Add a row to the end of the GUI or before another row.
   *
   * @param gui
   * @param [dom] If specified, inserts the dom content in the new row
   * @param [liBefore] If specified, places the new row before another row
   */
  function addRow(gui, dom, liBefore) {
    var li = document.createElement('li');
    if (dom) li.appendChild(dom);
    if (liBefore) {
      gui.__ul.insertBefore(li, params.before);
    } else {
      gui.__ul.appendChild(li);
    }
    gui.onResize();
    return li;
  }

  function augmentController(gui, li, controller) {

    controller.__li = li;
    controller.__gui = gui;

    common.extend(controller, {

      options: function(options) {

        if (arguments.length > 1) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [common.toArray(arguments)]
              }
          );

        }

        if (common.isArray(options) || common.isObject(options)) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [options]
              }
          );

        }

      },

      name: function(v) {
        controller.__li.firstElementChild.firstElementChild.innerHTML = v;
        return controller;
      },

      listen: function() {
        controller.__gui.listen(controller);
        return controller;
      },

      remove: function() {
        controller.__gui.remove(controller);
        return controller;
      }

    });

    // All sliders should be accompanied by a box.
    if (controller instanceof NumberControllerSlider) {

      var box = new NumberControllerBox(controller.object, controller.property,
          { min: controller.__min, max: controller.__max, step: controller.__step });

      common.each(['updateDisplay', 'onChange', 'onFinishChange'], function(method) {
        var pc = controller[method];
        var pb = box[method];
        controller[method] = box[method] = function() {
          var args = Array.prototype.slice.call(arguments);
          pc.apply(controller, args);
          return pb.apply(box, args);
        }
      });

      dom.addClass(li, 'has-slider');
      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);

    }
    else if (controller instanceof NumberControllerBox) {

      var r = function(returned) {

        // Have we defined both boundaries?
        if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {

          // Well, then lets just replace this with a slider.
          controller.remove();
          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [controller.__min, controller.__max, controller.__step]
              });

        }

        return returned;

      };

      controller.min = common.compose(r, controller.min);
      controller.max = common.compose(r, controller.max);

    }
    else if (controller instanceof BooleanController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__checkbox, 'click');
      });

      dom.bind(controller.__checkbox, 'click', function(e) {
        e.stopPropagation(); // Prevents double-toggle
      })

    }
    else if (controller instanceof FunctionController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__button, 'click');
      });

      dom.bind(li, 'mouseover', function() {
        dom.addClass(controller.__button, 'hover');
      });

      dom.bind(li, 'mouseout', function() {
        dom.removeClass(controller.__button, 'hover');
      });

    }
    else if (controller instanceof ColorController) {

      dom.addClass(li, 'color');
      controller.updateDisplay = common.compose(function(r) {
        li.style.borderLeftColor = controller.__color.toString();
        return r;
      }, controller.updateDisplay);

      controller.updateDisplay();

    }

    controller.setValue = common.compose(function(r) {
      if (gui.getRoot().__preset_select && controller.isModified()) {
        markPresetModified(gui.getRoot(), true);
      }
      return r;
    }, controller.setValue);

  }

  function recallSavedValue(gui, controller) {

    // Find the topmost GUI, that's where remembered objects live.
    var root = gui.getRoot();

    // Does the object we're controlling match anything we've been told to
    // remember?
    var matched_index = root.__rememberedObjects.indexOf(controller.object);

    // Why yes, it does!
    if (matched_index != -1) {

      // Let me fetch a map of controllers for thcommon.isObject.
      var controller_map =
          root.__rememberedObjectIndecesToControllers[matched_index];

      // Ohp, I believe this is the first controller we've created for this
      // object. Lets make the map fresh.
      if (controller_map === undefined) {
        controller_map = {};
        root.__rememberedObjectIndecesToControllers[matched_index] =
            controller_map;
      }

      // Keep track of this controller
      controller_map[controller.property] = controller;

      // Okay, now have we saved any values for this controller?
      if (root.load && root.load.remembered) {

        var preset_map = root.load.remembered;

        // Which preset are we trying to load?
        var preset;

        if (preset_map[gui.preset]) {

          preset = preset_map[gui.preset];

        } else if (preset_map[DEFAULT_DEFAULT_PRESET_NAME]) {

          // Uhh, you can have the default instead?
          preset = preset_map[DEFAULT_DEFAULT_PRESET_NAME];

        } else {

          // Nada.

          return;

        }


        // Did the loaded object remember thcommon.isObject?
        if (preset[matched_index] &&

          // Did we remember this particular property?
            preset[matched_index][controller.property] !== undefined) {

          // We did remember something for this guy ...
          var value = preset[matched_index][controller.property];

          // And that's what it is.
          controller.initialValue = value;
          controller.setValue(value);

        }

      }

    }

  }

  function getLocalStorageHash(gui, key) {
    // TODO how does this deal with multiple GUI's?
    return document.location.href + '.' + key;

  }

  function addSaveMenu(gui) {

    var div = gui.__save_row = document.createElement('li');

    dom.addClass(gui.domElement, 'has-save');

    gui.__ul.insertBefore(div, gui.__ul.firstChild);

    dom.addClass(div, 'save-row');

    var gears = document.createElement('span');
    gears.innerHTML = '&nbsp;';
    dom.addClass(gears, 'button gears');

    // TODO replace with FunctionController
    var button = document.createElement('span');
    button.innerHTML = 'Save';
    dom.addClass(button, 'button');
    dom.addClass(button, 'save');

    var button2 = document.createElement('span');
    button2.innerHTML = 'New';
    dom.addClass(button2, 'button');
    dom.addClass(button2, 'save-as');

    var button3 = document.createElement('span');
    button3.innerHTML = 'Revert';
    dom.addClass(button3, 'button');
    dom.addClass(button3, 'revert');

    var select = gui.__preset_select = document.createElement('select');

    if (gui.load && gui.load.remembered) {

      common.each(gui.load.remembered, function(value, key) {
        addPresetOption(gui, key, key == gui.preset);
      });

    } else {
      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
    }

    dom.bind(select, 'change', function() {


      for (var index = 0; index < gui.__preset_select.length; index++) {
        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
      }

      gui.preset = this.value;

    });

    div.appendChild(select);
    div.appendChild(gears);
    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);

    if (SUPPORTS_LOCAL_STORAGE) {

      var saveLocally = document.getElementById('dg-save-locally');
      var explain = document.getElementById('dg-local-explain');

      saveLocally.style.display = 'block';

      var localStorageCheckBox = document.getElementById('dg-local-storage');

      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
        localStorageCheckBox.setAttribute('checked', 'checked');
      }

      function showHideExplain() {
        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
      }

      showHideExplain();

      // TODO: Use a boolean controller, fool!
      dom.bind(localStorageCheckBox, 'change', function() {
        gui.useLocalStorage = !gui.useLocalStorage;
        showHideExplain();
      });

    }

    var newConstructorTextArea = document.getElementById('dg-new-constructor');

    dom.bind(newConstructorTextArea, 'keydown', function(e) {
      if (e.metaKey && (e.which === 67 || e.keyCode == 67)) {
        SAVE_DIALOGUE.hide();
      }
    });

    dom.bind(gears, 'click', function() {
      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
      SAVE_DIALOGUE.show();
      newConstructorTextArea.focus();
      newConstructorTextArea.select();
    });

    dom.bind(button, 'click', function() {
      gui.save();
    });

    dom.bind(button2, 'click', function() {
      var presetName = prompt('Enter a new preset name.');
      if (presetName) gui.saveAs(presetName);
    });

    dom.bind(button3, 'click', function() {
      gui.revert();
    });

//    div.appendChild(button2);

  }

  function addResizeHandle(gui) {

    gui.__resize_handle = document.createElement('div');

    common.extend(gui.__resize_handle.style, {

      width: '6px',
      marginLeft: '-3px',
      height: '200px',
      cursor: 'ew-resize',
      position: 'absolute'
//      border: '1px solid blue'

    });

    var pmouseX;

    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
    dom.bind(gui.__closeButton, 'mousedown', dragStart);

    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);

    function dragStart(e) {

      e.preventDefault();

      pmouseX = e.clientX;

      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.bind(window, 'mousemove', drag);
      dom.bind(window, 'mouseup', dragStop);

      return false;

    }

    function drag(e) {

      e.preventDefault();

      gui.width += pmouseX - e.clientX;
      gui.onResize();
      pmouseX = e.clientX;

      return false;

    }

    function dragStop() {

      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.unbind(window, 'mousemove', drag);
      dom.unbind(window, 'mouseup', dragStop);

    }

  }

  function setWidth(gui, w) {
    gui.domElement.style.width = w + 'px';
    // Auto placed save-rows are position fixed, so we have to
    // set the width manually if we want it to bleed to the edge
    if (gui.__save_row && gui.autoPlace) {
      gui.__save_row.style.width = w + 'px';
    }if (gui.__closeButton) {
      gui.__closeButton.style.width = w + 'px';
    }
  }

  function getCurrentPreset(gui, useInitialValues) {

    var toReturn = {};

    // For each object I'm remembering
    common.each(gui.__rememberedObjects, function(val, index) {

      var saved_values = {};

      // The controllers I've made for thcommon.isObject by property
      var controller_map =
          gui.__rememberedObjectIndecesToControllers[index];

      // Remember each value for each property
      common.each(controller_map, function(controller, property) {
        saved_values[property] = useInitialValues ? controller.initialValue : controller.getValue();
      });

      // Save the values for thcommon.isObject
      toReturn[index] = saved_values;

    });

    return toReturn;

  }

  function addPresetOption(gui, name, setSelected) {
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = name;
    gui.__preset_select.appendChild(opt);
    if (setSelected) {
      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
    }
  }

  function setPresetSelectIndex(gui) {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      if (gui.__preset_select[index].value == gui.preset) {
        gui.__preset_select.selectedIndex = index;
      }
    }
  }

  function markPresetModified(gui, modified) {
    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
//    console.log('mark', modified, opt);
    if (modified) {
      opt.innerHTML = opt.value + "*";
    } else {
      opt.innerHTML = opt.value;
    }
  }

  function updateDisplays(controllerArray) {


    if (controllerArray.length != 0) {

      requestAnimationFrame(function() {
        updateDisplays(controllerArray);
      });

    }

    common.each(controllerArray, function(c) {
      c.updateDisplay();
    });

  }

  return GUI;

})(dat.utils.css,
"<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>",
".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n",
dat.controllers.factory = (function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {

      return function(object, property) {

        var initialValue = object[property];

        // Providing options?
        if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
          return new OptionController(object, property, arguments[2]);
        }

        // Providing a map?

        if (common.isNumber(initialValue)) {

          if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {

            // Has min and max.
            return new NumberControllerSlider(object, property, arguments[2], arguments[3]);

          } else {

            return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });

          }

        }

        if (common.isString(initialValue)) {
          return new StringController(object, property);
        }

        if (common.isFunction(initialValue)) {
          return new FunctionController(object, property, '');
        }

        if (common.isBoolean(initialValue)) {
          return new BooleanController(object, property);
        }

      }

    })(dat.controllers.OptionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.StringController = (function (Controller, dom, common) {

  /**
   * @class Provides a text input to alter the string property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var StringController = function(object, property) {

    StringController.superclass.call(this, object, property);

    var _this = this;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    dom.bind(this.__input, 'keyup', onChange);
    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  StringController.superclass = Controller;

  common.extend(

      StringController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {
          // Stops the caret from moving on account of:
          // keyup -> setValue -> updateDisplay
          if (!dom.isActive(this.__input)) {
            this.__input.value = this.getValue();
          }
          return StringController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return StringController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common),
dat.controllers.FunctionController,
dat.controllers.BooleanController,
dat.utils.common),
dat.controllers.Controller,
dat.controllers.BooleanController,
dat.controllers.FunctionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.OptionController,
dat.controllers.ColorController = (function (Controller, dom, Color, interpret, common) {

  var ColorController = function(object, property) {

    ColorController.superclass.call(this, object, property);

    this.__color = new Color(this.getValue());
    this.__temp = new Color(0);

    var _this = this;

    this.domElement = document.createElement('div');

    dom.makeSelectable(this.domElement, false);

    this.__selector = document.createElement('div');
    this.__selector.className = 'selector';

    this.__saturation_field = document.createElement('div');
    this.__saturation_field.className = 'saturation-field';

    this.__field_knob = document.createElement('div');
    this.__field_knob.className = 'field-knob';
    this.__field_knob_border = '2px solid ';

    this.__hue_knob = document.createElement('div');
    this.__hue_knob.className = 'hue-knob';

    this.__hue_field = document.createElement('div');
    this.__hue_field.className = 'hue-field';

    this.__input = document.createElement('input');
    this.__input.type = 'text';
    this.__input_textShadow = '0 1px 1px ';

    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) { // on enter
        onBlur.call(this);
      }
    });

    dom.bind(this.__input, 'blur', onBlur);

    dom.bind(this.__selector, 'mousedown', function(e) {

      dom
        .addClass(this, 'drag')
        .bind(window, 'mouseup', function(e) {
          dom.removeClass(_this.__selector, 'drag');
        });

    });

    var value_field = document.createElement('div');

    common.extend(this.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });

    common.extend(this.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    
    common.extend(this.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });

    common.extend(this.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });

    common.extend(value_field.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    
    linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');

    common.extend(this.__hue_field.style, {
      width: '15px',
      height: '100px',
      display: 'inline-block',
      border: '1px solid #555',
      cursor: 'ns-resize'
    });

    hueGradient(this.__hue_field);

    common.extend(this.__input.style, {
      outline: 'none',
//      width: '120px',
      textAlign: 'center',
//      padding: '4px',
//      marginBottom: '6px',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });

    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
    dom.bind(this.__field_knob, 'mousedown', fieldDown);

    dom.bind(this.__hue_field, 'mousedown', function(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'mouseup', unbindH);
    });

    function fieldDown(e) {
      setSV(e);
      // document.body.style.cursor = 'none';
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'mouseup', unbindSV);
    }

    function unbindSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'mouseup', unbindSV);
      // document.body.style.cursor = 'default';
    }

    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function unbindH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'mouseup', unbindH);
    }

    this.__saturation_field.appendChild(value_field);
    this.__selector.appendChild(this.__field_knob);
    this.__selector.appendChild(this.__saturation_field);
    this.__selector.appendChild(this.__hue_field);
    this.__hue_field.appendChild(this.__hue_knob);

    this.domElement.appendChild(this.__input);
    this.domElement.appendChild(this.__selector);

    this.updateDisplay();

    function setSV(e) {

      e.preventDefault();

      var w = dom.getWidth(_this.__saturation_field);
      var o = dom.getOffset(_this.__saturation_field);
      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;

      if (v > 1) v = 1;
      else if (v < 0) v = 0;

      if (s > 1) s = 1;
      else if (s < 0) s = 0;

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());


      return false;

    }

    function setH(e) {

      e.preventDefault();

      var s = dom.getHeight(_this.__hue_field);
      var o = dom.getOffset(_this.__hue_field);
      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;

      if (h > 1) h = 1;
      else if (h < 0) h = 0;

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;

    }

  };

  ColorController.superclass = Controller;

  common.extend(

      ColorController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {

          var i = interpret(this.getValue());

          if (i !== false) {

            var mismatch = false;

            // Check for mismatch on the interpreted value.

            common.each(Color.COMPONENTS, function(component) {
              if (!common.isUndefined(i[component]) &&
                  !common.isUndefined(this.__color.__state[component]) &&
                  i[component] !== this.__color.__state[component]) {
                mismatch = true;
                return {}; // break
              }
            }, this);

            // If nothing diverges, we keep our previous values
            // for statefulness, otherwise we recalculate fresh
            if (mismatch) {
              common.extend(this.__color.__state, i);
            }

          }

          common.extend(this.__temp.__state, this.__color.__state);

          this.__temp.a = 1;

          var flip = (this.__color.v < .5 || this.__color.s > .5) ? 255 : 0;
          var _flip = 255 - flip;

          common.extend(this.__field_knob.style, {
            marginLeft: 100 * this.__color.s - 7 + 'px',
            marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
            backgroundColor: this.__temp.toString(),
            border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip +')'
          });

          this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px'

          this.__temp.s = 1;
          this.__temp.v = 1;

          linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());

          common.extend(this.__input.style, {
            backgroundColor: this.__input.value = this.__color.toString(),
            color: 'rgb(' + flip + ',' + flip + ',' + flip +')',
            textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip +',.7)'
          });

        }

      }

  );
  
  var vendors = ['-moz-','-o-','-webkit-','-ms-',''];
  
  function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    common.each(vendors, function(vendor) {
      elem.style.cssText += 'background: ' + vendor + 'linear-gradient('+x+', '+a+' 0%, ' + b + ' 100%); ';
    });
  }
  
  function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);'
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
  }


  return ColorController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret,
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common),
dat.color.interpret,
dat.utils.common),
dat.utils.requestAnimationFrame = (function () {

  /**
   * requirejs version of Paul Irish's RequestAnimationFrame
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   */

  return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {

        window.setTimeout(callback, 1000 / 60);

      };
})(),
dat.dom.CenteredDiv = (function (dom, common) {


  var CenteredDiv = function() {

    this.backgroundElement = document.createElement('div');
    common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear'
    });

    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';

    this.domElement = document.createElement('div');
    common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear'
    });


    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;
    dom.bind(this.backgroundElement, 'click', function() {
      _this.hide();
    });


  };

  CenteredDiv.prototype.show = function() {

    var _this = this;
    


    this.backgroundElement.style.display = 'block';

    this.domElement.style.display = 'block';
    this.domElement.style.opacity = 0;
//    this.domElement.style.top = '52%';
    this.domElement.style.webkitTransform = 'scale(1.1)';

    this.layout();

    common.defer(function() {
      _this.backgroundElement.style.opacity = 1;
      _this.domElement.style.opacity = 1;
      _this.domElement.style.webkitTransform = 'scale(1)';
    });

  };

  CenteredDiv.prototype.hide = function() {

    var _this = this;

    var hide = function() {

      _this.domElement.style.display = 'none';
      _this.backgroundElement.style.display = 'none';

      dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
      dom.unbind(_this.domElement, 'transitionend', hide);
      dom.unbind(_this.domElement, 'oTransitionEnd', hide);

    };

    dom.bind(this.domElement, 'webkitTransitionEnd', hide);
    dom.bind(this.domElement, 'transitionend', hide);
    dom.bind(this.domElement, 'oTransitionEnd', hide);

    this.backgroundElement.style.opacity = 0;
//    this.domElement.style.top = '48%';
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = 'scale(1.1)';

  };

  CenteredDiv.prototype.layout = function() {
    this.domElement.style.left = window.innerWidth/2 - dom.getWidth(this.domElement) / 2 + 'px';
    this.domElement.style.top = window.innerHeight/2 - dom.getHeight(this.domElement) / 2 + 'px';
  };
  
  function lockScroll(e) {
    console.log(e);
  }

  return CenteredDiv;

})(dat.dom.dom,
dat.utils.common),
dat.dom.dom,
dat.utils.common);
},{}]},{},[3]);
