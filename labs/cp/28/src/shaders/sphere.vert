precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D simplexTexture;
uniform sampler2D permTexture;


uniform float time;
uniform float angle;


varying vec2 vTextureCoord;
varying vec3 vVertexPos;

varying vec3 vViewPosition;

#define PI 3.141592653589793



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

float pulse(float time) {
    // const float pi = 3.14;
    float frequency = 10.0;
    return 0.5*(1.0+sin(2.0 * PI * frequency * time));
}

void main(void) {

	vec3 newPosition = aVertexPosition;

	// float n = snoise(vec3(.5 * newPosition.xyz * (pulse(time)  )));

	// float n = snoise(vec3(0.5 * newPosition.xyz * (1.2 + pulse( .5 * time))));
	float n = snoise(vec3(1.0 * newPosition.xyz * (2.0 + pulse(0.5 * angle))));

	newPosition.z += n;
	newPosition.y += n/1.0;
	// newPosition.z *= cos((time-0.1) * 3.14);

	vec4 mvPosition = uMVMatrix * vec4( newPosition, 1.0 );
   	vViewPosition = -mvPosition.xyz;

    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);
    vTextureCoord = aTextureCoord;

    // vVertexPos = aVertexPosition;
}