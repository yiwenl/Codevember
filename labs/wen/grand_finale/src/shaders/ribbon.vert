// ribbon.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec4 aPositionUV;
attribute vec2 aTextureCoord;
attribute vec3 aExtra;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

const int NUM_TEXS = {{numTex}};

uniform sampler2D textures[NUM_TEXS];
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D texture5;
uniform sampler2D texture6;
uniform sampler2D texture7;
uniform sampler2D texture8;
uniform sampler2D texture9;
uniform float range;

const float PI = 3.141592657;
varying vec2 vTextureCoord;
varying float vOpacity;
varying float vDepth;
varying vec3 vVertex;
varying vec3 vNormal;
varying vec3 vExtra;

vec2 rotate(vec2 v, float a) {
	float c = cos(a);
	float s = sin(a);
	mat2 r = mat2(s, c, -c, s);
	return r * v;
}

//float n = 5.0;
//float f = 3000.0;
	
float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

float getDepth(float z) {
	return getDepth(z, 5.0, 3000.0);
}

vec3 getPos(vec3 value) {
	
	return value;
}


vec3 getPositionFromTexture(vec2 uv, float i) {
	vec3 pos = vec3(.0);

	if(i < 1.0) {
		pos = getPos(texture2D(texture0, uv).rgb);
	} else if(i<2.0) {
		pos = getPos(texture2D(texture1, uv).rgb);
	} else if(i<3.0) {
		pos = getPos(texture2D(texture2, uv).rgb);
	} else if(i<4.0) {
		pos = getPos(texture2D(texture3, uv).rgb);
	} else if(i<5.0) {
		pos = getPos(texture2D(texture4, uv).rgb);
	} else if(i<6.0) {
		pos = getPos(texture2D(texture5, uv).rgb);
	} else if(i<7.0) {
		pos = getPos(texture2D(texture6, uv).rgb);
	} else if(i<8.0) {
		pos = getPos(texture2D(texture7, uv).rgb);
	} else if(i<9.0) {
		pos = getPos(texture2D(texture8, uv).rgb);
	} else {
		pos = getPos(texture2D(texture9, uv).rgb);
	}

	return pos;
}

mat3 lookat( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}


void main(void) {
	vec2 uv     = aPositionUV.xy/2.0;
	vec3 pos    = getPositionFromTexture(uv, aPositionUV.z);
	vec3 prePos = getPositionFromTexture(uv, aPositionUV.w);
	vec3 start  = getPos(texture2D(texture0, uv).rgb);
	vec3 end    = getPos(texture2D(texture9, uv).rgb);

	float angle = atan(pos.y, pos.z)-PI*.5;
	mat3 dir = lookat(prePos, pos, 0.0);
	vec3 tmpPos = dir*aVertexPosition;

	tmpPos.yz = rotate(tmpPos.yz, angle);
	pos += tmpPos;

	vec4 V = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    gl_Position = V;
    vTextureCoord = aTextureCoord;

    vVertex = pos;
    vOpacity = 1.0;
    if(start.y > end.y) {
    	vOpacity = 0.0;
    }

    vec3 N = vec3(pos.x, 0.0, pos.z);
    vNormal = normalize(N);

    vDepth = 1.0-getDepth(V.z/V.w);
    vExtra = aExtra;
}