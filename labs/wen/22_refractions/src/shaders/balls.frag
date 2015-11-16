// balls.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float exportNormal;
varying vec3 vNormal;
varying vec3 vRotateNormal;
varying vec3 vEye;

vec3 envLight(vec3 eye, vec3 normal) {
	vec3 r = reflect( eye, normal );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vec2 vN = r.xy / m + .5;
    vec3 color = texture2D(texture, vN).rgb;
    color.r = pow(color.r, 2.0);

    return color.rrr;
}

void main(void) {
	vec3 env = envLight(vEye, vNormal);
    gl_FragColor = vec4(env, 1.0);

    if(exportNormal > 0.0) {
    	gl_FragColor.rgb = vRotateNormal * .5 + .5;
    }
}