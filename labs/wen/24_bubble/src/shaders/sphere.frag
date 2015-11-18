precision highp float;
varying vec3 vNormal;
varying vec3 eye;
uniform sampler2D texture;
uniform	float exportNormal;

void main(void) {
	vec3 r = reflect( eye, vNormal );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vec2 vN = r.xy / m + .5;

    vec3 base = texture2D( texture, vN ).rgb;
    gl_FragColor = vec4( base, 1. );

    if(exportNormal > .0) gl_FragColor = vec4(vNormal * .5 + .5, 1.0);
}