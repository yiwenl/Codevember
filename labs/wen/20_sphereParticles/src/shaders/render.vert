// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aUV;
attribute vec3 aExtra;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float time;
uniform float sound0;
uniform sampler2D texture;

varying vec2 vTextureCoord;
varying float vOpacity;


mat3 setCamera( in vec3 ro, in vec3 ta, float cr ) {
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}


void main(void) {
	vec3 pos       = aVertexPosition;
	float size 	   = abs(pos.x) + (sin(aExtra.z*time) * .5 + .5) * 5.0;
	vec2 uv        = aTextureCoord * .5;
	vec3 posOffset = texture2D(texture, uv).rgb;
	vec3 ta        = vec3( 0.0, 0.0, 0.0 );
	mat3 ca        = setCamera( posOffset, ta, 0.0 );
	vec3 dir       = ca * normalize( pos )*aExtra.x * size;
	dir            += posOffset;
	gl_Position    = uPMatrix * uMVMatrix * vec4(dir, 1.0);
	vTextureCoord  = aUV;
	float alpha    = .1 + sound0 * .15;
	vOpacity 	   = alpha + (sin(time*aExtra.y) * .5 + .5) * alpha;
}	
