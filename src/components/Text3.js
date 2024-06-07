import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Box3, Vector3 } from 'three';
import { meshTransmissionMaterial } from '@react-three/drei';
import { lerp } from 'three/src/math/MathUtils';

import Abril from '../assets/Abril Fatface_Regular.json';

extend({ TextGeometry });

export default function Text3() {
  const font = new FontLoader().parse(Abril);


  const groupRef = useRef();
  const progress = useRef(0);

  const easeOutCubic = (t) => (--t) * t * t + 1;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.y = 10;
    }
  }, []);

  useFrame(() => {
    progress.current += .005
    if (progress.current > 1) { progress.current = 1};

    const easedProgress = easeOutCubic(progress.current);

    if (groupRef.current) {
      const newPosition = lerp(10, 3, easedProgress);
      groupRef.current.position.y = newPosition;
    }
  });

  const textString = 'Select a flower to plant!';

  return (
    <group position={[-4,2,-1]} ref={groupRef}>
        <mesh castShadow receiveShadow >
          <textGeometry args={[textString, { font, size: .5, depth: .2 }]} />
          <meshStandardMaterial color='yellow'/>
        </mesh>
    </group>
  );
}
