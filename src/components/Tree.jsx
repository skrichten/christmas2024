import { CurveParticles } from "./CurveParticles";
import { AdditiveBlending } from 'three';
import { EXRLoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';
import CurveParticlesMat from '../mats/CurveParticlesMat';
import * as React from 'react';

export const Tree = React.forwardRef(({ uniforms = {}, ...props }, ref) => {
  const exr = useLoader(EXRLoader, '/treeVertsx2.exr');
  const turb = useLoader(EXRLoader, '/turb256x2.exr');

  return (
    <CurveParticles 
      count={5000} 
      w={256} 
      h={2} 
      uCurve1Tex={exr} 
      uTurbTex={turb}
      frustumCulled={false}
      {...props}
    >
      <curveParticlesMat
        blending={AdditiveBlending}
        uCurve1Tex={exr}
        uTurbTex={turb}
        attach="material"
        uResolution={[256, 2]}
        uSpeed={.01}
        uSize={7}
        uEndFade={0.01}
        ref={ref}
        {...uniforms}
      />
    </CurveParticles>
  );
});

Tree.displayName = 'Tree';
