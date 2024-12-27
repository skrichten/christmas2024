import { useGLTF, useTexture } from '@react-three/drei';
import { NoColorSpace, Color } from 'three';
import { Tree } from "./Tree";
import { useControls } from 'leva';
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import BakedMat from '../mats/BakedMat';
import BakedWithColorMat from '../mats/BakedWithColorMat';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Stars from './Stars';
import { useGeneralStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { AudioViz } from './AudioViz';

const color1 = new Color('#ffb721');
const color2 = new Color('#7c7cff');
const color3 = new Color('#ff54db');
const color4 = new Color('#ff5454');
const color4Start = new Color('#000000');

export const Scene = () => {
  const tree1Ref = React.useRef();
  const tree2Ref = React.useRef();
  const tree3Ref = React.useRef();
  const reveal1Ref = React.useRef();
  const reveal2Ref = React.useRef();
  const reveal3Ref = React.useRef();
  const groundMatRef = React.useRef();
  const houseMatRef = React.useRef();
  const houseLightsRef = React.useRef();
  const aniReady = React.useRef(false);
  const [
    setHouseMat, setGroundMat, setTree1Mat, setTree2Mat, setTree3Mat, setAnimationComplete, enableAudio
  ] = useGeneralStore(useShallow((s) => [
    s.setHouseMat, s.setGroundMat, s.setTree1Mat, s.setTree2Mat, s.setTree3Mat, s.setAnimationComplete, s.enableAudio
  ]));

  const timeScale = 1;
  // INTRO ANIMATION
  useGSAP(() => {
    if (enableAudio === null) return;
    const forwardProps = {
      value: 1.2,
      duration: 3 * timeScale,
      ease: 'power2.in',
    }
    const toggleProps = {
      value: 0,
      duration: 2 * timeScale,
      ease: 'power2.out',
    };

    const hlConfig = {
      value: 1,
      duration: 4 * timeScale,
      paused: true,
      onUpdate: function() {
        const v = houseMatRef.current.uniforms.uReveal4.value;
        const c = color4Start.lerp(color4, v)
        houseLightsRef.current.color = c;
        groundMatRef.current.uniforms.uReveal4.value = v;
        groundMatRef.current.uniforms.uLight4Color.value = c;
        houseMatRef.current.uniforms.uLight4Color.value = c;
      }
    };
    const hl = gsap.to(houseMatRef.current.uniforms.uReveal4, hlConfig);

    const t1Config = {
      ...forwardProps,
      paused: true,
      onUpdate: function() {
        const v = tree1Ref.current.uniforms.uReveal.value;
        groundMatRef.current.uniforms.uReveal1.value = v;
        houseMatRef.current.uniforms.uReveal1.value = v;
      }
    };
    const t1 = gsap.to(tree1Ref.current.uniforms.uReveal, t1Config);

    const t2Config = {
      ...forwardProps,
      paused: true,
      onUpdate: function() {
        const v = tree2Ref.current.uniforms.uReveal.value;
        groundMatRef.current.uniforms.uReveal2.value = v;
        houseMatRef.current.uniforms.uReveal2.value = v;
      }
    };
    const t2 = gsap.to(tree2Ref.current.uniforms.uReveal, t2Config);

    const t3Config = {
      ...forwardProps,
      paused: true,
      onUpdate: function() {
        const v = tree3Ref.current.uniforms.uReveal.value;
        groundMatRef.current.uniforms.uReveal3.value = v;
        houseMatRef.current.uniforms.uReveal3.value = v;
      }
    };
    const t3 = gsap.to(tree3Ref.current.uniforms.uReveal, t3Config);
    
    gsap.timeline({
      delay: 1,
      //temp speedup
      autoRemoveChildren: true,
      //paused: true,
      onComplete: function() {
        setTimeout(() => {
          setAnimationComplete(true);
        }, 2000 * timeScale);
        aniReady.current = true;
        this.kill();
        reveal1Ref.current = gsap.to(tree1Ref.current.uniforms.uReveal, {...t1Config, ...toggleProps});
        reveal2Ref.current = gsap.to(tree2Ref.current.uniforms.uReveal, {...t2Config, ...toggleProps});
        reveal3Ref.current = gsap.to(tree3Ref.current.uniforms.uReveal, {...t3Config, ...toggleProps});
      }
    })
      .add(hl.play())
      .add(t3.play())
      .add(t2.play())
      .add(t1.play());  
  }, [enableAudio]);    

  // CONTROLS
  useControls(
    'Animation Toggles', {
      toggle1: {
        label: 'Tree 1',
        value: true,
        onChange: (value) => {
          if (!aniReady.current) return;
          if (value) {
            reveal1Ref.current.reverse();
          } else {
            reveal1Ref.current.play();
          }
        }
      },
      toggle2: {
        label: 'Tree 2',
        value: true,
        onChange: (value) => {
          if (!aniReady.current) return;
          if (value) {
            reveal2Ref.current.reverse();
          } else {
            reveal2Ref.current.play();
          }
        }
      },
      toggle3: {
        label: 'Tree 3',
        value: true,
        onChange: (value) => {
          if (!aniReady.current) return;
          if (value) {
            reveal3Ref.current.reverse();
          } else {
            reveal3Ref.current.play();
          }
        }
      },
    }, { collapsed: true }
  );
  const lConfig = useControls(
    'Light Controls', { 
      uLight1Strength: { value: 1.1, min: .2, max: 2, step: 0.001, label: 'Tree 1 Strength' },
      uLight2Strength: { value: 1.4, min: .2, max: 2, step: 0.001, label: 'Tree 2 Strength' },
      uLight3Strength: { value: .8, min: .2, max: 2, step: 0.001, label: 'Tree 3 Strength' }, 
      uLight4Strength: { value: 1, min: .2, max: 2, step: 0.001, label: 'House Strength' },
      uLight1Color: { 
        value: '#ffb721', label: 'Tree 1 Color',
        onChange: (value) => {
          color1.set(value);
          tree1Ref.current.uniforms.uColor.value = color1;
          groundMatRef.current.uniforms.uLight1Color.value = color1;
          houseMatRef.current.uniforms.uLight1Color.value = color1;
        } 
      },
      uLight2Color: { 
        value: '#7c7cff', label: 'Tree 2 Color',
        onChange: (value) => {
          color2.set(value);
          tree2Ref.current.uniforms.uColor.value = color2;
          groundMatRef.current.uniforms.uLight2Color.value = color2;
          houseMatRef.current.uniforms.uLight2Color.value = color2;
        } 
      },
      uLight3Color: { 
        value: '#ff54db', label: 'Tree 3 Color',
        onChange: (value) => {
          color3.set(value);
          tree3Ref.current.uniforms.uColor.value = color3;
          groundMatRef.current.uniforms.uLight3Color.value = color3;
          houseMatRef.current.uniforms.uLight3Color.value = color3;
        } 
      },
      uLight4Color: { 
        value: '#ff5454', label: 'House Color',
        onChange: (value) => {
          if (!aniReady.current) return;
          color4.set(value);
          groundMatRef.current.uniforms.uLight4Color.value = color4;
          houseMatRef.current.uniforms.uLight4Color.value = color4;
          houseLightsRef.current.color = color4;
        } 
      },
    }, { collapsed: true }
  );

  const uniforms = React.useMemo(() => ({
    uLight1Strength: lConfig.uLight1Strength,
    uLight2Strength: lConfig.uLight2Strength,
    uLight3Strength: lConfig.uLight3Strength,
    uLight4Strength: lConfig.uLight4Strength,
    uLight1Color: lConfig.uLight1Color,
    uLight2Color: lConfig.uLight2Color,
    uLight3Color: lConfig.uLight3Color,
    uLight4Color: lConfig.uLight4Color
  }), [lConfig]);

  useFrame((state, delta) => {
    if (tree1Ref.current && tree2Ref.current && tree3Ref.current) {
      tree1Ref.current.uniforms.uTime.value += delta;
      tree2Ref.current.uniforms.uTime.value += delta;
      tree3Ref.current.uniforms.uTime.value += delta
    }    
  });

  const { nodes } = useGLTF('/xmas.glb');
  const groundDarkBake = useTexture('/GroundDarkBake.webp');
  const groundLightBake = useTexture('/GroundLightBake1k.webp');
  groundDarkBake.flipY = false;
  groundLightBake.colorSpace = NoColorSpace;
  groundLightBake.flipY = false;

  const houseDarkBake = useTexture('/HouseDarkBake.webp');
  const houseLightBake = useTexture('/HouseLightBake1k.webp');
  const houseColorBake = useTexture('/HouseBakeColor.webp');
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

  const { nodes: hlNodes } = useGLTF('/houseLights.glb');

  React.useEffect(() => {
    setTree1Mat(tree1Ref.current);
    setTree2Mat(tree2Ref.current);
    setTree3Mat(tree3Ref.current);
    setHouseMat(houseMatRef.current);
    setGroundMat(groundMatRef.current);
  }, [setTree1Mat, setTree2Mat, setTree3Mat, setHouseMat, setGroundMat]);
  
  return (
    <>
    <React.Suspense fallback={null}>
      <AudioViz />
    </React.Suspense>
    <color attach="background" args={['#0D1424']} />
    <group position={[0, -2.5, 0]}>
      <group position={[0, .3, 0]}>
        <Tree ref={tree1Ref}
          scale={[.87, .95, .87]}
          uniforms={{
            uColor: [.7, 4, 0],
            uBrightness: lConfig.uLight1Strength * 5,
          }} 
        />
        <Tree 
          ref={tree2Ref} 
          scale={.7} 
          position={[5.3, 0, 1.3]} 
          uniforms={{
            uColor: [0, 2, 17],
            uBrightness: lConfig.uLight2Strength * 5,
          }} 
        />
        <Tree 
          ref={tree3Ref} 
          scale={.6} 
          position={[4.4, 0, -5.4]} 
          uniforms={{
            uColor: [7, 0, 0],
            uBrightness: lConfig.uLight3Strength * 5, 
          }} 
        />
      </group>
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

        <instancedMesh geometry={hlNodes.HouseLights.geometry} count={94} instanceMatrix={hlNodes.HouseLights.instanceMatrix} position={[-4.918, 0.89, -2.632]}>
          <meshBasicMaterial color="#000" ref={houseLightsRef} />
        </instancedMesh>
      </group>
      <Stars />
    </group>
    
    </>
  )
};




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
