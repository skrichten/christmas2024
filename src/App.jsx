import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import './App.css'

import { addEffect } from '@react-three/fiber';
import { gsap } from 'gsap';
import { Effects } from './components/Effects';
import { Scene } from './components/Scene';
import { OrbitControls } from '@react-three/drei';

gsap.ticker.remove(gsap.updateRoot);
addEffect((t) => {
  gsap.updateRoot(t / 1000);
});

const defaultGlProps = {
  powerPreference: "high-performance",
  alpha: false,
  flat: true,
};

function App() {

  return (
    <main>
      <div className="CanvasFS">
        <Canvas
          camera={{ fov: 35, position: [0, 0, 15], near: 0.05, far: 40 }}
          dpr={1}
          gl={defaultGlProps}
        >
          <Suspense fallback={null}>
            <OrbitControls />
            <Effects enabled={true} />
            <Scene />
          </Suspense>
        </Canvas>
      </div>          
    </main>
  )
}

export default App;
