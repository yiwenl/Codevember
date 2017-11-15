// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;


uniform mat4 uShadowMatrix0;
uniform mat4 uShadowMatrix1;
uniform mat4 uProjInvert0;
uniform mat4 uProjInvert1;
uniform mat4 uViewInvert0;
uniform mat4 uViewInvert1;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D depth0;
uniform sampler2D depth1;
uniform float uCubeSize;
uniform vec3 uHit;
uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWsPosition;
varying vec3 vEyePosition;
varying vec3 vWsNormal;


float getDistToCamera(mat4 shadowMatrix, sampler2D texture, vec3 position, mat4 invertProj, mat4 invertView, sampler2D textureDepth, inout float outside) {
	vec4 vShadowCoord = shadowMatrix * vec4(position, 1.0);
	vec4 shadowCoord  = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;
	vec4 color = texture2D(texture, uv);
	if(color.a <=0.0) {
		outside = 0.0;
	}
	float depth = texture2D(textureDepth, uv).r;
	float z = depth * 2.0 - 1.0;

	vec4 clipSpacePosition = vec4(uv * 2.0 - 1.0, z, 1.0);
	vec4 viewSpacePosition = invertProj * clipSpacePosition;
	viewSpacePosition /= viewSpacePosition.w;

	vec4 worldSpacePosition = invertView * viewSpacePosition;

	return worldSpacePosition.z;
}

vec4 permute(vec4 x) {  return mod(((x*34.0)+1.0)*x, 289.0);    }
vec4 taylorInvSqrt(vec4 r) {    return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
	const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
	const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
	
	vec3 i  = floor(v + dot(v, C.yyy) );
	vec3 x0 = v - i + dot(i, C.xxx) ;
	
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.0 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );
	
	vec3 x1 = x0 - i1 + 1.0 * C.xxx;
	vec3 x2 = x0 - i2 + 2.0 * C.xxx;
	vec3 x3 = x0 - 1. + 3.0 * C.xxx;
	
	i = mod(i, 289.0 );
	vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
	
	float n_ = 1.0/7.0;
	vec3  ns = n_ * D.wyz - D.xzx;
	
	vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
	
	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.0 * x_ );
	
	vec4 x = x_ *ns.x + ns.yyyy;
	vec4 y = y_ *ns.x + ns.yyyy;
	vec4 h = 1.0 - abs(x) - abs(y);
	
	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );
	
	vec4 s0 = floor(b0)*2.0 + 1.0;
	vec4 s1 = floor(b1)*2.0 + 1.0;
	vec4 sh = -step(h, vec4(0.0));
	
	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
	
	vec3 p0 = vec3(a0.xy,h.x);
	vec3 p1 = vec3(a0.zw,h.y);
	vec3 p2 = vec3(a1.xy,h.z);
	vec3 p3 = vec3(a1.zw,h.w);
	
	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	
	vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
	m = m * m;
	return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float snoise(float x, float y, float z){
	return snoise(vec3(x, y, z));
}

void main(void) {
	vec3 posOffset = aPosOffset;

	float outside = 1.0;
	float z0 = getDistToCamera(uShadowMatrix0, texture0, posOffset, uProjInvert0, uViewInvert0, depth0, outside);
	float z1 = getDistToCamera(uShadowMatrix1, texture1, posOffset, uProjInvert1, uViewInvert1, depth1, outside);

	float scale = 1.0;
	if(outside < 0.5) {
		scale = 0.0;
	} else {
		if(posOffset.z < z0 + uCubeSize && posOffset.z > z1 - uCubeSize) {
			scale = 1.0;
		} else {
			scale = 0.0;
		}
	}

	float noise = snoise(aPosOffset * 0.75 + uTime);
	float distToTouch = distance(posOffset, uHit) + noise * 0.05;
	float maxDist = 0.75;

	if(scale > 0.0) {
		if(distToTouch < maxDist) {
			scale = 0.0;
			
			// scale = 1.0 - scale;

			
		}	
	}
	
	float d = .4;
	noise = noise * .5 + .5;
	noise = smoothstep(d, 1.0-d, noise);
	scale *= noise;
	
	

	// scale = mix(scale, 1.0, .03);

	vec3 position = aVertexPosition * scale + aPosOffset;
	vec4 worldSpacePosition	= uModelMatrix * vec4(position, 1.0);
	vec4 viewSpacePosition	= uViewMatrix * worldSpacePosition;
	
	vNormal					= uNormalMatrix * aNormal;
	vPosition				= viewSpacePosition.xyz;
	vWsPosition				= worldSpacePosition.xyz;
	
	vec4 eyeDirViewSpace	= viewSpacePosition - vec4( 0, 0, 0, 1 );
	vEyePosition			= -vec3( uModelViewMatrixInverse * eyeDirViewSpace.xyz );
	vWsNormal				= normalize( uModelViewMatrixInverse * vNormal );

	gl_Position				= uProjectionMatrix * viewSpacePosition;

	vTextureCoord			= aTextureCoord;
}