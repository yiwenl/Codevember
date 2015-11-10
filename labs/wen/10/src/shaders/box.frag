// box.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

uniform vec3 cameraPosition;
uniform float exportNormal;
uniform sampler2D texture;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;

vec3 envLight(vec3 normal, vec3 eye) {
	vec3 r = reflect( eye, normal );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vec2 vN = r.xy / m + .5;
    vN.y = 1.0 - vN.y;
    vec3 color = texture2D( texture, vN ).rgb;
    color = max(color, vec3(0.0));
    return color;
}


vec3 getColor() {
	vec3 color = vec3(1.0);
	return color;
}

void main(void) {
    if(exportNormal > 0.5) {
    	gl_FragColor = vec4(vNormal * .5 + .5, 1.0);
    } else {
    	gl_FragColor = vec4(getColor(), 1.0);
    }
}