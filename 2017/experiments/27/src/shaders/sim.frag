// sim.frag

#extension GL_EXT_draw_buffers : require 
precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D textureVel;
uniform sampler2D texturePos;
uniform sampler2D textureExtra;
uniform sampler2D textureOrg;

uniform mat4 uShadowMatrix0;
uniform mat4 uShadowMatrix1;
uniform sampler2D texturePos0;
uniform sampler2D texturePos1;

uniform float time;


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


vec3 getPosition(mat4 shadowMatrix, sampler2D tPos, vec3 position, inout float outside) {
	vec4 vShadowCoord = shadowMatrix * vec4(position, 1.0);
	vec4 shadowCoord  = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;
	vec4 _pos = texture2D(tPos, uv);
	// if(_pos.a <= 0.0) {
	// 	outside = 0.0;
	// }
	outside *= _pos.a;

	return _pos.xyz;
}

#define FLOOR_Y -0.65

// #define BOUNDARY vec3(1.1, 0.65, 0.28)
#define BOUNDARY vec3(0.8, 0.65, 0.28)

vec3 getRandomPos(vec3 v) {
	float x = snoise(v.xyz) * BOUNDARY.x + .4;
	float y = snoise(v.yzx) * BOUNDARY.y;
	float z = snoise(v.zxy) * BOUNDARY.z;

	return vec3(x, y, z);
}

void main(void) {
	vec3 pos             = texture2D(texturePos, vTextureCoord).rgb;
	vec3 posOrg          = texture2D(textureOrg, vTextureCoord).rgb;
	vec3 vel             = texture2D(textureVel, vTextureCoord).rgb;
	vec3 extra           = texture2D(textureExtra, vTextureCoord).rgb;

	float speedOffset = mix(extra.r, 1.0, .75);
	float life = extra.b;
	life -= 0.005;
	vec3 acc = vec3(0.0, -0.01, 0.0);

	if(life <= 0.0) { //	respwarn
		
		if(extra.g > 0.0) {	//	if has found home ( extra.g >= 0.0), set pos to posSave 
			pos = posOrg;
		} 

		float outside = 1.0;
		vec3 posFromFront 	= getPosition(uShadowMatrix0, texturePos0, pos, outside);
		vec3 posFromBack 	= getPosition(uShadowMatrix1, texturePos1, pos, outside);

		//	boundary check, if it's in , set found home to true, save pos to posOrg
		outside *= step(pos.z, posFromFront.z);
		outside *= step(posFromBack.z, pos.z);
		outside *= mix(extra.r, 1.0, .5);
		life = outside;

		//	find pos in boundary and home position not set -> set found flag true, save home pos
		if(life > 0.0 && extra.g <= 0.0) {	
			extra.g = 1.0;
			posOrg = pos;
		} 

		//	pos not in boundary and home position not set -> get new random pos
		if(life <= 0.0 && extra.g <= 0.0) {	
			pos = getRandomPos(posOrg + (time*(1.0 + vTextureCoord.x * 3.0)) + vTextureCoord.xyy);
		}

		vel.xz = (extra.xy * 2.0 - 1.0) * .001;
		vel.y = 0.0;
		vel.x -= 0.015;
	}

	extra.b = life;
	vel += acc * 0.02 * speedOffset;
	pos += vel;
	pos.y = max(pos.y, FLOOR_Y);

	float decreaseRate = 0.996;
	vel *= decreaseRate;

	gl_FragData[0] = vec4(pos, 1.0);
	gl_FragData[1] = vec4(vel, 1.0);
	gl_FragData[2] = vec4(extra, 1.0);
	gl_FragData[3] = vec4(posOrg, 1.0);
}