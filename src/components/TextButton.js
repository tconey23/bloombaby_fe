import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Box3, Vector3 } from 'three';
import { meshTransmissionMaterial, Html } from '@react-three/drei';
import './Text.css'

import Abril from '../assets/Abril Fatface_Regular.json';

extend({ TextGeometry });

export default function TextButton({ goToSeedSelector }) {
    const r = Math.PI / 180
    const textRef = useRef(null)
 
  const font = new FontLoader().parse(Abril);
  const textString = '';

  function handleClick() {
    console.log('inside hc')
    goToSeedSelector()
  }

  return (
        <mesh castShadow receiveShadow
          position={[-2.5,-2.5,-4.5]}
          rotation={[0, -Math.PI/2, 0]}
          renderOrder={0}
          depthTest={false}
          ref={textRef}
        >
          <Html transform><button className='select-new-seed-button' onClick={handleClick}>select a new seed</button></Html>
          <textGeometry args={[textString, { font, size: .5, depth: .2 }]} />
          <meshStandardMaterial color='cyan'/>
        </mesh>
  );
}
