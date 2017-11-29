// copy.frag

precision highp float;
varying vec2 vTextureCoord;

#define NUM_WAVES {NUM_WAVES}

const float PI = 3.141592653;

uniform vec3 uWaveCenters[NUM_WAVES];
uniform vec3 uWaveDatas[NUM_WAVES];
varying vec3 vPosition;

float getWaveHeight(vec3 pos, vec3 waveCenter, vec3 waveData) {
	float h = 0.0;

	float dist = distance(pos, waveCenter);
	float distToWaveFront = abs(dist - waveData.x);
	h = smoothstep(waveData.y, 0.0, distToWaveFront);
	h = pow(h, 5.0);

	return h * waveData.y;
}


void main(void) {
	float h = 0.0;
	for(int i=0; i<NUM_WAVES; i++) {
		h += getWaveHeight(vPosition, uWaveCenters[i], uWaveDatas[i]);
	}

    gl_FragColor = vec4(vec3(h), 1.0);
}