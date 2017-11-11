// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE
#extension GL_EXT_draw_buffers : require 

precision highp float;
varying vec2 vTextureCoord;
uniform float uSeed;

#define NUM_OCTAVES 3


float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float fbm(vec3 x) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100);
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = x * 2.0 + shift;
        a *= 0.5;
    }


    vec2 uv = vTextureCoord;
    float n = noise(vec2(uv.y * 5.0, uSeed));
    float t = 1.0 - abs(uv.x + n * .1 - 0.5)/0.5;
    t = smoothstep(0.75, 1.0, t);
    v -= pow(t, 5.0) * .25;
    
    return v;
}

float fbm(vec2 v, float seed) {
    return fbm(vec3(v, seed));
}

void main(void) {
    const vec2 size = vec2(2.0,0.0) * 0.02;
    const float s = 0.01;
    vec3 offset = vec3(s, 0.0, -s);
    float scale = 3.;
    vec2 uv = vTextureCoord;
    float s11 = fbm(uv * scale, uSeed);
    float s01 = fbm((uv + offset.zy) * scale, uSeed);
    float s21 = fbm((uv + offset.xy) * scale, uSeed);
    float s12 = fbm((uv + offset.yx) * scale, uSeed);
    float s10 = fbm((uv + offset.yz) * scale, uSeed);

    vec3 va = vec3(size.xy,s21-s01);
    vec3 vb = vec3(size.yx,s12-s10);
    vec3 n = normalize(cross(va,vb)) * .5 + .5;


    // gl_FragColor = vec4(vec3(s11), 1.0);

    gl_FragData[0] = vec4(vec3(s11), 1.0);
    gl_FragData[1] = vec4(n, 1.0);
    gl_FragData[2] = vec4(1.0);
    gl_FragData[3] = vec4(1.0);
}