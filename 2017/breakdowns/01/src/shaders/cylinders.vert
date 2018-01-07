// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;

uniform sampler2D texturePortrait;
uniform float uRatio;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vShadowCoord;

void main(void) {
    // I'm using instancing so I need to add the position offset to    
    // get the final position
    vec3 position = aVertexPosition;
    vShadowCoord   = uShadowMatrix * uModelMatrix * vec4(position + aPosOffset, 1.0);    
    // get the shadowCoord
    vec4 shadowCoord = vShadowCoord/vShadowCoord.w;
    vec2 uv        = (shadowCoord/shadowCoord.w).xy;
       
    // adjust the uv coord with the image ratio 
    float t        = (uRatio - 1.0) * 0.5;
    uv.x           /= (1.0 + t);
    // get the pixel colour
    vec3 color     = texture2D(texturePortrait, uv).rgb;
    // scale the pillar based on the colur (xz only)
    position.xz    *= color.r;
    // add the position offset back from instancing
    position       += aPosOffset;
    
	gl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
	vTextureCoord = aTextureCoord;
	vNormal       = aNormal;
}