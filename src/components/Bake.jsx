import { useGLTF, useTexture } from '@react-three/drei';
import * as React from 'react';
import { SRGBColorSpace, LinearSRGBColorSpace } from 'three';
import BakedMat from '../mats/BakedMat';

export function Bake({uniforms, children, ...props}) {
  const { nodes } = useGLTF('/Christmas.glb');
  const bakeTex = useTexture('/SceneBake.webp');
  const lightMapTex = useTexture('/TreesLightmap.webp');
  bakeTex.colorSpace = SRGBColorSpace;
  bakeTex.flipY = false;
  lightMapTex.flipY = false;
 
  const bMatRef = React.useRef();

  const texUniforms = React.useMemo(() => ({
    uBakedTex: bakeTex,
    uLightMapTex: lightMapTex,
  }), [bakeTex, lightMapTex]);

  return (
    <group {...props} dispose={null}>
      <mesh 
        geometry={nodes.house.geometry} 
        position={[-5.729, 2.541, -5.509]} 
        rotation={[0, 0.911, 0]} 
      >
        <bakedMat 
          {...texUniforms} 
          {...uniforms}
          ref={bMatRef} 
        />
      </mesh>
      <mesh geometry={nodes.ground.geometry} position={[-0.022, -0.051, -1.361]} scale={12.221}>
        <bakedMat 
          {...texUniforms} 
          {...uniforms}
          ref={bMatRef} 
        />
      </mesh>
      {children}
    </group>
  )
}

useGLTF.preload('/Christmas.glb')
