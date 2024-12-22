import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import guid from 'short-uuid';

const uniforms = {
  uTime: 0,
  uSize: 5,
  uColor: [1, 1, 1],
  uBrightness: 1,
  uResolution: [0, 0],
  uCurve1Tex: null,
  uTurbTex: null,
  uSpeed: 0.1,
  uEndFade: 0.3,
  uReveal: 0,
  transparent: true,
  depthWrite: false,
};

const vertShader = /* glsl */`
  attribute float aRandomSample;
  attribute float aRandomSpeed;
  attribute float aTurbPos;
  uniform sampler2D uCurve1Tex;
  uniform sampler2D uTurbTex;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uSize;
  uniform float uEndFade;
  uniform vec2 uResolution;
  uniform float uReveal;
  uniform vec3 uColor;
  uniform float uBrightness;

  varying vec4 vColor;

  float fadeInOut(float t) {
    // use smooth step to create a smooth fade in/out at both ends
    return smoothstep(0.0, uEndFade, t) * (1. - smoothstep(1.-uEndFade, 1.0, t));
  }

  vec2 getUV(float samplePos, vec2 uvCenterOffset) {
    vec2 p = vec2(0.0);
    float tSample = samplePos * uResolution.x * uResolution.y;
    p.y = floor(tSample / uResolution.x);
    p.x = tSample - p.y * uResolution.x;
    return vec2(p.x * uvCenterOffset.x, p.y * uvCenterOffset.y + uvCenterOffset.y * 0.5);
  }

  void main() {
    // A random start position for each particle the modulo is to make the value wrap around
    float curveSampleWrapped = mod(aRandomSample + uTime * uSpeed * aRandomSpeed, 1.0);
    float turbSampleWrapped = mod(aTurbPos + uTime * uSpeed * aRandomSpeed, 1.0);
    // to sample the texture at the center of each pixel    
    vec2 uvOffset = vec2(1.0 / uResolution.x, 1.0 / uResolution.y);

    vec2 curveUv1 = getUV(curveSampleWrapped, uvOffset);
    vec3 curvePosition1 = texture2D(uCurve1Tex, curveUv1).xyz;
    vec2 turbUv1 = getUV(turbSampleWrapped, uvOffset);
    vec4 turbOffset = texture2D(uTurbTex, turbUv1);
    
    vec4 modelPosition = modelMatrix * vec4(curvePosition1, 1.0);
    modelPosition += turbOffset * .15;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Size
    gl_PointSize = position.x;
    gl_PointSize *= uSize;   

    // if curveUv1.x < uReveal, then reveal = 1, else reveal = 0
    float reveal = step(curveUv1.x, uReveal);

    // Brighten the particles at edge of the reveal
    float edgeBrighten = smoothstep(uReveal - 0.06, uReveal, curveUv1.x) * 10.;

    gl_PointSize += edgeBrighten * .7;
    gl_PointSize *= (uSize / - viewPosition.z);
    gl_PointSize = max(gl_PointSize, 5.);

    // "position" is getting hijacked to be used for randomizing individual particle size and base alpha
    vColor = vec4(uColor * uBrightness + edgeBrighten, position.y * fadeInOut(curveUv1.x) * reveal);
  }
`;

const fragShader = /* glsl */`
  varying vec4 vColor;

  void main() {

    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength,9.5);
    //gl_FragColor = vec4(vec3(strength) * vColor.rgb * vColor.a, 1.);
    gl_FragColor = vec4(strength * vColor);
  }
`;

const CurveParticlesMat = shaderMaterial(uniforms, vertShader, fragShader);

CurveParticlesMat.key = guid.generate();

extend({ CurveParticlesMat });

export default CurveParticlesMat;
