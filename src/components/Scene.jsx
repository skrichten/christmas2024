import { useGLTF, useTexture } from '@react-three/drei';
import { SRGBColorSpace, Color } from 'three';
import { Tree } from "./Tree";
import { useControls } from 'leva';
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import BakedMat from '../mats/BakedMat';

const color1 = new Color('#ffb721');
const color2 = new Color('#7c7cff');
const color3 = new Color('#ff54db');

export const Scene = () => {
  const treeMainref = React.useRef();
  const tree2Ref = React.useRef();
  const tree3Ref = React.useRef();

  const config = useControls({
    globalReveal: { 
      value: 1, min: 0, max: 1.2, step: 0.001,
      onChange: (value) => {
        treeMainref.current.uniforms.uReveal.value = value;
        tree2Ref.current.uniforms.uReveal.value = value;
        tree3Ref.current.uniforms.uReveal.value = value;
        bMatRef.current.uniforms.uReveal1.value = value;
        bMatRef.current.uniforms.uReveal2.value = value;
        bMatRef.current.uniforms.uReveal3.value = value;
        bMatRef2.current.uniforms.uReveal1.value = value;
        bMatRef2.current.uniforms.uReveal2.value = value;
        bMatRef2.current.uniforms.uReveal3.value = value;
      }
    },
    RevealTree1: { 
      value: 1, min: 0, max: 1.2, step: 0.001, label: 'Reveal Tree 1',
      onChange: (value) => {
        treeMainref.current.uniforms.uReveal.value = value;
        bMatRef.current.uniforms.uReveal1.value = value;
        bMatRef2.current.uniforms.uReveal1.value = value;
      } 
    },
    RevealTree2: {
      value: 1, min: 0, max: 1.2, step: 0.001, label: 'Reveal Tree 2',
      onChange: (value) => {
        tree2Ref.current.uniforms.uReveal.value = value;
        bMatRef.current.uniforms.uReveal2.value = value;
        bMatRef2.current.uniforms.uReveal2.value = value;
      }
    },
    RevealTree3: {
      value: 1, min: 0, max: 1.2, step: 0.001, label: 'Reveal Tree 3',
      onChange: (value) => {
        tree3Ref.current.uniforms.uReveal.value = value;
        bMatRef.current.uniforms.uReveal3.value = value;
        bMatRef2.current.uniforms.uReveal3.value = value;
      }
    },
    uLight1Strength: { value: 1.78, min: 0, max: 2, step: 0.001, label: 'Light 1 Strength' },
    uLight2Strength: { value: 2, min: 0, max: 2, step: 0.001, label: 'Light 2 Strength' },
    uLight3Strength: { value: 1.4, min: 0, max: 2, step: 0.001, label: 'Light 3 Strength' }, 
    uLight1Color: { 
      value: '#ffb721', label: 'Light 1 Color',
      onChange: (value) => {
        color1.set(value);
        treeMainref.current.uniforms.uColor.value = color1;
        bMatRef.current.uniforms.uLight1Color.value = color1;
        bMatRef2.current.uniforms.uLight1Color.value = color1;
      } 
    },
    uLight2Color: { 
      value: '#7c7cff', label: 'Light 2 Color',
      onChange: (value) => {
        color2.set(value);
        tree2Ref.current.uniforms.uColor.value = color2;
        bMatRef.current.uniforms.uLight2Color.value = color2;
        bMatRef2.current.uniforms.uLight2Color.value = color2;
      } 
    },
    uLight3Color: { 
      value: '#ff54db', label: 'Light 3 Color',
      onChange: (value) => {
        color3.set(value);
        tree3Ref.current.uniforms.uColor.value = color3;
        bMatRef.current.uniforms.uLight3Color.value = color3;
        bMatRef2.current.uniforms.uLight3Color.value = color3;
      } 
    },
  });

  const uniforms={
    uLight1Strength: config.uLight1Strength,
    uLight2Strength: config.uLight2Strength,
    uLight3Strength: config.uLight3Strength,
    uReveal: config.uReveal,
    uLight1Color: config.uLight1Color,
    uLight2Color: config.uLight2Color,
    uLight3Color: config.uLight3Color,
  };

  useFrame((state, delta) => {
    if (treeMainref.current && tree2Ref.current && tree3Ref.current) {
      treeMainref.current.uniforms.uTime.value += delta;
      tree2Ref.current.uniforms.uTime.value += delta;
      tree3Ref.current.uniforms.uTime.value += delta
    }    
  });

  const { nodes } = useGLTF('/Christmas.glb');
    const bakeTex = useTexture('/SceneBake.webp');
    const lightMapTex = useTexture('/TreesLightmap3.webp');
    bakeTex.colorSpace = SRGBColorSpace;
    bakeTex.flipY = false;
    lightMapTex.flipY = false;
   
    const bMatRef = React.useRef();
    const bMatRef2 = React.useRef();
  
    const texUniforms = React.useMemo(() => ({
      uBakedTex: bakeTex,
      uLightMapTex: lightMapTex,
    }), [bakeTex, lightMapTex]);
  
  return (
    <>
    <color attach="background" args={['#0D1424']} />
    <group position={[0, -2.5, 0]}>
      <Tree ref={treeMainref} 
        uniforms={{
          uReveal: config.uReveal, 
          uColor: [.7, 4, 0],
          uBrightness: config.uLight1Strength * 5,
        }} 
      />
      <Tree 
        ref={tree2Ref} 
        scale={.7} 
        position={[6, 0, 1.9]} 
        uniforms={{ 
          uReveal: config.uReveal, 
          uColor: [0, 2, 17],
          uBrightness: config.uLight2Strength * 5,
        }} 
      />
      <Tree 
        ref={tree3Ref} 
        scale={.6} 
        position={[5, 0, -6]} 
        uniforms={{ 
          uReveal: config.uReveal, 
          uColor: [7, 0, 0],
          uBrightness: config.uLight3Strength * 5, 
        }} 
      />
      <group position={[0, .3, 0]}>
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
        <mesh 
          geometry={nodes.ground.geometry} 
          position={[-0.022, -0.051, -1.361]} 
          scale={12.221}
        >
          <bakedMat 
            {...texUniforms} 
            {...uniforms}
            ref={bMatRef2} 
          />
        </mesh>
      </group>
    </group>
    </>
  )
};
