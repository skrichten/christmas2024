import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import './App.css'

import { addEffect } from '@react-three/fiber';
import { gsap } from 'gsap';
import { Effects } from './components/Effects';
import { Scene } from './components/Scene';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';
import { useGeneralStore } from './store';
import { Smoke } from './components/Smoke';

gsap.ticker.remove(gsap.updateRoot);
addEffect((t) => {
  gsap.updateRoot(t / 1000);
});

const defaultGlProps = {
  powerPreference: "high-performance",
  alpha: true,
  flat: false,
};

function App() {
  const { animationComplete } = useGeneralStore();
  const { setEnableAudio } = useGeneralStore();

  const start = (audio) => {
    gsap.to('.introBg', { duration: 1, autoAlpha: 0, pointerEvents: 'none' });
    setEnableAudio(audio);
  }

  return (
    <main>
      <Leva hidden={!animationComplete} />
      <div className="CanvasFS">
        <Canvas
          camera={{ fov: 35, position: [-.3, .3, 15], near: 0.05, far: 70 }}
          dpr={1}
          gl={defaultGlProps}
        >
          <Suspense fallback={null}>
            <OrbitControls 
              enablePan={false} 
              minPolarAngle={1} 
              maxPolarAngle={1.67}
              minAzimuthAngle={-Math.PI / 3}
              maxAzimuthAngle={Math.PI / 5}
              minDistance={3} 
              maxDistance={24}
            />
            <Effects enabled={true} />
            <Scene />
            <Smoke position={[-3.43, 4., -8.56]} />
            <Smoke position={[-3.43, 4., -8.56]} rotation-y={1} />
          </Suspense>
        </Canvas>
      </div>
      <button className="buttonReset infoBtn" 
        onPointerOver={() => document.querySelector('.infoBox').classList.toggle('show')}
        onPointerOut={() => document.querySelector('.infoBox').classList.toggle('show')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="info-icon"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
      <div className="infoBox">
        <h1>Happy Holidays!</h1>
        <p>
          Hope you enjoy this cozy holiday scene.  When the animation is finished, 
          check out the controls in the top right. The animation toggles are pretty satisfying.
          There is some light audio-viz if you turn on the music.
          Standard mouse orbit controls apply.
        </p>
        <p>
          Music from <a target="_blank" href="https://uppbeat.io/t/soundroll/cozy-holidays">#Uppbeat</a>:<br/>          
          License code: FVW3UCW25WA7INCX
        </p>
      </div>
      <div className="introBg">
        <div className="intro">
          <button className="buttonReset startBtn" onClick={() => start(true)}>Start with audio</button>
          <button className="buttonReset startBtn" onClick={() => start(false)}>Start with no audio</button>
        </div>
      </div> 
    </main>
  )
}

export default App;
