/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 xmas.glb 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/xmas.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.House.geometry} material={nodes.House.material} position={[-5.705, 3.87, -5.5]} rotation={[Math.PI, -0.912, Math.PI]} />
      <mesh geometry={nodes.Ground.geometry} material={nodes.Ground.material} position={[-0.022, -0.463, -1.361]} />
    </group>
  )
}

useGLTF.preload('/xmas.glb')
