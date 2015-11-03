// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;

uniform vec3 color;
uniform float opacity;

float ambient = .2;
vec3 lightPos = vec3(1.0);
float lightWeight = 1.0 - ambient;


void main(void) {
    // gl_FragColor = vec4(color, opacity);
    // gl_FragColor = vec4(vNormal * .5 + .5, opacity);

    float lambert = dot(vNormal, normalize(lightPos)) * .5 + .5;
    float grey = ambient + lambert * lightWeight;

    gl_FragColor = vec4(vec3(grey), 1.0);

}