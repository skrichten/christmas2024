import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import guid from 'short-uuid';
import { Color } from 'three';

const uniforms = {
  uReveal1: 0.5,
  uReveal2: 0.5,
  uReveal3: 0.5,
  uDarkTex: null,
  uLightMapTex: null,
  uColorTex: null,
  uLight1Strength: 1,
  uLight2Strength: 1,
  uLight3Strength: 1,
  uLight1Color: new Color(1, 0, 0),
  uLight2Color: new Color(0, 1, 0),
  uLight3Color: new Color(0, 0, 1),
};

const vertShader = /* glsl */`
  varying vec2 vUv;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vUv = uv;
  }
`;

const fragShader = /* glsl */`
  float blendSoftLight(float base, float blend) {
    return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
  }

  vec3 blendSoftLight(vec3 base, vec3 blend) {
    return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
  }

  vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
    return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
  }

  float blendAdd(float base, float blend) {
    return min(base+blend,1.0);
  }

  vec3 blendAdd(vec3 base, vec3 blend) {
    return min(base+blend,vec3(1.0));
  }

  vec3 blendAdd(vec3 base, vec3 blend, float opacity) {
    return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
  }

  varying vec2 vUv;
  uniform sampler2D uDarkTex;
  uniform sampler2D uLightMapTex;
  uniform sampler2D uColorTex;
  uniform float uLight1Strength;
  uniform float uLight2Strength;
  uniform float uLight3Strength;
  uniform float uReveal1;
  uniform float uReveal2;
  uniform float uReveal3;
  uniform vec3 uLight1Color;
  uniform vec3 uLight2Color;
  uniform vec3 uLight3Color;

  void main() {
    vec3 darkColor = texture2D(uDarkTex, vUv).rgb;
    vec3 lightColor = texture2D(uLightMapTex, vUv).rgb;
    vec3 flatColor = texture2D(uColorTex, vUv).rgb;

    // the baked maps are too bright, so we darken them a bit
    //darkColor *= .5;
    flatColor *= .4;
    lightColor *= .7;
    
    vec3 color1 = blendSoftLight(flatColor, uLight1Color);
    vec3 color2 = blendSoftLight(flatColor, uLight2Color);
    vec3 color3 = blendSoftLight(flatColor, uLight3Color);
    
    float light1Strength = lightColor.g * uLight1Strength * uReveal1;
    float light2Strength = lightColor.b * uLight2Strength * uReveal2;
    float light3Strength = lightColor.r * uLight3Strength * uReveal3;

    darkColor = blendAdd(darkColor, color1, light1Strength); 
    darkColor = blendAdd(darkColor, color2, light2Strength);
    darkColor = blendAdd(darkColor, color3, light3Strength);
    
    gl_FragColor = vec4(darkColor, 1.);
  }
`;

const BakedWithColorMat = shaderMaterial(uniforms, vertShader, fragShader);

BakedWithColorMat.key = guid.generate();

extend({ BakedWithColorMat });

export default BakedWithColorMat;
