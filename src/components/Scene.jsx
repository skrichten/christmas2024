import { useGLTF, useTexture } from '@react-three/drei';
import { SRGBColorSpace, Color } from 'three';
import { Tree } from "./Tree";
import { useControls } from 'leva';
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import BakedMat from '../mats/BakedMat';
import BakedWithColorMat from '../mats/BakedWithColorMat';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const color1 = new Color('#ffb721');
const color2 = new Color('#7c7cff');
const color3 = new Color('#ff54db');

export const Scene = () => {
  const tree1Ref = React.useRef();
  const tree2Ref = React.useRef();
  const tree3Ref = React.useRef();
  const reveal1Ref = React.useRef();
  const reveal2Ref = React.useRef();
  const reveal3Ref = React.useRef();
  const groundMatRef = React.useRef();
  const houseMatRef = React.useRef();
  const aniReady = React.useRef(true);


  useGSAP(() => {
    const t1Config = {
      value: 1.2,
      duration: .4,
      ease: 'power2.in',
      paused: true,
      overwrite: true,
      onUpdate: function() {
        groundMatRef.current.uniforms.uReveal1.value = this.ratio;
        houseMatRef.current.uniforms.uReveal1.value = this.ratio;
      }
    };
    const t1 = gsap.to(tree1Ref.current.uniforms.uReveal, t1Config);

    const t2Config = {
      value: 1.2,
      duration: .4,
      ease: 'power2.in',
      paused: true,
      overwrite: true,
      onUpdate: function() {
        groundMatRef.current.uniforms.uReveal2.value = this.ratio;
        houseMatRef.current.uniforms.uReveal2.value = this.ratio;
      }
    };
    const t2 = gsap.to(tree2Ref.current.uniforms.uReveal, t2Config);

    const t3Config = {
      value: 1.2,
      duration: .4,
      ease: 'power2.in',
      paused: true,
      overwrite: true,
      onUpdate: function() {
        groundMatRef.current.uniforms.uReveal3.value = this.ratio;
        houseMatRef.current.uniforms.uReveal3.value = this.ratio;
      }
    };
    const t3 = gsap.to(tree3Ref.current.uniforms.uReveal, t3Config);

    reveal1Ref.current = t1;
    reveal2Ref.current = t2;
    reveal3Ref.current = t3;

    console.log('reveal1Ref', reveal1Ref.current);

    
    const tl = gsap.timeline({
      delay: 1,
      //autoRemoveChildren: true,
      //paused: true,
      onComplete: function() {
        aniReady.current = true;
        //reveal1Ref.current = gsap.to(tree1Ref.current.uniforms.uReveal, t1Config);
        //reveal2Ref.current = gsap.to(tree2Ref.current.uniforms.uReveal, t2Config);
        //reveal3Ref.current = gsap.to(tree3Ref.current.uniforms.uReveal, t3Config);
      }
    })
      .add(t3.play())
      .add(t2.play())
      .add(t1.play()); 
      
     
      /*
    t1.play();
    t2.play();
    t3.play(); */
  });
    

  const config = useControls({
    
    toggle1: {
      value: true,
      onChange: (value) => {
        console.log('toggle1', reveal1Ref.current);
        if (!aniReady.current) return;
        console.log('toggle1', value);
        if (value) {
          reveal1Ref.current.play();
        } else {
          console.log('reverse', reveal1Ref.current.progress());
          reveal1Ref.current.restart();
        }
      }
    },
    toggle2: {
      value: true,
      onChange: (value) => {
        if (!aniReady.current) return;
        if (value) {
          reveal2Ref.current.play();
        } else {
          reveal2Ref.current.reverse();
        }
      }
    },
    toggle3: {
      value: true,
      onChange: (value) => {
        if (!aniReady.current) return;
        if (value) {
          reveal3Ref.current.play();
        } else {
          reveal3Ref.current.reverse();
        }
      }
    },

    /*
    globalReveal: { 
      value: 0, min: 0, max: 1.2, step: 0.001,
      onChange: (value) => {
        tree1ref.current.uniforms.uReveal.value = value;
        tree2Ref.current.uniforms.uReveal.value = value;
        tree3Ref.current.uniforms.uReveal.value = value;
        groundMatRef.current.uniforms.uReveal1.value = value;
        groundMatRef.current.uniforms.uReveal2.value = value;
        groundMatRef.current.uniforms.uReveal3.value = value;
        houseMatRef.current.uniforms.uReveal1.value = value;
        houseMatRef.current.uniforms.uReveal2.value = value;
        houseMatRef.current.uniforms.uReveal3.value = value;
      }
    },
    RevealTree1: { 
      value: 0, min: 0, max: 1.2, step: 0.001, label: 'Reveal Tree 1',
      onChange: (value) => {
        tree1ref.current.uniforms.uReveal.value = value;
        groundMatRef.current.uniforms.uReveal1.value = value;
        houseMatRef.current.uniforms.uReveal1.value = value;
      } 
    },
    RevealTree2: {
      value: 0, min: 0, max: 1.2, step: 0.001, label: 'Reveal Tree 2',
      onChange: (value) => {
        tree2Ref.current.uniforms.uReveal.value = value;
        groundMatRef.current.uniforms.uReveal2.value = value;
        houseMatRef.current.uniforms.uReveal2.value = value;
      }
    },
    RevealTree3: {
      value: 0, min: 0, max: 1.2, step: 0.001, label: 'Reveal Tree 3',
      onChange: (value) => {
        tree3Ref.current.uniforms.uReveal.value = value;
        groundMatRef.current.uniforms.uReveal3.value = value;
        houseMatRef.current.uniforms.uReveal3.value = value;
      }
    },

    */
   
    uLight1Strength: { value: 1.78, min: 0, max: 2, step: 0.001, label: 'Light 1 Strength' },
    uLight2Strength: { value: 2, min: 0, max: 2, step: 0.001, label: 'Light 2 Strength' },
    uLight3Strength: { value: 1.4, min: 0, max: 2, step: 0.001, label: 'Light 3 Strength' }, 
    uLight1Color: { 
      value: '#ffb721', label: 'Light 1 Color',
      onChange: (value) => {
        color1.set(value);
        tree1Ref.current.uniforms.uColor.value = color1;
        groundMatRef.current.uniforms.uLight1Color.value = color1;
        houseMatRef.current.uniforms.uLight1Color.value = color1;
      } 
    },
    uLight2Color: { 
      value: '#7c7cff', label: 'Light 2 Color',
      onChange: (value) => {
        color2.set(value);
        tree2Ref.current.uniforms.uColor.value = color2;
        groundMatRef.current.uniforms.uLight2Color.value = color2;
        houseMatRef.current.uniforms.uLight2Color.value = color2;
      } 
    },
    uLight3Color: { 
      value: '#ff54db', label: 'Light 3 Color',
      onChange: (value) => {
        color3.set(value);
        tree3Ref.current.uniforms.uColor.value = color3;
        groundMatRef.current.uniforms.uLight3Color.value = color3;
        houseMatRef.current.uniforms.uLight3Color.value = color3;
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
    if (tree1Ref.current && tree2Ref.current && tree3Ref.current) {
      tree1Ref.current.uniforms.uTime.value += delta;
      tree2Ref.current.uniforms.uTime.value += delta;
      tree3Ref.current.uniforms.uTime.value += delta
    }    
  });

  const { nodes } = useGLTF('/xmas.glb');
    const groundDarkBake = useTexture('/GroundDarkBake.webp');
    const groundLightBake = useTexture('/GroundLightBake.webp');
    groundDarkBake.colorSpace = SRGBColorSpace;
    groundDarkBake.flipY = false;
    groundLightBake.flipY = false;

    const houseDarkBake = useTexture('/HouseDarkBake.webp');
    const houseLightBake = useTexture('/HouseLightBake.webp');
    const houseColorBake = useTexture('/HouseBakeColor.webp');
    houseDarkBake.colorSpace = SRGBColorSpace;
    houseDarkBake.flipY = false;
    houseLightBake.flipY = false;
    houseColorBake.flipY = false;
  
    const groundTexUniforms = React.useMemo(() => ({
      uBakedTex: groundDarkBake,
      uLightMapTex: groundLightBake,
    }), [groundDarkBake, groundLightBake]);

    const houseTexUniforms = React.useMemo(() => ({
      uDarkTex: houseDarkBake,
      uLightMapTex: houseLightBake,
      uColorTex: houseColorBake,
    }), [houseDarkBake, houseLightBake, houseColorBake]);
  
  return (
    <>
    <color attach="background" args={['#0D1424']} />
    <group position={[0, -2.5, 0]}>
      <Tree ref={tree1Ref} 
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
          geometry={nodes.House.geometry}  
          position={[-5.705, 3.87, -5.5]} 
          rotation={[Math.PI, -0.912, Math.PI]}
        >
          <bakedWithColorMat 
            {...houseTexUniforms} 
            {...uniforms}
            ref={houseMatRef} 
          />
        </mesh>
        <mesh 
          geometry={nodes.Ground.geometry} 
          position={[-0.022, -0.463, -1.361]}
        >
          <bakedMat 
            {...groundTexUniforms} 
            {...uniforms}
            ref={groundMatRef} 
          />
        </mesh>
      </group>
    </group>
    </>
  )
};
