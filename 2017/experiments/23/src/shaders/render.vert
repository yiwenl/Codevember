// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec2 aUV;
attribute vec3 aExtra;
attribute vec2 aUVOffset;
attribute vec2 aUVScale;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D textureCurr;
uniform sampler2D textureVel;
uniform sampler2D textureExtra;
uniform sampler2D textureExtra2;
uniform float percent;
uniform float time;
uniform vec2 uViewport;

varying vec4 vColor;
varying vec3 vNormal;
varying vec2 vTextureCoord;
varying vec2 vUVOffset;
varying vec2 vUVScale;
varying vec3 vCenter;

const float radius = 0.01;

mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(target - origin);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}



vec3 lookAt(inout vec3 pos, inout vec3 normal, vec3 origin, vec3 target) {
	mat3 m = calcLookAtMatrix(origin, target, 0.0);
	pos = m * pos;
	normal = m * normal;

	return pos;
}

void main(void) {
	vec2 uv             = aUV;
	vec3 pos        	= texture2D(textureCurr, uv).rgb;
	vec3 vel        	= texture2D(textureVel, uv).rgb;
	vec3 posNext 		= pos + vel;
	vec3 extra          = texture2D(textureExtra, uv).rgb;
	vec3 extra2         = texture2D(textureExtra2, uv).rgb;
	// float scale 		= mix(aExtra.x, 1.0, .5) * 1.5;
	vec3 scale 		    = mix(aExtra, vec3(1.0), .35);
	vec3 position       = aVertexPosition * scale * extra2.r;
	vec3 normal 		= aNormal;
	lookAt(position, normal, pos, posNext+vec3(0.0, 0.0, 0.0001));
	
	position            += pos;
	gl_Position         = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
	
	
	vColor              = vec4(vec3(extra.r), 1.0);
	
	// float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
	// gl_PointSize     = distOffset * (1.0 + extra.x * 1.0);
	
	vNormal             = normal;
	vTextureCoord       = aTextureCoord;

	vUVOffset			= aUVOffset;
	vUVScale			= aUVScale;
	vCenter 			= position;
}