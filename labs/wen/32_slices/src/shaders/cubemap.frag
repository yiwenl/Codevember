// cubemap.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform samplerCube texture;
uniform vec3 camera;
varying vec3 vNormal;
varying vec3 vEye;
varying vec3 vVertex;

void main(void) {
    gl_FragColor = textureCube(texture, vVertex);
    // gl_FragColor = textureCube(texture, reflect(vEye, vNormal));
    // gl_FragColor = textureCube(texture, refract(vEye, vNormal, 1.0));
    // gl_FragColor = vec4(1.0);
    // gl_FragColor.rgb = vNormal*.5+.5;
}