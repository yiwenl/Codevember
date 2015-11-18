precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;
uniform float size;

uniform vec2 waves[15];

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 eye;

const float PI = 3.141592653;
const float waveLength = 2.5;

vec3 getPosition(float i, float j, float numSeg) {
	vec3 p = vec3(0);
	float rx = j / numSeg * PI - PI * .5;
	float ry = i / numSeg * PI * 2.0;

	p.y = sin(rx) * size;
	float r = cos(rx) * size;
	p.x = cos(ry) * r;
	p.z = sin(ry) * r;

	return p;
}


vec3 getPosition(vec3 mValue) {
	return getPosition(mValue.x, mValue.y, mValue.z);
}

float getWaveHeight(float waveFront, float waveHeight, vec3 vertex) {
	float wf = clamp(1.0 - waveFront, 0.0, 1.0) * vertex.z;
	float offset = 0.0;
	float dist = distance(vertex.y, wf);
	if(dist < waveLength ) {
		offset = sin( (vertex.y - wf + waveLength) / waveLength / 2.0 * PI) * waveHeight;
	}

	return offset;
}

vec3 getFinalPosition(vec3 posSphere, vec3 vertex) {
	vec3 p = normalize(posSphere);

	float offset = 0.0;
	for(int i=0; i<15; i++) {
		vec2 wave = waves[i];
		offset += getWaveHeight(wave.x, wave.y, vertex);
	}

	p *= size + offset;

	return p;
}


void main(void) {
	vec3 position = getPosition(aVertexPosition);
	float gap = 1.0;
	vec3 p1 = getPosition(aVertexPosition.x + gap, aVertexPosition.y, aVertexPosition.z);
	vec3 p2 = getPosition(aVertexPosition.x, aVertexPosition.y + gap, aVertexPosition.z);
	vec3 fp = getFinalPosition(position, aVertexPosition);
	vec3 fp1 = getFinalPosition(p1, aVertexPosition + vec3(gap, 0.0, 0.0) );
	vec3 fp2 = getFinalPosition(p2, aVertexPosition + vec3(0.0, gap, 0.0) );

	vec3 v1 = fp1 - fp;
	vec3 v2 = fp2 - fp;

	vec4 mvPosition = uMVMatrix * vec4(fp, 1.0);
    gl_Position = uPMatrix * mvPosition;
    vTextureCoord = aTextureCoord;
    vNormal = normalize( normalMatrix * cross(v2, v1) );

    eye = normalize( mvPosition.rgb );
}