// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 uCameraPos;
uniform samplerCube texture;


float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


const vec3 LIGHT = vec3(0.2, 0.4, 1.0);

void main(void) {
	float dx = abs(vTextureCoord.x - 0.5);
	float dy = abs(vTextureCoord.y - 0.5);
	dx = smoothstep(0.5, 0.45, dx);
	dy = smoothstep(0.5, 0.45, dy);
	// float d = min(dx, dy);
	float d = dx * dy;
	d = mix(d, 1.0, .95);

	float diff = diffuse(-vNormal, LIGHT);
	diff = mix(diff, 1.0, .5);	

	vec3 dirToCamera = normalize(uCameraPos - vPosition);
    vec3 dirReflect = -normalize(reflect(dirToCamera, vNormal));
    vec4 colorReflection = textureCube(texture, dirReflect);


    gl_FragColor = vec4(vec3(d * diff), 1.0);
    gl_FragColor = colorReflection;
}