// reflect.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
// varying vec2 vTextureCoord;
uniform samplerCube texture;
varying vec3 vEye;
varying vec3 vNormal;
uniform mat3 normalMatrix;

uniform mat3 invertMVMatrix;

void main(void) {
	vec3 N = normalMatrix*vNormal;
	vec3 V = vEye;
    // gl_FragColor = textureCube(texture, invertMVMatrix * refract(V, N, 0.975));
    vec4 refractColor = textureCube(texture, invertMVMatrix * refract(V, N, 0.975));
    refractColor.rgb *= .75;
    vec4 reflectColor = textureCube(texture, invertMVMatrix * reflect(V, N));

    refractColor.rgb += reflectColor.rgb * .5;
    gl_FragColor = refractColor;
    // gl_FragColor = mix(refractColor, reflectColor, .75);
}