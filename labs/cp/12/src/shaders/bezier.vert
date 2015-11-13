precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D controlValsTexture;
uniform sampler2D simplexTexture;
uniform sampler2D permTexture;
uniform float angle;
uniform float time;

//control points
vec3 pointA = vec3( 0.0, 1.5, 0.5 );
vec3 pointB = vec3( 0.33, 1.5, 0.5 );
vec3 pointC = vec3( 0.66, 1.5, 0.5 );
vec3 pointD = vec3( 1.5, 1.5, 0.5 );

vec3 pointE = vec3( 0.0, 0.66, 0.5 );
vec3 pointF = vec3( 0.33, 0.66, 0.5 );
vec3 pointG = vec3( 0.66, 0.66, 0.5 );
vec3 pointH = vec3( 1.5, 0.66, 0.5 );

vec3 pointI = vec3( 0.0, 0.33, 0.5 );
vec3 pointJ = vec3( 0.33, 0.33, 0.5 );
vec3 pointK = vec3( 0.66, 0.33, 0.5 );
vec3 pointL = vec3( 1.5, 0.33, 0.5 );

vec3 pointM = vec3( 0.0, 0.0, 0.5 );
vec3 pointN = vec3( 0.33, 0.0, 0.5 );
vec3 pointO = vec3( 0.66, 0.0, 0.5 );
vec3 pointP = vec3( 1.5, 0.0, 0.5 );


// #define  PI  3.14;

varying vec3 vViewPosition;


varying vec2 vTextureCoord;


float calcPointX(float a, float c){

  float n = 3.0;
  float b = 1.0 - a;
  float d = 1.0 - c;



  float aVal = pointA[0] * pow(a, n) * pow(c, n);
  
  float bVal = pointB[0] * n * pow(a, n) * pow(c, n-1.0) * d;

  float cVal = pointC[0] * n * pow(a, n) * c * pow(d, n-1.0);

  float dVal = pointD[0] * pow(a, n) * pow(d, n);

  
  float eVal = pointE[0] * n * pow(a, n-1.0) * b * pow(c, n);

  float fVal = pointF[0] * 9.0 * pow(a, n-1.0) * b * pow(c, n-1.0) * d;

  float gVal = pointG[0] * 9.0 * pow(a, n-1.0) * b * c * pow(d, n-1.0);

  float hVal = pointH[0] * n * pow(a, n-1.0) * b * pow(d, n);

  
  float iVal = pointI[0] * n * a * pow(b, n-1.0) * pow(c, n);

  float jVal = pointJ[0] * 9.0 * a * pow(b, n-1.0) * pow(c, n-1.0) * d;

  float kVal = pointK[0] * 9.0 * a * pow(b, n-1.0) * c * pow(d, n-1.0);

  float lVal = pointL[0] * n * a * pow(b, n-1.0) * pow(d, n);

  
  float mVal = pointM[0] * pow(b, n) * pow(c, n);

  float nVal = pointN[0] * n * pow(b, n) * pow(c, n-1.0) * d;

  float oVal = pointO[0] * n * pow(b, n) * c * pow(d, n-1.0);

  float pVal = pointP[0] * pow(b, n) * pow(d, n);

  return aVal + bVal + cVal + dVal + eVal + fVal + gVal + hVal + iVal + jVal + kVal + lVal + mVal + nVal + oVal + pVal;

}

float calcPointY(float a, float c){

  float n = 3.0;
  float b = 1.0 - a;
  float d = 1.0 - c;



  float aVal = pointA[1] * pow(a, n) * pow(c, n);
  
  float bVal = pointB[1] * n * pow(a, n) * pow(c, n-1.0) * d;

  float cVal = pointC[1] * n * pow(a, n) * c * pow(d, n-1.0);

  float dVal = pointD[1] * pow(a, n) * pow(d, n);

  
  float eVal = pointE[1] * n * pow(a, n-1.0) * b * pow(c, n);

  float fVal = pointF[1] * 9.0 * pow(a, n-1.0) * b * pow(c, n-1.0) * d;

  float gVal = pointG[1] * 9.0 * pow(a, n-1.0) * b * c * pow(d, n-1.0);

  float hVal = pointH[1] * n * pow(a, n-1.0) * b * pow(d, n);

  
  float iVal = pointI[1] * n * a * pow(b, n-1.0) * pow(c, n);

  float jVal = pointJ[1] * 9.0 * a * pow(b, n-1.0) * pow(c, n-1.0) * d;

  float kVal = pointK[1] * 9.0 * a * pow(b, n-1.0) * c * pow(d, n-1.0);

  float lVal = pointL[1] * n * a * pow(b, n-1.0) * pow(d, n);

  
  float mVal = pointM[1] * pow(b, n) * pow(c, n);

  float nVal = pointN[1] * n * pow(b, n) * pow(c, n-1.0) * d;

  float oVal = pointO[1] * n * pow(b, n) * c * pow(d, n-1.0);

  float pVal = pointP[1] * pow(b, n) * pow(d, n);

  return aVal + bVal + cVal + dVal + eVal + fVal + gVal + hVal + iVal + jVal + kVal + lVal + mVal + nVal + oVal + pVal;

}

float calcPointZ(float a, float c){

  float n = 3.0;
  float b = 1.0 - a;
  float d = 1.0 - c;



  float aVal = pointA[2] * pow(a, n) * pow(c, n);
  
  float bVal = pointB[2] * n * pow(a, n) * pow(c, n-1.0) * d;

  float cVal = pointC[2] * n * pow(a, n) * c * pow(d, n-1.0);

  float dVal = pointD[2] * pow(a, n) * pow(d, n);

  
  float eVal = pointE[2] * n * pow(a, n-1.0) * b * pow(c, n);

  float fVal = pointF[2] * 9.0 * pow(a, n-1.0) * b * pow(c, n-1.0) * d;

  float gVal = pointG[2] * 9.0 * pow(a, n-1.0) * b * c * pow(d, n-1.0);

  float hVal = pointH[2] * n * pow(a, n-1.0) * b * pow(d, n);

  
  float iVal = pointI[2] * n * a * pow(b, n-1.0) * pow(c, n);

  float jVal = pointJ[2] * 9.0 * a * pow(b, n-1.0) * pow(c, n-1.0) * d;

  float kVal = pointK[2] * 9.0 * a * pow(b, n-1.0) * c * pow(d, n-1.0);

  float lVal = pointL[2] * n * a * pow(b, n-1.0) * pow(d, n);

  
  float mVal = pointM[2] * pow(b, n) * pow(c, n);

  float nVal = pointN[2] * n * pow(b, n) * pow(c, n-1.0) * d;

  float oVal = pointO[2] * n * pow(b, n) * c * pow(d, n-1.0);

  float pVal = pointP[2] * pow(b, n) * pow(d, n);

  return aVal + bVal + cVal + dVal + eVal + fVal + gVal + hVal + iVal + jVal + kVal + lVal + mVal + nVal + oVal + pVal;

}

#define ONE 0.00390625
#define ONEHALF 0.001953125

/*
 * 3D simplex noise. Comparable in speed to classic noise, better looking.
 */
float snoise(vec3 P){

  // The skewing and unskewing factors are much simpler for the 3D case
  #define F3 0.333333333333
  #define G3 0.166666666667

  // Skew the (x,y,z) space to determine which cell of 6 simplices we're in
  float s = (P.x + P.y + P.z) * F3; // Factor for 3D skewing
  vec3 Pi = floor(P + s);
  float t = (Pi.x + Pi.y + Pi.z) * G3;
  vec3 P0 = Pi - t; // Unskew the cell origin back to (x,y,z) space
  Pi = Pi * ONE + ONEHALF; // Integer part, scaled and offset for texture lookup

  vec3 Pf0 = P - P0;  // The x,y distances from the cell origin

  // // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
  // // To find out which of the six possible tetrahedra we're in, we need to
  // // determine the magnitude ordering of x, y and z components of Pf0.
  // // The method below is explained briefly in the C code. It uses a small
  // // 1D texture as a lookup table. The table is designed to work for both
  // // 3D and 4D noise, so only 8 (only 6, actually) of the 64 indices are
  // // used here.
  float c1 = (Pf0.x > Pf0.y) ? 0.5078125 : 0.0078125; // 1/2 + 1/128
  float c2 = (Pf0.x > Pf0.z) ? 0.25 : 0.0;
  float c3 = (Pf0.y > Pf0.z) ? 0.125 : 0.0;
  float sindex = c1 + c2 + c3;
  vec3 offsets = texture2D(simplexTexture, vec2(sindex, 0)).rgb;
  vec3 o1 = step(0.375, offsets);
  vec3 o2 = step(0.125, offsets);

  // Noise contribution from simplex origin
  float perm0 = texture2D(permTexture, Pi.xy).a;
  vec3  grad0 = texture2D(permTexture, vec2(perm0, Pi.z)).rgb * 4.0 - 1.0;
  float t0 = 0.6 - dot(Pf0, Pf0);
  float n0;
  if (t0 < 0.0) n0 = 0.0;
  else {
    t0 *= t0;
    n0 = t0 * t0 * dot(grad0, Pf0);
  }

  // Noise contribution from second corner
  vec3 Pf1 = Pf0 - o1 + G3;
  float perm1 = texture2D(permTexture, Pi.xy + o1.xy*ONE).a;
  vec3  grad1 = texture2D(permTexture, vec2(perm1, Pi.z + o1.z*ONE)).rgb * 4.0 - 1.0;
  float t1 = 0.6 - dot(Pf1, Pf1);
  float n1;
  if (t1 < 0.0) n1 = 0.0;
  else {
    t1 *= t1;
    n1 = t1 * t1 * dot(grad1, Pf1);
  }
  
  // Noise contribution from third corner
  vec3 Pf2 = Pf0 - o2 + 2.0 * G3;
  float perm2 = texture2D(permTexture, Pi.xy + o2.xy*ONE).a;
  vec3  grad2 = texture2D(permTexture, vec2(perm2, Pi.z + o2.z*ONE)).rgb * 4.0 - 1.0;
  float t2 = 0.6 - dot(Pf2, Pf2);
  float n2;
  if (t2 < 0.0) n2 = 0.0;
  else {
    t2 *= t2;
    n2 = t2 * t2 * dot(grad2, Pf2);
  }
  
  // Noise contribution from last corner
  vec3 Pf3 = Pf0 - vec3(1.0-3.0*G3);
  float perm3 = texture2D(permTexture, Pi.xy + vec2(ONE, ONE)).a;
  vec3  grad3 = texture2D(permTexture, vec2(perm3, Pi.z + ONE)).rgb * 4.0 - 1.0;
  float t3 = 0.6 - dot(Pf3, Pf3);
  float n3;
  if(t3 < 0.0) n3 = 0.0;
  else {
    t3 *= t3;
    n3 = t3 * t3 * dot(grad3, Pf3);
  }

  // Sum up and scale the result to cover the range [-1,1]
  return 32.0 * (n0 + n1 + n2 + n3);
}


void main(void) {

  gl_PointSize = 1.0;

  vec3 newPosition = aVertexPosition;

  vec2 controlVals = texture2D(controlValsTexture, aTextureCoord).rg;

  float a = controlVals.r;
  float c = controlVals.g;


  pointA.z += sin(angle) * 0.7;
  pointP.z += sin(angle) * 0.7;
  
  pointM.z += sin(angle) * 0.2;

  pointL.z += cos(angle) * 0.2;
  pointB.z += cos(angle) * 0.2;

  pointH.z += cos(angle) * 0.1;
  pointC.z += cos(angle) * 0.1;

  pointN.z += cos(angle) * 0.6;
  pointE.z += cos(angle) * 0.6;
  pointD.z += sin(angle) * 0.3;
  pointI.z += sin(angle) * 0.5;


  float vertical = sin(angle) * 0.3;
  pointA.x += vertical;
  pointB.x += vertical;
  pointC.x += vertical;
  pointD.x += vertical;

  pointE.x += vertical;
  pointF.x += vertical;
  pointG.x += vertical;
  pointH.x += vertical;

  pointI.x += vertical;
  pointJ.x += vertical;
  pointK.x += vertical;
  pointL.x += vertical;

  pointM.x += vertical;
  pointN.x += vertical;
  pointO.x += vertical;
  pointP.x += vertical;

  // float horizontal = sin(angle) * 0.3;
  pointA.y += vertical;
  pointB.y += vertical;
  pointC.y += vertical;
  pointD.y += vertical;

  pointE.y += vertical;
  pointF.y += vertical;
  pointG.y += vertical;
  pointH.y += vertical;

  pointI.y += vertical;
  pointJ.y += vertical;
  pointK.y += vertical;
  pointL.y += vertical;

  pointM.y += vertical;
  pointN.y += vertical;
  pointO.y += vertical;
  pointP.y += vertical;

  pointD.z += cos(angle) * 0.011;

  pointK.z += sin(angle) * 0.5;

  float x = calcPointX(a, c);
  float y = calcPointY(a, c);
  float z = calcPointZ(a, c);

  float range = 2.0;

  newPosition.x = x * range - 1.0;
  newPosition.y = y * range - 1.0;
  newPosition.z = z * range - 1.0;

  float n = snoise(vec3(0.5 * newPosition.xyz * (2.0 + sin(0.5 * time))));

  newPosition.z *= n/1.5;

  vec4 mvPosition = uMVMatrix * vec4( newPosition, 1.0 );
  vViewPosition = -mvPosition.xyz;

  gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);
  vTextureCoord = aTextureCoord;
}