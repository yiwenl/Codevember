// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;

uniform vec3 eye;
uniform float opacity;

float ambient = .2;
vec3 lightPos = vec3(1.0);
float lightWeight = 1.0 - ambient;


void main(void) {
    float lambert = dot(vNormal, normalize(lightPos)) * .5 + .5;
    // float lambert = max(dot(vNormal, normalize(lightPos)), 0.0);
    float grey = ambient + lambert * lightWeight;

    // vec3 dirEye = normalize(eye - vVertex);
    // vec3 dirLight = normalize(lightPos - vVertex);
    // vec3 h = normalize(vNormal + dirEye);
    // float specular = pow(max(dot(h, vNormal), 0.0), 40.0) * .5;
    // grey += specular;

    gl_FragColor = vec4(vec3(grey), 1.0);

}